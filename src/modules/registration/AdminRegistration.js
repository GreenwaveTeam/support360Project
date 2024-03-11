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
  Stack,
  Alert,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function AdminRegistration() {
  const { userID } = useParams();
  const [formData, setFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    password: "",
    designation: "",
    phoneNumber: "",
  });
  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [hideBtn, setHideBtn] = useState(false);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    fetchExistingUser();
  }, []);

  const hashedPasswordChange = (e) => {
    setPass(e.target.value);
  };

  const handleFormdataInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, designation: value });
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    if (!isNaN(value) && value.length <= 10) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const confirmPassword = async (e) => {
    const confirmPass = e.target.value;
    setCnfpass(confirmPass);
    const hashedPassword = await bcrypt.hash(pass, 10);
    setFormData({ ...formData, password: hashedPassword });
    const passwordsMatch = await bcrypt.compare(confirmPass, hashedPassword);
    if (!passwordsMatch) {
      setShowPasswordError(true);
    } else {
      setShowPasswordError(false);
    }
  };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // const checkExixtingUser = async () => {
  //   // const { userID } = useParams;
  //   for (let i of userList) {
  //     // if (i.userID === userID) {
  //     //   setFormData(i);
  //     // }
  //     console.log("i.userID", i.userID);
  //   }
  // };

  // const checkExistingUser = async () => {
  //   const { userID } = useParams;
  //   for (let i of userList) {
  //     if (i.userID === userID) {
  //       setFormData({
  //         userID: i.userID,
  //         name: i.name,
  //         designation: i.designation,
  //         email: i.email,
  //         password: i.password,
  //         phoneNumber: i.phoneNumber,
  //         plantID: i.plantID,
  //         plantName: i.plantName,
  //         address: i.address,
  //         division: i.division,
  //         customerName: i.customerName,
  //         supportStartDate: i.supportStartDate,
  //         supportEndDate: i.supportEndDate,
  //         accountOwnerCustomer: i.accountOwnerCustomer,
  //         accountOwnerGW: i.accountOwnerGW,
  //       });
  //     }
  //     console.log("i.userID", i.userID);
  //   }
  // };

  const fetchExistingUser = async () => {
    try {
      const response = await fetch("http://localhost:8081/admins/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("data : ", data);
      checkExistingUser(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const checkExistingUser = (data) => {
    for (let i of data) {
      if (i.userID === userID) {
        setUserExist(true);
        setFormData((prevData) => ({
          ...prevData,
          adminID: i.adminID,
          name: i.name,
          designation: i.designation,
          email: i.email,
          password: i.password,
          phoneNumber: i.phoneNumber,
        }));
      }
    }
  };

  console.log("formData", formData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.created) {
        console.log("User registered successfully");
      } else {
        console.error("Failed to register user");
      }
      console.log("formDataWithChangedPassword : ", formData);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("formData : ", formData);
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
          User Registration Page
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box component="table" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Textfield
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={formData.name}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  autoComplete="userID"
                  name="userID"
                  required
                  fullWidth
                  id="userID"
                  label="User ID"
                  value={formData.userID}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <FormControl fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    required
                    id="designation"
                    value={formData.designation}
                    label="Designation"
                    onChange={handleDesignationChange}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    <MenuItem value={"Ten"}>Ten</MenuItem>
                    <MenuItem value={"Twenty"}>Twenty</MenuItem>
                    <MenuItem value={"Thirty"}>Thirty</MenuItem>
                  </Select>
                </FormControl> */}
                <Dropdown
                  id="designation"
                  value={formData.designation}
                  label="Designation"
                  onChange={handleDesignationChange}
                  list={["Ten", "Twenty", "Thirty"]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  // type="password"
                  id="password"
                  // autoComplete="new-password"
                  value={pass}
                  onChange={hashedPasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  // type="password"
                  id="confirmPassword"
                  value={cnfpass}
                  onChange={(e) => confirmPassword(e)}
                />
              </Grid>
              {showPasswordError && (
                <Stack
                  sx={{ display: "flex", justifyContent: "right" }}
                  spacing={2}
                >
                  <Alert variant="filled" severity="error">
                    Password Does Not Match
                  </Alert>
                </Stack>
              )}
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  autoComplete="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </Grid>
            </Grid>
            {userExist ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update User
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register User
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
}
