import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function AllocateTicket() {
  const [value, setValue] = React.useState('1');

  React.useEffect(()=>
{
    console.log('UseEffect called')
     
})

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Application" value="1" />
            <Tab label="Device" value="2" />
            <Tab label="Infrastructure" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Application</TabPanel>
        <TabPanel value="2">Device</TabPanel>
        <TabPanel value="3">Infrastructure</TabPanel>
      </TabContext>
    </Box>
  );
}