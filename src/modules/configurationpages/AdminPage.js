import React, { useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
// import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  // const { userID } = useParams();
  // const location = useLocation();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // const { userName } = location.state || (" UserID : ", userID);
    if (userName) {
      setUserName(userName);
    }
  }, []);

  console.log("userID : ", userName);
  return (
    <Container component="main" maxWidth="md">
      {/* <Typography component="h1" variant="h5">
        Create Configuration for {userName}
      </Typography> */}
      <Grid
        container
        spacing={4}
        direction="column"
        justifyContent="center"
        alignItems="center"
        marginTop={"200px"}
      >
        <Grid item width={"70vw"}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              navigate("/admin/ApplicationConfigure");
            }}
          >
            Application
          </Button>
        </Grid>
        <Grid item width={"70vw"}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              navigate("/admin/DeviceConfigure");
            }}
          >
            Device
          </Button>
        </Grid>
        <Grid item width={"70vw"}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              navigate("/admin/InfrastructureConfigure");
            }}
          >
            Infrastructure
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
