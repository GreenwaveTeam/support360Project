import { Button, Grid } from "@mui/material";
import React from "react";
import Textfield from "../../components/textfield/textfield.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import dayjs from "dayjs";

export default function PlantPage() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Textfield
            required
            fullWidth={true}
            name="plantName"
            label="Plant Name"
            id="plantName"
            value={newPlantName.plantName}
            onChange={handlenewPlantNameInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Textfield
            required
            fullWidth={true}
            name="plantID"
            label="PlantID"
            id="plantID"
            value={newPlantName.plantID}
            onChange={handlenewPlantNameInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Textfield
            required
            fullWidth={true}
            name="address"
            label="Address"
            id="address"
            value={newPlantName.address}
            onChange={handlenewPlantNameInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Textfield
            required
            fullWidth={true}
            name="customerName"
            label="Customer Name"
            id="customerName"
            value={newPlantName.customerName}
            onChange={handlenewPlantNameInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Datepicker
            label="Support Start Date"
            value={dayjs(newPlantName.supportStartDate)}
            onChange={(startDate) =>
              setNewPlantName({
                ...newPlantName,
                supportStartDate: startDate.format("YYYY-MM-DD"),
              })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={6}>
          <Datepicker
            label="Support End Date"
            value={dayjs(newPlantName.supportEndDate)}
            onChange={(endDate) =>
              setNewPlantName({
                ...newPlantName,
                supportEndDate: endDate.format("YYYY-MM-DD"),
              })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Textfield
            required
            fullWidth={true}
            name="division"
            label="Division"
            id="division"
            value={newPlantName.division}
            onChange={handlenewPlantNameInputChange}
          />
        </Grid>
      </Grid>
      <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          setOpenDeleteDialog(false);
          postPlantName();
          fetchPlantData();
        }}
        color="error"
        autoFocus
      >
        Save
      </Button>
    </>
  );
}
