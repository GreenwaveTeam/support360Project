import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Device from "./modules/device/modules.device";
import NavigationArea from "./components/navigationbar/navigationbar.component";
import AdminPage from "./modules/homepages/AdminPage";
import UserConfigurationHome from "./modules/homepages/UserConfigurationHome";
import UserRegistration from "./modules/registration/UserRegistration";
import UserLogin from "./modules/login/UserLogin";
import AdminRegistration from "./modules/registration/modules.registration.adminRegistration.component";
import AdminLogin from "./modules/login/AdminLogin";
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
        <NavigationArea urllist={urllist} handleOnClick={onclick} />
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
          <Route path="/AdminRegistration" element={<AdminRegistration />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/abc/:userID" element={<AdminPage />} />
          <Route path="/abc" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
    // <CustomTable></CustomTable>
  );
}

export default App;
