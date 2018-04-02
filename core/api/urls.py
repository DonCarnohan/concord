from django.conf.urls import url, include
from rest_framework import routers
from core.api import views

router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet, base_name="group")
router.register(r'sessions', views.SessionViewSet, base_name="session")
router.register(r'events', views.EventViewSet, base_name="event")
router.register(r'event-categories', views.EventCategoryViewSet, base_name="event-category")


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
