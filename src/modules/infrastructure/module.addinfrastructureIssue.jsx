//import React, { useState } from 'react'
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
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
//import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
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
// import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import EditAttributesOutlinedIcon from "@mui/icons-material/EditAttributesOutlined";
import { green } from "@mui/material/colors";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AnimatedPage from "../AnimatedPage";
import { motion } from "framer-motion";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import CustomDropdown from "./CustomDropDown";
import CustomTextfield from "./CustomTextfield";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

export default function AddInfrastructureIssue() {
  //********************* Data ********************

  // const [rows,setRows]=useState(
  // [
  //   {id:1,issueName:'Windows not working',edited:false,severity:'critical'},
  //   {id:2,issueName:"Blue Screen",edited:false,severity:'major'},
  //   {id:3,issueName: "Response slow",edited:false,severity:'minor'}
  // ]
  // )
  const [rows, setRows] = useState([]);
  // const originalRows= [
  //   {issueName:'Windows not working'},
  //   {issueName:"Blue Screen"},
  //   {issueName: "Response slow"}
  // ];

  const [originalRows, setOriginalRows] = useState([]);

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [addIssue, setAddIssue] = useState("");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [open, setOpen] = useState(false);
 // const history = useHistory();
  const [editRequire, setEditRequire] = useState(false);
  const [onEditSeverity, setOnEditSeverity] = useState("");
  // const [dialogVisible,setDialogVisible]=useState(false)
  const location=useLocation()
  console.log("location state values are => ",location.state)
  const  plantId=location.state.plantID;
  const inf=location.state.infrastructure;
  const [addSeverity, setAddSeverity] = useState("");
  const [addIssueError, setAddissueError] = useState(false);
  const [dropDownError, setDropdownError] = useState(false);

  //for snackbar alert
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(5);
  

  //********************* Style classes ***************
  const classes = {
    conatiner: {
      marginTop: "10px",
    },
    tablehead: {
      fontWeight: "bold",
      backgroundColor: "#B5C0D0",
    },
    btn: {
      transition: "0.3s",
      "&:hover": { borderBottomWidth: 0, transform: "translateY(5px)" },
    },
  };

  // *****************  Functions  *****************
//Database functions  for CRUD operations
const deletedataDb=async (issue)=>
{
  console.log("Issue to be deleted => ",issue)
  try{
    // const currentIP=`http://192.168.7.18:8082/infrastructure/admin/${plantId}/${inf}/${issue}`
    // console.log('IP => ',currentIP);
    const response= await fetch(`http://localhost:8082/infrastructure/admin/${plantId}/${inf}/${issue}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'}

    })
    if(response.ok)
    {
      console.log("Data deleted successfully from DB");
      
      const updatedRows = rows.filter((row) => row.issue_name !== issue);
      //here database operatiion will be performed
      setRows(updatedRows);
      setFilteredRows(updatedRows);
      setSnackbarText("Deleted successfully !");
      setsnackbarSeverity("success");
      setOpen(true);
    }
    if (!response.ok) {
      throw new Error("Failed to delete data");
    }
   
  }
  catch(error){
      setsnackbarSeverity("error")
      setSnackbarText("Database Error !")
      setOpen(true)
      
  }
}



const saveEditedDataDb=async (newdata,prev_issue,new_rows)=>
{
  try{
      console.log('prev_issue => ',prev_issue);
      console.log('row_data => ',newdata);
      const json_data = {
        "plant_id": `${plantId}`,
        "infraDetails": [
          {
            "infrastructure_name": `${inf}`,
            "issues": [
              newdata
            ]
          }
        ]
      };
      const response= await fetch(`http://localhost:8082/infrastructure/admin/${plantId}/${inf}/issues/${prev_issue}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(json_data)
    })
    if(response.ok)
    {
      console.log('Data has been updated successfully ! ')
      newdata.edited = true;
      setRows(new_rows);
      setFilteredRows(new_rows);
      console.log("Final array  => ",new_rows);
      setSearch("");
      setOpen(true);
  
      // Resetting man !!
      setEditRowIndex(null);
      setEditValue("");
    }
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
  }
  catch(error)
  {
   
    setSearch("");
  
    // Resetting man !!
    setEditRowIndex(null);
    setEditValue("");
    setSnackbarText("Database Error !")
    setsnackbarSeverity("error")
    setOpen(true)
    
  }
}



const saveInfrastructureDetails=async (data) => {
  try {
    console.log('Data => ', data);
    // await axios.post("/api/infrastructures/" + plantId, data).then((response)=>{
    //     if(response.status === 200){
    //       handleClickAlertClose()
    //       showSuccessMessage("Data has been Saved Successfully")
    //     }else{  

    const json_data = {
      "plant_id": `${plantId}`,
      "infraDetails": [
        {
          "infrastructure_name": `${inf}`,
          "issues": [
            data
          ]
        }
      ]
    };
    console.log('Json-Data => ',JSON.stringify(json_data));
    
   const response= await fetch(`http://localhost:8082/infrastructure/admin/${plantId}`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(json_data)
  })
  if(response.ok)
{
  console.log("Data has been successfully saved !");
  const updatedRows = [
    
    {
      issue_name: addIssue.trim(),
      severity: addSeverity,
    },
    ...rows,
  ];
  //updatedRows.push( { issueName: addIssue.trim() }) //remember rows are object here ...
  setRows(updatedRows);
  setFilteredRows(updatedRows);
  setAddIssue("");
  setOpen(true);
  setAddSeverity("");
  // setAddissueError(false);
  // setAddissueError(false);
}
if (!response.ok) {
  throw new Error("Failed to fetch data");
}
  }
  catch(error){
    setSnackbarText("Database Error !")
    setsnackbarSeverity("error")
    setOpen(true)
    setAddIssue("");
    setAddSeverity("");
  }
}


const handlechangepage = (event, newpage) => {
  pagechange(newpage)
}
const handleRowsPerPage = (event) => {
  rowperpagechange(+event.target.value)
  pagechange(0);
}

  const handleAddClick = () => {
    setSnackbarText("Data saved !");
    setsnackbarSeverity("success");
    console.log("handleAddClick() called");
    console.log("Severity from add Dropdown ", addSeverity);
    setDropdownError(false);
    setAddissueError(false);
    if (addIssue.trim() === "" && addSeverity === "") {
      setSnackbarText("Fill required data !");
      setsnackbarSeverity("error");
      setOpen(true);
      setAddissueError(true);
      setDropdownError(true);
      return;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if(regex.test(addIssue.trim())) {
      setsnackbarSeverity("error")
      setSnackbarText("Special Characters are not allowed ! ")
      setAddissueError(true);
      setOpen(true)
      return ;
    }
    if (addIssue.trim() === "" || addIssue==="None") {
      setAddissueError(true);
      setSnackbarText("Fill required data !");
      setsnackbarSeverity("error");
      setOpen(true);
      return;
    }
    if (addSeverity === "None"|| addSeverity === "") {
      setDropdownError(true);
      setSnackbarText("Fill required data !");
      setsnackbarSeverity("error");
      setOpen(true);
      return;
    }

    if (
      rows.find(
        (row) => row.issue_name.toLowerCase() === addIssue.trim().toLowerCase()
      )
    ) {
      console.log("Issue already exists");
      setSnackbarText("This issue is already added");
      setsnackbarSeverity("error");
      setOpen(true);
      return;
    }

    if (addIssue.trim() !== "") {
      const newRow={
        issue_name: addIssue.trim(),
        severity: addSeverity,
      };
      saveInfrastructureDetails(newRow);
     
    }
  };

  const handleDeleteClick = (index, issue_name) => {
    Swal.fire({
      title: "Do you really want to delete ? ",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire("Saved!", "", "success");

        deletedataDb(issue_name);
        
      }
    });
    console.log("handleDeleteClick()");

    //setSearch('');
  };

  const handleEditClick = (issue_name, index, selectedrow) => {
    console.log("handleEditClick()");
    console.log(
      "Edit clicked for row with issue => ",
      issue_name,
      "Index => ",
      index
    );
    setEditRowIndex(index);

    setEditValue(rows.find((row) => row.issue_name === issue_name).issue_name);
    console.log("Selected Row severity => ", selectedrow.severity);
    setOnEditSeverity(selectedrow.severity);
    console.log("Current Edit Value =>", editValue);
  };

  const handleSaveClick = (index, issue_name, selectedRow) => {
    //Updating by creating a shallow copy good !!
    setSnackbarText("Changes are saved !");
    setsnackbarSeverity("success");
    console.log("Save clicked");
    setEditRequire(false);
    //updatedRows[index].issueName = editValue;
    console.log("edited issue => " + editValue);
    if (editValue.trim() === "") {
      console.log("edit is blank");
      setSnackbarText("Issues cannot be blank !");
      setsnackbarSeverity("error");
      setOpen(true);

      setEditRequire(true);

      return;
    }
    console.log("Current Edit Value => ",editValue)
    const regex = /[^A-Za-z0-9 _]/;
    if(regex.test(editValue.trim())) {
      console.log("Special Characters found ! for => ",editValue)
      setsnackbarSeverity("error")
      setSnackbarText("Special Characters are not allowed ! ")
      setEditRequire(true);
      setOpen(true)
      return ;
    }

    if (
      rows.find(
        (row) => row.issue_name.toLowerCase() === editValue.trim().toLowerCase()
      ) &&
      selectedRow.severity.toLowerCase() === onEditSeverity.trim().toLowerCase()
    ) {
      console.log("Issue already exists");
      // setSnackbarText('This issue is already added');
      // setsnackbarSeverity('error')
      // setOpen(true)
      setEditRowIndex(null);
      return;
    }

    const updatedRows = [...rows];
    // updatedRows.find((row) => row.issue_name === issue_name).issue_name = editValue;
    const foundRow = updatedRows.find((row) => row.issue_name === issue_name);
    if (foundRow) {
      const prev_issue=foundRow.issue_name;
      foundRow.issue_name = editValue.trim();
      foundRow.severity = onEditSeverity;
      saveEditedDataDb(foundRow,prev_issue,updatedRows)
     
    }

    // updatedRows.find((row) => row.issue_name === issue_name).edited = true;

  };

  const handleCancelClick = (index) => {
    // Resetting editRowIndex and editValue
    console.log("Cancel clicked");
    setEditRequire(false);
    setEditRowIndex(null);
    setEditValue("");
    setSearch("");
  };

  const handleSeverityChange = (index, issue_name, event) => {
    console.log("handleSeverityChange() called");
    console.log("event selection => ", event.target.value);
    console.log("id=> ", issue_name);
    // const updatedRows = [...rows];
    // updatedRows.find((row) => row.issue_name === issue_name).severity = event.target.value;
    // console.log("Updated Rows are => ", updatedRows);
    // setRows(updatedRows);
    setOnEditSeverity(event.target.value);
    //setFilteredRows(updatedRows)
  };

  const handleAddSeverityChange = (event) => {
    setAddSeverity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    const currentSearch = event.target.value;
    console.log("Search => ", search);

    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredRows(rows);//Keeping the  original list of rows
    } else {
      const updatedRows = [...rows];
      const filteredRows = updatedRows.filter((issue) =>
        issue.issue_name
          .toLowerCase()
          .includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredRows);
      setFilteredRows(filteredRows);
      setEditRowIndex(null);
    }
  };

  const fetchDBdata = async (plantId,inf) => {
    console.log("fetchDBdata() called ")
    console.log("plantID => ",plantId)
    console.log("Infrastructure => ",inf)
    if(plantId&&inf)
    {
    try {
      console.log("fetchDBdata() called ");
      console.log("plant ID => ", plantId);
      console.log("infrastructure => ", inf);
      const response = await fetch(
        `http://localhost:8082/infrastructure/admin/${plantId}/${inf}/issues`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.infraDetails) {
        console.log("issues are => ", data.infraDetails[0].issues);
        setRows(data.infraDetails[0].issues);
        setFilteredRows(data.infraDetails[0].issues);
        setOriginalRows(data.infraDetails[0].issues);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      }
    }
      else
      {
        setsnackbarSeverity("errror")
        setSnackbarText("Error in fetching data !")
        setOpen(true)
        
      }
    
    console.log('fetchDBdata() ends')
  };

  //useEffect Hook
  useEffect(() => {
    console.log("useEffect() called");
    console.log("plantId", plantId);
    console.log("Infrastructure : ", inf);
    console.log("search value is ", search);
    fetchDBdata(plantId, inf);
    //console.log('History => ',history);

    //  initializing DB connection  and fetching data from the database

    // function handleOnBeforeUnload(event)
    // {
    //   event.preventDefault();
    //  // return (event.returnValue='')
    //  //setOpen(true)
    //  Swal.fire({
    //   title: "The Internet?",
    //   text: "That thing is still around?",
    //   icon: "question"
    // });

    // }

    //   window.addEventListener('beforeunload',handleOnBeforeUnload)

    // window.addEventListener('beforeunload',openDialog)

    const handleOnBeforeUnload = (event) => {
      // event.preventDefault();

      console.log("issueName :", addIssue);

      console.log(
        "state true or false",
        filteredRows.toString === rows.toString
      );

      console.log("Filtered Rows :" + JSON.stringify(filteredRows));
      console.log("Original Rows :", JSON.stringify(originalRows));

      if (
        JSON.stringify(filteredRows) === JSON.stringify(originalRows) &&
        addIssue.length === 0
      ) {
        console.log("return from beforeUnload");
        return;
      }
      event.preventDefault();
      // event.preventDefault();
      // Show the SweetAlert dialog
      // Swal.fire({
      //   title: "The Internet?",
      //   text: "That thing is still around?",
      //   icon: "question",
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // Continue with the leave action or navigate to a different page
      //     console.log('I am here');
      //   }
      // });
    };

    window.addEventListener("beforeunload", handleOnBeforeUnload);
    //console.log(process.env.REACT_APP_NOT_SECRET_CODE);

    // remember  this is a cleanup function which will be executed before the next execution of the effect or when the component is unmounted.
    //they are treated as options of useEffect
    return () => {
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
    };
  }, []); //useEffect ends here

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    color: "green",
    showCloseButton: true,
  });

  // const handleSubmit = () => {
  //   console.log("handleSubmit()");
  //   // setOpen(true);
  //   console.log("Final JSON => " + JSON.stringify(rows));

  //   history.push("/");
  //   Toast.fire({
  //     icon: "success",
  //     title: "Data saved successfully",
  //   });
  // };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClick = (id) => {
    console.log("ID=> " + id);
  };

  const handlefilter = (event) => {
    if (event.target.value === "All") {
      console.log("default rows => ", rows);
      setFilteredRows(rows);
      setFilterSeverity(event.target.value);
      return;
    }
    setFilterSeverity(event.target.value);
    console.log("Severity => ", event.target.value);
    const filteredRows = rows.filter((row) => {
      return row.severity.toLowerCase() === event.target.value.toLowerCase();
    });
    console.log("filtered rows => ", filteredRows);
    setFilteredRows(filteredRows);
  };

  //for framer motion
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)",
    },
  };
  //for dropdown
  const severityColors = {
    critical: "#B80000",
    major: "#610C9F",
    minor: "#1B3C73",
  };

  const severityValues = {
    major: "Major",
    minor: "Minor",
    critical: "Critical",
  };

  const onEditseveritydropdown=[
    "Critical",
    "Major",
    "Minor" 
  ]

  const customSeverity = [
    // {
    //   label: "Select One...",
    //   value: "",
    // },
    // {
    //   label: "Critical",
    //   value: "critical",
    // },
    // {
    //   label: "Major",
    //   value: "major",
    // },
    // {
    //   label: "Minor",
    //   value: "minor",
    // },
    "None",
    "Critical",
    "Major",
    "Minor"
  ];
  const customfilterList=
  [
   "All",
   "Critical",
   "Major",
   "Minor"
  ];

 
  //************** Returned Component  **************
  return (
    <AnimatedPage>
      <div>
        <form>
          <Container sx={classes.conatiner}>
            <Box
              boxShadow={2} // Adjust the shadow depth as needed
              p={2} // Optional: Add padding to the box
             
            >
              <Typography
                variant="h6"
                color="textSecondary"
                component="h2"
                gutterBottom
                fontWeight={900}
              >
                Current Issue Category Name ➥ &nbsp;
                <span style={{ color: "red" }}>{inf}</span>
              </Typography>
            </Box>
            <br />
            {/* issue name */}
            <CustomTextfield
              onChange={(e) => setAddIssue(e.target.value)}
              // sx={classes.txt}
              label={"Enter Issue Name"}
              variant={"outlined"}
              required
              value={addIssue}
              error={addIssueError}
            />
            &nbsp;&nbsp;
            {/* Add Severity Dropdown  */}
            {/* <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Select One
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={addSeverity}
                label="Severity"
                //style={{ color: severityColors[row.severity] || severityColors.minor ,fontWeight:'bold'}}
                onChange={(event) => handleAddSeverityChange(event)}
                error={dropDownError}
              >
              
                <MenuItem value={""}>Select One..</MenuItem>
                <MenuItem
                  sx={{ color: "#B80000", fontWeight: "bold" }}
                  value={"critical"}
                >
                  Critical
                </MenuItem>
                <MenuItem
                  sx={{ color: "#610C9F", fontWeight: "bold" }}
                  value={"major"}
                >
                  Major
                </MenuItem>
                <MenuItem
                  sx={{ color: "#1B3C73", fontWeight: "bold" }}
                  value={"minor"}
                >
                  Minor
                </MenuItem>
              </Select>
              <FormHelperText>
                <b>Level of Severity</b>{" "}
              </FormHelperText>
            </FormControl> */}
            <CustomDropdown
              id={"add-severity"}
              value={addSeverity}
              onChange={(event) => handleAddSeverityChange(event)}
              list={customSeverity}
              label={"Severity"}
              showerror={dropDownError}
            ></CustomDropdown>
            &nbsp;&nbsp;
            {/* add icon */}
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddClick}
            >
              Add &nbsp;
              <AddCircleOutlineOutlinedIcon
                fontSize="large"
                sx={{ color: "white" }}
              ></AddCircleOutlineOutlinedIcon>
            </Button>
            <br />
            <br />
            <motion.div
              variants={icon}
              initial="hidden"
              animate="visible"
              transition={{
                default: { duration: 2, ease: "easeInOut" },
                fill: { duration: 4, ease: [1, 0, 0.8, 1] },
              }}
            >
              <TableContainer component={Paper} sx={{borderRadius:5}}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          textAlign: "center",
                          fontSize: "15px",
                          fontWeight: "bold",
                          backgroundColor: "#B5C0D0",
                          lineHeight:4
                        }}
                      >
                        <CategoryOutlined fontSize="small" />
                        &nbsp; Added Issue List &nbsp; &nbsp;
                        <CustomTextfield
                          onChange={(e) => handleSearchChange(e)}
                          variant={"outlined"}
                          size="small"
                          
                          //placeholder='Search'
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
                          value={search}
                          sx={{
                            marginLeft: "5px",
                            width: "200px",
                            // Set the background color to white
                          }}
                          //   InputProps={{
                          //     startAdornment: (
                          //         <InputAdornment position="start">
                          //             <SearchOutlinedIcon />
                          //         </InputAdornment>
                          //     ),
                          // }}
                        />
                         <Tooltip title="Clear">
                       <Button
                       onClick={()=>
                      {
                        setSearch("");
                        setFilteredRows(rows)
                      }}
                      style={{color:'black'}}
                       >
                        <DisabledByDefaultRoundedIcon/>
                       </Button>
                       </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ backgroundColor: "#B5C0D0", fontWeight: "bold" }}
                    >
                      <TableCell sx={{ fontWeight: "bold" ,width:'40%'}}>Issues</TableCell>
                      <TableCell sx={{ fontWeight: "bold", width:'40%',lineHeight: 5 }}>
                        Severity
                        &nbsp;&nbsp;
                        {/* <FormControl sx={{ minWidth: 120 }} size="small">
                          <InputLabel id="demo-simple-select-helper-label">
                            Filter
                          </InputLabel>

                          <Select
                            size="medium"
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={filterSeverity}
                            label="Severity"
                            //style={{ color: severityColors[row.severity] || severityColors.minor ,fontWeight:'bold'}}
                            onChange={(event) => handlefilter(event)}
                            //error={dropDownError}
                          >
                           
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem
                              sx={{ color: "#B80000", fontWeight: "bold" }}
                              value={"critical"}
                            >
                              Critical
                            </MenuItem>
                            <MenuItem
                              sx={{ color: "#610C9F", fontWeight: "bold" }}
                              value={"major"}
                            >
                              Major
                            </MenuItem>
                            <MenuItem
                              sx={{ color: "#1B3C73", fontWeight: "bold" }}
                              value={"minor"}
                            >
                              Minor
                            </MenuItem>
                          </Select>
                          
                        </FormControl> */}
                        <CustomDropdown
                        id={"filter-severity"}
                        label={"Filter"}
                        value={filterSeverity}
                        onChange={(event) => handlefilter(event)}
                        list={customfilterList}
                         >
                        </CustomDropdown>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold",width:'10%' }} align="center">Action</TableCell>
                    </TableRow>
                    {filteredRows && filteredRows
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        {/* <TableCell onClick={()=>handleClick(index)} sx={{display:'flex',alignItems:'center',justifyContent:'center'}}> */}
                        <TableCell sx={{width:'40%'}}>
                          {editRowIndex !== index && (
                            <div style={{display:'flex'}}>
                              {row.edited && (
                                
                                  <CheckCircleIcon
                                    fontSize="small"
                                    sx={{ color: "green" }}
                                  />
                                
                              )}
                              &nbsp;
                              <Typography component="div">
                                <Box
                                  sx={{
                                    lineHeight: "normal",
                                    width: "300px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {row.issue_name}
                                </Box>
                              </Typography>
                            </div>
                          )}
                          {editRowIndex === index && (
                            <div>
                              <CustomTextfield
                                // multiline
                                // rows={4}
                                label={"Issue"}
                                value={editValue}
                                onChange={(event) =>
                                  setEditValue(event.target.value)
                                }
                                required
                                error={editRequire}
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell sx={{width:'40%'}}>
                          {editRowIndex !== index && (
                            <div
                              style={{
                                color:
                                  severityColors[row.severity.toLowerCase()] ||
                                  severityColors.minor,
                                fontWeight: "bold",
                                fontSize: "medium",
                              }}
                            >
                              &nbsp;{severityValues[row.severity.toLowerCase()]}
                            </div>
                          )}
                          {editRowIndex === index && (
                            <div>
                              {/* <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">
                                  Severity
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-helper-label"
                                  id="demo-simple-select-helper"
                                  value={onEditSeverity}
                                  label="Severity"
                                  style={{
                                    color:
                                      severityColors[
                                        row.severity.toLowerCase()
                                      ] || severityColors.minor,
                                    fontWeight: "bold",
                                  }}
                                  onChange={(event) =>
                                    handleSeverityChange(
                                      index,
                                      row.issue_name,
                                      event
                                    )
                                  }
                                >
                                  
                                  <MenuItem
                                    sx={{
                                      color: "#B80000",
                                      fontWeight: "bold",
                                    }}
                                    value={"critical"}
                                  >
                                    Critical
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      color: "#610C9F",
                                      fontWeight: "bold",
                                    }}
                                    value={"major"}
                                  >
                                    Major
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      color: "#1B3C73",
                                      fontWeight: "bold",
                                    }}
                                    value={"minor"}
                                  >
                                    Minor
                                  </MenuItem>
                                </Select>
                                <FormHelperText>
                                  <b>Level of Severity</b>{" "}
                                </FormHelperText>
                              </FormControl> */}
                              <CustomDropdown
                              id={"edit-dropdown"}
                              label={"Severity"}
                              onChange={(event) =>
                                handleSeverityChange(
                                  index,
                                  row.issue_name,
                                  event
                                )
                              }
                              value={onEditSeverity}
                              list={onEditseveritydropdown}
                              >  
                              </CustomDropdown>
                            </div>
                          )}
                        </TableCell>

                        <TableCell sx={{ width: "10%" }} align="right">
                          <div style={{display:'flex'}}>
                          {editRowIndex !== index && (
                            <Tooltip TransitionComponent={Fade}  title="Edit">
                            <Button
                              onClick={() =>
                                handleEditClick(row.issue_name, index, row)
                              }
                            >
                              <EditIcon align="right" color="primary" />
                            </Button>
                            </Tooltip>
                          )}

                          {editRowIndex !== index && (
                            <Tooltip TransitionComponent={Fade}  title="Delete">
                            <Button
                              onClick={() =>
                                handleDeleteClick(index, row.issue_name)
                              }
                            >
                              <DeleteIcon
                                align="right"
                                sx={{ color: "#FE2E2E" }}
                              />
                            </Button>
                            </Tooltip>
                          )}
                          </div>
                          {editRowIndex === index && (
                           <div style={{display:'flex'}}>
                              <Tooltip TransitionComponent={Fade}  title="Save">
                              <Button
                                onClick={() =>
                                  handleSaveClick(index, row.issue_name, row)
                                }
                              >
                                <CheckIcon color="primary" />
                              </Button>
                              </Tooltip>
                              <Tooltip TransitionComponent={Fade}  title="Cancel">
                              <Button
                                onClick={() => handleCancelClick(index)}
                              >
                                <CancelIcon sx={{ color: "#FE2E2E" }} />
                              </Button>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    rowsPerPage={rowperpage}
                    page={page}
                    count={rows.length}
                    component="div"
                    onPageChange={handlechangepage}
                    onRowsPerPageChange={handleRowsPerPage}

                ></TablePagination>
            </motion.div>
            <br />
            <center>
              {/* <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={classes.btn}
              >
                Submit ➥
              </Button> */}
              <br />
              <br />
            </center>
          </Container>
        </form>

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
      </div>
    </AnimatedPage>
  );
}