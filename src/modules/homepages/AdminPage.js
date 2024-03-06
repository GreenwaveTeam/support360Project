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
      marginTop={"200px"}
    >
      <Grid item width={"70vw"}>
        <Button variant="contained" color="primary" fullWidth>
          Application
        </Button>
      </Grid>
      <Grid item width={"70vw"}>
        <Button variant="contained" color="primary" fullWidth>
          Device
        </Button>
      </Grid>
      <Grid item width={"70vw"}>
        <Button variant="contained" color="primary" fullWidth>
          Infrastructure
        </Button>
      </Grid>
    </Grid>
  );
};

export default AdminPage;
