/*Navigation Pane*/
import Sidebar from '../../components/navigation/sidebar/sidebar';
import Topbar from '../../components/navigation/topbar/topbar';
import Main from '../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../components/navigation/drawerheader/drawerheader.component';

import {React,useState} from 'react'
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function Samplemodule() {
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
  return (
    
           <div> <Typography>Your content</Typography></div>
  )
}
