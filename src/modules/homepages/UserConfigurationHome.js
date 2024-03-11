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
} from "@mui/material";
import { Link } from "react-router-dom";

export default function UserConfigurationHome() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (error) {
      console.log(error);
    }
  };

  // const handleEdit = (user) => {
  //   history.push({
  //     pathname: "/UserRegistration",
  //     state: { user },
  //   });
  // };

  return (
    <>
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
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.userID}</TableCell>
                  <TableCell align="center">
                    <Link
                      to={`/UserRegistration/${item.userID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button
                        variant="contained"
                        color="info"
                        style={{ width: "20px", borderRadius: "50px" }}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ width: "20px", borderRadius: "50px" }}
                    >
                      Delete
                    </Button>
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
