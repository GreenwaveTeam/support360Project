import React, { useState } from "react";
import {
  Avatar,
  CssBaseline,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router";
import { login } from "../helper/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function UserLogin() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUserIDInputChange = (event) => {
    setUserID(event.target.value);
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <HowToRegTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Login Page
        </Typography>
        <form>
          <Box noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Textfield
                  autoComplete="userID"
                  name="userID"
                  required
                  fullWidth
                  id="userID"
                  label="User ID"
                  value={userID}
                  onChange={handleUserIDInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    autoComplete="password"
                    name="password"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    value={password}
                    onChange={handlePasswordInputChange}
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {/* <Button
                  id="showpasswoed"
                  onClick={handleShowPasswordClick}
                  style={{
                    width: "10%",
                    height: "56px",
                  }}
                  variant="contained"
                  color="inherit"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </Button> */}
              </Grid>
            </Grid>
          </Box>
        </form>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Grid item xs={12} marginTop={"50px"}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={(event) => {
              event.preventDefault();
              const loggedIn = login(userID, password);
              if (loggedIn && localStorage.getItem("token") !== null) {
                navigate("/UserHome");
                console.log("Loggedin");
                return;
              } else {
                setError("Failed to login.");
              }
            }}
          >
            Login
          </Button>
        </Grid>
      </Box>
    </Container>
  );
}
