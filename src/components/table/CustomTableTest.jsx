import * as React from "react";
//import DatePicker from "../../components/datepicker/datepicker.component";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import EditIcon from "@mui/icons-material/Edit";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Alert,
  Button,
  Chip,
  Fade,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Datepicker from "../datepicker/datepicker.component";
import Snackbar from "../snackbar/customsnackbar.component";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomDialog from "../dialog/dialog.component";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { height } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomTableTest({
  isDeleteDialog,
  handleSaveClickOverridden,
  deleteFromDatabase,
  savetoDatabse,
  rows,
  setRows,
  columns,
  handleRedirect,
  redirectColumn,
  editActive,
  tablename,
  style,
  redirectIconActive,
  progressVisible,
  isNotDeletable,
}) {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [updatedRow, setUpdatedRow] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [editError, setEditError] = useState(true);
  const [errorValue, setErrorValue] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clearVisible, setClearVisible] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    filterRows();
  }, [filterValue, rows]);

  useEffect(() => {
    setClearVisible(filterValue !== "");
  }, [filterValue]);

  const filterRows = () => {
    setFilteredRows(
      !filterValue
        ? rows
        : rows.filter((row) =>
            Object.values(row).some((value) =>
              value.toString().toLowerCase().includes(filterValue.toLowerCase())
            )
          )
    );
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleInputChange = (event, id, type) => {
    setEditError(false);
    setErrorValue(null);
    const value =
      type === "calender"
        ? dayjs(event).format("YYYY-MM-DD")
        : event.target.value;
    setUpdatedRow((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleEditClick = (index, row) => {
    setEditError(false);
    setEditRowIndex(index);
    setUpdatedRow(row);
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
    setUpdatedRow(null);
  };

  const handleFinalDelete = () => {
    deleteFromDatabase(deleteRow);
  };

  const handleDeleteClick = (selectedRow) => {
    setDeleteRow(selectedRow);
    if (isDeleteDialog) {
      setOpenDeleteDialog(true);
    } else {
      deleteFromDatabase(selectedRow);
    }
  };

  const handleSaveClick = async (selectedRow) => {
    let checkError = false;
    let countChange = 0;
    const regex = /[^A-Za-z0-9 _/]/;

    // Loop through the columns to validate and check for errors
    for (const column of columns) {
      for (const row of rows) {
        // Skip validation for rows that are not the selected row
        if (
          selectedRow !== row &&
          column.type !== "calender" &&
          !column.canRepeatSameValue &&
          updatedRow[column.id].trim().toLowerCase() ===
            row[column.id].trim().toLowerCase()
        ) {
          setSnackbarText("This property is already added");
          setsnackbarSeverity("error");
          setOpen(true);
          setErrorValue(updatedRow[column.id]);
          checkError = true;
        }
      }

      // Check for changes in the selected row
      if (selectedRow) {
        if (
          column.type !== "calender" &&
          updatedRow[column.id].trim().toLowerCase() !==
            selectedRow[column.id].trim().toLowerCase()
        ) {
          countChange++;
        } else if (
          column.type === "calender" &&
          updatedRow[column.id] !== selectedRow[column.id]
        ) {
          countChange++;
        }
      }

      // Validate column values
      if (!updatedRow[column.id].trim()) {
        setSnackbarText("Blank Inputs are not permitted");
        setsnackbarSeverity("error");
        setOpen(true);
        checkError = true;
      } else if (regex.test(updatedRow[column.id].trim())) {
        setSnackbarText("Special Characters are not allowed !");
        setsnackbarSeverity("error");
        setOpen(true);
        checkError = true;
      } else if (
        updatedRow[column.id].trim().toLowerCase() === "miscellaneous"
      ) {
        setSnackbarText("Miscellaneous is reserved!");
        setsnackbarSeverity("error");
        setOpen(true);
        checkError = true;
      }
    }

    // If no changes or errors, stop the function
    if (countChange === 0 || checkError) {
      setEditError(true);
      return;
    }

    // Save changes to the database if applicable
    if (savetoDatabse) {
      const success = await savetoDatabse(selectedRow, updatedRow);
      if (!success) return;
    }

    // Update the row data
    setRows(
      rows.map((row) =>
        row !== selectedRow ? row : { ...updatedRow, edited: true }
      )
    );
    setSnackbarText("Changes are saved!");
    setsnackbarSeverity("success");
    setOpen(true);
    setEditRowIndex(null);
    setUpdatedRow(null);
  };

  const handleAlertClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setEditRowIndex(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setEditRowIndex(null);
  };

  const tableStyle = {
    color: "#f2f0f0",
    border: "1px solid",
    borderColor: "#f2f0f063",
    borderRadius: "0.5rem",
    boxShadow: 0,
  };

  const oddRowColor = colors.grey[900];
  const evenRowColor = "";

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ width: "100%", overflow: "hidden", boxShadow: 0 }}
      >
        <TableContainer component={Paper} sx={tableStyle} style={style}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: colors.primary[900],
                  }}
                  colSpan={columns.length + 2}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: "14px" }}>
                      <b>{tablename}</b>&nbsp;
                    </div>
                    <TextField
                      size="small"
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <SearchOutlinedIcon style={{ marginRight: "5px" }} />
                          <span style={{ fontSize: "14px" }}>Search...</span>
                        </div>
                      }
                      variant="outlined"
                      value={filterValue}
                      onChange={handleFilterChange}
                      InputProps={{
                        endAdornment: clearVisible && (
                          <InputAdornment position="end">
                            <Tooltip title="Clear">
                              <IconButton
                                aria-label="clear search"
                                onClick={() => {
                                  setFilterValue("");
                                  setFilteredRows(rows);
                                }}
                              >
                                <DisabledByDefaultRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    sx={{
                      backgroundColor: colors.grey[900],
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: colors.grey[900],
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {editActive && <div>Actions</div>}
                </TableCell>
                {editActive && (
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: colors.grey[900],
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    <div>Actions</div>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  const isEditing = editRowIndex === rowIndex;
                  const rowColor =
                    rowIndex % 2 === 0 ? evenRowColor : oddRowColor;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={rowIndex}
                      sx={{ backgroundColor: rowColor }}
                    >
                      {columns.map((column, colIndex) => {
                        const cellValue = row[column.id];
                        return (
                          <TableCell
                            key={colIndex}
                            align={column.align}
                            sx={{ padding: "8px" }}
                          >
                            {isEditing && column.isEditable ? (
                              column.type === "dropdown" ? (
                                <Select
                                  fullWidth
                                  size="small"
                                  value={updatedRow[column.id]}
                                  onChange={(event) =>
                                    handleInputChange(event, column.id)
                                  }
                                >
                                  {column.values.map((option, optIndex) => (
                                    <MenuItem key={optIndex} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : column.type === "calender" ? (
                                <Datepicker
                                  format="DD/MM/YYYY"
                                  value={dayjs(updatedRow[column.id])}
                                  onChange={(date) =>
                                    handleInputChange(
                                      date,
                                      column.id,
                                      column.type
                                    )
                                  }
                                />
                              ) : column.type === "textarea" ? (
                                <TextField
                                  fullWidth
                                  multiline
                                  size="small"
                                  value={updatedRow[column.id]}
                                  onChange={(event) =>
                                    handleInputChange(event, column.id)
                                  }
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={updatedRow[column.id]}
                                  onChange={(event) =>
                                    handleInputChange(event, column.id)
                                  }
                                  error={
                                    editError && errorValue === row[column.id]
                                  }
                                />
                              )
                            ) : column.type === "chip" ? (
                              <Chip
                                label={cellValue}
                                color={
                                  cellValue.toLowerCase() === "active"
                                    ? "success"
                                    : "error"
                                }
                              />
                            ) : column.type === "dropdown" ? (
                              <Chip label={cellValue} color="info" />
                            ) : column.type === "calender" ? (
                              dayjs(cellValue).format("DD/MM/YYYY")
                            ) : (
                              cellValue
                            )}
                          </TableCell>
                        );
                      })}
                      {editActive && (
                        <TableCell align="center">
                          {isEditing ? (
                            <div>
                              <IconButton
                                onClick={() => handleSaveClick(row)}
                                size="small"
                              >
                                <CheckIcon color="success" />
                              </IconButton>
                              <IconButton
                                onClick={handleCancelClick}
                                size="small"
                              >
                                <CancelIcon color="error" />
                              </IconButton>
                            </div>
                          ) : (
                            <IconButton
                              onClick={() => handleEditClick(rowIndex, row)}
                              size="small"
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                      {editActive && (
                        <TableCell align="center">
                          {(!isNotDeletable || !isNotDeletable(row)) && (
                            <IconButton
                              onClick={() => handleDeleteClick(row)}
                              size="small"
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
      <Snackbar
        open={open}
        onClose={handleAlertClose}
        text={snackbarText}
        severity={snackbarSeverity}
      />
      {isDeleteDialog && (
        <CustomDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleFinalDelete}
          title="Are you sure you want to delete this item?"
        />
      )}
    </>
  );
}
