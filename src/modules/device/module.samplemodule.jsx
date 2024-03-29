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
    <Box>
        <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={[{ pageName: 'Application', pagelink: '/Application' },{ pageName: 'Category', pagelink: '/Device/Category' }]} />
		<Sidebar open={open} handleDrawerClose={handleDrawerClose} adminList={[{ pagename: 'Issue Category', pagelink: '/IssueCategory' }, { pagename: 'Issue', pagelink: '/Issue' }]} userList={['User Item 1', 'User Item 2', 'User Item 3']} />
		<Main open={open}>
		    <DrawerHeader />
            <Typography>Your content</Typography>
        </Main>
    </Box>
  )
}
