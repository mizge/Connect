import axios, { AxiosError } from 'axios'
import React from 'react'
import { LoginRequest } from '../contracts/auth/LoginRequest';
import { LoginResponse } from '../contracts/auth/LoginResponse';

axios.interceptors.request.use(function (config) {
	const token = "";//store.getState().user.token;
	if (!(config.headers && token)) return config;
	config.headers.Authorization =  `Bearer ${token}`;

	return config;
});

const API_URL = process.env.REACT_APP_BACKEND;

const qualificationUri = API_URL+ 'user';

class UserService {

	async login(params:LoginRequest): Promise<LoginResponse>
	{
        let loginResponse:LoginResponse = { accessToken: '', refreshToken:'', roleId:-1, error: ''};
        try {
            const response = await axios.post(qualificationUri, params, {headers:{'Content-Type': 'application/json'}});
            loginResponse.accessToken = response.data.accessToken
            loginResponse.refreshToken = response.data.refreshToken
            loginResponse.roleId = response.data.roleId
		} catch (err) {
			if (err instanceof AxiosError) {
				loginResponse.error=err.response?.data.message
			}
		}
		return loginResponse;
	}

}
export default new UserService ();