import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import Main from "../../components/navigation/mainbody/mainbody";
import TopbarPage from "../../components/navigation/topbar/topbar";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";

function UserHome() {
  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    phoneNumber: "",
    plantID: "",
    plantName: "",
    address: "",
    division: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
  });
  const [ticketData, setTicketData] = useState({
    total_ticket_raised: "",
    pending_tickets: "",
    resolved_tickets: "",
    last_ticket_raised: "",
  });
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // setToken(`${localStorage.getItem("token")}`);
    fetchUser();
    fetchTicketDetails();
  }, []);

  const fetchUser = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        navigate("/userlogin");
        return;
      }
      const data = await response.json();
      console.log("fetchUser data : ", data);
      setFormData((prevData) => ({
        ...prevData,
        userID: data.userID,
        name: data.name,
        designation: data.designation,
        email: data.email,
        phoneNumber: data.phoneNumber,
        plantID: data.plantID,
        plantName: data.plantName,
        address: data.address,
        division: data.division,
        customerName: data.customerName,
        supportStartDate: dayjs(
          convertDateFormat(data.supportStartDate),
          "DD-MM-YYYY"
        ),
        supportEndDate: dayjs(
          convertDateFormat(data.supportEndDate),
          "DD-MM-YYYY"
        ),
        accountOwnerCustomer: data.accountOwnerCustomer,
        accountOwnerGW: data.accountOwnerGW,
        role: data.role,
      }));
      localStorage.setItem("userPlantID", data.plantID);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchTicketDetails = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/ticketInfo",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 403) {
        navigate("/userlogin");
        return;
      }
      const data = await response.json();
      console.log("fetchTicketDetails data : ", data);
      setTicketData((prevData) => ({
        ...prevData,
        total_ticket_raised: data.total_ticket_raised,
        pending_tickets: data.pending_tickets,
        resolved_tickets: data.resolved_tickets,
        last_ticket_raised: dayjs(
          convertDateFormat(data.last_ticket_raised),
          "DD-MM-YYYY"
        ),
      }));
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  function convertDateFormat(dateString) {
    console.log("dateString : ", dateString);
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // function convertDateFormat(dateString) {
  //   if (dateString) {
  //     const [year, month, day] = dateString.split("-");
  //     return `${day}-${month}-${year}`;
  //   } else {
  //     return dateString;
  //   }
  // }

  return (
    <Box sx={{ display: "flex" }}>
      <TopbarPage
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[{ pageName: "User Home Page", pagelink: "/userhome" }]}
      />
      <SidebarPage
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[
          {
            pagename: "Device Issue Category",
            pagelink: "/admin/Device/CategoryConfigure",
          },
          { pagename: "Application", pagelink: "/admin/ApplicationConfigure" },
          { pagename: "Device ", pagelink: "/admin/DeviceConfigure" },
          {
            pagename: "Infrastructure ",
            pagelink: "/admin/InfrastructureConfigure",
          },
        ]}
        userList={[
          {
            pagename: "Report Application",
            pagelink: "/user/ReportApplication",
          },
          {
            pagename: "Report Infrastructure",
            pagelink: "/user/ReportInfrastructure",
          },
          { pagename: "Report Device", pagelink: "/user/ReportDevice" },
        ]}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Container
            style={{ display: "flex", height: "100vh", width: "100vw" }}
          >
            <>
              <div style={{ width: "50%", height: "100%", padding: "50px" }}>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    width: "100%",
                    height: "30%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography>Support Till Date</Typography>
                  <Datepicker
                    value={formData.supportEndDate}
                    format="DD-MM-YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                    readOnly
                  />
                </div>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    width: "100%",
                    height: "70%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "stretch",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Typography>OPEN TICKETS</Typography>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      style={{ margin: "10px" }}
                      onClick={(e) => {
                        navigate("/user/ReportDevice", {
                          state: { plantID: formData.plantID },
                        });
                      }}
                    >
                      Device
                    </Button>
                    <Button
                      variant="contained"
                      style={{ margin: "10px" }}
                      onClick={(e) => {
                        navigate("/user/ReportApplication", {
                          state: { plantID: formData.plantID },
                        });
                      }}
                    >
                      Application
                    </Button>
                    <Button
                      variant="contained"
                      style={{ margin: "10px" }}
                      onClick={(e) => {
                        navigate("/user/ReportInfrastructure", {
                          state: { plantID: formData.plantID },
                        });
                      }}
                    >
                      Infrastructure
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ width: "50%", height: "100%", padding: "50px" }}>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    width: "100%",
                    height: "70%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5">
                    Total Issue Raised : {ticketData.total_ticket_raised}
                  </Typography>
                  <Typography variant="h5">
                    Pending Tickets : {ticketData.pending_tickets}
                  </Typography>
                  <Typography variant="h5">
                    Resolved Tickets : {ticketData.resolved_tickets}
                  </Typography>
                </div>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    width: "100%",
                    height: "30%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography>Last Ticket Raised</Typography>
                  <Datepicker
                    value={ticketData.last_ticket_raised}
                    format="DD-MM-YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                    readOnly
                  />
                </div>
              </div>
            </>
          </Container>
        </Box>
      </Main>
    </Box>
  );
}

export default UserHome;
