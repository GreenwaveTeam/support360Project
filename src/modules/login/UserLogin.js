import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
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
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function UserLogin() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [allUser, setAllUser] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    password: "",
    phoneNumber: "",
    plantID: "",
    plantName: "",
    address: "",
    division: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    fetchExistingUser();
  }, []);

  const fetchExistingUser = async () => {
    try {
      const response = await fetch("http://localhost:8081/users/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("data : ", data);
      setAllUser(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <HowToRegTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Login Page
        </Typography>
        <form>
          <Box component="table" noValidate sx={{ mt: 3 }}>
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
            onClick={async (event) => {
              event.preventDefault();
              console.log("allUser : ", allUser);
              for (let i of allUser) {
                if (
                  i.userID === userID &&
                  bcrypt.compare(password, i.password)
                ) {
                  navigate(`/abc`);
                  return;
                } else {
                  setError("UserID or Password and not Matching ! ");
                }
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
