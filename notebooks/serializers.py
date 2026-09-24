from rest_framework import serializers

from notebooks.models import Notebook, NotebookAccess, NotebookPage, NotebookPageImage


class NotebookPageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotebookPageImage
        fields = ['id', 'url', 'x', 'y', 'width', 'aspect_ratio']


class NotebookPageImageWriteSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    url = serializers.URLField(required=False, allow_blank=True)
    x = serializers.FloatField(required=False)
    y = serializers.FloatField(required=False)
    width = serializers.FloatField(required=False)
    aspect_ratio = serializers.FloatField(required=False)


class NotebookPageSerializer(serializers.ModelSerializer):
    images = NotebookPageImageSerializer(many=True, read_only=True)

    class Meta:
        model = NotebookPage
        fields = [
            'id',
            'page_number',
            'heading',
            'subheading',
            'content',
            'images',
            'updated_at',
        ]


class SaveNotebookPageSerializer(serializers.Serializer):
    heading = serializers.CharField(required=False, allow_blank=True, max_length=255)
    subheading = serializers.CharField(required=False, allow_blank=True, max_length=255)
    content = serializers.CharField(required=False, allow_blank=True)
    images = NotebookPageImageWriteSerializer(many=True, required=False)


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
