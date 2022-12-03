import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginRequest } from '../contracts/auth/LoginRequest';
import userService from '../services/userService';
import { setUser } from '../app/userSlice';
import { useAppDispatch } from '../app/hooks';



function Login() {
  const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	async function handleSubmit () {
		const loginUserRequest: LoginRequest = {
			email: email,
			password: password,
		};
		
		const loginResponse = await userService.login(loginUserRequest);
		if (loginResponse.error) {
      setError(loginResponse.error);

		} else {
      		dispatch(setUser(loginResponse));
			navigate('/sessions');
		}
	}
  return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Login to connect
				</Typography>
				<Typography fontSize={15} color={'green'}>
					{location.state?.message}
				</Typography>
				<Box sx={{ mt: 1 }}>
					<TextField onChange={(e) => setEmail(e.target.value)}
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField onChange={(e) => setPassword(e.target.value)}
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<Typography fontSize={20} color={'red'}>
						{error}
					</Typography>
					<Button onClick={handleSubmit}
						disabled={!(email && password)}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Login
					</Button>
				</Box>
			</Box>
		</Container>
  );
}
export default Login;