import React, { useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
// import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import TopbarPage from "../../components/navigation/topbar/topbar";

const AdminPage = () => {
  // const { userID } = useParams();
  // const location = useLocation();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // const { userName } = location.state || (" UserID : ", userID);
    if (userName) {
      setUserName(userName);
    }
  }, []);

  console.log("userID : ", userName);
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
        </Box>
      </Main>
    </Box>
  );
};

export default AdminPage;
