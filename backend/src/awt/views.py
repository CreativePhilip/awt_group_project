from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from awt.serializers import MeetingSerializer
from awt.models import Meeting
from awt.serializers import LoginSerializer, RegisterSerializer, LoggedInUserSerializer


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingViewSet
    queryset = Meeting.objects.all()
    
class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()
    def post(self, request: Request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, **serializer.validated_data)
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