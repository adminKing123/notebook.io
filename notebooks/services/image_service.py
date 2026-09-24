import uuid
from pathlib import PurePosixPath

from cdn.assets.image_converter import ImageConversionError
from cdn.assets.upload_service import AssetUploadService
from cdn.exceptions import CDNError
from notebooks.models import Image


class ImageServiceError(Exception):
    pass


class ImageService:
    def __init__(self, *, asset_upload_service: AssetUploadService | None = None):
        self.asset_upload_service = asset_upload_service or AssetUploadService()

    def upload_image(self, *, owner, image_file, namespace: str) -> Image:
        try:
            asset = self.asset_upload_service.upload_image(
                image_file.read(),
                namespace=namespace,
                filename_prefix=f'image-{uuid.uuid4().hex}',
            )
        except ImageConversionError as error:
            raise ImageServiceError(str(error)) from error
        except CDNError as error:
            raise ImageServiceError('Unable to upload image. Please try again.') from error

        file_name = PurePosixPath(asset.key).name

        return Image.objects.create(
            owner=owner,
            url=asset.url,
            file_name=file_name,
        )
