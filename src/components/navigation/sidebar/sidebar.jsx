import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ColorModeContext, tokens } from "../../../theme";


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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '2px solid #6863633d',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1)'
        },
        
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <div>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{color:colors.primary[100]}} /> : <ChevronRightIcon sx={{color:colors.primary[100]}}/>}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickAdmin} > {/* Add Link component with "to" prop */}
          <ListItemText primary="Admin" />
          {openAdmin ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAdmin} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {adminList.map(({pagename, pagelink},index) => (
              <ListItem key={index} disablePadding sx={{ '&:hover': { backgroundColor: '' } }}>
                <ListItemButton component={Link} to={pagelink}>
                  <ListItemText primary={pagename} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickUser}>
 
          <ListItemText primary="User" />
          {openUser ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openUser} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {userList.map(({pagename, pagelink},index) => (
              <ListItem key={index} disablePadding sx={{ '&:hover': { backgroundColor: '' } }}>
                <ListItemButton component={Link} to={pagelink}>
                  <ListItemText primary={pagename} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default SidebarPage;
