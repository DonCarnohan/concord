from django.conf.urls import *
from django.views.generic import TemplateView

from core import views

urlpatterns = [
    url(r'^(?P<request_type>(add|edit))/(?P<model>[\w-]+)(/(?P<model_id>\d+))?/?$', views.form, name='form'),
    url(r'^group/(?P<page>[\w-]+)/?$', views.page, name='group_page'),
    url(r'^((?P<page>[\w-]+)/)?$', views.page, name='page'),
]
