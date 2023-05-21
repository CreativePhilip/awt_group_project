from datetime import timedelta

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from awt.serializers import MeetingSerializer
from awt.models import Meeting
from awt.serializers import (
    LoginSerializer,
    RegisterSerializer,
    LoggedInUserSerializer,
    UserSerializer,
    MeetingSerializer,
    CreateMeetingSerializer,
)


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()

    def create(self, request: Request, **kwargs):
        serializer = CreateMeetingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        Meeting.objects.create(
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            note="",
            start_time=serializer.validated_data["start_time"],
            duration=timedelta(minutes=serializer.validated_data["duration"]),
            is_private=True,
            is_cancelled=False,
            cancellation_reason="",
        )

        return Response(status=200)


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingViewSet
    queryset = Meeting.objects.all()



class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
   
  
class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request: Request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, **serializer.validated_data)
        print(request.data, user)
        if user:
            login(request, user)
            return Response(status=204)

        return Response(status=404)


class RegisterView(APIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request: Request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        User.objects.create_user(**serializer.validated_data)
        return Response(status=204)


class CurrentUserView(APIView):
    serializer_class = LoggedInUserSerializer

    def get(self, request: Request):
        serializer = LoggedInUserSerializer(request.user)
        return Response(serializer.data)
