import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
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

const AdminPage = ({ sendUrllist }) => {
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
    // const { userName } = location.state || (" UserID : ", userID);
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

  const urllist = [{ pageName: "Admin Home Page", pagelink: "/admin/home" }];

  return (
    <Box sx={{ display: "flex" }}>
      {/* <Avatar>{convertToInitials(userData.name)}</Avatar>
          <br></br> */}
      <Typography component="h1" variant="h5">
        Configure for :{"  "}
        <Typography component="span" variant="h4" sx={{ fontWeight: "bold" }}>
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
          {divIsVisibleList.includes("application-button") && (
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
          )}
          {divIsVisibleList.includes("device-button") && (
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
          )}
          {divIsVisibleList.includes("infrastructure-button") && (
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
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminPage;
