import uuid
from pathlib import PurePosixPath

from cdn.assets.image_converter import ImageConversionError, normalize_image
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
            normalized = normalize_image(
                image_file.read(),
                self.asset_upload_service.settings,
            )
            asset = self.asset_upload_service.upload_normalized_image(
                normalized,
                namespace=namespace,
                filename_prefix=f'image-{uuid.uuid4().hex}',
            )
        except ImageConversionError as error:
            raise ImageServiceError(str(error)) from error
        except CDNError as error:
            raise ImageServiceError('Unable to upload image. Please try again.') from error

        file_name = PurePosixPath(asset.key).name
        aspect_ratio = normalized.width / normalized.height if normalized.height else 1.0

        return Image.objects.create(
            owner=owner,
            url=asset.url,
            file_name=file_name,
            width=normalized.width,
            height=normalized.height,
            aspect_ratio=aspect_ratio,
        )
