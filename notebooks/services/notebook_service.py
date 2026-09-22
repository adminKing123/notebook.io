import uuid

from cdn.assets.image_converter import ImageConversionError
from cdn.assets.upload_service import AssetUploadService
from cdn.exceptions import CDNError
from notebooks.models import Notebook


class NotebookServiceError(Exception):
    pass


class NotebookService:
    def __init__(self, *, asset_upload_service: AssetUploadService | None = None):
        self.asset_upload_service = asset_upload_service or AssetUploadService()

    def create_notebook(
        self,
        *,
        owner,
        title: str,
        description: str,
        access: str,
        thumbnail_file=None,
    ) -> Notebook:
        thumbnail_url = ''

        if thumbnail_file is not None:
            thumbnail_url = self._upload_thumbnail(owner_id=owner.id, thumbnail_file=thumbnail_file)

        return Notebook.objects.create(
            owner=owner,
            title=title,
            description=description,
            access=access,
            thumbnail_url=thumbnail_url,
        )

    def _upload_thumbnail(self, *, owner_id, thumbnail_file) -> str:
        try:
            asset = self.asset_upload_service.upload_image(
                thumbnail_file.read(),
                namespace=f'notebooks/{owner_id}',
                filename_prefix=f'thumbnail-{uuid.uuid4().hex}',
            )
        except ImageConversionError as error:
            raise NotebookServiceError(str(error)) from error
        except CDNError as error:
            raise NotebookServiceError('Unable to upload thumbnail. Please try again.') from error

        return asset.url
