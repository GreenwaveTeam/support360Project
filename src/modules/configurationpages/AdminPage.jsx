import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import GridViewIcon from '@mui/icons-material/GridView';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
const AdminPage = ({ sendUrllist }) => {
  const [userPlantID, setUserPlantID] = useState(
    localStorage.getItem("adminPlantID")
  );
  const navigate = useNavigate();
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const { userData, setUserData } = useUserContext();
  const location = useLocation();
  const currentPageLocation = useLocation().pathname;
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const storedTheme = localStorage.getItem("theme");
  console.log(`CurrentTheme ${storedTheme}`);

  useEffect(() => {
    if (userPlantID) {
      setUserPlantID(userPlantID);
    }
    sendUrllist(urllist);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      let role = data.role;
      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchDivs = async (role) => {
    try {
      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        navigate("/*");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        setDivIsVisibleList(data.components);
        if (data.components.length === 0) {
          navigate("/*");
        }
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      if (fetchDivs.length === 0) {
        navigate("/*");
      }
    }
  };

  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
  ];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Container component="main" maxWidth="lg">
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ padding: "0.7rem", background: colors.grey[900] }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "0.5rem",
              }}
            >
              {/* Configure for:{" "} */}
              <Chip
                sx={{ fontWeight: "bold" }}
                label={"Configuration"}
                size="large"
                color="info"
                variant="outlined"
              />
            </Typography>
          </Box>
          <Divider />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3} // Increased spacing
            margin={"1rem 0rem"}
          >
            {divIsVisibleList.includes("application-button") && (
              <Grid item>
                <Card
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: 6,
                      backgroundColor: colors.primary[500], // Change color on hover
                      color: "#fff", // Optional: Change text color on hover
                    },
                    minWidth: 200,
                    textAlign: "center",
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition
                  }}
                  onClick={() => {
                    navigate("/admin/ApplicationConfigure", {
                      state: { plantID: userPlantID },
                    });
                  }}
                >
                  <Avatar
                    sx={{
                      // bgcolor: colors.primary[700],
                      bgcolor:
                        storedTheme?.toLowerCase() === "light" ||
                        storedTheme === null
                          ? colors.primary[700]
                          : "",

                      mb: 2,
                      width: 80,
                      height: 80,
                    }}
                  >
                    {/* <i
                      className="fa fa-th-large"
                      style={{ fontSize: 22 }}
                      aria-hidden="true"
                    ></i> */}
                    <GridViewIcon/>
                  </Avatar>
                  <Typography variant="h6">Application</Typography>
                </Card>
              </Grid>
            )}
            {divIsVisibleList.includes("device-button") && (
              <Grid item>
                <Card
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: 6,
                      backgroundColor: colors.primary[500], // Change color on hover
                      color: "#fff", // Optional: Change text color on hover
                    },
                    minWidth: 200,
                    textAlign: "center",
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition
                  }}
                  onClick={() => {
                    navigate("/admin/DeviceConfigure", {
                      state: { plantID: userPlantID },
                    });
                  }}
                >
                  <Avatar
                    sx={{
                      // bgcolor: colors.primary[700],
                      bgcolor:
                        storedTheme?.toLowerCase() === "light" ||
                        storedTheme === null
                          ? colors.primary[700]
                          : "",
                      mb: 2,
                      width: 80,
                      height: 80,
                    }}
                  >
                    {/* <i
                      className="fa fa-network-wired"
                      style={{ fontSize: 22 }}
                      aria-hidden="true"
                    ></i> */}
                    <DeviceHubIcon/>
                  </Avatar>
                  <Typography variant="h6">Device</Typography>
                </Card>
              </Grid>
            )}
            {divIsVisibleList.includes("device-catagory-button") && (
              <Grid item>
                <Card
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: 6,
                      backgroundColor: colors.primary[500], // Change color on hover
                      color: "#fff", // Optional: Change text color on hover
                    },
                    minWidth: 200,
                    textAlign: "center",
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition
                  }}
                  onClick={() => {
                    navigate("/admin/Device/CategoryConfigure", {
                      state: { plantID: userPlantID },
                    });
                  }}
                >
                  <Avatar
                    sx={{
                      // bgcolor: colors.primary[700],
                      bgcolor:
                        storedTheme?.toLowerCase() === "light" ||
                        storedTheme === null
                          ? colors.primary[700]
                          : "",
                      mb: 2,
                      width: 80,
                      height: 80,
                    }}
                  >
                    {/* <i
                      className="fa fa-list-alt"
                      style={{ fontSize: 36 }}
                      aria-hidden="true"
                    ></i> */}
                  <PersonIcon/>
                  </Avatar>
                  <Typography variant="h6">Device Issue Category</Typography>
                </Card>
              </Grid>
            )}
            {divIsVisibleList.includes("infrastructure-button") && (
              <Grid item>
                <Card
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: 6,
                      backgroundColor: colors.primary[500], // Change color on hover
                      color: "#fff", // Optional: Change text color on hover
                    },
                    minWidth: 200,
                    textAlign: "center",
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition
                  }}
                  onClick={() => {
                    navigate("/admin/InfrastructureConfigure");
                  }}
                >
                  <Avatar
                    sx={{
                      // bgcolor: colors.primary[700],
                      bgcolor:
                        storedTheme?.toLowerCase() === "light" ||
                        storedTheme === null
                          ? colors.primary[700]
                          : "",
                      mb: 2,
                      width: 80,
                      height: 80,
                    }}
                  >
                    {/* <i
                      className="fa  fa-microchip"
                      style={{ fontSize: 22 }}
                      aria-hidden="true"
                    ></i> */}
                    <DashboardIcon/>
                  </Avatar>
                  <Typography variant="h6">Infrastructure</Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default AdminPage;
