import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import qualificationService from "../../services/qualificationService";
import { GetQualificationResponse as Qualification } from "../../contracts/qualification/GetQualificationResponse";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableCell } from "../../components/StyledTableCell";
import { StyledTableRow } from "../../components/StyledTableRow";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { sleep } from "../../helpers/Sleep";
import { useAppSelector } from "../../app/hooks";
import Unauthorized from "../../global/Unauthorized";

const Qualifications = () => {
  const roleId: number = useAppSelector((state) => state.user.roleId);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [qualificationToDelete, setQualificationToDelete] =
    useState<number>(-1);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const res = await qualificationService.getQualifications();
    setQualifications(res);
    setIsLoading(false);
  }

  function navigateToUpdateQualification(qualificationId: number) {
    navigate(`/qualifications/${qualificationId}`);
  }
  async function handleDelete() {
    const res = await qualificationService.deleteQualification(
      qualificationToDelete
    );
    setQualificationToDelete(-1);
    if (res != "") {
      handleClose();
      fetchData();
    } else {
      handleClose();
      setError(true);
      await sleep(7000);
      setError(false);
    }
  }
  const handleDeleteOpen = (id: number) => {
    setOpen(true);
    setQualificationToDelete(id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  if(roleId != 1) {
    return <Unauthorized />;
  }
  return (
    <main>

      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 4,
        }}
      ></Box>
            			<CssBaseline />
      <Container sx={{ py: 1 }} maxWidth="lg">
        <Stack>
          <h1 style={{ width: "100%", textAlign: "left" }}>
            Qualifications
          </h1>
        </Stack>
        <br />
        <div>
          {qualifications.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Description</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualifications.map((qualification) => (
                    <StyledTableRow key={qualification.id}>
                      <StyledTableCell component="th" scope="row">
                        {qualification.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {qualification.description}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Button
                          onClick={() => {
                            navigateToUpdateQualification(qualification.id);
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
                              handleDeleteOpen(qualification.id);
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
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  "No qualifications were found."
                )}
              </Typography>
            </Grid>
          )}
        </div>
      </Container>
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
          {"Are you sure you want to delete this qualification?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you click delete, the qualification will be deleted completely.
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
            bottom: "90px",
            right: "20px",
          }}
        >
          <AlertTitle>Failed</AlertTitle>
          Qualification was not deleted.
        </Alert>
      ) : (
        <></>
      )}
    </main>
  );
};

export default Qualifications;
