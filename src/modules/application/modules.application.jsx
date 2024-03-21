import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CustomDropDown from "./CustomDropDown";

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert, Chip, Collapse, Container, Divider, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TransitionGroup } from 'react-transition-group';
import DeleteIcon from '@mui/icons-material/Delete';
import { maxHeight } from "@mui/system";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ListBox } from 'primereact/listbox';
import CustomTextfield from "./CustomTextfield";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import LabelIcon from '@mui/icons-material/Label';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import Swal from "sweetalert2";
import AnimatedPage from "../AnimatedPage";
import { motion } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';



export default function ApplicationUser() {
  const [value, setValue] = useState("");
  // const [applicationDropdown,setApplicationDropdown]=useState("")

  // const [test,setTest]=React.useState("")

  // const tabValues=["Value1","Value2","Value3"]

  // const appName=["None","Solar360","Green360","SCADA"]

  // const moduleNames=["Plant Overview","Analytical Report","Daily Alarm Report"]
  
  const [appDropdown, setAppDropdown] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [tabsmoduleNames, setTabsModuleNames] = useState([]);
  const [mainData, setMainData] = useState({});
  const [openDialog,setOpenDialog]=useState(false)
  //For user
  const [issuesDropdown,setIssuesDropdown]=useState([])
  const [originalIssuesDropdown,setOriginalIssuesDropdown]=useState([])
  const [userIssue,setUserIssue]=useState("")
  const [userSeverity,setUserSeverity]=useState("")
  const [areaName,setAreaName]=useState("");
  const [userIssueList,setUserIssueList]=useState([]);
  const [searchDropdownValue,setSearchDropdownValue]=useState("")

  const [miscellaneousInput,setMiscellaneousInput]=useState("");
  const [remarksInput,setRemarksInput]=useState("");

  //for keeping track of the clicked div
  const [selectedDivArea, setSelectedDivArea] = useState({});
//It will contain the issues for the current module 
  const [finalUserInput,setFinalUserInput]=useState([])
  
  const [tableIssuesForCurrentDiv,setTableIssuesForCurrentDiv]=useState([])
  const[originalTableIssues,setOriginalTableIssues]=useState([])
  const [tableSearchText,setTableSearchText]=useState("");

  const [snackbarText,setSnackbarText]=useState("")
  const  [snackbarSeverity,setSnackbarSeverity]=useState("")
  const [modalAlertOpen,setModalAlertOpen]=useState(false);

  const[issuedropdownError,setIssueDropDownError]=useState(false)
  const [severityError,setSeverityError]=useState(false)

  const [mainAlert,setMainAlert]=useState(false)

  const severityList=["Critical","Major","Minor"]

  const theme = useTheme();
  const isSmallScreen = useMediaQuery( theme.breakpoints.down('sm'));
  const modalWidth = isSmallScreen ? '90%' : 550;

  const [superInformationofAllModules,setSuperInformationofAllModules]=useState([])
  const [updatedMainData, setUpdatedMainData] = useState(mainData);
  const [holdSelectedTableDropdownIssue,setHoldSelectedTableDropdownIssue]=useState('');
  const [overviewTableData,setOverviewTableData]=useState([]);
  const [ticketNumber,setTicketNumber]=useState("");
  const [copyMiscellaneous,setCopyMiscellanous]=useState("");
  const [copyRemarks,setCopyRemarks]=useState("");
  const [expanded, setExpanded] = useState(false);



    //On close getting called so 
    const saveUpdatedDataInOverview=(()=>
    {
      //The next check i need to make whether the current finalUser based on modulename and update the same 
      //i.e first delete the current module data from the array and replace it with the current finalUserInput
      console.log('saveUpdatedDataInOverview() called ')
      console.log('Current Module : ',value)
      //Delete for the current module data if exists in the overview data and reinsert it to make synchronization across all modules 
      // Because at one time user is interacting with one module ...
  
      let updatedData=[];
      let current_module_name=value;
      // if(overviewTableData.length!==0)
      // {
      const filtered_data=overviewTableData.filter(item=>item.module_name !==current_module_name);
      console.log('The overview after being filtered data for the current module =>',filtered_data,'with size : ',filtered_data.length)
      //setOverviewTableData(filtered_data)
      // }
  
      //console.log('final')
      console.log('finalUserInput Issues : ',finalUserInput);
      finalUserInput
      &&finalUserInput
      .forEach( item=>
        {
          let currentItem=item.issues;
          let current_area=item.selected_coordinates_acronym;
  
          currentItem.forEach(item=>
            {
              let overviewData={}
              overviewData.module_name=current_module_name
              overviewData.issue_name=item.issue_name;
              overviewData.severity=item.severity;
              overviewData.selected_coordinates_acronym=current_area;
              updatedData.unshift(overviewData)
            })
            
        })
  
        console.log('The updated data : ',updatedData)
        let mergedArray = [...updatedData, ...filtered_data];
  
       console.log('Final data for overview table : ',mergedArray)
        setOverviewTableData(mergedArray)
        //console.log('Overview Table Data : ',updatedData)
    })
  

  const saveCurrentTabModuleInformation=((info)=>
  {
    console.log('saveCurentTabModuleInformation() called ')
    const PlantID='P009'
    // const fetchMiscellaneousInput=info.miscellaneousInput && info.miscellaneousInput ?info.miscellaneousInput:''
    // const fetchRemarks=info.remarks&& info.remarks?info.remarks:'';
    // let fetchMiscellaneousInput='';
    // let fetchRemarks='';
    // if(info)
    // {
    //   if(info.miscellaneousInput)
    //   {
    //     console.log('Miscellaneous Incoming : ',info.miscellaneousInput);
    //     fetchMiscellaneousInput=info.miscellaneousInput;
    //   }
    //   else{
    //     fetchMiscellaneousInput=miscellaneousInput;
    //   }
    // if(info.remarks)
    // {
    //   console.log('Remarks Incoming : ',info.remarks);
    //   fetchRemarks=info.remarks;
    // }
    // else
    // {
    //   fetchRemarks=remarksInput;
    // }
    // }
   
    console.log('Current Miscellaneous Issue : ',miscellaneousInput);
    console.log('Current Remarks Issue : ',remarksInput)
    
    let currentObject=
    {
      "plantID":PlantID,
      "application_name": dropdownValue,
      "module_name": value,
      "miscellaneous_issues": miscellaneousInput,
      "remarks": remarksInput,
      "ticket_number": ticketNumber,
      "status": "Open",
      
      "issuesList":finalUserInput
    }
    console.log('Current  Object: ',currentObject)

    let foundIndex = superInformationofAllModules.findIndex(obj => obj["plantID"] === PlantID 
                                                            && obj["module_name"]===value 
                                                            && obj["application_name"]===dropdownValue )
     
    if(foundIndex!==-1)
    {
      console.log('The previous Information has been identified ! ');
      const newArray = JSON.parse(JSON.stringify(superInformationofAllModules));
      console.log('Current copird newArray to set in superInformationofAllModules :',newArray)
      newArray[foundIndex] = currentObject;
      console.log('The previous information that has been updated is  => ', superInformationofAllModules[foundIndex])
      setSuperInformationofAllModules(newArray);
      console.log('Current newArray is : ',newArray)
      return newArray;
    }
    else
    {
        console.log('The current object was not present and will be pushed into the array ! ')
        const newArray = [...superInformationofAllModules, currentObject];
        console.log('The newArray that has been pushed : ',newArray)
        setSuperInformationofAllModules(newArray)
        return newArray;
    }

  })

  const checkAndRestoreFromSuperInformationofAllModules=((module,application)=>
  {
        console.log('checkAndRestoreFromSuperInformationofAllModules() called')

        console.log('Current superInformationofAllModules =>',superInformationofAllModules)
        const plantID = 'P009';
        const foundIndex = superInformationofAllModules.findIndex(obj => obj["plantID"] === plantID
        && obj["module_name"] === module
        && obj["application_name"] === application) 

        if(foundIndex!==-1)
        {
            console.log("Information must have been replaced ....");
            setRemarksInput(superInformationofAllModules[foundIndex].remarks)
            console.log('Current setRemarksInput : ',superInformationofAllModules[foundIndex].remarks);
            setMiscellaneousInput(superInformationofAllModules[foundIndex].miscellaneous_issues)
            console.log('setMiscellaneousInput : ',superInformationofAllModules[foundIndex].miscellaneous_issues)
            setFinalUserInput(superInformationofAllModules[foundIndex].issuesList)
            console.log('Current setFinalUserInput :  ',superInformationofAllModules[foundIndex].issuesList)
        }
        else{
          console.log("Previous User Input was not found hence resetting the data");
          setRemarksInput("")
          setMiscellaneousInput("")
          setFinalUserInput([])
        }





  })


  const handleTabsChange = (event, newValue) => {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    console.log('Current Miscellaneous Issue => ',miscellaneousInput);
    saveCurrentTabModuleInformation(); //This is meant to save the information for the current edit
    //setTest(newValue)
    // console.log('finalUserInput :',finalUserInput)
    // if(finalUserInput.length!==0||miscellaneousInput.length!==0||remarksInput.length!==0)
    // {
    // Swal.fire({
    //   title: "Your Changes will be lost ? ",
    //   showDenyButton: true,
    //   confirmButtonText: "Proceed",
    //   denyButtonText: `Cancel`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
        // Swal.fire("Saved!", "", "success");

        setValue(newValue);
        console.log("tab value", newValue);
       
        //Resetting data
        setMiscellaneousInput("")
        setRemarksInput("");
        setFinalUserInput([]);
        setTableIssuesForCurrentDiv([]);
        setOriginalIssuesDropdown([])
        //Now feed with new data
        fetchTabData(newValue, dropdownValue);

        checkAndRestoreFromSuperInformationofAllModules(newValue,dropdownValue); // This method is reserved for restoring the previous user I/P based on the current selected module  i.e you only need to set the final userInput because on each div click check is already made in the finalUserInput list 

        //dont forget to set the remarks and miscellaneous too 

        //changing the final FinaluserInput will handle automatically other useCases
        
        
  //     }
  //   });

  //   //setSearch('');
  // }
  // else{
  //   console.log("Switched to next Tab ! ");
  //   setValue(newValue);
  //   console.log("tab value", newValue);
  //   fetchTabData(newValue, dropdownValue);
  //   //Resetting on Tab Switch
  //   setMiscellaneousInput("");
  //   setRemarksInput("")
  //   setFinalUserInput([])
  // }
  };

  // const randomFun = (value) => {
  //   console.log(value)
  // }


   

  const fetchApplicationNames = async (plantID) => {
    try {
      const response = await fetch(
        `http://localhost:8082/application/user/${plantID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data) {
        console.log("Data from Database : ", data);
        data.unshift("Select an application");
        setAppDropdown(data);
        setDropdownValue("Select an application");
      }
    } catch (error) {
      console.log("Error fetching data ", error);
    }
    setTabsModuleNames([])



  };

  const fetchTabs = async (dropdownvalue) => {
    if (dropdownvalue === "Select an application") {
      setTabsModuleNames([]);
      return;
    }
    console.log("fetchTabsData() called ! ");
    try {
      console.log("Current Dropdown selection : ", dropdownvalue);
      const plantID = "P009";
      const response = await fetch(
        `http://localhost:8082/application/user/${plantID}/${dropdownvalue}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data) {
        console.log("Data from Database : ", data);
        setTabsModuleNames(data);
        setValue(data[0]);
        //further a function will be called to set the image data here
        fetchTabData(data[0], dropdownvalue);
      }
    } catch (error) {
      console.log("Error fetching data ", error);
      setTabsModuleNames([]);
    }
  };


  const fetchIssueList=((area)=>
  {
     //Fetching the issues
     let issueArray=[];
     if (mainData && mainData.issuesList) {
      console.log('Fetching IssueList')
      mainData.issuesList.forEach(data => {
        
       if(data.top===area.top &&
          data.left===area.left &&
          data.width===area.width &&
          data.height===area.height )
          {
            data.issues.forEach(issue=>
              {
                issueArray.push(issue.issue_name);
              })
              setAreaName(' '+dropdownValue+' / '+value+' / '+data.selected_coordinates_acronym)
          }
        
        
      });
    }
    if(issueArray.length === 0)
    {
      console.log("No Issues Found in this Area");  
    }
    console.log("Issues for this coordinates => ",issueArray)
    setIssuesDropdown(issueArray);
    setOriginalIssuesDropdown(issueArray)
  })

  const fetchTabData = async (module, application) => {
    console.log("fetchTabData() called");
    console.log("Tab Value : ", module);
    console.log("Current Application : ",application)
    const plantID = "P009";
    try {
      if(application===''||module==='')
      {
        throw new Error("Module or Application Names are blank ")
      }
      console.log("Current API call : ", `http://localhost:8082/application/user/${plantID}/${application}/${module}`)
      const API=`http://localhost:8082/application/user/${plantID}/${application}/${module}`
      const response = await fetch(
        API
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data) {
        setMainData(data);
        console.log("Current Tab Data : ", data);
       // const issuesList=data.issuesList;
       
        

      }
    } catch (error) {
      console.log("error occurred");
    }
  };

  // const checkForDialog=((event)=>
  // {
  //    console.log(event);
  //    console.log("X : ",event.clientX)
  //    console.log("Y : ",event.clientY)
  // })

  useEffect(() => {
    console.log("useEffect() called ");
    const plantID = "P009";
    console.log("useEffect() for fetching data for first time....");
    fetchApplicationNames(plantID);
    setTicketNumber(generateRandomNumber())
  }, []);

  useEffect(()=>
  {
    console.log('useEffect() for mainData called ');
    console.log('mainData : ',mainData)
    //mainData.forEach(item)
    console.log('finalUserInput',finalUserInput)
   // const updatedMainData = { ...mainData }; 
   console.log('mainData.issuesList : ',mainData.issuesList)
    mainData.issuesList&& mainData.issuesList.forEach( (main)=>
    {
      console.log('Main Loop entered ! ');
      finalUserInput.forEach( user =>
      {
        console.log('Comparison TOP :' ,main.top,' ',user.top)
        console.log('Comparison LEFT :', main.left,' ',user.left)
        console.log('Comparison HEIGHT :',  main.height,' ',user.height)
        console.log('Comparison WIDTH :', main.width,' ',user.width)
        console.log('Comparison acronym' , main.selected_coordinates_acronym,' ',user.selected_coordinates_acronym
        )
        if(main.top===user.top &&
          main.left===user.left &&
          main.width===user.width &&
          main.height===user.height &&
          main.selected_coordinates_acronym===user.selected_coordinates_acronym

        )
        {
          console.log('Found Edited Properties');
          main.edited=true;
        }
        else
        {
          console.log('Match was not found');
        }
      })

    })
   // setMainData(updatedMainData)
    console.log('Main Data from useEffect () ',mainData)
    setUpdatedMainData(mainData)

  },[mainData,finalUserInput])


  //  useEffect(()=>
  //  {
  //   console.log('useEffect() for dropdown value called ...')
  //   console.log('Current Dropdown value : ',dropdownValue.toString());
  //   if(dropdownValue!=='Select an application'|| dropdownValue.length==0)
  //   {

  //   fetchTabsData();
  //   }
  //   else
  //   {
  //     console.log("No selection was made to populate Tabs i.e Select an Application");
  //     setTabsModuleNames([])
  //   }

  //  },[dropdownValue])

  const handleAppDropdownChange = (e) => {
    console.log("Changed value in Dropdown => ", e.target.value);
    if(e.target.value==='Select an application')
    {
      setDropdownValue(e.target.value);
      setTabsModuleNames([]);
      return;
    }
    else
    {
    setDropdownValue(e.target.value);
    fetchTabs(e.target.value);
    setTicketNumber(generateRandomNumber());
    }
  };

  const handleDivClick=((event,area)=>
  {
    console.log('handleDivClick() called')
    console.log('Area : ',area);
    setUserIssue("");
    setUserSeverity("");
    fetchIssueList(area)
    setSelectedDivArea(area)
    //Checking if the user clicked on the 
    //Remember you have to only replace the table columns and nothing else i.e setIssue Dropdown
    checkAndReplacePreviousData(area)
    setOpenDialog(true)

  })


  const onCloseModalCheckEdited=(()=>
{
  console.log('onCloseModalCheckEdited() called ');
  const obj=finalUserInput.find(item=>selectedDivArea.top === item.top &&
    selectedDivArea.left === item.left &&
    selectedDivArea.height === item.height &&
    selectedDivArea.width === item.width &&
    selectedDivArea.selected_coordinates_acronym === item.selected_coordinates_acronym)


    if(obj)
    {
      const issueLength=obj.issues.length;
      if(issueLength===0)
      {
            console.log("No issue present for the selected div");
            addEditedPropertyMainData(false)
      }
      else
      {
        addEditedPropertyMainData(true)
        console.log("Issue exists");
      }
    }
    else{
      addEditedPropertyMainData(false)
    }
})

  // For dialog
  const handleClose = (() => {
    
    setOpenDialog(false)
    saveCurrentTabModuleInformation()
    //on Closing the modal information will be saved for the current session 
    onCloseModalCheckEdited();
    //Modigying it from here ....
    saveUpdatedDataInOverview();// Calling the function to feed the Overview Table ....
    console.log('On Close Dialog superInformationofAllModules => ',superInformationofAllModules)
    console.log('FinalUserInput : ',finalUserInput)
  
  });

  const modalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: modalWidth,
    maxHeight:'500px',
    bgcolor: 'background.paper', 
   
    boxShadow: 24,
    p: 4,
    borderRadius:5,
    display:'grid'
  };


  // Methods for invoking the dropdowns change
  const handleModalDropdown=((e)=>
  {
    setUserIssue(e.target.value);
  })

  const handleUserSeverityChange=((e)=>
  {
    setUserSeverity(e.target.value);
  })

  const checkForValidations=(()=>
  {
    if(userIssue===''&&userSeverity==='')
    {
      console.log('Both are blank');
      setIssueDropDownError(true)
      setSeverityError(true)
      setSnackbarText("Fill the required data !")
      setSnackbarSeverity("error")
     setModalAlertOpen(true)
     return true;
    }
    if(userSeverity===''||userSeverity.length===0)
    {
      setSeverityError(true)
      setSnackbarText("Fill the required data !")
     setSnackbarSeverity("error") 
     setModalAlertOpen(true)
     return true;
    }
    if(userIssue==='')
    {
      setIssueDropDownError(true)
      setSnackbarText("Fill the required data !")
     setSnackbarSeverity("error") 
     setModalAlertOpen(true)
     return true;
    }

  })
// For adding issues to the table
  const handleAddUserIssues=((e)=>
  {
    //e.preventDefault();
    e.stopPropagation()
    console.log('handleAddUserIssues() called')
    setIssueDropDownError(false)
    setSeverityError(false)
    if(checkForValidations())
    {
      return;
    }
    if (tableIssuesForCurrentDiv.some(item => item.issue_name=== userIssue))
    {
      setSnackbarText("This issue is already added.")
      setSnackbarSeverity("error")   
      setModalAlertOpen(true)  
      return ;
    }
    console.log('Passed all validations !')
    
    
    //console.log('Current Area : ',selectedDivArea)
    //I will make a copy of the area selected and modify the changes so that JSON structure is ready to deliver
   // const currentDiv={...selectedDivArea}
   console.log("Current Selected Issue : ",userIssue);
   console.log("Current Severity : ",userSeverity);
   const updatedArray=[...tableIssuesForCurrentDiv]
   const issue={
    issue_name: userIssue,
    severity: userSeverity
   }
   updatedArray.unshift(issue)

   setTableIssuesForCurrentDiv(updatedArray);
   setOriginalTableIssues(updatedArray);
   console.log("The updated Array is => ",updatedArray)
  
   handleModalSubmit(updatedArray);
   setUserIssue('');
   setUserSeverity('')
   setSnackbarText("Changes are saved !")
   setSnackbarSeverity("success")
   setModalAlertOpen(true)
   //Saving the information for the current session 
   

    


  })
  
 // const menuItem={textWrap: 'pretty', textOverflow: "ellipsis",wordWrap:'break'}
// const[listOpen,setListopen]=useState(false)
// const handleInputClick = (e) => {
//   // Prevent the click event from propagating to the parent menu item
//   e.stopPropagation();
// };

//Methods for Searching ....
const handleDropdownSearch=((event)=>
{
  //The useState object is issuesDropdown
 // event.stopPropagation()
 event.stopPropagation();
 event.preventDefault();
  console.log("Current Issue Dropdown  Search => ",event.target.value)
  setSearchDropdownValue(event.target.value);
  const currentSearch=event.target.value
  if (currentSearch === "" || currentSearch.length === 0) {
    setIssuesDropdown(originalIssuesDropdown);//Keeping the  original list of rows
  } else {
    const updatedRows = [...issuesDropdown];
    const filteredRows = updatedRows.filter((issue) =>
      issue
        .toLowerCase()
        .includes(currentSearch.trim().toLowerCase())
    );
    console.log("Filtered Rows => ", filteredRows);
    setIssuesDropdown(filteredRows)
  }
})

const handleTableSearch=((e)=>
{
  e.stopPropagation();
  e.preventDefault();
  console.log('handleTableSearch()')
  console.log('Current Table Search =>',e.target.value)
  setTableSearchText(e.target.value)
  console.log('useState value => ',tableSearchText);
  const currentSearch=e.target.value
  if (currentSearch === "" || currentSearch.length === 0) {
    setTableIssuesForCurrentDiv(originalTableIssues)
  } else {
    const updatedRows = [...tableIssuesForCurrentDiv];
    const filteredRows = updatedRows.filter((issue) =>
      issue.issue_name
        .toLowerCase()
        .includes(currentSearch.trim().toLowerCase())
    );
    console.log("Filtered Rows => ", filteredRows);
    setTableIssuesForCurrentDiv(filteredRows)
  }

})

const addEditedPropertyMainData=((booleanValue)=>
{
  console.log("addEditedPropertyMainData")
  console.log("Current Main Data is : ",mainData)
  mainData.issuesList.forEach((item)=>
  {
    if( selectedDivArea.top === item.top &&
      selectedDivArea.left === item.left &&
      selectedDivArea.height === item.height &&
      selectedDivArea.width === item.width &&
      selectedDivArea.selected_coordinates_acronym === item.selected_coordinates_acronym)
      {
        // if(item.issues.length>0)
        // {
        //   console.log('Current Issue Items for selectedDivArea ',selectedDivArea, "length",item.issues.length);
        //     item.edited=true;
        // }
        //   else
        //   {
        //     console.log('Made edited false for ',item);
        //   item.edited=false;
        //   }
        item.edited=booleanValue
      }
  })
})


// Modal Submit
const handleModalSubmit=((originalTableIssues)=>
{
  console.log('handleModalSubmit() called');
  console.log("Area on Submit => ",selectedDivArea);
  console.log("Current User Issue List :",originalTableIssues) // I don't want to send data of the filtered  list
  console.log('The selectedDivArea is : ',selectedDivArea)

  let updateduserIssue = Object.assign({}, selectedDivArea); 
  //findandReplaceUserIssueList(userIssueList)
  //The main aim to conseve the JSON parameters
  console.log('The copied data is : ',updateduserIssue);
  if(updateduserIssue.issues)
  {
    console.log('Property issues of Current Div has been replaced ! and is ready to be pushed in the Final JSON');
    updateduserIssue.issues=originalTableIssues; //Always type issue  as 'issues' for consistency with the Backend
  }
  //Now the objective is to replace it in the Final JSON array where all the issues and the coordinates are bundle up as an object
  findandReplaceUserIssueList(updateduserIssue)
  //The above is an object not an issue list

  // console.log('Final User Issue List => ',userIssueList)
  // finalUserInput.push(userIssueList);
  addEditedPropertyMainData();
  



})

const findandReplaceUserIssueList = (data) => {
  // Check if the object already exists
  console.log('findandReplaceUserIssueList() called')
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
          issues: data.issues
        };
      }
      console.log('Previous user Input must  have been restored for => ',item)
      return item;
    });
    setFinalUserInput(updatedFinalUserInput);
    console.log('Updated  Final User Input =>', updatedFinalUserInput);
  } else {
    // If object does not exist, push it into finalUserInput
    console.log('The Index was not found hence pushed to the array !')
    setFinalUserInput([...finalUserInput, data]);
    console.log('New Array that has been pushed : =>', [...finalUserInput, data]);
  }
};

const checkAndReplacePreviousData = (area) => {
  // Checking for previous data and replacing it
  console.log('checkAndReplacePreviousData() called');
  console.log('Current Area Check => ', area);
  let matchFound=false;
  finalUserInput.forEach((item) => {
    console.log('Selected Area Top : ',area.top,'Final Json Top : ',item.top)
    console.log('Selected Area Left : ',area.left,'Final Json Left : ',item.left)
    console.log('Selected Area Height : ',area.height,'Final Json Height : ',item.height)
    console.log('Selected Area Width : ',area.width,'Final Json Width : ',item.width)
    console.log('Selected Area acronym : ',area.selected_coordinates_acronym,'Final Json acronym : ',item.selected_coordinates_acronym)
    if (
      area.top === item.top &&
      area.left === item.left &&
      area.height === item.height &&
      area.width === item.width &&
      area.selected_coordinates_acronym === item.selected_coordinates_acronym
    ) {
      console.log('Item Found to replace the previous user Input');
      console.log('Issues to replace  are => ', item.issues);
      setTableIssuesForCurrentDiv(item.issues);
      setOriginalTableIssues(item.issues)
      matchFound=true;
      return; // Exit the loop early
    }
  });
  if(matchFound)
  {
    console.log('Match has been found !');
    return;
  }
  console.log('Not found so making the table blank');
  const filteredFinalUserInput = finalUserInput.filter(item => item.issues.length > 0);
  setFinalUserInput(filteredFinalUserInput);
  setTableIssuesForCurrentDiv([]);
  setOriginalTableIssues([])

};


const handleDeleteTableClick=((data)=>
{
  console.log("handleDeleteTableClick Called");
    const updatedData=tableIssuesForCurrentDiv.filter(issue=> issue.issue_name!==data.issue_name)
    setTableIssuesForCurrentDiv(updatedData)
    setOriginalTableIssues(updatedData)
    updateFinalIssueData(updatedData)
    setSnackbarSeverity("success")
    setSnackbarText("Data deleted successfully !")
    setModalAlertOpen(true)
    const filteredFinalUserInput = finalUserInput.filter(item => item.issues.length > 0);
    setFinalUserInput(filteredFinalUserInput);
})

const updateFinalIssueData=((data)=>
{
  console.log('updateFinalIssueData() called')
  console.log('The data parameter send is => ',data);
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
      selectedDivArea.selected_coordinates_acronym === item.selected_coordinates_acronym
    ) {
      console.log('Item Found to update after deletion');
      console.log('Issues to replace  are => ', item.issues);
      item.issues=data;
      console.log('Updated Item is => ', item.issues);
      return; // Exit the loop early
    }
  });

})

// useEffect(()=>
// {
//   saveCurrentTabModuleInformation();

// },[miscellaneousInput,remarksInput])


const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      width: 250,
      borderRadius:20,
      //  paddingRight:'60px'
    },
  },
};
const handleFinalReportClick=(()=>
{
  console.log('handleFinalReportClick() called');
//   console.log('Previous JSON issueList data is => ',finalUserInput)
//   const newJSON = finalUserInput.map(obj => {
//     const newObj = { ...obj }; // Create a copy of the object
//     delete newObj['edited']; // Remove the property
//     return newObj;
// });
// console.log('Updated JSON => ',newJSON)

//   postDatainDB(newJSON)
//   // setSnackbarSeverity("success")
//   // setSnackbarText("Ticket Raised successfully")
//   // setMainAlert(true)
const currentSuperInformation=saveCurrentTabModuleInformation() //Remember if the array with the particular value doesn't exist how will i ever change the value inside  it, I cannot replace a const array but definetly can change the value inside one of the array Index value  but in usestate while runtime if you set something and expect to get the set value , it won't be possible 
console.log('Information in the superInformationofAllModules',currentSuperInformation)
let final_JSON_array = []
currentSuperInformation.forEach((item)=>
{
  if (
    (item.miscellaneous_issues.length > 0 || item.remarks.length > 0) || item.issuesList.length>0)
  {
    final_JSON_array.push(item);
  }
  
})
console.log('Final Array for POST before replacing : ',final_JSON_array)


//let final_JSON_array_replaced=[]
final_JSON_array.forEach((element)=>
{
   element.miscellaneous_issues= element.miscellaneous_issues.length===0?"NA":element.miscellaneous_issues
   element.remarks= element.remarks.length ===0? "NA" : element.remarks
})
console.log("Final Json_array after replacing => ",final_JSON_array);
let json_Count=0;
final_JSON_array.forEach(json_data=>
  {
    //let count=0
  // count=
    postDatainDB(json_data)
    json_Count=json_Count+1;
  }
  )
console.log('Number of JSON posted => ',json_Count)

//Resetting Data
setDropdownValue('Select an application')
setTabsModuleNames([])
setFinalUserInput([])
setMiscellaneousInput("")
setRemarksInput("")
setSuperInformationofAllModules([])
setMainData({})
setUpdatedMainData({})
setOverviewTableData([])
if(json_Count>0)
{
  const ticket="Ticket raised successfully ! Ticket No - "+ticketNumber ;
  setSnackbarSeverity("success")
  setSnackbarText(ticket)
  setMainAlert(true)
  Swal.fire({
    title: "Ticket raised successfully",
    text:" Ticket No - "+ticketNumber,
    icon: "success",
    allowOutsideClick: false,
    confirmButtonText: "OK"
  });
 // const ticket="Tiket raised successfully ! Ticket No - "+ticketNumber ;
 
}
else
{
  setSnackbarSeverity("error")
  setSnackbarText("No Tickets were raised")
}



})

const  generateRandomNumber=(()=> {
  const randomNumber = Math.floor(10000 + Math.random() * 90000); 
  return 'I' + randomNumber;
})

const postDatainDB=(async(json_data)=>
{
  console.log('postDatainDB() called')
  console.log('current JSON_data is => ',JSON.stringify(json_data))
  // const randomID=generateRandomNumber()
  // console.log('Random Ticket Number : ',randomID) 
  // const PlantID='P009'
  // const JSONDATA=
  // {
  //   "plantID":PlantID,
  //   "application_name": dropdownValue,
  //   "module_name": value,
  //   "miscellaneous_issues": miscellaneousInput.length>0?miscellaneousInput:"N/A",
  //   "remarks": remarksInput.length>0?remarksInput:"N/A",
  //   "ticket_number": randomID,
  //   "status": "Open",
    
  //   "issueList":JSON_issuelist
  // }
 // console.log("JSON to be sent to Database : ",JSON.stringify(JSONDATA))
  try{
  const response= await fetch(`http://localhost:8082/application/user`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(json_data)
})
if(response.ok)
    {
      console.log('Data has been updated successfully ! ')
  // setSnackbarSeverity("success")
  // setSnackbarText("Ticket Raised successfully")
  // setMainAlert(true)
  //Resetting to previous states
  // setMiscellaneousInput("")
  // setRemarksInput("");
  // setFinalUserInput([]);
  // fetchTabData(value,dropdownValue);
  // setSnackbarSeverity("success")
  // setSnackbarText("Data refreshed successfully")
  // setMainAlert(true)
     return 1;
    }
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
  }
  catch(error)
  {
    console.log('Error in posting Data to the database : ', error);
    setSnackbarSeverity("error")  
    setSnackbarText("Error in Database  Connection ") 
    setMainAlert(true)
    return 0;
  }


})


const handleAlertClose = (event, reason) => {
  if (reason === "clickaway") {
    return;
  }

  setModalAlertOpen(false);
};

const handleMainAlertClose= (event, reason) => {
  if (reason === "clickaway") {
    return;
  }

  setMainAlert(false);
};

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
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const handleExpandClick = () => {
  setExpanded(!expanded);
};

  return (
    <div >
      <AnimatedPage>
      {/* <CustomDropDown>
    </CustomDropDown> */}
      <Box  mt={2}  ml={2} mr={2} mb={2} sx={{  typography: "body1",boxShadow: '0px 4px 8px black', borderRadius: '30px'  }}>
        
        <br></br>
        <center>
          <CustomDropDown
            style={{ width: "200px" }}
            id={"app-dropdown"}
            list={appDropdown}
            label={"Application Name"}
            value={dropdownValue}
            onChange={handleAppDropdownChange}
          ></CustomDropDown>
        </center>
      
        <br />
        <center>
          {tabsmoduleNames.length!==0&&
          <div style={{ maxHeight: '400px',maxWidth:'1200px', overflowY: 'auto',boxShadow: '0px 4px 8px black',borderRadius:'10px'}}>
           
         
          <div colSpan={4} align="center"
             style={{backgroundColor:'#B5C0D0',padding:'5px'}}
            >
             <span style={{fontSize:'14px',fontWeight:'bold'}}>Issues Overview  </span>
             <span style={{color:'#610C9F',fontSize:'14px',fontWeight:'bold'}}>[{dropdownValue}] </span>
            
            <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Table sx={{borderRadius:'100px'}}>
        <TableBody>
             
        
          <TableRow>
          <TableCell align="left" sx={{ width: '30%', backgroundColor: '#B5C0D0' }}>
        <b> Module Name </b>
      </TableCell>
      <TableCell align="center" sx={{ width: '20%', backgroundColor: '#B5C0D0' }}>
        <b> Area </b>
      </TableCell>
      <TableCell align="center" sx={{ width: '40%', backgroundColor: '#B5C0D0' }}>
        <b> Issue Name </b>
      </TableCell>
      <TableCell align="right" sx={{ width: '10%', backgroundColor: '#B5C0D0' ,padding:'30px'}}>
        <b> Severity</b>
      </TableCell>
          </TableRow>
          {overviewTableData.length===0 && <TableRow><TableCell>No Issues Added...</TableCell></TableRow>}
          {overviewTableData.length>0 && overviewTableData.map((item, index) => (
      <TableRow key={index}>
        <TableCell align="left">{item.module_name}</TableCell>
    <TableCell align="center">{item.selected_coordinates_acronym}</TableCell>
    <TableCell align="center">{item.issue_name}</TableCell>

    <TableCell align="center" style={{
            color:
              severityColors[item.severity.toLowerCase()] ||
              severityColors.minor,
            fontWeight: "bold",
          }}
          >{item.severity}</TableCell>
        </TableRow>
          ))}


        
         </TableBody>
         </Table>
         </Collapse>
         <center>
            <br/>
            {tabsmoduleNames.length!==0&&
  <Button
    size="medium"
    id="final-submit"
    variant="contained"
    color="success"
    onClick={handleFinalReportClick}
    sx={classes.btn}
  >
    Raise a Ticket  
    <ArrowRightIcon fontSize="small"/>
  </Button>}
  </center>
         
       
         </div>}
         <br/>
         <br/>
          
         </center>
         <br/>
        {tabsmoduleNames.length!==0&&
        <TabContext value={value}>
          <Box  
          sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "10px",
        backgroundColor:"#EEEEEE",
        display: 'flex',
        justifyContent: 'center', // Center the content horizontally
        alignItems: 'center', // Center the content vertically
      }}
      >
           
            <Tabs onChange={handleTabsChange} value={value} variant="scrollable">
              {tabsmoduleNames.map((module, index) => (
                <Tab sx={{ fontWeight: 'bold',color:'#000000',fontSize:'12px' }} label={module} value={module} key={index}></Tab>
              ))}
            </Tabs>
           
          </Box>
          {/* <TabPanel value="1">
            <Box
              component="img"
              sx={{
                width: '100%',
      height: '100%',
      
                borderRadius: 5,
                objectFit: 'contain',
                // maxHeight: { xs: 233, md: 167 },
                // maxWidth: { xs: 350, md: 250 },
              }}
              alt=""
              src="https://c4.wallpaperflare.com/wallpaper/764/505/66/baby-groot-4k-hd-superheroes-wallpaper-preview.jpg"
            />
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel> */}

          {/* The overview table will be populated here ...... */}

          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' ,paddingRight: '20px',paddingTop: '20px'}}> */}
         
{/* </div> */}

          
          
         
         
          <center>
          <div 
      className="floating" 
      style={{
        fontWeight:'bold',
        color:'red',
        marginTop: '5px',
        animationName: 'floating',
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      }}
    >
     <span style={{ fontSize: "12px", display: 'flex', alignItems: 'center',justifyContent:'center',fontWeight:'bold' }}>
      Click on the Image below to add Issue <KeyboardDoubleArrowDownIcon />
    </span>
      <style>
        {`
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, 10px); }
          100% { transform: translate(0, -0px); }    
        }
        `}
      </style>
    </div>
    </center>
   
    <br/>
    <motion.div
              variants={icon}
              initial="hidden"
              animate="visible"
              transition={{
                default: { duration: 2, ease: "easeInOut" },
                fill: { duration: 4, ease: [1, 0, 0.8, 1] },
              }}
            >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {mainData.module_image && (
              <Paper
                elevation={3}
                style={{
                  width: "95%",
                  height: "95%",
                  margin: "auto",
                  borderRadius: "40px",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${mainData.module_image}`}
                  alt={mainData.module_name}
                  style={{
                   borderRadius:"10px",
                    width: "100%",
                    height: "100%",
                    // userSelect:'none',
                    // pointerEvents:'none'
                  }}
                  // onClick={(e) => checkForDialog(e)}
                />
                

               </Paper>
            )}
            {updatedMainData&&updatedMainData.issuesList&&updatedMainData.issuesList.map((area, areaIndex) => (
               <Tooltip key={areaIndex} title="Click me ! " placement="top-start">
                      <div onClick={(event)=>handleDivClick(event,area)}
                        key={areaIndex}
                       
                        style={{
                          position: 'absolute',
                          left: `${area.left * 100}%`,
                          top: `${area.top * 100}%`,
                          width: `${area.width * 100}%`,
                          height: `${area.height * 100}%`,
                          // border: '2px solid #2196f3', // Blue color
                          // backgroundColor: 'rgba(33, 150, 243, 0.5)', // Semi-transparent blue
                          // display: 'flex',
                          // justifyContent: 'center',
                          // alignItems: 'center',
                          // color: 'white',
                          // fontSize: '16px',
                          // fontWeight: 'bold',
                          // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                          // transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        // onMouseEnter={(e) => {
                        //   e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.7)'; // Lighter blue on hover
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.5)';
                        // }}
                      >
                        {area.edited &&
                        <CheckCircleIcon
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#66FF00' }}
                                    fontSize="small"
                                    // onClick={(e) => {
                                    //   e.stopPropagation();
                                    //   handleDivClick(area); // Call a function to delete the area when delete icon is clicked
                                    // }}
                                  />}
                                  
                                 
                      </div>
                     </Tooltip>
                    ))}


          </div>
          </motion.div>

<center>
          <Container
                        >
                         
  <Paper elevation={4}  style={{borderRadius:'10px',boxShadow: '0px 4px 8px black',maxHeight: '200px',maxWidth:'900px'}}>
    <center>
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#B5C0D0', padding: '10px',borderRadius:'10px',justifyContent:'center' }}>
    <span style={{ fontSize: "14px", fontWeight: 'bold', marginLeft: '20px' }}>
    Additional Information  [<span style={{color:'#610C9F',fontSize:'14px',fontWeight:'bold'}}>{value}</span>] :
    </span>
   
  </div>
  <br></br>
      </center>
    <div style={{ display: 'flex'}}>
    <TextField 
      id="user-misc-issue"
      label= {<span style={{ fontSize: "14px",fontWeight:'bold' }}>
      Miscellaneous Issue 
      </span>}
      multiline
      rows={3}
      style={{ flex: 1, marginRight: '10px',marginLeft: '10px', marginBottom:'10px' }}
      value={miscellaneousInput}
      onChange={(e)=>{
        setMiscellaneousInput(e.target.value)
        console.log('Miscellaneous Issue :',e.target.value);
       // setCopyMiscellanous(e.target.value)
       // changeCurrentMiscellaneous();
        saveCurrentTabModuleInformation() 
      }}
      // onFocus={()=>{
      //   saveCurrentTabModuleInformation()//Why I did that because I cannot capture the dropdown value in runtime so I will call it twice and during final submit i will filter the data where the data with blank issueList,miscellaneous issue and remarks will be filtered out....
      // }}
    />
    <TextField
      id="user-remarks"
      label= {<span style={{ fontSize: "14px",fontWeight:'bold' }}>
      Remarks 
      </span>}
      multiline
      rows={3}
      required
      style={{ flex: 1, marginLeft: '10px',marginRight: '10px',marginBottom:'10px' }}
      value={remarksInput}
      onChange={(e)=>{
        setRemarksInput(e.target.value)
        console.log('Remarks :',e.target.value);
       // setCopyRemarks()
       // changeCurrentRemarks;
       // saveCurrentTabModuleInformation({remarks:e.target.value})
       saveCurrentTabModuleInformation()
      }}
      // onFocus={()=>{
      //   saveCurrentTabModuleInformation()
      // }}
    />
    </div>
  </Paper>
</Container>
</center>
          
          {/* {test} */}
<br/>
<br/>
        
        </TabContext>}
        <div>
      
      <Modal keepMounted 
        open={openDialog}
        onClose={handleClose}
        disableScrollLock
      >
        <TableContainer sx={modalstyle}>
        {/* <Grid item xs={12} md={6} lg={4}> */}
          <Typography id="modal-modal-title" variant="h6" component="h2" >
            Selected Area : {areaName} 
          </Typography>
          <br/>
         <div style={{display:"flex"}}>
          {/* <CustomDropDown
            style={{ width: "200px" }}
            id={"modal-dropdown"}
            list={issuesDropdown}
            label={"Issue Name"}
            value={userIssue}
            onChange={handleModalDropdown}
           // menuItemStyle={menuItem}
          ></CustomDropDown> */}
  
      <FormControl style={{ minWidth: 200,maxWidth:200}}>  
        <InputLabel>{"Issue Name"}</InputLabel>
        <Select
         MenuProps={MenuProps}
        //style= {style}
        //id={id} 
        // style={{
        //   whiteSpace: "nowrap",
        //   overflow: "scroll",
        //   textOverflow: "ellipsis",
        //   maxWidth: "100%",color:'red'}}
        value={userIssue} 
        label="Issue Name"
        onChange={handleModalDropdown}
        error={issuedropdownError}
        //className={value}
        //error={showerror}
        onClose={()=>
        {
          setIssuesDropdown(originalIssuesDropdown)
        }}
        >
          {/* <input
              type="text"
              placeholder="Search..."
              onClick={(e) => e.stopPropagation()}
              // Add any other input field properties as needed
              style={{
                width: "90%", // Adjust width as desired
                // Add border
                // alignItems:'center',
                // justifyContent:'center',
                // padding: "10px",
               
              }}
             
            /> */}
              
              <TextField id={"user-issues-dropdown"}
                          onChange={(e)=>handleDropdownSearch(e)}
                          // onChange={(e) =>{e.stopPropagation();
                          //   e.preventDefault();}}
                          // onClick= {(event)=>{event.stopPropagation()
                          //   event.preventDefault();
                          // }}
                          onKeyDown={(e)=>{
                          e.stopPropagation()
                          }}
                          onKeyUp={(e)=>{
                            e.stopPropagation()
                            }}
                            // onSelect={(e)=>{
                            //   e.stopPropagation()
                            //   e.preventDefault()
                            //   }}
                  
                          // onFocus={(e)=>{
                          //   e.stopPropagation()
                          //   e.preventDefault()
                          //   }}
                          variant={"outlined"}
                          size={"small"}
                          value={searchDropdownValue}
                          //placeholder='Search'
                          label={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <SearchOutlinedIcon
                                style={{ marginRight: "5px" }}
                              />
                              <span style={{ fontSize: "12px" }}>
              Search...
              </span>
                            </div>
                          }
                          //value={search}
                          style={{
                            marginLeft: "12px",
                            // Set the background color to white
                          }}
                          />
                          
                         
                          <br/>
          {issuesDropdown.map((item, index) => (
           
            <MenuItem key={item} 
            value={item}
            style={{whiteSpace: 'normal'}}
            >
              <div style={{
                                   
                                    width: "200px",
                                    wordWrap: "break-word",
                                    
                                  }}>
              {item}
      
              </div>
            </MenuItem>
           
          ))}
        </Select>
      </FormControl>


       
         &nbsp;&nbsp;
           <CustomDropDown
            style={{ width: "200px" }}
            id={"modal-severity-dropdown"}
            list={severityList}
            label={"Severity"}
            value={userSeverity}
            onChange={handleUserSeverityChange}
            showerror={severityError}
            
          ></CustomDropDown>
           &nbsp;&nbsp;
            <IconButton onClick={handleAddUserIssues}
             
              //onClick={handleAddClick}
             sx={{borderRadius:'20px'}}
            >
            < AddCircleIcon fontSize="large"  color="primary"/>
            </IconButton>
          </div>
          <br/>
         
          <div>
            
      {/* <Container 
      sx={{maxHeight:300,maxWidth:300}}
      > */}
     
        
        
<Divider/>
{/* <Paper elevation={5} sx={{borderRadius:2}}> */}
{/* <Typography variant="body1" sx={{ backgroundColor: '#B5C0D0'}}>
 &nbsp;&nbsp;<b>Added Issues</b>
</Typography>
      <List sx={{ mt: 1 }}>
        <TransitionGroup>
          {tableIssuesForCurrentDiv.map((item) => (
            <Collapse key={item.issue_name}>
                 <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
         // onClick={() => handleRemoveFruit(item)}
        >
          <DeleteIcon sx={{color: "#FE2E2E"}} />
        </IconButton>
      }
    >
      <ListItemText primary={item.issue_name} sx={{
                                    lineHeight: "normal",
                                    width: "10px",
                                    wordWrap: "break-word",
                                  }} />
    </ListItem>


            </Collapse>
          ))}
        </TransitionGroup>
      </List>
       */}
      {/* </Paper> */}
      {/* </Container> */}
      {tableIssuesForCurrentDiv.length!==0 &&
      <div style={{ maxHeight: '200px', overflowY: 'auto',boxShadow: '0px 4px 8px black',borderRadius:'10px'}}>
      <Table sx={{borderRadius:'100px'}}>
  <TableBody >
    <TableRow>
      <TableCell align="left" sx={{width:'50%',backgroundColor:'#B5C0D0'}}><b>Issues Added</b></TableCell>
      <TableCell sx={{width:'50%',backgroundColor:'#B5C0D0'}} colSpan={2}>
        <CustomTextfield
          id={"table-search-issues"}
          variant={"outlined"}
          size={"small"}
          onChange={(e)=>{handleTableSearch(e)}}
          value={tableSearchText}
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchOutlinedIcon style={{ marginRight: "5px" }} />
              <span style={{ fontSize: "12px" }}>
              Search...
              </span>
            </div>
          }
          style={{
            width:'100%'
          }}
        />
      </TableCell>
      {/* <TableCell>Action</TableCell> */}
    </TableRow>
    {tableIssuesForCurrentDiv.map((item, index) => (
      <TableRow key={index}>
        <TableCell >  <Box
                                  sx={{
                                    lineHeight: "normal",
                                    width: "300px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {item.issue_name}
                                </Box></TableCell>
          <TableCell
           style={{
            color:
              severityColors[item.severity.toLowerCase()] ||
              severityColors.minor,
            fontWeight: "bold",
            fontSize: "medium",
          }}
          >
            {item.severity}
          </TableCell>
        <TableCell align="right" > <Button
                              onClick={() =>
                                handleDeleteTableClick(item)
                              }
                            >
                              <DeleteIcon

                                align="right"
                                sx={{ color: "#FE2E2E" }}
                              />
                            </Button></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

</div>}



      <br/>
    </div>

      
          {/* </Grid> */}

          <Snackbar
          id="modal-alert"
          open={modalAlertOpen}
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
        <br>
        </br>
         {/* <center>
        <Button
        variant="contained"
        color="success"
        onClick={handleModalSubmit}
        >
          Add <ArrowRightOutlinedIcon fontSize="large"></ArrowRightOutlinedIcon> 
        </Button>
        </center> */}
        </TableContainer>
     


      </Modal>
    </div>

   
    {/* <Paper elevation={5}> */}
    <Snackbar
          id="mainreport-alert"
          open={mainAlert}
          autoHideDuration={1500}
         onClose={handleMainAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
             onClose={handleMainAlertClose}
             severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarText}
          </Alert>
        </Snackbar>
       
     
      </Box>
      </AnimatedPage>
    </div>
   
  );
}
