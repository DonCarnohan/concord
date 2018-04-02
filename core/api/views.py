from rest_framework import viewsets, permissions, filters, generics, mixins, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect

from core.api.serializers import *
from core.api.pagination import *
from core.api.permissions import JsonPermission
from core import models
from core.utils import UserContext, field_from_request

class BaseModelViewset(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        with UserContext(request.user):
            return super(BaseModelViewset, self).create(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        with UserContext(request.user):
            return super(BaseModelViewset, self).update(request, *args, **kwargs)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_by_user_id = request.user.id
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionViewSet(BaseModelViewset):
    model = models.Session
    permission_classes = (IsAuthenticated, JsonPermission,)
    serializer_class = SessionSerializer
    pagination_class = NoPagination
    filter_fields = (
        "group__id",
        "start_timestamp",
        "end_timestamp",
    )

    def get_queryset(self):
        queryset = models.Session.objects.filter(deleted_by_user_id=None).select_related("group")

        return queryset

class EventCategoryViewSet(BaseModelViewset):
    model = models.EventCategory
    permission_classes = (IsAuthenticated, JsonPermission,)
    serializer_class = EventCategorySerializer
    pagination_class = NoPagination
    filter_fields = (
        "group__id",
    )

    def get_queryset(self):
        queryset = models.EventCategory.objects.filter(deleted_by_user_id=None).select_related("group")

        return queryset

class EventViewSet(BaseModelViewset):
    model = models.Event
    permission_classes = (IsAuthenticated, JsonPermission,)
    serializer_class = EventSerializer
    pagination_class = NoPagination
    filter_fields = (
        "group__id",
    )

    def get_queryset(self):
        queryset = models.Event.objects.filter(deleted_by_user_id=None).select_related("group")

        return queryset

class GroupViewSet(BaseModelViewset):
    model = models.Group
    permission_classes = (IsAuthenticated, JsonPermission(),)
    serializer_class = GroupSerializer
    pagination_class = NoPagination
    filter_fields = (
        "id",
        "url_name",
        "is_member",
    )

    def get_queryset(self):
        queryset = models.Group.objects.filter(deleted_by_user_id=None)
        if field_from_request(self.request, "is_member"):
            queryset.filter(groupmember__user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        with UserContext(request.user):
            return super(BaseModelViewset, self).create(request, *args, **kwargs)

    @detail_route(methods=['get', 'post'])
    def join(self, request, pk=None):
        group = self.get_object()
        allowed = False
        if field_from_request(request, "invite_code"):
            if models.InviteCode.filter(group=group, code=field_from_request(request, "invite_code")).exists():
                allowed = True
        elif group.created_by_user == request.user:
            allowed = True
        if allowed:
            if not group.has_member(request.user):
                with UserContext(request.user):
                    new_member = models.GroupMember(
                        user=request.user,
                        group=group,
                        display_name=request.user.username,
                    )
                    new_member.save()
            return redirect('/group/'+group.url_name)
        else:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        # serializer = PasswordSerializer(data=request.data)
        # if serializer.is_valid():
        #     user.set_password(serializer.data['password'])
        #     user.save()
        #     return Response({'status': 'password set'})
        # else:
        #     

