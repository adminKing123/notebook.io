import base64
import json
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

from cdn.base import CDNClient, StoredAsset
from cdn.config import CDNSettings
from cdn.exceptions import CDNError


class GitHubCDNBackend(CDNClient):
    API_ROOT = 'https://api.github.com'

    def __init__(self, settings: CDNSettings):
        self.settings = settings

    @classmethod
    def from_settings(cls, settings: CDNSettings) -> 'GitHubCDNBackend':
        return cls(settings)

    def upload(self, *, key: str, content: bytes, content_type: str) -> StoredAsset:
        self._validate_configuration()
        normalized_key = key.lstrip('/')
        encoded_content = base64.b64encode(content).decode('ascii')
        payload = {
            'message': f'Upload asset {normalized_key}',
            'content': encoded_content,
            'branch': self.settings.github_branch,
        }

        response = self._request(
            method='PUT',
            path=(
                f'/repos/{self.settings.github_username}/'
                f'{self.settings.github_repo}/contents/{quote(normalized_key, safe="/")}'
            ),
            payload=payload,
        )
        asset_url = self._resolve_public_url(normalized_key, response)

        return StoredAsset(
            key=normalized_key,
            url=asset_url,
            content_type=content_type,
            size=len(content),
        )

    def delete(self, key: str) -> None:
        self._validate_configuration()
        normalized_key = key.lstrip('/')
        existing = self._request(
            method='GET',
            path=(
                f'/repos/{self.settings.github_username}/'
                f'{self.settings.github_repo}/contents/{quote(normalized_key, safe="/")}'
            ),
            params={'ref': self.settings.github_branch},
        )

        payload = {
            'message': f'Delete asset {normalized_key}',
            'sha': existing['sha'],
            'branch': self.settings.github_branch,
        }
        self._request(
            method='DELETE',
            path=(
                f'/repos/{self.settings.github_username}/'
                f'{self.settings.github_repo}/contents/{quote(normalized_key, safe="/")}'
            ),
            payload=payload,
        )

    def _validate_configuration(self) -> None:
        missing = [
            name
            for name, value in {
                'CDN_GITHUB_USERNAME': self.settings.github_username,
                'CDN_GITHUB_REPO': self.settings.github_repo,
                'CDN_GITHUB_BRANCH': self.settings.github_branch,
                'CDN_GITHUB_TOKEN': self.settings.github_token,
            }.items()
            if not value
        ]

        if missing:
            raise CDNError(f'Missing CDN configuration: {", ".join(missing)}')

    def _resolve_public_url(self, key: str, response: dict) -> str:
        content = response.get('content') or {}
        download_url = content.get('download_url')
        if download_url:
            return download_url

        if self.settings.public_base_url:
            return f'{self.settings.public_base_url}/{key}'

        raise CDNError('Unable to resolve a public URL for the uploaded asset.')

    def _request(self, *, method: str, path: str, payload: dict | None = None, params: dict | None = None):
        query = ''
        if params:
            query = '?' + '&'.join(
                f'{quote(str(key))}={quote(str(value))}'
                for key, value in params.items()
            )

        url = f'{self.API_ROOT}{path}{query}'
        data = None
        headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': f'Bearer {self.settings.github_token}',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'personaldiary-cdn',
        }

        if payload is not None:
            data = json.dumps(payload).encode('utf-8')
            headers['Content-Type'] = 'application/json'

        request = Request(url, data=data, headers=headers, method=method)

        try:
            with urlopen(request, timeout=30) as response:
                body = response.read().decode('utf-8')
                return json.loads(body) if body else {}
        except HTTPError as error:
            detail = error.read().decode('utf-8', errors='ignore')
            raise CDNError(f'CDN upload failed ({error.code}): {detail}') from error
