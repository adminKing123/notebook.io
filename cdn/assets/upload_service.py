import uuid
from pathlib import PurePosixPath

from cdn.assets.image_converter import NormalizedImage, normalize_image
from cdn.base import CDNClient, StoredAsset
from config.config import CDNSettings, load_cdn_settings
from cdn.factory import get_cdn_client


class AssetUploadService:
    def __init__(
        self,
        *,
        cdn_client: CDNClient | None = None,
        settings: CDNSettings | None = None,
    ):
        self.settings = settings or load_cdn_settings()
        self.cdn_client = cdn_client or get_cdn_client(self.settings)

    def upload_image(
        self,
        content: bytes,
        *,
        namespace: str,
        filename_prefix: str | None = None,
        crop_center_square: bool = False,
    ) -> StoredAsset:
        normalized = normalize_image(
            content,
            self.settings,
            crop_center_square=crop_center_square,
        )
        return self.upload_normalized_image(
            normalized,
            namespace=namespace,
            filename_prefix=filename_prefix,
        )

    def upload_normalized_image(
        self,
        normalized: NormalizedImage,
        *,
        namespace: str,
        filename_prefix: str | None = None,
    ) -> StoredAsset:
        asset_name = filename_prefix or uuid.uuid4().hex
        asset_key = str(
            PurePosixPath(self.settings.uploads_folder)
            / namespace
            / f'{asset_name}.{normalized.extension}'
        )

        return self.cdn_client.upload(
            key=asset_key,
            content=normalized.data,
            content_type=normalized.content_type,
        )
