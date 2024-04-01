import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

function Entrypage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <Button
        style={{ width: "40vw", height: "20vh", borderRadius: "20px" }}
        variant="contained"
        onClick={(e) => {
          navigate("/UserLogin");
        }}
      >
        User
      </Button>
      <Button
        style={{ width: "40vw", height: "20vh", borderRadius: "20px" }}
        variant="contained"
        onClick={(e) => {
          navigate("/AdminLogin");
        }}
      >
        Admin
      </Button>
    </div>
  );
}

export default Entrypage;




