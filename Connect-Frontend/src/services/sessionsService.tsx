import axios from 'axios'
import React from 'react'
import {GetSessionByQualificationAndTherepuetResponse} from '../contracts/sessions/GetSessionByQualificationAndTherepuetResponse';
import { store } from '../app/store';
import { GetClientSessionResponse } from '../contracts/sessions/GetClientSessionResponse';
import { GetTherepuetSessionResponse } from '../contracts/sessions/GetTherepuetSessionResponse';
import { ReservationRequest } from '../contracts/sessions/ReservationRequest';
import { NotesRequest } from '../contracts/sessions/NotesRequest';
import { CreateSessionRequest } from '../contracts/sessions/CreateSessionRequest';

axios.interceptors.request.use(function (config) {
	const token = store.getState().user.accessToken;
	if (!(config.headers && token)) return config;
	config.headers.Authorization =  `Bearer ${token}`;

	return config;
});

const API_URL = process.env.REACT_APP_BACKEND;

const qualificationUri = API_URL+ 'qualifications';
const sessionUri = API_URL+ 'sessions';
class SessionService {

	async getSessionsByQualificationAndTherepuet (qualificationId: number, thereputId: number): Promise<GetSessionByQualificationAndTherepuetResponse[]>
	{
		const response = await axios.get(`${qualificationUri}/${qualificationId}/therepuets/${thereputId}/sessions`, { headers: {} });
		return response.data;
	}
	async getSessionByQualificationAndTherepuet(qualificationId: number, thereputId: number,id: number): Promise<GetSessionByQualificationAndTherepuetResponse>
	{
		const uri = `${qualificationUri}/${qualificationId}/therepuets/${thereputId}/sessions/${id}`;
		const response = await axios.get(uri, { headers: {} });

		return response.data;
	}

	async getClientSessions (): Promise<GetClientSessionResponse[]>
	{
		try {
			const response = await axios.get(sessionUri, { headers: {} });
			return response.data;
		} catch (err) {
			return [];
		}
	}
	async getClientSession(sessionId: number): Promise<GetClientSessionResponse>
	{
		const uri = `${sessionUri}/${sessionId}`;
		const response = await axios.get(uri, { headers: {} });

		return response.data;
	}
	async CancelReservation(sessionId:number): Promise<string>{
		const params:ReservationRequest = {isReservation:false}
		let res =""
		try{
			const response = await axios.patch(`${sessionUri}/${sessionId}/reservation`, params, {headers:{'Content-Type': 'application/json'}});
			res = "Reservation canceled."
		}
		catch (err) {
		}
		return res
	}
	async MakeReservation(sessionId:number): Promise<string>{
		const params:ReservationRequest = {isReservation:true}
		let res =""
		try{
			const response = await axios.patch(`${sessionUri}/${sessionId}/reservation`, params, {headers:{'Content-Type': 'application/json'}});
			res = "Reservation made."
		}
		catch (err) {
		}
		return res
	}
	async getTherepuetSessions (): Promise<GetTherepuetSessionResponse[]>
	{
		try {
			const response = await axios.get(sessionUri, { headers: {} });
			return response.data;
		} catch (err) {
			return [];
		}
	}
	async getTherepuetSession(sessionId: number): Promise<GetTherepuetSessionResponse>
	{
		const uri = `${sessionUri}/${sessionId}`;
		const response = await axios.get(uri, { headers: {} });

		return response.data;
	}
	async updateNotes(sessionId:number, notes:string): Promise<string>{
		const params:NotesRequest = {notes:notes}
		let res =""
		try{
			const response = await axios.patch(`${sessionUri}/${sessionId}/note`, params, {headers:{'Content-Type': 'application/json'}});
			res = "Notes saved."
		}
		catch (err) {
		}
		return res
	}
	async deleteSession(sessionId:number): Promise<string>{
		let res =""
		try{
			const response = await axios.delete(`${sessionUri}/${sessionId}`,{ headers: {} });
			res = "Session deleted."
		}
		catch (err) {
		}
		return res
	}
	async createSession(params: CreateSessionRequest): Promise<string>{
		let res =""
		try{
			const response = await axios.post(sessionUri, params, {headers:{'Content-Type': 'application/json'}});
			res = "Session created."
		}
		catch (err) {
		}
		return res
	}
}
export default new SessionService ();