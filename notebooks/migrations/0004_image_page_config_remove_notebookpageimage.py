import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def default_page_config():
    return {'embedded_images': []}


def migrate_page_images_to_config(apps, schema_editor):
    NotebookPage = apps.get_model('notebooks', 'NotebookPage')
    NotebookPageImage = apps.get_model('notebooks', 'NotebookPageImage')
    Image = apps.get_model('notebooks', 'Image')

    for page in NotebookPage.objects.select_related('notebook').iterator():
        embedded = []
        for old_image in NotebookPageImage.objects.filter(page=page).order_by('created_at'):
            file_name = old_image.url.rsplit('/', 1)[-1]
            image = Image.objects.create(
                id=old_image.id,
                owner_id=page.notebook.owner_id,
                url=old_image.url,
                file_name=file_name,
                created_at=old_image.created_at,
                updated_at=old_image.updated_at,
            )
            embedded.append({
                'image_id': str(image.id),
                'x': old_image.x,
                'y': old_image.y,
                'width': old_image.width,
                'aspect_ratio': old_image.aspect_ratio,
            })

        if embedded:
            page.config = {'embedded_images': embedded}
            page.save(update_fields=['config'])


class Migration(migrations.Migration):

    dependencies = [
        ('notebooks', '0003_alter_notebookpage_content'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.URLField()),
                ('file_name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notebook_images', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='notebookpage',
            name='config',
            field=models.JSONField(blank=True, default=default_page_config),
        ),
        migrations.RunPython(migrate_page_images_to_config, migrations.RunPython.noop),
        migrations.DeleteModel(
            name='NotebookPageImage',
        ),
        migrations.AddIndex(
            model_name='image',
            index=models.Index(fields=['owner', '-created_at'], name='notebooks_i_owner_i_6f0f0a_idx'),
        ),
    ]
