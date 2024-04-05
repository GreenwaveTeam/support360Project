import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AdminRegistration() {
  const { adminID } = useParams();
  const [formData, setFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    homepage: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    homepage: "",
  });

  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [adminExist, setAdminExist] = useState(false);
  const navigate = useNavigate();
  const [isStatePresent, setIsStatePresent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const { state } = useLocation();
  // const admin = state.admin || null;

  const checkstate = () => {
    // console.log(typeof state.admin);
    if (state === null) {
      setIsStatePresent(false);
    } else {
      setIsStatePresent(true);
      setUpdateFormData({
        adminID: state.admin.adminID,
        name: state.admin.name,
        email: state.admin.email,
        phoneNumber: state.admin.phoneNumber,
        role: state.admin.role,
      });
    }
  };

  useEffect(() => {
    // console.log("admin : ", state.admin);
    checkstate();
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

  const handleHomepageChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, homepage: value });
  };

  const updateHandleHomepageChange = (event) => {
    const { value } = event.target;
    setUpdateFormData({ ...updateFormData, homepage: value });
  };

  const updateHandleFormdataInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const updateHandleDesignationChange = (event) => {
    const { value } = event.target;
    setUpdateFormData({ ...updateFormData, designation: value });
  };

  const updateHandleRoleChange = (event) => {
    const { value } = event.target;
    setUpdateFormData({ ...updateFormData, role: value });
  };

  const updateHandlePhoneNumberChange = (event) => {
    const { value } = event.target;
    if (!isNaN(value) && value.length <= 10) {
      setUpdateFormData({ ...updateFormData, phoneNumber: value });
    }
  };

  const confirmPassword = async (e) => {
    const passwordsMatch = pass === e;
    if (!passwordsMatch) {
      setShowPasswordError(true);
    } else {
      setShowPasswordError(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      console.log(
        "updateFormData.adminID : ",
        `http://localhost:8081/admins/admin/${updateFormData.adminID}`
      );
      console.log("updateFormData : ", updateFormData);
      const response = await fetch(
        `http://localhost:8081/admins/admin/${updateFormData.adminID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateFormData),
        }
      );
      if (response.ok) {
        console.log("Admin Updated successfully");
        // navigate(`/abc/${formData.adminID}`, {
        //   state: { adminName: formData.name },
        // });
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
      const response = await fetch("http://localhost:8081/auth/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Admin registered successfully");
        navigate(`/admin/home`);
      } else if (response.status === 400) {
        console.error("Admin Already Exist");
      } else {
        console.error("Failed to register admin");
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
          Admin Registration Page
        </Typography>

        {isStatePresent ? (
          // update form starts here...

          <>
            <form>
              <Box noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Textfield
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                      value={updateFormData.name}
                      onChange={updateHandleFormdataInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Textfield
                      required
                      fullWidth
                      name="phoneNumber"
                      label="Phone Number"
                      id="phoneNumber"
                      autoComplete="phoneNumber"
                      value={updateFormData.phoneNumber}
                      onChange={updateHandlePhoneNumberChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Textfield
                      required
                      fullWidth
                      id="email"
                      type="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={updateFormData.email}
                      onChange={updateHandleFormdataInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Textfield
                      autoComplete="adminID"
                      name="adminID"
                      required
                      fullWidth
                      id="adminID"
                      label="Admin ID"
                      value={updateFormData.adminID}
                      onChange={updateHandleFormdataInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Dropdown
                      fullWidth
                      id="role"
                      value={updateFormData.role}
                      label="Role"
                      onChange={updateHandleRoleChange}
                      list={["admin", "superadmin", "developer"]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Dropdown
                      fullWidth
                      id="homepage"
                      value={updateFormData.homepage}
                      label="Homepage"
                      onChange={updateHandleHomepageChange}
                      list={["", "admin/home", "user/home"]}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleUpdate}
                >
                  Update Admin
                </Button>
              </Box>
            </form>
          </>
        ) : (
          // registration form starts here...

          <>
            <form>
              <Box noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          label="Password"
                          autoComplete="password"
                          name="password"
                          required
                          fullWidth
                          id="password"
                          value={pass}
                          onChange={hashedPasswordChange}
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
                  )}
                  {!adminExist && (
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={cnfpass}
                        onBlur={(e) => confirmPassword(e.target.value)}
                        onChange={(e) => {
                          const confirmPass = e.target.value;
                          setCnfpass(confirmPass);
                        }}
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
                <Box
                  sx={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 9999,
                  }}
                >
                  <Alert variant="filled" severity="error">
                    Password Does Not Match
                  </Alert>
                </Box>
              )} */}
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    <Dropdown
                      fullWidth
                      id="role"
                      value={formData.role}
                      label="Role"
                      onChange={handleRoleChange}
                      list={["admin", "superadmin", "developer"]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Dropdown
                      fullWidth
                      id="homepage"
                      value={formData.homepage}
                      label="Homepage"
                      onChange={handleHomepageChange}
                      list={["admin/home", "user/home"]}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  Register Admin
                </Button>
              </Box>
            </form>
          </>
        )}
      </Box>
    </Container>
  );
}
