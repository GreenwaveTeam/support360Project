import { Button } from "@mui/material";
import React from "react";

export default function CustomButton({onClick, style, id,variant,size,buttontext,color}) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      style={style}
      id={id}
      color={color}
    >
      {buttontext}
    </Button>
  );
}
