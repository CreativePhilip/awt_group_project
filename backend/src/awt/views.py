from datetime import timedelta, datetime, time
import calendar

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from awt.models import Meeting, UserMeetingRelation
from awt.serializers import (
    LoginSerializer,
    RegisterSerializer,
    LoggedInUserSerializer,
    UserSerializer,
    MeetingSerializer,
    CreateMeetingSerializer, MeetingsByDateSerializer,
)
from drf_spectacular.utils import extend_schema, OpenApiParameter
from collections import defaultdict

from awt.utils import get_week_bounds_from_date, filter_meetings_by_weekday


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()

    def create(self, request: Request, **kwargs):
        serializer = CreateMeetingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        meeting = Meeting.objects.create(
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            note="",
            start_time=serializer.validated_data["start_time"],
            duration=timedelta(minutes=serializer.validated_data["duration"]),
            is_private=True,
            is_cancelled=False,
            cancellation_reason="",
        )

        UserMeetingRelation.objects.create(
            meeting=meeting,
            is_owner=True,
            user=request.user,
        )

        for participant in serializer.validated_data["participants"]:
            UserMeetingRelation.objects.create(
                meeting=meeting,
                is_owner=False,
                user_id=participant,
            )

        return Response(status=200)

    @action(methods=["get"], detail=False, url_path="by_date")
    def list_by_date(self, request: Request):
        value = datetime.fromisoformat(request.query_params.get("date"))
        start_date, end_date = get_week_bounds_from_date(value)

        # TODO: filter also by users
        queryset = self.queryset.filter(start_time__gte=start_date)

        final_meetings = [
            meeting
            for meeting in queryset
            if meeting.start_time + meeting.duration <= end_date
        ]

        meetings_by_day = {
            "monday": filter_meetings_by_weekday(final_meetings, 0),
            "tuesday": filter_meetings_by_weekday(final_meetings, 1),
            "wednesday": filter_meetings_by_weekday(final_meetings, 2),
            "thursday": filter_meetings_by_weekday(final_meetings, 3),
            "friday": filter_meetings_by_weekday(final_meetings, 4)
        }

        data = {
            key: self.serializer_class(value, many=True).data
            for key, value in meetings_by_day.items()
        }
        return Response(data, status=200)


class AccountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()


class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def list(self, request: Request, *args, **kwargs):
        query = request.query_params.get("q")

        if not query:
            return Response(status=200, data=[])

        users = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query))[:3]
        out_serializer = self.serializer_class(users, many=True)
        data = out_serializer.data

        return Response(status=200, data=data)


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
                planned_end = (planned_start + planned_meeting.duration).replace(tzinfo=None)
                proposed_start = datetime.fromisoformat(proposed_start_time).replace(tzinfo=None)
                proposed_end = proposed_start + timedelta(minutes=proposed_duration)

                if proposed_start < planned_end and planned_start < proposed_end:
                    return Response(
                        status=200,
                        data={"valid": False},
                        content_type="application/json",
                    )

        return Response(
            status=200,
            data={"valid": True},
            content_type="application/json",
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

        start_date = datetime.strptime(start_date_value, "%d.%m.%Y")
        end_date = start_date + timedelta(days=4)
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
            month_name = calendar.month_name[meeting.start_time.month]
            data[month_name] += int(meeting.duration.seconds / 60)

        return Response(status=200, data=data, content_type="application/json")
