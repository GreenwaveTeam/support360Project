import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Device from "./modules/device/module.device";
import AdminPage from "./modules/configurationpages/AdminPage";
import AdminHome from "./modules/homepages/module.homepage.adminhome";
import UserRegistration from "./modules/registration/module.registration.userregistration";
import UserLogin from "./modules/login/module.login.userlogin";
import AdminRegistration from "./modules/registration/module.registration.adminregistration";
import UserHome from "./modules/homepages/module.homepage.userhome";
import ApplicationUser from "./modules/application/user/modules.application";
import ConfigureInfrastructure from "./modules/infrastructure/module.configureInfrastructure";
import AddInfrastructureIssue from "./modules/infrastructure/module.addinfrastructureIssue";
import Samplemodule from "./modules/device/module.samplemodule";
import NotFound from "./components/notfound/notfound.component";
import UserDeviceTree from "./modules/device/user/DeviceTreeForUser";
import InfrastructureUser from "./modules/infrastructure/user/InfrastructureUser";
import RichObjectTreeView from "./modules/device/admin/RichObjectTreeView";

// import AddInfrastructureIssue from "./modules/infrastructure/module.addinfrastructureIssue";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TopbarPage from "./components/navigation/topbar/topbar";
import { ColorModeContext, useMode } from "./theme";

import { UserProvider } from "./modules/contexts/UserContext";
import RolePageConfiguration from "./modules/roleconfiguration/module.rolePageConfiguration";
import RoleConfiguration from "./modules/roleconfiguration/module.roleConfiguration";
import AdminRoutes from "./AdminRoutes";
import DeviceCategory from "./modules/device/admin/module.deviceIssueCategoryUpload";
import UserRoutes from "./UserRoutes";

function App() {
  // const [darkMode, setDarkMode] = React.useState(false);
  // const theme = React.useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode: darkMode ? "dark" : "light",
  //         primary: {
  //           main: "#1976d2",
  //         },
  //         secondary: {
  //           main: "#f50057",
  //         },
  //       },
  //     }),
  //   [darkMode]
  // );
  // const toggleDarkMode = () => {
  //   setDarkMode((prevDarkMode) => !prevDarkMode);
  //   console.log("click dark icon");
  // };

  const onclick = () => {
    console.log("Hamburger Click");
  };
  const [theme, colorMode] = useMode();
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <TopbarPage darkMode={darkMode} setDarkMode={toggleDarkMode} />
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<UserLogin />} />
                {/* <Route path="/xyz" element={<AddInfrastructureIssue />} /> */}
                <Route path="/device" element={<Device />} />
                {/* <Route path="/admin/home" element={<AdminHome />} /> */}
                {/* <Route
            path="/UserRegistration/:userID"
            element={<UserRegistration />}
          /> */}
                {/* <Route
                  path="admin/userregistration"
                  element={<UserRegistration />}
                  // this  should be /admin/userRegistration
                /> */}
                {/* <Route path="/user/home" element={<UserHome />} /> */}
                {/* <Route
                  path="admin/adminregistration"
                  element={<AdminRegistration />}
                /> */}
                <Route path="/login" element={<UserLogin />} />
                {/* <Route path="/AdminLogin" element={<AdminLogin />} /> */}
                {/* <Route path="/admin/configurePage" element={<AdminPage />} /> */}

                {/* Application Report */}
                {/* <Route
                  path="/user/ReportApplication"
                  element={<ApplicationUser />}
                /> */}
                {/* Admin Infrastructure */}
                {/* <Route
                  path="/admin/InfrastructureConfigure"
                  element={<ConfigureInfrastructure />}
                />
                <Route
                  path="/admin/infrastructure/addIssues"
                  element={<AddInfrastructureIssue />}
                /> */}
                {/* test */}

                {/* <Route path="/user/ReportDevice" element={<UserDeviceTree />} />
                <Route
                  path="/user/ReportInfrastructure"
                  element={<InfrastructureUser />}
                /> */}
                {/* <Route
                  path="/admin/DeviceConfigure"
                  element={<RichObjectTreeView />}
                /> */}
                {/* <Route path="/admin/Role" element={<RoleConfiguration />} />
                <Route
                  path="/admin/Role/Page"
                  element={<RolePageConfiguration />}
                /> */}
                <Route path="/*" element={<NotFound />} />
                <Route path="/notfound" element={<NotFound />} />
                <Route path="/admin/*" element={<AdminRoutes />}>
                  {/* <Route path="/AdminLogin" element={<AdminLogin />} /> */}
                </Route>
                <Route path="/user/*" element={<UserRoutes />}></Route>
              </Routes>
            </div>
          </Router>
          {/* <Router>
            <Routes>
            <Route path="/sample" element={<Samplemodule />} />
            </Routes>
          </Router> */}
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
    // <CustomTable></CustomTable>
  );
}

export default App;
