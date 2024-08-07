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
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import { useNavigate } from "react-router";
import { isAuthenticated, login } from "../helper/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./UserLogin.css";
import { Card, CardContent, TextField, Checkbox } from "@mui/material";
import { Facebook, Twitter, Google, GitHub } from "@mui/icons-material";
import gwlogo from "../../resources/images/gwlogo.png";

export default function UserLogin() {
  const [userId, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  useEffect(() => {
    if (isAuthenticated()) {
      fetchUser();
      // navigate("/userhome");
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

  // function extractPageNames(data) {
  //   const pageNames = data.pagedetails.map((page) => page.pagename);
  //   return pageNames;
  // }

  function extractPageNames(data) {
    const pageNamesSet = new Set();
    data.pagedetails.forEach((page) => {
      pageNamesSet.add(page.pagename);
    });
    return Array.from(pageNamesSet);
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleUserIDInputChange = (event) => {
    setUserID(event.target.value);
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!userId || !password) {
      handleClick();
      setSnackbarText("User ID and password are required.");
      setsnackbarSeverity("error");
      return;
    }
    setLoading(true);
    const loggedIn = await login(userId, password);
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
        fetchUser();
        console.log("Logged in");
      } else {
        handleClick();
        setSnackbarText("Failed to login. Check User ID and password");
        setsnackbarSeverity("error");
      }
    } else {
      handleClick();
      setSnackbarText("Failed to login. Check User ID and password");
      setsnackbarSeverity("error");
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("fetchUser data : ", data);
      const homepage = data.homepage;
      console.log("data.homepage : ", data.homePage);
      console.log("role : ", homepage);
      // const roleArray = role.split(",");
      // console.log("roles: ", roleArray);
      // if (homepage === "ROLE_USER") {
      //   navigate("/UserHome");
      // }
      // else {
      //   // fetchAdmin();
      // }
      navigate(`/${homepage}`);
      fetchPageName(data.role);
      console.log(`navigate /${homepage}`);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchPageName = async (role) => {
    try {
      const response = await fetch(`http://${DB_IP}/role/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("pages data : ", extractPageNames(data));
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  // const fetchAdmin = async () => {
  //   console.log(`userhome Bearer ${localStorage.getItem("token")}`);
  //   try {
  //     const response = await fetch("http://localhost:8081/admins/admin", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (response.status === 403) {
  //       localStorage.clear();
  //       navigate("/login");
  //       return;
  //     }
  //     const data = await response.json();
  //     console.log("fetchUser data : ", data);
  //     const role = data.role;
  //     console.log("role : ", role);
  //     const roleArray = role.split(",");
  //     console.log("roles: ", roleArray);
  //     if (roleArray.includes("ROLE_ADMIN")) {
  //       navigate("/AdminHome");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  return (
    <>
      <div
        className="background-radial-gradient overflow-hidden"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Container
          //component="main"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            //width: "100vw",
            //height: "100vh",
          }}
          //maxWidth="lg"
        >
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
                ///background: "green",

                //zIndex: 9999,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          <div
            //className="shape"
            style={{
              display: "grid",
              justifyContent: "center",
              alignitems: "center",
            }}
          >
            <div className="login shape">
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: 60, height: 60, borderRadius: "50%" }}
                  alt="Greenwave"
                  src={gwlogo}
                />

                <Typography component="h1" variant="h5">
                  Login
                </Typography>
                <form className="fromSection">
                  <Box noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Textfield
                          autoFocus
                          autoComplete="userId"
                          name="userId"
                          required
                          fullWidth
                          id="userId"
                          label="User ID"
                          value={userId}
                          focused
                          color="error"
                          // variant="filled"
                          //placeholder="Placeholder"
                          onChange={handleUserIDInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="password">Password</InputLabel>
                          <OutlinedInput
                            autoFocus
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
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

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
                      // className="shining-effect"
                      // autoFocus
                    >
                      Login
                    </Button>
                  </Grid>
                </form>
              </Box>
            </div>
          </div>

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
        </Container>
      </div>
    </>
  );
}
