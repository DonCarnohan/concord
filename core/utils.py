import datetime
from django.db.models import signals

from core.models import CommonFields

class UserContext():
    def __init__(self, user):
        self.user = user
    def __enter__(self):
        signals.pre_save.connect(self._mark_user_fields, dispatch_uid=self.SIGNAL_PRE_SAVE_UID, weak=False)
    def __exit__(self, type, value, traceback):
        signals.pre_save.disconnect(dispatch_uid=self.SIGNAL_PRE_SAVE_UID)
    def _mark_user_fields(self, sender, instance, **kwargs):
        if isinstance(instance, CommonFields):
            if instance.created_by_user_id is None:
                instance.created_by_user_id = self.user.id
                instance.created_timestamp = datetime.datetime.now()
            if instance.modified_by_user_id != self.user.id:
                instance.created_by_user_id = self.user.id
                instance.modified_timestamp = datetime.datetime.now()
    SIGNAL_PRE_SAVE_UID = (_mark_user_fields,)

def field_from_request(request, field, default=None):
    return request.GET.get(field, request.POST.get(field, request.query_params.get(field, request.data.get(field, default))))
