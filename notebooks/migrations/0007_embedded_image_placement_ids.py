import uuid

from django.db import migrations


def add_embedded_placement_ids(apps, schema_editor):
    NotebookPage = apps.get_model('notebooks', 'NotebookPage')

    for page in NotebookPage.objects.iterator():
        config = page.config if isinstance(page.config, dict) else {}
        embedded_images = config.get('embedded_images', [])
        if not isinstance(embedded_images, list):
            continue

        changed = False
        updated_embedded = []

        for item in embedded_images:
            if not isinstance(item, dict):
                continue

            if not item.get('id'):
                item = {**item, 'id': str(uuid.uuid4())}
                changed = True

            updated_embedded.append(item)

        if changed:
            page.config = {**config, 'embedded_images': updated_embedded}
            page.save(update_fields=['config'])


class Migration(migrations.Migration):

    dependencies = [
        ('notebooks', '0006_image_dimensions'),
    ]

    operations = [
        migrations.RunPython(add_embedded_placement_ids, migrations.RunPython.noop),
    ]
