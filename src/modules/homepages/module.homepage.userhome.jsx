import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Slide,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import { Button } from "primereact/button";
import { Knob } from "primereact/knob";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import Main from "../../components/navigation/mainbody/mainbody";
import TopbarPage from "../../components/navigation/topbar/topbar";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import { useUserContext } from "../contexts/UserContext";
import { extendTokenExpiration } from "../helper/Support360Api";

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
  const [daysDifference, setDaysDifference] = useState(null);
  const [daysDifferenceTillNow, setDaysDifferenceTillNow] = useState(null);

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
    extendTokenExpiration();
    // setToken(`${localStorage.getItem("token")}`);
    fetchUser();
    fetchTicketDetails();
    sendUrllist(urllist);
    fetchDivs();

    // setTokenExpiry(localStorage.getItem("expire"));
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     calculateTimeRemaining();
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   const tokenExpiryString = localStorage.getItem("expire");
  //   if (tokenExpiryString) {
  //     const expiryDate = new Date(tokenExpiryString);
  //     if (!isNaN(expiryDate.getTime())) {
  //       setTokenExpiry(expiryDate);
  //     } else {
  //       console.error("Invalid token expiry date:", tokenExpiryString);
  //     }
  //   } else {
  //     console.error("Token expiry date not found in localStorage.");
  //   }
  //   const interval = setInterval(() => {
  //     setShowTimeRemaining(true);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   calculateTimeRemaining();
  // }, [userData]);

  // const calculateTimeRemaining = () => {
  //   const now = new Date();
  //   const expiry = new Date(tokenExpiry);
  //   console.log("expiry : ", expiry);
  //   const difference = expiry.getTime() - now.getTime();
  //   console.log("difference : ", difference);
  //   if (difference > 0) {
  //     const hours = Math.floor(difference / (1000 * 60 * 60));
  //     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  //     setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  //   } else {
  //     setTimeRemaining("Token expired");
  //   }
  // };

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
        supportStartDate: data.supportStartDate,
        supportEndDate: data.supportEndDate,
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
      differenceInDays(data.supportStartDate, data.supportEndDate);
      differenceInDaysTillNow(new Date(), data.supportEndDate);
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
        last_ticket_raised: data.last_ticket_raised,
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
  //
  const differenceInDays = async (startDate, endDate) => {
    // const startDate = formData.supportStartDate;
    // const endDate = formData.supportEndDate;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const differenceInMilliseconds =
      endDateObj.getTime() - startDateObj.getTime();
    const differenceInDay = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    setDaysDifference(differenceInDay);
    console.log("DaysDifference : ", differenceInDay);
  };

  const differenceInDaysTillNow = async (startDate, endDate) => {
    console.log("differenceInDaysTillNow  startDate : ", startDate);
    console.log("differenceInDaysTillNow  endDate : ", endDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const differenceInMilliseconds =
      endDateObj.getTime() - startDateObj.getTime();
    const differenceInDay = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    setDaysDifferenceTillNow(differenceInDay);
    console.log("DaysDifferenceTillNow : ", differenceInDay);
  };

  const urllist = [{ pageName: "User Home Page", pagelink: "/user/home" }];

  return (
    <Box>
      <Container maxWidth="">
        <div class="row" style={{ marginBottom: "1rem" }}>
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-12">
                <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography>User Dashboard</Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="col-md-12">
              <Card>
                <CardContent sx={{ paddingBottom: "16px !important" }}>
                  <div className="row">
                    <div className="col-md-12">
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                        }}
                      >
                        User Dashboard
                      </Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          navigate("/user/ReportDevice", {
                            state: { plantID: formData.plantID },
                          });
                        }}
                      >
                        Device
                      </Button>
                    </div>
                    <div className="col-md-4">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          navigate("/user/ReportApplication", {
                            state: { plantID: formData.plantID },
                          });
                        }}
                      >
                        Application
                      </Button>
                    </div>
                    <div className="col-md-4">
                      <Button
                        variant="contained"
                        size="small"
                        //style={{ width: "7.5rem" }}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-4">
                <Card sx={{ borderRadius: 1 }}>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Total Issue Raised
                    </Typography>
                    <Avatar color="info">
                      {ticketData.total_ticket_raised}
                    </Avatar>
                  </CardContent>
                </Card>
              </div>
              <div class="col-md-4">
                <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Pending Tickets
                    </Typography>
                    <Avatar color="info">{ticketData.pending_tickets}</Avatar>
                  </CardContent>
                </Card>
              </div>
              <div class="col-md-4">
                <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Total Issue Raised
                    </Typography>
                    <Avatar color="info"> {ticketData.resolved_tickets}</Avatar>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div class="row" style={{ marginTop: "1rem" }}>
              <div class="col-md-12">
                <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Last Ticket Raised
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-6">
                  <Card>
                    <CardContent sx={{ paddingBottom: "16px !important" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Last Ticket Raised
                      </Typography>
                      <Chip label={ticketData.last_ticket_raised} />
                    </CardContent>
                  </Card>
                </div>
                <div class="col-md-6">
                  <Card>
                    <CardContent sx={{ paddingBottom: "16px !important" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Support Till Date
                      </Typography>
                      <Chip label={formData.supportEndDate} />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div class="row" style={{ marginTop: "1rem" }}>
                <div class="col-md-12">
                  <Card>
                    <CardContent sx={{ paddingBottom: "16px !important" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Pending Support Date
                      </Typography>
                      <div>
                        <Knob
                          value={parseInt(daysDifferenceTillNow)}
                          // min={parseInt(daysDifference)}
                          valueColor="#708090"
                          rangeColor="#48d1cc"
                          minLength={parseInt(daysDifference)}
                        />
                      </div>
                      <Typography gutterBottom variant="h5" component="div">
                        {daysDifferenceTillNow} Days Left of {daysDifference}{" "}
                        Days
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {list.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  marginBottom: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dash black",
                  borderRadius: "5px",
                }}
              >
                {/* {item === "support-till-date" && (
                  <Box>
                    <Typography>Support Till Date</Typography>
                    <Datepicker
                      value={formData.supportEndDate}
                      format="DD-MM-YYYY"
                      readOnly
                      sx={{ borderRadius: "50px" }}
                    />
                  </Box>
                )} */}
                {item === "ticket-information" && (
                  <Box>
                    <Typography variant="h5">
                      Total Issue Raised: {ticketData.total_ticket_raised}
                    </Typography>
                    <Typography variant="h5">
                      Pending Tickets: {ticketData.pending_tickets}
                    </Typography>
                    <Typography variant="h5">
                      Resolved Tickets: {ticketData.resolved_tickets}
                    </Typography>
                  </Box>
                )}
                {/* {item === "last-ticket-raised" && (
                  <Box>
                    <Typography>Last Ticket Raised</Typography>
                    <Datepicker
                      value={ticketData.last_ticket_raised}
                      format="DD-MM-YYYY"
                      readOnly
                      sx={{ borderRadius: "50px" }}
                    />
                  </Box>
                )} */}
              </Box>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              border: "2px dash black",
              borderRadius: "5px",
            }}
          >
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
          </div>
        </div>
      </Container>
    </Box>
  );
}

export default UserHome;
