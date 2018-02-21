from __future__ import unicode_literals


import datetime
from django.conf import settings
from django.utils.translation import ugettext_lazy

from django.db import models

class CommonFields(models.Model):
    created_by_user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="+")
    modified_by_user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="+", blank=True, null=True)
    deleted_by_user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="+", blank=True, null=True)
    created_timestamp = models.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = models.DateTimeField(blank=True, null=True)
    deleted_timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True

class DiscordInformation(models.Model):
    id = models.CharField(primary_key=True, max_length=250)
    username = models.TextField()
    discriminator = models.TextField()
    avatar = models.TextField()
    current_token = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'discord_information'
        verbose_name = ugettext_lazy('Discord Information')

class UserProfile(CommonFields):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True)
    discord_information = models.ForeignKey(DiscordInformation, blank=True, null=True)
    options_json = models.TextField(blank=True, default='{}')

    class Meta:
        db_table = 'user_profile'
        verbose_name = ugettext_lazy('User Profile')

class Group(CommonFields):
    name = models.TextField(blank=True, default='')
    url_name = models.TextField(blank=True, default='', unique=True)
    discord_server_identifier = models.TextField(blank=True, default='')
    discord_channel_identifier = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    category = models.TextField(blank=True, default='')
    options_json = models.TextField(blank=True, default='{}')
    permissions_json = models.TextField(blank=True, default='[]')

    class Meta:
        db_table = 'group'
        verbose_name = ugettext_lazy('Group')

class GroupMember(CommonFields):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    group = models.ForeignKey(Group)
    display_name = models.TextField()
    is_gm = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    class Meta:
        db_table = 'group_member'
        verbose_name = ugettext_lazy('Group Member')

class EventCategory(CommonFields):
    description = models.TextField()
    group = models.ForeignKey(Group)
    permissions_json = models.TextField(blank=True, default='[]')

    class Meta:
        db_table = 'event_category'
        verbose_name = ugettext_lazy('Event Category')

class Event(CommonFields):
    title = models.TextField()
    description = models.TextField(default='')
    group = models.ForeignKey(Group)
    event_category = models.ForeignKey(EventCategory)
    tags = models.TextField(blank=True, default='[]')
    extra_information = models.TextField(blank=True, default='{}')
    permissions_json = models.TextField(blank=True, default='[]')

    class Meta:
        db_table = 'event'
        verbose_name = ugettext_lazy('Event')

class Session(CommonFields):
    group = models.ForeignKey(Group)
    event = models.ForeignKey(Event)
    start_timestamp = models.DateTimeField()
    end_timestamp = models.DateTimeField()
    accepted_timestamp = models.DateTimeField(blank=True, null=True)
    rejected_timestamp = models.DateTimeField(blank=True, null=True)
    discord_message_identifier = models.TextField(blank=True, default='')
    discord_notification_identifier = models.TextField(blank=True, default='')
    permissions_json = models.TextField(blank=True, default='[]')

    class Meta:
        db_table = 'session'
        verbose_name = ugettext_lazy('Session')

class SessionAttendance(CommonFields):
    group_member = models.ForeignKey(GroupMember)
    session = models.ForeignKey(Session)
    tentative = models.BooleanField(default=False)

    class Meta:
        db_table = 'session_attendance'
        verbose_name = ugettext_lazy('Session Attendance')

