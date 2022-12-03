import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from '../contracts/auth/LoginResponse';

interface User {
	accessToken: string,
    refreshToken: string,
	roleId: number
}

const initialState: User = {
	accessToken: '',
	refreshToken: '',
	roleId: -1
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<LoginResponse>) {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.roleId = action.payload.roleId;
		},
		logOutUser(state) {
			state.accessToken = '';
			state.refreshToken = '';
			state.roleId = -1;
		},
	}
});

export const { logOutUser, setUser } = userSlice.actions;
export default userSlice.reducer;