import datetime
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from awt.serializers import MeetingSerializer
from awt.models import Meeting, UserMeetingRelation
from awt.serializers import (
    LoginSerializer,
    RegisterSerializer,
    LoggedInUserSerializer,
    UserSerializer,
    MeetingSerializer,
    UserMeetingRelationSerializer,
)
from drf_spectacular.utils import extend_schema, OpenApiParameter
from collections import defaultdict


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()


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


@extend_schema(
    parameters=[
        OpenApiParameter(
            name="user_id",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Id of user",
            type=int,
            default="5",
        ),
        OpenApiParameter(
            name="duration",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Duration as minutes",
            type=int,
            default="35",
        ),
        OpenApiParameter(
            name="datetime",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Format %d.%m.%Y %H:%M:%S",
            default="29.06.2021 10:22:00",
        ),
    ],
)
class ValidateMeetingView(APIView):
    def get(self, request: Request):
        user_id = int(request.query_params.get("user_id"))
        proposed_duration = int(request.query_params.get("duration"))
        proposed_start_time = request.query_params.get("datetime")

        if None in [user_id, proposed_duration, proposed_start_time]:
            return Response(status=400)

        for relation in UserMeetingRelation.objects.all():
            if relation.user_id == user_id:
                planned_meeting = Meeting.objects.get(id=relation.meeting_id)
                planned_start = planned_meeting.start_time.replace(tzinfo=None)
                planned_end = (planned_start + planned_meeting.duration).replace(
                    tzinfo=None
                )
                proposed_start = datetime.datetime.strptime(
                    proposed_start_time, "%d.%m.%Y %H:%M:%S"
                )
                proposed_end = proposed_start + datetime.timedelta(
                    minutes=proposed_duration
                )

                if proposed_start < planned_end and planned_start < proposed_end:
                    return Response(
                        status=200,
                        data={"valid": False},
                        content_type="application/json",
                    )

        return Response(
            status=200, data={"valid": True}, content_type="application/json"
        )


@extend_schema(
    parameters=[
        OpenApiParameter(
            name="user_id",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Id of the user",
            type=int,
            default="1",
        ),
        OpenApiParameter(
            name="start_date",
            location=OpenApiParameter.QUERY,
            required=True,
            description="In format %d.%m.%Y",
            type=str,
            default="08.05.2023",
        ),
    ],
)
class CalculateTimeSpendWeekly(APIView):
    def get(self, request: Request):
        user_id = int(request.query_params.get("user_id"))
        start_date_value = request.query_params.get("start_date")

        if None in [user_id, start_date_value]:
            return Response(status=400)

        start_date = datetime.datetime.strptime(start_date_value, "%d.%m.%Y")
        end_date = start_date + datetime.timedelta(days=4)
        relations = UserMeetingRelation.objects.filter(
            user__id=user_id,
        )
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        data = defaultdict(lambda: 0)

        for relation in relations:
            meeting = relation.meeting
            meeting_time = meeting.start_time.replace(tzinfo=None)

            if start_date < meeting_time < end_date:
                weekday_number = meeting_time.weekday()
                data[weekdays[weekday_number]] += int(meeting.duration.seconds / 60)

        return Response(status=200, data=data, content_type="application/json")


@extend_schema(
    parameters=[
        OpenApiParameter(
            name="user_id",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Id of the user",
            type=int,
            default="1",
        ),
        OpenApiParameter(
            name="month",
            location=OpenApiParameter.QUERY,
            required=True,
            description="In numerical value, ex. May would be 5",
            type=int,
            default="5",
        ),
        OpenApiParameter(
            name="year",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Self explanatory",
            type=int,
            default="2023",
        ),
    ],
)
class CalculateTimeSpendMonthly(APIView):
    def get(self, request: Request):
        user_id = int(request.query_params.get("user_id"))
        month = int(request.query_params.get("month"))
        year = int(request.query_params.get("year"))

        if None in [user_id, month, year]:
            return Response(status=400)

        relations = UserMeetingRelation.objects.filter(
            meeting__start_time__month=month,
            meeting__start_time__year=year,
            user__id=user_id,
        )
        data = defaultdict(lambda: 0)

        for relation in relations:
            meeting = relation.meeting
            data[meeting.start_time.day] += int(meeting.duration.seconds / 60)

        return Response(status=200, data=data, content_type="application/json")


@extend_schema(
    parameters=[
        OpenApiParameter(
            name="user_id",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Id of the user",
            type=int,
            default="1",
        ),
        OpenApiParameter(
            name="year",
            location=OpenApiParameter.QUERY,
            required=True,
            description="Self explanatory",
            type=int,
            default="2023",
        ),
    ],
)
class CalculateTimeSpendYearly(APIView):
    def get(self, request: Request):
        user_id = int(request.query_params.get("user_id"))
        year = int(request.query_params.get("year"))

        if None in [user_id, year]:
            return Response(status=400)

        relations = UserMeetingRelation.objects.filter(
            meeting__start_time__year=year,
            user__id=user_id,
        )
        data = defaultdict(lambda: 0)

        for relation in relations:
            meeting = relation.meeting
            data[meeting.start_time.month] += int(meeting.duration.seconds / 60)

        return Response(status=200, data=data, content_type="application/json")
