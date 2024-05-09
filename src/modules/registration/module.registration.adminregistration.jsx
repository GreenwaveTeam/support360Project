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
    adminID: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    homepage: "",
  });

  const [formErrors, setFormErrors] = useState({
    adminID: false,
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

  const [updateFormErrors, setUpdateFormErrors] = useState({
    adminID: false,
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
    adminID: "",
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
        adminID: state.admin.userID,
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

  const urllist = [{ pageName: "Admin Home Page", pagelink: "/admin/home" }];

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    for (const key in updateFormData) {
      if (updateFormData[key] === null || updateFormData[key] === "") {
        handleClick();
        setSnackbarText(`${key} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${key} must be filled`);
        return;
      }
    }
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
      } else {
        console.error("Failed to update admin");
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
        setSnackbarText(`${key} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${key} must be filled`);
        return;
      }
    }

    if (cnfpass === "") {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      return;
    }

    if (pass !== cnfpass) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      return;
    }

    if (formData["phoneNumber"].length !== 10) {
      handleClick();
      setSnackbarText("Phone Number must be 10 digits");
      setsnackbarSeverity("error");
      console.log("Phone Number must be 10 digits");
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
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     name: removeAllSpecialChar(e.target.value),
                        //   })
                        // }
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
                              ? e.target.value
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
                        autoComplete="adminID"
                        name="adminID"
                        required
                        fullWidth
                        id="adminID"
                        label="Admin ID"
                        value={updateFormData.adminID}
                        // onChange={(e) =>
                        //   setUpdateFormData({
                        //     ...updateFormData,
                        //     adminID: removeNumberAndSpecialChar(
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
                              ? e.target.value
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
                        autoComplete="adminID"
                        name="adminID"
                        required
                        fullWidth
                        id="adminID"
                        label="Admin ID"
                        value={formData.adminID}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            adminID: removeOnlySpecialChar(
                              removeSpaceAndLowerCase(e.target.value)
                            ),
                          });
                          setFormErrors({
                            ...formErrors,
                            adminID: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.adminID}
                        helperText={
                          formErrors.adminID && "AdminID must be filled"
                        }
                      /> */}
                      <FormControl fullWidth error={formErrors.adminID}>
                        <InputLabel htmlFor="adminID">AdminID</InputLabel>
                        <OutlinedInput
                          autoComplete="adminID"
                          name="adminID"
                          required
                          fullWidth
                          id="adminID"
                          label="AdminID"
                          value={formData.adminID}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              adminID: removeOnlySpecialChar(e.target.value),
                            });
                            setUnchangedAdminID(e.target.value);
                            setFormErrors({
                              ...formErrors,
                              adminID: e.target.value.trim() === "",
                            });
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Auto-fill AdminID with Email Address">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        formData.adminID === formData.email
                                      }
                                      onChange={(e) => {
                                        setFormData({
                                          ...formData,
                                          adminID:
                                            formData.adminID === formData.email
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
                        {formErrors.adminID && (
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
                          formErrors.password || formErrors.passwordNotMatch
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
                            setFormData({
                              ...formData,
                              password: password,
                            });
                            setFormErrors({
                              ...formErrors,
                              password: password.trim() === "",
                              passwordNotMatch: password !== cnfpass,
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
