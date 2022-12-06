import { GetTherepuetSessionResponse as Session } from "../../../contracts/sessions/GetTherepuetSessionResponse";
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
import { CircularProgress, CssBaseline } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

const TherepuetSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  // methods
  async function fetchSessions() {
    const sessions = await sessionsService.getTherepuetSessions();
    setSessions(sessions);
    setIsLoading(false);
  }

  function handleClick(sessionId:number){
      navigate(`/sessions/${sessionId}`);
  }

  return (
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 4,
        }}
      ></Box>
              <CssBaseline />
      <Container sx={{ py: 1 }} maxWidth="lg">
        <Stack direction={"column"} spacing={2}>
          <h1 style={{ width: "100%", textAlign: "center" }}>
            Your Sessions
          </h1>
          <p style={{ width: "100%", textAlign: "center", fontSize: "20px" }}>
            All your sessions can be found here!
          </p>
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
                    <StyledTableCell align="right">Client</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
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
                      <StyledTableCell align="right">
                        {session.client?.name}{" "}
                        {session.client?.surname}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Button
                          onClick={()=>{handleClick(session.id)}}
                          type="button"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2, background:"#9b9bca"}}
                        >
                          Details
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
    </main>
  );
};

export default TherepuetSessions;
