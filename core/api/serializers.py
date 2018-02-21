from core import models
from django.contrib.auth.models import User
from rest_framework import serializers

class LightGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GroupMember
        fields = (
            'name',
            'options_json',
            'permissions_json',
        )

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


class SessionSerializer(serializers.ModelSerializer):
    sessionattenance_set = LightSessionAttendanceSerializer(many=True)
    class Meta:
        model = models.Session
        fields = (
            'id',
            'start_timestamp',
            'end_timestamp',
        )

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

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = (
            'name',
            'url_name',
            'discord_server_identifier',
            'discord_channel_identifier',
            'options_json',
            'permissions_json',
        )