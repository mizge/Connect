import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { GetQualificationResponse as Qualification } from '../../contracts/qualification/GetQualificationResponse';
import { useNavigate } from 'react-router-dom';
import qualificationService from '../../services/qualificationService';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@material-ui/core';


function ClientHome() {
	const navigate = useNavigate();
	const [qualifications, setQualifications] = useState<Qualification[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	
	useEffect(() => {		
		fetchQualifications();
	}, []);

	// methods
	async function fetchQualifications() {
		const response = await qualificationService.getQualifications();
		setQualifications(response);
		setIsLoading(false);
	}
	function navigateToTherepuets (id: number) {
		navigate(`/qualifications/${id}/therepuets`);
	}
    return (
		<main>	
			{/* Hero unit */}
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 3,
					pb: 4,
				}}
			>
			</Box>
			<Container sx={{ py: 1 }} maxWidth="lg">
				<Stack direction={'column'} spacing={2}>
					<h1 style={{width: '100%', textAlign: 'center'}}>
						About us
					</h1>
					<p style={{width: '100%', textAlign: 'center', fontSize:'20px'}}>
						Welcome to Connect! Here you can find all available seanses with therapuets you need. Check out all qualifications pur therapuets qualify in below!
					</p>
				</Stack>
				<Grid sx={{ py: 4, flex:'display', justifyContent:'center' }} container spacing={6}>
					{
						qualifications.length > 0 ?
						qualifications.map((qualification) => (
								<Grid item key={qualification.id} xs={12} sm={6} md={6} lg={4}>
									<Card 
										sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}
									>

										<CardContent sx={{ flexGrow: 1 }}>
											<Typography gutterBottom variant="h5" component="h2">
												{qualification.name}
											</Typography>
											<Typography sx={{
												display: '-webkit-box',
												overflow: 'hidden',
												WebkitBoxOrient: 'vertical',
												WebkitLineClamp: 3,
											}}>
												{`${qualification.description}`}
											</Typography>
										</CardContent>
										<CardActions>
											<Button onClick={()=>navigateToTherepuets(qualification.id)} size="small">See therepuets</Button>
										</CardActions>
									</Card>
								</Grid>
							))
							:
							<Grid item sm={12} container justifyContent="center">
								<Typography variant="h5" component="h2">
									{isLoading ? <CircularProgress /> : 'No qualifications'}
								</Typography>
							</Grid>
					}
				</Grid>
			</Container>
		</main>    
    );
  }
  export default ClientHome;