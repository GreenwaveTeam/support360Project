import { Typography } from '@mui/material';
import React, { useEffect } from 'react'

const urllist = [
  {pageName:'Admin 1 Home',pagelink:'/AdminPage'},
  { pageName: "Sample", pagelink: "/authenticated/sample" },
  { pageName: "Device 1Issue", pagelink: "/admin/Device/CategoryConfigure/Issue" }
];

function Test1({sendUrllist}) {
  useEffect(() => {
    const data = 'Data sent from child';
    // Invoke callback function passed from parent
    sendUrllist(urllist);
  }, []);
  
  return (
    <Typography>Test1</Typography>
  )
}

export default Test1