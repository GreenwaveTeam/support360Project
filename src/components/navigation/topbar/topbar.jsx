import React, { useEffect, useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import BreadCrumbs from "../../breadcrumbs/breadcrumbs.component";
import {
  Alert,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  OutlinedInput,
  Paper,
  Slide,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { logout } from "../../../modules/helper/AuthService";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//Icon
import MoreVertIcon from "@mui/icons-material/MoreVert";
//import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { Box } from "@mui/system";

import gwlogo from "../../../../src/resources/images/gwlogo.png";
import Textfield from "../../textfield/textfield.component";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopbarPage = ({ open, handleDrawerOpen, urllist }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [dialogopen, setdialogopen] = useState(false);
  // const [newPass, setNewPass] = useState("");
  // const [cnfNewPass, setCnfNewPass] = useState("");
  // const [oldPass, setOldPass] = useState("");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
    newPasswordNotMatch: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [passwordErrorOpen, setPasswordErrorOpen] = useState(false);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCloseSnackbar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPasswordErrorOpen(false);
  };

  const handleClickSnackbar = () => {
    setPasswordErrorOpen(true);
  };

  function convertToTitleCase(str) {
    let words = str.split(/(?=[A-Z])/);
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  const confirmPassword = async (e) => {
    const passwordsMatch = formData.newPassword === e;
    if (!passwordsMatch) {
      handleClickSnackbar();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
    }
  };

  function convertToInitials(name) {
    const parts = name.split(" ");
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  }

  const fetchUser = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
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
      setUser(data);
      setUserName(data.name);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  //Avater Click Section
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const style = {
    color: "blue",
    background: colors.redAccent[600],
  };
  const BreadCrumbsStyle = styled(Paper)(({ theme }) => ({
    // textAlign: "center",
    color: colors.redAccent[600],

    fontStyle: "normal",
    fontSize: "2rem",
  }));
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const ChangePasswordClickOpen = () => {
    setdialogopen(true);
  };

  const ChangePasswordDialoghandleClose = () => {
    setdialogopen(false);
  };

  const setNewPassword = async () => {
    console.log("user.userId : ", user.userId);
    // e.preventDefault();
    const newFormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === null || formData[key] === "") {
        newFormErrors[key] = true;
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        setFormErrors({ ...formErrors, passwordNotMatch: true });
      } else {
        newFormErrors[key] = false;
      }
    });
    setFormErrors(newFormErrors);

    for (const key in formData) {
      if (formData[key] === null || formData[key] === "") {
        handleClickSnackbar();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${convertToTitleCase(key)} must be filled`);
        return;
      }
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      handleClickSnackbar();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      return;
    }

    console.log("formData : : ", formData);
    console.log(
      `http://localhost:8081/admins/admin/changePassword?adminId=${user.userId}&oldPassword=${formData.oldPassword}&newPassword=${formData.newPassword}`
    );
    try {
      const response = await fetch(
        `http://localhost:8081/admins/admin/changePassword?adminId=${user.userId}&oldPassword=${formData.oldPassword}&newPassword=${formData.newPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const text = await response.text();
        setdialogopen(false);
        handleClickSnackbar();
        setSnackbarText(text);
        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setsnackbarSeverity("success");
        navigate(`/admin/home`);
        // logout();
      } else {
        const text = await response.text();
        handleClickSnackbar();
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
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: colors.newColor[100],
          color: colors.primary[900],
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            <BreadCrumbs urllist={urllist} />
          </Typography>

          <div style={{ marginLeft: "auto" }}>
            <div
              style={{
                display: "flex",
                columnGap: "1rem",
                alignItems: "center",
              }}
            >
              {/* <Avatar alt="Greenwave" src={gwlogo} /> */}
              <Tooltip
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
                placement="bottom"
              >
                <IconButton
                  onClick={colorMode.toggleColorMode}
                  sx={{ marginLeft: "auto" }}
                >
                  {theme.palette.mode === "dark" ? (
                    <Brightness4Icon />
                  ) : (
                    <Brightness7Icon />
                  )}
                </IconButton>
              </Tooltip>
              <Chip size="small" label={userName} className="hideSection" />
              {/* <Tooltip title={userName} placement="bottom">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sizes=""
                  sx={{
                    marginLeft: "auto",
                    width: 32,
                    height: 32,
                    bgcolor: colors.blueAccent[500],
                  }}
                  onClick={handleClick}
                >
                  {convertToInitials(userName)}
                </Avatar>
              </StyledBadge>
            </Tooltip> */}

              <div>
                <Avatar
                  sizes=""
                  sx={{
                    marginLeft: "auto",
                    width: 32,
                    height: 32,
                    bgcolor: colors.blueAccent[500],
                  }}
                  onClick={handleClick}
                >
                  {convertToInitials(userName)}
                </Avatar>
                <Paper elevation={1} sx={{ boxShadow: 0 }}>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                    sx={{ boxShadow: 0 }}
                  >
                    <MenuItem onClick={handleClose}>
                      <>
                        <AccountCircleIcon
                          sx={{ marginRight: "0.4rem" }}
                          fontSize="medium"
                        />
                      </>
                      {userName}
                    </MenuItem>
                    <Divider sx={{ margin: "0 !important", opacity: 0.8 }} />
                    <MenuItem onClick={ChangePasswordClickOpen}>
                      <>
                        <TimelapseIcon
                          sx={{ marginRight: "0.4rem" }}
                          fontSize="small"
                        />
                      </>
                      {"100"} Support Days Left
                    </MenuItem>
                    <Divider sx={{ margin: "0 !important", opacity: 0.8 }} />
                    <MenuItem onClick={ChangePasswordClickOpen}>
                      <>
                        <ManageAccountsIcon
                          sx={{ marginRight: "0.4rem" }}
                          fontSize="small"
                        />
                      </>
                      Change Password
                    </MenuItem>
                    <Divider sx={{ margin: "0 !important", opacity: 0.8 }} />
                    <MenuItem
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      <>
                        <LogoutIcon
                          sx={{ marginRight: "0.4rem" }}
                          fontSize="small"
                        />
                      </>
                      Logout
                    </MenuItem>
                  </Menu>
                </Paper>
              </div>

              {/* <IconButton>
              <Tooltip title="Logout" placement="right">
                <LogoutIcon
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  sx={{
                    marginLeft: "auto",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: colors.primary[100],
                  }}
                />
              </Tooltip>
            </IconButton> */}
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Dialog
        open={dialogopen}
        onClose={ChangePasswordDialoghandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Change Your Password"}
        </DialogTitle>
        <DialogContent style={{ padding: "10px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={formErrors.oldPassword}>
                <InputLabel htmlFor="password">Previous Password</InputLabel>
                <OutlinedInput
                  label="Previous Password"
                  autoComplete="oldPassword"
                  name="oldPassword"
                  required
                  fullWidth
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={(e) => {
                    const oldPassword = e.target.value;
                    // setOldPass(oldPassword);
                    setFormData({
                      ...formData,
                      oldPassword: oldPassword.trim(),
                    });
                    setFormErrors({
                      ...formErrors,
                      oldPassword: oldPassword.trim() === "",
                    });
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formErrors.oldPassword && (
                  <FormHelperText>
                    Previous Password must be filled
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={formErrors.newPassword || formErrors.newPasswordNotMatch}
              >
                <InputLabel htmlFor="newPassword">New Password</InputLabel>
                <OutlinedInput
                  label="New Password"
                  autoComplete="newPassword"
                  name="newPassword"
                  required
                  fullWidth
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    // setNewPass(newPassword);
                    setFormData({
                      ...formData,
                      newPassword: newPassword.trim(),
                    });
                    setFormErrors({
                      ...formErrors,
                      newPassword: newPassword.trim() === "",
                      newPasswordNotMatch:
                        newPassword !== formData.confirmNewPassword,
                    });
                    console.log(
                      "password !== cnfpass : ",
                      newPassword !== formData.confirmNewPassword
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formErrors.newPassword && (
                  <FormHelperText>Password must be filled</FormHelperText>
                )}
                {formErrors.newPasswordNotMatch && (
                  <FormHelperText>Password does not match !</FormHelperText>
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
                value={formData.confirmNewPassword}
                onBlur={(e) => confirmPassword(e.target.value)}
                onChange={(e) => {
                  const confirmPass = e.target.value;
                  // setCnfNewPass(confirmPass);
                  setFormData({
                    ...formData,
                    confirmNewPassword: confirmPass.trim(),
                  });
                  setFormErrors({
                    ...formErrors,
                    confirmNewPassword: e.target.value.trim() === "",
                    newPasswordNotMatch: formData.newPassword !== confirmPass,
                  });
                }}
                error={
                  formErrors.confirmNewPassword ||
                  formErrors.newPasswordNotMatch
                }
                helperText={
                  (formErrors.confirmNewPassword &&
                    "Confirm Password must be filled") ||
                  (formErrors.newPasswordNotMatch &&
                    "Password does not match !")
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setdialogopen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setNewPassword();
            }}
            color="error"
            autoFocus
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={passwordErrorOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TopbarPage;
