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
  type,
  onBlur,
}) {
  return (
    <>
      <TextField
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        label={label}
        name={name}
        fullWidth={fullWidth}
        style={style}
        onBlur={onBlur}
      />
    </>
  );
}
