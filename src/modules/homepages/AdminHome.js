import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
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

export default function AdminHome() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState(list);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/users/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: localStorage.setItem("token"),
        },
      });
      const data = await response.json();
      setList(data);
      setFilteredRows(data);
      console.log(data);
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
          Accept: "application/json",
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
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        {/* Welcome {adminName} */}
      </Typography>
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
      <Grid item xs={12} justifyContent={"center"}>
        <h3>Existing Users</h3>
        <TableContainer>
          <Table>
            <TableRow>
              <TableCell
                colSpan={4}
                sx={{
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: "bold",
                  backgroundColor: "#B5C0D0",
                  lineHeight: 4,
                }}
              >
                <Textfield
                  onChange={(e) => handleSearchChange(e)}
                  variant={"outlined"}
                  size="small"
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <SearchOutlinedIcon style={{ marginRight: "5px" }} />
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
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.userID}</TableCell>
                  <TableCell align="center">
                    <Link
                      to={`/UserRegistration/${item.userID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <BorderColorOutlinedIcon color="primary" />
                    </Link>
                    <Link style={{ textDecoration: "none", color: "inherit" }}>
                      <DeleteForeverOutlinedIcon
                        color="error"
                        // onClick={(e) => {
                        //   deleteUserByUserID(item.adminID);
                        // }}
                        onClick={(e) => handleDelete(item.userID)}
                      />
                    </Link>
                    <>
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
                            {item.userID} ?
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
                              deleteUserByUserID(item.userID);
                              setOpenDeleteDialog(false);
                            }}
                            color="error"
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
