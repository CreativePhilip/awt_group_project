import axios from "axios";
import {User} from "./models/user";

export const searchUsers = async (q: string): Promise<User[]> => {
    const response = await axios.get("/api/users/", {params: {q}})

    return response.data
}