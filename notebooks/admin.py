from django.contrib import admin

from notebooks.models import Image, Notebook, NotebookPage


class NotebookPageInline(admin.TabularInline):
    model = NotebookPage
    extra = 0
    show_change_link = True


@admin.register(Notebook)
class NotebookAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'access', 'page_count', 'updated_at')
    list_filter = ('access', 'created_at')
    search_fields = ('title', 'owner__email', 'owner__full_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [NotebookPageInline]


@admin.register(NotebookPage)
class NotebookPageAdmin(admin.ModelAdmin):
    list_display = ('notebook', 'page_number', 'heading', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('heading', 'notebook__title')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'owner', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('file_name', 'owner__email', 'owner__full_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
