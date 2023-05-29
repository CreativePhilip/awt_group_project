import axios from "axios";
import {User} from "./models/user";

export const searchUsers = async (q: string): Promise<User[]> => {
    const response = await axios.get("/api/users/", {params: {q}})

    return response.data
}


export const checkMeetingConflicts = async (uid: number | string, date: Date, duration: number): Promise<boolean> => {
    const params = {
        user_id: uid,
        datetime: date,
        duration,
    }
    const response = await axios.get("/api/validate_meeting/", {params})

    return ! response.data.valid
}