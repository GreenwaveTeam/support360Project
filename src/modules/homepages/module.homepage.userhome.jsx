import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Slide,
  Alert,
  Snackbar,
} from "@mui/material";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import Main from "../../components/navigation/mainbody/mainbody";
import TopbarPage from "../../components/navigation/topbar/topbar";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import { useUserContext } from "../contexts/UserContext";

function UserHome({ sendUrllist }) {
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

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  const { userData, setUserData } = useUserContext();
  console.log("userData ==>> ", userData);

  const [timeRemaining, setTimeRemaining] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState("");

  const [showTimeRemaining, setShowTimeRemaining] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowTimeRemaining(false);
  };

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const location = useLocation();
  const currentPageLocation = useLocation().pathname;

  useEffect(() => {
    // setToken(`${localStorage.getItem("token")}`);
    fetchUser();
    fetchTicketDetails();
    sendUrllist(urllist);
    fetchDivs();
    // setTokenExpiry(localStorage.getItem("expire"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tokenExpiryString = localStorage.getItem("expire");
    if (tokenExpiryString) {
      const expiryDate = new Date(tokenExpiryString);
      if (!isNaN(expiryDate.getTime())) {
        setTokenExpiry(expiryDate);
      } else {
        console.error("Invalid token expiry date:", tokenExpiryString);
      }
    } else {
      console.error("Token expiry date not found in localStorage.");
    }
    const interval = setInterval(() => {
      setShowTimeRemaining(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateTimeRemaining();
  }, [userData]);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(tokenExpiry);
    console.log("expiry : ", expiry);
    const difference = expiry.getTime() - now.getTime();
    console.log("difference : ", difference);
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining("Token expired");
    }
  };

  const showAlert = () => {
    alert(`Time remaining until token expiry: ${timeRemaining}`);
  };

  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
      console.log("Currently passed Data : ", location.state);
      console.log("Current UserData in fetchDivs() : ", userData);

      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=superadmin&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      if (fetchDivs.length === 0) {
        navigate("/*");
      }
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  const fetchComponents = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/role/{role}/{pagename}",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("fetchUser data : ", data);
      // localStorage.setItem("userPlantID", data.plantID);
      // setUserData(data.plantID);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const list = [
    "support-till-date",
    "ticket-information",
    "open-tickets",
    "last-ticket-raised",
  ];

  const fetchUser = async () => {
    console.log("expire : ", localStorage.getItem("expire"));
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
        localStorage.clear();
        navigate("/login");
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
      // localStorage.setItem("userPlantID", data.plantID);
      setUserData({
        ...userData,
        plantID: data.plantID,
        role: data.role,
        userID: data.userID,
      });
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

  const urllist = [{ pageName: "User Home Page", pagelink: "/user/home" }];

  return (
    <Box sx={{ display: "flex" }}>
      <Container style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <>
          <div style={{ width: "50%", height: "100%", padding: "50px" }}>
            {divIsVisibleList.includes("support-till-date") && (
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
                  // slotProps={{ textField: { fullWidth: true } }}
                  readOnly
                />
              </div>
            )}
            {divIsVisibleList.includes("open-ticket") && (
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
            )}
          </div>
          <div style={{ width: "50%", height: "100%", padding: "50px" }}>
            {divIsVisibleList.includes("ticket-information") && (
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
            )}
            {divIsVisibleList.includes("last-ticket-raised") && (
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
                  // slotProps={{ textField: { fullWidth: true } }}
                  readOnly
                />
              </div>
            )}
          </div>
        </>
      </Container>
      <Snackbar
        open={showTimeRemaining}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Time remaining until token expiry: {timeRemaining}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserHome;