import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ColorModeContext, tokens } from "../../../theme";
import CustomPanelBar from "../../sidebar/customSideBar.component";
import gwlogo from "../../../resources/images/gwlogo.png";

const drawerWidth = 240;

const SidebarPage = ({ open, handleDrawerClose, adminList, userList }) => {
  const [openAdmin, setOpenAdmin] = useState(true);
  const [openUser, setOpenUser] = useState(true);

  const handleClickAdmin = () => {
    setOpenAdmin(!openAdmin);
  };

  const handleClickUser = () => {
    setOpenUser(!openUser);
  };
  //For theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "2px solid #6863633d",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    
        <><img src={gwlogo} alt="GW_LOGO" style={{width: "30px", height: "30px",marginLeft:'10px'}}></img>
</> <div>Support360</div>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon sx={{ color: colors.primary[100] }} />
          ) : (
            <ChevronRightIcon sx={{ color: colors.primary[100] }} />
          )}
        </IconButton>
      </div>
      <Divider />
      <CustomPanelBar></CustomPanelBar>
    </Drawer>
  );
};

export default SidebarPage;
