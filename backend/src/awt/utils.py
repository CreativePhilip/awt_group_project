from datetime import datetime, date, timedelta
from typing import Iterable

from awt.models import Meeting


def get_week_bounds_from_date(value: datetime) -> tuple[date, date]:
    start = value - timedelta(days=value.weekday())
    end = start + timedelta(days=6)

    return start, end


def filter_meetings_by_weekday(meetings: Iterable[Meeting], weekday: int) -> Iterable[Meeting]:
    return [meeting for meeting in meetings if meeting.start_time.weekday() == weekday]