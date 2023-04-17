from rest_framework import serializers
from awt.models import Meeting, UserMeetingRelation
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]


class UserMeetingRelationSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserMeetingRelation
        fields = [
            "is_owner",
            "user",
        ]


class MeetingSerializer(serializers.ModelSerializer):
    participants = UserMeetingRelationSerializer(many=True)

    class Meta:
        model = Meeting
        fields = [
            "title",
            "description",
            "note",
            "start_time",
            "duration",
            "is_private",
            "is_cancelled",
            "cancellation_reason",
            "participants",
        ]
