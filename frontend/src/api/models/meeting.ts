import {User} from "./user";

export type Meeting = {
    id: number
    title: string
    description: string
    note: string
    start_time: Date
    total_minutes: number
    is_private: boolean
    is_cancelled: boolean
    cancellation_reason: string
    participants: User[]
}