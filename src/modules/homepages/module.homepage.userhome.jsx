import React, { useContext, useState } from "react";
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
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Paper,
  TablePagination,
  useTheme,
  Divider,
} from "@mui/material";
import { Button } from "primereact/button";
import { Knob } from "primereact/knob";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
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
import { BarChart } from "@mui/x-charts/BarChart";
import { Grid } from "@mui/material";
import { BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ResponsiveChartContainer, axisClasses } from "@mui/x-charts";
import "primeicons/primeicons.css";
import { MeterGroup } from "primereact/metergroup";
import { Badge } from "primereact/badge";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
//bootstrap
import "bootstrap/dist/css/bootstrap.css";
import { ColorModeContext, tokens } from "../../theme";
import CounterAnimation from "./CounterAnimation";

function UserHome({ sendUrllist }) {
  const [formData, setFormData] = useState({
    userId: "",
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
  const [monthWiseTicket, setMonthWiseTicket] = useState([]);
  const [monthAndCatagoryWiseTicket, setMonthAndCatagoryWiseTicket] = useState(
    []
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const tableStyle = {
    color: "blue",
    border: "1px solid",
    borderColor: colors.grey[800],
    borderRadius: "0.7rem",
  };

  const [pendingTicketData, setPendingTicketData] = useState([]);
  const [allTicketData, setAllTicketData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowTimeRemaining(false);
  };

  const matergroupvalues = [
    { label: "Device", color: "#34d399", value: 50 },
    { label: "Application", color: "#fbbf24", value: 30 },
    { label: "Infrastructure", color: "#60a5fa", value: 20 },
  ];

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
    monthwiseticketraised();
    monthAndCatagoryWiseTicketRaised();
    getPendingTickets();
    getAllTickets();
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

  // const monthwiseticketraised = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8081/users/user/monthwiseticketraised",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("monthwiseticketraised : ", data);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  const chartSetting = {
    yAxis: [
      {
        label: "Issue Info",
      },
    ],
    //width: 500,
    height: 250,
  };

  const monthwiseticketraised = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/monthwiseticketraised",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("monthwiseticketraised : ", data);
      const outputList = data.map((item) => {
        const month = Object.keys(item)[0];
        const data = item[month];
        return {
          ...data,
          month: month.split(" ")[0],
        };
      });
      console.log("outputList : ", outputList);
      const numbersList = [];
      for (const month in data) {
        if (data.hasOwnProperty(month)) {
          const ticketsRaised = parseInt(data[month]);
          if (!isNaN(ticketsRaised)) {
            numbersList.push(ticketsRaised);
          }
        }
      }
      console.log("Numbers List:", numbersList);
      setMonthWiseTicket(outputList);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const monthAndCatagoryWiseTicketRaised = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/monthAndCatagoryWiseTicketRaised",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("monthAndCatagoryWiseTicketRaised : ", data);
      console.log("monthAndCatagoryWiseTicketRaised[0] : ", data[0]);
      const outputList = data.map((item) => {
        const month = Object.keys(item)[0];
        const data = item[month];
        return {
          ...data,
          month: month.split(" ")[0],
        };
      });
      console.log("outputcatagoryList : ", outputList);
      const numbersList = [];
      for (const month in data) {
        if (data.hasOwnProperty(month)) {
          const ticketsRaised = parseInt(data[month]);
          if (!isNaN(ticketsRaised)) {
            numbersList.push(ticketsRaised);
          }
        }
      }
      console.log("catagory Numbers List:", numbersList);
      setMonthAndCatagoryWiseTicket(outputList);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const getPendingTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/pendingTickets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("PendingTicketData : ", data);
      setPendingTicketData(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const getAllTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/allTickets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("allTicketData : ", data);
      setAllTicketData(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
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
        userId: data.userId,
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
        userId: data.userId,
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

  //
  const [type, setType] = React.useState("bar");
  //
  const [count, setCount] = useState(0);

  const ApplicationValue = 10;
  useEffect(() => {
    const interval = setInterval(() => {
      if (count < ApplicationValue) {
        setCount(count + 1);
      } else {
        clearInterval(interval);
      }
    }, 0.0005); // Adjust the interval duration for speed
    return () => clearInterval(interval);
  }, [count]);
  return (
    <Box>
      <Container maxWidth="">
        {/* <div class="row" style={{ marginBottom: "1rem" }}>
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
                  <div className="row"></div>
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
        </div> */}
        <div class="row">
          <div class="col-md-7">
            <div class="row">
              <div class="col-md-4">
                <Card
                  onClick={(e) => {
                    navigate("/user/ReportDevice", {
                      state: { plantID: formData.plantID },
                    });
                  }}
                  sx={{ borderRadius: 1 }}
                >
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <div className="row">
                      <div
                        className="col-md-6"
                        style={{
                          paddingLeft: "2rem",
                          display: "grid",
                          alignItems: "center",
                          justifyItems: "center",
                        }}
                      >
                        <div className="row">
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "1.7rem" }}
                          >
                            <CounterAnimation targetValue={14} />
                          </Typography>
                        </div>
                        <div
                          className="row"
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          Device
                        </div>
                      </div>
                      <div
                        className="col-md-6"
                        style={{
                          display: "grid",
                          justifyItems: "center",
                          alignItems: "center",
                          rowGap: "0.6rem",
                        }}
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <Button
                              style={{ borderRadius: "50%" }}
                              icon="pi pi-thumbs-up-fill                              "
                              rounded
                              //outlined
                              severity="success"
                              aria-label="Cancel"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              style={{ display: "flex", columnGap: "0.5rem" }}
                            >
                              <Badge value="9" severity="warning"></Badge>
                              <Badge value="6" severity="info"></Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="row">
                      <div class="col-md-7" style={{ paddingLeft: "2rem" }}>
                        <div className="row">
                          <div class="col-md-12">
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              Device
                            </Typography>
                            <Chip
                              //variant="outlined"
                              label="10"
                              color="error"
                              size="small"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div class="col-md-12">
                            <Avatar color="info">
                              {ticketData.total_ticket_raised}
                            </Avatar>
                          </div>
                        </div>
                      </div>
                      <div
                        class="col-md-5"
                        style={{
                          display: "grid",
                          alignItems: "center",
                          justifyItems: "center",
                        }}
                      >
                        <Button
                          style={{ borderRadius: "50%" }}
                          icon="pi pi-star-fill"
                          rounded
                          //outlined
                          severity="info"
                          aria-label="Cancel"
                        />
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
              <div class="col-md-4">
                <Card
                  onClick={(e) => {
                    navigate("/user/ReportApplication", {
                      state: { plantID: formData.plantID },
                    });
                  }}
                >
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <div className="row">
                      <div
                        className="col-md-6"
                        style={{
                          paddingLeft: "2rem",
                          display: "grid",
                          alignItems: "center",
                          justifyItems: "center",
                        }}
                      >
                        <div className="row">
                          <CounterAnimation targetValue={20} />
                        </div>
                        <div
                          className="row"
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          Application
                        </div>
                      </div>
                      <div
                        className="col-md-6"
                        style={{
                          display: "grid",
                          justifyItems: "center",
                          alignItems: "center",
                          rowGap: "0.6rem",
                        }}
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <Button
                              style={{ borderRadius: "50%" }}
                              icon="pi pi-thumbs-up-fill                              "
                              rounded
                              //outlined
                              severity="success"
                              aria-label="Cancel"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              style={{ display: "flex", columnGap: "0.5rem" }}
                            >
                              <Badge value="9" severity="warning"></Badge>
                              <Badge value="6" severity="info"></Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div class="col-md-4">
                <Card
                  onClick={(e) => {
                    navigate("/user/ReportInfrastructure", {
                      state: { plantID: formData.plantID },
                    });
                  }}
                >
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <div className="row">
                      <div
                        className="col-md-6"
                        style={{
                          paddingLeft: "2rem",
                          display: "grid",
                          alignItems: "center",
                          justifyItems: "center",
                        }}
                      >
                        <div className="row">
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "1.7rem" }}
                          >
                            <CounterAnimation targetValue={16} />
                          </Typography>
                        </div>
                        <div
                          className="row"
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          Infrastructure
                        </div>
                      </div>
                      <div
                        className="col-md-6"
                        style={{
                          display: "grid",
                          justifyItems: "center",
                          alignItems: "center",
                          rowGap: "0.6rem",
                        }}
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <Button
                              style={{ borderRadius: "50%" }}
                              icon="pi pi-thumbs-up-fill                              "
                              rounded
                              //outlined
                              severity="success"
                              aria-label="Cancel"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              style={{ display: "flex", columnGap: "0.5rem" }}
                            >
                              <Badge value="9" severity="warning"></Badge>
                              <Badge value="6" severity="info"></Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div class="row" style={{ marginTop: "1rem" }}>
              <div class="col-md-12">
                {/* <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Last Ticket Raised
                    </Typography>
                  </CardContent>
                </Card> */}
                {/* <Card>
                  <CardContent sx={{ padding: "12px 8px 2px 8px !important" }}> */}

                <div>
                  <MeterGroup values={matergroupvalues} max={200} />
                </div>

                {/* </CardContent>
                </Card> */}
              </div>
            </div>
            <div class="row" style={{ marginTop: "1rem" }}>
              <div class="col-md-12">
                {/* <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Last Ticket Raised
                    </Typography>
                  </CardContent>
                </Card> */}
                <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    {/* <ResponsiveChartContainer> */}

                    <BarChart
                      dataset={monthWiseTicket}
                      xAxis={[{ scaleType: "band", dataKey: "month" }]}
                      series={[
                        { dataKey: "Issue_Count", label: "Issue Count" },
                        {
                          dataKey: "Pending_Issues",
                          label: "Pending Issues",
                        },
                        {
                          dataKey: "Resolved_Issues",
                          label: "Resolved Issues",
                        },
                      ]}
                      {...chartSetting}
                    />

                    {/* </ResponsiveChartContainer> */}
                  </CardContent>
                </Card>
              </div>
            </div>
            <div class="row" style={{ marginTop: "1rem" }}>
              <div class="col-md-6">
                <Card>
                  <CardContent
                    sx={{
                      paddingBottom: "16px !important",
                      display: "grid",
                      justifyItems: "center",
                    }}
                  >
                    <Chip
                      variant="outlined"
                      component="div"
                      color="info"
                      label="Response Time (AVG)"
                    />

                    <SparkLineChart
                      data={[3, 4, 2, 5, 4, 2, 4, 0, 5, 4, 2, 4, 6]}
                      height={35}
                    />
                  </CardContent>
                </Card>
              </div>
              <div class="col-md-6">
                <Card>
                  <CardContent
                    sx={{
                      paddingBottom: "16px !important",
                      display: "grid",
                      justifyItems: "center",
                    }}
                  >
                    <Chip
                      variant="outlined"
                      component="div"
                      color="info"
                      label="Resolved Time (AVG)"
                    />
                    <SparkLineChart
                      data={[1, 4, 2, 5, 7, 2, 4, 6, 1, 4, 2, 5, 7, 2, 4, 6]}
                      height={35}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div class="col-md-5">
            <div className="row">
              <div className="col-md-12">
                <Card className="dashboard-rightSide-Table">
                  <CardContent sx={{ padding: "0" }}>
                    <div
                      style={{
                        padding: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "3rem",
                      }}
                    >
                      <Typography
                        sx={{ mb: 0, fontWeight: 600 }}
                        gutterBottom
                        variant="h5"
                        component="div"
                      >
                        Open Ticket
                      </Typography>
                      <div>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]} // Choose your desired options
                          component="div"
                          count={pendingTicketData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          labelRowsPerPage=""
                          onPageChange={(e, newPage) => setPage(newPage)}
                          onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                          }}
                        />
                      </div>
                    </div>
                    <Divider sx={{ opacity: "0.8" }} />
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <TableContainer sx={{ overflow: "auto" }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Category</TableCell>
                                <TableCell align="center">Time</TableCell>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">
                                  Description
                                </TableCell>
                                <TableCell align="center">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(rowsPerPage > 0
                                ? pendingTicketData.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                : pendingTicketData
                              ).map((ticket, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">
                                    {ticket.category}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.time}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.id}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.description}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.status}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="row" style={{ marginTop: "1rem" }}>
              <div className="col-md-12">
                <Card>
                  <CardContent sx={{ padding: "0" }}>
                    <div style={{ padding: "0.8rem" }}>
                      <Typography
                        sx={{ mb: 0, fontWeight: 600 }}
                        gutterBottom
                        variant="h5"
                        component="div"
                      >
                        Pending Ticket
                      </Typography>
                    </div>
                    <Divider sx={{ opacity: "0.8" }} />
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TableContainer sx={tableStyle}>
                          <Table>
                            <TableHead>
                              <TableRow
                                sx={{ backgroundColor: colors.primary[400] }}
                              >
                                <TableCell align="center">Category</TableCell>
                                <TableCell align="center">Time</TableCell>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Severity</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {allTicketData.map((ticket, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">
                                    {ticket.category}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.time}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.id}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ticket.severity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          component="div"
                          count={allTicketData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* <Grid container spacing={2}>
          <Grid item xs={6}>
            <TableContainer sx={tableStyle}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.primary[400] }}>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingTicketData.map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{ticket.category}</TableCell>
                      <TableCell align="center">{ticket.time}</TableCell>
                      <TableCell align="center">{ticket.id}</TableCell>
                      <TableCell align="center">{ticket.description}</TableCell>
                      <TableCell align="center">{ticket.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pendingTicketData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
          <Grid item xs={6}>
            <TableContainer sx={tableStyle}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.primary[400] }}>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Severity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allTicketData.map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{ticket.category}</TableCell>
                      <TableCell align="center">{ticket.time}</TableCell>
                      <TableCell align="center">{ticket.id}</TableCell>
                      <TableCell align="center">{ticket.severity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={allTicketData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid> */}
        {/* <div
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
        </div> */}
      </Container>
    </Box>
  );
}

export default UserHome;
