from rest_framework import serializers

from notebooks.models import Notebook, NotebookAccess


class NotebookSerializer(serializers.ModelSerializer):
    full_description = serializers.CharField(source='description', read_only=True)
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
            'full_description',
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
