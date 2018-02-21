from rest_framework import viewsets, permissions, filters, generics
from rest_framework.response import Response

from core.api.serializers import *
from core.api.pagination import *
from core import models

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    model = models.Session
    queryset = models.Session.objects.fitler(deleted_by_user_id=None).select_related("group")
    serializer_class = SessionSerializer
    pagination_class = NoPagination
    filter_fields = (
        "group__id",
        "start_timestamp",
        "end_timestamp"
    )