import React from "react";
import "./App.css";
import Textfield from "./components/textfield/textfield.component";
import Device from "./modules/device/modules.device";
import NavigationArea from "./components/navigationbar/navigationbar.component";

function App() {
  const urllist=[
    { pageName: "Test", pagelink: "/Test" },
    { pageName: "IssueCategory", pagelink: "/IssueCategory" }
  ]
  const onclick=()=>{
    console.log("Hamburger Click")
  }
  return (
    <div className="App">
      <NavigationArea urllist={urllist} handleOnClick={onclick}/>
      <h1>qwerty</h1>
      <Textfield id={"textfieldId"} value={"hello there"} />
      <Device/>
    </div>
  );
}

export default App;
