import React, { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";

export default function AdminConfigurationHome() {
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
      {/* <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Existing Users</InputLabel>
          <Select required id="userList" label="Existing Users">
            {list.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid> */}
      <Grid item xs={12}>
        {list.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </Grid>
    </>
  );
}
