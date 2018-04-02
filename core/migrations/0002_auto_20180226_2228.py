# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-02-26 22:28
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='InviteCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('code', models.TextField(default='')),
                ('valid_until_timestamp', models.DateTimeField()),
                ('created_by_user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('deleted_by_user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Invite Code',
                'db_table': 'invite_code',
            },
        ),
        migrations.AddField(
            model_name='group',
            name='category',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='group',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='group',
            name='home_page_markdown',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='group',
            name='url_name',
            field=models.CharField(blank=True, default='', max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='group',
            name='name',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterModelTable(
            name='group',
            table='user_group',
        ),
        migrations.AddField(
            model_name='invitecode',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group'),
        ),
        migrations.AddField(
            model_name='invitecode',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
    ]
