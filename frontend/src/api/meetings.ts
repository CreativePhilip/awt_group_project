import axios from "axios";
import {Meeting} from "./models/meeting";

export async function createMeeting(data: object) {
    const response = await axios.post("/api/meeting/", data)
}

export async function listMeetings(): Promise<Meeting[]> {
    const response = await axios.get("/api/meeting/")
    return response.data
}