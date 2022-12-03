import React, { useEffect, useState } from "react";
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
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { GetHomeWorkResponse as Homeworok } from "../../../contracts/homework/GetHomeWorkResponse";
import homeworkService from "../../../services/homeworkService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const RegisteredSession = (props: any) => {
  const [homeworks, setHomeworks] = useState<Homeworok[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [homeworkToDelete, setHomeworkToDelete] = useState<number>(-1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const homeworks = await homeworkService.getHomeWorks(
      Number(props.sessionId)
    );
    setHomeworks(homeworks);
    setIsLoading(false);
  }

  function navigateToNotes() {
    navigate(`/sessions/${props.sessionId}/notes`);
  }
  function navigateToCreateHomework() {
    navigate(`/sessions/${props.sessionId}/homeworks`);
  }
  function navigateToUpdateHomework(homeworkId: number) {
    navigate(`/sessions/${props.sessionId}/homeworks/${homeworkId}`);
  }
  async function handleDelete() {
    const res = await homeworkService.deleteHomeWork(
      Number(props.sessionId),
      homeworkToDelete
    );
    if (res != "") {
      setHomeworkToDelete(-1);
      handleClose();
      fetchData();
    }
  }
  const handleDeleteOpen = (id: number) => {
    setOpen(true);
    setHomeworkToDelete(id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <main>
      <Stack>
        <h2 style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
          With {props.session?.client.name} {props.session?.client.surname}
        </h2>
        <p>{props.session?.notes}</p>
        <Grid
          sx={{
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
              onClick={navigateToNotes}
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#9b9bca",
                onMouseOver: "#5F5F95",
              }}
            >
              Update session notes
            </Button>
          </Grid>
          <Grid
            xs={10}
            sm={10}
            md={3}
            lg={3}
            sx={{ width: "50%", paddingRight: "20px" }}
          >
            <Button
              onClick={navigateToCreateHomework}
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#9b9bca",
                onMouseOver: "#5F5F95",
              }}
            >
              Create homework
            </Button>
          </Grid>
        </Grid>

        <br />
        <p style={{ width: "100%", textAlign: "left", fontSize: "20px" }}>
          See session's homeworks below.
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
                  <StyledTableCell align="right"></StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
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
                    <StyledTableCell align="right">
                      <Button
                        onClick={() => {
                          navigateToUpdateHomework(homework.id);
                        }}
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ background: "#9b9bca" }}
                      >
                        Update
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <DeleteOutlineIcon
                          onClick={(e: any) => {
                            handleDeleteOpen(homework.id);
                          }}
                          sx={{
                            color: "#ff726f",
                            cursor: "pointer",
                          }}
                        />
                      </div>
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
            {"Are you sure you want to delete this homework?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you click delete, the homework will be deleted completely.
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
      </div>
    </main>
  );
};

export default RegisteredSession;
