from rest_framework import serializers

from notebooks.models import Image, Notebook, NotebookAccess, NotebookPage
from notebooks.utils.page_config import resolve_page_config


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'url', 'file_name', 'width', 'height', 'aspect_ratio']


class EmbeddedImageWriteSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    image_id = serializers.UUIDField()
    x = serializers.FloatField(required=False)
    y = serializers.FloatField(required=False)
    width = serializers.FloatField(required=False)
    aspect_ratio = serializers.FloatField(required=False)


class PageConfigWriteSerializer(serializers.Serializer):
    embedded_images = EmbeddedImageWriteSerializer(many=True, required=False)


class NotebookPageSerializer(serializers.ModelSerializer):
    config = serializers.SerializerMethodField()

    class Meta:
        model = NotebookPage
        fields = [
            'id',
            'page_number',
            'heading',
            'subheading',
            'content',
            'config',
            'updated_at',
        ]

    def get_config(self, page: NotebookPage):
        return resolve_page_config(page)


class SaveNotebookPageSerializer(serializers.Serializer):
    heading = serializers.CharField(required=False, allow_blank=True, max_length=255)
    subheading = serializers.CharField(required=False, allow_blank=True, max_length=255)
    content = serializers.CharField(required=False, allow_blank=True, trim_whitespace=False)
    config = PageConfigWriteSerializer(required=False)


class NotebookPageWindowSerializer(serializers.Serializer):
    total_pages = serializers.IntegerField()
    center_page = serializers.IntegerField()
    window = serializers.DictField()
    pages = NotebookPageSerializer(many=True)


class NotebookSerializer(serializers.ModelSerializer):
    page_count = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    owned_by = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Notebook
        fields = [
            'id',
            'title',
            'description',
            'access',
            'thumbnail_url',
            'page_count',
            'created_at',
            'updated_at',
            'owned_by',
        ]


class CreateNotebookSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    access = serializers.ChoiceField(choices=NotebookAccess.choices)
    thumbnail = serializers.ImageField(required=False, allow_null=True)

    def validate_title(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError('Notebook title is required.')
        return cleaned
