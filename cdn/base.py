from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class StoredAsset:
    key: str
    url: str
    content_type: str
    size: int


class CDNClient(ABC):
    @abstractmethod
    def upload(self, *, key: str, content: bytes, content_type: str) -> StoredAsset:
        raise NotImplementedError

    @abstractmethod
    def delete(self, key: str) -> None:
        raise NotImplementedError
