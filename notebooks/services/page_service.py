from django.db import transaction
from django.db.models import F

from notebooks.constants import DEFAULT_PAGE_WINDOW_SIZE
from notebooks.models import Notebook, NotebookPage, default_page_config
from notebooks.services.window import calculate_page_window
from notebooks.utils.content import sanitize_page_content
from notebooks.utils.page_config import sanitize_page_config


class PageServiceError(Exception):
    pass


class PageService:
    def get_owned_notebook(self, *, notebook_id, user) -> Notebook:
        notebook = Notebook.objects.filter(id=notebook_id, owner=user).first()
        if notebook is None:
            raise PageServiceError('Notebook not found.')
        return notebook

    def get_owned_page(self, *, notebook_id, page_id, user) -> NotebookPage:
        page = (
            NotebookPage.objects.select_related('notebook')
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
            content='',
            config=default_page_config(),
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
        page.content = sanitize_page_content(payload.get('content', page.content))

        if 'config' in payload:
            page.config = sanitize_page_config(
                payload['config'],
                owner=page.notebook.owner,
            )

        page.save(update_fields=['heading', 'subheading', 'content', 'config', 'updated_at'])
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
            content='',
            config=default_page_config(),
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

    def _sanitize_line(self, value) -> str:
        return str(value or '')[:255]
