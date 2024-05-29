import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import * as React from "react";

import { ColorModeContext, tokens } from "../../../theme";
//import { useTheme } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from '@mui/material/Skeleton';
import {
  Badge,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router-dom";
import AnimatedPage from "../../../components/animation_/AnimatedPage";
import CustomButton from "../../../components/button/button.component";
import Dropdown from "../../../components/dropdown/dropdown.component";
import SnackbarComponent from "../../../components/snackbar/customsnackbar.component";
import CustomTable from "../../../components/table/table.component";
import Textfield from "../../../components/textfield/textfield.component";
import TicketDialog from "../../../components/ticketdialog/ticketdialog.component";
import { useUserContext } from "../../contexts/UserContext";
import "./modules.application.css";
import Fab from "@mui/material/Fab";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";
import AddIcon from "@mui/icons-material/Add";
//Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { extendTokenExpiration } from "../../helper/Support360Api";
import dayjs from "dayjs";
import LinearProgress from "@mui/material/LinearProgress";
import { useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { fetchApplicationNames, fetchCurrentDivs, fetchCurrentUser, fetchTabData, fetchTabNames, postDatainDB } from "./ApplicationUserApi";
import { RotatingLines } from 'react-loader-spinner'
import RenewMessageComponent from "../../../components/renew/renew.component";
import JSZip from 'jszip';

// import Test12 from "../../resources/images/test12";

 import html2canvas from 'html2canvas';
import { fetchModuleImageMap } from "../../ticketdetails/AllocateTicket";


//The main export starts here....
export default function ApplicationUser({ sendUrllist }) {
  const [value, setValue] = useState("");
  const [appDropdown, setAppDropdown] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [tabsmoduleNames, setTabsModuleNames] = useState([]);
  const [mainData, setMainData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  //For user
  const [issuesDropdown, setIssuesDropdown] = useState([]);
  const [originalIssuesDropdown, setOriginalIssuesDropdown] = useState([]);
  const [userIssue, setUserIssue] = useState("");
  const [userSeverity, setUserSeverity] = useState("");
  const [areaName, setAreaName] = useState("");
  //const [userIssueList, setUserIssueList] = useState([]);
  const [searchDropdownValue, setSearchDropdownValue] = useState("");

  const [miscellaneousInput, setMiscellaneousInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");

  //Modified
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  //for keeping track of the clicked div
  const [selectedDivArea, setSelectedDivArea] = useState({});
  //It will contain the issues for the current module
  const [finalUserInput, setFinalUserInput] = useState([]);

  const [tableIssuesForCurrentDiv, setTableIssuesForCurrentDiv] = useState([]);
  const [originalTableIssues, setOriginalTableIssues] = useState([]);
  const [tableSearchText, setTableSearchText] = useState("");

  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [modalAlertOpen, setModalAlertOpen] = useState(false);

  const [issuedropdownError, setIssueDropDownError] = useState(false);
  const [severityError, setSeverityError] = useState(false);

  const [mainAlert, setMainAlert] = useState(false);

  const severityList = ["Critical", "Major", "Minor"];
  //for Modal height and width
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const modalWidth = isSmallScreen ? "90%" : 760;

  const [superInformationofAllModules, setSuperInformationofAllModules] =
    useState([]);
  const [updatedMainData, setUpdatedMainData] = useState(mainData);
  // const [holdSelectedTableDropdownIssue, setHoldSelectedTableDropdownIssue] =
  //   useState("");
  const [overviewTableData, setOverviewTableData] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [miscellaneousSeverity, setmiscellaneousSeverity] = useState("");
  // const [ additionalMiscellaneousIssueArray,setAdditionalMiscellaneosIssueArray] = useState([]);
  const [miscellaneousRemarks, setmiscellaneousRemarks] = useState("");
  const [additionalMiscellaneousError, setAdditionalMiscellaneousError] =
    useState(false);
  const [
    additionalMiscellaneousSeverityError,
    setAdditionallMiscellaneousSeverityError,
  ] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  //const navigate =useNavigate()
  const [progressVisible, setprogressVisible] = useState(false);

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const navigate = useNavigate();
  const currentPageLocation = useLocation().pathname;

  const { userData, setUserData } = useUserContext();

  const [currentUserData,setCurrentUserData]= useState({})

  // const [disableTabSelection,setDisableTabSelection]=useState(false)

  const abortControllerRef=React.useRef();

  const [isUserUnderSupport,setIsUserUnderSupport]= useState(false);

  // const [currentLoaderModule,setCurrentLoaderModule]=useState("");



  const [zip] = useState(new JSZip());


  //for hidden Image
  const [currentDivData,setCurrentDivData]=useState({})
  const [currentImageData,setCurrentImageData]=useState({})


    //For Screenshot 
    const screenshotRef = React.useRef(null)

  /**************************************    useEffect()   ******************************* */
  useEffect(() => {






    extendTokenExpiration();
    sendUrllist(urllist);
    console.log("useEffect() called ");
    console.log("USER from context : ", userData);
    let plantID = "";
    // if(userData.plantID!=='')
    // {
    //   plantID=userData.plantID
    // }
    if (userData.plantID) {
      plantID = userData.plantID;
      console.log("Current plantID : ", plantID);
      console.log("useEffect() for fetching data for first time....");
      fetchCurrentApplicationNames(plantID);
      //fetchDivs();
      fetchUser();
      setTicketNumber(generateRandomNumber());
    } else {
      console.log('Error in fetching plantId ! ')
      setSnackbarSeverity("error");
      setSnackbarText("Error in fetching details !");
      setMainAlert(true);
    }
  }, []);

  //This useEffect is used to restore the checks in the Image while Tab change
  useEffect(() => {
    console.log("useEffect() for mainData called ");
    console.log("mainData : ", mainData);
    //mainData.forEach(item)
    console.log("finalUserInput", finalUserInput);
    setUpdatedMainData(mainData);
    // const updatedMainData = { ...mainData };
    console.log("mainData.issuesList : ", mainData.issuesList);
    mainData.issuesList &&
      mainData.issuesList.forEach((main) => {
        console.log("Main Loop entered ! ");
        finalUserInput.forEach((user) => {
          console.log("Comparison TOP :", main.top, " ", user.top);
          console.log("Comparison LEFT :", main.left, " ", user.left);
          console.log("Comparison HEIGHT :", main.height, " ", user.height);
          console.log("Comparison WIDTH :", main.width, " ", user.width);
          console.log(
            "Comparison acronym",
            main.selected_coordinates_acronym,
            " ",
            user.selected_coordinates_acronym
          );
          if (
            main.top === user.top &&
            main.left === user.left &&
            main.width === user.width &&
            main.height === user.height &&
            main.selected_coordinates_acronym ===
              user.selected_coordinates_acronym &&
            user.issues.length > 0
          ) {
            console.log("Found Edited Properties");
            main.edited = true;
          } else {
            console.log("Match was not found");
          }
        });
      });
  }, [mainData, finalUserInput]);

  //On Closing the Dialog would update the Overview Table
  const saveUpdatedDataInOverview = () => {
    //The next check i need to make whether the current finalUser based on modulename and update the same
    //i.e first delete the current module data from the array and replace it with the current finalUserInput
    console.log("saveUpdatedDataInOverview() called ");
    console.log("Current Module : ", value);
    // Delete for the current module data if exists in the overview data and reinsert it to keep synchronization across all modules
    // Because at one time user is interacting with one module ...

    let updatedData = [];
    let current_module_name = value;
    // if(overviewTableData.length!==0)
    // {

    console.log("Current overviewTableData : ", overviewTableData);
    const miscellaneous_data = overviewTableData.filter(
      (item) => item.selected_coordinates_acronym === "Miscellaneous"
    );
    console.log("Current miscellaneous data : ", miscellaneous_data);
    const filtered_data = overviewTableData.filter(
      (item) =>
        item.module_name !== current_module_name &&
        item.selected_coordinates_acronym !== "Miscellaneous"
    ); //For the sake of merging the two arrays
    console.log(
      "The overview after being filtered data for the current module =>",
      filtered_data,
      "with size : ",
      filtered_data.length
    );

    console.log("finalUserInput Issues : ", finalUserInput);
    finalUserInput &&
      finalUserInput.forEach((item) => {
        let currentItem = item.issues;
        let current_area = item.selected_coordinates_acronym;
        let current_top = item.top;
        let current_left = item.left;
        let current_height = item.height;
        let current_width = item.width;

        currentItem.forEach((item) => {
          let overviewData = {};
          overviewData.module_name = current_module_name;
          overviewData.issue_name = item.issue_name;
          overviewData.severity = item.severity;
          overviewData.selected_coordinates_acronym = current_area;
          overviewData.top = current_top;
          overviewData.left = current_left;
          overviewData.height = current_height;
          overviewData.width = current_width;
          overviewData.remarks = item.remarks;
          updatedData.unshift(overviewData);
        });
      });

    console.log("The updated data : ", updatedData);
    let mergedArray = [...updatedData, ...filtered_data, ...miscellaneous_data];

    console.log("Final data for overview table : ", mergedArray);
    setOverviewTableData(mergedArray);
    //console.log('Overview Table Data : ',updatedData)
  };

  const saveCurrentTabModuleInformation = () => {
    console.log("saveCurentTabModuleInformation() called ");
    let currentplantID = "";
    if (userData.plantID) {
      currentplantID = userData.plantID;
    } else {
      console.log(
        "PlantId was not found so the current tab information is  not saved !"
      );
      return;
    }
    const PlantID = currentplantID;
    console.log("Current Miscellaneous Issue : ", miscellaneousInput);
    console.log("Current Remarks Issue : ", remarksInput);
    const updatedfinalUserInput = finalUserInput.filter((item) => {
      return item.issues.length > 0;
    });
    let currentObject = {
      plantID: PlantID,
      application_name: dropdownValue,
      module_name: value,
      // "miscellaneous_issues": miscellaneousInput,
      // "remarks": remarksInput,
      ticket_number: ticketNumber,
      status: "open",
      //The case may arise when the issues are blank for the current selection  then only  add it the finaluserInput
      //Two more fields added
      userName:currentUserData.name,
      userEmailId:currentUserData.email,

      issuesList: updatedfinalUserInput,
    };
    console.log("Current  Object: ", currentObject);

    let foundIndex = superInformationofAllModules.findIndex(
      (obj) =>
        obj["plantID"] === PlantID &&
        obj["module_name"] === value &&
        obj["application_name"] === dropdownValue
    );

    if (foundIndex !== -1) {
      console.log("The previous Information has been identified ! ");
      const newArray = JSON.parse(JSON.stringify(superInformationofAllModules));
      console.log(
        "Current copird newArray to set in superInformationofAllModules :",
        newArray
      );
      newArray[foundIndex] = currentObject;
      console.log(
        "The previous information that has been updated is  => ",
        superInformationofAllModules[foundIndex]
      );
      setSuperInformationofAllModules(newArray);
      console.log("Current newArray is : ", newArray);
      return newArray;
    } else {
      console.log(
        "The current object was not present and will be pushed into the array ! "
      );
      const newArray = [...superInformationofAllModules, currentObject];
      console.log("The newArray that has been pushed : ", newArray);
      setSuperInformationofAllModules(newArray);
      return newArray;
    }
  };

  //This function is invoked to restore the previous information while navigating the tabs
  const checkAndRestoreFromSuperInformationofAllModules = (
    module,
    application
  ) => {
    console.log("checkAndRestoreFromSuperInformationofAllModules() called");

    console.log(
      "Current superInformationofAllModules =>",
      superInformationofAllModules
    );
    let currentplantID = "";
    if (userData.plantID) {
      currentplantID = userData.plantID;
    } else {
      console.log(
        "PlantId was not found so the current tab information is  not saved ,Return called!"
      );
      return;
    }
    const plantID = currentplantID;
    const foundIndex = superInformationofAllModules.findIndex(
      (obj) =>
        obj["plantID"] === plantID &&
        obj["module_name"] === module &&
        obj["application_name"] === application
    );

    if (foundIndex !== -1) {
      console.log("Information must have been replaced ....");
      // setRemarksInput(superInformationofAllModules[foundIndex].remarks)
      // console.log('Current setRemarksInput : ',superInformationofAllModules[foundIndex].remarks);
      // setMiscellaneousInput(superInformationofAllModules[foundIndex].miscellaneous_issues)
      // console.log('setMiscellaneousInput : ',superInformationofAllModules[foundIndex].miscellaneous_issues)
      setFinalUserInput(superInformationofAllModules[foundIndex].issuesList);
      console.log(
        "Current setFinalUserInput :  ",
        superInformationofAllModules[foundIndex].issuesList
      );
    } else {
      console.log("Previous User Input was not found hence resetting the data");
      // setRemarksInput("")
      // setMiscellaneousInput("")
      setFinalUserInput([]);
    }
  };

  const handleTabsChange =async (event, newValue) => {
    // setDisableTabSelection(true)
    // setCurrentLoaderModule(newValue)
    console.log('Current New Value : ',newValue)
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    setMainData({});

    console.log("Current Miscellaneous Issue => ", miscellaneousInput);
    saveCurrentTabModuleInformation(); //This is meant to save the information for the current modified information in the current Tab
   

    //Resetting data
    setMiscellaneousInput("");
    setRemarksInput("");
    setFinalUserInput([]);
    setTableIssuesForCurrentDiv([]);
    setOriginalIssuesDropdown([]);
    setmiscellaneousRemarks("");
    setmiscellaneousSeverity("");
    setValue(newValue);
    //Now feed with new data
    const moduleData=await fetchTabData(newValue, dropdownValue,userData,abortControllerRef);
    // if (!mainData) {
    //   setSnackbarSeverity('error')
    //   setSnackbarText('Error ! ')
    //   setMainAlert(true)
    //   return;
    // }
    // setValue(newValue);
    console.log("tab value", newValue);
    if(moduleData)
      setMainData(moduleData)

    checkAndRestoreFromSuperInformationofAllModules(newValue, dropdownValue); // This method is reserved for restoring the previous user I/P based on the current selected module  i.e you only need to set the final userInput because on each div click check is already made in the finalUserInput list

    // Resetting the remarks and miscellaneous is essential
    //changing the final FinaluserInput will handle automatically other useCases
    // setDisableTabSelection(false) //Now the user can select other Tab //This will only happen in the first case because while changing the tabs the mainData is set to blank json
  };

  /* ********************** API ************************** */

  const fetchUser = async () => {
    // let role = "";
    // try {
    //   const response = await fetch("http://localhost:8081/users/user", {
    //     method: "GET",
    //     headers: {
    //       // Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   });
    //   const data = await response.json();
    //   console.log("fetchUser data : ", data);
    //   // setFormData(data.role);
    //   role = data.role;
    //   setCurrentUserData(data);

    //   console.log("Role Test : ", role);
    //   fetchDivs(role);
    // } catch (error) {
    //   console.error("Error fetching user list:", error);
    // }

    const userData = await fetchCurrentUser();
    if (userData) {
      setCurrentUserData(userData);
      console.log("userData : ", userData);
      let role =userData.role;

      //Check for Support Expiration Time 
     
      // const dayjs = require("dayjs");
      const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
      dayjs.extend(isSameOrBefore);
      console.log('Support End date : ',userData.supportEndDate)
       const supportExpiryDate=dayjs(userData.supportEndDate).add(30,'day');
      console.log("Current User Support End Date , after adding grace period :", supportExpiryDate.format("YYYY-MM-DD"));
      
      const currentDate = dayjs();
      console.log("Current Date:", currentDate.format("YYYY-MM-DD"));
      
      const isUnderSupport = currentDate.isSameOrBefore(supportExpiryDate, 'day');
      console.log("Is under Support?", isUnderSupport);
      setIsUserUnderSupport(isUnderSupport)
      

      //Will give a grace period of one month 
     


      const currentDivs= await fetchCurrentDivs(role,currentPageLocation)
      if(currentDivs)
        {
          console.log("currentDivs : ", currentDivs);
             if (currentDivs.length === 0) {
                navigate("/*");
              }
        setDivIsVisibleList(currentDivs.components);
      }
    }
  };
  // const fetchDivs = async (role) => {
  //   //let role = "";
  //   try {
  //     console.log("fetchDivs() called");
  //     console.log("Current Page Location: ", currentPageLocation);
  //     // console.log("Currently passed Data : ",location.state)
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

  const fetchCurrentApplicationNames = async (PlantID) => {
    console.log("fetchCurrentApplicationNames() called");
    const data = await fetchApplicationNames(PlantID);
    if (data === 403) {
      navigate("/*");
      return;
    } else if (data) {
      data.unshift("Select an application");
      setAppDropdown(data);
      setDropdownValue("Select an application");
    } else {
      console.log("Application name not found ! ");
    }
  };

  // const fetchApplicationNames = async (plantID) => {
  //   const currentIP = process.env.REACT_APP_SERVERIP;
  //   console.log("env : ", currentIP);
  //   console.log("Current user : ", userData);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8081/application/user/${plantID}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       if (response.status === 403) {
  //         navigate("/*");
  //       }
  //       throw new Error("Failed to fetch data");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       console.log("Data from Database : ", data);
  //       data.unshift("Select an application");
  //       setAppDropdown(data);
  //       setDropdownValue("Select an application");
  //     }
  //   } catch (error) {
  //     console.log("Error fetching data ", error);
  //   }
  //   setTabsModuleNames([]);
  // };

  const fetchTabs = async (dropdownvalue) => {
    if (dropdownvalue === "Select an application") {
      setTabsModuleNames([]);
      return;
    }
    // setDisableTabSelection(true)

    const tabData= await fetchTabNames(dropdownvalue,userData)
    if (tabData) {
      console.log("Data from Database : ", tabData);
      setTabsModuleNames(tabData);
      setValue(tabData[0]);
      // setCurrentLoaderModule(tabData[0])
      //further a function will be called to set the image data here
      console.log('UserData : ',userData)
      const moduleData=await fetchTabData(tabData[0], dropdownvalue,userData,abortControllerRef);
      console.log('Current Module Data :  ',moduleData)
      if(moduleData)
        setMainData(moduleData);

      // setDisableTabSelection(false)
    }
    else
    {
      setTabsModuleNames([]);
      navigate("/notfound");
    }
  } 


  // const fetchTabs = async (dropdownvalue) => {
  //   if (dropdownvalue === "Select an application") {
  //     setTabsModuleNames([]);
  //     return;
  //   }
  //   console.log("fetchTabsData() called ! ");
  //   try {
  //     console.log("Current Dropdown selection : ", dropdownvalue);
  //     let plantID = "";
  //     if (userData.plantID) {
  //       plantID = userData.plantID;
  //     } else {
  //       throw new Error("PlantID not found ! ");
  //     }
  //     const response = await fetch(
  //       `http://localhost:8081/application/user/${plantID}/${dropdownvalue}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       console.log("Data from Database : ", data);
  //       setTabsModuleNames(data);
  //       setValue(data[0]);
  //       //further a function will be called to set the image data here
  //       fetchTabData(data[0], dropdownvalue);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching data ", error);
  //     setTabsModuleNames([]);
  //     navigate("/notfound");
  //   }
  // };

  // const fetchTabData = async (module, application) => {
  //   console.log("fetchTabData() called");
  //   console.log("Tab Value : ", module);
  //   console.log("Current Application : ", application);
  //   let plantID = "";

  //   try {
  //     if (userData.plantID) {
  //       plantID = userData.plantID;
  //     } else {
  //       throw new Error("PlantID not found ! ");
  //     }
  //     if (application === "" || module === "") {
  //       throw new Error("Module or Application Names are blank ");
  //     }
  //     console.log(
  //       "Current API call : ",
  //       `http://localhost:8081/application/user/${plantID}/${application}/${module}`
  //     );
  //     const API = `http://localhost:8081/application/user/${plantID}/${application}/${module}`;
  //     const response = await fetch(API, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       setMainData(data);
  //       console.log("Current Tab Data : ", data);
  //       // const issuesList=data.issuesList;
  //     }
  //   } catch (error) {
  //     console.log("error occurred");
  //   }
  // };

  // const postDatainDB = async (json_data) => {
  //   console.log("postDatainDB() called");
  //   console.log("current JSON_data is => ", JSON.stringify(json_data));
  //   try {
  //     const response = await fetch(`http://localhost:8081/application/user`, {
  //       method: "POST",

  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },

  //       body: JSON.stringify(json_data),
  //     });
  //     if (response.ok) {
  //       console.log("Data has been updated successfully ! ");
  //       return true;
  //     }
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //   } catch (error) {
  //     console.log("Error in posting Data to the database : ", error);
  //     setSnackbarSeverity("error");
  //     setSnackbarText("Error in Database  Connection ");
  //     setMainAlert(true);
  //     return false;
  //     // return 0;
  //   }
  // };

  /* ******************************************************************** */

  const fetchIssueList = (area) => {
    //Fetching the issues
    let issueArray = [];
    if (mainData && mainData.issuesList) {
      console.log("Fetching IssueList");
      mainData.issuesList.forEach((data) => {
        if (
          data.top === area.top &&
          data.left === area.left &&
          data.width === area.width &&
          data.height === area.height
        ) {
          data.issues.forEach((issue) => {
            issueArray.push(issue.issue_name);
          });
          //Current Selected AREA
          setAreaName(
            " " +
              dropdownValue +
              " / " +
              value +
              " / " +
              data.selected_coordinates_acronym
          );
        }
      });
    }
    if (issueArray.length === 0) {
      console.log("No Issues Found in this Area");
    }
    console.log("Issues for this coordinates => ", issueArray);
    setIssuesDropdown(issueArray);
    setOriginalIssuesDropdown(issueArray);
  };

  // const checkForDialog=((event)=>
  // {
  //    console.log(event);
  //    console.log("X : ",event.clientX)
  //    console.log("Y : ",event.clientY)
  // })

  const handleAppDropdownChange = (e) => {
    console.log("Changed value in Dropdown => ", e.target.value);
    if (e.target.value === "Select an application") {
      setDropdownValue(e.target.value);
      setTabsModuleNames([]);

      return;
    } else {
      //Will review it once again
      setDropdownValue(e.target.value);
      fetchTabs(e.target.value);
      setTicketNumber(generateRandomNumber());
      //Resetting Data
      setTabsModuleNames([]);
      setFinalUserInput([]);
      setMiscellaneousInput("");
      setRemarksInput("");
      setSuperInformationofAllModules([]);
      setMainData({});
      setUpdatedMainData({});
      setOverviewTableData([]);
      setSeverityError(false);
      setIssueDropDownError(false);
      //Added
      setmiscellaneousSeverity("");
      setmiscellaneousRemarks("");
    }
  };

  const handleDivClick = (event, area) => {
    setIssueDropDownError(false);
    setSeverityError(false);
    console.log("handleDivClick() called");
    console.log("Area : ", area);
    setUserIssue("");
    setUserSeverity("");
    fetchIssueList(area);
    setSelectedDivArea(area);
    //Checking if the user clicked on the
    //Remember you have to only replace the table columns and nothing else i.e setIssue Dropdown
    checkAndReplacePreviousData(area);
    setOpenDialog(true);
  };

  const onCloseModalCheckEdited = () => {
    console.log("onCloseModalCheckEdited() called ");
    const obj = finalUserInput.find(
      (item) =>
        selectedDivArea.top === item.top &&
        selectedDivArea.left === item.left &&
        selectedDivArea.height === item.height &&
        selectedDivArea.width === item.width &&
        selectedDivArea.selected_coordinates_acronym ===
          item.selected_coordinates_acronym
    );

    if (obj) {
      const issueLength = obj.issues.length;
      if (issueLength === 0) {
        console.log("No issue present for the selected div");
        addEditedPropertyMainData(false);
      } else {
        addEditedPropertyMainData(true);
        console.log("Issue exists");
      }
    } else {
      addEditedPropertyMainData(false);
    }
  };

  // For dialog
  const handleClose = () => {
    setOpenDialog(false);
    saveCurrentTabModuleInformation();
    //on Closing the modal information will be saved for the current session
    onCloseModalCheckEdited();
    //Modigying it from here ....
    saveUpdatedDataInOverview(); // Calling the function to feed the Overview Table ....
    console.log(
      "On Close Dialog superInformationofAllModules => ",
      superInformationofAllModules
    );
    console.log("FinalUserInput : ", finalUserInput);
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: modalWidth,
    maxHeight: "500px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    display: "grid",
  };

  // Methods for invoking the dropdowns change
  const handleModalDropdown = (e) => {
    setUserIssue(e.target.value);
  };

  const handleUserSeverityChange = (e) => {
    setUserSeverity(e.target.value);
  };

  const checkForValidations = () => {
    if (userIssue === "" && userSeverity === "") {
      console.log("Both are blank");
      setIssueDropDownError(true);
      setSeverityError(true);
      setSnackbarText("Fill the required data !");
      setSnackbarSeverity("error");
      setModalAlertOpen(true);
      return true;
    }
    if (userSeverity === "" || userSeverity.length === 0) {
      setSeverityError(true);
      setSnackbarText("Fill the required data !");
      setSnackbarSeverity("error");
      setModalAlertOpen(true);
      return true;
    }
    if (userIssue === "") {
      setIssueDropDownError(true);
      setSnackbarText("Fill the required data !");
      setSnackbarSeverity("error");
      setModalAlertOpen(true);
      return true;
    }
  };

  // For adding issues to the table
  const handleAddUserIssues = (e) => {
    //e.preventDefault();
    e.stopPropagation();
    console.log("handleAddUserIssues() called");
    setIssueDropDownError(false);
    setSeverityError(false);
    if (checkForValidations()) {
      return;
    }
    if (
      tableIssuesForCurrentDiv.some((item) => item.issue_name === userIssue)
    ) {
      setSnackbarText("This issue is already added.");
      setSnackbarSeverity("error");
      setModalAlertOpen(true);
      return;
    }
    console.log("Passed all validations !");

    //console.log('Current Area : ',selectedDivArea)
    //I will make a copy of the area selected and modify the changes so that JSON structure is ready to deliver
    // const currentDiv={...selectedDivArea}
    console.log("Current Selected Issue : ", userIssue);
    console.log("Current Severity : ", userSeverity);
    const updatedArray = [...tableIssuesForCurrentDiv];
    //Modifying
    const issue = {
      issue_name: userIssue,
      severity: userSeverity,
      remarks: remarksInput,
    };
    updatedArray.unshift(issue);

    setTableIssuesForCurrentDiv(updatedArray);
    setOriginalTableIssues(updatedArray);
    console.log("The updated Array is => ", updatedArray);

    handleModalSubmit(updatedArray);
    setUserIssue("");
    setUserSeverity("");
    setRemarksInput("");
    // setSnackbarText("Changes are saved !");
    // setSnackbarSeverity("success");
    // setModalAlertOpen(true);
    //Saving the information for the current session
  };

  // const menuItem={textWrap: 'pretty', textOverflow: "ellipsis",wordWrap:'break'}
  // const[listOpen,setListopen]=useState(false)
  // const handleInputClick = (e) => {
  //   // Prevent the click event from propagating to the parent menu item
  //   e.stopPropagation();
  // };

  //Methods for Searching ....
  const handleDropdownSearch = (event) => {
    //The useState object is issuesDropdown
    // event.stopPropagation()
    event.stopPropagation();
    event.preventDefault();
    console.log("Current Issue Dropdown  Search => ", event.target.value);
    setSearchDropdownValue(event.target.value);
    const currentSearch = event.target.value;
    if (currentSearch === "" || currentSearch.length === 0) {
      setIssuesDropdown(originalIssuesDropdown); //Keeping the  original list of rows
    } else {
      const updatedRows = [...issuesDropdown];
      const filteredRows = updatedRows.filter((issue) =>
        issue.toLowerCase().includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredRows);
      setIssuesDropdown(filteredRows);
    }
  };

  //This has been handled in the Table component made in the components directory
  // const handleTableSearch = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   console.log("handleTableSearch()");
  //   console.log("Current Table Search =>", e.target.value);
  //   setTableSearchText(e.target.value);
  //   console.log("useState value => ", tableSearchText);
  //   const currentSearch = e.target.value;
  //   if (currentSearch === "" || currentSearch.length === 0) {
  //     setTableIssuesForCurrentDiv(originalTableIssues);
  //   } else {
  //     const updatedRows = [...tableIssuesForCurrentDiv];
  //     const filteredRows = updatedRows.filter((issue) =>
  //       issue.issue_name
  //         .toLowerCase()
  //         .includes(currentSearch.trim().toLowerCase())
  //     );
  //     console.log("Filtered Rows => ", filteredRows);
  //     setTableIssuesForCurrentDiv(filteredRows);
  //   }
  // };

  const addEditedPropertyMainData = (booleanValue) => {
    console.log("addEditedPropertyMainData");
    console.log("Current Main Data is : ", mainData);
    mainData.issuesList.forEach((item) => {
      if (
        selectedDivArea.top === item.top &&
        selectedDivArea.left === item.left &&
        selectedDivArea.height === item.height &&
        selectedDivArea.width === item.width &&
        selectedDivArea.selected_coordinates_acronym ===
          item.selected_coordinates_acronym
      ) {
        item.edited = booleanValue;
      }
    });
  };

  // Modal Submit
  const handleModalSubmit = (originalTableIssues) => {
    console.log("handleModalSubmit() called");
    console.log("Area on Submit => ", selectedDivArea);
    console.log("Current User Issue List :", originalTableIssues); // I don't want to send data of the filtered  list
    console.log("The selectedDivArea is : ", selectedDivArea);

    let updateduserIssue = Object.assign({}, selectedDivArea);
    //findandReplaceUserIssueList(userIssueList)
    //The main aim to conseve the JSON parameters
    console.log("The copied data is : ", updateduserIssue);
    if (updateduserIssue.issues) {
      console.log(
        "Property issues of Current Div has been replaced ! and is ready to be pushed in the Final JSON"
      );
      updateduserIssue.issues = originalTableIssues; //Always type issue  as 'issues' for consistency with the Backend
    }
    //Now the objective is to replace it in the Final JSON array where all the issues and the coordinates are bundle up as an object
    findandReplaceUserIssueList(updateduserIssue);
    //The above is an object not an issue list

    // console.log('Final User Issue List => ',userIssueList)
    // finalUserInput.push(userIssueList);
    addEditedPropertyMainData();
  };

  const findandReplaceUserIssueList = (data) => {
    // Check if the object already exists
    console.log("findandReplaceUserIssueList() called");
    const index = finalUserInput.findIndex(
      (item) =>
        data.top === item.top &&
        data.left === item.left &&
        data.height === item.height &&
        data.width === item.width &&
        data.selected_coordinates_acronym === item.selected_coordinates_acronym
    );

    if (index !== -1) {
      // If object exists, update its 'issues' property
      const updatedFinalUserInput = finalUserInput.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            issues: data.issues,
          };
        }
        console.log(
          "Previous user Input must  have been restored for => ",
          item
        );
        return item;
      });
      setFinalUserInput(updatedFinalUserInput);
      console.log("Updated  Final User Input =>", updatedFinalUserInput);
    } else {
      // If object does not exist, push it into finalUserInput
      console.log("The Index was not found hence pushed to the array !");
      setFinalUserInput([...finalUserInput, data]);
      console.log("New Array that has been pushed : =>", [
        ...finalUserInput,
        data,
      ]);
    }
  };

  const checkAndReplacePreviousData = (area) => {
    // Checking for previous data and replacing it
    console.log("checkAndReplacePreviousData() called");
    console.log("Current Area Check => ", area);
    let matchFound = false;
    finalUserInput.forEach((item) => {
      console.log(
        "Selected Area Top : ",
        area.top,
        "Final Json Top : ",
        item.top
      );
      console.log(
        "Selected Area Left : ",
        area.left,
        "Final Json Left : ",
        item.left
      );
      console.log(
        "Selected Area Height : ",
        area.height,
        "Final Json Height : ",
        item.height
      );
      console.log(
        "Selected Area Width : ",
        area.width,
        "Final Json Width : ",
        item.width
      );
      console.log(
        "Selected Area acronym : ",
        area.selected_coordinates_acronym,
        "Final Json acronym : ",
        item.selected_coordinates_acronym
      );
      if (
        area.top === item.top &&
        area.left === item.left &&
        area.height === item.height &&
        area.width === item.width &&
        area.selected_coordinates_acronym === item.selected_coordinates_acronym
      ) {
        console.log("Item Found to replace the previous user Input");
        console.log("Issues to replace  are => ", item.issues);
        setTableIssuesForCurrentDiv(item.issues);
        setOriginalTableIssues(item.issues);
        matchFound = true;
        return; // Exit the loop early
      }
    });
    if (matchFound) {
      console.log("Match has been found !");
      return;
    }
    console.log("Not found so making the table blank");
    const filteredFinalUserInput = finalUserInput.filter(
      (item) => item.issues.length > 0
    );
    setFinalUserInput(filteredFinalUserInput);
    setTableIssuesForCurrentDiv([]);
    setOriginalTableIssues([]);
  };

  const handleDeleteTableClick = (data) => {
    console.log("handleDeleteTableClick Called");
    //modified because while interaction with the table operation i don't want to delete the Miscellaneous data
    //const miscellaneosData=overviewTableData.filter(item=>item.selected_coordinates_acronym==='Miscellaneous');
    const currentDivData = tableIssuesForCurrentDiv.filter(
      (issue) => issue.issue_name !== data.issue_name
    );
    let updatedData = [...currentDivData];
    setTableIssuesForCurrentDiv(updatedData);
    setOriginalTableIssues(updatedData);
    updateFinalIssueData(updatedData);
    // setSnackbarSeverity("success");
    // setSnackbarText("Data deleted successfully !");
    setModalAlertOpen(true);
    const filteredFinalUserInput = finalUserInput.filter(
      (item) => item.issues.length > 0
    );
    console.log(
      "Current filtered finaluserInputList : ",
      filteredFinalUserInput
    );
    setFinalUserInput(filteredFinalUserInput);
  };

  const updateFinalIssueData = (data) => {
    console.log("updateFinalIssueData() called");
    console.log("The data parameter send is => ", data);
    finalUserInput.forEach((item) => {
      // console.log('Selected Area Top : ',area.top,'Final Json Top : ',item.top)
      // console.log('Selected Area Left : ',area.left,'Final Json Left : ',item.left)
      // console.log('Selected Area Height : ',area.height,'Final Json Height : ',item.height)
      // console.log('Selected Area Width : ',area.width,'Final Json Width : ',item.width)
      // console.log('Selected Area acronym : ',area.selected_coordinates_acronym,'Final Json acronym : ',item.selected_coordinates_acronym)
      if (
        selectedDivArea.top === item.top &&
        selectedDivArea.left === item.left &&
        selectedDivArea.height === item.height &&
        selectedDivArea.width === item.width &&
        selectedDivArea.selected_coordinates_acronym ===
          item.selected_coordinates_acronym
      ) {
        console.log("Item Found to update after deletion");
        console.log("Issues to replace  are => ", item.issues);
        item.issues = data;
        console.log("Updated Item is => ", item.issues);
        return; // Exit the loop early
      }
    });
  };

  // useEffect(()=>
  // {
  //   saveCurrentTabModuleInformation();

  // },[miscellaneousInput,remarksInput])

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 250,
        borderRadius: 20,
        //  paddingRight:'60px'
      },
    },
  };
  const handleFinalReportClick = async () => {
    setprogressVisible(true);
    console.log("handleFinalReportClick() called");
    //Modified
    let currentSuperInformation = saveCurrentTabModuleInformation(); //Remember if the array with the particular value doesn't exist how will i ever change the value inside  it, I cannot replace a const array but definitely can change the value inside one of the array Index value  but in usestate while runtime if you set something and expect to get the set value , it won't be possible
    console.log(
      "Information in the superInformationofAllModules",
      currentSuperInformation
    );
    // console.log('Current Miscellaneous  Information : ',overviewTableData.find((item)=>item.selected_coordinates_acronym==='Miscellaneous') );

    let foundMiscellaneousInformation = overviewTableData.filter((item) => {
      return item.selected_coordinates_acronym === "Miscellaneous";
    });

    console.log("Miscellaneous Information : ", foundMiscellaneousInformation);

    let updatedInformation = [...currentSuperInformation];

    updatedInformation.forEach((element) => {
      let current_module = element.module_name;
      console.log("Current Module in the Loop : ", current_module);
      let identified_miscellaneous = foundMiscellaneousInformation.filter(
        (item) => {
          return item.module_name === current_module;
        }
      );
      console.log(
        "Identified miscellaneous Array for the current Module : ",
        current_module,
        "=>",
        identified_miscellaneous
      );
      let miscellaneous_issue_List_current_module = [];
      identified_miscellaneous.forEach((item) => {
        let tempObj = {};
        tempObj.issue_name = item.issue_name;
        tempObj.severity = item.severity;
        tempObj.remarks = item.remarks;
        miscellaneous_issue_List_current_module.push(tempObj);
      });
      let finalObj = {};
      finalObj.top = 0.0;
      finalObj.left = 0.0;
      finalObj.height = 0.0;
      finalObj.width = 0.0;
      finalObj.selected_coordinates_acronym = "Miscellaneous";
      finalObj.issues = miscellaneous_issue_List_current_module;

      //element.issuesList=[...element.issuesList,...finalObj]
      //Modified
      // if(finalObj.issues.length>0)
      // {
      element.issuesList.push(finalObj);
      // }
    });
    // const filter_blank_IssueList = updatedInformation.filter((item) => {
    //   return item.issuesList.length > 0;
    // });
    // console.log(
    //   "filtered Issues without blank issueList ",
    //   filter_blank_IssueList
    // );

    let final_Json = [...updatedInformation];
    // filter_blank_IssueList.forEach((item) => {
    //   let hasNonEmptyIssue = item.issuesList.filter(
    //     (element) => element.issues.length > 0
    //   );
    //   // if(item.selected_coordinates_acronym
    //   //   && item.selected_coordinates_acronym.toLowerCase()==='miscellaneous'
    //   //   && item.issues.length===0
    //   // )
    //   //   {
    //   //     return;
    //   //   }
    //   if (hasNonEmptyIssue) {
    //     console.log('The item that has been pushed : ',item) 
    //     final_Json.push(item);
    //   }
    // });
    //The filteration is done multip[le times because the references are being updated successively....
    final_Json = final_Json.map(data => {
      const nonEmptyIssues = data.issuesList.filter(currentIssueList=>currentIssueList.issues.length>0);
      data.issuesList = nonEmptyIssues;
      return data;
  });
  final_Json=final_Json.filter(item=>item.issuesList.length>0)
  
  console.log("Final Json for POST in handleSubmit() : ", final_Json);
  
    // return;
    if (final_Json.length === 0) {
      setSnackbarSeverity("warning");
      setSnackbarText("Please select an issue to report !");
      setMainAlert(true);
      setprogressVisible(false);
      return;
    }


    //Adding the image Data here 
    console.log('Final Json to Post : ',final_Json)
    // return;

    console.log('Current PlantID : ',final_Json[0].plantID)
    const moduleImageMap=await fetchModuleImageMap(final_Json[0].plantID) 
    // const currentApplicationTicketDetails= await fetchApplicationTicketDetails(ticketNo)



    // final_Json.forEach(async(mainData)=>
    //   {

    //   })
    // console.log(' Current Response for ModuleImage Map : ',moduleImageMap)

    // console.log('Current Application Ticket Details : ',currentApplicationTicketDetails)

    const finalMapModuleImage=new Map()
    if(moduleImageMap)
      {
        for (let key in moduleImageMap) {
          if (moduleImageMap.hasOwnProperty(key)) {
             console.log(key, moduleImageMap[key]);
             finalMapModuleImage.set(key, moduleImageMap[key])
          }
       }
      }
      console.log('Final Map for Module Image : ',finalMapModuleImage)
      let finalTicketDetailsForImage=[];

      if (moduleImageMap)
         {
           final_Json.forEach(data => {
              const currentImage = finalMapModuleImage.get(data.application_name + "=>" + data.module_name);
              console.log('Current key to get : ', data.application_name + "=>" + data.module_name);


              data.issuesList.forEach(current_issue=>
              
                {
                  if(current_issue.selected_coordinates_acronym.toLowerCase()==='miscellaneous')
                    return;
                  const currentImageData={

                    module_image:currentImage,
                    application_name:data.application_name,
                    module_name : data.module_name,
                    top_ :current_issue.top,
                    left_ :current_issue.left,
                    height_ :current_issue.height,
                    width_ :current_issue.width,
                    selected_coordinates_acronym:current_issue.selected_coordinates_acronym

                    
                  }
                  
                  finalTicketDetailsForImage.push(currentImageData)

                }
              )
              // console.log('Current Image : ', currentImage);

            //  data.issueList


      
              // if (currentImage) {
              //     // If condition is met, add newProperty
              //     return {
              //         ...data,
              //         module_image: currentImage
              //     };
              // }
              // return data;
          });
      }

      console.log('finalTicketDetailsForImage after modification : ',finalTicketDetailsForImage)

     const finalBlobData =await processScreenshotsAndDownload(finalTicketDetailsForImage);
     console.log('Final Blob Data : ',finalBlobData);
     const base64Data = await blobToBase64(finalBlobData);

     console.log('Final Base64 string for post in DB : ',base64Data)

     const mainBlobData=base64Data.split(',')[1];


    final_Json=final_Json.map((data)=>
    {
      return {...data,fileContent:mainBlobData}
    })

     console.log('Final JSON for POST with image data : ',final_Json)


      // const returnHere=true;
      // if(returnHere)
      //   return;










    let json_Count = 0;
    try {
      const results = await Promise.all(final_Json.map(async json_data => {
        const success = await postDatainDB(json_data);
        if (success) {
          json_Count++;
        }
      }));
    
      // The rest of your code
    } catch (error) {
      console.error("Error:", error.message);
    }
    
    
    //   )
    console.log("Number of JSON posted => ", json_Count);

    if (json_Count !== final_Json.length) {
      setSnackbarSeverity("error");
      setSnackbarText("Error in raising the ticket !");
      setMainAlert(true);
      setprogressVisible(false);
      return;
    }
    //Resetting Data
    setDropdownValue("Select an application");
    setTabsModuleNames([]);
    setFinalUserInput([]);
    setMiscellaneousInput("");
    setRemarksInput("");
    setSuperInformationofAllModules([]);
    setMainData({});
    setUpdatedMainData({});
    setOverviewTableData([]);
    setSeverityError(false);
    setIssueDropDownError(false);
    setprogressVisible(false);
    if (json_Count === final_Json.length) {
      const ticket = "Ticket raised successfully ! Ticket No - " + ticketNumber;
      setSnackbarSeverity("success");
      setSnackbarText(ticket);
      setMainAlert(true);
      // const ticket="Tiket raised successfully ! Ticket No - "+ticketNumber ;
      setTicketDialogOpen(true);
    } else {
      setSnackbarSeverity("error");
      setSnackbarText("No Tickets were raised");
    }
    setOpen(false);
  };

  const generateRandomNumber = () => {
    const randomNumber = dayjs().format("YYYYMMDDTHHmmssSSS");
    return "A" + randomNumber;
  };



  //For Image Zip methods 
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); //this is the event handler which is called when reader.readAsDataURL(blob) is completed 
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const createFileName = (extension, name) => `${name}.${extension}`;

  const addImageToZip = (image, { name, extension = "jpg" }) => {
    const fileName = createFileName(extension, name);
    zip.file(fileName, image.split(",")[1], { base64: true }); // The blob data is present in the second index
  };

  const downloadZip = () => {
    zip.generateAsync({ type: "blob" })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "images.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((error) => {
        console.error("Error generating zip:", error);
      });
  };

  const takeScreenShot = async (element) => {
    return html2canvas(element, {
      useCORS: true,
      logging: true,
      scale: 1,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    }).then((canvas) => {
      return canvas.toDataURL("image/jpeg", 1.0);
    });
  };

  const prepareScreenshot = async (imgName) => {
    const image = await takeScreenShot(screenshotRef.current);
    console.log("Screenshot Process started!");
    addImageToZip(image, { name: imgName, extension: "jpg" });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const processScreenshotsAndDownload = async (finalTicketDetailsForImage) => {
    try{
      // const arr=['1','2'] //remember to replace with the appropriate name 
      // let i=0;
    for (const data of finalTicketDetailsForImage) {
      console.log("Current Data:", data);
      setCurrentImageData(data);
      await delay(500); 
      await prepareScreenshot([data.application_name,data.module_name,data.selected_coordinates_acronym].join('_'));
      await delay(500);
      // i++;
    }
    // downloadZip();
    const blob = await generateZipBlob();
    console.log('Generated ZIP Blob:', blob);
    return blob;
  }
  catch(error)
  {
      console.log('Error downloading zip : ',error)
  }
  };

  const generateZipBlob = () => {
    return zip.generateAsync({ type: "blob" });
  };




  // const handleAlertClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setModalAlertOpen(false);
  // };

  // const handleMainAlertClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setMainAlert(false);
  // };

  const updateOverviewTable = (item) => {
    let filtered_current_overview = [];
    overviewTableData.forEach((current_element) => {
      console.log(
        "Current Element in Overview Table, Acronym :",
        current_element.selected_coordinates_acronym,
        "getting compared with : ",
        item.selected_coordinates_acronym
      );
      console.log(
        "Current Element in Overview Table, issue name :",
        current_element.issue_name,
        "getting compared with : ",
        item.issue_name
      );
      let first_comparison_factor =
        current_element.selected_coordinates_acronym +
        current_element.issue_name;
      let second_comparison_factor =
        item.selected_coordinates_acronym + item.issue_name;
      if (first_comparison_factor !== second_comparison_factor) {
        filtered_current_overview.push(current_element);
      }
    });
    console.log(
      "Current replaced Overview Table data : ",
      filtered_current_overview
    );
    setOverviewTableData(filtered_current_overview);
  };

  const handleMiscellaneousDelete = (item) => {
    console.log("handleMiscellaneousDelete() called ");
    console.log("Current Miscellaneous Item clicked : ", item);
    const datawithoutmiscellaneous = overviewTableData.filter(
      (data) =>
        data.selected_coordinates_acronym !== item.selected_coordinates_acronym
    );
    console.log(
      "Filterd Array without miscellaneous : ",
      datawithoutmiscellaneous
    );
    const datamiscellaneous = overviewTableData.filter(
      (data) =>
        data.selected_coordinates_acronym === item.selected_coordinates_acronym
    );
    console.log("The filtered miscellaneous  Data is ", datamiscellaneous);
    const filterddatamiscellaneous = datamiscellaneous.filter(
      (data) =>
        data.module_name +
          data.selected_coordinates_acronym +
          data.issue_name !==
        item.module_name + item.selected_coordinates_acronym + item.issue_name
    );
    console.log(
      "The latest data of all miscellaneous issue after deleting : ",
      filterddatamiscellaneous
    );
    //Modified
    //setAdditionalMiscellaneosIssueArray(filterddatamiscellaneous); //I will use this to feed the final JSON while final POST
    // console.log('The latest data of all miscellaneous issue after deleting : ',filterddatamiscellaneous)
    // console.log('The filtered miscellaneous  Data is ',datamiscellaneous);
    // console.log('The array which will be merged finally with the filtered miscellaneous : ',datawithoutmiscellaneous);
    let mergedArray = [
      ...filterddatamiscellaneous,
      ...datawithoutmiscellaneous,
    ];
    console.log("The final merged Array  => ", mergedArray);
    setOverviewTableData(mergedArray);
    setSnackbarSeverity("success");
    setSnackbarText("Data deleted successfully !");
    setMainAlert(true);
  };

  const handleOverviewDeleteClick = (item) => {
    console.log("handleOverviewDeleteClick() called");
    console.log("Current selected click : ", item);
    // Object.entries(item).forEach(([key, val]) => {
    //   // console.log(key); // the name of the current key.
    //   // console.log(val); // the value of the current key.

    // });
    //First checking if the user has selected to delete an item with respect to the current module itself
    console.log("Current Module Name : ", value);
    console.log("Current Overview Table Data : ", overviewTableData);
    console.log("Current finalUserInput : ", finalUserInput);
    console.log("Current updatedMainData", updatedMainData);
    console.log(
      "Current superinformation of all modules : ",
      superInformationofAllModules
    );
    //const filtered_current_overview=[]

    //handling the miscellaneous case
    if (item.selected_coordinates_acronym === "Miscellaneous") {
      console.log("Current Click is type Miscellaneous");
      handleMiscellaneousDelete(item);
      return;
    }

    if (item.module_name === value) {
      console.log("The operation is happening in the current module ");
      updateOverviewTable(item);
      setSnackbarText("Data deleted successfully ! ");
      setSnackbarSeverity("success");
      setMainAlert(true);

      //Allright first step is to modify the finalUserinput for the current module

      let updated_finalUserInput = finalUserInput;
      updated_finalUserInput.forEach((userInput) => {
        let current_acronym = userInput.selected_coordinates_acronym;
        let updated_issues = userInput.issues.filter((current_issue) => {
          return (
            current_acronym + current_issue.issue_name !==
            item.selected_coordinates_acronym + item.issue_name
          );
        });
        userInput.issues = updated_issues;
      });

      console.log(
        "Updated finalUserInput after deletion from the overview table : ",
        updated_finalUserInput
      );
      setFinalUserInput(updated_finalUserInput);

      let modifiedIconUpdatedMainArray = updatedMainData;
      modifiedIconUpdatedMainArray.issuesList.forEach((currentItem) => {
        let current_acronym = currentItem.selected_coordinates_acronym;
        updated_finalUserInput.forEach((userInput) => {
          if (userInput.selected_coordinates_acronym === current_acronym) {
            if (userInput.issues.length > 0) {
              currentItem.edited = true;
            } else {
              currentItem.edited = false;
            }
          }
        });
      });

      console.log(
        "Current Modified Array for edited icon : ",
        modifiedIconUpdatedMainArray
      );
      setUpdatedMainData(modifiedIconUpdatedMainArray);
      // saveCurrentTabModuleInformation()
      console.log("Data must have been updated in Overview Table ");
      //Will call a method to replace the check in case the current finalUserInput by passing it as a parameter to the said function
    } else {
      console.log(
        "User Clicked an issue which is not a part of the current module"
      );

      let upDatedsuperinformationofAllModules = superInformationofAllModules;

      let foundModule = upDatedsuperinformationofAllModules.find(
        (module) => module.module_name === item.module_name
      );
      if (foundModule) {
        console.log(
          "module has been identified that existed in superinformationofAllmodules"
        );
        console.log(foundModule);

        let current_issueList = foundModule.issuesList.find(
          (list) =>
            list.selected_coordinates_acronym ===
            item.selected_coordinates_acronym
        );
        if (current_issueList) {
          console.log(
            "IssueList that has been identified : ",
            current_issueList
          );
          const filteredIssues = current_issueList.issues.filter((issues) => {
            return issues.issue_name !== item.issue_name;
          });
          console.log("Filtered Issues: ", filteredIssues);
          current_issueList.issues = filteredIssues;
          if (filteredIssues.length === 0) {
            current_issueList = [];
          }
        }
      }
      setSuperInformationofAllModules(upDatedsuperinformationofAllModules);
      updateOverviewTable(item);
      setSnackbarText("Data deleted successfully ! ");
      setSnackbarSeverity("success");
      setMainAlert(true);

      console.log(
        " Updated superinformationofAllMsdules : ",
        upDatedsuperinformationofAllModules
      );
    }

    // console.log('Current Final USerInput : ',finalUserInput)
  };

  const handleAdditionalMiscellaneous = () => {
    console.log("handleAdditionalMiscellaneous() called");
    console.log("Current overview Table : ", overviewTableData);
    console.log("Current Module : ", value);
    //Check for validations
    setAdditionalMiscellaneousError(false);
    setAdditionallMiscellaneousSeverityError(false);
    if (miscellaneousInput === "" && miscellaneousSeverity === "") {
      setAdditionalMiscellaneousError(true);
      setAdditionallMiscellaneousSeverityError(true);
      setSnackbarSeverity("error");
      setSnackbarText("Fill the required data ! ");
      setMainAlert(true);
      return;
    }

    if (miscellaneousInput === "") {
      setAdditionalMiscellaneousError(true);
      setSnackbarSeverity("error");
      setSnackbarText("Fill the required data ! ");
      setMainAlert(true);
      return;
    }

    if (miscellaneousSeverity === "") {
      setAdditionallMiscellaneousSeverityError(true);
      setSnackbarSeverity("error");
      setSnackbarText("Fill the required data ! ");
      setMainAlert(true);
      return;
    }

    let overviewData = {};
    overviewData.module_name = value;
    overviewData.issue_name = miscellaneousInput;
    overviewData.severity = miscellaneousSeverity;
    overviewData.selected_coordinates_acronym = "Miscellaneous";
    overviewData.top = 0.0;
    overviewData.left = 0.0;
    overviewData.height = 0.0;
    overviewData.width = 0.0;
    overviewData.remarks = miscellaneousRemarks;

    let currentoverview = overviewTableData;
    currentoverview.unshift(overviewData);
    setOverviewTableData(currentoverview);
    console.log("The current pushed data is : ", currentoverview);
    setmiscellaneousSeverity("");
    setMiscellaneousInput("");
    setmiscellaneousRemarks("");
    setSnackbarSeverity("success");
    setSnackbarText("Issue added Successfully!");
    setMainAlert(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //columns for Table component i.e the Table headers
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
      type: "textbox",
      canRepeatSameValue: true,
      //   values:["Critical","Major","Minor"]
    },
    {
      id: "remarks",
      label: "Remarks",
      type: "textbox",
      canRepeatSameValue: true,
      //   values:["Critical","Major","Minor"]
    },
  ];

  const classes = {
    // conatiner: {
    //   marginTop: "10px",
    // },
    // tablehead: {
    //   fontWeight: "bold",
    //   backgroundColor: "#B5C0D0",
    //   lineHeight:4

    // },
    // textField: {
    //   width: "300px",
    // },
    btn: {
      transition: "0.3s",
      "&:hover": { borderBottomWidth: 0, transform: "translateY(5px)" },
    },
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

  const severityColors = {
    critical: "#B80000",
    major: "#610C9F",
    minor: "#1B3C73",
  };
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  //Dialog

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === "backdropClick") {
      setOpen(false);
    }
    // setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // const handleTicketDialogClose = (event,reason) => {
  //   if (reason && reason === "backdropClick")
  //         return;
  //     setTicketDialogOpen(false);
  //   };

  const overviewTableColumns = [
    {
      id: "module_name",
      label: " Module Name ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "selected_coordinates_acronym",
      label: "Area",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "issue_name",
      label: " Issue Name ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "severity",
      label: " Severity ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "remarks",
      label: " Remarks ",
      type: "textbox",
      canRepeatSameValue: true,
    },
  ];
  const urllist = [
    { pageName: "Home", pagelink: "/user/home" },
    {
      pageName: "Report Application",
      pagelink: "/user/ReportApplication",
    },
  ];
  //const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //for Search Dropdown
  const [searchText, setSearchText] = useState("");
  // const [lastSetValue,setLastSetValue]=useState("");

  const displayedOptions = useMemo(
      () => {
      const searchTextLowerCase = searchText.toLowerCase();
      // console.log('Current Search Text : ',searchTextLowerCase)
      return issuesDropdown.filter(
          option => 
          option.toLowerCase().includes(searchTextLowerCase)
      );
      },
      [searchText, issuesDropdown]
  );

  const isOptionInRange = displayedOptions.some(
      option => option === userIssue
    );
  /*************************************************** Component return ************************************** */
  return (
    <div className="row">
      {mainData.module_image && tabsmoduleNames.length !== 0 && (
        <Fab
          size="large"
          variant="extended"
          color="secondary"
          aria-label="add"
          sx={{ position: "fixed", left: "90%", bottom: "5%" }}
          className="mobileViewFloatBtn"
          onClick={handleClickOpen}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <AddIcon />

            <Typography style={{ marginRight: "14px" }}>Review</Typography>
            <Badge
              badgeContent={overviewTableData.length}
              color="primary"
            ></Badge>
          </div>
        </Fab>
      )}
      <Dialog
        open={open}
        // onClose={(event, reason) => handleCloseDialog(event, reason)}
      >
        <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title='Close' placement="left-start">
  <IconButton
    edge="end"
    color="inherit"
    onClick={() => setOpen(false)}
    aria-label="close"
    disabled={progressVisible}
    
  >
    <CloseIcon />
  </IconButton>
  </Tooltip>
</div>

          <div className="IssueDialog">
            {tabsmoduleNames.length !== 0 && (
              <div>
                <div
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div
                    align="center"
                    style={{
                      flex: 1,
                      overflow: "auto",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        flex: 1,
                      }}
                    >
                      Issues Overview
                    </span>
                    <span
                      style={{
                        color: "#610C9F",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      [{dropdownValue}]{" "}
                    </span>
                  </div>
                  {/* <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "blue",
                      }}
                    >
                      {tabsmoduleNames.length !== 0 && (
                        <CustomButton
                          size={"large"}
                          id={"final-submit"}
                          variant={"contained"}
                          color={"success"}
                          onClick={handleFinalReportClick}
                          style={classes.btn}
                          buttontext={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Raise a Ticket
                              <ArrowRightIcon fontSize="small" />
                            </div>
                          }
                        ></CustomButton>
                      )}
                      &nbsp;
                      {progressVisible && (
                        <CircularProgress
                          color="info"
                          thickness={5}
                          size={20}
                        />
                      )}
                    </div> */}
                </div>
                {/* <Collapse in={expanded} timeout="auto" unmountOnExit> */}

                {/* </Collapse> */}
              </div>
            )}
          </div>
        </DialogTitle>
        <Divider textAlign="left"></Divider>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-slide-description"> */}
          <div>
            {tabsmoduleNames.length !== 0 && (
              <div>
                <CustomTable
                  rows={overviewTableData}
                  columns={overviewTableColumns}
                  setRows={setOverviewTableData}
                  deleteFromDatabase={handleOverviewDeleteClick}
                  style={{
                    borderRadius: 10,
                    maxHeight: 440,
                    maxWidth: 1200,
                  }}
                  isDeleteDialog={false}
                ></CustomTable>
                <br />
                {/* </Collapse> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tabsmoduleNames.length !== 0 && (
                    <CustomButton
                      size={"large"}
                      id={"final-submit"}
                      variant={"contained"}
                      color={"success"}
                      onClick={handleFinalReportClick}
                      style={classes.btn}
                      disabled={progressVisible||overviewTableData.length===0}
                      buttontext={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Raise a Ticket
                          <ArrowRightIcon fontSize="small" />
                        </div>
                      }
                    ></CustomButton>
                  )}
                  &nbsp;
                  {progressVisible && (
                    // <CircularProgress color="info" thickness={5} size={20} />
                    <RotatingLines  
                            visible={true}
                            height="20"
                            width="20"
                            strokeWidth="5" 
                          />
                  )}
                </div>
                <br/>
                
                <center>
                {overviewTableData.length===0&&<Chip label="Please select an issue. " variant="outlined" />}
                </center>
              </div>
            )}
          </div>
          {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Textfield
                id="user-misc-issue"
                label={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Miscellaneous Issue
                  </span>
                }
                multiline={true}
                rows={1}
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
                style={{
                  flex: "1",
                  marginRight: "10px",
                }}
                value={miscellaneousInput}
                onChange={(e) => {
                  setMiscellaneousInput(e.target.value);
                  console.log("Miscellaneous Issue:", e.target.value);
                }}
                error={additionalMiscellaneousError}
              />

              <Textfield
                id="user-misc-remarks"
                label={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Remarks
                  </span>
                }
                multiline
                rows={1}
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
                style={{
                  flex: "1",
                  marginRight: "10px",
                }}
                value={miscellaneousRemarks}
                onChange={(e) => {
                  setmiscellaneousRemarks(e.target.value);
                  console.log("Remarks:", e.target.value);
                }}
              />

              <div>
                <Dropdown
                  style={{ width: "200px", marginRight: "10px" }}
                  id={"modal-severity-dropdown"}
                  list={severityList}
                  label={
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Severity
                    </span>
                  }
                  value={miscellaneousSeverity}
                  onChange={(e) => {
                    setmiscellaneousSeverity(e.target.value);
                    console.log(e.target.value);
                  }}
                  error={additionalMiscellaneousSeverityError}
                />
                <Button
                  size="small"
                  id="miscellaneous-add"
                  variant="contained"
                  color="primary"
                  sx={{
                    height: "50px",
                    width: "80px",
                    borderRadius: "5px",
                    backgroundImage:
                      "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
                  }}
                  startIcon={<AddCircleIcon />}
                  onClick={handleAdditionalMiscellaneous}
                >
                  Add
                  
                </Button>
              </div>
            </div> */}
          {/* </DialogContentText> */}
        </DialogContent>
      </Dialog>
      <AnimatedPage>
        {/* <CustomDropDown>
    </CustomDropDown> */}

        <Box
          // mt={2}
          // ml={2}
          // mr={2}
          // mb={2}
          // sx={{
          //   // typography: "body1",
          //   boxShadow: "0px 3px 5px black",
          //   borderRadius: "10px",
          // }}
          className="mainPage"
        >
          <br></br>
          <center>
            {divIsVisibleList &&
              divIsVisibleList.includes("app-dropdown-selection") && isUserUnderSupport&& (
                <div id="app-dropdown-selection">
                  <Dropdown
                    style={{ width: "200px" }}
                    id={"app-dropdown"}
                    list={appDropdown}
                    label={"Application Name"}
                    value={dropdownValue}
                    onChange={handleAppDropdownChange}
                  ></Dropdown>
                </div>
              )}
            { !isUserUnderSupport&&<RenewMessageComponent/> }
          </center>
          <br />
          <center>
            {/* {tabsmoduleNames.length !== 0 && (
              // <div>
              //   <div
              //     style={{
              //       maxHeight: "400px",
              //       overflowY: "auto",
              //     }}
              //   >
              //     <div
              //       align="center"
              //       style={{
              //         backgroundColor: "red",
              //         padding: "5px",
              //         flex: 1,
              //         overflow: "auto",
              //       }}
              //     >
              //       <span
              //         style={{
              //           fontSize: "14px",
              //           fontWeight: "bold",
              //           flex: 1,
              //         }}
              //       >
              //         Issues Overview
              //       </span>
              //       <span
              //         style={{
              //           color: "#610C9F",
              //           fontSize: "14px",
              //           fontWeight: "bold",
              //         }}
              //       >
              //         [{dropdownValue}]{" "}
              //       </span>
              //       <ExpandMore
              //         expand={expanded}
              //         onClick={handleExpandClick}
              //         aria-expanded={expanded}
              //         aria-label="show more"
              //       >
              //         <ExpandMoreIcon />
                      
              //       </ExpandMore>
              //       <Badge
              //         badgeContent={overviewTableData.length}
              //         color="primary"
              //       >
                     
              //       </Badge>
              //     </div>
              //     <div
              //       style={{
              //         display: "flex",
              //         alignItems: "center",
              //         justifyContent: "center",
              //       }}
              //     >
              //       {tabsmoduleNames.length !== 0 && (
              //         <CustomButton
              //           size={"large"}
              //           id={"final-submit"}
              //           variant={"contained"}
              //           color={"success"}
              //           onClick={handleFinalReportClick}
              //           style={classes.btn}
              //           buttontext={
              //             <div
              //               style={{
              //                 display: "flex",
              //                 alignItems: "center",
              //                 justifyContent: "center",
              //               }}
              //             >
              //               Raise a Ticket
              //               <ArrowRightIcon fontSize="small" />
              //             </div>
              //           }
              //         ></CustomButton>
              //       )}
              //       &nbsp;
              //       {progressVisible && (
              //         <CircularProgress color="info" thickness={5} size={20} />
              //       )}
              //     </div>
              //     &nbsp;
              //   </div>
              //   <Collapse in={expanded} timeout="auto" unmountOnExit>
              //     <Table sx={{ borderRadius: "100px" }}>
              //       <TableBody>
              //         <TableRow colSpan={7}>
              //           <TableCell
              //             align="left"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Module Name </b>
              //           </TableCell>
              //           <TableCell
              //             align="center"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Area </b>
              //           </TableCell>
              //           <TableCell
              //             align="center"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Issue Name </b>
              //           </TableCell>
              //           <TableCell
              //             align="center"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Severity</b>
              //           </TableCell>
              //           <TableCell
              //             align="center"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Remarks</b>
              //           </TableCell>
              //           <TableCell
              //             align="center"
              //             sx={{ backgroundColor: "#B5C0D0" }}
              //           >
              //             <b> Action</b>
              //           </TableCell>
              //         </TableRow>
              //         {overviewTableData.length === 0 && (
              //           <TableRow style={{ backgroundColor: "white" }}>
              //             <TableCell colSpan={6}>No Issues Added...</TableCell>
              //           </TableRow>
              //         )}
              //         {overviewTableData.length > 0 &&
              //           overviewTableData.map((item, index) => (
              //             <TableRow
              //               key={index}
              //               style={{ backgroundColor: "white" }}
              //             >
              //               <TableCell align="left">
              //                 {item.module_name}
              //               </TableCell>
              //               <TableCell align="center">
              //                 {item.selected_coordinates_acronym}
              //               </TableCell>
              //               <TableCell align="center">
              //                 {item.issue_name}
              //               </TableCell>

              //               <TableCell
              //                 align="center"
              //                 style={{
              //                   color:
              //                     severityColors[item.severity.toLowerCase()] ||
              //                     severityColors.minor,
              //                   fontWeight: "bold",
              //                 }}
              //               >
              //                 {item.severity}
              //               </TableCell>
              //               <TableCell align="center">{item.remarks}</TableCell>

              //               <TableCell align="center">
              //                 <Button
              //                   onClick={() => handleOverviewDeleteClick(item)}
              //                 >
              //                   <DeleteIcon
              //                     align="right"
              //                     sx={{ color: "#FE2E2E" }}
              //                   />
              //                 </Button>
              //               </TableCell>
              //             </TableRow>
              //           ))}
              //       </TableBody>
              //     </Table>
              //     <CustomTable
              //       rows={overviewTableData}
              //       columns={overviewTableColumns}
              //       setRows={setOverviewTableData}
              //       deleteFromDatabase={handleOverviewDeleteClick}
              //       style={{ borderRadius: 10, maxHeight: 440, maxWidth: 1200 }}
              //       isDeleteDialog={false}
              //     ></CustomTable>
              //   </Collapse>
              // </div>
            )} */}

            <center>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tabsmoduleNames.length !== 0 && (
                  <CustomButton
                    size={"large"}
                    id={"final-submit"}
                    variant={"contained"}
                    color={"success"}
                    onClick={handleFinalReportClick}
                    style={classes.btn}
                    buttontext={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Raise a Ticket
                        <ArrowRightIcon fontSize="small" />
                      </div>
                    }
                  ></CustomButton>
                )}
                &nbsp;
                {progressVisible && (
                  <CircularProgress color="info" thickness={5} size={20} />
                )}
              </div> */}
            </center>
          </center>

          {tabsmoduleNames.length !== 0 && (
            <TabContext value={value}>
              <Box
                style={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: "10px",
                  backgroundColor: colors.primary[400],
                  display: "flex",
                  justifyContent: "center", // Center the content horizontally
                  alignItems: "center", // Center the content vertically
                }}
                // className="tab"
              >
                <div className="row">
                  <div className="col-md-12">
                    <Tabs
                      onChange={handleTabsChange}
                      value={value}
                      variant="scrollable"
                      textColor="secondary"
                      indicatorColor="secondary"
                      className="mobileViewSection"
                      sx={{
                        "& .MuiTabs-flexContainer": {
                          flexWrap: "wrap",
                        },
                      }}
                    >
                      {tabsmoduleNames.map((module, index) => (
                        <Tab
                          className="tab-names"
                          label={<div>{module}{module===value&&!mainData.module_image&& <RotatingLines  
                            visible={true}
                            height="20"
                            width="20"
                            strokeWidth="5" 
                          />}</div>}
                          value={module}
                          key={index}
                          // disabled={disableTabSelection}
                        ></Tab>
                      ))
                     
                      }
                    {/* {!mainData.module_image&&<Tab
    label={
      <RotatingLines  
        visible={true}
        height="25"
        width="25"
        color="blue" // Change color to blue
        strokeWidth="5" 
      />
    }
    disabled // Make the tab unselectable
    style={{ marginLeft: "auto" }} // Push the tab to the extreme right */}
  {/* />} */}
</Tabs>
                    {/* {!mainData.module_image && (
                      <Box sx={{ width: "100%" }}>
                        <LinearProgress />
                      </Box>
                    )
                    } */}
                  </div>
                </div>
              </Box>
               {!mainData.module_image&&<>
                <Skeleton
  variant="rectangular"
  width="100%" 
  height={1000}
  animation="pulse"
  sx={{ bgcolor: 'grey', borderRadius: 10, mt:'10px' }}
  
/>

                    </>   
                       }
              {mainData.module_image && (
                <>
                  <center>
                    <div
                      className="floating-div"
                      // style={{
                      //   fontWeight: "bold",
                      //   color: "red",
                      //   marginTop: "5px",
                      //   animationName: "floating",
                      //   animationDuration: "3s",
                      //   animationIterationCount: "infinite",
                      //   animationTimingFunction: "ease-in-out",
                      // }}
                    >
                      <Chip label={ <span
                     style={{color:'red'}}
                   >
                     
                     Click on the Image below to add Issue{" "}
                     <KeyboardDoubleArrowDownIcon />
                   </span>} variant="outlined" />
                     
                      {/* <style>
                    {`
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, 10px); }
          100% { transform: translate(0, -0px); }    
        }
        `}
                  </style> */}
                    </div>
                  </center>
                  <br />
                  <Paper elevation={24} square>
                  <Chip label= {<div> <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: "#16FF00" }}
                    />
                    <span style={{fontWeight:'bold'}}> - Indicates Issues have been added </span></div>}variant="outlined" >
                   
                    </Chip>
                  </Paper>
                 

                  <motion.div
                    variants={icon}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      default: { duration: 2, ease: "easeInOut" },
                      fill: { duration: 4, ease: [1, 0, 0.8, 1] },
                    }}
                  >
                    <div id="mainDiv" style={{ position: "relative" }}>
                    <div id="showDiv" 
                     style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      zIndex: 2,
                      top: 0,
                       background: colors.primary[400],
                    }}
                    
                    >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      // Note : Don't disturb the inline styling because then the click even is not getting triggered
                      //className="main-image-div"
                    >
                     
                      {mainData.module_image && (
                        <Paper
                          elevation={3}
                          // style={{
                          //   width: "95%",
                          //   height: "95%",
                          //   margin: "auto",
                          //   borderRadius: "40px",
                          // }}
                          className="paper-img-style"
                        >
                          <img
                            src={`data:image/jpeg;base64,${mainData.module_image}`}
                            alt={mainData.module_name}
                            // style={{
                            //   borderRadius: "10px",
                            //   width: "100%",
                            //   height: "100%",
                            //   // userSelect:'none',
                            //   // pointerEvents:'none'
                            // }}
                            className="img-style"
                            // onClick={(e) => checkForDialog(e)}
                          />
                        </Paper>
                      )}
                      {updatedMainData &&
                        updatedMainData.issuesList &&
                        updatedMainData.issuesList.map((area, areaIndex) => (
                          <Tooltip
                            key={areaIndex}
                            title="Click me ! "
                            placement="top-start"
                          >
                            <div
                              onClick={(event) => handleDivClick(event, area)}
                              key={areaIndex}
                              style={{
                                position: "absolute",
                                left: `${area.left * 100}%`,
                                top: `${area.top * 100}%`,
                                width: `${area.width * 100}%`,
                                height: `${area.height * 100}%`,
                                border: "2px solid #2196f3",
                                backgroundColor: "rgba(128, 128, 128, 0.5)",

                                // display: 'flex',
                                // justifyContent: 'center',
                                // alignItems: 'center',
                                // color: 'white',
                                // fontSize: '16px',
                                // fontWeight: 'bold',
                                // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                //transition: 'all 0.3s ease',
                                cursor: "pointer",
                              }}
                              // onMouseEnter={(e) => {
                              //   e.target.style.backgroundColor =
                              //     "rgba(128, 128, 128, 0.5)";
                              //   // e.target.style.filter = "blur(5px)";
                              //   e.target.style.transition =
                              //     "background-color 0.3s, filter 0.3s";
                              // }}
                              // onMouseLeave={(e) => {
                              //   e.target.style.backgroundColor = "rgba(0,0,0,0)";
                              //   e.target.style.filter = "blur(0px)";
                              // }}
                            >
                              {area.edited && (
                                <CheckCircleIcon
                                  // style={{
                                  //   position: "absolute",
                                  //   top: "50%",
                                  //   left: "50%",
                                  //   transform: "translate(-50%, -50%)",
                                  //   color: "#66FF00",
                                  // }}
                                  className="check-icon"
                                  fontSize="small"
                                  // onClick={(e) => {
                                  //   e.stopPropagation();
                                  //   handleDivClick(area); // Call a function to delete the area when delete icon is clicked
                                  // }}
                                />
                              )}
                            </div>
                          </Tooltip>
                        ))}
                        </div>
                    </div>





                    <div
  id="hiddenDiv" 
  //  onLoad={prepareScreenshot} 
  // className={
  //   storedTheme === "light" || storedTheme == null
  //     ? "hideSectionLightMode"
  //     : "hideSectionDarkMode"
  // }
  style={{
    position: "absolute",
    minWidth: "100%",
    minHeight: "100%",
    top: 0,
    //left: 0,
    zIndex: 1,
    overflow: "auto",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    //marginTop :"10rem"
  }}
>
  {/* <img 
    src={"https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg"} 
    alt="demoImg"
    style={{ minWidth: "100%", minHeight: "100%",border:'1px solid red',objectFit: "contain" }}
  /> */}


<div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
          ref={screenshotRef}
        >
          {currentImageData.module_image && (
            <Paper
              elevation={3}
              // className="paper-img-style"
            >
              <img
                src={`data:image/jpeg;base64,${currentImageData.module_image}`}
                // src={demoImagetest}
                alt={currentImageData.module_name}
                style={{ width: "100%", height: "100%" }}
                // onClick={(e) => checkForDialog(e)}
              />
            </Paper>
          )}

          <div
            style={{
              position: "absolute",
              left: `${currentImageData.left_ * 100}%`,
              top: `${currentImageData.top_ * 100}%`,
              width: `${currentImageData.width_ * 100}%`,
              height: `${currentImageData.height_ * 100}%`,
              border: "2px solid #2196f3",
              backgroundColor: "rgba(128, 128, 128, 0.5)",

              cursor: "pointer",
            }}
          />
        </div>
</div>
                    </div>
                  </motion.div>

                  <br />

                  <center>
                    <Container maxWidth="md">
                      <Paper
                        elevation={2}
                        style={{
                          borderRadius: 2,
                          boxShadow: 1,
                          maxHeight: "200px",
                        }}
                      >
                        <center>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: colors.primary[400],
                              padding: "10px",

                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                marginLeft: "20px",
                              }}
                            >
                              Additional Information [
                              <span
                                style={{
                                  color: "#610C9F",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </span>
                              ] :
                            </span>
                          </div>
                          <br></br>
                        </center>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              className="row"
                              style={{
                                alignItems: "center",
                                padding: "0px 12px",
                              }}
                            >
                              <div className="col-md-3">
                                <Textfield
                                  id="user-misc-issue"
                                  label={
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Miscellaneous Issue
                                    </span>
                                  }
                                  multiline={true}
                                  rows={3}
                                  InputProps={{
                                    style: {
                                      borderRadius: "7px",
                                    },
                                  }}
                                  style={{
                                    flex: "1",
                                    marginRight: "10px",
                                    marginBottom: "15px",
                                  }}
                                  value={miscellaneousInput}
                                  onChange={(e) => {
                                    setMiscellaneousInput(e.target.value);
                                    console.log(
                                      "Miscellaneous Issue:",
                                      e.target.value
                                    );
                                  }}
                                  error={additionalMiscellaneousError}
                                />
                              </div>
                              <div className="col-md-3">
                                <Textfield
                                  id="user-misc-remarks"
                                  label={
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Remarks
                                    </span>
                                  }
                                  multiline
                                  rows={3}
                                  InputProps={{
                                    style: {
                                      borderRadius: "15px",
                                    },
                                  }}
                                  style={{
                                    flex: "1",
                                    marginRight: "10px",
                                    marginBottom: "15px",
                                  }}
                                  value={miscellaneousRemarks}
                                  onChange={(e) => {
                                    setmiscellaneousRemarks(e.target.value);
                                    console.log("Remarks:", e.target.value);
                                  }}
                                />
                              </div>
                              <div className="col-md-3">
                                <Dropdown
                                  style={{
                                    width: "180px",
                                    marginRight: "10px",
                                  }}
                                  id={"modal-severity-dropdown"}
                                  list={severityList}
                                  label={
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Severity
                                    </span>
                                  }
                                  value={miscellaneousSeverity}
                                  onChange={(e) => {
                                    setmiscellaneousSeverity(e.target.value);
                                    console.log(e.target.value);
                                  }}
                                  error={additionalMiscellaneousSeverityError}
                                />
                              </div>
                              <div className="col-md-2">
                                <Button
                                  //size="large"
                                  id="miscellaneous-add"
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    height: "50px",
                                    width: "80px",
                                    borderRadius: "10px",
                                    backgroundImage:
                                      "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                                  }}
                                  onClick={handleAdditionalMiscellaneous}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <Textfield
                        id="user-misc-issue"
                        label={
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            Miscellaneous Issue
                          </span>
                        }
                        multiline={true}
                        rows={3}
                        InputProps={{
                          style: {
                            borderRadius: "7px",
                          },
                        }}
                        style={{
                          flex: "1",
                          marginRight: "10px",
                          marginBottom: "15px",
                        }}
                        value={miscellaneousInput}
                        onChange={(e) => {
                          setMiscellaneousInput(e.target.value);
                          console.log("Miscellaneous Issue:", e.target.value);
                        }}
                        error={additionalMiscellaneousError}
                      />

                      <Textfield
                        id="user-misc-remarks"
                        label={
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            Remarks
                          </span>
                        }
                        multiline
                        rows={3}
                        InputProps={{
                          style: {
                            borderRadius: "15px",
                          },
                        }}
                        style={{
                          flex: "1",
                          marginRight: "10px",
                          marginBottom: "15px",
                        }}
                        value={miscellaneousRemarks}
                        onChange={(e) => {
                          setmiscellaneousRemarks(e.target.value);
                          console.log("Remarks:", e.target.value);
                        }}
                      />

                      <div style={{ marginBottom: "40px" }}>
                        <Dropdown
                          style={{ width: "200px", marginRight: "10px" }}
                          id={"modal-severity-dropdown"}
                          list={severityList}
                          label={
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Severity
                            </span>
                          }
                          value={miscellaneousSeverity}
                          onChange={(e) => {
                            setmiscellaneousSeverity(e.target.value);
                            console.log(e.target.value);
                          }}
                          error={additionalMiscellaneousSeverityError}
                        />
                        <Button
                          size="small"
                          id="miscellaneous-add"
                          variant="contained"
                          color="primary"
                          sx={{
                            height: "50px",
                            width: "80px",
                            borderRadius: "10px",
                          }}
                          onClick={handleAdditionalMiscellaneous}
                        >
                          Add
                        </Button>
                      </div>
                    </div> */}
                      </Paper>
                    </Container>
                  </center>
                </>
              )}

              {/* {test} */}
              <br />
              <br />
            </TabContext>
          )}

          <Dialog
            maxWidth="lg"
            //fullScreen="true"
            keepMounted
            open={openDialog}
            onClose={handleClose}
          >
            <DialogTitle sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                Selected Area [
                <span
                  style={{
                    color: "#610C9F",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginTop: "1rem",
                  }}
                >
                  {areaName} ] :
                </span>
              </Typography>
            </DialogTitle>
            <Divider textAlign="left"></Divider>

            <DialogContent>
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <FormControl style={{ minWidth: 200, maxWidth: 200 }}>
                    <InputLabel id="search-select-label">
                      {"Issue Name"}
                    </InputLabel>
                    <Select
                      required
                      // MenuProps={{ MenuProps }}
                      labelId="search-select-label"
                      id="search-select"
                      // disabled={disabled}
                      // value={selectedOption}
                      value={isOptionInRange ? userIssue : ""} // because within the range of values if that particular value is not present , warning will occur
                      label={"Issue Name"}
                      onChange={handleModalDropdown}
                      onClose={() => setSearchText("")}
                      error={issuedropdownError}
                      // This prevents rendering empty string in Select's value
                      // if search text would exclude currently selected option.
                      renderValue={(selected) => {
                        const selectedItem = displayedOptions.find(
                          (option) => option.userValue === selected
                        );
                        if (selectedItem) {
                          return (
                            // <span>
                            //   <span style={{ fontWeight: "bold" }}>{selectedItem.userName}</span>{" "}
                            //   {selectedItem.userValue}
                            // </span>
                            { selectedItem }
                          );
                        } else {
                          return selected;
                        }
                      }}
                    >
                      {/* TextField is put into ListSubheader so that it doesn't
                act as a selectable item in the menu
                i.e. we can click the TextField without triggering any selection.*/}
                      <ListSubheader>
                        <TextField
                          fullWidth
                          size="small"
                          // Autofocus on textfield
                          autoFocus
                          placeholder="Type to search..."
                          //   fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) => {
                            // selectedOption='';
                            setSearchText(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                              // Prevents autoselecting item while typing (default Select behaviour)
                              e.stopPropagation();
                            }
                          }}
                        />
                      </ListSubheader>
                      {displayedOptions.length > 0 &&
                        displayedOptions.map((itm, index) => (
                          <MenuItem key={index} value={itm}>
                            {/* <span style={{ fontWeight: "bold" }}>
                                {itm.userName}
                                </span>
                                {" " + itm.userValue} */}
                            {itm}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  &nbsp;&nbsp;
                  <Dropdown
                    style={{ minWidth: 200, maxWidth: 200 }}
                    id={"modal-severity-dropdown"}
                    list={severityList}
                    label={"Severity"}
                    value={userSeverity}
                    onChange={handleUserSeverityChange}
                    error={severityError}
                  ></Dropdown>
                  &nbsp;&nbsp;
                  <Textfield
                    id="user-remarks"
                    label={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Remarks
                      </span>
                    }
                    // multiline
                    // rows={3}
                    // style={{ flex: 1, marginRight: '10px',marginLeft: '10px', marginBottom:'10px' }}
                    value={remarksInput}
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setRemarksInput(e.target.value);
                    }}
                    multiline={true}
                    rows={1}
                  />
                  &nbsp;&nbsp;
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      height: "50px",
                      padding: "0px 10px",
                      borderRadius: "5px",
                      backgroundImage:
                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
                    }}
                    onClick={handleAddUserIssues}
                    //onClick={handleAddClick
                    startIcon={<AddCircleIcon />}
                  >
                    Add
                  </Button>
                </div>
                <br />

                <div>
                  {/* <Container 
      sx={{maxHeight:300,maxWidth:300}}
      > */}

                  {tableIssuesForCurrentDiv.length !== 0 && (
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        borderRadius: "5px",
                      }}
                    >
                      <CustomTable
                        rows={tableIssuesForCurrentDiv}
                        columns={columns}
                        setRows={setTableIssuesForCurrentDiv}
                        deleteFromDatabase={handleDeleteTableClick}
                        editActive={false}
                        tablename={"Added Issues"}
                        redirectIconActive={false}
                        isDeleteDialog={false}
                      ></CustomTable>
                    </div>
                  )}

                  {/* )} */}
                </div>

                <SnackbarComponent
                  openPopup={modalAlertOpen}
                  setOpenPopup={setModalAlertOpen}
                  dialogMessage={snackbarText}
                  snackbarSeverity={snackbarSeverity}
                ></SnackbarComponent>
                <br></br>
              </>
            </DialogContent>
          </Dialog>

          <SnackbarComponent
            openPopup={mainAlert}
            setOpenPopup={setMainAlert}
            dialogMessage={snackbarText}
            snackbarSeverity={snackbarSeverity}
          ></SnackbarComponent>

          {/* Ticket Dialog  */}
          <TicketDialog
            ticketDialogOpen={ticketDialogOpen}
            // handleTicketDialogClose={handleTicketDialogClose}
            setTicketDialogOpen={setTicketDialogOpen}
            ticketNumber={ticketNumber}
          ></TicketDialog>
        </Box>
      </AnimatedPage>
    </div>
  );
}
