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
import "./UserLogin.css"

export default function UserLogin() {
  const [userID, setUserID] = useState("");
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
    if (!userID || !password) {
      handleClick();
      setSnackbarText("User ID and password are required.");
      setsnackbarSeverity("error");
      return;
    }
    setLoading(true);
    const loggedIn = await login(userID, password);
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
      const response = await fetch("http://localhost:8081/users/user", {
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
      const homepage = data.homePage;
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
      const response = await fetch(`http://localhost:8081/role/${role}`, {
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
            Login Page
          </Typography>
          <form>
            <Box noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Textfield
                    autoFocus
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                className="icon"
                // autoFocus
              >
                Login
              </Button>
            </Grid>
          </form>
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
