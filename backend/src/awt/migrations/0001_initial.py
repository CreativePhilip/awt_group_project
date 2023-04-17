# Generated by Django 4.1.5 on 2023-04-17 19:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True)),
                ('note', models.TextField(blank=True)),
                ('start_time', models.DateTimeField()),
                ('duration', models.TimeField()),
                ('is_private', models.BooleanField()),
                ('is_cancelled', models.BooleanField()),
                ('cancellation_reason', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='UserMeetingRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_owner', models.BooleanField(default=False)),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='awt.meeting')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
