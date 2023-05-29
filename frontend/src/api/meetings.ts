import axios from "axios";
import {Meeting, MeetingsByWeekday} from "./models/meeting";

export async function createMeeting(data: object) {
    const response = await axios.post("/api/meeting/", data)
}

export async function listMeetings(): Promise<Meeting[]> {
    const response = await axios.get("/api/meeting/")
    return response.data
}

export async function addMeetingNote(meetingId: number, data: object) {
    try {
        return await axios.patch(`/api/meeting/${meetingId}/`, data);
    } catch (e) {
     return null;
    }
}



export async function listMeetingsInWeek(date: Date): Promise<MeetingsByWeekday> {
    const response = await axios.get("/api/meeting/by_date/", {params: {date}})
    return response.data
}