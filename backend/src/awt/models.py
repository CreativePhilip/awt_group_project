from django.db import models
from django.contrib.auth.models import User


class Meeting(models.Model):
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    note = models.TextField(blank=True)
    start_time = models.DateTimeField()
    duration = models.DurationField()
    is_private = models.BooleanField()
    is_cancelled = models.BooleanField()
    cancellation_reason = models.TextField(default="", blank=True)

    @property
    def total_minutes(self) -> int:
        return self.duration.total_seconds() // 60


class UserMeetingRelation(models.Model):
    meeting = models.ForeignKey(
        Meeting,
        related_name="participants",
        on_delete=models.CASCADE,
    )
    is_owner = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
