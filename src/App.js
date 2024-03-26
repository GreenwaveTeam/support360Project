import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Device from "./modules/device/modules.device";
import AdminPage from "./modules/configurationpages/AdminPage";
import UserConfigurationHome from "./modules/homepages/UserConfigurationHome";
import UserRegistration from "./modules/registration/UserRegistration";
import UserLogin from "./modules/login/UserLogin";
import AdminRegistration from "./modules/registration/modules.registration.adminRegistration.component";
import AdminLogin from "./modules/login/AdminLogin";
import UserHome from "./modules/homepages/UserHome";
import ApplicationUser from "./modules/application/user/modules.application";
import DeviceIssueCategoryUpload from './modules/device/admin/module.deviceIssueCategoryUpload'
import DeviceIssueUpload from './modules/device/admin/module.deviceIssueUpload'
import ApplicationConfiguration from './modules/application/admin/module.applicationConfiguration'
import ModuleConfiguration from './modules/application/admin/module.moduleConfiguration'
import ModuleUpload from './modules/application/admin/module.moduleUpload'
import ConfigureInfrastructure from "./modules/infrastructure/module.configureInfrastructure";
import AddInfrastructureIssue from "./modules/infrastructure/module.addinfrastructureIssue";
import Samplemodule from "./modules/device/module.samplemodule";

// import AddInfrastructureIssue from "./modules/infrastructure/module.addinfrastructureIssue";

function App() {
  const urllist = [
    { pageName: "Test", pagelink: "/Test" },
    { pageName: "IssueCategory", pagelink: "/IssueCategory" },
  ];
  const onclick = () => {
    console.log("Hamburger Click");
  };
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/xyz" element={<AddInfrastructureIssue />} /> */}
          <Route path="/device" element={<Device />} />
          <Route path="/ad/:adminID" element={<UserConfigurationHome />} />
          <Route path="/ad" element={<UserConfigurationHome />} />
          <Route
            path="/UserRegistration/:userID"
            element={<UserRegistration />}
          />
          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route
            path="/AdminRegistration/:adminID"
            element={<AdminRegistration />}
          />
          <Route path="/UserHome" element={<UserHome />} />
          <Route path="/UserHome/:userID" element={<UserHome />} />
          <Route path="/AdminRegistration" element={<AdminRegistration />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/abc/:userID" element={<AdminPage />} />
           <Route path="/Device/Category" element={<DeviceIssueCategoryUpload />} />
          <Route path="/Device/Category/Issue" element={<DeviceIssueUpload />} />
          <Route path="/Application" element={<ApplicationConfiguration/>} />
          <Route path="/Application/Modules" element={<ModuleConfiguration/>} />
          <Route path="/Application/Module" element={<ModuleUpload/>} /> 
          <Route path="/abc" element={<AdminPage />} />
            {/* Application Report */}
          <Route path="/user/ReportApplication" element={ <ApplicationUser/>}/>
          {/* Admin Infrastructure */}
          <Route path="/admin/infrastructure/configureInfrastructure" element={ <ConfigureInfrastructure/>}/>
          <Route  path="/admin/infrastructure/addIssues" element={ <AddInfrastructureIssue/>}/>
          {/* test */}
          <Route  path="/sample" element={ <Samplemodule/>}/>
        </Routes>
      </div>
    </Router>
    // <CustomTable></CustomTable>
  );
}

export default App;
