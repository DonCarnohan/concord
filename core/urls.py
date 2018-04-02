from django.conf.urls import *
from django.views.generic import TemplateView

from core import views
from core.api import urls as api_urls

urlpatterns = [
    url(r'^api/', include(api_urls)),
    url(r'^(?P<request_type>(add|edit))/(?P<model>[\w-]+)(/(?P<model_id>\d+))?/?$', views.form, name='form'),
    url(r'^group/(?P<url_name>[\w-]+)/(?P<request_type>(add|edit))/(?P<model>[\w-]+)(/(?P<model_id>\d+))?/?$', views.form, name='form'),
    url(r'^group/(?P<url_name>[\w-]+)(/(?P<page_name>[\w-]+))?/?$', views.group_page, name='group_page'),
    url(r'^invite/((?P<code>[\w-]+)/)?$', views.invite, name='invite'),
    url(r'^login/?$', views.login, name='login'),
    url(r'^logout/?$', views.logout, name='logout'),
    url(r'^((?P<page>[\w-]+)/)?$', views.page, name='page'),
]
