import { GetTherepuetResponse } from "../therepuet/GetTherepuetResponse"

export type GetClientSessionResponse = {
    id: number,
    startTime: Date,
    durationInMinutes: number,
    therepuet: GetTherepuetResponse 
}