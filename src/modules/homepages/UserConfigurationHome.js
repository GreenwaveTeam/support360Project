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
      console.log(data);
      for (let i of data) {
        console.log(i.userID, i.email, i.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      to={`http://localhost:3000/abc`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.userID}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary">
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="secondary">
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
