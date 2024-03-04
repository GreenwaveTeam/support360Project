import React, { useState } from "react";
import "./App.css";
import Textfield from "./components/textfield/textfield.component";
import Device from "./modules/device/modules.device";

function App() {
  // const handleTextfieldChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <div className="App">
      <h1>qwerty</h1>
      <Textfield id={"textfieldId"} value={"hello there"} />
      <Device/>
    </div>
  );
}

export default App;
