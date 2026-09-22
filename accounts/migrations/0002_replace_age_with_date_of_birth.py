from datetime import date

from django.db import migrations, models


def migrate_age_to_date_of_birth(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    today = date.today()

    for user in User.objects.all().iterator():
        age = getattr(user, 'age', None)
        if age:
            try:
                user.date_of_birth = today.replace(year=today.year - age)
            except ValueError:
                user.date_of_birth = today.replace(year=today.year - age, day=28)
        else:
            user.date_of_birth = today.replace(year=today.year - 18)
        user.save(update_fields=['date_of_birth'])


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(null=True),
        ),
        migrations.RunPython(migrate_age_to_date_of_birth, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='user',
            name='age',
        ),
        migrations.AlterField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(),
        ),
    ]
