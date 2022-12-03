import axios from 'axios'
import React from 'react'
import { CreateHomeWorkRequest } from '../contracts/homework/CreateHomeworkRequest';
import { GetHomeWorkResponse } from '../contracts/homework/GetHomeWorkResponse';
import {GetQualificationResponse} from '../contracts/qualification/GetQualificationResponse';
axios.interceptors.request.use(function (config) {
	const token = "";//store.getState().user.token;
	if (!(config.headers && token)) return config;
	config.headers.Authorization =  `Bearer ${token}`;

	return config;
});

const API_URL = process.env.REACT_APP_BACKEND;

const sessionUri = API_URL+ 'sessions';

class HomeWorkService {

	async getHomeWorks (sessionId:number): Promise<GetHomeWorkResponse[]>
	{
		try {
			const uri = `${sessionUri}/${sessionId}/homeworks`;
			const response = await axios.get(uri, { headers: {} });
			return response.data;
		} catch (err) {
			return [];
		}
	}
	async getHomeWork (sessionId:number, homeworkId:number): Promise<GetHomeWorkResponse|null>
	{
		try {
			const uri = `${sessionUri}/${sessionId}/homeworks/${homeworkId}`;
			const response = await axios.get(uri, { headers: {} });
			return response.data;
		} catch (err) {
			return null;
		}
	}
	async createHomeWork (sessionId:number, params: CreateHomeWorkRequest): Promise<string>
	{
		try {
			const uri = `${sessionUri}/${sessionId}/homeworks`;
			const response = await axios.post(uri, params, {headers:{'Content-Type': 'application/json'}});
			return "Homework created";
		} catch (err) {
			return "";
		}
	}
	async deleteHomeWork (sessionId:number, homeworkId: number): Promise<string>
	{
		try {
			const uri = `${sessionUri}/${sessionId}/homeworks/${homeworkId}`;
			const response = await axios.delete(uri, { headers: {} });
			return "Homework deleted";
		} catch (err) {
			return "";
		}
	}
	async updateHomeWork (sessionId:number, homeworkId:number, params: CreateHomeWorkRequest): Promise<string>
	{
		try {
			const uri = `${sessionUri}/${sessionId}/homeworks/${homeworkId}`;
			const response = await axios.put(uri, params, {headers:{'Content-Type': 'application/json'}});
			return "Homework created";
		} catch (err) {
			return "";
		}
	}
}
export default new HomeWorkService ();