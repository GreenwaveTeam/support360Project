import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import TopbarPage from "../../components/navigation/topbar/topbar";
import { useUserContext } from "../contexts/UserContext";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AdminPage = ({ sendUrllist }) => {
  // const { userId } = useParams();
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

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  const location = useLocation();
  const currentPageLocation = useLocation().pathname;

  const { userData, setUserData } = useUserContext();
  console.log("userData ==>> ", userData);

  // const convertToInitials = (name) => {
  //   if (name !== null) {
  //     const parts = name.split(" ");
  //     const initials = parts
  //       .map((part) => part.charAt(0).toUpperCase())
  //       .join("");
  //     return initials;
  //   }

  // };

  useEffect(() => {
    // const { userName } = location.state || (" UserID : ", userId);
    if (userPlantID) {
      setUserPlantID(userPlantID);
    }
    sendUrllist(urllist);
    fetchDivs();
  }, []);

  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
      console.log("Currently passed Data : ", location.state);
      console.log("Current UserData in fetchDivs() : ", userData);

      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=superadmin&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      if (fetchDivs.length === 0) {
        navigate("/*");
      }
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  console.log("plantID : ", userPlantID);

  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "User Configure", pagelink: "/admin/configurePage" },
  ];

  //For Theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container component="main" maxWidth="md">
      <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
        {/* <Avatar>{convertToInitials(userData.name)}</Avatar>
          <br></br> */}
        <Box sx={{ padding: "0.7rem", background: colors.grey[900] }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //rowGap: "1rem",
              columnGap: "0.5rem",
            }}
          >
            Configure for :{"  "}
            <Chip
              //component="span"
              //variant="h4"
              sx={{ fontWeight: "bold" }}
              label={userData.userId}
              size="medium"
              color="info"
            />
          </Typography>
        </Box>
        <Divider />

        {/* <Typography component="h1" variant="h5">
        Create Configuration for {userName}
      </Typography> */}
        <Grid
          container
          //spacing={1}
          direction="column"
          justifyContent="center"
          alignItems="center"
          rowGap={"1rem"}
          margin={"1rem 0rem"}
          //marginTop={"2rem"}
          //sx={{ background: colors.grey[900] }}
        >
          {divIsVisibleList.includes("application-button") && (
            <Grid item>
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
          )}
          {divIsVisibleList.includes("device-button") && (
            <Grid item>
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
          )}
          {divIsVisibleList.includes("device-configure-button") && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  navigate("/admin/Device/CategoryConfigure", {
                    state: { plantID: userPlantID },
                  });
                }}
              >
                Device Configure
              </Button>
            </Grid>
          )}
          {divIsVisibleList.includes("infrastructure-button") && (
            <Grid item>
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
          )}
        </Grid>
      </Card>
    </Container>
  );
};

export default AdminPage;
