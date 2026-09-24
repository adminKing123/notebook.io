from django.db import migrations, models

from notebooks.utils.content import sanitize_page_content


def convert_content_arrays_to_text(apps, schema_editor):
    NotebookPage = apps.get_model('notebooks', 'NotebookPage')

    for page in NotebookPage.objects.all().iterator():
        page.content = sanitize_page_content(page.content)
        page.save(update_fields=['content'])


class Migration(migrations.Migration):
    dependencies = [
        ('notebooks', '0002_notebookpage_notebookpageimage_and_more'),
    ]

    operations = [
        migrations.RunPython(convert_content_arrays_to_text, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='notebookpage',
            name='content',
            field=models.TextField(blank=True, default=''),
        ),
    ]
