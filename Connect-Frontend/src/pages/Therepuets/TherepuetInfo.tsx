import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { GetTherepuetResponse as Therepuet } from "../../contracts/therepuet/GetTherepuetResponse";
import { useNavigate } from "react-router-dom";
import therepuetsService from "../../services/therepuetService";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { GetSessionByQualificationAndTherepuetResponse as Session } from "../../contracts/sessions/GetSessionByQualificationAndTherepuetResponse";
import sessionService from "../../services/sessionsService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell } from "../../components/StyledTableCell";
import { StyledTableRow } from "../../components/StyledTableRow";
import Typography from "@mui/material/Typography";
import { Alert, AlertTitle, CircularProgress, CssBaseline } from "@mui/material";
import Grid from "@mui/material/Grid";
import { monthNames } from "../../components/Months";
import Button from "@mui/material/Button";
import {sleep} from "../../helpers/Sleep"
import sessionsService from "../../services/sessionsService";
import { ContactSupport } from "@material-ui/icons";

const TherepuetInfo = (props: any) => {
  const user = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const { qualificationId, therepuetId } = useParams();
  const [therepuet, setTherepuet] = useState<Therepuet>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reservationError, setReservationError] = useState<boolean>(false);
  useEffect(() => {
    fetchTherepuets();
  }, []);

  // methods
  async function fetchTherepuets() {
    const therepuetRes = await therepuetsService.getTherepuet(
      Number(qualificationId),
      Number(therepuetId)
    );
    setIsLoading(false);
    setTherepuet(therepuetRes);
    const sessionsRes =
      await sessionService.getSessionsByQualificationAndTherepuet(
        Number(qualificationId),
        Number(therepuetId)
      );
    setSessions(sessionsRes);
  }
  async function handleClick(sessionId: number) {
    const res = await sessionsService.MakeReservation(sessionId);
    if (res == "") {
      await showError()
    }else{
      navigate(`/sessions/${sessionId}`);
    }

  }
  async function showError(){
    setReservationError(true)
    await sleep(5000)
    setReservationError(false)
  }
  return (
    <main>
			<CssBaseline />
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 4,
        }}
      ></Box>
      <Container sx={{ py: 1 }} maxWidth="lg">
        <Stack
          direction={"column"}
          spacing={2}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "none",
            boxShadow: "none",
          }}
        >
          <Avatar
            alt={`${therepuet?.user.name} ${therepuet?.user.surname}`}
            src="https://static.vecteezy.com/system/resources/previews/010/556/173/original/cute-cartoon-wizard-in-illustration-vector.jpg"
            style={{ height: "200px", width: "200px" }}
          />
          <h1 style={{ width: "100%", textAlign: "center" }}>
            Meet {therepuet?.user.name} {therepuet?.user.surname}!
          </h1>
          <p style={{ width: "100%", textAlign: "center", fontSize: "20px" }}>
            {therepuet?.description}
          </p>
          <br />
          <h2 style={{ width: "100%", textAlign: "center" }}>
            Check out available sessions below!
          </h2>
        </Stack>
        <br />
        <div>
          {sessions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell align="right">Time</StyledTableCell>
                    <StyledTableCell align="right">Duration</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <StyledTableRow key={session.id}>
                      <StyledTableCell component="th" scope="row">
                        {monthNames[new Date(session.startTime).getMonth()]}{" "}
                        {new Date(session.startTime).getDate()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {new Date(session.startTime).getHours()}:
                        {new Date(session.startTime).getMinutes()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {session.durationInMinutes} minutes
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          onClick={() => {
                            handleClick(session.id);
                          }}
                          type="button"
                          fullWidth
                          variant="contained"
                          color="secondary"
                          sx={{ mt: 3, mb: 2, color:"white", width:"50%" }}
                        >
                          Reserve this session
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid item sm={12} container justifyContent="center">
              <Typography variant="h5" component="h2">
                {isLoading ? <CircularProgress /> : "No sessions were found."}
              </Typography>
            </Grid>
          )}
        </div>
      </Container>
      {reservationError ? (
        <Alert
          severity="error"
          style={{ position: "fixed", bottom: "90px", right: "20px" }}
        >
          <AlertTitle>Error</AlertTitle>
          Session can't be reserved. Please log in.
        </Alert>
      ) : (
        <></>
      )}
    </main>
  );
};

export default TherepuetInfo;
