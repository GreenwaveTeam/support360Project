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
import { useNavigate, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function AdminRegistration() {
  const { adminID } = useParams();
  const [formData, setFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
  });
  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [adminExist, setAdminExist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    fetchExistingAdmin();
  }, []);

  const hashedPasswordChange = (e) => {
    setPass(e.target.value);
  };

  const handleFormdataInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, role: value });
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

  const fetchExistingAdmin = async () => {
    try {
      const response = await fetch("http://localhost:8081/admins/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      checkExistingAdmin(data);
    } catch (error) {
      console.error("Error fetching Admin list:", error);
    }
  };

  const checkExistingAdmin = (data) => {
    for (let i of data) {
      if (i.adminID === adminID) {
        setAdminExist(true);
        setFormData((prevData) => ({
          ...prevData,
          adminID: i.adminID,
          name: i.name,
          email: i.email,
          password: i.password,
          role: i.role,
          phoneNumber: i.phoneNumber,
        }));
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8081/admins/admin/${formData.adminID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("admin Updated successfully");
        navigate(`/ad/${formData.adminID}`, {
          state: { adminName: formData.name },
        });
      } else {
        console.error("Failed to update admin");
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/admins/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Admin registered successfully");
        navigate(`/ad/${formData.adminID}`, {
          state: { adminName: formData.name },
        });
      } else {
        console.error("Failed to register Admin");
      }
    } catch (error) {
      console.error("Error : ", error);
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
          admin Registration Page
        </Typography>
        <form>
          <Box noValidate sx={{ mt: 3 }}>
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
                  autoComplete="adminID"
                  name="adminID"
                  required
                  fullWidth
                  id="adminID"
                  label="Admin ID"
                  value={formData.adminID}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Dropdown
                  id="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleRoleChange}
                  list={["Manager", "Developer", "Support Team"]}
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
              {!adminExist && (
                <Grid item xs={12}>
                  <Textfield
                    required
                    style={{ width: "90%" }}
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    // autoComplete="new-password"
                    value={pass}
                    onChange={hashedPasswordChange}
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
              )}
              {!adminExist && (
                <Grid item xs={12}>
                  <Textfield
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={cnfpass}
                    onChange={(e) => confirmPassword(e)}
                  />
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
                </Grid>
              )}
              {/* {showPasswordError && (
                <Stack
                  sx={{ display: "flex", justifyContent: "right" }}
                  spacing={2}
                >
                  <Alert variant="filled" severity="error">
                    Password Does Not Match
                  </Alert>
                </Stack>
              )} */}
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
            {adminExist ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleUpdate}
              >
                Update Admin
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Register Admin
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
}
