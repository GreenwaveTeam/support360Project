import React from "react";
import { Button, Grid } from "@mui/material";

const AdminPage = () => {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
      //   style={{ height: "100vh" }}
    >
      <Grid item xs={12}>
        <Button variant="contained" color="primary">
          Application
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary">
          BDevice
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary">
          Infrastructure
        </Button>
      </Grid>
    </Grid>
  );
};

export default AdminPage;
