import { Button } from "@mui/material";
import React from "react";

export default function CustomButton(onClick, style, id) {
  return (
    <Button
      //variant={variant}
      // size={size}
      onClick={onClick}
      style={style}
      id={id}
    ></Button>
  );
}
