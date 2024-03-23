import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import './dropdown.style.css'
export default function Dropdown({
  id,
  value,
  onChange,
  label,
  list,
  formstyle,
  fullWidth,
  style,
  error
}) {
  return (
    <>
      <FormControl style={formstyle} fullWidth={fullWidth}>
        <InputLabel>{label}</InputLabel>
        <Select 
        style= {style}
        id={id} 
        value={value} 
        label={label} 
        onChange={onChange}
        className={value}
        error={error}
        >{list.map((item, index) => (
          <MenuItem key={index} 
          value={item}
          className={item}
          >
            {item}
          </MenuItem>
        ))}
        </Select>
      </FormControl>
    </>
  );
}
