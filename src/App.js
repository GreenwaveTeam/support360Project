import React, { useState } from "react";
import "./App.css";
import Textfield from "./components/textfield/textfield.component";

function App() {
  // const handleTextfieldChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <div className="App">
      <h1>qwerty</h1>
      <Textfield id={"textfieldId"} value={"hello there"} />
    </div>
  );
}

export default App;
