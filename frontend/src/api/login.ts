import axios from "axios";
import {User} from "./models/user";

export const login = async (username: string, password: string): Promise<object | null> => {
    try {
        await axios.post("/api/login/", {username, password})
        return null
    } catch (e) {
     return e as object;
    }
}



export const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
        await axios.post("/api/register/", {username, email, password})
        return true
    } catch {
        return false
    }
}


export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await axios.get("/api/whoami/")
        return response.data
    } catch {
        return null
    }
}