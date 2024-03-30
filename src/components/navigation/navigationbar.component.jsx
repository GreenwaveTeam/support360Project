import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BreadCrumbs from '../breadcrumbs/breadcrumbs.component';

export default function NavigationArea({urllist,handleOnClick}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" sx={{backgroundColor:'#F3F8FF '}} >
        <Toolbar sx={{color:'#0C0C0C'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOnClick}
          >
            <MenuIcon />
          </IconButton>
          
          <BreadCrumbs urllist={urllist}
          />
        </Toolbar>
      </AppBar>
    </Box>
    
  );
}
