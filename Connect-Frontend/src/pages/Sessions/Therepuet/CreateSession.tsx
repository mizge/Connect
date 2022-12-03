import React, { useEffect, useState } from "react";
import Unauthorized from "../../../global/Unauthorized";
import { useAppSelector } from "../../../app/hooks";
import { Navigate, useParams } from "react-router-dom";
import { GetTherepuetSessionResponse as Session } from "../../../contracts/sessions/GetTherepuetSessionResponse";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  FormLabel,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { monthNames } from "../../../components/Months";
import sessionsService from "../../../services/sessionsService";
import { Textarea } from "@mui/joy";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CreateHomeWorkRequest } from "../../../contracts/homework/CreateHomeworkRequest";
import homeworkService from "../../../services/homeworkService";
import { useNavigate } from "react-router-dom";
import { sleep } from "../../../helpers/Sleep";
import { CreateSessionRequest } from "../../../contracts/sessions/CreateSessionRequest";

const CreateSession = () => {
  const roleId: number = useAppSelector((state) => state.user.roleId);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(45);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [error, setError] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<string>();

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // methods
  function fetchData() {
    let minD = new Date();
    minD.setDate(minD.getDate() + 1);
    setMinDate(minD);
    setStartTime(minD)
  }

  async function handleSumbit() {
    const sessionRequest: CreateSessionRequest = {
      startTime: startTime,
      durationInMinutes: duration,
    };
    const res = await sessionsService.createSession(
        sessionRequest
    );
    if (res != "") {
      navigate(`/sessions`);
    }
    else{
      setError(true)
      await sleep(5000)
      setError(false)
    }
  }

  function changeDuration(e: any) {
    let number = Number(e.target.value);
    if (Math.round(number) != number) {
        setNumberError('Incorrect format. Only whole numbers are accepted.')
    } else {
      setDuration(number);
      setNumberError("")
    }
  }

  function changeTime(e: any) {
    setStartTime(new Date(e));
  }

  if (roleId == 2) {
    return (
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 3,
            pb: 4,
          }}
        ></Box>
        <Container sx={{ py: 1 }} maxWidth="lg" style={{display:"flex", alignItems:"center", flexDirection: "column"}}>
          <Stack>
            <h1
              style={{ width: "100%", textAlign: "left", marginBottom: "40px" }}
            >
              Create new session
            </h1>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <TextField
              id="minutes"
              label="Duration in minutes"
              type="number"
              onChange={(e: any) => {
                changeDuration(e);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={45}
              InputProps={{ inputProps: { min: 1 } }}
              style={{marginBottom: "30px"}}
            />
            <Typography fontSize={20} color={"red"}>
              {numberError}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Time"
                minDate={minDate}
                inputFormat="MM/DD/YYYY"
                onChange={(e: any) => {
                  changeTime(e);
                }}
                renderInput={(params) => <TextField {...params} />}
                value={startTime}

              />
            </LocalizationProvider>


          </Box>
          <Button
            onClick={handleSumbit}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!(duration > 0)}
            sx={{ mt: 3, mb: 2, background: "#9b9bca", width:"25%" }}
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

export default CreateSession;
