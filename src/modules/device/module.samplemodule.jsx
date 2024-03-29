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
    <Box sx={{ display: 'flex' }}>
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={[
          { pageName: 'Device Issue Category', pagelink: '/Device/Category' }
        ]} />
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[{ pagename: 'Device Issue Category', pagelink: '/Device/Category' }, { pagename: 'Application', pagelink: '/Application' }]}
        userList={['User Item 1', 'User Item 2', 'User Item 3']}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box 
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <Typography>Your content</Typography>
            </Box>
        </Main>
    </Box>
  )
}
