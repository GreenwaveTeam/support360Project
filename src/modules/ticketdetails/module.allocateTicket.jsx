import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { fetchUser, getAllOpenTicketDetails } from './AllocateTicket';
import Badge from '@mui/material/Badge';

export default function AllocateTicket() {
  const [value, setValue] = React.useState("1");
  const [allTickets, setAllTickets] = React.useState({});

  //   const application=1;
  //   const device=-2;
  //   const infrastructure=3;

  const fetchAllTicketsDetails = async () => {
    console.log("fetchAllTicketsDetails() called ");

    const response = await getAllOpenTicketDetails();
    console.log(response);
    let applicationTicketArray = [];
    let deviceTicketArray = [];
    let infrastructureTicketArray = [];

    if (response) {
      response.forEach((element) => {
        element?.ticketNo.charAt(0).toLowerCase() === "a"
          ? applicationTicketArray.push(element)
          : element?.ticketNo.charAt(0).toLowerCase() === "d"
          ? deviceTicketArray.push(element)
          : infrastructureTicketArray.push(element);
      });
    }

    console.log("Application Tickets : ", applicationTicketArray);
    console.log("Device Tickets : ", deviceTicketArray);
    console.log("Infrastructure Tickets : ", infrastructureTicketArray);
    let finalTicket = {
      application: applicationTicketArray,
      device: deviceTicketArray,
      infrastructure: infrastructureTicketArray,
    };
    console.log("Final Ticket : ", finalTicket);
    setAllTickets(finalTicket);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("UseEffect called");
      fetchAllTicketsDetails();
    }, 3000);

    return () => {
      clearInterval(interval); 
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label={
                <>
                  <Badge
                    color="secondary"
                    badgeContent={allTickets?.application?.length}
                  >
                    <div style={{ marginRight: "15px" }}>Application</div>
                  </Badge>
                </>
              }
              value="1"
            />
            <Tab
              label={
                <>
                  <Badge
                    color="secondary"
                    badgeContent={allTickets?.device?.length}
                  >
                    <div style={{ marginRight: "15px" }}>Device</div>
                  </Badge>
                </>
              }
              value="2"
            />
            <Tab
              label={
                <>
                  <Badge
                    color="secondary"
                    badgeContent={allTickets?.infrastructure?.length}
                  >
                    <div style={{ marginRight: "15px" }}>Infrastructure</div>
                  </Badge>
                </>
              }
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">Application</TabPanel>
        <TabPanel value="2">Device</TabPanel>
        <TabPanel value="3">Infrastructure</TabPanel>
      </TabContext>
    </Box>
  );
}