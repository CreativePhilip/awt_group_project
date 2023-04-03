from django.db import models
from django.contrib.auth.models import User


class Meeting(models.Model):
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    note = models.TextField(blank=True)
    start_time = models.DateTimeField()
    duration = models.TimeField()
    is_private = models.BooleanField()
    is_cancelled = models.BooleanField()
    cancellation_reason: models.TextField()


class UserMeetingRelation(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    is_owner = models.BooleanField
    user = models.ForeignKey(User, on_delete=models.CASCADE)