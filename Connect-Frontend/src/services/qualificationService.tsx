import axios from 'axios'
import React from 'react'
import {GetQualificationResponse} from '../contracts/qualification/GetQualificationResponse';
import { QualificationRequest } from '../contracts/qualification/QualificationRequest';
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
	async deleteQualification(id: number): Promise<string>
	{
		let res=""
		try{
			const uri = `${qualificationUri}/${id}`;
			const response = await axios.delete(uri, { headers: {} });
			res = "Qualification deleted."
		}
		catch (err) {
		}
		return res
	}    
	async updateQualification(id: number, params:QualificationRequest): Promise<string>
	{
		let res=""
		try{
			const uri = `${qualificationUri}/${id}`;
			const response = await axios.put(uri, params, {headers:{'Content-Type': 'application/json'}});
			res = "Qualification updated."
		}
		catch (err) {
		}
		return res
	}   
	async createQualification(params:QualificationRequest): Promise<string>
	{
		let res=""
		try{
			const response = await axios.post(qualificationUri, params, {headers:{'Content-Type': 'application/json'}});
			res = "Qualification created."
		}
		catch (err) {
		}
		return res
	}   
}
export default new QualificationService ();