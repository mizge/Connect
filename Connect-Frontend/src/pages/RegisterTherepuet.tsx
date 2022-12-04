import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { GetQualificationResponse as Qualification } from "../contracts/qualification/GetQualificationResponse";
import qualificationService from "../services/qualificationService";
import Checkbox from "@mui/material/Checkbox";
import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import { RegisterTherepuetRequest } from "../contracts/auth/RegisterTherepuetRequest";
import userService from "../services/userService";
import { sleep } from "../helpers/Sleep";

function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password == confirmPassword || confirmPassword == "";
}

const RegisterTherepuet = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [qualificationsT, setQualificationsT] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  // methods
  async function fetchData() {
    const qual = await qualificationService.getQualifications();
    setQualifications(qual);
  }
  async function handleSubmit() {
    const createUserRequest: RegisterTherepuetRequest = {
    	email: email,
    	password: password,
    	name: name,
    	surname: surname,
      description: description,
      qualifications: qualificationsT
    };
    const isRegistered = await userService.registerTherepuet(createUserRequest);
    if (isRegistered) {
      setError('')
    	setSaved(true)
      await sleep(10000)
      setSaved(false)
    } else {
    	setError('Email already exists.');
    }
  }

  function addQualification(e:number){
    setQualificationsT([...qualificationsT, e])
  }
  function registerClient(){
    navigate(`/register`)
  }

  return (
    <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main", marginTop: 10 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Therepuet registration
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="FirstName"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={(e) => setSurname(e.target.value)}
                required
                fullWidth
                id="lastName"
                label="LastName"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={
                  !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) &&
                  email.length != 0
                }
                helperText={
                  !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email) &&
                  email.length != 0
                    ? "Invalid email"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={false}
                helperText=""
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
                name="password"
                label="Repeat password"
                type="password"
                id="password"
                error={!doPasswordsMatch(password, confirmPassword)}
                helperText={
                  !doPasswordsMatch(password, confirmPassword)
                    ? "Passwords do not match"
                    : ""
                }
                autoComplete="new-password"
              />
            </Grid>
            <Box sx={{ display: "flex", width:"100%" }}>
              <FormControl
                sx={{ m: 3 }}
                component="fieldset"
                variant="standard"
              >
                <FormLabel>Select your qualifications</FormLabel>
                {qualifications.length > 0 ? (
                  <FormGroup>
                    {qualifications.map((qualification) => (
                      <FormControlLabel
                        control={<Checkbox onChange={(e:any)=>{addQualification(qualification.id)}}/>}
                        label={qualification.name}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
            <FormControl
                sx={{ m: 3, width: "100%" }}
                component="fieldset"
                variant="standard"
              >
                <FormLabel sx={{ width: "100%" }}>Describe your self!</FormLabel>
                <Textarea
                  variant="outlined"
                  minRows={4}
                  aria-label="Description"
                  placeholder="Description"
                  id="description"
                  name="description"
                  sx={{borderColor:"lightgrey"}}
                  onChange={(e:any)=>{setDescription(e.target.value)}}
                />
              </FormControl>
          </Grid>
          <Typography fontSize={12} color={"red"}>
            {error}
          </Typography>
          <Button
            onClick={handleSubmit}
            disabled={
              !(name && surname && email && password && confirmPassword)
            }
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background:"#8a8ac1" }}
          >
            Register
          </Button>
          <Button
            onClick={registerClient}
            type="submit"
            fullWidth
            variant="contained"
            sx={{  mb: 2, background:"#bcbcdc" }}
          >
            Register as client
          </Button>
        </Box>
      </Box>
    </Container>
            {saved ? (
              <Alert
                severity="success"
                style={{ position: "fixed", bottom: "70px", right: "20px" }}
              >
                <AlertTitle>Registered</AlertTitle>
                You can now log in into application
              </Alert>
            ) : (
              <></>
            )}</>
  );
};

export default RegisterTherepuet;
