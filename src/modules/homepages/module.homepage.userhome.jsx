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
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Collapse,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
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
import CloseIcon from "@mui/icons-material/Close";
//bootstrap
import "bootstrap/dist/css/bootstrap.css";
import { ColorModeContext, tokens } from "../../theme";
import CounterAnimation from "./CounterAnimation";
import {
  fetchTicketCloseTime,
  fetchTicketResolveTime,
  fetchTicketResponseTime,
  getAllClosedTicketDetails,
  getAllOpenTicketDetails,
  updateStatus,
} from "../ticketdetails/AllocateTicket";
import DataTableByCatagory from "../ticketdetails/DataTableByCatagory";
import CustomTable from "../../components/table/table.component";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

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
  const [graceDifferenceTillNow, setGraceDifferenceTillNow] = useState(null);
  const [monthWiseTicket, setMonthWiseTicket] = useState([]);
  const [monthAndCatagoryWiseTicket, setMonthAndCatagoryWiseTicket] = useState(
    []
  );
  const [applicationIssuesCurrentMonth, setApplicationIssuesCurrentMonth] =
    useState(0);
  const [
    criticalApplicationIssuesCurrentMonth,
    setCriticalApplicationIssuesCurrentMonth,
  ] = useState(0);
  const [
    nonCriticalApplicationIssuesCurrentMonth,
    setNonCriticalApplicationIssuesCurrentMonth,
  ] = useState(0);
  const [deviceIssuesCurrentMonth, setDeviceIssuesCurrentMonth] = useState(0);
  const [
    criticalDeviceIssuesCurrentMonth,
    setCriticalDeviceIssuesCurrentMonth,
  ] = useState(0);
  const [
    nonCriticalDeviceIssuesCurrentMonth,
    setNonCriticalDeviceIssuesCurrentMonth,
  ] = useState(0);
  const [
    infrastructureIssuesCurrentMonth,
    setInfrastructureIssuesCurrentMonth,
  ] = useState(0);
  const [
    criticalInfrastructureIssuesCurrentMonth,
    setCriticalInfrastructureIssuesCurrentMonth,
  ] = useState(0);
  const [
    nonCriticalInfrastructureIssuesCurrentMonth,
    setNonCriticalInfrastructureIssuesCurrentMonth,
  ] = useState(0);

  const [catagoryWiseTrend, setCatagoryWiseTrend] = useState([]);
  const [supportDateExpired, setSupportDateExpired] = useState(false);
  const [gracePeriodStarted, setGracePeriodStarted] = useState(false);
  const [gracePeriodExpired, setGracePeriodExpired] = useState(false);

  const DB_IP = process.env.REACT_APP_SERVERIP;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("catagory");

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const sortedTickets = stableSort(
  //   viewMode === 'pending' ? pendingTickets : openTickets,
  //   getComparator(order, orderBy)
  // );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const tableStyle = {
    color: "blue",
    border: "1px solid",
    borderColor: colors.grey[800],
    borderRadius: "0.7rem",
  };

  const [allTickets, setAllTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [allTicketData, setAllTicketData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState("all");
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseTime, setResponseTime] = useState([]);
  const [resolveTime, setResolveTime] = useState([]);
  const [closeTime, setCloseTime] = useState([]);
  const [openHeader, setOpenHeader] = React.useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === "all" ? "open" : "all"));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const handleClose = (event, reason) => {
    // if (reason === "clickaway") {
    //   return;
    // }
    // setShowTimeRemaining(false);
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const matergroupvalues = [
    {
      label: "Device",
      color: "#34d399",
      value: Math.ceil(
        (deviceIssuesCurrentMonth /
          (deviceIssuesCurrentMonth +
            applicationIssuesCurrentMonth +
            infrastructureIssuesCurrentMonth)) *
          100
      ),
    },
    {
      label: "Application",
      color: "#fbbf24",
      value: Math.ceil(
        (applicationIssuesCurrentMonth /
          (deviceIssuesCurrentMonth +
            applicationIssuesCurrentMonth +
            infrastructureIssuesCurrentMonth)) *
          100
      ),
    },
    {
      label: "Infrastructure",
      color: "#60a5fa",
      value: Math.ceil(
        (infrastructureIssuesCurrentMonth /
          (deviceIssuesCurrentMonth +
            applicationIssuesCurrentMonth +
            infrastructureIssuesCurrentMonth)) *
          100
      ),
    },
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

  //
  const [type, setType] = React.useState("bar");
  //
  const [count, setCount] = useState(0);
  const ApplicationValue = 10;

  useEffect(() => {
    // setPendingTickets(await Promise.all(getAllOpenTicketDetails()));
    extendTokenExpiration();
    // setToken(`${localStorage.getItem("token")}`);
    fetchTicketDetails();
    sendUrllist(urllist);
    monthwiseticketraised();
    monthAndCatagoryWiseTicketRaised();
    fetchCatagoryWiseTrend();
    // getPendingTickets();
    // getAllTickets();
    // showAlert();
    // setTokenExpiry(localStorage.getItem("expire"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < ApplicationValue) {
        setCount(count + 1);
      } else {
        clearInterval(interval);
      }
    }, 0.0005);
    return () => clearInterval(interval);
  }, [count]);

  React.useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(() => {
      console.log("UseEffect called");
      // showAlert(formData.plantID);
      fetchUser();
      setIsLoading(false);
    }, 4000);
    return () => {
      clearInterval(interval);
    };
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

  const showAlert = async (plantId) => {
    // alert(`Time remaining until token expiry: ${timeRemaining}`);
    const tempResponseTime = await fetchTicketResponseTime(plantId);
    const tempResolveTime = await fetchTicketResolveTime(plantId);
    const tempCloseTime = await fetchTicketCloseTime(plantId);

    console.log("tempResponseTime : ", tempResponseTime);
    console.log("tempResolveTime : ", tempResolveTime);
    console.log("tempCloseTime : ", tempCloseTime);

    setResponseTime(tempResponseTime);
    setResolveTime(tempResolveTime);
    setCloseTime(tempCloseTime);

    const details = await getAllOpenTicketDetails();
    const closedDetails = await getAllClosedTicketDetails(plantId);
    console.log("formData.plantID : ", plantId);
    setAllTickets(details.filter((ticket) => ticket.plantId === plantId));
    console.log("closedDetails : ", closedDetails);
    console.log("closedTickets : ", closedTickets);
    setClosedTickets(closedDetails);
  };

  const fetchDivs = async (role) => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
      console.log("Currently passed Data : ", location.state);
      console.log("Current UserData in fetchDivs() : ", userData);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        navigate("/*");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
        console.log("data.components.length : ", data.components.length);
        if (data.components.length === 0) {
          navigate("/*");
        }
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
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

  const Columns = [
    {
      id: "ticketNo",
      label: "Ticket No",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_raising_time",
      label: "Raisingime",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "type",
      label: "Catagory",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "status",
      label: "Status",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      buttons: [
        {
          buttonlabel: "View",
          isButtonDisabled: (row) => {
            // console.log("view Row : ", row);
            return false;
          },
          isButtonRendered: (row) => {
            //console.log("Assign Row : ", row);
            // if (row.status === "open")
            return true;
            // else return false;
          },
          function: (row) => {
            console.log("Obj : ", row);
            setSelectedRow(row);
            setDialogOpen(true);
          },
        },
      ],
      type: "button",
      id: "viewDetails",
      label: "View Details",
    },
    {
      buttons: [
        {
          buttonlabel: "✔",
          isButtonDisabled: (row) => {
            // console.log("view Row : ", row);
            if (row.status === "resolve") {
              return false;
            }
            return true;
          },
          isButtonRendered: (row) => {
            //console.log("Assign Row : ", row);
            // if (row.status === "open")
            return true;
            // else return false;
          },
          function: (row) => {
            console.log("Obj : ", row);
            // setSelectedRow(row);
            // setDialogOpen(true);
            updateStatus(row.plantId, row.ticketNo, row.status);
            showAlert(formData.plantID);
            if (updateStatus(row.plantId, row.ticketNo, row.status)) {
              showAlert(formData.plantID);
            }
            console.log("formData.plantID : ", formData.plantID);
            // setTimeout(() => {
            //   showAlert(formData.plantID);
            // }, 2000);
          },
        },
      ],
      type: "button",
      id: "confirm",
      label: "Confirm",
    },
  ];

  const ClosedTicketColumns = [
    {
      id: "ticketNo",
      label: "Ticket No",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_raising_time",
      label: "Raisingime",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "type",
      label: "Catagory",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "status",
      label: "status",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      buttons: [
        {
          buttonlabel: "View",
          isButtonDisabled: (row) => {
            // console.log("view Row : ", row);
            return false;
          },
          isButtonRendered: (row) => {
            //console.log("Assign Row : ", row);
            // if (row.status === "open")
            return true;
            // else return false;
          },
          function: (row) => {
            console.log("Obj : ", row);
            setSelectedRow(row);
            setDialogOpen(true);
          },
        },
      ],
      type: "button",
      id: "viewDetails",
      label: "View Details",
    },
  ];

  const chartSetting = {
    yAxis: [
      {
        label: "Issue Info",
      },
    ],
    //width: 500,
    height: 265,
  };

  const monthwiseticketraised = async () => {
    try {
      const response = await fetch(
        `http://${DB_IP}/users/user/monthwiseticketraised`,
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
        `http://${DB_IP}/users/user/monthAndCatagoryWiseTicketRaised`,
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

      const currentDate = new Date();
      const currentMonthYear =
        currentDate.toLocaleString("default", { month: "long" }) +
        " " +
        currentDate.getFullYear();
      console.log("currentMonthYear : ", currentMonthYear);
      data.forEach((item) => {
        if (Object.keys(item)[0] === currentMonthYear) {
          // applicationIssuesCurrentMonth = item[currentMonthYear]["Application_Issues"];
          console.log(
            "item[currentMonthYear][Application_Issues] : ",
            item[currentMonthYear]["Application_Issues"]
          );
          setApplicationIssuesCurrentMonth(
            item[currentMonthYear]["Application_Issues"]
          );
          setCriticalApplicationIssuesCurrentMonth(
            item[currentMonthYear]["Critical_Application_Issues"]
          );
          setNonCriticalApplicationIssuesCurrentMonth(
            item[currentMonthYear]["Application_Issues"] -
              item[currentMonthYear]["Critical_Application_Issues"]
          );
          setDeviceIssuesCurrentMonth(item[currentMonthYear]["Device_Issues"]);
          setCriticalDeviceIssuesCurrentMonth(
            item[currentMonthYear]["Critical_Device_Issues"]
          );
          setNonCriticalDeviceIssuesCurrentMonth(
            item[currentMonthYear]["Device_Issues"] -
              item[currentMonthYear]["Critical_Device_Issues"]
          );
          setInfrastructureIssuesCurrentMonth(
            item[currentMonthYear]["Infrastructure_Issues"]
          );
          setCriticalInfrastructureIssuesCurrentMonth(
            item[currentMonthYear]["Critical_Infrastructure_Issues"]
          );
          setNonCriticalInfrastructureIssuesCurrentMonth(
            item[currentMonthYear]["Infrastructure_Issues"] -
              item[currentMonthYear]["Critical_Infrastructure_Issues"]
          );
        }
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  // const getPendingTickets = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://${DB_IP}/users/user/pendingTickets`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("PendingTicketData : ", data);
  //     console.log(
  //       "setPendingTickets : ",
  //       data.filter((ticket) => ticket.status === "pending")
  //     );
  //     console.log(
  //       "setResolvedTickets : ",
  //       data.filter((ticket) => ticket.status === "resolved")
  //     );
  //     console.log(
  //       "setOpenTickets : ",
  //       data.filter((ticket) => ticket.status === "open")
  //     );
  //     // setPendingTickets(data.filter((ticket) => ticket.status === "pending"));
  //     // setResolvedTickets(data.filter((ticket) => ticket.status === "resolved"));
  //     // setOpenTickets(data.filter((ticket) => ticket.status === "open"));
  //     setPendingTickets(data.filter((ticket) => ticket.status !== "closed"));
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  // const getAllTickets = async () => {
  //   try {
  //     const response = await fetch(`http://${DB_IP}/users/user/allTickets`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("allTicketData : ", data);
  //     setAllTicketData(data);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  // const fetchComponents = async () => {
  //   try {
  //     const response = await fetch(`http://${DB_IP}/role/{role}/{pagename}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (response.status === 403) {
  //       localStorage.clear();
  //       navigate("/login");
  //       return;
  //     }
  //     const data = await response.json();
  //     console.log("fetchUser data : ", data);
  //     // localStorage.setItem("userPlantID", data.plantID);
  //     // setUserData(data.plantID);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  const fetchUser = async () => {
    console.log("expire : ", localStorage.getItem("expire"));
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
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
      let role = data.role;
      console.log("Role Test : ", role);
      fetchDivs(role);

      showAlert(data.plantID);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchTicketDetails = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(`http://${DB_IP}/users/user/ticketInfo`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${token}`,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    // const endGracePeriodObj = new Date(endDateObj.getDate() + 30);
    const endGracePeriodObj = new Date(endDateObj);
    endGracePeriodObj.setDate(endDateObj.getDate() + 30);

    const graceDifferenceInMilliseconds =
      endGracePeriodObj.getTime() - startDateObj.getTime();

    const differenceInMilliseconds =
      endDateObj.getTime() - startDateObj.getTime();

    const differenceInDay = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    const graceDifferenceInDay = Math.floor(
      graceDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    setDaysDifferenceTillNow(differenceInDay);
    console.log("DaysDifferenceTillNow : ", differenceInDay);

    setGraceDifferenceTillNow(graceDifferenceInDay);
    console.log("GraceDifferenceTillNow : ", graceDifferenceInDay);

    if (differenceInDay < 0) {
      setSupportDateExpired(true);
    }

    if (graceDifferenceInDay >= 0 && differenceInDay < 0) {
      setGracePeriodStarted(true);
    }

    if (graceDifferenceInDay < 0) {
      setSupportDateExpired(true);
      setGracePeriodExpired(true);
      setGracePeriodStarted(true);
    }
  };

  const fetchCatagoryWiseTrend = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(
        `http://${DB_IP}/users/user/catagoryWiseTrend`,
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
      console.log("catagoryWiseTrend data : ", data);
      setCatagoryWiseTrend(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const urllist = [{ pageName: "Home", pagelink: "/user/home" }];

  return (
    <>
      {/* 
      {supportDateExpired ? (
        <Typography component="h1" variant="h3" sx={{ fontWeight: "600" }}>
          The support period for plant "{formData.plantName}" has expired.
          The support subscription for plant "{formData.plantName}" expired{" "}
          {Math.abs(daysDifferenceTillNow)} days ago.
        </Typography>
      ) : (
      */}
      <div>
        {isLoading ? (
          <div className="spinner-container">
            <CircularProgress size={65} color="info" />
          </div>
        ) : (
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
                <div
                  class="col-md-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  {gracePeriodStarted && gracePeriodExpired && (
                    <Collapse sx={{ width: "100%" }} in={openHeader}>
                      <Alert
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpenHeader(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity="error"
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{ fontWeight: "600", fontSize: "14px" }}
                          color={"#f74747"}
                        >
                          The support subscription for the plant{" "}
                          {formData.plantName} expired{" "}
                          {Math.abs(daysDifferenceTillNow)} days ago. Please
                          renew it to continue receiving support.
                        </Typography>
                      </Alert>
                    </Collapse>
                  )}
                  {gracePeriodStarted && !gracePeriodExpired && (
                    <Collapse sx={{ width: "100%" }} in={openHeader}>
                      <Alert
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpenHeader(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity="error"
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{ fontWeight: "600", fontSize: "14px" }}
                          color={"#f74747"}
                        >
                          The support subscription for plant{" "}
                          {formData.plantName} expired{" "}
                          {Math.abs(daysDifferenceTillNow)} days ago. The grace
                          period will end in {graceDifferenceTillNow} days.
                        </Typography>
                      </Alert>
                    </Collapse>
                  )}
                </div>
                <div class="col-md-7">
                  {divIsVisibleList && divIsVisibleList.includes("trend") && (
                    <>
                      <div class="row">
                        <div class="col-md-4">
                          <Card
                            // onClick={(e) => {
                            //   navigate("/user/ReportDevice", {
                            //     state: { plantID: formData.plantID },
                            //   });
                            // }}

                            onClick={
                              gracePeriodStarted && gracePeriodExpired
                                ? navigate("/user/ReportDevice", {
                                    state: { plantID: formData.plantID },
                                  })
                                : null
                            }
                            sx={{ borderRadius: 1 }}
                          >
                            <CardContent sx={{ padding: "14px !important" }}>
                              {/* <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{
                                    paddingLeft: "2rem",
                                    display: "grid",
                                    alignItems: "center",
                                    justifyItems: "center",
                                  }}
                                >
                                  <div
                                    className="row"
                                    style={{
                                      fontSize: "0.9rem",
                                      fontWeight: 600,
                                      opacity: "0.8",
                                    }}
                                  >
                                    Device
                                  </div>
                                  <div className="row">
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "1.7rem",
                                      }}
                                    >
                                      <CounterAnimation
                                        targetValue={deviceIssuesCurrentMonth}
                                      />
                                    </Typography>
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
                                      <div
                                        style={{
                                          display: "flex",
                                          columnGap: "0.5rem",
                                        }}
                                      >
                                        <Badge
                                          value={
                                            criticalDeviceIssuesCurrentMonth
                                          }
                                          severity="warning"
                                        ></Badge>
                                        <Badge
                                          value={
                                            nonCriticalDeviceIssuesCurrentMonth
                                          }
                                          severity="info"
                                        ></Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <Button
                                        style={{
                                          borderRadius: "50%",
                                          padding: 0,
                                        }}
                                        icon={
                                          catagoryWiseTrend[0]
                                            .device_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        size="small"
                                        rounded
                                        text
                                        severity={
                                          catagoryWiseTrend[0]
                                            .device_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                        label="12%"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className="row"
                                    style={{
                                      fontSize: "0.9rem",
                                      fontWeight: 600,
                                      opacity: "0.8",
                                    }}
                                  >
                                    Last 30 days
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Device
                                    </Typography>
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Badge
                                        value={criticalDeviceIssuesCurrentMonth}
                                        severity="warning"
                                      ></Badge>
                                      <Badge
                                        value={
                                          nonCriticalDeviceIssuesCurrentMonth
                                        }
                                        severity="info"
                                      ></Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "1.8rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      <CounterAnimation
                                        targetValue={deviceIssuesCurrentMonth}
                                      />
                                    </Typography>
                                  </div>
                                  <div
                                    className="col-md-6"
                                    style={{ padding: "0.2rem" }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Button
                                        style={{
                                          borderRadius: "50%",
                                          padding: 0,
                                        }}
                                        icon={
                                          catagoryWiseTrend[0]
                                            .device_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        size="small"
                                        rounded
                                        text
                                        severity={
                                          catagoryWiseTrend[0]
                                            .device_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                        label="12%"
                                      />
                                    </div>
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.6rem",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Last 30 days
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div class="col-md-4">
                          <Card
                            // onClick={(e) => {
                            //   navigate("/user/ReportApplication", {
                            //     state: { plantID: formData.plantID },
                            //   });
                            // }}
                            onClick={
                              gracePeriodStarted && gracePeriodExpired
                                ? navigate("/user/ReportApplication", {
                                    state: { plantID: formData.plantID },
                                  })
                                : null
                            }
                          >
                            <CardContent sx={{ padding: "14px !important" }}>
                              {/* <div className="row">
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
                                    <CounterAnimation
                                      targetValue={
                                        applicationIssuesCurrentMonth
                                      }
                                    />
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
                                        icon={
                                          catagoryWiseTrend[0]
                                            .application_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        rounded
                                        //outlined
                                        severity={
                                          catagoryWiseTrend[0]
                                            .application_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                      />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div
                                        style={{
                                          display: "flex",
                                          columnGap: "0.5rem",
                                        }}
                                      >
                                        <Badge
                                          value={
                                            criticalApplicationIssuesCurrentMonth
                                          }
                                          severity="warning"
                                        ></Badge>
                                        <Badge
                                          value={
                                            nonCriticalApplicationIssuesCurrentMonth
                                          }
                                          severity="info"
                                        ></Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Application
                                    </Typography>
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Badge
                                        value={
                                          criticalApplicationIssuesCurrentMonth
                                        }
                                        severity="warning"
                                      ></Badge>
                                      <Badge
                                        value={
                                          nonCriticalApplicationIssuesCurrentMonth
                                        }
                                        severity="info"
                                      ></Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "1.8rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      <CounterAnimation
                                        targetValue={
                                          applicationIssuesCurrentMonth
                                        }
                                      />
                                    </Typography>
                                  </div>
                                  <div
                                    className="col-md-6"
                                    style={{ padding: "0.2rem" }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Button
                                        style={{
                                          borderRadius: "50%",
                                          padding: 0,
                                        }}
                                        icon={
                                          catagoryWiseTrend[0]
                                            .application_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        size="small"
                                        rounded
                                        text
                                        severity={
                                          catagoryWiseTrend[0]
                                            .application_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                        label="12%"
                                      />
                                    </div>
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.6rem",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Last 30 days
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div class="col-md-4">
                          <Card
                            // onClick={(e) => {
                            //   navigate("/user/ReportInfrastructure", {
                            //     state: { plantID: formData.plantID },
                            //   });
                            // }}
                            onClick={
                              gracePeriodStarted && gracePeriodExpired
                                ? navigate("/user/ReportInfrastructure", {
                                    state: { plantID: formData.plantID },
                                  })
                                : null
                            }
                          >
                            <CardContent sx={{ padding: "14px !important" }}>
                              {/* <div className="row">
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
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "1.7rem",
                                      }}
                                    >
                                      <CounterAnimation
                                        targetValue={
                                          infrastructureIssuesCurrentMonth
                                        }
                                      />
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
                                        // icon={
                                        //   catagoryWiseTrend[0]
                                        //     .infrastructure_difference > 0
                                        //     ? "pi pi-thumbs-down-fill"
                                        //     : "pi pi-thumbs-up-fill"
                                        // }
                                        icon={
                                          catagoryWiseTrend[0]
                                            .infrastructure_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        rounded
                                        //outlined
                                        severity={
                                          catagoryWiseTrend[0]
                                            .infrastructure_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                      />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div
                                        style={{
                                          display: "flex",
                                          columnGap: "0.5rem",
                                        }}
                                      >
                                        <Badge
                                          value={
                                            criticalInfrastructureIssuesCurrentMonth
                                          }
                                          severity="warning"
                                        ></Badge>
                                        <Badge
                                          value={
                                            nonCriticalInfrastructureIssuesCurrentMonth
                                          }
                                          severity="info"
                                        ></Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Infrastructure
                                    </Typography>
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Badge
                                        value={
                                          criticalInfrastructureIssuesCurrentMonth
                                        }
                                        severity="warning"
                                      ></Badge>
                                      <Badge
                                        value={
                                          nonCriticalInfrastructureIssuesCurrentMonth
                                        }
                                        severity="info"
                                      ></Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "1.8rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      <CounterAnimation
                                        targetValue={
                                          infrastructureIssuesCurrentMonth
                                        }
                                      />
                                    </Typography>
                                  </div>
                                  <div
                                    className="col-md-6"
                                    style={{ padding: "0.2rem" }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "0.4rem",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Button
                                        style={{
                                          borderRadius: "50%",
                                          padding: 0,
                                        }}
                                        icon={
                                          catagoryWiseTrend[0]
                                            .infrastructure_difference > 0 ? (
                                            <TrendingDownIcon />
                                          ) : (
                                            <TrendingUpIcon />
                                          )
                                        }
                                        size="small"
                                        rounded
                                        text
                                        severity={
                                          catagoryWiseTrend[0]
                                            .infrastructure_difference > 0
                                            ? "danger"
                                            : "success"
                                        }
                                        aria-label="Cancel"
                                        label="12%"
                                      />
                                    </div>
                                    <Typography
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.6rem",
                                        opacity: "0.8",
                                      }}
                                    >
                                      Last 30 days
                                    </Typography>
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
                          <Card>
                            <CardContent
                              sx={{ padding: "12px 8px 2px 8px !important" }}
                            >
                              {" "}
                              <Typography sx={{ marginBottom: "8px" }}>
                                Last 3 Months
                              </Typography>
                              <div>
                                <MeterGroup
                                  values={matergroupvalues}
                                  max={100}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* <div>
                <Typography>
                  {Array.isArray([responseTime]) ? 1 : 0},
                  {Array.isArray([resolveTime]) ? 1 : 0},
                  {Array.isArray([closeTime]) ? 1 : 0}
                </Typography>
              </div> */}
                  {divIsVisibleList &&
                    divIsVisibleList.includes("spark-line") && (
                      <div class="row" style={{ marginTop: "1rem" }}>
                        <div class="col-md-4">
                          <Card>
                            <CardContent
                              sx={{
                                padding: "0px !important",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  padding: "10px 12px",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  opacity: "0.8",
                                }}
                              >
                                Response Time
                              </Typography>
                              <Divider
                                sx={{ opacity: "0.8", marginBottom: "0.5rem" }}
                              />

                              <SparkLineChart data={responseTime} height={35} />
                            </CardContent>
                          </Card>
                        </div>
                        <div class="col-md-4">
                          <Card>
                            <CardContent
                              sx={{
                                padding: "0px !important",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  padding: "10px 12px",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  opacity: "0.8",
                                }}
                              >
                                Resolved Time
                              </Typography>
                              <Divider
                                sx={{ opacity: "0.8", marginBottom: "0.5rem" }}
                              />

                              <SparkLineChart data={resolveTime} height={35} />
                            </CardContent>
                          </Card>
                        </div>
                        <div class="col-md-4">
                          <Card>
                            <CardContent
                              sx={{
                                padding: "0px !important",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  padding: "10px 12px",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  opacity: "0.8",
                                }}
                              >
                                Close Time
                              </Typography>
                              <Divider
                                sx={{ opacity: "0.8", marginBottom: "0.5rem" }}
                              />

                              <SparkLineChart data={closeTime} height={35} />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                </div>
                {/* {divIsVisibleList && divIsVisibleList.includes("table") && (
                  <div class="col-md-5">
                    <Button
                      onClick={() => {
                        handleToggleView();
                      }}
                      style={{ width: "100%", borderRadius: "30px" }}
                    >
                      {viewMode === "all"
                        ? "Show Ticket History"
                        : "Show All Tickets"}
                    </Button>
                    {viewMode === "all" ? (
                      <div className="row">
                        <div className="col-md-12">
                          <Card className="dashboard-rightSide-Table">
                            <CardContent sx={{ padding: "0" }}>
                              {allTickets && (
                                <CustomTable
                                  columns={Columns}
                                  rows={allTickets}
                                  isNotDeletable={true}
                                  setRows={setAllTickets}
                                  tablename={"All Tickets"}
                                ></CustomTable>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-md-12">
                          <Card className="dashboard-rightSide-Table">
                            <CardContent sx={{ padding: "0" }}>
                              {closedTickets && (
                                <CustomTable
                                  columns={ClosedTicketColumns}
                                  rows={closedTickets}
                                  isNotDeletable={true}
                                  setRows={setClosedTickets}
                                  tablename={"Ticket History"}
                                ></CustomTable>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </div>
                )} */}
                <div class="col-md-5">
                  {divIsVisibleList && divIsVisibleList.includes("chart") && (
                    <div class="row">
                      <div class="col-md-12">
                        {/* <Card>
                  <CardContent sx={{ paddingBottom: "16px !important" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      Last Ticket Raised
                    </Typography>
                  </CardContent>
                </Card> */}
                        <Card>
                          <CardContent sx={{ padding: "0px !important" }}>
                            {/* <ResponsiveChartContainer> */}
                            <Typography
                              sx={{ fontWeight: 600, padding: "10px 12px" }}
                            >
                              Last 3 months
                            </Typography>
                            <Divider sx={{ opacity: "0.8" }} />
                            <BarChart
                              dataset={monthWiseTicket}
                              xAxis={[{ scaleType: "band", dataKey: "month" }]}
                              series={[
                                {
                                  dataKey: "Issue_Count",
                                  label: "Issue Count",
                                },
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
                  )}
                </div>
              </div>
              <div class="row" style={{ marginTop: "1rem" }}>
                <div class="col-md-12">
                  {divIsVisibleList && divIsVisibleList.includes("table") && (
                    <div class="col-md-12">
                      <Button
                        onClick={() => {
                          handleToggleView();
                        }}
                        style={{ width: "100%", borderRadius: "30px" }}
                      >
                        {viewMode === "all"
                          ? "Show Ticket History"
                          : "Show All Tickets"}
                      </Button>
                      {viewMode === "all" ? (
                        <div className="row">
                          <div className="col-md-12">
                            <Card className="dashboard-rightSide-Table">
                              <CardContent sx={{ padding: "0" }}>
                                {allTickets && (
                                  <CustomTable
                                    columns={Columns}
                                    rows={allTickets}
                                    isNotDeletable={true}
                                    setRows={setAllTickets}
                                    tablename={"All Tickets"}
                                  ></CustomTable>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-12">
                            <Card className="dashboard-rightSide-Table">
                              <CardContent sx={{ padding: "0" }}>
                                {closedTickets && (
                                  <CustomTable
                                    columns={ClosedTicketColumns}
                                    rows={closedTickets}
                                    isNotDeletable={true}
                                    setRows={setClosedTickets}
                                    tablename={"Ticket History"}
                                  ></CustomTable>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </Box>
        )}
      </div>
      {/* )} */}
      <div>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
          <div>
            {/* <DialogTitle>Details</DialogTitle> */}
            <DialogContent>
              {selectedRow && (
                <div>
                  <DataTableByCatagory
                    plantId={selectedRow.plantId}
                    ticketNo={selectedRow.ticketNo}
                  ></DataTableByCatagory>
                </div>
              )}
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default UserHome;
