import uuid

from django.db import transaction
from django.db.models import F

from cdn.assets.image_converter import ImageConversionError
from cdn.assets.upload_service import AssetUploadService
from cdn.exceptions import CDNError
from notebooks.constants import DEFAULT_PAGE_WINDOW_SIZE, MAX_CONTENT_LINES, MAX_LINE_LENGTH
from notebooks.models import Notebook, NotebookPage, NotebookPageImage
from notebooks.services.window import calculate_page_window


class PageServiceError(Exception):
    pass


class PageService:
    def __init__(self, *, asset_upload_service: AssetUploadService | None = None):
        self.asset_upload_service = asset_upload_service or AssetUploadService()

    def get_owned_notebook(self, *, notebook_id, user) -> Notebook:
        notebook = Notebook.objects.filter(id=notebook_id, owner=user).first()
        if notebook is None:
            raise PageServiceError('Notebook not found.')
        return notebook

    def get_owned_page(self, *, notebook_id, page_id, user) -> NotebookPage:
        page = (
            NotebookPage.objects.select_related('notebook')
            .prefetch_related('images')
            .filter(id=page_id, notebook_id=notebook_id, notebook__owner=user)
            .first()
        )
        if page is None:
            raise PageServiceError('Page not found.')
        return page

    @transaction.atomic
    def ensure_initial_page(self, notebook: Notebook) -> None:
        if notebook.page_count > 0:
            return

        NotebookPage.objects.create(
            notebook=notebook,
            page_number=1,
            heading='',
            subheading='',
            content=[''] * MAX_CONTENT_LINES,
        )
        notebook.page_count = 1
        notebook.save(update_fields=['page_count', 'updated_at'])

    def get_page_window(
        self,
        *,
        notebook: Notebook,
        center_page: int,
        window_size: int = DEFAULT_PAGE_WINDOW_SIZE,
    ) -> dict:
        self.ensure_initial_page(notebook)
        notebook.refresh_from_db(fields=['page_count'])

        start_page, end_page = calculate_page_window(
            center_page=center_page,
            total_pages=notebook.page_count,
            window_size=window_size,
        )

        pages = (
            NotebookPage.objects.filter(
                notebook=notebook,
                page_number__gte=start_page,
                page_number__lte=end_page,
            )
            .prefetch_related('images')
            .order_by('page_number')
        )

        return {
            'total_pages': notebook.page_count,
            'center_page': min(max(center_page, 1), notebook.page_count),
            'window': {
                'start': start_page,
                'end': end_page,
                'size': window_size,
            },
            'pages': list(pages),
        }

    @transaction.atomic
    def save_page(self, *, page: NotebookPage, payload: dict) -> NotebookPage:
        page.heading = self._sanitize_line(payload.get('heading', page.heading))
        page.subheading = self._sanitize_line(payload.get('subheading', page.subheading))
        page.content = self._sanitize_content(payload.get('content', page.content))
        page.save(update_fields=['heading', 'subheading', 'content', 'updated_at'])

        if 'images' in payload:
            self._sync_page_images(page, payload['images'])

        page.notebook.save(update_fields=['updated_at'])
        return page

    @transaction.atomic
    def create_page(self, *, notebook: Notebook) -> NotebookPage:
        self.ensure_initial_page(notebook)
        notebook.refresh_from_db(fields=['page_count'])

        next_page_number = notebook.page_count + 1
        page = NotebookPage.objects.create(
            notebook=notebook,
            page_number=next_page_number,
            heading='',
            subheading='',
            content=[''] * MAX_CONTENT_LINES,
        )
        Notebook.objects.filter(id=notebook.id).update(
            page_count=F('page_count') + 1,
            updated_at=page.created_at,
        )
        notebook.refresh_from_db(fields=['page_count'])
        return page

    @transaction.atomic
    def delete_page(self, *, page: NotebookPage) -> None:
        notebook = page.notebook
        if notebook.page_count <= 1:
            raise PageServiceError('A notebook must contain at least one page.')

        deleted_page_number = page.page_number
        page.delete()

        remaining_pages = NotebookPage.objects.filter(
            notebook=notebook,
            page_number__gt=deleted_page_number,
        ).order_by('page_number')

        for remaining_page in remaining_pages:
            remaining_page.page_number -= 1
            remaining_page.save(update_fields=['page_number'])

        notebook.page_count = max(notebook.page_count - 1, 0)
        notebook.save(update_fields=['page_count', 'updated_at'])

    def upload_page_image(self, *, page: NotebookPage, image_file) -> NotebookPageImage:
        try:
            asset = self.asset_upload_service.upload_image(
                image_file.read(),
                namespace=f'notebooks/{page.notebook_id}/pages/{page.id}',
                filename_prefix=f'image-{uuid.uuid4().hex}',
            )
        except ImageConversionError as error:
            raise PageServiceError(str(error)) from error
        except CDNError as error:
            raise PageServiceError('Unable to upload image. Please try again.') from error

        image = NotebookPageImage.objects.create(
            page=page,
            url=asset.url,
        )
        page.notebook.save(update_fields=['updated_at'])
        return image

    def _sync_page_images(self, page: NotebookPage, images_payload: list) -> None:
        existing_images = {str(image.id): image for image in page.images.all()}
        retained_ids = set()

        for image_data in images_payload:
            image_id = str(image_data.get('id', ''))
            existing_image = existing_images.get(image_id)

            if existing_image is None:
                url = image_data.get('url')
                if not url:
                    continue

                created = NotebookPageImage.objects.create(
                    page=page,
                    url=url,
                    x=float(image_data.get('x', 0)),
                    y=float(image_data.get('y', 0)),
                    width=float(image_data.get('width', 30)),
                    aspect_ratio=float(image_data.get('aspect_ratio', 1)),
                )
                retained_ids.add(str(created.id))
                continue

            existing_image.x = float(image_data.get('x', existing_image.x))
            existing_image.y = float(image_data.get('y', existing_image.y))
            existing_image.width = float(image_data.get('width', existing_image.width))
            existing_image.aspect_ratio = float(
                image_data.get('aspect_ratio', existing_image.aspect_ratio),
            )

            if image_data.get('url'):
                existing_image.url = image_data['url']

            existing_image.save(
                update_fields=['x', 'y', 'width', 'aspect_ratio', 'url', 'updated_at'],
            )
            retained_ids.add(image_id)

        for image_id, image in existing_images.items():
            if image_id not in retained_ids:
                image.delete()

    def _sanitize_line(self, value) -> str:
        return str(value or '')[:255]

    def _sanitize_content(self, value) -> list[str]:
        if not isinstance(value, list):
            return [''] * MAX_CONTENT_LINES

        sanitized = [str(line or '')[:MAX_LINE_LENGTH] for line in value[:MAX_CONTENT_LINES]]
        if len(sanitized) < MAX_CONTENT_LINES:
            sanitized.extend([''] * (MAX_CONTENT_LINES - len(sanitized)))

        return sanitized
