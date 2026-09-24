import uuid

from django.conf import settings
from django.db import models


class NotebookAccess(models.TextChoices):
    PUBLIC = 'public', 'Public'
    PRIVATE = 'private', 'Private'
    SHARED = 'shared', 'Shared'


def default_page_config():
    return {'embedded_images': []}


class Notebook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notebooks',
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    access = models.CharField(
        max_length=20,
        choices=NotebookAccess.choices,
        default=NotebookAccess.PRIVATE,
    )
    thumbnail_url = models.URLField(blank=True)
    page_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['owner', '-updated_at']),
        ]

    def __str__(self):
        return self.title


class NotebookPage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notebook = models.ForeignKey(
        Notebook,
        on_delete=models.CASCADE,
        related_name='pages',
    )
    page_number = models.PositiveIntegerField()
    heading = models.CharField(max_length=255, blank=True)
    subheading = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True, default='')
    config = models.JSONField(default=default_page_config, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_number']
        constraints = [
            models.UniqueConstraint(
                fields=['notebook', 'page_number'],
                name='unique_notebook_page_number',
            ),
        ]
        indexes = [
            models.Index(fields=['notebook', 'page_number']),
        ]

    def __str__(self):
        return f'{self.notebook.title} · page {self.page_number}'


class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notebook_images',
    )
    url = models.URLField()
    file_name = models.CharField(max_length=255)
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)
    aspect_ratio = models.FloatField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', '-created_at']),
        ]

    def __str__(self):
        return self.file_name
