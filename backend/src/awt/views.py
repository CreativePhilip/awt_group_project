from rest_framework import viewsets
from awt.serializers import MeetingSerializer
from rest_framework.response import Response
from awt.models import Meeting
from django.shortcuts import get_object_or_404


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingViewSet
    queryset = Meeting.objects.all()
