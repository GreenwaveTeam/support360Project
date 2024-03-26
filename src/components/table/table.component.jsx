import * as React from 'react';
//import DatePicker from "../../components/datepicker/datepicker.component";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import EditIcon from "@mui/icons-material/Edit";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
    Alert,
    Button,
    Fade,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TablePagination,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import Datepicker from '../datepicker/datepicker.component';


export default function CustomTable({ deleteFromDatabase, savetoDatabse, rows, setRows, columns, handleRedirect, redirectColumn,editActive,tablename,style,redirectIconActive }) {
  const [editRowIndex, setEditRowIndex] = useState(null);

  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [updatedRow, setUpdatedRow] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [filteredrows, setFilteredrows] = useState(null);
  const [editRequired,setEditRequired]=useState(true)
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(5);
  const [search,setSearch]=useState("")
  const [clearVisible,setClearVisible]=useState(false)
  

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

//   const handleDeleteClick = (selectedrow) => {
//     // Swal.fire({
//     //   title: "Do you really want to delete ? ",
//     //   showDenyButton: true,
//     //   confirmButtonText: "Delete",
//     //   denyButtonText: `Cancel`,
//     // }).then((result) => {
//     //   if (result.isConfirmed) {
//        console.log(deleteFromDatabase)
//         if (deleteFromDatabase != null)
//         {
//          const deleted= deleteFromDatabase(selectedrow)
//          if(deleted){
//             console.log('Returned value is true hence updating the Table component')
//          const updatedRows = rows.filter((row) => row !== selectedrow);
//         setRows(updatedRows);
//          }
//          else
//          {
//              setSnackbarText("Error in Deleting data !");
//              setsnackbarSeverity("error");
//              setOpen(true);
//          }
//         }
//         // setSnackbarText("Deleted successfully !");
//         // setsnackbarSeverity("success");
//         // setOpen(true);
//     //   }
//     // });
//   };

useEffect(()=>
{
  //This useEffect is keeping track of the search whenever it is visible  or not
  console.log('useEffect for search');
  setClearVisible(filterValue===''?false:true)
},[filterValue])

const handleSaveClick = async (selectedRow) => {
  console.log('handleSaveClick() called');
  console.log('Updated Row : ', updatedRow);
  console.log('Selected prev row : ', selectedRow);
  let checkError = false;
  const regex = /[^A-Za-z0-9 _]/;
  let countChange = 0;
  columns.map((column) => {

    rows.find((row) => {
      console.log("Rows.........." + JSON.stringify(row));
      if (selectedRow !== row) {
        if (
          column.type !== 'calender' &&
          column.canRepeatSameValue === false &&
          updatedRow[column.id].trim().toLowerCase() === row[column.id].trim().toLowerCase()
        ) {
          setSnackbarText('This property is already added');
          setsnackbarSeverity('error');
          setOpen(true);
          console.log("Check this property is already added");
          checkError = true;
        }
      } else if (selectedRow === row) {
        console.log("Save click");
        
        if (column.type !== 'calender' && updatedRow[column.id].trim().toLowerCase() !== row[column.id].trim().toLowerCase()) {
          countChange += 1;
          console.log("Check changes");
        }
        if (column.type === 'calender' && updatedRow[column.id] !== row[column.id]) {
          countChange += 1;
          console.log("Calender updated");
        }
        
      }
    });
    
    if (column.type !== 'calender' && updatedRow[column.id].trim() === '') {
      setSnackbarText('Blank Inputs are not permitted');
      setsnackbarSeverity('error');
      console.log('Blank Inputs are not permitted');
      setOpen(true);
      checkError = true;
    }
    else if (column.type !== 'calender' && regex.test(updatedRow[column.id].trim())) {
      console.log("Special characters check")
      setSnackbarText('Special Characters are not allowed !');
      setsnackbarSeverity('error');
      console.log("Check")
      setOpen(true);
      checkError = true;
    }
  });
  if (countChange === 0) {
    setEditRowIndex(null);
    setUpdatedRow(null);
    checkError = true;
  }
  if (checkError === true) {
    setEditRequired(true);
    return;
  }
  console.log("Tejncdqskjcnqskdqk,jcnsqkndqknqknckqsndqk")
  if (savetoDatabse != null) {
    const success = await savetoDatabse(selectedRow, updatedRow);
    console.log('The final returned value in table component is => ');
    // if (success === false) {
    //   setEditRowIndex(null);
    //   return;
    // }
  }
  updatedRow.edited = true;
  setRows(rows.map(row => {
    if (row !== selectedRow) {
      return row;
    } else {
      return updatedRow;
    }
  }));
  setSnackbarText("Changes are saved !");
  setsnackbarSeverity("success");
  setOpen(true);
  setUpdatedRow(null);
  setEditRowIndex(null);
  return;
};

  const handleAlertClose = (event) => {
    setOpen(false);
  }
  const handlechangepage = (event, newpage) => {
    pagechange(newpage)
    setEditRowIndex(null)
  }
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value)
    pagechange(0);
    setEditRowIndex(null)
  }

  return (
    <>
      <Paper sx={{ width: "100%", overfMinor: "hidden",borderRadius:'40px' }}>
        <TableContainer
          component={Paper}
          //sx={{ borderRadius: 5, maxHeight: 440,maxWidth:1200 }}
          style={style}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#B5C0D0" }}
                  colSpan={columns.length+1}
                >
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <div><b> {tablename} </b>&nbsp;</div>
                    <TextField
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <SearchOutlinedIcon style={{ marginRight: "5px" }} />
                          <span style={{ fontSize: "12px" }}>Search...</span>
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
                                  setFilteredrows(rows);
                                }}
                              >
                                <DisabledByDefaultRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    >
                 </TextField>    
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    sx={{ backgroundColor: "#B5C0D0" ,fontWeight: "bold",fontSize:'14px'}}
                    key={column.label} //The column headers will be unique right ...
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align='center' sx={{ backgroundColor: "#B5C0D0" ,fontWeight: "bold",fontSize:'14px'}}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredrows &&
                filteredrows
                .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          let updatedValue =
                            updatedRow !== null
                              ? updatedRow[column.id]
                              : row[column.id];
                          return (
                            <TableCell key={value} align={column.align}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                  {/* {row.edited && (
                              <>
                                 <CheckCircleIcon
                                 fontSize="small"
                                  sx={{ color: "green" }}
                                />
                              </>
                            )} */}
                                {editRowIndex !== index &&
                                  column.id === redirectColumn &&
                                  redirectIconActive && (
                                    <Tooltip
                                      TransitionComponent={Fade}
                                      title="Configure 🡵  "
                                    >
                                      <div
                                        onClick={() => handleRedirect(row)}
                                        onMouseEnter={(e) =>
                                          (e.target.style.cursor = "pointer")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.target.style.cursor = "default")
                                        }
                                      >
                                        {value}
                                      </div>
                                    </Tooltip>
                                  )}

                                {editRowIndex !== index &&
                                  column.id === redirectColumn &&
                                  !redirectIconActive && (         
                                      <div>
                                        {value}
                                      </div>     
                                  )}
                                {/* </div>
                                <div> */}
                                {/* { redirectIconActive && <Tooltip TransitionComponent={Fade}  title="Configure 🡵  ">
                        <Button onClick={() => handleRedirect(row)}>
                          <LaunchOutlinedIcon
                            fontSize="small"
                            color="secondary"
                          />
                        </Button>
                        </Tooltip>} */}
                              </div>
                              {editRowIndex !== index &&
                                column.id !== redirectColumn && (
                                  <Typography>{value}</Typography>
                                )}
                              {editRowIndex === index &&
                                column.type === "textbox" && (
                                  <div>
                                    <TextField
                                      label={column.label}
                                      value={updatedValue}
                                      required
                                      error={editRequired}
                                      onChange={(e) => {
                                        handleInputChange(
                                          e,
                                          column.id,
                                          column.type
                                        );
                                        console.log(
                                          "updatedValue : ",
                                          updatedValue
                                        );
                                      }}
                                    />
                                  </div>
                                )}
                              {editRowIndex === index &&
                                column.type === "dropdown" && (
                                  <div>
                                    <Select
                                      label={column.label}
                                      value={updatedValue}
                                      required
                                      error={editRequired}
                                      onChange={(e) => {
                                        handleInputChange(
                                          e,
                                          column.id,
                                          column.type
                                        );
                                      }}
                                    >
                                      {column.values.map(
                                        (dropdownvalue, index) => (
                                          <MenuItem
                                            key={index}
                                            value={dropdownvalue}
                                          >
                                            {dropdownvalue}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </div>
                                )}
                              {editRowIndex === index &&
                                column.type === "calender" && (
                                  <div>
                                    <Datepicker
                                      format={"YYYY-MM-DD"}
                                      error={editRequired}
                                      label="Date"
                                      onChange={(e) => {
                                        handleInputChange(
                                          e,
                                          column.id,
                                          column.type
                                        );
                                      }}
                                      value={dayjs(updatedValue)}
                                    />
                                  </div>
                                )}
                            </TableCell>
                          );
                        })}
                        <TableCell sx={{ width: "10%" }} align="right">
                          <div style={{ display: "flex" }}>
                            {editRowIndex !== index && editActive && (
                                <Tooltip TransitionComponent={Fade}  title="Edit">
                              <Button
                                onClick={() => handleEditClick(index, row)}
                              >
                                <EditIcon align="right" color="primary" />
                              </Button>
                              </Tooltip>
                            )}
                            {editRowIndex !== index && (
                                <Tooltip TransitionComponent={Fade}  title="Delete">
                              <Button onClick={() =>deleteFromDatabase(row)}>
                                <DeleteIcon
                                  align="right"
                                  sx={{ color: "#FE2E2E" }}
                                />
                              </Button>
                              </Tooltip>
                            )}
                          </div>
                          {editRowIndex === index && (
                            <div style={{ display: "flex" }}>
                                  <Tooltip TransitionComponent={Fade}  title="Save">
                              <Button onClick={() => handleSaveClick(row)}>
                                <CheckIcon color="primary" />
                              </Button>
                              </Tooltip>
                              <Tooltip TransitionComponent={Fade}  title="Cancel">
                              <Button onClick={() => handleCancelClick(row)}>
                                <CancelIcon sx={{ color: "#FE2E2E" }} />
                              </Button>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
          <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    rowsPerPage={rowperpage}
                    page={page}
                    count={rows.length}
                    component="div"
                    onPageChange={handlechangepage}
                    onRowsPerPageChange={handleRowsPerPage}
                ></TablePagination>
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
