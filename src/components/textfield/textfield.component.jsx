import React from "react";
import { TextField } from "@mui/material";

export default function Textfield({
  id,
  value,
  onChange,
  label,
  name,
  fullWidth,
  style,
}) {
  return (
    <>
      <TextField
        id={id}
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        fullWidth={fullWidth}
        style={style}
      />
    </>
  );
}
