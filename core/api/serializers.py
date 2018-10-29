import json

from core import models
from core.utils import field_from_request
from django.contrib.auth.models import User
from rest_framework import serializers

class RequestGroupDefault(object):
    def set_context(self, serializer_field):
        self.group = models.Group.objects.get(id=field_from_request(serializer_field.context['request'], 'group_id'))

    def __call__(self):
        return self.group

    def __repr__(self):
        return unicode_to_repr('%s()' % self.__class__.__name__)

# class ForeignKeyModelSerializer(serializers.ModelSerializer):
#     def create(self, validated_data):
#         new_object = self._meta.model.create(**validated_data)
#         return new_object


class LightGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = (
            'id',
            'name',
            'url_name',
            'discord_server_identifier',
            'discord_channel_identifier',
            'description',
        )

class GroupSerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = models.Group
        fields = (
            'id',
            'name',
            'url_name',
            'discord_server_identifier',
            'discord_channel_identifier',
            'description',
            'home_page_markdown',
            'options_json',
            'is_member',
            'permissions',
        )

    def get_is_member(self, group):
        return group.has_member(self.context['request'].user)

    def get_permissions(self, group):
        user_permissions = []
        permissions = json.loads(group.permissions_json)
        user_id = self.context['request'].user.id
        for key, value in permissions.items():
            if user_id in value:
                user_permissions.append(key)
        if user_id == group.created_by_user_id:
            user_permissions.append("all");
        return user_permissions

    def validate_url_name(self, value):
        if value:
            value.upper()
        return value
    def validate_options_json(self, value):
        try:
            json.loads(value)
        except ValueError as e:
            raise serializers.ValidationError("Not valid json.")
        return value
    def validate_permissions_json(self, value):
        try:
            json.loads(value)
        except ValueError as e:
            raise serializers.ValidationError("Not valid json.")
        return value


class GroupMemberSerializer(serializers.ModelSerializer):
    group = LightGroupSerializer()
    class Meta:
        model = models.GroupMember
        fields = (
            'user_id',
            'group_id',
            'display_name',
            'is_gm',
            'is_admin',
        )
class LightSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Session
        fields = (
            'id',
            'start_timestamp',
            'end_timestamp',
            'group',
            'group_id',
        )

class LightSessionAttendanceSerializer(serializers.ModelSerializer):
    group_member = GroupMemberSerializer()
    class Meta:
        model = models.Session
        fields = (
            'id',
            'group_member',
            'tentative',
            'session_id',
        )

class EventCategorySerializer(serializers.ModelSerializer):
    group = LightGroupSerializer(read_only=True)
    group_id = serializers.IntegerField()
    class Meta:
        model = models.EventCategory
        fields = (
            'id',
            'description',
            'group',
            'group_id',
        )

class EventSerializer(serializers.ModelSerializer):
    event_category = EventCategorySerializer(read_only=True)
    event_category_id = serializers.IntegerField()
    group = LightGroupSerializer(read_only=True)
    group_id = serializers.IntegerField()
    options = serializers.SerializerMethodField()
    class Meta:
        model = models.Event
        fields = (
            'id',
            'title',
            'description',
            'tags',
            'event_category',
            'event_category_id',
            'group',
            'group_id',
            'options',
        )
    def get_options(self, event):
        return {}

class SessionSerializer(serializers.ModelSerializer):
    sessionattenance_set = LightSessionAttendanceSerializer(many=True, read_only=True)
    event = EventSerializer(read_only=True)
    event_id = serializers.IntegerField()
    group = LightGroupSerializer(read_only=True)
    group_id = serializers.IntegerField()
    start_timestamp = serializers.DateTimeField(input_formats=('%m/%d/%Y %H:%M %p',))
    end_timestamp = serializers.DateTimeField(input_formats=('%m/%d/%Y %H:%M %p',))
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = models.Session
        fields = (
            'id',
            'event',
            'event_id',
            'sessionattenance_set',
            'start_timestamp',
            'end_timestamp',
            'group',
            'group_id',
            'permissions',
        )
    def get_permissions(self, session):
        user_permissions = []
        permissions = json.loads(session.permissions_json)
        user_id = self.context['request'].user.id
        for key, value in permissions.items():
            if user_id in value:
                user_permissions.append(key)
        if user_id == session.created_by_user_id:
            user_permissions.append("all");
        return user_permissions

class SessionAttendanceSerializer(serializers.ModelSerializer):
    session = LightSessionSerializer()
    class Meta:
        model = models.Session
        fields = (
            'id',
            'group_member',
            'tentative',
            'session_id',
        )

