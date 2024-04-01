import React, { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import BreadCrumbs from "../../breadcrumbs/breadcrumbs.component";
import { Button, Tooltip } from "@mui/material";
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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{ backgroundColor: "#B9F3FC", color: "black" }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
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
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          placement="right"
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout" placement="right">
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            sx={{ marginLeft: "auto" }}
          >
            <LogoutIcon />
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopbarPage;
