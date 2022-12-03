import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { monthNames } from "../../components/Months";
import { useParams } from "react-router-dom";
import { GetTherepuetSessionResponse as Session } from "../../contracts/sessions/GetTherepuetSessionResponse";
import sessionsService from "../../services/sessionsService";
import {Container, Button, Alert, AlertTitle } from "@mui/material";
import {Textarea, Box} from "@mui/joy";
import { sleep } from "../../helpers/Sleep";
import Unauthorized from "../../global/Unauthorized";
import { useAppSelector } from '../../app/hooks'

const UpdateNotes = () => {
  const roleId:number  = useAppSelector((state) => state.user.roleId);
  const { sessionId } = useParams();
  const [session, setSession] = useState<Session>();
  const [notes, setNotes] = useState<string>("")
  const [saved, setSave] = useState<boolean>(false)
  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const session = await sessionsService.getTherepuetSession(
      Number(sessionId)
    );
    setSession(session);
    setNotes(session.notes)
  }
  async function saveNotes(){
    const res = await sessionsService.updateNotes(
        Number(sessionId),
        notes
      );
    if(res != ""){
        setSave(true)
        await sleep(5000)
        setSave(false)
    }

  }
  if(roleId == 2){
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
          <Stack>
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
            <h2 style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
              With {session?.client.name} {session?.client.surname}
            </h2>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Textarea
              variant="outlined"
              color="info"
              minRows={4}
              aria-label="Notes"
              defaultValue={notes}
              id="notes"
              name="notes"
              onChange={(e:any)=>{setNotes(e.target.value)}}
              autoFocus
            />
          </Box>
          <Button onClick={saveNotes}
              type="submit"
              fullWidth
              variant="contained"
                          sx={{ mt: 3, mb: 2, background:"#9b9bca"}}
            >
              Save
            </Button>
        </Container>
        {saved ? (
          <Alert
            severity="success"
            style={{ position: "fixed", bottom: "10px", right: "20px", width:"150px" }}
          >
            <AlertTitle>Saved</AlertTitle>
            Notes updated
          </Alert>
        ) : (
          <></>
        )}
      </main>
    );
  }
  else{
    return <Unauthorized/>
  }

};

export default UpdateNotes;
