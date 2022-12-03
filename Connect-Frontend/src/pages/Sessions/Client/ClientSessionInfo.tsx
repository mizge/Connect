import { GetClientSessionResponse as Session } from "../../../contracts/sessions/GetClientSessionResponse";
import sessionsService from "../../../services/sessionsService";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell } from "../../../components/StyledTableCell";
import { StyledTableRow } from "../../../components/StyledTableRow";
import { monthNames } from "../../../components/Months";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { GetHomeWorkResponse as Homeworok } from "../../../contracts/homework/GetHomeWorkResponse";
import homeworkService from "../../../services/homeworkService";
import {sleep} from "../../../helpers/Sleep"

const ClientSessionInfo = (props:any) => {
    const [session, setSession] = useState<Session>();
    const [homeworks, setHomeworks] = useState<Homeworok[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [reservationCanceled, setReservationCanceled] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
    }, []);
  
    // methods
    async function fetchData() {
      const session = await sessionsService.getClientSession(Number(props.sessionId));
      setSession(session);
      const homeworks = await homeworkService.getHomeWorks(Number(props.sessionId));
      setHomeworks(homeworks)
      setIsLoading(false);
    }
    function sessionCanBeCanceled(){
        const date = new Date(session?.startTime? session?.startTime: "")
        date.setDate(date.getDate()-1)
        const today = new Date();
        return date.getTime() > today.getTime()
    }
    async function handleCancelation(){
        const res = await sessionsService.CancelReservation(Number(props.sessionId));
        if(res != ""){
            let seconds = 7
            while(seconds > -1){
                setReservationCanceled(`${res}\nYou will be redirected to your sessions in ${seconds} seconds.`)
                seconds = seconds - 1
                await sleep(1000)
            }

            navigate(`/sessions`);
        }

    }
  
    return (
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 3,
            pb: 4,
          }}
        ></Box>
        <Container sx={{ py: 1 }} maxWidth="lg">
          <Stack direction={"column"} spacing={2}>
            <h1 style={{ width: "100%", textAlign: "left", marginBottom:"0px" }}>
              Session on {monthNames[new Date(session?.startTime?session?.startTime:"").getMonth()]}{" "} {new Date(session?.startTime?session?.startTime:"").getDate()}
            </h1>
            <h2 style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
                With {session?.therepuet.user.name} {session?.therepuet.user.surname} 
            </h2>
            {sessionCanBeCanceled()?
                                    <Button
                                    onClick={handleCancelation}
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, width:"40%", background:"#9b9bca", onMouseOver:"#5F5F95" }}
                                  >
                                    Cancel Reservation
                                  </Button>:
                                  <></>
            }
            <p style={{color: "#8abf74"}}>
                {reservationCanceled}
            </p>
            <br/>
            <p  style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
                See your session homeworks below.
            </p>

          </Stack>
          <br />
          <div>
            {homeworks.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell align="right">Task</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {homeworks.map((homework) => (
                      <StyledTableRow key={homework.id}>
                        <StyledTableCell component="th" scope="row">
                          {monthNames[new Date(homework.time).getMonth()]}{" "}
                          {new Date(homework.time).getDate()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {homework.task}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Grid item sm={12} container justifyContent="center">
                <Typography variant="h5" component="h2">
                  {isLoading ? <CircularProgress /> : "No homeworks were found."}
                </Typography>
              </Grid>
            )}
          </div>
        </Container>
      </main>
    );
  };

export default ClientSessionInfo