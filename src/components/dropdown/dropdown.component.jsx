import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export default function Dropdown({
  id,
  value,
  onChange,
  label,
  list,
  style,
  fullWidth,
}) {
  return (
    <>
      <FormControl style={style} fullWidth={fullWidth}>
        <InputLabel>{label}</InputLabel>
        <Select id={id} value={value} label={label} onChange={onChange}>
          {list.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}