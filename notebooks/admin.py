from django.contrib import admin

from notebooks.models import Notebook


@admin.register(Notebook)
class NotebookAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'access', 'page_count', 'updated_at')
    list_filter = ('access', 'created_at')
    search_fields = ('title', 'owner__email', 'owner__full_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
