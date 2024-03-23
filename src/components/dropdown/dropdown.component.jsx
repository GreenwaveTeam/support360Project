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
<<<<<<< HEAD
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
=======
        <Select id={id} value={value}  label={label} onChange={onChange}>
          {list.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
>>>>>>> 866e4ceeada7d1affd3604711af64efa193650ac
        </Select>
      </FormControl>
    </>
  );
}
