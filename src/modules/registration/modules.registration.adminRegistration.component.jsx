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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import Main from "../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";

export default function AdminRegistration() {
  const { adminID } = useParams();
  const [formData, setFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    adminID: "",
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [adminExist, setAdminExist] = useState(false);
  const navigate = useNavigate();
  const [isStatePresent, setIsStatePresent] = useState(false);
  const [unchangedUserID, setUnchangedUserID] = useState("");

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

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
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

  const handleUserIDChange = (event) => {
    setFormData({ ...formData, userID: event.target.value });
    setUnchangedUserID(event.target.value);
  };

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      userID:
        formData.userID === formData.email ? unchangedUserID : formData.email,
    });
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
        navigate(`/AdminHome`);
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
    <Box sx={{ display: "flex" }}>
      <TopbarPage
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[{ pageName: "Admin Home Page", pagelink: "/AdminHome" }]}
      />
      <SidebarPage
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[
          {
            pagename: "Device Issue Category",
            pagelink: "/admin/Device/CategoryConfigure",
          },
          { pagename: "Application", pagelink: "/admin/ApplicationConfigure" },
          { pagename: "Device ", pagelink: "/admin/DeviceConfigure" },
          {
            pagename: "Infrastructure ",
            pagelink: "/admin/InfrastructureConfigure",
          },
        ]}
        userList={[
          {
            pagename: "Report Application",
            pagelink: "/user/ReportApplication",
          },
          {
            pagename: "Report Infrastructure",
            pagelink: "/user/ReportInfrastructure",
          },
          { pagename: "Report Device", pagelink: "/user/ReportDevice" },
        ]}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
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
              {isStatePresent ? (
                // update form starts here...

                <>
                  <Avatar>{convertToInitials(updateFormData.name)}</Avatar>
                  <br></br>
                  <Typography component="h1" variant="h5">
                    Update for :{"  "}
                    <Typography
                      component="span"
                      variant="h4"
                      sx={{ fontWeight: "bold" }}
                    >
                      {updateFormData.userID}
                    </Typography>
                  </Typography>
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
                            InputProps={{ readOnly: true }}
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
                        <Grid item xs={12}>
                          <Dropdown
                            fullWidth
                            id="role"
                            value={updateFormData.role}
                            label="Role"
                            onChange={updateHandleRoleChange}
                            list={[
                              "ROLE_ADMIN",
                              "ROLE_DEVELOPER",
                              "ROLE_TESTER",
                            ]}
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
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <HowToRegTwoToneIcon />
                  </Avatar>
                  <br></br>
                  <Typography component="h1" variant="h5">
                    Admin Registration Page
                  </Typography>
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
                          <Textfield
                            required
                            fullWidth
                            id="email"
                            type="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="userID">userID</InputLabel>
                            <OutlinedInput
                              autoComplete="userID"
                              name="userID"
                              required
                              fullWidth
                              id="userID"
                              label="User ID"
                              value={formData.userID}
                              onChange={handleUserIDChange}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Tooltip title="Auto-fill UserID with Email Address">
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            formData.userID === formData.email
                                          }
                                          onChange={handleCheckboxChange}
                                          name="autoFillUserID"
                                          color="primary"
                                        />
                                      }
                                    />
                                  </Tooltip>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </Grid>
                        {!adminExist && (
                          <Grid item xs={6}>
                            <FormControl fullWidth>
                              <InputLabel htmlFor="password">
                                Password
                              </InputLabel>
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
                                sx={{
                                  display: "flex",
                                  justifyContent: "right",
                                }}
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
                        <Grid item xs={12}>
                          <Dropdown
                            fullWidth
                            id="role"
                            value={formData.role}
                            label="Role"
                            onChange={handleRoleChange}
                            list={[
                              "ROLE_DEVELOPER",
                              "ROLE_ADMIN",
                              "ROLE_TESTER",
                            ]}
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
        </Box>
      </Main>
    </Box>
  );
}
