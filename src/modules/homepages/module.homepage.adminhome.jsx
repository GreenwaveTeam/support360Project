import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  InputLabel,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Container,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Textfield from "../../components/textfield/textfield.component";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import CloseIcon from "@mui/icons-material/Close";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { useUserContext } from "../contexts/UserContext";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useContext } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SendIcon from "@mui/icons-material/Send";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { width } from "@mui/system";
import { extendTokenExpiration } from "../helper/Support360Api";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

export default function AdminHome({ sendUrllist }) {
  const [userList, setUserList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [filteredUserRows, setFilteredUserRows] = useState(userList);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");
  const [openUserResetPasswordDialog, setOpenUserResetPasswordDialog] =
    useState(false);
  const [adminList, setAdminList] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [filteredAdminRows, setFilteredAdminRows] = useState(adminList);
  const [openAdminDeleteDialog, setOpenAdminDeleteDialog] = useState(false);
  const [openAdminResetPasswordDialog, setOpenAdminResetPasswordDialog] =
    useState(false);
  const [selectedAdminID, setSelectedAdminID] = useState("");
  const [logedUser, setLogedUser] = useState([]);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const navigate = useNavigate();
  // const [switchLabel, setSwitchLabel] = useState("Toggle Admin");
  // const [switchChecked, setSwitchChecked] = useState(false);
  // const handleSwitchChange = (event) => {
  //   setSwitchChecked(event.target.checked);
  //   setSwitchLabel(event.target.checked ? "Toggle User" : "Toggle Admin");
  // };

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  const defaultPassword = "user_123";

  // function convertToInitials(name) {
  //   const parts = name.split(" ");
  //   const initials = parts[0].charAt(0).toUpperCase();
  //   return initials;
  //   return name
  //     .split(" ")
  //     .map((part) => part[0])
  //     .join("")
  //     .toUpperCase();
  // }

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  const newColors = ["#ff7043", "#7e57c2", "#81c784"];
  const getColor = (index) => {
    return newColors[index % newColors.length]; // Cycle through colors based on index
  };

  const { userData, setUserData } = useUserContext();
  console.log("userData ==>> ", userData);

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
    fetchUser();
    fetchUserData();
    fetchAdminData();
    sendUrllist(urllist);
  }, []);

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
      console.log("fetchUser email : ", data.email);
      setLogedUser(data);

      let role = data.role;
      console.log("Role Test : ", role);
      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
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

  const fetchUserData = async () => {
    console.log(`adminhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(
        `http://${DB_IP}/users/`,
        // `http://${process.env.SERVERIP}:${process.env.PORT}/users/`
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("response : ", data);

      const filteredData = data.filter((item) => item.plantID !== "NA");

      setUserList(filteredData);
      setFilteredUserRows(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await fetch(
        `http://${DB_IP}/users/`,
        // const response = await fetch("http://localhost:8081/admins/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("response : ", data);

      const filteredData = data.filter((item) => item.plantID === "NA");

      setAdminList(filteredData);
      setFilteredAdminRows(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  // async function deleteUserByUserID(e) {
  //   try {
  //     const response = await fetch(`http://localhost:8081/admins/admin/${e}`, {
  //       method: "DELETE",
  //       headers: {
  //         Accept: "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("data : ", data);
  //     setList((prevList) => {
  //       prevList.filter((item) => item.userId !== e);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function deleteUserByUserID(e) {
    console.log("e : ", e);
    try {
      const response = await fetch(`http://${DB_IP}/users/user/${e}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.ok;
      console.log("e : ", e);
      console.log("data : ", data);
      setUserList((prevList) => prevList.filter((item) => item.userId !== e));
      setFilteredUserRows((prevList) =>
        prevList.filter((item) => item.userId !== e)
      );
      if (data) {
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAdminByAdminID(e) {
    try {
      const response = await fetch(`http://${DB_IP}/admins/admin/${e}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.ok;
      console.log("e : ", e);
      console.log("data : ", data);
      setAdminList((prevList) => prevList.filter((item) => item.userId !== e));
      setFilteredAdminRows((prevList) =>
        prevList.filter((item) => item.userId !== e)
      );
      if (data) {
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function resetPasswordByAdminID(e) {
    try {
      const response = await fetch(
        `http://${DB_IP}/users/user/resetPassword?userId=${e}&defaultPassword=${defaultPassword}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.ok;
      console.log("e : ", e);
      console.log("data : ", data);
      if (data) {
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // async function resetPasswordByUserID(e) {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8081/admins/admin/resetPassword?adminId=${e}&defaultPassword=${defaultPassword}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.ok;
  //     console.log("e : ", e);
  //     console.log("data : ", data);
  //     if (data) {
  //       navigate("/admin/home");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const handleEdit = (admin) => {
  //   history.push({
  //     pathname: "/UserRegistration",
  //     state: { admin },
  //   });
  // };

  // async function deleteAdminByAdminID(e) {
  //   try {
  //     const response = await fetch(`http://localhost:8081/admins/admin/${e}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.ok;
  //     console.log("data : ", data);
  //     setAdminList((prevList) => prevList.filter((item) => item.userId !== e));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleUserSearchChange = (event) => {
    setUserSearch(event.target.value);
    console.log("Search => ", event.target.value);
    const currentSearch = event.target.value;
    console.log("Search => ", userSearch);
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredUserRows(userList);
    } else {
      const updatedUserRows = [...userList];
      const filteredUserRows = updatedUserRows.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          user.email
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          user.userId.toLowerCase().includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredUserRows);
      setFilteredUserRows(filteredUserRows);
    }
  };

  const handleAdminSearchChange = (event) => {
    setAdminSearch(event.target.value);
    console.log("Search => ", event.target.value);
    const currentSearch = event.target.value;
    console.log("Search => ", adminSearch);
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredAdminRows(adminList);
    } else {
      const updatedAdminRows = [...adminList];
      const filteredAdminRows = updatedAdminRows.filter(
        (admin) =>
          admin.name
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          admin.email
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          admin.userId
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredAdminRows);
      setFilteredAdminRows(filteredAdminRows);
    }
  };

  const handleDelete = (userId) => {
    setOpenDeleteDialog(true);
    setSelectedUserID(userId);
  };

  const handleAdminDelete = (adminId) => {
    setOpenAdminDeleteDialog(true);
    setSelectedAdminID(adminId);
  };

  const handleAdminPasswordReset = (adminId) => {
    setOpenAdminResetPasswordDialog(true);
    setSelectedAdminID(adminId);
  };

  const handleUserPasswordReset = (adminId) => {
    setOpenUserResetPasswordDialog(true);
    setSelectedUserID(adminId);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const tableStyle = {
    color: "blue",
    border: "1px solid",
    borderColor: colors.grey[800],
    borderRadius: "0.7rem",
  };

  const urllist = [{ pageName: "Admin Home", pagelink: "/admin/home" }];

  const lists = [
    "toggle",
    "existing-admins",
    "existing-users",
    "page-assign",
    "register-new-admin",
    "register-new-user",
  ];
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TabList
              textColor="secondary"
              indicatorColor="secondary"
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Tab label="Admin" value="1" />
              <Tab label="User" value="2" />
            </TabList>
            <div style={{ height: "inherit", display: "flex" }}>
              <div style={{ height: "inherit" }}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    mt: 1.2,
                    mb: 1,
                    backgroundImage:
                      "linear-gradient(to top, #0ba360 0%, #3cba92 100%);",
                    marginRight: "8px",
                  }}
                  onClick={() => {
                    navigate("/admin/Role");
                  }}
                >
                  Page Assign
                </Button>
              </div>
              <div style={{ height: "inherit" }}>
                <Button
                  variant="contained"
                  startIcon={<LocationCityIcon />}
                  sx={{
                    mt: 1.2,
                    mb: 1,

                    backgroundImage:
                      "linear-gradient(to top, #7e57c2 0%, #7e57c2 100%);",
                    marginRight: "8px",
                  }}
                  onClick={() => {
                    navigate("/admin/plantConfigure");
                  }}
                >
                  Plant Configure
                </Button>
              </div>
              <div style={{ height: "inherit" }}>
                <Button
                  variant="contained"
                  startIcon={<PermContactCalendarIcon />}
                  sx={{
                    mt: 1.2,
                    mb: 1,
                    backgroundImage:
                      "linear-gradient(to top, #f56133 0%, #f56133 100%);",
                  }}
                  onClick={() => {
                    navigate("/admin/allocateTicket");
                  }}
                >
                  Ticket Allocate
                </Button>
              </div>
            </div>
          </Box>
          <TabPanel value="1" sx={{ padding: "5px" }}>
            <div>
              {/* <div>
              {divIsVisibleList.includes("register-new-admin") && (
                <Button
                  variant="contained"
                  startIcon={<PersonRoundedIcon />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/adminregistration")}
                >
                  Register New Admin
                </Button>
              )}
            </div> */}
              <div>
                {/* {divIsVisibleList.includes("existing-admins") && ( */}
                <>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    margin="1rem"
                  >
                    {/* <Typography component="h1" variant="h5">
                  User Information
                </Typography> */}
                  </Box>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <TableContainer sx={tableStyle}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              sx={{
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "bold",
                                backgroundColor: colors.primary[400],
                              }}
                            >
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "0rem 1rem",
                                }}
                              >
                                <Typography
                                  component="h1"
                                  variant="h6"
                                  sx={{ fontWeight: "600" }}
                                >
                                  Existing Admins
                                </Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    columnGap: "1rem",
                                  }}
                                >
                                  {/* <div>
                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="search">
                                        Search
                                      </InputLabel>
                                      <OutlinedInput
                                        id="search"
                                        name="search"
                                        onChange={(e) =>
                                          handleAdminSearchChange(e)
                                        }
                                        variant={"outlined"}
                                        size="small"
                                        label="Search"
                                        value={adminSearch}
                                        sx={{
                                          width: "200px",
                                        }}
                                        endAdornment={
                                          <InputAdornment position="end">
                                            <IconButton
                                              variant="contained"
                                              aria-label="delete"
                                              size="medium"
                                              onClick={() => {
                                                setAdminSearch("");
                                                setFilteredAdminRows(adminList);
                                              }}
                                            >
                                              <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                          </InputAdornment>
                                        }
                                      />
                                    </FormControl>
                                  </div> */}
                                  {/* {divIsVisibleList.includes(
                                      "register-new-admin"
                                    ) && ( */}
                                  <Button
                                    sx={{
                                      backgroundImage:
                                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
                                    }}
                                    variant="contained"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() =>
                                      navigate("/admin/adminregistration")
                                    }
                                  >
                                    Register New Admin
                                  </Button>
                                  {/* )} */}
                                  <div>
                                    {/* <Textfield
                                        onChange={(e) =>
                                          handleAdminSearchChange(e)
                                        }
                                        variant={"outlined"}
                                        size="small"
                                        label={
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <SearchOutlinedIcon
                                              style={{ marginRight: "5px" }}
                                            />
                                            Search...
                                          </div>
                                        }
                                        value={adminSearch}
                                        sx={{
                                          marginLeft: "5px",
                                          width: "200px",
                                          // Set the background color to white
                                        }}
                                      />
                                      <Tooltip title="Clear">
                                        <IconButton
                                          variant="contained"
                                          aria-label="delete"
                                          size="medium"
                                          onClick={() => {
                                            setAdminSearch("");
                                            setFilteredAdminRows(adminList);
                                          }}
                                        >
                                          <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                      </Tooltip> */}

                                    <FormControl fullWidth>
                                      <InputLabel
                                        sx={{ marginTop: "-7px" }}
                                        htmlFor="search"
                                      >
                                        <div style={{ display: "flex" }}>
                                          <SearchOutlinedIcon
                                            style={{
                                              fontSize: "1rem",
                                              marginRight: "5px",
                                            }}
                                          />
                                          Search...
                                        </div>
                                      </InputLabel>

                                      <OutlinedInput
                                        label="   Search..."
                                        autoComplete="search"
                                        name="search"
                                        required
                                        fullWidth
                                        id="search"
                                        value={adminSearch}
                                        sx={{
                                          marginLeft: "5px",
                                          width: "200px",
                                          padding: "17px 14px !important",
                                          height: "1.1375rem !important",
                                        }}
                                        onChange={(e) =>
                                          handleAdminSearchChange(e)
                                        }
                                        endAdornment={
                                          <Tooltip title="Clear">
                                            <InputAdornment position="end">
                                              <IconButton
                                                variant="contained"
                                                aria-label="delete"
                                                size="medium"
                                                onClick={() => {
                                                  setAdminSearch("");
                                                  setFilteredAdminRows(
                                                    adminList
                                                  );
                                                }}
                                              >
                                                <CloseIcon fontSize="inherit" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>
                                        }
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableHead>
                          <TableRow
                            sx={{ backgroundColor: colors.primary[400] }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Admin ID
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Edit
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Delete
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "2rem",
                              }}
                              align="center"
                            >
                              Password Reset
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAdminRows.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell align="center" width={200}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row-reverse",
                                    justifyContent: " flex-end",
                                    columnGap: "0.8rem",
                                    flexBasis: "0",
                                    marginLeft: "2.5rem",
                                  }}
                                >
                                  {item.name}
                                  <Avatar
                                    sx={{
                                      bgcolor: getColor(index),
                                      width: 30,
                                      height: 30,
                                    }}
                                    // size={{sx}}
                                  >
                                    {convertToInitials(item.name)}
                                  </Avatar>
                                </Box>
                              </TableCell>
                              <TableCell align="center">{item.email}</TableCell>
                              <TableCell align="center">
                                {/* {item.userId} */}
                                <Chip
                                  variant="outlined"
                                  label={item.userId}
                                  sx={{
                                    color: getColor(index),
                                    borderColor: getColor(index),
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              {/* <TableCell
                            style={{
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                            onClick={() => {
                              localStorage.setItem(
                                "adminPlantID",
                                item.plantID
                              );
                              navigate("/AdminPage");
                            }}
                            align="center"
                          >
                            {item.userId}
                          </TableCell> */}
                              <TableCell align="center">
                                <IconButton
                                  sx={{ border: "2px solid #90cbfc" }}
                                >
                                  <EditIcon
                                    color="primary"
                                    style={{
                                      cursor: "pointer",
                                      color: "#42a5f5",
                                    }}
                                    onClick={() => {
                                      console.log("item : ", item);
                                      navigate("/admin/adminregistration", {
                                        state: { admin: item },
                                      });
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                              <TableCell align="center">
                                {/* <DeleteIcon
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleAdminDelete(item.userId)
                                    }
                                  /> */}
                                {item.email === logedUser.email ? (
                                  <IconButton
                                    sx={{ border: "2px solid #ccc6c6" }}
                                  >
                                    <DeleteIcon
                                      color="#747474"
                                      style={{ cursor: "not-allowed" }}
                                    />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    sx={{ border: "2px solid #f88989" }}
                                  >
                                    <DeleteIcon
                                      color="error"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleAdminDelete(item.userId)
                                      }
                                    />
                                  </IconButton>
                                )}
                                <Dialog
                                  open={openAdminDeleteDialog}
                                  onClose={() =>
                                    setOpenAdminDeleteDialog(false)
                                  }
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Delete Admin?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to delete this
                                      admin: {selectedAdminID} ?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() =>
                                        setOpenAdminDeleteDialog(false)
                                      }
                                      color="primary"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        deleteAdminByAdminID(selectedAdminID);
                                        setOpenAdminDeleteDialog(false);
                                      }}
                                      color="error"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableCell>
                              <TableCell align="center">
                                {/* <DeleteIcon
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleAdminDelete(item.userId)
                                    }
                                  /> */}
                                <IconButton
                                  sx={{ border: "2px solid #bdbdbd" }}
                                >
                                  <LockResetOutlinedIcon
                                    style={{
                                      cursor: "pointer",
                                      color: "#000000",
                                    }}
                                    onClick={() =>
                                      handleAdminPasswordReset(item.userId)
                                    }
                                  />
                                </IconButton>
                                <Dialog
                                  open={openAdminResetPasswordDialog}
                                  onClose={() =>
                                    setOpenAdminResetPasswordDialog(false)
                                  }
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Delete Admin?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to reset password
                                      for admin: {selectedAdminID} ?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() =>
                                        setOpenAdminResetPasswordDialog(false)
                                      }
                                      color="primary"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        // deleteAdminByAdminID(deleteAdminID);
                                        resetPasswordByAdminID(selectedAdminID);
                                        setOpenAdminResetPasswordDialog(false);
                                      }}
                                      color="error"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
                {/* )} */}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "5px" }}>
            <div>
              {/* <div>
              {divIsVisibleList.includes("register-new-user") && (
                <Button
                  variant="contained"
                  startIcon={<PersonRoundedIcon />}
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => navigate("/admin/userregistration")}
                >
                  Register New User
                </Button>
              )}
            </div> */}
              <div>
                {/* {divIsVisibleList.includes("existing-users") && ( */}
                <>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    margin="1rem"
                  >
                    {/* <Typography component="h1" variant="h5">
                  Existing Users
                </Typography> */}
                  </Box>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <TableContainer sx={tableStyle}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              sx={{
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "bold",
                                backgroundColor: colors.primary[400],
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  component="h1"
                                  variant="h6"
                                  sx={{ fontWeight: "600" }}
                                >
                                  Existing Users
                                </Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    columnGap: "1rem",
                                  }}
                                >
                                  {/* {divIsVisibleList.includes(
                                      "register-new-user"
                                    ) && ( */}
                                  <Button
                                    sx={{
                                      backgroundImage:
                                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
                                    }}
                                    variant="contained"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() =>
                                      navigate("/admin/userregistration")
                                    }
                                  >
                                    Register New User
                                  </Button>
                                  {/* )} */}
                                  <div>
                                    {/* <Textfield
                                        onChange={(e) => handleSearchChange(e)}
                                        variant={"outlined"}
                                        size="small"
                                        label={
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <SearchOutlinedIcon
                                              style={{ marginRight: "5px" }}
                                            />
                                            Search...
                                          </div>
                                        }
                                        value={search}
                                        sx={{
                                          marginLeft: "5px",
                                          width: "200px",
                                        }}
                                      />
                                      <Tooltip title="Clear">
                                        <IconButton
                                          variant="contained"
                                          aria-label="delete"
                                          size="medium"
                                          onClick={() => {
                                            setSearch("");
                                            setFilteredRows(list);
                                          }}
                                        >
                                          <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                      </Tooltip> */}
                                    <FormControl fullWidth>
                                      <InputLabel
                                        sx={{ marginTop: "-7px" }}
                                        htmlFor="search"
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            //padding: "10px 14px !important",
                                          }}
                                        >
                                          <SearchOutlinedIcon
                                            style={{
                                              fontSize: "1rem",
                                              marginRight: "5px",
                                              //marginTop: "-1rem",
                                              // padding: "14.5px 14px !important",
                                              //height: "0.9375rem !important",
                                            }}
                                          />
                                          Search...
                                        </div>
                                      </InputLabel>
                                      <OutlinedInput
                                        label="   Search..."
                                        autoComplete="search"
                                        name="search"
                                        required
                                        fullWidth
                                        id="search"
                                        value={userSearch}
                                        sx={{
                                          marginLeft: "5px",
                                          width: "200px",
                                          padding: "17px 14px !important",
                                          height: "1.1375rem !important",
                                        }}
                                        onChange={(e) =>
                                          handleUserSearchChange(e)
                                        }
                                        endAdornment={
                                          <Tooltip title="Clear">
                                            <InputAdornment position="end">
                                              <IconButton
                                                variant="contained"
                                                aria-label="delete"
                                                size="medium"
                                                onClick={() => {
                                                  setUserSearch("");
                                                  setFilteredUserRows(userList);
                                                }}
                                              >
                                                <CloseIcon fontSize="inherit" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>
                                        }
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableHead>
                          <TableRow
                            sx={{ backgroundColor: colors.primary[400] }}
                          >
                            {/* <TableCell sx={{ width: 0 }}></TableCell> */}
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "20%",
                              }}
                              align="center"
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "20%",
                              }}
                              align="center"
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "20%",
                              }}
                              align="center"
                            >
                              Plant Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "20%",
                              }}
                              align="center"
                            >
                              User ID
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "10%",
                              }}
                              align="center"
                            >
                              Edit
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                width: "10%",
                              }}
                              align="center"
                            >
                              Delete
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              align="center"
                            >
                              Password Reset
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredUserRows.map((item, index) => (
                            <TableRow key={index}>
                              {/* <TableCell
                                //  align="right"
                                sx={{
                                  // display: "flex",
                                  alignItems: "right",
                                  // flexDirection: "row-reverse",
                                  justifyContent: "right",
                                  // columnGap: "1.2rem",
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: colors.blueAccent[500],
                                  }}
                                >
                                  {convertToInitials(item.name)}
                                </Avatar>
                              </TableCell> */}
                              <TableCell align="center" width={200}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row-reverse",
                                    justifyContent: " flex-end",
                                    columnGap: "0.8rem",
                                    flexBasis: "0",
                                    marginLeft: "2.5rem",
                                  }}
                                >
                                  {item.name}
                                  <Avatar
                                    sx={{
                                      // bgcolor: colors.blueAccent[500],
                                      bgcolor: getColor(index),
                                      width: 30,
                                      height: 30,
                                    }}
                                  >
                                    {convertToInitials(item.name)}
                                  </Avatar>
                                </Box>
                              </TableCell>

                              <TableCell align="center">{item.email}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  variant="filled"
                                  label={item.plantName}
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                />
                                {console.log("color", getColor(index))}
                              </TableCell>
                              <TableCell
                                style={{
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                }}
                                onClick={() => {
                                  navigate("/admin/configurePage");
                                  setUserData({
                                    ...userData,
                                    plantID: item.plantID,
                                    role: item.role,
                                    userId: item.userId,
                                    name: item.name,
                                  });
                                }}
                                align="center"
                              >
                                <Tooltip title="Configure ➚ ">
                                  <Chip
                                    variant="outlined"
                                    label={item.userId}
                                    sx={{
                                      color: getColor(index),
                                      borderColor: getColor(index),
                                      fontWeight: 600,
                                    }}
                                  />
                                </Tooltip>
                              </TableCell>
                              {/* </Link> */}
                              <TableCell align="center">
                                {/* <Link
                            style={{ textDecoration: "none", color: "inherit" }}
                          > */}
                                <IconButton
                                  sx={{ border: "2px solid #90cbfc" }}
                                  onClick={() => {
                                    console.log("item : ", item);
                                    navigate("/admin/userregistration", {
                                      state: { user: item },
                                    });
                                  }}
                                >
                                  <EditIcon
                                    style={{
                                      cursor: "pointer",
                                      color: "#42a5f5",
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                              <TableCell align="center">
                                {/* <DeleteIcon
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                    // onClick={(e) => {
                                    //   deleteUserByUserID(item.userId);
                                    // }}
                                    onClick={(e) => handleDelete(item.userId)}
                                  /> */}
                                {item.email === logedUser.email ? (
                                  <IconButton
                                    sx={{ border: "2px solid #ccc6c6" }}
                                  >
                                    <DeleteIcon
                                      color="#747474"
                                      style={{ cursor: "not-allowed" }}
                                    />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    sx={{ border: "2px solid #f88989" }}
                                  >
                                    <DeleteIcon
                                      color="error"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleDelete(item.userId)}
                                    />
                                  </IconButton>
                                )}
                                <Dialog
                                  open={openDeleteDialog}
                                  onClose={() => setOpenDeleteDialog(false)}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Delete User?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to delete this user
                                      : {selectedUserID} ?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() => setOpenDeleteDialog(false)}
                                      color="primary"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        deleteUserByUserID(selectedUserID);
                                        setOpenDeleteDialog(false);
                                      }}
                                      color="error"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  sx={{ border: "2px solid #bdbdbd" }}
                                >
                                  <LockResetOutlinedIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleUserPasswordReset(item.userId)
                                    }
                                  />
                                </IconButton>
                                <Dialog
                                  open={openUserResetPasswordDialog}
                                  onClose={() =>
                                    setOpenUserResetPasswordDialog(false)
                                  }
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Reset Password?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to reset password
                                      for user: {selectedUserID} ?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() =>
                                        setOpenUserResetPasswordDialog(false)
                                      }
                                      color="primary"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        // deleteAdminByAdminID(deleteAdminID);
                                        resetPasswordByAdminID(selectedUserID);
                                        setOpenUserResetPasswordDialog(false);
                                      }}
                                      color="error"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
                {/* )} */}
              </div>
            </div>
          </TabPanel>
        </TabContext>
        <div>
          {/* <Grid
          item
          xs={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          margin={"10px"}
          border={"1px solid #74747469"}
          borderRadius={"1rem"}
          paddingBottom={"10px"}
        >
          {divIsVisibleList.includes("toggle") && (
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  color="secondary"
                  checked={switchChecked}
                  onChange={handleSwitchChange}
                />
              }
              label={switchLabel}
              labelPlacement="bottom"
            />
          )}

          {!switchChecked && divIsVisibleList.includes("register-new-user") && (
            <Button
              variant="contained"
              startIcon={<PersonRoundedIcon />}
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/admin/userregistration")}
            >
              Register New User
            </Button>
          )}

          {switchChecked && divIsVisibleList.includes("register-new-admin") && (
            <Button
              variant="contained"
              startIcon={<PersonRoundedIcon />}
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/admin/adminregistration")}
            >
              Register New Admin
            </Button>
          )}
        </Grid>
        {!switchChecked && divIsVisibleList.includes("existing-users") && (
          <>
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              margin="1rem"
            >
            
            </Box>
            <Grid
              item
              xs={12}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <TableContainer sx={tableStyle}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{
                          textAlign: "center",
                          fontSize: "15px",
                          fontWeight: "bold",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0rem 1rem",
                          }}
                        >
                          <Typography
                            component="h1"
                            variant="h6"
                            sx={{ fontWeight: "600" }}
                          >
                            Existing Users
                          </Typography>
                          <div>
                            <Textfield
                              onChange={(e) => handleSearchChange(e)}
                              variant={"outlined"}
                              size="small"
                              label={
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <SearchOutlinedIcon
                                    style={{ marginRight: "5px" }}
                                  />
                                  Search...
                                </div>
                              }
                              value={search}
                              sx={{
                                marginLeft: "5px",
                                width: "200px",
                                
                              }}
                              
                            />
                          
                            <Tooltip title="Clear">
                              <IconButton
                                variant="contained"
                                aria-label="delete"
                                size="medium"
                                onClick={() => {
                                  setSearch("");
                                  setFilteredRows(list);
                                }}
                              >
                                <CloseIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: colors.primary[400] }}>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Plant Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        User ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="center"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row-reverse",
                            justifyContent: "center",
                            columnGap: "1.2rem",
                          }}
                        >
                          {item.name}
                          <Avatar
                            sx={{
                              bgcolor: colors.blueAccent[500],
                            }}
                          >
                            {convertToInitials(item.name)}
                          </Avatar>
                        </TableCell>
                        <TableCell align="center">{item.email}</TableCell>
                        <TableCell align="center">{item.plantName}</TableCell>
                        <TableCell
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                          onClick={() => {
                           
                            navigate("/admin/configurePage");
                            setUserData({
                              ...userData,
                              plantID: item.plantID,
                              role: item.role,
                              userId: item.userId,
                              name: item.name,
                            });
                          }}
                          align="center"
                        >
                          {item.userId}
                        </TableCell>
                        
                        <TableCell align="center">
                          
                          <EditIcon
                            style={{
                              cursor: "pointer",
                              color: "#42a5f5",
                            }}
                            onClick={() => {
                              console.log("item : ", item);
                              navigate("/admin/userregistration", {
                                state: { user: item },
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <DeleteIcon
                            color="error"
                            style={{ cursor: "pointer" }}
                            // onClick={(e) => {
                            //   deleteUserByUserID(item.userId);
                            // }}
                            onClick={(e) => handleDelete(item.userId)}
                          />
                          <Dialog
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"Delete User?"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this user :{" "}
                                {deleteUserID} ?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => setOpenDeleteDialog(false)}
                                color="primary"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  deleteUserByUserID(deleteUserID);
                                  setOpenDeleteDialog(false);
                                }}
                                color="error"
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )} */}

          {/* {switchChecked && divIsVisibleList.includes("existing-admins") && (
          <>
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              margin="1rem"
            ></Box>
            <Grid
              item
              xs={12}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <TableContainer sx={tableStyle}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{
                          textAlign: "center",
                          fontSize: "15px",
                          fontWeight: "bold",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0rem 1rem",
                          }}
                        >
                          <Typography
                            component="h1"
                            variant="h6"
                            sx={{ fontWeight: "600" }}
                          >
                            Existing Admins
                          </Typography>
                          <div>
                            <Textfield
                              onChange={(e) => handleAdminSearchChange(e)}
                              variant={"outlined"}
                              size="small"
                              label={
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <SearchOutlinedIcon
                                    style={{ marginRight: "5px" }}
                                  />
                                  Search...
                                </div>
                              }
                              value={adminSearch}
                              sx={{
                                marginLeft: "5px",
                                width: "200px",
                              }}
                            />
                            <Tooltip title="Clear">
                              <IconButton
                                variant="contained"
                                aria-label="delete"
                                size="medium"
                                onClick={() => {
                                  setAdminSearch("");
                                  setFilteredAdminRows(adminList);
                                }}
                              >
                                <CloseIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: colors.primary[400] }}>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Admin ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAdminRows.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="center"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row-reverse",
                            justifyContent: "center",
                            columnGap: "1.2rem",
                          }}
                        >
                          {item.name}
                          <Avatar
                            sx={{
                              bgcolor: colors.blueAccent[500],
                            }}
                          >
                            {convertToInitials(item.name)}
                          </Avatar>
                        </TableCell>
                        <TableCell align="center">{item.email}</TableCell>
                        <TableCell align="center">{item.userId}</TableCell>

                        <TableCell align="center">
                          <EditIcon
                            color="primary"
                            style={{ cursor: "pointer", color: "#42a5f5" }}
                            onClick={() => {
                              console.log("item : ", item);
                              navigate("/admin/adminregistration", {
                                state: { admin: item },
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <DeleteIcon
                            color="error"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleAdminDelete(item.userId)}
                          />
                          <Dialog
                            open={openAdminDeleteDialog}
                            onClose={() => setOpenAdminDeleteDialog(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"Delete Admin?"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this admin:{" "}
                                {deleteAdminID} ?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => setOpenAdminDeleteDialog(false)}
                                color="primary"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  deleteAdminByAdminID(deleteAdminID);
                                  setOpenAdminDeleteDialog(false);
                                }}
                                color="error"
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )} */}
        </div>
      </Box>
    </Container>
  );
}
