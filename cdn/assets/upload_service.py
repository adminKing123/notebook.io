import uuid
from pathlib import PurePosixPath

from cdn.assets.image_converter import normalize_image
from cdn.base import CDNClient, StoredAsset
from cdn.config import CDNSettings, load_cdn_settings
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
    ) -> StoredAsset:
        normalized = normalize_image(content, self.settings)
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
