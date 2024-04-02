import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Device from "./modules/device/modules.device";
import AdminPage from "./modules/configurationpages/AdminPage";
import AdminHome from "./modules/homepages/AdminHome";
import UserRegistration from "./modules/registration/UserRegistration";
import UserLogin from "./modules/login/UserLogin";
import AdminRegistration from "./modules/registration/modules.registration.adminRegistration.component";
import UserHome from "./modules/homepages/UserHome";
import ApplicationUser from "./modules/application/user/modules.application";
import DeviceIssueCategoryUpload from "./modules/device/admin/module.deviceIssueCategoryUpload";
import DeviceIssueUpload from "./modules/device/admin/module.deviceIssueUpload";
import ApplicationConfiguration from "./modules/application/admin/module.applicationConfiguration";
import ModuleConfiguration from "./modules/application/admin/module.moduleConfiguration";
import ModuleUpload from "./modules/application/admin/module.moduleUpload";
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
import Roleconfig from "./modules/roleconfig/module.roleconfig";

function App() {
  const urllist = [
    { pageName: "Test", pagelink: "/Test" },
    { pageName: "IssueCategory", pagelink: "/IssueCategory" },
  ];

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
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<UserLogin />} />
              {/* <Route path="/xyz" element={<AddInfrastructureIssue />} /> */}
              <Route path="/device" element={<Device />} />
              <Route path="/AdminHome" element={<AdminHome />} />
              {/* <Route
            path="/UserRegistration/:userID"
            element={<UserRegistration />}
          /> */}
              <Route path="/UserRegistration" element={<UserRegistration />} />
              <Route path="/UserHome" element={<UserHome />} />
              <Route
                path="/AdminRegistration"
                element={<AdminRegistration />}
              />
              <Route path="/login" element={<UserLogin />} />
              {/* <Route path="/AdminLogin" element={<AdminLogin />} /> */}
              <Route
                path="/admin/Device/CategoryConfigure"
                element={<DeviceIssueCategoryUpload />}
              />
              <Route
                path="/admin/Device/CategoryConfigure/Issue"
                element={<DeviceIssueUpload />}
              />
              <Route
                path="/admin/ApplicationConfigure"
                element={<ApplicationConfiguration />}
              />
              <Route
                path="/admin/ApplicationConfigure/Modules"
                element={<ModuleConfiguration />}
              />
              <Route
                path="/admin/ApplicationConfigure/Module"
                element={<ModuleUpload />}
              />
              <Route path="/AdminPage" element={<AdminPage />} />

              {/* Application Report */}
              <Route
                path="/user/ReportApplication"
                element={<ApplicationUser />}
              />
              {/* Admin Infrastructure */}
              <Route
                path="/admin/InfrastructureConfigure"
                element={<ConfigureInfrastructure />}
              />
              <Route
                path="/admin/infrastructure/addIssues"
                element={<AddInfrastructureIssue />}
              />
              {/* test */}
              <Route path="/sample" element={<Samplemodule />} />
              <Route path="/*" element={<NotFound />}></Route>

              <Route path="/user/ReportDevice" element={<UserDeviceTree />} />
              <Route
                path="/user/ReportInfrastructure"
                element={<InfrastructureUser />}
              />
              <Route
                path="/admin/DeviceConfigure"
                element={<RichObjectTreeView />}
              />
              <Route
            path="/admin/Role"
            element={<Roleconfig />}
          />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
    // <CustomTable></CustomTable>
  );
}

export default App;
