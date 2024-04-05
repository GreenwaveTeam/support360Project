/*Navigation Pane*/
import Sidebar from '../../components/navigation/sidebar/sidebar';
import Topbar from '../../components/navigation/topbar/topbar';
import Main from '../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../components/navigation/drawerheader/drawerheader.component';

import {React,useEffect,useState} from 'react'
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function Samplemodule({sendUrllist}) {
    
  const urllist = [
    {pageName:'Admin Home',pagelink:'/AdminPage'},
    { pageName: "Test1", pagelink: "/authenticated/test1" },
    { pageName: "Device Issue", pagelink: "/admin/Device/CategoryConfigure/Issue" }
  ];
  useEffect(() => {
    const data = 'Data sent from child';
    // Invoke callback function passed from parent
    sendUrllist(urllist);
  }, []);
	
  return (
    
     <Typography>Your contentis displayed here</Typography>
            
  )
}
