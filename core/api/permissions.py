import json
from rest_framework import permissions
from django.core.exceptions import FieldDoesNotExist

from core import models
from core.utils import field_from_request

ALL_METHODS = ["POST", "PUT", "PATCH", "CREATE", "GET",]
EDIT_METHODS = ["POST", "PUT", "PATCH",]
CREATE_METHODS = ["POST", "CREATE",]
READ_METHODS = ["GET",]


class JsonPermission(permissions.BasePermission):
    message = "You don't have permission to do that."
    def __init__(self, permission="edit", methods=EDIT_METHODS):
        self.permission = permission
        self.methods = methods
        
    def __call__(self):
        return self

    def has_object_permission(self, request, view, obj):
        if request.method in EDIT_METHODS:
            has_permission = False
            # if isinstance(obj, models.CommonFields) and request.user == obj.created_by_user:
            #     return True
            permissions_json = None
            try:
                if obj._meta.get_field("permissions_json"):
                    permissions_json = obj.permissions_json
            except FieldDoesNotExist:
                pass

            if permissions_json:
              permissions = json.loads(permissions_json)
              has_permission = request.user.id in permissions.get("edit", [])
              if not has_permission:
                    for key in request.POST:
                        if key != "id":
                            has_permission = request.user.id in permissions.get("edit:"+key, [])

            return has_permission
        elif request.method in ["DELETE",]:
            return True
        else: #Other permissions should be handled in another class
            return True

class GroupJsonPermission(permissions.BasePermission):
    message = "You don't have permission to do that."

    def __init__(self, permission, methods=CREATE_METHODS):
        self.permission = permission
        self.methods = methods
    def __call__(self):
        return self

    def has_permission(self, request, view):
        if request.method in self.methods:
            group_id = field_from_request(request, "group_id")
            try:
                group = models.Group.objects.get(id=group_id)
            except models.Group.DoesNotExist as e:
                return False
            has_permission = False
            permissions = json.loads(group.permissions_json)
            has_permission = request.user.id in permissions.get(self.permission, [])

            return has_permission
        elif request.method in ["DELETE",]:
            return True
        else: #Other permissions should be handled in another class
            return True

class GroupMemberPermission(permissions.BasePermission):
    message = "You're not a member of that group."

    def has_object_permission(self, request, view, obj):
        if request.method == "GET":
            return True
        return True
