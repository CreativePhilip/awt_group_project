# Generated by Django 4.1.5 on 2023-05-14 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('awt', '0002_alter_meeting_cancellation_reason'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting',
            name='duration',
            field=models.DurationField(),
        ),
    ]
