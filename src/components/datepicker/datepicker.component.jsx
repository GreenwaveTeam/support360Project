import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function Datepicker({
  label,
  value,
  onChange,
  format,
  slotProps,
  defaultValue,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        defaultValue={defaultValue}
        // defaultValue={dayjs(value)}
        onChange={onChange}
        format={format}
        slotProps={slotProps}
        openTo="day"
      />
    </LocalizationProvider>
  );
}
