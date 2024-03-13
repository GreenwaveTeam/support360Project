import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

export default function UserConfigurationHome() {
  // const { adminID } = useParams();
  // const location = useLocation();
  // const [adminName, setUserName] = useState("");

  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
    // const { adminName } = location.state || (" UserID : ", adminID);
    // if (adminName) {
    //   setUserName(adminName);
    // }
  }, []);
  // console.log("adminName : ", adminName);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/users/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setList(data);
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
      setList((prevList) => prevList.filter((item) => item.adminID !== e));
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

  return (
    <>
      <Typography component="h1" variant="h5">
        {/* Welcome {adminName} */}
      </Typography>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        href="/UserRegistration"
      >
        Create New User
      </Button>
      <Grid item xs={12} justifyContent={"center"}>
        <h3>Existing Users</h3>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list &&
                list.map((item, index) => (
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
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <DeleteForeverOutlinedIcon
                          color="error"
                          onClick={(e) => {
                            deleteUserByUserID(item.adminID);
                          }}
                        />
                      </Link>
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
