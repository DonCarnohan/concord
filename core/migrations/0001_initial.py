# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-03 21:50
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0008_alter_user_username_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiscordInformation',
            fields=[
                ('id', models.CharField(max_length=250, primary_key=True, serialize=False)),
                ('username', models.TextField()),
                ('discriminator', models.TextField()),
                ('avatar', models.TextField()),
                ('current_token', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'discord_information',
                'verbose_name': 'Discord Information',
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('title', models.TextField()),
                ('description', models.TextField(default='')),
                ('tags', models.TextField(blank=True, default='[]')),
                ('extra_information', models.TextField(blank=True, default='{}')),
                ('permissions_json', models.TextField(blank=True, default='[]')),
            ],
            options={
                'db_table': 'event',
                'verbose_name': 'Event',
            },
        ),
        migrations.CreateModel(
            name='EventCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('description', models.TextField()),
                ('permissions_json', models.TextField(blank=True, default='[]')),
            ],
            options={
                'db_table': 'event_category',
                'verbose_name': 'Event Category',
            },
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('name', models.TextField()),
                ('discord_server_identifier', models.TextField(blank=True, default='')),
                ('discord_channel_identifier', models.TextField(blank=True, default='')),
                ('options_json', models.TextField(blank=True, default='{}')),
                ('permissions_json', models.TextField(blank=True, default='[]')),
            ],
            options={
                'db_table': 'group',
                'verbose_name': 'Group',
            },
        ),
        migrations.CreateModel(
            name='GroupMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('display_name', models.TextField()),
                ('is_gm', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'group_member',
                'verbose_name': 'Group Member',
            },
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('start_timestamp', models.DateTimeField()),
                ('end_timestamp', models.DateTimeField()),
                ('accepted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('rejected_timestamp', models.DateTimeField(blank=True, null=True)),
                ('discord_message_identifier', models.TextField(blank=True, default='')),
                ('discord_notification_identifier', models.TextField(blank=True, default='')),
                ('permissions_json', models.TextField(blank=True, default='[]')),
            ],
            options={
                'db_table': 'session',
                'verbose_name': 'Session',
            },
        ),
        migrations.CreateModel(
            name='SessionAttendance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('tentative', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'session_attendance',
                'verbose_name': 'Session Attendance',
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('created_timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('modified_timestamp', models.DateTimeField(blank=True, null=True)),
                ('deleted_timestamp', models.DateTimeField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('options_json', models.TextField(blank=True, default='{}')),
                ('created_by_user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('deleted_by_user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('discord_information', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.DiscordInformation')),
                ('modified_by_user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_profile',
                'verbose_name': 'User Profile',
            },
        ),
        migrations.AddField(
            model_name='sessionattendance',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sessionattendance',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sessionattendance',
            name='group_member',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.GroupMember'),
        ),
        migrations.AddField(
            model_name='sessionattendance',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sessionattendance',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Session'),
        ),
        migrations.AddField(
            model_name='session',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='session',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='session',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Event'),
        ),
        migrations.AddField(
            model_name='session',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group'),
        ),
        migrations.AddField(
            model_name='session',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupmember',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupmember',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupmember',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group'),
        ),
        migrations.AddField(
            model_name='groupmember',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupmember',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='eventcategory',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='eventcategory',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='eventcategory',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group'),
        ),
        migrations.AddField(
            model_name='eventcategory',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='created_by_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='deleted_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='event_category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.EventCategory'),
        ),
        migrations.AddField(
            model_name='event',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Group'),
        ),
        migrations.AddField(
            model_name='event',
            name='modified_by_user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
    ]
