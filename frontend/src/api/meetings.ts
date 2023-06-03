import axios from "axios";
import {Meeting} from "./models/meeting";
import {User} from "./models/user";

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