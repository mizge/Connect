import React, {useState } from "react";
import Unauthorized from "../../global/Unauthorized";
import { useAppSelector } from "../../app/hooks";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  TextField,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { sleep } from "../../helpers/Sleep";
import qualificationService from "../../services/qualificationService";
import { QualificationRequest } from "../../contracts/qualification/QualificationRequest";

const CreateQualification = () => {
  const roleId: number = useAppSelector((state) => state.user.roleId);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleSumbit() {
    const qualificationRequest: QualificationRequest = {
      name: name,
      description: description,
    };
    const res = await qualificationService.createQualification(
      qualificationRequest
    );
    if (res != "") {
      navigate(`/qualifications`);
    }
    else{
      setError(true)
      await sleep(5000)
      setError(false)
    }
  }


  if (roleId == 1) {
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
          <Stack>
            <h1
              style={{ width: "100%", textAlign: "left", marginBottom: "30px" }}
            >
              Create qualification
            </h1>
          </Stack>

          <Box sx={{ mt: 1 }}>
          <TextField
              id="name"
              label="Name"
              type="text"
              onChange={(e: any) => {
                setName(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={name}
              style={{marginBottom: "30px"}}
              placeholder="Name"
              required
            />
            <TextField
            multiline
              minRows={4}
              label="Description"
              placeholder="Description"
              id="description"
              name="description"
              onChange={(e: any) => {
                setDescription(e.target.value);
              }}
              autoFocus
              style={{
                width: "100%",
                borderColor: "grey",
                marginBottom: "20px",
              }}
              required
              value={description}
            />
          </Box>
          <Button
            onClick={handleSumbit}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!(name && description)}
            sx={{ mt: 3, mb: 2, background: "#9b9bca"}}
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
            Qualification was not created.
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

export default CreateQualification;
