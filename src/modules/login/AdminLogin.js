import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Snackbar,
  Slide,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import { useNavigate } from "react-router";
import { isAuthenticated, login } from "../helper/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AdminLogin() {
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/home");
    }
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleAdminIDInputChange = (event) => {
    setAdminID(event.target.value);
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!adminID || !password) {
      handleClick();
      setSnackbarText("Admin ID and password are required.");
      setsnackbarSeverity("error");
      return;
    }
    setLoading(true);
    const loggedIn = await login(adminID, password);
    if (loggedIn) {
      let token = localStorage.getItem("token");
      // let attempts = 0;
      const startTime = Date.now();
      while (token === null && Date.now() - startTime < 2000) {
        // while (token === null && attempts < 5) {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        token = localStorage.getItem("token");
        // attempts++;
      }
      if (token !== null) {
        navigate("/admin/home");
        console.log("Logged in");
      } else {
        handleClick();
        setSnackbarText("Failed to login. Check Admin ID and password");
        setsnackbarSeverity("error");
      }
    } else {
      handleClick();
      setSnackbarText("Failed to login. Check Admin ID and password");
      setsnackbarSeverity("error");
    }
    setLoading(false);
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
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
                    onChange={handleAdminIDInputChange}
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
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Box>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
}
