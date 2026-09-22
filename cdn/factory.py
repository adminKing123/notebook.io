from cdn.backends.github import GitHubCDNBackend
from cdn.base import CDNClient
from config.config import CDNSettings, load_cdn_settings


def get_cdn_client(settings: CDNSettings | None = None) -> CDNClient:
    resolved_settings = settings or load_cdn_settings()

    if resolved_settings.provider == 'github':
        return GitHubCDNBackend.from_settings(resolved_settings)

    raise ValueError(f'Unsupported CDN provider: {resolved_settings.provider}')
