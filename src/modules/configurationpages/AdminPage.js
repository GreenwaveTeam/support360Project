import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
// import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import TopbarPage from "../../components/navigation/topbar/topbar";
import { useUserContext } from "../contexts/UserContext";

const AdminPage = () => {
  // const { userID } = useParams();
  // const location = useLocation();
  const [userPlantID, setUserPlantID] = useState(
    localStorage.getItem("adminPlantID")
  );
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { userData, setUserData } = useUserContext();
  console.log("userData ==>> ", userData);

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  useEffect(() => {
    // const { userName } = location.state || (" UserID : ", userID);
    if (userPlantID) {
      setUserPlantID(userPlantID);
    }
  }, []);

  console.log("plantID : ", userPlantID);
  return (
    <Box sx={{ display: "flex" }}>
      <TopbarPage
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[
          { pageName: "Admin Home ", pagelink: "/AdminHome" },
          { pageName: "Admin page ", pagelink: "/AdminPage" },
        ]}
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
          <Avatar>{convertToInitials(userData.name)}</Avatar>
          <br></br>
          <Typography component="h1" variant="h5">
            Configure for :{"  "}
            <Typography
              component="span"
              variant="h4"
              sx={{ fontWeight: "bold" }}
            >
              {userData.userID}
            </Typography>
          </Typography>
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
                    navigate("/admin/ApplicationConfigure", {
                      state: { plantID: userPlantID },
                    });
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
                    navigate("/admin/DeviceConfigure", {
                      state: { plantID: userPlantID },
                    });
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
        </Box>
      </Main>
    </Box>
  );
};

export default AdminPage;
