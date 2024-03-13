import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Fade,
    IconButton,
    LinearProgress,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
  } from "@mui/material";
  import { Container } from "@mui/system";
  import React, { useEffect, useState } from "react";
  import ListIcon from "@mui/icons-material/List";
  import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
  import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
  
  import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
  import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
  import AnimatedPage from "../AnimatedPage";
  import Swal from "sweetalert2";
  import EditIcon from "@mui/icons-material/Edit";
  import CheckIcon from "@mui/icons-material/Check";
  import CancelIcon from "@mui/icons-material/Cancel";
  import DeleteIcon from "@mui/icons-material/Delete";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CustomTextfield from "./CustomTextfield";
  import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
  import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
  import ClearIcon from '@mui/icons-material/Clear';
  export default function ConfigureInfrastructure() {
    const [search, setSearch] = useState("");
    const [newCateogry, setNewCategory] = useState("");
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [originalInfrarows, setoriginalInfraRows] = useState([]);
    const [infraList, setInfraList] = useState([]);
    const [snackbarText, setSnackbarText] = useState("Data saved !");
    const [snackbarSeverity, setsnackbarSeverity] = useState("success");
    const [open, setOpen] = useState(false);
    const [categoryError,setCategoryError]=useState(false);
    const [onEditError,setOnEditError]=useState(false);
    const [progressVisible,setProgressVisible]=useState(false);
    
    const history = useHistory();
    
    const fetchInfraFromDb = async () => {
      setProgressVisible(true)
      console.log("fetchInfraFromDb() called");
      try {
        const response = await fetch(
          `http://localhost:8082/infrastructure/admin/1`
        );
        if (!response.ok) {
          console.log('Response => '+response.status)
          throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        let infrastructure = [];
        if (data.infraDetails) {
          console.log("infraDetails from Db => ", data.infraDetails);
          data.infraDetails.map((item) => {
            console.log("inf name => ", item.infrastructure_name);
            infrastructure.push(item.infrastructure_name);
            console.log("infrastructure array => ", infrastructure);
          });
        }
        setInfraList(infrastructure);
        setoriginalInfraRows(infrastructure);
        setProgressVisible(false)
        // setsnackbarSeverity("success")
        // setSnackbarText("Data refereshed successfully !")
        // setOpen(true)
      } catch (error) {
        setProgressVisible(false)
        setsnackbarSeverity("error")
        setSnackbarText(error.toString())
        setOpen(true)
        console.log("Error fetching data from database !");
      }
    };
  
    useEffect(() => {
      fetchInfraFromDb();
    }, []);
  
    //Will include id later on to implement the same to identify the list item .....
    //Will include plantID too..
    const handleClick = (infrastructure) => {
      const paramIssue = infrastructure.trim();
      console.log("Category is => ", paramIssue);
      const data={infrastructure:infrastructure,plantID:1};
      console.log("Data sent is => ",data)
      history.push({ pathname: "/conf", state: data });
    };
  
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
    const handleAddIssues = () => {
      
      setCategoryError(false)
      if (newCateogry.length === 0 || newCateogry.trim() === "") {
        setsnackbarSeverity("error")
        setSnackbarText("Category name cannot be blank ! ")
        setOpen(true)
        setCategoryError(true)
        return;
      }
      const regex = /[^A-Za-z0-9 _]/;
      if(regex.test(newCateogry.trim())) {
        setsnackbarSeverity("error")
        setSnackbarText("Special Characters are not allowed ! ")
        setCategoryError(true)
        setOpen(true)
        return ;
      }
      if(infraList.some(item => item.trim().toLowerCase() === newCateogry.trim().toLowerCase())) {
       
        console.log("Infrastructure already exists ! ");
        setsnackbarSeverity("error")
        setSnackbarText("Category aready exists ! ");
        setOpen(true)
        setCategoryError(true)
        
        return;
      }
      const data={infrastructure:newCateogry,plantID:1};
      console.log("Data sent is => ",data)
      history.push({ pathname: "/conf", state: data });
    };
  
    const classes = {
      conatiner: {
        marginTop: "10px",
      },
      tablehead: {
        fontWeight: "bold",
        backgroundColor: "#B5C0D0",
        lineHeight:4
        
      },
      textField: {
        width: "300px",
      },
      btn: {
        transition: "0.3s",
        "&:hover": { borderBottomWidth: 0, transform: "translateY(5px)" },
      },
    };
  
    const handleAlertClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpen(false);
    };
  
    const handleEditClick = (issue, index) => {
      console.log("edit click for issue ", issue, " with index ", index);
      setEditRowIndex(index);
      setEditValue(issue);
    };
  
    const updateInfraNameDB = async (prev_infra, new_infraname) => {
      try {
        const response = await fetch(
          `http://localhost:8082/infrastructure/admin/1/${prev_infra}/${new_infraname}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
    
        }
        if (response.ok) {
          const foundindex = originalInfrarows.indexOf(prev_infra);
          console.log('Modificaition initiated')
          const newInfraList = [...originalInfrarows];
          newInfraList[foundindex] = editValue.trim();
          setInfraList(newInfraList);
          setoriginalInfraRows(newInfraList);
          console.log("newInfraList => ", newInfraList);
          setSearch("");
          setEditRowIndex(null);
          setEditValue("");
          setsnackbarSeverity("success");
          setSnackbarText("Changes are saved !");
          setOpen(true);
        }
      } catch (error) {
        console.log("Error in updating infra name");
        setsnackbarSeverity("error");
        setSnackbarText("Database Error !");
        setOpen(true);
        setSearch("");
        setEditRowIndex(null);
        setEditValue("");
      }
    };
  
    const deletefromDB = async (infra_name) => {
      try {
        const response = await fetch(
          `http://localhost:8082/infrastructure/admin/1/${infra_name}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const rowCopy = [...infraList];
          const filterArray = rowCopy.filter((item) => item !== infra_name);
          setInfraList(filterArray);
          setSearch("");
          setsnackbarSeverity("success");
          setSnackbarText("Data deleted successfully ! ");
          setOpen(true);
        }
      } catch (error) {
        setsnackbarSeverity("error");
        setSnackbarText("Database error ! ");
        setOpen(true);
      }
    };
  
    const handleDeleteClick = async (infra_name) => {
      Swal.fire({
        title: "Do you really want to delete ? ",
        showDenyButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          deletefromDB(infra_name);
        }
      });
    };
  
    const handleSaveClick = (issue, index) => {
      // const  dataCopy = [...issueList];
      setOnEditError(false);
      if(editValue.trim()==='')
      {
        setsnackbarSeverity("error")
        setSnackbarText("Category Name cannot be empty ! ")
        setOnEditError(true)
        setOpen(true)
        //setEditRowIndex(null)
        return;
      }
      const regex = /[^A-Za-z0-9 _]/;
      if(regex.test(editValue.trim())) {
        setsnackbarSeverity("error")
        setSnackbarText("Special Characters are not allowed ! ")
        setOnEditError(true)
        setOpen(true)
        return ;
      }
      console.log("Current Edit for row => ", issue);
      const foundindex = originalInfrarows.indexOf(issue);
      console.log("original index in the list => ", foundindex);
      if (
        foundindex === -1 ||
        originalInfrarows[foundindex] === editValue.trim()
      ) {
        console.log("Index ", foundindex, " or issue already exists");
        setEditRowIndex(null);
        return;
      }
      updateInfraNameDB(issue, editValue.trim());
      setOnEditError(false);
      //console.log('success',success)
     
    };
  
    const handleCancelClick = (issue, index) => {
      setEditRowIndex(null);
      setEditValue("");
    };
  
    const handleSearchChange = (event) => {
      setSearch(event.target.value);
      const currentSearch = event.target.value;
      console.log("Search => ", search);
  
      if (currentSearch === "" || currentSearch.length === 0) {
        setInfraList(originalInfrarows);
      } else {
        const updatedRows = [...originalInfrarows];
        const filteredRows = updatedRows.filter((infra) =>
          infra.toLowerCase().includes(currentSearch.trim().toLowerCase())
        );
        console.log("Filtered Rows => ", filteredRows);
        setInfraList(filteredRows);
        setEditRowIndex(null);
      }
    };
  
    return (
      <AnimatedPage>
        <div>
          <center>
            <Container sx={classes.conatiner}>
              <CustomTextfield
                label={"Infrastructure Category"}
                variant={"outlined"}
                required
                value={newCateogry}
                helpertext={"Enter a new Infrastructure category *"}
                onChange={(e) => setNewCategory(e.target.value)}
                size="large"
                error={categoryError}
                
              ></CustomTextfield>
              <br />
              <br />
              <Button
                variant="contained"
                size="large"
                color="success"
                sx={classes.btn}
                onClick={() => handleAddIssues()}
              >
                Add Issues ➥
              </Button>
              <br />
              <br />
              <b>OR</b>
              <br />
              <br />
  
              <TableContainer component={Paper} sx={{borderRadius:5}}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center"
                         sx={classes.tablehead}
                        // align="center"
                        colSpan={3}
                      >
                       
                        Edit Existing Category List &nbsp;
                        <BorderColorOutlinedIcon fontSize="medium"></BorderColorOutlinedIcon>
                        &nbsp;&nbsp;
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
                         
                        >
                          </CustomTextfield>
                          <Tooltip title="Clear">
                         <Button
                
                         onClick={()=>
                        {
                          setSearch("");
                          setInfraList(originalInfrarows);
                        }}
                        sx={{color:'black'}}
                         >
                          <DisabledByDefaultRoundedIcon
                          >  
                          </DisabledByDefaultRoundedIcon>
  
                         </Button>
                         </Tooltip>
                      </TableCell>
                       
                    </TableRow>
  
                    <TableRow sx={{ backgroundColor: "#B5C0D0", fontWeight: "bold" }}>
                      <TableCell><b>Infrastructure Category</b></TableCell>
                      <TableCell align="center"><b>Action</b></TableCell>
                      <TableCell sx={{width:'10%' }}><b>Configure</b></TableCell>
                    </TableRow>
                    {/* {infraList.length===0 ?  <Box sx={{ width: '155%' }}>
                      <LinearProgress />
                    </Box>:
                    <> */}
                    {infraList.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {editRowIndex !== index && (
                            <div>
                              {row.edited && (
                                <>
                                  <CheckCircleIcon
                                    fontSize="small"
                                    sx={{ color: "green" }}
                                  />
                                </>
                              )}
                              &nbsp;
                              <Typography component="div">
                                <Box
                                  sx={{
                                    lineHeight: "normal",
                                    
                                    marginTop:-2.7,
                                    width: "300px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {row}
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
                                error={onEditError}
                              />
                            </div>
                          )}
                          {/* <IconButton onClick={() => handleClick(row)}>
                            <LaunchOutlinedIcon
                              fontSize="small"
                              color="secondary"
                            />
                          </IconButton> */}
                        </TableCell>
                        <TableCell sx={{ width: "10%" }}>
                          <div style={{display:'flex' ,padding:0}}>
                          {editRowIndex !== index && (
                            <Tooltip TransitionComponent={Fade}  title="Edit">
                            <Button
                              onClick={() => handleEditClick(row, index)}
                            >
                              <EditIcon align="right" color="primary" />
                            </Button>
                            </Tooltip>
                          )}
                          {editRowIndex !== index && (
                            <Tooltip TransitionComponent={Fade}  title="Delete">
                            <Button onClick={() => handleDeleteClick(row)}>
                              <DeleteIcon
                                align="right"
                                sx={{ color: "#FE2E2E" }}
                              />
                            </Button>
                            </Tooltip >
                          )}</div>
                          {editRowIndex === index && (
                            <div style={{display:'flex'}}>
                               <Tooltip TransitionComponent={Fade}  title="Save">
                              <Button
                                onClick={() => handleSaveClick(row, index)}
                              >
                                <CheckIcon color="primary" />
                              </Button>
                              </Tooltip>
                              <Tooltip TransitionComponent={Fade}  title="Cancel">
                              <Button
                                onClick={() => handleCancelClick(row, index)}
                              >
                                <CancelIcon sx={{ color: "#FE2E2E" }} />
                              </Button>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                        <Tooltip TransitionComponent={Fade}  title="Configure 🡵  ">
                          <Button onClick={() => handleClick(row)}>
                            <LaunchOutlinedIcon
                              fontSize="small"
                              color="secondary"
                            />
                          </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                   
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </center>
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
  