import { GetTherepuetSessionResponse as Session } from "../../../contracts/sessions/GetTherepuetSessionResponse";
import sessionsService from "../../../services/sessionsService";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { monthNames } from "../../../components/Months";
import RegisteredSession from "./RegisteredSession";
import { useAppSelector } from '../../../app/hooks'
import Unauthorized from "../../../global/Unauthorized";
import FreeSession from "./FreeSession";
import { CssBaseline } from "@mui/material";
import NotFound from "../../../global/NotFound";

const TherepuetSessionInfo = (props: any) => {
  const roleId:number  = useAppSelector((state) => state.user.roleId);
  const [session, setSession] = useState<Session>();
  //change to false by default
  const [isReserved, setIsReserved] = useState<boolean>(false)
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const session = await sessionsService.getTherepuetSession(
      Number(props.sessionId)
    );

    if(session!=null){
      if(session.client != null){
        setIsReserved(true)
    }
      setSession(session);
    }

  }
  if(roleId == 2){
    if(session== null){
      return <NotFound/>
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
          <Stack direction={"column"} spacing={2}>
            <h1 style={{ width: "100%", textAlign: "left", marginBottom: "0px" }}>
              Session on{" "}
              {
                monthNames[
                  new Date(
                    session?.startTime ? session?.startTime : ""
                  ).getMonth()
                ]
              }{" "}
              {new Date(session?.startTime ? session?.startTime : "").getDate()}
            </h1>
          </Stack>
          {isReserved?(
              <RegisteredSession sessionId={props.sessionId} session={session}/>
          ):<FreeSession sessionId={props.sessionId} session={session}/>}
        </Container>
      </main>
    );
  }
  else{
    return <Unauthorized/>
  }

};

export default TherepuetSessionInfo;
