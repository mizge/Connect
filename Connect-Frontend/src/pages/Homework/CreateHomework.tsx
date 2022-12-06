import React, { useEffect, useState } from "react";
import Unauthorized from "../../global/Unauthorized";
import { useAppSelector } from "../../app/hooks";
import { Navigate, useParams } from "react-router-dom";
import { GetTherepuetSessionResponse as Session } from "../../contracts/sessions/GetTherepuetSessionResponse";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  CssBaseline,
  FormLabel,
  Stack,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { monthNames } from "../../components/Months";
import sessionsService from "../../services/sessionsService";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CreateHomeWorkRequest } from "../../contracts/homework/CreateHomeworkRequest";
import homeworkService from "../../services/homeworkService";
import { useNavigate } from "react-router-dom";
import { sleep } from "../../helpers/Sleep";
import NotFound from "../../global/NotFound";

const CreateHomework = () => {
  const roleId: number = useAppSelector((state) => state.user.roleId);
  const { sessionId } = useParams();
  const [session, setSession] = useState<Session>();
  const [task, setTask] = useState<string>("");
  const [time, setTime] = useState<Date>(new Date());
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const session = await sessionsService.getTherepuetSession(
      Number(sessionId)
    );
    if(session != null){
      setSession(session);
      setTime(session?.startTime);
    }
  }
  async function handleSumbit() {
    const homeworkRequest: CreateHomeWorkRequest = {
      task: task,
      time: time,
    };
    const res = await homeworkService.createHomeWork(
      Number(sessionId),
      homeworkRequest
    );
    if (res != "") {
      navigate(`/sessions/${sessionId}`);
    }
    else{
      setError(true)
      await sleep(5000)
      setError(false)
    }
  }

  function changeTime(e: any) {
    setTime(new Date(e));
  }

  if (roleId == 2) {
    if(session == null){
      return <NotFound/>
    }
    return (
      <main>
        	  <CssBaseline />
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 3,
            pb: 4,
          }}
        ></Box>
        <Container sx={{ py: 1 }} maxWidth="lg">
          <Stack>
            <h1
              style={{ width: "100%", textAlign: "left", marginBottom: "0px" }}
            >
              Create homework for session on{" "}
              {
                monthNames[
                  new Date(
                    session?.startTime ? session?.startTime : ""
                  ).getMonth()
                ]
              }{" "}
              {new Date(session?.startTime ? session?.startTime : "").getDate()}
            </h1>
            <h2 style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
              With {session?.client.name} {session?.client.surname}
            </h2>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <TextField
              multiline
              minRows={4}
              aria-label="Task"
              label="Task"
              id="task"
              name="task"
              onChange={(e: any) => {
                setTask(e.target.value);
              }}
              autoFocus
              style={{
                width: "100%",
                borderColor: "grey",
                marginBottom: "20px",
              }}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Time"
                minDate={session?.startTime}
                inputFormat="MM/DD/YYYY"
                onChange={(e: any) => {
                  changeTime(e);
                }}
                renderInput={(params) => <TextField {...params} />}
                value={time}
              />
            </LocalizationProvider>
          </Box>
          <Button
            onClick={handleSumbit}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!(task)}
            sx={{ mt: 3, mb: 2, background: "#9b9bca" }}
          >
            Save
          </Button>
        </Container>
        {error ? (
          <Alert
            severity="error"
            style={{
              position: "fixed",
              bottom: "10px",
              right: "20px",
              width: "150px",
            }}
          >
            <AlertTitle>Failed</AlertTitle>
            Homework was not saved.
          </Alert>
        ) : (
          <></>
        )}
      </main>
    );
  } else {
    return <Unauthorized />;
  }
};

export default CreateHomework;
