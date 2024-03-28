import React, { useState } from "react";
import {
  Avatar,
  CssBaseline,
  Button,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { login } from "../helper/AuthService";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUserIDInputChange = (event) => {
    setAdminID(event.target.value);
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <HowToRegTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login Page
        </Typography>
        <form>
          <Box noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Textfield
                  autoComplete="adminID"
                  name="adminID"
                  required
                  fullWidth
                  id="adminID"
                  label="Admin ID"
                  value={adminID}
                  onChange={handleUserIDInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  autoComplete="password"
                  name="password"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  value={password}
                  onChange={handlePasswordInputChange}
                  style={{ width: "80%" }}
                  type={showPassword ? "text" : "password"}
                />
                <Button
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
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={(event) => {
              event.preventDefault();
              const loggedIn = login(adminID, password);
              if (loggedIn) {
                navigate("/AdminHome");
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
