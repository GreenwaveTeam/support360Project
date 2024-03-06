import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Textfield from "./components/textfield/textfield.component";
import Device from "./modules/device/modules.device";
import NavigationArea from "./components/navigationbar/navigationbar.component";
import AdminConfigurationHome from "./AdminConfigurationHome";
import UserRegistration from "./UserRegistration";
import CustomTable from "./components/table/table.component";

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
        <h1>qwerty</h1>
        <Textfield id={"textfieldId"} value={"hello there"} />
        <Device />
        <Routes>
          <Route path="/ad" element={<AdminConfigurationHome />} />
          <Route path="/UserRegistration" element={<UserRegistration />} />
        </Routes>
      </div>
    </Router>
    // <CustomTable></CustomTable>
  );
}

export default App;
