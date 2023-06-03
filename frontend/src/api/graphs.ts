import axios from "axios";
import { AxiosResponse } from "axios";

export const getMonthlyData = async (month: number, year: number, user_id: number): Promise<AxiosResponse | null> => {
    try {
        return await axios.get("/api/meetings_duration/monthly", {params: {user_id, month, year}});
    } catch (e) {
     return null;
    }
}

export const getWeeklyData = async (start_date: string, user_id: number): Promise<AxiosResponse | null> => {
    try {
        return await axios.get("/api/meetings_duration/weekly", {params: {start_date, user_id}});
    } catch (e) {
     return null;
    }
}

export const getYearlyData = async (year: number, user_id: number): Promise<AxiosResponse | null> => {
    try {
        return await axios.get("/api/meetings_duration/yearly", {params: {user_id, year}});
    } catch (e) {
     return null;
    }
}