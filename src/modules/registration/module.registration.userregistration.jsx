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
  Snackbar,
  Slide,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import { extendTokenExpiration } from "../helper/Support360Api";

export default function UserRegistration({ sendUrllist }) {
  const [newPlantName, setNewPlantName] = useState({
    plantName: "",
    plantID: "",
  });

  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    password: "",
    phoneNumber: "",
    plantID: "",
    plantName: newPlantName.plantName,
    address: "",
    division: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
    homepage: "",
  });

  const [formErrors, setFormErrors] = useState({
    userID: false,
    name: false,
    designation: false,
    email: false,
    password: false,
    // confirmPassword: false,
    phoneNumber: false,
    plantID: false,
    plantName: false,
    address: false,
    division: false,
    customerName: false,
    supportStartDate: false,
    supportEndDate: false,
    accountOwnerCustomer: false,
    accountOwnerGW: false,
    role: false,
    homepage: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    phoneNumber: "",
    plantID: "",
    plantName: newPlantName.plantName,
    address: "",
    division: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
    homepage: "",
  });

  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [plantList, setPlantList] = useState([]);
  const [userExist, setUserExist] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const navigate = useNavigate();
  const [isStatePresent, setIsStatePresent] = useState(false);
  const [unchangedUserID, setUnchangedUserID] = useState("");
  const [roleList, setRoleList] = useState([]);

  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");

  const [passwordErrorOpen, setPasswordErrorOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPasswordErrorOpen(false);
  };

  const handleClick = () => {
    setPasswordErrorOpen(true);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const { state } = useLocation();

  const checkstate = () => {
    // console.log(typeof state.user);
    if (state === null) {
      setIsStatePresent(false);
    } else {
      setIsStatePresent(true);
      setUpdateFormData({
        userID: state.user.userID,
        name: state.user.name,
        designation: state.user.designation,
        email: state.user.email,
        phoneNumber: state.user.phoneNumber,
        plantID: state.user.plantID,
        plantName: state.user.plantName,
        address: state.user.address,
        division: state.user.division,
        customerName: state.user.customerName,
        supportStartDate: state.user.supportStartDate,
        supportEndDate: state.user.supportEndDate,
        accountOwnerCustomer: state.user.accountOwnerCustomer,
        accountOwnerGW: state.user.accountOwnerGW,
        role: state.user.role,
        homepage: state.user.homepage,
      });
      console.log("state.user.homepage : ", state.user.homepage);
    }
  };

  useEffect(() => {
    // console.log("user : ", state.user);
    extendTokenExpiration();
    checkstate();
    fetchData();
    fetchRoles();
    sendUrllist(urllist);
  }, []);

  const urllist = [{ pageName: "Admin Home Page", pagelink: "/admin/home" }];

  const handleAddPlantClick = () => {
    setOpenDeleteDialog(true);
  };

  const hashedPasswordChange = (e) => {
    setPass(e.target.value);
    setFormData({ ...formData, password: e.target.value });
  };

  const handleFormdataInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlenewPlantNameInputChange = (event) => {
    const { name, value } = event.target;
    setNewPlantName({ ...newPlantName, [name]: value });
    setFormData({ ...formData, [name]: value });
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, designation: value });
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, role: value });
  };

  const handleHomepageChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, homepage: value });
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

  const updateHandleHomepageChange = (event) => {
    const { value } = event.target;
    setUpdateFormData({ ...updateFormData, homepage: value });
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
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
    }
  };

  const handleUserIDChange = (event) => {
    setFormData({ ...formData, userID: event.target.value });
    setUnchangedUserID(event.target.value);
    setUpdateFormData({ ...updateFormData, userID: event.target.value });
  };

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
    setUpdateFormData({ ...updateFormData, email: event.target.value });
  };

  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      userID:
        formData.userID === formData.email ? unchangedUserID : formData.email,
    });
  };

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/plants/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        navigate("/admin/home");
        return;
      }
      const data = await response.json();
      console.log("plantDetails : ", data);
      setPlantList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8081/role", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        console.log("error featching roles");
        return;
      }
      const data = await response.json();
      console.log("Roles : ", data);
      setRoleList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postPlantName = async () => {
    try {
      const response = await fetch("http://localhost:8081/plants/plant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlantName),
      });
      if (response.ok) {
        console.log("Plant Added successfully : ", newPlantName);
      } else {
        console.error("Failed to Add Plant");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    fetchData();
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue) {
      const selectedPlant = plantList.find(
        (plant) => plant.plantName === newValue
      );
      setFormData({
        ...formData,
        plantID: selectedPlant ? selectedPlant.plantID : "",
        plantName: newValue,
      });
    } else {
      setFormData({
        ...formData,
        plantID: "",
        plantName: "",
      });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    for (const key in updateFormData) {
      if (updateFormData[key] === null || updateFormData[key] === "") {
        handleClick();
        setSnackbarText(`${key} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${key} must be filled`);
        return;
      }
    }
    if (updateFormData.supportStartDate > updateFormData.supportEndDate) {
      handleClick();
      setSnackbarText(
        "Support Start Date should not be Greater than Support End Date !"
      );
      setsnackbarSeverity("error");
      return;
    }
    try {
      console.log(
        "updateFormData.userID : ",
        `http://localhost:8081/users/user/${updateFormData.userID}`
      );
      console.log("updateFormData : ", updateFormData);
      const response = await fetch(
        `http://localhost:8081/users/user/${updateFormData.userID}`,
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
        console.log("User Updated successfully");
        navigate("/admin/home");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log("formData : : ", formData);
  //   try {
  //     const response = await fetch("http://localhost:8081/auth/user/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     if (response.ok) {
  //       console.log("User registered successfully");
  //       navigate("/admin/home");
  //     } else if (response.status === 400) {
  //       console.error("User Already Exist");
  //     } else {
  //       console.error("Failed to register user");
  //     }
  //   } catch (error) {
  //     console.error("Error : ", error);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newFormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === null || formData[key] === "") {
        newFormErrors[key] = true;
      } else {
        newFormErrors[key] = false;
      }
    });
    setFormErrors(newFormErrors);

    for (const key in formData) {
      if (formData[key] === null || formData[key] === "") {
        handleClick();
        setSnackbarText(`${key} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${key} must be filled`);
        return;
      }
    }
    // if (cnfpass === null || cnfpass === "") {
    //   setFormErrors({ ...formErrors, confirmPassword: true });
    // } else {
    //   setFormErrors({ ...formErrors, confirmPassword: false });
    // }
    // if (cnfpass === null || cnfpass === "") {
    //   handleClick();
    //   setSnackbarText("Confirm Password must be filled");
    //   setsnackbarSeverity("error");
    //   console.log("Confirm Password must be filled");
    //   return;
    // }
    if (cnfpass !== pass) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      return;
    }
    if (formData.supportStartDate > formData.supportEndDate) {
      handleClick();
      setSnackbarText(
        "Support Start Date should not be Greater than Support End Date !"
      );
      setsnackbarSeverity("error");
      return;
    }
    console.log("formData : : ", formData);
    try {
      const response = await fetch("http://localhost:8081/auth/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("success");
        navigate(`/admin/home`);
      } else {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("error");
        return;
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isStatePresent ? (
            // update form starts here...

            <>
              <Avatar
                sx={{
                  backgroundImage:
                    "linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);",
                  width: "45px !important",
                  height: "45px !important",
                }}
              >
                {convertToInitials(updateFormData.name)}
              </Avatar>
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
                      <Dropdown
                        id="designation"
                        value={updateFormData.designation}
                        label="Designation"
                        onChange={updateHandleDesignationChange}
                        list={[
                          "Operator",
                          "Supervisor",
                          "Lab Tester",
                          "Engineer",
                        ]}
                        fullWidth
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
                        onChange={handleEmailChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        InputProps={{ readOnly: true }}
                        autoComplete="userID"
                        name="userID"
                        required
                        fullWidth
                        id="userID"
                        label="User ID"
                        value={updateFormData.userID}
                        onChange={handleUserIDChange}
                      />
                    </Grid>
                    {/* {!userExist && (
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
                          // label="Password"
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
                  {!userExist && (
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
                  )} */}
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
                        value={updateFormData.phoneNumber}
                        onChange={updateHandlePhoneNumberChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Dropdown
                        fullWidth={true}
                        id="plantName"
                        value={updateFormData.plantName}
                        label="Plant Name"
                        onChange={(event) => {
                          const { value } = event.target;
                          for (let i of plantList) {
                            if (i.plantName === value) {
                              setUpdateFormData({
                                ...updateFormData,
                                plantID: i.plantID,
                                plantName: value,
                              });
                              return;
                            }
                          }
                        }}
                        list={plantList.map((p) => p.plantName)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                        <OutlinedInput
                          inputProps={{
                            readOnly: true,
                          }}
                          label="PlantID"
                          autoComplete="PlantID"
                          name="PlantID"
                          required
                          fullWidth
                          id="PlantID"
                          value={updateFormData.plantID}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Add Plant" placement="right">
                                <IconButton
                                  onClick={handleAddPlantClick}
                                  edge="end"
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        id="address"
                        autoComplete="address"
                        value={updateFormData.address}
                        onChange={updateHandleFormdataInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="division"
                        label="Division"
                        id="division"
                        autoComplete="division"
                        value={updateFormData.division}
                        onChange={updateHandleFormdataInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="customerName"
                        label="Customer Name"
                        id="customerName"
                        autoComplete="customerName"
                        value={updateFormData.customerName}
                        onChange={updateHandleFormdataInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Datepicker
                        label="Support Start Date"
                        value={dayjs(updateFormData.supportStartDate)}
                        onChange={(startDate) =>
                          setUpdateFormData({
                            ...updateFormData,
                            supportStartDate: startDate,
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Datepicker
                        label="Support End Date"
                        value={dayjs(updateFormData.supportEndDate)}
                        onChange={(endDate) =>
                          setUpdateFormData({
                            ...updateFormData,
                            supportEndDate: endDate,
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="accountOwnerCustomer"
                        label="Account Owner Customer"
                        id="accountOwnerCustomer"
                        autoComplete="accountOwnerCustomer"
                        value={updateFormData.accountOwnerCustomer}
                        onChange={updateHandleFormdataInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="accountOwnerGW"
                        label="Account Owner GW"
                        id="accountOwnerGW"
                        autoComplete="accountOwnerGW"
                        value={updateFormData.accountOwnerGW}
                        onChange={updateHandleFormdataInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Dropdown
                        fullWidth
                        id="role"
                        value={updateFormData.role}
                        label="Role"
                        // onChange={updateHandleRoleChange}
                        // list={roleList}
                        onChange={(event) => {
                          const { value } = event.target;
                          for (let i of roleList) {
                            if (i === value) {
                              setUpdateFormData({
                                ...updateFormData,
                                role: value,
                              });
                              return;
                            }
                          }
                        }}
                        list={roleList.map((p) => p)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Dropdown
                        fullWidth
                        id="homepage"
                        value={updateFormData.homepage}
                        label="Homepage"
                        onChange={updateHandleHomepageChange}
                        list={["admin/home", "user/home"]}
                        // onChange={(event) => {
                        //   const { value } = event.target;
                        //   for (let i of roleList) {
                        //     if (i === value) {
                        //       setUpdateFormData({
                        //         ...updateFormData,
                        //         role: value,
                        //       });
                        //       return;
                        //     }
                        //   }
                        // }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    color="secondary"
                    fullWidth
                    startIcon={<SaveSharpIcon />}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleUpdate}
                  >
                    Update User
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            // registration form starts here...

            <>
              <Avatar>{convertToInitials(formData.name)}</Avatar>
              <br></br>
              <Typography component="h1" variant="h5">
                User Registration Page
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
                        error={formErrors.name}
                        helperText={formErrors.name && "Name must be filled"}
                      />
                    </Grid>
                    {/* <Grid item xs={6}>
                      <Dropdown
                        id="designation"
                        value={formData.designation}
                        label="Designation"
                        onChange={handleDesignationChange}
                        list={["Operator", "Supervisor", "Lab Tester"]}
                        fullWidth
                        error={formErrors.designation}
                        helperText={
                          formErrors.designation &&
                          "Designation must be filled"
                        }
                      />
                    </Grid> */}
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.designation}>
                        <InputLabel id="designation-label">
                          Designation
                        </InputLabel>
                        <Select
                          labelId="designation-label"
                          label="Designation"
                          id="designation"
                          value={formData.designation}
                          onChange={handleDesignationChange}
                        >
                          <MenuItem value="Operator">Operator</MenuItem>
                          <MenuItem value="Supervisor">Supervisor</MenuItem>
                          <MenuItem value="Lab Tester">Lab Tester</MenuItem>
                        </Select>
                        {formErrors.designation && (
                          <FormHelperText>
                            Designation must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
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
                        error={formErrors.email}
                        helperText={
                          formErrors.email && "Email Address must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.userID}>
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
                        {formErrors.userID && (
                          <FormHelperText>
                            User ID must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    {!userExist && (
                      <Grid item xs={6}>
                        <FormControl fullWidth error={formErrors.password}>
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
                          {formErrors.password && (
                            <FormHelperText>
                              Password must be filled
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}
                    {!userExist && (
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
                          error={formErrors.confirmPassword}
                          helperText={
                            formErrors.confirmPassword &&
                            "Confirm Password must be filled"
                          }
                        />
                        {/* {showPasswordError && (
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
                              // handleClick();
                              // setSnackbarText("User ID and password are required.");
                              // setsnackbarSeverity("error");
                            )} */}
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
                        error={formErrors.phoneNumber}
                        helperText={
                          formErrors.phoneNumber &&
                          "Phone Number must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Dropdown
                        fullWidth={true}
                        id="plantName"
                        value={formData.plantName}
                        label="Plant Name"
                        onChange={(event) => {
                          const { value } = event.target;
                          for (let i of plantList) {
                            if (i.plantName === value) {
                              setFormData({
                                ...formData,
                                plantID: i.plantID,
                                plantName: value,
                              });
                              return;
                            }
                          }
                        }}
                        list={plantList.map((p) => p.plantName)}
                      /> */}
                      <Autocomplete
                        value={formData.plantName}
                        disablePortal
                        fullWidth
                        id="plantName"
                        options={plantList.map((p) => p.plantName)}
                        getOptionLabel={(option) => option}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Plant Name"
                            error={formErrors.plantName}
                            helperText={
                              formErrors.plantName &&
                              "Plant Name must be filled"
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.plantID}>
                        <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                        <OutlinedInput
                          inputProps={{
                            readOnly: true,
                          }}
                          label="PlantID"
                          autoComplete="PlantID"
                          name="PlantID"
                          required
                          fullWidth
                          id="PlantID"
                          value={formData.plantID}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Add Plant">
                                <IconButton
                                  onClick={handleAddPlantClick}
                                  edge="end"
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          }
                        />
                        {formErrors.plantID && (
                          <FormHelperText>
                            Designation must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        id="address"
                        autoComplete="address"
                        value={formData.address}
                        onChange={handleFormdataInputChange}
                        error={formErrors.address}
                        helperText={
                          formErrors.address && "Address must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="division"
                        label="Division"
                        id="division"
                        autoComplete="division"
                        value={formData.division}
                        onChange={handleFormdataInputChange}
                        error={formErrors.division}
                        helperText={
                          formErrors.division && "Division must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="customerName"
                        label="Customer Name"
                        id="customerName"
                        autoComplete="customerName"
                        value={formData.customerName}
                        onChange={handleFormdataInputChange}
                        error={formErrors.customerName}
                        helperText={
                          formErrors.customerName &&
                          "Customer Name must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Support Start Date"
                    value={formData.supportStartDate}
                    onChange={(startDate) =>
                      setFormData({ ...formData, supportStartDate: startDate })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider> */}
                      <Datepicker
                        label="Support Start Date"
                        value={formData.supportStartDate}
                        onChange={(startDate) =>
                          setFormData({
                            ...formData,
                            supportStartDate: startDate,
                          })
                        }
                        // defaultValue={dayjs("04/17/2022")}
                        // convertDateFormat(i.supportStartDate),
                        // "DD-MM-YYYY"
                        // format="DD-MM-YYYY"
                        error={!formData.supportStartDate}
                        helperText={
                          !formData.supportStartDate &&
                          "Support Start Date must be filled"
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Datepicker
                        label="Support End Date"
                        value={formData.supportEndDate}
                        onChange={(endDate) => {
                          setFormData({
                            ...formData,
                            supportEndDate: endDate,
                          });
                        }}
                        error={!formData.supportEndDate}
                        helperText={
                          !formData.supportEndDate &&
                          "Support End Date must be filled"
                        }
                        // defaultValue={dayjs("2022-04-17")}
                        // format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="accountOwnerCustomer"
                        label="Account Owner Customer"
                        id="accountOwnerCustomer"
                        autoComplete="accountOwnerCustomer"
                        value={formData.accountOwnerCustomer}
                        onChange={handleFormdataInputChange}
                        error={formErrors.accountOwnerCustomer}
                        helperText={
                          formErrors.accountOwnerCustomer &&
                          "Account Owner Customer must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="accountOwnerGW"
                        label="Account Owner GW"
                        id="accountOwnerGW"
                        autoComplete="accountOwnerGW"
                        value={formData.accountOwnerGW}
                        onChange={handleFormdataInputChange}
                        error={formErrors.accountOwnerGW}
                        helperText={
                          formErrors.accountOwnerGW &&
                          "Account Owner GW must be filled"
                        }
                      />
                    </Grid>
                    {/* <Grid item xs={6}>
                      <Dropdown
                        fullWidth
                        id="role"
                        value={formData.role}
                        label="Role"
                        // onChange={handleRoleChange}
                        // list={["ROLE_USER", "ROLE_SUPERVISOR"]}
                        onChange={(event) => {
                          const { value } = event.target;
                          for (let i of roleList) {
                            if (i === value) {
                              setFormData({
                                ...formData,
                                role: value,
                              });
                              return;
                            }
                          }
                        }}
                        list={roleList.map((p) => p)}
                        error={formErrors.role}
                        helperText={formErrors.role && "Role must be filled"}
                      />
                    </Grid> */}
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.role}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          label="Role"
                          id="role"
                          value={formData.role}
                          onChange={(event) => {
                            const { value } = event.target;
                            for (let i of roleList) {
                              if (i === value) {
                                setFormData({
                                  ...formData,
                                  role: value,
                                });
                                return;
                              }
                            }
                          }}
                        >
                          {roleList.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors.role && (
                          <FormHelperText>Role must be filled</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <Dropdown
                        fullWidth
                        id="homepage"
                        value={formData.homepage}
                        label="Homepage"
                        onChange={handleHomepageChange}
                        list={["admin/home", "user/home"]}
                      />
                    </Grid> */}
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.homepage}>
                        <InputLabel id="homepage-label">Homepage</InputLabel>
                        <Select
                          labelId="homepage-label"
                          label="Homepage"
                          id="homepage"
                          value={formData.homepage}
                          onChange={handleHomepageChange}
                        >
                          <MenuItem value="admin/home">admin/home</MenuItem>
                          <MenuItem value="user/home">user/home</MenuItem>
                        </Select>
                        {formErrors.homepage && (
                          <FormHelperText>
                            Homepage must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                  >
                    Register User
                  </Button>
                </Box>
              </form>
            </>
          )}
          <>
            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Add New Plant"}
              </DialogTitle>
              <DialogContent style={{ padding: "10px" }}>
                <Textfield
                  required
                  fullWidth={true}
                  name="plantName"
                  label="Plant Name"
                  id="plantName"
                  value={newPlantName.plantName}
                  onChange={handlenewPlantNameInputChange}
                />
                <Textfield
                  style={{ marginTop: "20px" }}
                  required
                  fullWidth={true}
                  name="plantID"
                  label="PlantID"
                  id="plantID"
                  value={newPlantName.plantID}
                  onChange={handlenewPlantNameInputChange}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenDeleteDialog(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOpenDeleteDialog(false);
                    postPlantName();
                    fetchData();
                  }}
                  color="error"
                  autoFocus
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </Box>
      </Container>
      <Snackbar
        open={passwordErrorOpen}
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
    </Box>
    //   </Main>
    // </Box>
  );
}
