from rest_framework import serializers
from awt.models import Meeting, UserMeetingRelation
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


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
            "id",
            "title",
            "description",
            "note",
            "start_time",
            "total_minutes",
            "is_private",
            "is_cancelled",
            "cancellation_reason",
            "participants",
        ]


class MeetingsByDateSerializer(serializers.Serializer):
    monday = MeetingSerializer(many=True)
    tuesday = MeetingSerializer(many=True)
    wednesday = MeetingSerializer(many=True)
    thursday = MeetingSerializer(many=True)
    friday = MeetingSerializer(many=True)


class CreateMeetingSerializer(serializers.ModelSerializer):
    duration = serializers.IntegerField()
    participants = serializers.ListSerializer(child=serializers.IntegerField())

    class Meta:
        model = Meeting
        fields = [
            "title",
            "description",
            "start_time",
            "duration",
            "participants",
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password"]


class LoggedInUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "id"]
