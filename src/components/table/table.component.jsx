import * as React from 'react';
import DatePicker from "../../components/datepicker/datepicker.component";
import Swal from "sweetalert2";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container, flexbox, lineHeight } from "@mui/system";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from 'dayjs';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function CustomTable({ deleteFromDatabase, savetoDatabse, rows, setRows, columns, handleRedirect, redirectColumn }) {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [updatedRow, setUpdatedRow] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [filteredrows, setFilteredrows] = useState(null);
  const [editRequired,setEditRequired]=useState(true)

  useEffect(() => {
    // Filter rows when filterValue changes
    filterRows();
  }, [filterValue, rows]);

  const filterRows = () => {
    
    if (!filterValue) {
      // If filter value is empty, show all rows
      setFilteredrows(rows);
    } else {
      // Filter rows based on filterValue
      const filtered = rows.filter(row =>
        Object.values(row).some(
          value => value.toString().toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
        )
      );
      setFilteredrows(filtered);
    }
  };

  const handleFilterChange = event => {
    // Update filter value when input changes
    setFilterValue(event.target.value);
  };

  const handleInputChange = (event, id, type) => {
    setEditRequired(false)
    if (type === 'calender')
      console.log(dayjs(event))
    setUpdatedRow(prevData => ({
      ...prevData,
      [id]: type === 'calender' ? dayjs(event).format('YYYY-MM-DD') : event.target.value
    }));

  }

  const handleEditClick = (index, row) => {
    setEditRequired(false)
    setEditRowIndex(index)
    setUpdatedRow(row)
  };

  const handleCancelClick = () => {
    setEditRowIndex(null)
    setUpdatedRow(null)
  }

  const handleDeleteClick = (selectedrow) => {
    Swal.fire({
      title: "Do you really want to delete ? ",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRows = rows.filter((row) => row !== selectedrow);
        if (deleteFromDatabase != null)
          deleteFromDatabase(selectedrow)
        setRows(updatedRows);
        setSnackbarText("Deleted successfully !");
        setsnackbarSeverity("success");
        setOpen(true);
      }
    });
  };

  const handleSaveClick = (selectedRow) => {
    let checkError = false;
    const regex = /[^A-Za-z0-9 _]/;
      
    rows.find((row) => {
      if (selectedRow !== row) {
        columns.map((column) => {
          if (
            column.type !== 'calender' &&
            column.canRepeatSameValue === false &&
            updatedRow[column.id].toLowerCase() === row[column.id].toLowerCase()
          ) {
            setSnackbarText('This property is already added');
            setsnackbarSeverity('error');
            setOpen(true);
            checkError = true;
          } else if (column.type !== 'calender' && updatedRow[column.id].trim() === '') {
            setSnackbarText('Blank Inputs are not permitted');
            setsnackbarSeverity('error');
            setOpen(true);
            checkError = true;
          }
          else if (column.type !== 'calender' && regex.test(updatedRow[column.id].trim())) {
            setSnackbarText('Special Characters are not allowed !');
            setsnackbarSeverity('error');
            setOpen(true);
            checkError = true;
          }
        });
      } else if (selectedRow === row) {
        let countChange = 0;
        columns.map((column) => {
          if (column.type !== 'calender' && updatedRow[column.id].toLowerCase() !== row[column.id].toLowerCase()) {
            countChange += 1;
          }
          if (column.type === 'calender' && updatedRow[column.id] !== row[column.id]) {
            countChange += 1;
            console.log("Calender updated")
          }
        });
        if (countChange === 0) {
          setSnackbarText('No changes are made');
          setsnackbarSeverity('error');
          setOpen(true);
          checkError = true;
        }
      }
    });
    if (checkError === true){
      setEditRequired(true)
      return
      
    }
      if (savetoDatabse != null)
      savetoDatabse(selectedRow, updatedRow)
    
    setRows(rows.map(row => {
      if (row !== selectedRow) {
        return row;
      }
      else {
        return updatedRow;
      }
    }));
    setSnackbarText("Changes are saved !");
    setsnackbarSeverity("success");
    setOpen(true);
    setUpdatedRow(null);
    setEditRowIndex(null);
    return;
  }

  const handleAlertClose = (event) => {
    setOpen(false);
  }

  return (
    <>
      <Paper sx={{ width: '100%', overfMinor: 'hidden' }}>
        <TableContainer component={Paper} sx={{borderRadius:5, maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell>
                  <Typography>Actions</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={columns.length} style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                  <TextField
                    label={
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <SearchOutlinedIcon
                          style={{ marginRight: "5px" }}
                        />
                        Search...
                      </div>
                    }
                    variant="outlined"
                    value={filterValue}
                    onChange={handleFilterChange}
                    //style={{ marginBottom: '20px', maxWidth: '50%', marginLeft: 'auto', marginRight: 'auto' }}

                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredrows && filteredrows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id]
                        let updatedValue = updatedRow!== null ? updatedRow[column.id] : row[column.id];
                        return (
                          <TableCell key={column.label} align={column.align}>
                            {editRowIndex !== index && (
                              column.id===redirectColumn) &&(
                                <Typography onClick={()=>handleRedirect(row)}>
                                  {value}
                                </Typography>
                            )}
                            {editRowIndex !== index && (
                              column.id!==redirectColumn) &&(
                                <Typography>
                                  {value}
                                </Typography>
                              
                            )}
                            {editRowIndex === index && ((column.type === 'textbox') && (
                              <div>
                                <TextField
                                  label={column.label}
                                  value={updatedValue}
                                  required error={editRequired}
                                  onChange={(e) => {
                                    handleInputChange(e, column.id, column.type)
                                    console.log("updatedValue : ", updatedValue)
                                  }}
                                />
                              </div>)
                            )}
                            {editRowIndex === index && ((column.type === 'dropdown') && (
                              <div>
                                <Select
                                  label={column.label}
                                  value={updatedValue}
                                  required error={editRequired}
                                  onChange={(e) => { handleInputChange(e, column.id, column.type) }}
                                >
                                  {column.values.map((dropdownvalue, index) => (
                                    <MenuItem key={index} value={dropdownvalue}>
                                      {dropdownvalue}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </div>)
                            )}
                            {editRowIndex === index && ((column.type === 'calender') && (
                              <div>
                                <DatePicker
                                  format={"YYYY-MM-DD"} error={editRequired}
                                  label="Date"
                                  onChange={(e) => { handleInputChange(e, column.id, column.type) }}
                                  value={dayjs(updatedValue)}
                                />
                              </div>)
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell sx={{ width: "10%" }} align="right">
                        <div style={{ display: 'flex' }}>
                          {editRowIndex !== index && (
                            <Button
                              onClick={() => handleEditClick(index, row)}
                            >
                              <EditIcon align="right" color="primary" />
                            </Button>
                          )}
                          {editRowIndex !== index && (
                            <Button
                              onClick={() => handleDeleteClick(row)}
                            >
                              <DeleteIcon
                                align="right"
                                sx={{ color: "#FE2E2E" }}
                              />
                            </Button>
                          )}
                        </div>
                        {editRowIndex === index && (
                          <div style={{ display: 'flex' }}>
                            <Button
                              onClick={() => handleSaveClick(row)}
                            >
                              <CheckIcon color="primary" />
                            </Button>
                            <Button
                              onClick={() => handleCancelClick(row)}
                            >
                              <CancelIcon sx={{ color: "#FE2E2E" }} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
}
