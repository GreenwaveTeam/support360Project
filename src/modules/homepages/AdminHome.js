import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
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
import { Link, useNavigate } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Textfield from "../../components/textfield/textfield.component";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import { CategoryOutlined } from "@mui/icons-material";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SidebarPage from "../../components/navigation/sidebar/sidebar";

export default function AdminHome() {
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
  const [adminOpen, setAdminOpen] = useState(false);

  const navigate = useNavigate();
  const [switchLabel, setSwitchLabel] = useState("User List");
  const [switchChecked, setSwitchChecked] = useState(false);
  const handleSwitchChange = (event) => {
    setSwitchChecked(event.target.checked);
    setSwitchLabel(event.target.checked ? "Admin List" : "User List");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchAdminData();
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
        navigate("/adminlogin");
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

  // const columns = [
  //   {
  //     id: "name",
  //     label: "Name",
  //     type: "textbox",
  //     canRepeatSameValue: false,
  //   },
  //   {
  //     id: "email",
  //     label: "Email",
  //     type: "textbox",
  //     canRepeatSameValue: false,
  //   },
  //   {
  //     id: "userID",
  //     label: "UserID",
  //     type: "textbox",
  //     canRepeatSameValue: false,
  //   },
  // ];

  // const handleDeleteClick = async (rowData) => {
  //   try {
  //     const requestBody = {
  //       userID: rowData.userID,
  //     };
  //     console.log("Request body=>" + JSON.stringify(requestBody));
  //     // axios.delete(`http://localhost:8081/users/user/${rowData.userID}`, {
  //     //   data: requestBody,
  //     //   headers:
  //     // });
  //     await fetch("http://localhost:8081/users/", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const updatedCategories = filteredRows.filter(
  //       (app) => app.userID !== rowData.userID
  //     );
  //     setFilteredRows(updatedCategories);
  //   } catch (e) {
  //     console.log("Exception");
  //   }
  // };

  const fetchAdminData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admins/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/adminlogin");
        return;
      }
      const data = await response.json();
      console.log("response : ", data);

      const filteredData = data.filter((item) => item.plantID !== "NA");

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

  return (
    <Box sx={{ display: "flex" }}>
      <TopbarPage
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[{ pageName: "Admin Home Page", pagelink: "/AdminHome" }]}
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
            border={"2px solid gray"}
            borderRadius={"20px"}
            paddingBottom={"10px"}
          >
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={switchChecked}
                  onChange={handleSwitchChange}
                />
              }
              label={switchLabel} // Dynamically set label based on state
              labelPlacement="bottom"
            />
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/UserRegistration")}
            >
              Register New User
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/AdminRegistration")}
            >
              Register New Admin
            </Button>
          </Grid>
          {!switchChecked ? (
            <>
              {/* <h3>Existing Users</h3> */}
              <Typography component="h1" variant="h5">
                Existing Users
              </Typography>
              <Grid
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{
                            textAlign: "center",
                            fontSize: "15px",
                            fontWeight: "bold",
                            backgroundColor: "#B5C0D0",
                          }}
                        >
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
                          <Tooltip title="Clear">
                            <Button
                              onClick={() => {
                                setSearch("");
                                setFilteredRows(list);
                              }}
                              style={{ color: "black" }}
                            >
                              <DisabledByDefaultRoundedIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#B5C0D0" }}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{item.name}</TableCell>
                          <TableCell align="center">{item.email}</TableCell>
                          {/* <Link to={"/AdminPage"} style={{ color: "inherit" }}> */}
                          <TableCell
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
                          </TableCell>
                          {/* </Link> */}
                          <TableCell align="center">
                            {/* <Link
                            style={{ textDecoration: "none", color: "inherit" }}
                          > */}
                            <BorderColorOutlinedIcon
                              color="primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                console.log("item : ", item);
                                navigate("/UserRegistration", {
                                  state: { user: item },
                                });
                              }}
                            />
                            <DeleteForeverOutlinedIcon
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
              <Typography component="h1" variant="h5">
                Existing Admins
              </Typography>
              <Grid
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{
                            textAlign: "center",
                            fontSize: "15px",
                            fontWeight: "bold",
                            backgroundColor: "#B5C0D0",
                          }}
                        >
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
                            <Button
                              onClick={() => {
                                setAdminSearch("");
                                setFilteredAdminRows(adminList);
                              }}
                              style={{ color: "black" }}
                            >
                              <DisabledByDefaultRoundedIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#B5C0D0" }}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAdminRows.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.adminID}</TableCell>
                          <TableCell>
                            <BorderColorOutlinedIcon
                              color="primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                // Handle edit action
                              }}
                            />
                            <DeleteForeverOutlinedIcon
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
                                  onClick={() =>
                                    setOpenAdminDeleteDialog(false)
                                  }
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
      </Main>
    </Box>
  );
}
