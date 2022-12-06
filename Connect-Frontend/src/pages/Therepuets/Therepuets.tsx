import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia'
import { GetTherepuetResponse as Therepuet } from '../../contracts/therepuet/GetTherepuetResponse';
import { useNavigate } from 'react-router-dom';
import therepuetsService from '../../services/therepuetService';
import Stack from '@mui/material/Stack';
import { CircularProgress, CssBaseline } from '@material-ui/core';
import { useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router-dom';
import { GetQualificationResponse as Qualification } from '../../contracts/qualification/GetQualificationResponse';
import qualificationService from '../../services/qualificationService';


const Therepuets = (props:any) => {
	const user  = useAppSelector((state) => state.user);

	const navigate = useNavigate();
	const { qualificationId } = useParams();
	const [therepuets, setTherepuets] = useState<Therepuet[]>([]);
	const [qualification, setQualification] = useState<Qualification>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	
	useEffect(() => {		
		fetchTherepuets();
	}, []);

	// methods
	async function fetchTherepuets() {
		const therepuetsRes = await therepuetsService.getTherepuets(Number(qualificationId));
		setTherepuets(therepuetsRes);
        const qualificationRes = await qualificationService.getQualification(Number(qualificationId));
        setQualification(qualificationRes);
		setIsLoading(false);
	}
	function navigateToTherepuet (id: number) {
		navigate(`/qualifications/${qualificationId}/therepuets/${id}`);
	}
    return (
		<main>	
			<CssBaseline />
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
						{qualification?.name}
					</h1>
					<p style={{width: '100%', textAlign: 'center', fontSize:'20px'}}>
                    {qualification?.description}
					</p>
                    <br/>
                    <h2 style={{width: '100%', textAlign: 'center'}}>
                        Check out our therepuets below!
                    </h2>
				</Stack>
				<Grid sx={{ py: 4, flex:'display', justifyContent:'center' }} container spacing={6}>
					{
						therepuets.length > 0 ?
						therepuets.map((therepuet) => (
								<Grid item key={therepuet.user.id} xs={12} sm={6} md={6} lg={4}>
									<Card 
										sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: "none", boxShadow: "none", background:"inherit"}}
									>
										<CardMedia
                                            style={{borderRadius: '50%', height: '75%', width:'75%'}}
											component="img"
											sx={{
												height: '50%', width:'50%'
											}}
											image="https://static.vecteezy.com/system/resources/previews/010/556/173/original/cute-cartoon-wizard-in-illustration-vector.jpg"
											alt="random"
										/>
										<CardContent sx={{ flexGrow: 1 }}>
											<Typography gutterBottom variant="h5" component="h2">
												{therepuet.user.name} {therepuet.user.surname}
											</Typography>
										</CardContent>
										<CardActions>
											<Button onClick={()=>navigateToTherepuet(therepuet.user.id)} size="small">See available sessions</Button>
										</CardActions>
									</Card>
								</Grid>
							))
							:
							<Grid item sm={12} container justifyContent="center">
								<Typography variant="h5" component="h2">
									{isLoading ? <CircularProgress /> : 'No therepuets were found'}
								</Typography>
							</Grid>
					}
				</Grid>
			</Container>
		</main>    
    );
}

export default Therepuets