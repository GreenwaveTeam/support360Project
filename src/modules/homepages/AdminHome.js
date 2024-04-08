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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import { useUserContext } from "../contexts/UserContext";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useContext } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function AdminHome({ sendUrllist }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState(list);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [deleteUserID, setDeleteUserId] = useState("");

  const [adminList, setAdminList] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [filteredAdminRows, setFilteredAdminRows] = useState(adminList);
  const [openAdminDeleteDialog, setOpenAdminDeleteDialog] = useState(false);
  const [deleteAdminID, setDeleteAdminId] = useState("");

  const navigate = useNavigate();
  const [switchLabel, setSwitchLabel] = useState("Toggle Admin");
  const [switchChecked, setSwitchChecked] = useState(false);
  const handleSwitchChange = (event) => {
    setSwitchChecked(event.target.checked);
    setSwitchLabel(event.target.checked ? "Toggle User" : "Toggle Admin");
  };

  function convertToInitials(name) {
    const parts = name.split(" ");
    const initials = parts[0].charAt(0).toUpperCase();
    return initials;
  }

  const { userData, setUserData } = useUserContext();
  console.log("userData ==>> ", userData);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchAdminData();
    sendUrllist(urllist);
  }, []);

  const fetchUserData = async () => {
    console.log(`adminhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(
        "http://localhost:8081/users/",
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

      setList(filteredData);
      setFilteredRows(filteredData);
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
  //       prevList.filter((item) => item.adminID !== e);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function deleteUserByUserID(e) {
    try {
      const response = await fetch(`http://localhost:8081/users/user/${e}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.ok;
      console.log("data : ", data);
      setList((prevList) => prevList.filter((item) => item.userID !== e));
    } catch (error) {
      console.log(error);
    }
  }

  // const handleEdit = (admin) => {
  //   history.push({
  //     pathname: "/UserRegistration",
  //     state: { admin },
  //   });
  // };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    console.log("Search => ", event.target.value);
    const currentSearch = event.target.value;
    console.log("Search => ", search);
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredRows(list);
    } else {
      const updatedRows = [...list];
      const filteredRows = updatedRows.filter((list) =>
        list.name.toLowerCase().includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredRows);
      setFilteredRows(filteredRows);
    }
  };

  const handleDelete = (userID) => {
    setOpenDeleteDialog(true);
    setDeleteUserId(userID);
  };

  const fetchAdminData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/users/",
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

  async function deleteAdminByAdminID(e) {
    try {
      const response = await fetch(`http://localhost:8081/admins/admin/${e}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.ok;
      console.log("data : ", data);
      setAdminList((prevList) => prevList.filter((item) => item.adminID !== e));
    } catch (error) {
      console.log(error);
    }
  }

  const handleAdminSearchChange = (event) => {
    setAdminSearch(event.target.value);
    const currentSearch = event.target.value;
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredAdminRows(adminList);
    } else {
      const updatedRows = [...adminList];
      const filteredRows = updatedRows.filter((list) =>
        list.name.toLowerCase().includes(currentSearch.trim().toLowerCase())
      );
      setFilteredAdminRows(filteredRows);
    }
  };

  const handleAdminDelete = (adminID) => {
    setOpenAdminDeleteDialog(true);
    setDeleteAdminId(adminID);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const tableStyle = {
    color: "blue",
    border: "1px solid",
    borderColor: colors.grey[800],
    borderRadius: "1rem",
  };

  const urllist = [{ pageName: "Admin Home Page", pagelink: "/admin/home" }];

  return (
    <Box sx={{ display: "flex" }}>
      <Typography component="h1" variant="h5">
        {/* Welcome {adminName} */}
      </Typography>
      <Grid
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
        {!switchChecked ? (
          <Button
            variant="contained"
            startIcon={<PersonRoundedIcon />}
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate("/admin/userregistration")}
          >
            Register New User
          </Button>
        ) : (
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
      {!switchChecked ? (
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
                              // Set the background color to white
                            }}
                            //   InputProps={{
                            //     startAdornment: (
                            //         <InputAdornment position="start">
                            //             <SearchOutlinedIcon />
                            //         </InputAdornment>
                            //     ),
                            // }}
                          />
                          {/* <Tooltip title="Clear">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setSearch("");
                                setFilteredRows(list);
                              }}
                              style={{ color: "black" }}
                              startIcon={<DeleteIcon />}
                            >
                              Clear
                            </Button>
                          </Tooltip> */}
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
                          // localStorage.setItem(
                          //   "adminPlantID",
                          //   item.plantID
                          // );
                          navigate("/admin/configurePage");
                          setUserData({
                            ...userData,
                            plantID: item.plantID,
                            role: item.role,
                            userID: item.userID,
                            name: item.name,
                          });
                        }}
                        align="center"
                      >
                        {item.userID}
                      </TableCell>
                      {/* </Link> */}
                      <TableCell align="center">
                        {/* <Link
                            style={{ textDecoration: "none", color: "inherit" }}
                          > */}
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
                          //   deleteUserByUserID(item.adminID);
                          // }}
                          onClick={(e) => handleDelete(item.userID)}
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
      ) : (
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
                      <TableCell align="center">{item.userID}</TableCell>
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
                            {item.userID}
                          </TableCell> */}
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
                          onClick={() => handleAdminDelete(item.adminID)}
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
      )}
    </Box>
  );
}
