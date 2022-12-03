import axios, { AxiosError } from 'axios'
import React from 'react'
import { GetTherepuetResponse } from '../contracts/therepuet/GetTherepuetResponse';

axios.interceptors.request.use(function (config) {
	const token = "";//store.getState().user.token;
	if (!(config.headers && token)) return config;
	config.headers.Authorization =  `Bearer ${token}`;

	return config;
});

const API_URL = process.env.REACT_APP_BACKEND;

const therepuetsUri = API_URL+ 'qualifications';

class TherepuetService {

	async getTherepuets (qualificationId:number): Promise<GetTherepuetResponse[]>
	{
        try {
			const response = await (await axios.get(`${therepuetsUri}/${qualificationId}/therepuets`, { headers: {} }));
			return response.data;
		} catch (err) {
			return [];
		}
	}
	async getTherepuet(qualificationId:number, id: number): Promise<GetTherepuetResponse>
	{
		const uri = `${therepuetsUri}/${qualificationId}/therepuets/${id}`;
		const response = await axios.get(uri, { headers: {} });

		return response.data;
	}    
}
export default new TherepuetService ();