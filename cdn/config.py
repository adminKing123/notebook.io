import os
from dataclasses import dataclass


@dataclass(frozen=True)
class CDNSettings:
    provider: str
    uploads_folder: str
    public_base_url: str
    github_username: str
    github_repo: str
    github_branch: str
    github_token: str
    image_format: str
    image_max_width: int
    image_quality: int


def load_cdn_settings() -> CDNSettings:
    username = os.getenv('CDN_GITHUB_USERNAME') or os.getenv('GITHUB1_USERNAME', '')
    repo = os.getenv('CDN_GITHUB_REPO') or os.getenv('GITHUB1_REPO_NAME', '')
    branch = os.getenv('CDN_GITHUB_BRANCH') or os.getenv('GITHUB1_BRANCH_NAME', 'main')
    token = os.getenv('CDN_GITHUB_TOKEN') or os.getenv('GITHUB1_TOKEN', '')
    uploads_folder = (
        os.getenv('CDN_UPLOADS_FOLDER')
        or os.getenv('GITHUB1_UPLOADS_FOLDER', 'uploads')
    ).strip('/')

    public_base_url = os.getenv('CDN_PUBLIC_BASE_URL', '').rstrip('/')
    if not public_base_url and username and repo and branch:
        public_base_url = (
            f'https://raw.githubusercontent.com/{username}/{repo}/{branch}'
        )

    return CDNSettings(
        provider=os.getenv('CDN_PROVIDER', 'github').lower(),
        uploads_folder=uploads_folder,
        public_base_url=public_base_url,
        github_username=username,
        github_repo=repo,
        github_branch=branch,
        github_token=token,
        image_format=os.getenv('CDN_IMAGE_FORMAT', 'WEBP').upper(),
        image_max_width=int(os.getenv('CDN_IMAGE_MAX_WIDTH', '1200')),
        image_quality=int(os.getenv('CDN_IMAGE_QUALITY', '85')),
    )
