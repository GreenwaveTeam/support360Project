import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function DatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Support Start Date"
        value={formData.supportStartDate}
        onChange={(startDate) =>
          setFormData({ ...formData, supportStartDate: startDate })
        }
      />
    </LocalizationProvider>
  );
}
