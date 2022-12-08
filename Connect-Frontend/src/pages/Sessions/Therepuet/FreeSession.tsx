import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import homeworkService from "../../../services/homeworkService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import sessionsService from "../../../services/sessionsService";
import { Alert, AlertTitle } from "@mui/material";
import { sleep } from "../../../helpers/Sleep";

const FreeSession = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError]  = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const homeworks = await homeworkService.getHomeWorks(
      Number(props.sessionId)
    );
    setIsLoading(false);
  }
  async function handleDelete() {
    const res = await sessionsService.deleteSession(
      Number(props.sessionId)
    );
    if (res == "") {
        handleClose();
        setError(true);
        await sleep(10000)
        setError(false);
    }
    else{
        navigate(`/sessions`);
    }
  }
  const handleDeleteOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <main>
      <Stack>
        <Grid
          sx={{
            pt: 8,
            py: 4,
            flex: "display",
            justifyContent: "left",
            marginLeft: "0",
            paddingBottom: "0",
          }}
          container
          spacing={6}
        >
          <Grid
            xs={10}
            sm={10}
            md={3}
            lg={3}
            sx={{ width: "50%", paddingRight: "20px" }}
          >
            <Button
              onClick={handleDeleteOpen}
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#ff726f",
                onMouseOver: "#5F5F95",
              }}
            >
              Delete session
            </Button>
          </Grid>
        </Grid>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backdropFilter: "blur(5px)",
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this session?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you click delete, the session will be deleted completely.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} sx={{ color: "#ff726f" }}>
            Delete
          </Button>
          <Button onClick={handleClose} autoFocus sx={{ color: "grey" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
            Session was not deleted.
          </Alert>
        ) : (
          <></>
        )}
    </main>
  );
};

export default FreeSession;
