import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Avatar,
  CssBaseline,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Alert,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";

export default function UserRegistration() {
  const [cnfpass, setCnfpass] = useState("");
  const [formData, setFormData] = useState({
    userID: "6543",
    name: "",
    designation: "",
    email: "",
    password: "",
    phoneNumber: "",
    plantID: "tewyguhs",
    plantName: "",
    address: "",
    business: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
  });
  const [showError, setShowError] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, designation: value });
  };

  const checkPassword = async () => {
    return await bcrypt.compare(formData.password, cnfpass);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordsMatch = await checkPassword();

    if (!passwordsMatch) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const formDataWithChangedPassword = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithChangedPassword),
      });
      if (response.created) {
        console.log("User registered successfully");
      } else {
        console.error("Failed to register user");
      }
      console.log(
        "formDataWithChangedPassword : ",
        formDataWithChangedPassword
      );
    } catch (error) {
      console.error("Error:", error);
    }
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
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
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
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  // autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={cnfpass}
                  onChange={(e) => setCnfpass(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="number"
                  id="phoneNumber"
                  autoComplete="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="plantName"
                  label="Plant Name"
                  id="plantName"
                  autoComplete="plantName"
                  value={formData.plantName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  autoComplete="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="business"
                  label="Business"
                  id="business"
                  autoComplete="business"
                  value={formData.business}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="customerName"
                  label="Customer Name"
                  id="customerName"
                  autoComplete="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Support Start Date"
                    value={formData.supportStartDate}
                    onChange={(startDate) =>
                      setFormData({ ...formData, supportStartDate: startDate })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Support End Date"
                    value={formData.supportEndDate}
                    onChange={(endDate) =>
                      setFormData({ ...formData, supportEndDate: endDate })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="accountOwnerCustomer"
                  label="Account Owner Customer"
                  id="accountOwnerCustomer"
                  autoComplete="accountOwnerCustomer"
                  value={formData.accountOwnerCustomer}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="accountOwnerGW"
                  label="Account Owner GW"
                  id="accountOwnerGW"
                  autoComplete="accountOwnerGW"
                  value={formData.accountOwnerGW}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            {showError && (
              <Stack
                sx={{ display: "flex", justifyContent: "right" }}
                spacing={2}
              >
                <Alert variant="filled" severity="error">
                  Password Does Not Match
                </Alert>
              </Stack>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register User
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
