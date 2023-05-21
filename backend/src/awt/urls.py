"""awt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from awt.views import (
    MeetingViewSet,
    LoginView,
    RegisterView,
    CurrentUserView,
    UsersViewSet,
    ValidateMeetingView,
    CalculateTimeSpendWeekly,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


router = routers.DefaultRouter()
router.register(r"meeting", MeetingViewSet)
router.register(r"users", UsersViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-docs",
    ),
    path("api/login/", LoginView.as_view()),
    path("api/register/", RegisterView.as_view()),
    path("api/whoami/", CurrentUserView.as_view()),
    path("api/validate_meeting", ValidateMeetingView.as_view()),
    path("api/meetings_duration/weekly", CalculateTimeSpendWeekly.as_view()),
]
