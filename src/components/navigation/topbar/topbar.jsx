import React, { useEffect, useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import BreadCrumbs from "../../breadcrumbs/breadcrumbs.component";
import { Avatar, Button, Chip, Paper, Tooltip } from "@mui/material";
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

  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUser(); // Call fetchUser after it has been defined
  }, []);

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
      setUserName(data.name);
      // console.log("fetchUser data : ", `${data.name.split(' ')[0][0]}${data.name.split(' ')[1][0]}`);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

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

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{ backgroundColor: colors.newColor[100], color: colors.primary[900] }}
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
            style={{ display: "flex", columnGap: "1rem", alignItems: "center" }}
          >
            <Tooltip
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              placement="left"
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
            <Chip size="small" label={userName} />
            <Tooltip title={userName} placement="bottom">
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
                >
                  {convertToInitials(userName)}
                </Avatar>
              </StyledBadge>
            </Tooltip>

            <IconButton>
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
            </IconButton>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopbarPage;
