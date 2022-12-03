import { GetTherepuetResponse } from "../therepuet/GetTherepuetResponse"
import { User } from "../User"

export type GetTherepuetSessionResponse = {
    id: number,
    startTime: Date,
    durationInMinutes: number,
    notes: string,
    client: User 
}