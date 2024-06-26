import { Box, Typography } from "@mui/material";
import { Container, padding } from "@mui/system";
//import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useEffect, useState } from "react";
// import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import AnimatedPage from "../../components/animation_/AnimatedPage";
import CustomButton from "../../components/button/button.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import CustomTable from "../../components/table/table.component";
import Textfield from "../../components/textfield/textfield.component";
import { useLayoutEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { extendTokenExpiration } from "../helper/Support360Api";
import {
  deleteCurrentInfrastructure,
  fecthCurrentInfrastructureDetails,
  fetchDivs,
  fetchUser,
  saveCurrentModifiedData,
  saveNewInfrastructure,
} from "./infrastructureAdminAPI";

export default function AddInfrastructureIssue({ sendUrllist }) {
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
  const location = useLocation();
  console.log("location state values are => ", location.state);
  const plantId = location.state.plantID;
  const inf = location.state.infrastructure;
  const current_project = location.state.project;
  const [addSeverity, setAddSeverity] = useState("");
  const [addIssueError, setAddissueError] = useState(false);
  const [dropDownError, setDropdownError] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);

  //for snackbar alert
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(5);

  //Modified
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const navigate = useNavigate();

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  // const navigate = useNavigate();
  const currentPageLocation = useLocation().pathname;
  const { userData, setUserData } = useUserContext();

  /**********************************************useEffect Hook***********************************************/
  useEffect(() => {
    console.log("useEffect() called");
    console.log("plantId", plantId);
    console.log("Infrastructure : ", inf);
    // console.log("search value is ", search);
    console.log("Current Project :  ", current_project);
    extendTokenExpiration();

    fetchDBdata(plantId, inf, current_project);
    // fetchDivs();
    // fetchUser();
    fetchUserAndRole();

    sendUrllist(urllist);

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
    };

    window.addEventListener("beforeunload", handleOnBeforeUnload);
    //console.log(process.env.REACT_APP_NOT_SECRET_CODE);

    // remember  this is a cleanup function which will be executed before the next execution of the effect or when the component is unmounted.
    //they are treated as options of useEffect
    return () => {
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
    };
  }, []); //useEffect ends here

  // ***************************************************  API  **************************************************
  // const fetchUser = async () => {
  //   let role = "";
  //   try {
  //     const response = await fetch("http://localhost:8081/users/user", {
  //       method: "GET",
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("fetchUser data : ", data);
  //     // setFormData(data.role);
  //     role = data.role;

  //     console.log("Role Test : ", role);
  //     fetchDivs(role);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };
  // const fetchDivs = async (role) => {
  //   try {
  //     console.log("fetchDivs() called");
  //     console.log("Current Page Location: ", currentPageLocation);
  //     console.log("Current userData : ", userData);
  //     // let role = "";
  //     // if (userData.role) {
  //     //   role = userData.role;
  //     // } else {
  //     //   throw new Error("UserRole not found ! ");
  //     // }

  //     const response = await fetch(
  //       `http://localhost:8081/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log("Current Response : ", data);
  //       console.log("Current Divs : ", data.components);
  //       setDivIsVisibleList(data.components);
  //     }
  //   } catch (error) {
  //     console.log("Error in getting divs name :", error);
  //     if (fetchDivs.length === 0) {
  //       navigate("/*");
  //     }
  //     // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
  //     // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
  //     // setOpen(true); // Assuming setOpen is defined elsewhere
  //     // setSearch("");
  //     // setEditRowIndex(null);
  //     // setEditValue("");
  //   }
  // };

  const fetchUserAndRole = async () => {
    console.log("fetchUserAndRole() called");
    const user = await fetchUser();
    if (user) {
      fetchDivsForCurrentPage(user.role);
    }
  };

  const fetchDivsForCurrentPage = async (role) => {
    console.log("fetchDivsForCurrentPage() called ! ");
    //fetchDivs(userData,location,currentPageLocation);
    const divs = await fetchDivs(location, currentPageLocation, role);
    console.log("Response for divs : ", divs);
    if (divs) {
      setDivIsVisibleList(divs);
      if (divs.length === 0) navigate("/*");
      return;
    }
    console.log("Components not found ! ");
    navigate("/*");
  };

  //Database functions  for CRUD operations

  const fetchDBdata = async (plantId, inf, project) => {
    console.log("fetchDBdata() called ");
    console.log("plantID => ", plantId);
    console.log("Infrastructure => ", inf);
    console.log("Project => ", project);
    if (plantId && inf && project) {
      try {
        console.log("fetchDBdata() called ");
        console.log("plant ID => ", plantId);
        console.log("infrastructure => ", inf);
        // const response = await fetch(
        //   `http://localhost:8081/infrastructure/admin/${plantId}/${inf}/issues`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // if (!response.ok) {
        //   throw new Error("Failed to fetch data");
        // }
        const data = await fecthCurrentInfrastructureDetails(
          plantId,
          inf,
          project
        );
        if (data.infraDetails) {
          console.log("issues are => ", data.infraDetails[0].issues);
          setRows(data.infraDetails[0].issues);
          setFilteredRows(data.infraDetails[0].issues);
          setOriginalRows(data.infraDetails[0].issues);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setsnackbarSeverity("errror");
      setSnackbarText("Error in fetching data !");
      setOpen(true);
    }

    console.log("fetchDBdata() ends");
  };

  const deletedataDb = async (issue) => {
    console.log("Issue to be deleted => ", issue);
    console.log(
      "Current Bearer Token => ",
      `Bearer ${localStorage.getItem("token")}`
    );
    // try {
    //   const plantID = plantId.toString();
    //   // const currentIP=`http://192.168.7.18:8082/infrastructure/admin/${plantId}/${inf}/${issue}`
    //   // console.log('IP => ',currentIP);
    //   const response = await fetch(
    //     `http://localhost:8081/infrastructure/admin/issue`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         plantID: plantID,
    //         infrastructureName: inf,
    //         issue: issue,
    //       }),
    //     }
    //   );
    const success = await deleteCurrentInfrastructure(
      plantId,
      inf,
      issue,
      current_project
    );
    try {
      if (success) {
        console.log("Data deleted successfully from DB");

        const updatedRows = rows.filter((row) => row.issue_name !== issue);
        //here database operatiion will be performed
        setRows(updatedRows);
        setFilteredRows(updatedRows);
        setSnackbarText("Deleted successfully !");
        setsnackbarSeverity("success");
        setOpen(true);
        return true;
      } else {
        throw new Error("Failed to delete data");
      }
    } catch (error) {
      setsnackbarSeverity("error");
      setSnackbarText("Database Error !");
      setOpen(true);
      return false;
    }
  };

  const saveEditedDataDb = async (
    newdata,
    prev_issue,
    new_rows,
    foundRow,
    editedValue,
    editedSeverity
  ) => {
    try {
      console.log("prev_issue => ", prev_issue); // Remember the main reference will change even if you try to change the current object values
      console.log("row_data => ", newdata);
      console.log("new Issue", newdata.issue_name);
      console.log("new Severity => ", newdata.severity);
      const json_data = {
        plantID: plantId.toString(),
        infrastructure_name: inf,
        prev_issue: prev_issue,
        new_issue: editedValue.trim(),
        new_severity: editedSeverity,
        project_name: current_project,
      };

      // const response = await fetch(
      //   `http://localhost:8081/infrastructure/admin/issues`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(json_data),
      //   }
      // );

      const success = await saveCurrentModifiedData(json_data);
      if (success) {
        console.log("Data has been updated successfully ! ");
        foundRow.issue_name = editedValue;
        foundRow.severity = editedSeverity;
        // newdata.edited = true;
        setRows(new_rows);
        setFilteredRows(new_rows);
        console.log("Final array  => ", new_rows);
        setSearch("");
        // setOpen(true);

        // Resetting man !!
        setEditRowIndex(null);
        setEditValue("");
        return true;
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      setSearch("");

      // Resetting Data !!
      setEditRowIndex(null);
      setEditValue("");
      setSnackbarText("Database Error !");
      setsnackbarSeverity("error");
      setOpen(true);
      console.log("Current row values  are : ", filteredRows);
      return false;
    }
  };

  const saveInfrastructureDetails = async (data) => {
    try {
      console.log("Data => ", data);
      // await axios.post("/api/infrastructures/" + plantId, data).then((response)=>{
      //     if(response.status === 200){
      //       handleClickAlertClose()
      //       showSuccessMessage("Data has been Saved Successfully")
      //     }else{

      const json_data = {
        plant_id: `${plantId}`,
        infraDetails: [
          {
            infrastructure_name: `${inf}`,
            issues: [data],
          },
        ],
      };
      console.log("Json-Data => ", JSON.stringify(json_data));

      // const response = await fetch(
      //   `http://localhost:8081/infrastructure/admin`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(json_data),
      //   }
      // );
      const success = await saveNewInfrastructure(json_data, current_project);
      if (success) {
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
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error saving Data ", error);
      setSnackbarText("Database Error !");
      setsnackbarSeverity("error");
      setOpen(true);
      setAddIssue("");
      setAddSeverity("");
    }
  };

  /**************************************************************************************************************** */

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
    const regex = /[^A-Za-z0-9 _/]/;
    if (regex.test(addIssue.trim())) {
      setsnackbarSeverity("error");
      setSnackbarText("Special Characters are not allowed ! ");
      setAddissueError(true);
      setOpen(true);
      return;
    }
    if (addIssue.trim() === "" || addIssue === "None") {
      setAddissueError(true);
      setSnackbarText("Fill required data !");
      setsnackbarSeverity("error");
      setOpen(true);
      return;
    }
    if (addSeverity === "None" || addSeverity === "") {
      setDropdownError(true);
      setSnackbarText("Fill required data !");
      setsnackbarSeverity("error");
      setOpen(true);
      return;
    }
    if (addIssue.trim().toLowerCase() === "miscellaneous") {
      setsnackbarSeverity("error");
      setSnackbarText("Miscellaneous keyword is not allowed! ");
      setAddissueError(true);
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
      const newRow = {
        issue_name: addIssue.trim(),
        severity: addSeverity,
      };
      saveInfrastructureDetails(newRow);
    }
  };

  const handleDeleteClick = (row) => {
    console.log("handleDeleteClick() called");
    console.log("Row to delete => ", row.issue_name);

    deletedataDb(row.issue_name);
  };

  const handleSaveClick = async (selected_row, updated_row) => {
    console.log("selected_row : ", selected_row);
    console.log("updated row : ", updated_row);
    const updatedRows = [...rows];
    //console.log('Current =>',updatedRows)
    //updatedRows.find((row) => row.issue_name === issue_name).issue_name = editValue;
    const foundRow = updatedRows.find(
      (row) => row.issue_name === selected_row.issue_name
    );
    if (foundRow) {
      const prev_issue = foundRow.issue_name;
      // foundRow.issue_name = editValue.trim();
      // foundRow.severity = onEditSeverity;
      const new_row_value = updated_row.issue_name;
      const new_row_severity = updated_row.severity;
      const success = await saveEditedDataDb(
        foundRow,
        prev_issue,
        updatedRows,
        foundRow,
        new_row_value,
        new_row_severity
      );
      return success;
    }

    // updatedRows.find((row) => row.issue_name === issue_name).edited = true;
  };

  // const handleCancelClick = (index) => {
  //   // Resetting editRowIndex and editValue
  //   console.log("Cancel clicked");
  //   setEditRequire(false);
  //   setEditRowIndex(null);
  //   setEditValue("");
  //   setSearch("");
  // };

  // const handleSeverityChange = (index, issue_name, event) => {
  //   console.log("handleSeverityChange() called");
  //   console.log("event selection => ", event.target.value);
  //   console.log("id=> ", issue_name);
  //   // const updatedRows = [...rows];
  //   // updatedRows.find((row) => row.issue_name === issue_name).severity = event.target.value;
  //   // console.log("Updated Rows are => ", updatedRows);
  //   // setRows(updatedRows);
  //   setOnEditSeverity(event.target.value);
  //   //setFilteredRows(updatedRows)
  // };

  const handleAddSeverityChange = (event) => {
    setAddSeverity(event.target.value);
  };

  // const handleSearchChange = (event) => {
  //   setSearch(event.target.value);
  //   const currentSearch = event.target.value;
  //   console.log("Search => ", search);

  //   if (currentSearch === "" || currentSearch.length === 0) {
  //     setFilteredRows(rows); //Keeping the  original list of rows
  //   } else {
  //     const updatedRows = [...rows];
  //     const filteredRows = updatedRows.filter((issue) =>
  //       issue.issue_name
  //         .toLowerCase()
  //         .includes(currentSearch.trim().toLowerCase())
  //     );
  //     console.log("Filtered Rows => ", filteredRows);
  //     setFilteredRows(filteredRows);
  //     setEditRowIndex(null);
  //   }
  // };

  // useEffect(() => {
  //   //This useEffect is keeping track of the search whenever it is visible  or not
  //   console.log("useEffect for search");
  //   setClearVisible(search === "" ? false : true);
  // }, [search]);

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

  // const handleAlertClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  // const handleClick = (id) => {
  //   console.log("ID=> " + id);
  // };

  //This filter method will be required later
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

  const handleAddIssueText = (e) => {
    setAddissueError(false);
    setAddIssue(e.target.value);
    const currentAddedIssue = e.target.value;
    const regex = /[^A-Za-z0-9 _/]/;
    if (regex.test(currentAddedIssue.trim())) {
      setsnackbarSeverity("error");
      setSnackbarText("Special Characters are not allowed ! ");
      setAddissueError(true);
      setOpen(true);
      return;
    }
    if (currentAddedIssue.trim().toLowerCase() === "miscellaneous") {
      setsnackbarSeverity("error");
      setSnackbarText("Miscellaneous keyword is not allowed! ");
      setAddissueError(true);
      setOpen(true);
      return;
    }
  };

  const addIssueToCurrentCategory = (selectedCategory, updatedCategory) => {
    console.log("Save to database method called");
    console.log("Selected category : ", selectedCategory);
    console.log("Updated Category : ", updatedCategory);
    const success = handleSaveClick(selectedCategory, updatedCategory);
    return success;
  };

  // For framer motion
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
  // const severityColors = {
  //   critical: "#B80000",
  //   major: "#610C9F",
  //   minor: "#1B3C73",
  // };

  // const severityValues = {
  //   major: "Major",
  //   minor: "Minor",
  //   critical: "Critical",
  // };

  // const onEditseveritydropdown = ["Critical", "Major", "Minor"];

  const customSeverity = ["None", "Critical", "Major", "Minor"];

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
  // const customfilterList = ["All", "Critical", "Major", "Minor"];

  const columns = [
    {
      id: "issue_name",
      label: "Issue Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "severity",
      label: "Severity",
      type: "dropdown",
      canRepeatSameValue: true,
      values: ["Critical", "Major", "Minor"],
    },
  ];

  const urllist = [
    { pageName: "Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    {
      pageName: "Configure Infrastructure",
      pagelink: "/admin/InfrastructureConfigure",
    },
    
  ];

  //************** Returned Component  **************
  return (
    //<AnimatedPage>
    <div>
      <form>
        <Container sx={classes.conatiner}>
          <Box
            boxShadow={2} // Adjust the shadow depth as needed
            p={2} // Optional: Add padding to the box
            borderRadius={2}
          >
            <div id='plant_inf_main' style={{display:'flex',justifyContent:'space-between'}}>
            <div>
            <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
              fontWeight={900}
            >
              Current Infrastructure Category Name : &nbsp;
              <span style={{ color: "red" }}>{inf}</span>
            </Typography>
            </div>
            <div>
            <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
              fontWeight={900}
            >
              Plant ID : &nbsp;
              <span style={{ color: "red" }}>{plantId}</span>
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
              fontWeight={900}
            >
              Project : &nbsp;
              <span style={{ color: "red" }}>{current_project}</span>
            </Typography>
            </div>
            </div>
            <br />
            {/* issue name */}
            {divIsVisibleList &&
              divIsVisibleList.includes("add-issues-selected-category") && (
                <div id="add-issues-selected-category">
                  <Textfield
                    onChange={(e) => handleAddIssueText(e)}
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
                  <Dropdown
                    id={"add-severity"}
                    value={addSeverity}
                    onChange={(event) => handleAddSeverityChange(event)}
                    list={customSeverity}
                    label={"Severity"}
                    error={dropDownError}
                    style={{ width: "110px" }}
                  ></Dropdown>
                  &nbsp;&nbsp;
                  {/* add icon */}
                  <CustomButton
                    color={"primary"}
                    variant={"contained"}
                    onClick={handleAddClick}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                      padding: "15px",
                    }}
                    buttontext={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {" "}
                        Add &nbsp;
                        <AddCircleOutlineOutlinedIcon
                          fontSize="medium"
                          sx={{ color: "white" }}
                        ></AddCircleOutlineOutlinedIcon>
                      </div>
                    }
                  >
                    Add &nbsp;
                    <AddCircleOutlineOutlinedIcon
                      fontSize="large"
                      sx={{ color: "white" }}
                    ></AddCircleOutlineOutlinedIcon>
                  </CustomButton>
                </div>
              )}
          </Box>
          <br />
          <br />
          {/* <motion.div
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: { duration: 2, ease: "easeInOut" },
              fill: { duration: 4, ease: [1, 0, 0.8, 1] },
            }}
          > */}
          {divIsVisibleList &&
            divIsVisibleList.includes("edit-issues-table") && (
              <div id="edit-issues-table">
                <CustomTable
                  rows={filteredRows}
                  columns={columns}
                  setRows={setFilteredRows}
                  savetoDatabse={addIssueToCurrentCategory}
                  deleteFromDatabase={handleDeleteClick}
                  editActive={true}
                  tablename={"Added Issues List"}
                  redirectIconActive={false}
                  isDeleteDialog={true}
                  progressVisible={true}
                ></CustomTable>
              </div>
            )}
          {/* </motion.div> */}
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

      {/* <Snackbar
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
        </Snackbar> */}
      <SnackbarComponent
        openPopup={open}
        setOpenPopup={setOpen}
        dialogMessage={snackbarText}
        snackbarSeverity={snackbarSeverity}
      ></SnackbarComponent>
    </div>
    // </AnimatedPage>
  );
}
