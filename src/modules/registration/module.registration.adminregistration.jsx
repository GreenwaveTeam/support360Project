import React, { useEffect, useState } from "react";
import {
  Avatar,
  CssBaseline,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Snackbar,
  Slide,
  FormHelperText,
  MenuItem,
  Select,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import Textfield from "../../components/textfield/textfield.component";
import { useLocation, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { extendTokenExpiration } from "../helper/Support360Api";

export default function AdminRegistration({ sendUrllist }) {
  const [formData, setFormData] = useState({
    adminId: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    homepage: "",
  });

  const [formErrors, setFormErrors] = useState({
    adminId: false,
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
    role: false,
    homepage: false,
    confirmPassword: false,
    phoneNumberLength: false,
    passwordNotMatch: false,
    weakPassword: false,
  });

  const [updateFormErrors, setUpdateFormErrors] = useState({
    adminId: false,
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
    role: false,
    homepage: false,
    confirmPassword: false,
    phoneNumberLength: false,
    passwordNotMatch: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    adminId: "",
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    homepage: "",
  });

  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [isStatePresent, setIsStatePresent] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const [snackbarText, setSnackbarText] = useState("");
  const [passwordErrorOpen, setPasswordErrorOpen] = useState(false);
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [unchangedAdminID, setUnchangedAdminID] = useState("");

  const { state } = useLocation();

  const checkstate = () => {
    if (state === null) {
      setIsStatePresent(false);
    } else {
      setIsStatePresent(true);
      setUpdateFormData({
        adminId: state.admin.userId,
        name: state.admin.name,
        email: state.admin.email,
        phoneNumber: state.admin.phoneNumber,
        role: state.admin.role,
        homepage: state.admin.homepage,
      });
      console.log("state.admin.role : ", state.admin.role);
      console.log("state.admin.homepage : ", state.admin.homepage);
      console.log("updateFormData.homepage : ", updateFormData.homepage);
    }
  };

  useEffect(() => {
    extendTokenExpiration();
    checkstate();
    fetchRoles();
    sendUrllist(urllist);
  }, []);

  const urllist =
    state === null
      ? [
          { pageName: "Admin Home", pagelink: "/admin/home" },
          {
            pageName: "Admin Registration",
            pagelink: "/admin/adminregistration",
          },
        ]
      : [
          { pageName: "Admin Home", pagelink: "/admin/home" },
          { pageName: "Admin Update", pagelink: "/admin/adminregistration" },
        ];

  const confirmPassword = async (e) => {
    const passwordsMatch = pass === e;
    if (!passwordsMatch) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
    }
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPasswordErrorOpen(false);
  };

  const handleClick = () => {
    setPasswordErrorOpen(true);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  function convertToTitleCase(str) {
    let words = str.split(/(?=[A-Z])/);
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  function removeSpaceAndLowerCase(str) {
    return str.replace(/\s/g, "").toLowerCase();
  }

  function removeAllSpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z\s]/g, "");
    var stringWithoutExtraSpaces = stringWithoutSpecialChars.replace(
      /\s+/g,
      " "
    );
    return stringWithoutExtraSpaces;
  }

  function removeOnlySpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9@.]/g, "");
    var atIndex = stringWithoutSpecialChars.indexOf("@");
    if (atIndex !== -1) {
      var nextAtIndex = stringWithoutSpecialChars.indexOf("@", atIndex + 1);
      if (nextAtIndex !== -1) {
        stringWithoutSpecialChars = stringWithoutSpecialChars.slice(
          0,
          nextAtIndex
        );
      }
    }
    return stringWithoutSpecialChars;
  }

  function removeNumberAndSpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z@.]/g, "");
    var atIndex = stringWithoutSpecialChars.indexOf("@");
    if (atIndex !== -1) {
      var nextAtIndex = stringWithoutSpecialChars.indexOf("@", atIndex + 1);
      if (nextAtIndex !== -1) {
        stringWithoutSpecialChars = stringWithoutSpecialChars.slice(
          0,
          nextAtIndex
        );
      }
    }
    return stringWithoutSpecialChars;
  }

  function removeAllExceptNumber(str) {
    var stringWithOnlyNumber = str.replace(/[^0-9]/g, "");
    return stringWithOnlyNumber;
  }

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

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    } else if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    for (const key in updateFormData) {
      if (updateFormData[key] === null || updateFormData[key] === "") {
        handleClick();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${convertToTitleCase(key)} must be filled`);
        setUpdateFormErrors({ ...updateFormErrors, [key]: true });
        return;
      }
    }
    try {
      console.log(
        "updateFormData.adminId : ",
        `http://localhost:8081/admins/admin/${updateFormData.adminId}`
      );
      console.log("updateFormData : ", updateFormData);
      const response = await fetch(
        `http://localhost:8081/admins/admin/${updateFormData.adminId}`,
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
        navigate("/admin/home");
      } else {
        console.error("Failed to update admin");
        handleClick();
        setSnackbarText("Failed to update Admin");
        setsnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === null || formData[key] === "") {
        newFormErrors[key] = true;
      } else if (cnfpass === "") {
        setFormErrors({ ...formErrors, confirmPassword: cnfpass === "" });
      } else if (formData.phoneNumber.length !== 10) {
        setFormErrors({ ...formErrors, phoneNumberLength: true });
      } else if (pass !== cnfpass) {
        setFormErrors({ ...formErrors, passwordNotMatch: true });
      } else {
        newFormErrors[key] = false;
      }
    });
    setFormErrors(newFormErrors);

    console.log("newFormErrors : ", newFormErrors);

    for (const key in formData) {
      if (formData[key] === null || formData[key] === "") {
        handleClick();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        setFormErrors({ ...formErrors, [key]: true });
        console.log(`${convertToTitleCase(key)} must be filled`);
        return;
      }
    }

    if (!validatePassword(pass)) {
      handleClick();
      setSnackbarText(
        "Password must contain at least 6 characters, including uppercase, lowercase, numeric, and special characters"
      );
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, weakPassword: true });
      return;
    }

    if (cnfpass === "") {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, confirmPassword: true });
      return;
    }

    if (pass !== cnfpass) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, passwordNotMatch: true });
      return;
    }

    if (formData["phoneNumber"].length !== 10) {
      handleClick();
      setSnackbarText("Phone Number must be 10 digits");
      setsnackbarSeverity("error");
      console.log("Phone Number must be 10 digits");
      setFormErrors({ ...formErrors, phoneNumberLength: true });
      return;
    }

    console.log("formData : : ", formData);
    try {
      const response = await fetch("http://localhost:8081/auth/admin/signup", {
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
    <>
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
                  {updateFormData.adminId}
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
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     name: removeAllSpecialChar(e.target.value),
                        //   })
                        // }
                        onBlur={(e) => {
                          setUpdateFormData({
                            ...updateFormData,
                            name: e.target.value.trim(),
                          });
                        }}
                        onChange={(e) => {
                          setUpdateFormData({
                            ...updateFormData,
                            name: removeAllSpecialChar(e.target.value),
                          });
                          setUpdateFormErrors({
                            ...updateFormErrors,
                            name: e.target.value.trim() === "",
                          });
                        }}
                        error={updateFormErrors.name}
                        helperText={
                          updateFormErrors.name && "Name must be filled"
                        }
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
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     phoneNumber: removeSpaceAndLowerCase(
                        //       e.target.value
                        //     ),
                        //   })
                        // }
                        onBlur={(e) => {
                          setUpdateFormData({
                            ...updateFormData,
                            phoneNumber: e.target.value.trim(),
                          });
                        }}
                        onChange={(e) => {
                          const isValidPhoneNumber =
                            !isNaN(e.target.value) &&
                            e.target.value.length <= 10;
                          const isPhoneNumberFilled =
                            e.target.value.trim() === "";
                          const isPhoneNumberLengthValid =
                            e.target.value.length <= 9;
                          setUpdateFormData({
                            ...updateFormData,
                            phoneNumber: isValidPhoneNumber
                              ? removeAllExceptNumber(e.target.value)
                              : updateFormData.phoneNumber,
                          });
                          setUpdateFormErrors({
                            ...updateFormErrors,
                            phoneNumber: isPhoneNumberFilled,
                            phoneNumberLength: isPhoneNumberLengthValid,
                          });
                        }}
                        error={
                          updateFormErrors.phoneNumber ||
                          updateFormErrors.phoneNumberLength
                        }
                        helperText={
                          (updateFormErrors.phoneNumber &&
                            "Phone Number must be filled") ||
                          (updateFormErrors.phoneNumberLength &&
                            "Phone Number must be 10 digits")
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        InputProps={{ readOnly: true }}
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={updateFormData.email}
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     email: removeNumberAndSpecialChar(
                        //       removeSpaceAndLowerCase(e.target.value)
                        //     ),
                        //   })
                        // }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        InputProps={{ readOnly: true }}
                        autoComplete="adminId"
                        name="adminId"
                        required
                        fullWidth
                        id="adminId"
                        label="Admin ID"
                        value={updateFormData.adminId}
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     adminId: removeNumberAndSpecialChar(
                        //       removeSpaceAndLowerCase(e.target.value)
                        //     ),
                        //   })
                        // }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Dropdown
                        fullWidth
                        id="role"
                        value={updateFormData.role}
                        label="Role"
                        onChange={(e) => {
                          const { value } = e.target;
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
                      /> */}
                      <FormControl fullWidth error={updateFormErrors.role}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          label="Role"
                          id="role"
                          value={updateFormData.role}
                          onChange={(e) => {
                            const selectedRole = e.target.value;
                            setUpdateFormData({
                              ...updateFormData,
                              role: selectedRole,
                            });
                            if (selectedRole !== "") {
                              setUpdateFormErrors({
                                ...updateFormErrors,
                                role: false,
                              });
                            } else {
                              setUpdateFormErrors({
                                ...updateFormErrors,
                                role: true,
                              });
                            }
                          }}
                        >
                          {roleList.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                        {updateFormErrors.role && (
                          <FormHelperText>Role must be filled</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Dropdown
                        fullWidth
                        id="homepage"
                        value={updateFormData.homepage}
                        label="Homepage"
                        onChange={updateHandleHomepageChange}
                        list={["admin/home", "user/home"]}
                      /> */}
                      <FormControl fullWidth error={updateFormErrors.homepage}>
                        <InputLabel id="homepage-label">Homepage</InputLabel>
                        <Select
                          labelId="homepage-label"
                          label="Homepage"
                          id="homepage"
                          value={updateFormData.homepage}
                          onChange={(e) => {
                            const selectedHomepage = e.target.value;
                            setUpdateFormData({
                              ...updateFormData,
                              homepage: selectedHomepage,
                            });
                            if (selectedHomepage !== "") {
                              setUpdateFormErrors({
                                ...updateFormErrors,
                                homepage: false,
                              });
                            } else {
                              setUpdateFormErrors({
                                ...updateFormErrors,
                                homepage: true,
                              });
                            }
                          }}
                        >
                          <MenuItem value="admin/home">admin/home</MenuItem>
                          <MenuItem value="user/home">user/home</MenuItem>
                        </Select>
                        {updateFormErrors.homepage && (
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
                        onBlur={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value.trim(),
                          });
                        }}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: removeAllSpecialChar(e.target.value),
                          });
                          setFormErrors({
                            ...formErrors,
                            name: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.name}
                        helperText={formErrors.name && "Name must be filled"}
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
                        onBlur={(e) => {
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value.trim(),
                          });
                        }}
                        onChange={(e) => {
                          const isValidPhoneNumber =
                            !isNaN(e.target.value) &&
                            e.target.value.length <= 10;
                          const isPhoneNumberFilled =
                            e.target.value.trim() === "";
                          const isPhoneNumberLengthValid =
                            e.target.value.length <= 9;
                          setFormData({
                            ...formData,
                            phoneNumber: isValidPhoneNumber
                              ? removeAllExceptNumber(e.target.value)
                              : formData.phoneNumber,
                          });
                          setFormErrors({
                            ...formErrors,
                            phoneNumber: isPhoneNumberFilled,
                            phoneNumberLength: isPhoneNumberLengthValid,
                          });
                        }}
                        error={
                          formErrors.phoneNumber || formErrors.phoneNumberLength
                        }
                        helperText={
                          (formErrors.phoneNumber &&
                            "Phone Number must be filled") ||
                          (formErrors.phoneNumberLength &&
                            "Phone Number must be 10 digits")
                        }
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
                        onBlur={(e) => {
                          setFormData({
                            ...formData,
                            email: e.target.value.trim(),
                          });
                        }}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            email: removeNumberAndSpecialChar(
                              removeSpaceAndLowerCase(e.target.value)
                            ),
                          });
                          setFormErrors({
                            ...formErrors,
                            email: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.email}
                        helperText={formErrors.email && "Email must be filled"}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Textfield
                        autoComplete="adminId"
                        name="adminId"
                        required
                        fullWidth
                        id="adminId"
                        label="Admin ID"
                        value={formData.adminId}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            adminId: removeOnlySpecialChar(
                              removeSpaceAndLowerCase(e.target.value)
                            ),
                          });
                          setFormErrors({
                            ...formErrors,
                            adminId: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.adminId}
                        helperText={
                          formErrors.adminId && "AdminID must be filled"
                        }
                      /> */}
                      <FormControl fullWidth error={formErrors.adminId}>
                        <InputLabel htmlFor="adminId">AdminID</InputLabel>
                        <OutlinedInput
                          autoComplete="adminId"
                          name="adminId"
                          required
                          fullWidth
                          id="adminId"
                          label="AdminID"
                          value={formData.adminId}
                          onBlur={(e) => {
                            setFormData({
                              ...formData,
                              adminId: e.target.value.trim(),
                            });
                          }}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              adminId: removeOnlySpecialChar(
                                e.target.value.toLocaleLowerCase()
                              ),
                            });
                            setUnchangedAdminID(e.target.value);
                            setFormErrors({
                              ...formErrors,
                              adminId: e.target.value.trim() === "",
                            });
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Auto-fill AdminID with Email Address">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        formData.adminId === formData.email
                                      }
                                      onChange={(e) => {
                                        setFormData({
                                          ...formData,
                                          adminId:
                                            formData.adminId === formData.email
                                              ? unchangedAdminID
                                              : formData.email,
                                        });
                                      }}
                                      name="autoFillAdminID"
                                      color="primary"
                                    />
                                  }
                                />
                              </Tooltip>
                            </InputAdornment>
                          }
                        />
                        {formErrors.adminId && (
                          <FormHelperText>
                            Admin ID must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        error={
                          formErrors.password ||
                          formErrors.passwordNotMatch ||
                          formErrors.weakPassword
                        }
                      >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          label="Password"
                          autoComplete="password"
                          name="password"
                          required
                          fullWidth
                          id="password"
                          value={pass}
                          onChange={(e) => {
                            const password = e.target.value;
                            setPass(password);
                            const isPasswordValid = validatePassword(password);
                            setFormData({
                              ...formData,
                              password: password,
                            });
                            setFormErrors({
                              ...formErrors,
                              password: password.trim() === "",
                              passwordNotMatch: password !== cnfpass,
                              weakPassword: !isPasswordValid,
                            });
                            console.log(
                              "password !== cnfpass : ",
                              password !== cnfpass
                            );
                          }}
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
                        {formErrors.weakPassword && (
                          <FormHelperText>
                            Password must contain at least 6 characters,
                            including uppercase, lowercase, numeric, and special
                            characters
                          </FormHelperText>
                        )}
                        {formErrors.passwordNotMatch && (
                          <FormHelperText>
                            Password does not match !
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
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
                          setFormErrors({
                            ...formErrors,
                            confirmPassword: e.target.value.trim() === "",
                            passwordNotMatch: pass !== confirmPass,
                          });
                        }}
                        error={
                          formErrors.confirmPassword ||
                          formErrors.passwordNotMatch
                        }
                        helperText={
                          (formErrors.confirmPassword &&
                            "Confirm Password must be filled") ||
                          (formErrors.passwordNotMatch &&
                            "Password does not match !")
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.role}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          label="Role"
                          id="role"
                          value={formData.role}
                          onChange={(e) => {
                            const selectedRole = e.target.value;
                            setFormData({
                              ...formData,
                              role: selectedRole,
                            });
                            if (selectedRole !== "") {
                              setFormErrors({
                                ...formErrors,
                                role: false,
                              });
                            } else {
                              setFormErrors({
                                ...formErrors,
                                role: true,
                              });
                            }
                          }}
                        >
                          <MenuItem value="">
                            <h5>Select Role</h5>
                          </MenuItem>
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
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.homepage}>
                        <InputLabel id="homepage-label">Homepage</InputLabel>
                        <Select
                          labelId="homepage-label"
                          label="Homepage"
                          id="homepage"
                          value={formData.homepage}
                          onChange={(e) => {
                            const selectedHomepage = e.target.value;
                            setFormData({
                              ...formData,
                              homepage: selectedHomepage,
                            });
                            if (selectedHomepage !== "") {
                              setFormErrors({
                                ...formErrors,
                                homepage: false,
                              });
                            } else {
                              setFormErrors({
                                ...formErrors,
                                homepage: true,
                              });
                            }
                          }}
                        >
                          <MenuItem value="">
                            <h5>Select Homepage</h5>
                          </MenuItem>
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
                    Register Admin
                  </Button>
                </Box>
              </form>
            </>
          )}
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
    </>
  );
}
