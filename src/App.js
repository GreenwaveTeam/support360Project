import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Device from "./modules/device/modules.device";
import NavigationArea from "./components/navigationbar/navigationbar.component";
import AdminPage from "./modules/homepages/AdminPage";
import UserConfigurationHome from "./modules/homepages/UserConfigurationHome";
import UserRegistration from "./modules/registration/UserRegistration";
import UserLogin from "./modules/login/userLogin";

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
          <Route path="/device" element={<Device />} />
          <Route path="/ad" element={<UserConfigurationHome />} />
          <Route
            path="/UserRegistration/:userID"
            element={<UserRegistration />}
          />
          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/abc" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
    // <CustomTable></CustomTable>
  );
}

export default App;
