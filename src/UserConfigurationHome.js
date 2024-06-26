import React, { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
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
      console.log("list : ", list);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        href="/UserRegistration"
      >
        Create New User
      </Button>
      <Grid item xs={12}>
        <h3>Existing Users</h3>
        {list.map((item, index) => (
          <Link
            to={`http://localhost:8081/users/user/${item.userID}`}
            key={index}
          >
            <li key={index}>{item.name}</li>
          </Link>
        ))}
      </Grid>
    </>
  );
}
