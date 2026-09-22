import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / '.env')


def _parse_csv_env(name: str, default: str = '') -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


@dataclass(frozen=True)
class AppSettings:
    secret_key: str
    debug: bool
    allowed_hosts: list[str]
    cors_allowed_origins: list[str]
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_app_password: str
    default_from_email: str
    otp_expiry_minutes: int


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


def load_app_settings() -> AppSettings:
    smtp_user = os.getenv('SMTP_USER', '')

    return AppSettings(
        secret_key=os.getenv('SECRET_KEY', 'django-insecure-change-me'),
        debug=os.getenv('DEBUG', 'True').lower() == 'true',
        allowed_hosts=_parse_csv_env('ALLOWED_HOSTS', 'localhost,127.0.0.1'),
        cors_allowed_origins=_parse_csv_env(
            'CORS_ALLOWED_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173',
        ),
        smtp_host=os.getenv('SMTP_HOST', 'smtp.gmail.com'),
        smtp_port=int(os.getenv('SMTP_PORT', '587')),
        smtp_user=smtp_user,
        smtp_app_password=os.getenv('SMTP_APP_PASSWORD', ''),
        default_from_email=os.getenv('DEFAULT_FROM_EMAIL', smtp_user),
        otp_expiry_minutes=int(os.getenv('OTP_EXPIRY_MINUTES', '10')),
    )


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
