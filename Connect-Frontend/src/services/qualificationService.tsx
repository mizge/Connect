import axios from 'axios'
import React from 'react'
import {GetQualificationResponse} from '../contracts/qualification/GetQualificationResponse';
axios.interceptors.request.use(function (config) {
	const token = "";//store.getState().user.token;
	if (!(config.headers && token)) return config;
	config.headers.Authorization =  `Bearer ${token}`;

	return config;
});

const API_URL = process.env.REACT_APP_BACKEND;

const qualificationUri = API_URL+ 'qualifications';

class QualificationService {

	async getQualifications (): Promise<GetQualificationResponse[]>
	{
		const response = await axios.get(qualificationUri, { headers: {} });
		return response.data;
	}
	async getQualification(id: number): Promise<GetQualificationResponse>
	{
		const uri = `${qualificationUri}/${id}`;
		const response = await axios.get(uri, { headers: {} });

		return response.data;
	}    
}
export default new QualificationService ();