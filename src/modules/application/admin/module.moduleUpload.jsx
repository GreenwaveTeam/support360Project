import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Card,
  Chip,
  Container,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  styled,
  Fade,
  IconButton
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useUserContext } from "../../contexts/UserContext";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

/*Custom Components*/
import Table from "../../../components/table/table.component";
import Snackbar from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";
import CustomDialog from "../../../components/dialog/dialog.component";
import NotFound from "../../../components/notfound/notfound.component";

import styles from "./module.module.css";
import { borderBottom } from "@mui/system";
import { extendTokenExpiration } from "../../helper/Support360Api";
import Textfield from "../../../components/textfield/textfield.component";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const Application = ({ sendUrllist }) => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [dialogPopup, setDialogPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const [issueName, setIssueName] = useState("");
  const [severity, setSeverity] = useState("");
  const [issues, setissues] = useState([]);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const[isEditModule,setIsEditModule]=useState(false)
  const [inputLink,setInputLink]=useState(false)
  const { userData, setUserData } = useUserContext();

  // const plantid = userData.plantID;
  //const role = userData.role;
  const columns = [
    {
      id: "issuename",
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
  const [selectedByteArray, setSelectedByteArray] = useState([]);
  const [categoryname, setCategoryname] = useState("");
  const location = useLocation();
  const application_name = location.state.application_name;
  const plantid = location.state.plantid;
  const selectedProject = location.state.selectedProject;
  console.log("Plant id:" + plantid);
  const modulelist = location.state.modulelist;
  //console.log("Module list====>"+JSON.stringify(modulelist))
  const [module_Name, setModule_Name] = useState(application_name + "_Module_");
  const [categorySubmitted, setCategorySubmitted] = useState(false);
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteArea, setDeleteArea] = useState(null);
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;
  const DB_IP = process.env.REACT_APP_SERVERIP;
  
  // const chipStyle = {
  //   height: isEditModule ? '60px' : '32px',
  //   padding: isEditModule ? '20px' : '4px', // Add padding for better appearance
  //   };
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    { pageName: "Application", pagelink: "/admin/ApplicationConfigure" },
  ];
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedModuleForDelete, setSelectedModuleForDelete] = useState(null);
  const [deleteModuleDialog, setDeleteModuleDialog] = useState(false);
  const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
  const [updatedModuleName, setUpdateModuleName] = useState("");
  const [updateModuleDialog, setUpdateModuleDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  const cardStyleToInputImage = {
    width: '300px',
    height: '200px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  };

  const formStyleToInputImage = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  };

  useEffect(() => {
    if( localStorage.getItem("token")===null||localStorage.getItem("token")===''){
      console.log("Local storage::", localStorage.getItem("token"))
      navigate("/login")
    }
    else{
    extendTokenExpiration();
    fetchUser();
    //fetchDivs();
    sendUrllist(urllist);
    }
  }, []);
  const fetchUser = async () => {
    let role = "";
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("fetchUser data : ", data);
      // setFormData(data.role);
      role = data.role;

      console.log("Role Test : ", role);
      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  const handleUpdateModule=()=>{
    setIsEditModule(true)
    setUpdateModuleName(module_Name)
    setContextMenuPosition(null)
  }
  const fetchDivs = async (role) => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=/admin/ApplicationConfigure/Module`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetch div" + JSON.stringify(data));
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
        if (data.components.length === 0) navigate("/notfound");
      }
    } catch (error) {
      navigate("/notfound");
      console.log("Error in getting divs name :", error);
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  const handleAddCategory = () => {
    console.log(categories);
    console.log(categoryname);
    if (categories.includes(categoryname)) {
      setDialogPopup(true);
      setsnackbarSeverity("error");
      setDialogMessage("Category Name already Exists");
      setCategorySubmitted(false);
      return;
    }
    if (checkInput(categoryname)) return;
    setCategorySubmitted(true);
  };
  const handleAreaClick = (area) => {
    /*Display the listif issues selected with the div*/
    setShowPopup(true);
    setSelection(area);
    setissues(area.issues);
    setCategoryname(area.categoryname);
    setCategorySubmitted(true);
  };
  const handleClosePopupForm = async () => {
    setShowPopup(false);
    setSelection(null);
    setCategorySubmitted(false);
    setIssueName("");
    setSeverity("");
    setCategoryname("");

    setissues([]);
  };

  const handleEditIssue = async (prev, rowData) => {
    try {
      console.log("Handle delete");
      //console.log("Row data==>"+JSON.stringify(rowData))
      const deleteRequestBody = {
        plant_id: plantid,
        application_name: application_name,
        moduleName: module_Name,
        categoryname: categoryname,
        issuename: prev.issuename,
        project_name: selectedProject,
      };
      console.log("Rowdata=====>" + JSON.stringify(rowData));
      await axios.delete(
        `http://${DB_IP}/application/admin/deleteApplicationIssue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: deleteRequestBody,
        }
      );

      if (selection) {
        const details = {
          left: selection.left,
          top: selection.top,
          width: selection.width,
          height: selection.height,
          categoryname: categoryname,
          issues: [rowData],
        };

        const requestData = {
          plant_id: plantid,
          application_name: application_name,

          modulelist: [
            {
              modulename: module_Name,
              moduleimage: Array.from(selectedByteArray),
              issueslist: [details],
            },
          ],
        };
        console.log(JSON.stringify(requestData));
        const detail = {
          left: selection.left,
          top: selection.top,
          width: selection.width,
          height: selection.height,
          categoryname: categoryname,
          issues: issues
            .filter((issue) => issue.issuename !== prev.issuename)
            .concat({
              issuename: rowData.issuename,
              severity: rowData.severity,
            }),
        };
        console.log("Module Upload");
        // Here requestData contains entire module data including module_image
        const response = await axios.post(
          `http://${DB_IP}/application/admin/addApplicationModuleDetails/${selectedProject}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSelectedAreas([
          ...selectedAreas.filter(
            (area) => area.categoryname !== detail.categoryname
          ),
          detail,
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Database Error");
      return false;
    }
  };

  const handleDeleteIssue = async (rowData) => {
    try {
      const requestBody = {
        plant_id: plantid,
        application_name: application_name,
        moduleName: module_Name,
        categoryname: categoryname,
        issuename: rowData.issuename,
        project_name: selectedProject,
      };

      console.log("Handle delete==>", requestBody);

      await axios.delete(
        `http://${DB_IP}/application/admin/deleteApplicationIssue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        }
      );
      const detail = {
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
        categoryname: categoryname,
        issues: issues.filter((issue) => issue.issuename !== rowData.issuename),
      };
      console.log("Detail====>" + JSON.stringify(detail));
      setSelectedAreas([
        ...selectedAreas.filter(
          (area) => area.categoryname !== detail.categoryname
        ),
        detail,
      ]);
      setissues(issues.filter((row) => row !== rowData));
      return true;
    } catch (error) {
      console.error(
        "Error deleting issue:",
        error.response ? error.response.data : error.message
      );
      // Handle errors, such as displaying an error message to the user
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Database Error");
      return false;
      return false;
    }
  };
  const handleModuleNameCheck=()=>{
    setInputLink(false)
    if (
      modulelist !== null &&
      modulelist.some(
        (module) => module.modulename.trim() === module_Name.trim()
      )
    ) {
      console.log("Module name found");
      setDialogPopup(true);
      setsnackbarSeverity("error");
      setDialogMessage("Module Name is already present");
      setDialogPopup(true);
      setSelectedFile(null);
      setSelectedByteArray(null);
      return;
    }
    if (module_Name.trim() === "") {
      setDialogPopup(true);
      setsnackbarSeverity("error");
      setDialogMessage("Blank string is not accepted");
      return;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(module_Name.trim())) {
      setDialogPopup(true);
      setsnackbarSeverity("error");
      setDialogMessage("Special Character is not allowed");
      return;
    }
    setInputLink(true)
    
  }
  const handleFileChange = (event) => {
    setImageUrl(null);
    setSelectedFile(event.target.files[event.target.files.length - 1]);
    // Clear previous image URL when selecting a new file
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64String = dataUrl.split(",")[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        setSelectedByteArray(byteArray);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAreaClick = (area) => {
    setDeleteDialog(true);
    setDeleteArea(area);
  };
  const handleDeleteAreaConfirm = () => {
    handleDeleteArea(deleteArea);
  };

  const handleDeleteArea = async (area) => {
    const requestBody = {
      plant_id: plantid,
      application_name: application_name,
      moduleName: module_Name,
      categoryname: area.categoryname,
    };

    try {
      const response = await axios.delete(
        `http://${DB_IP}/application/admin/deleteApplicationCategory/${selectedProject}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        }
      );
      // Optionally, update the UI or perform any additional actions after successful deletion
      setSelectedAreas((prev) =>
        prev.filter((areatodel) => areatodel.categoryname !== area.categoryname)
      );
      setCategories((prev) =>
        prev.filter((category) => category !== area.categoryname)
      );
      setDialogPopup(true);
      setsnackbarSeverity("success");
      setDialogMessage("Your area has been deleted");
    } catch (error) {
      console.error("Error deleting data:", error);
      setsnackbarSeverity("error");
      setDialogPopup(true);

      setDialogMessage("Database error");
      // Handle errors, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    console.log("Use Effect selected file");
    if (selectedFile) {
      setImageUrl(URL.createObjectURL(selectedFile)); // Set uploaded image URL
    } else {
      console.log("No file selected");
    }
  }, [selectedFile]);

  const handleModuleNameChange = async (e) => {
    setModule_Name(e.target.value);

    console.log("Current Module : ", e.target.value);
  };
  const handleMouseDown = async (event) => {
    setShowPopup(false);
    const image = event.target;
    const imageRect = image.getBoundingClientRect();
    const imageWidth = image.width;
    const imageHeight = image.height;
    const startX = (event.clientX - imageRect.left) / imageWidth;
    const startY = (event.clientY - imageRect.top) / imageHeight;
    let detailsToCheckOverlap = null;
    let isMouseMoved = false;

    const handleMouseMove = async (event) => {
      isMouseMoved = true;
      const endX = (event.clientX - imageRect.left) / imageWidth;
      const endY = (event.clientY - imageRect.top) / imageHeight;

      let left = Math.min(startX, endX);
      let top = Math.min(startY, endY);
      let width = Math.abs(endX - startX);
      let height = Math.abs(endY - startY);

      // Ensure the selection box remains within the bounds of the image
      left = Math.max(Math.min(left, 1), 0);
      top = Math.max(Math.min(top, 1), 0);
      width = Math.max(Math.min(width, 1 - left), 0);
      height = Math.max(Math.min(height, 1 - top), 0);

      setSelection({ left, top, width, height });
      detailsToCheckOverlap = { left, top, width, height };
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!isMouseMoved) return;
      setissues([]);
      setShowPopup(true);
      const overlaps = handleOverlapCheck(detailsToCheckOverlap);

      if (overlaps) {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setDialogMessage("Overlap is strictly restricted");
        setShowPopup(false);
        setSelection(null);
        return;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleTouchStart = (event) => {
    const imageRef = event.target;
    const imageRect = imageRef.getBoundingClientRect();
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;
    const touch = event.touches[0];
    const startX = (touch.clientX - imageRect.left) / imageWidth;
    const startY = (touch.clientY - imageRect.top) / imageHeight;
    let detailsToCheckOverlap = null;
    let isTouchMoved = false;

    const handleTouchMove = (event) => {
      isTouchMoved = true;
      const touch = event.touches[0];
      const endX = (touch.clientX - imageRect.left) / imageWidth;
      const endY = (touch.clientY - imageRect.top) / imageHeight;

      let left = Math.min(startX, endX);
      let top = Math.min(startY, endY);
      let width = Math.abs(endX - startX);
      let height = Math.abs(endY - startY);

      // Ensure the selection box remains within the bounds of the image
      left = Math.max(Math.min(left, 1), 0);
      top = Math.max(Math.min(top, 1), 0);
      width = Math.max(Math.min(width, 1 - left), 0);
      height = Math.max(Math.min(height, 1 - top), 0);

      setSelection({ left, top, width, height });
      detailsToCheckOverlap = { left, top, width, height };
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (!isTouchMoved) return;
      setissues([]);
      setShowPopup(true);
      const overlaps = handleOverlapCheck(detailsToCheckOverlap);

      if (overlaps) {
        setsnackbarSeverity("error");
        setDialogPopup(true);
        setDialogMessage("Overlap is strictly restricted");
        setShowPopup(false);
        setSelection(null);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleAddIssue = (event) => {
    event.preventDefault();
    const newIssue = { issuename: issueName, severity: severity };
    const issueExists = (issues, issuename, issueName) => {
      // Use some() to iterate over each object in the list
      return issues.some((obj) => {
        // Check if the specified key of the object contains the search string
        return obj[issuename] === issueName;
      });
    };
    if (issueExists(issues, "issuename", issueName)) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Issue Name already exists");
      return;
    }
    if (
      issueName === null ||
      severity === null ||
      issueName.trim() === "" ||
      severity.trim() === ""
    ) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Please provide both issue name and severity.");
      return;
    }
    if (!checkInput(issueName)) {
      handleCoordinateSubmit(event);
    }
  };
  const handleCoordinateSubmit = async (event) => {
    event.preventDefault();

    if (selection) {
      const details = {
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
        categoryname: categoryname,
        issues: [{ issuename: issueName, severity: severity }],
      };

      const detail = {
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
        categoryname: categoryname,
        issues: [...issues, { issuename: issueName, severity: severity }],
      };

      // Update selectedAreas with the new details
      console.log(selectedAreas);
      const requestData = {
        plant_id: plantid,
        application_name: application_name,

        modulelist: [
          {
            modulename: module_Name,
            moduleimage: Array.from(selectedByteArray),
            issueslist: [details],
          },
        ],
      };
      console.log(JSON.stringify(requestData));
      try {
        // Here requestData contains entire module data including module_image
        const response = await axios.post(
          `http://${DB_IP}/application/admin/addApplicationModuleDetails/${selectedProject}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Posted data");
        setissues((prevIssues) => {
          if (prevIssues && issueName && severity)
            return [
              ...prevIssues,
              { issuename: issueName, severity: severity },
            ];
          else if (issueName && severity)
            return [{ issuename: issueName, severity: severity }];
        });
        setSelectedAreas([...selectedAreas, detail]);
        !categories.includes(categoryname) &&
          setCategories([...categories, categoryname]);
          setCategoryname("")
          setIssueName("")
          setSeverity("")
      } catch (error) {
        console.error("Error:", error);
        setsnackbarSeverity("error");
        setDialogPopup(true);
        setDialogMessage("Database Error.");
        setCategoryname("")
          setIssueName("")
          setSeverity("")
      }
    }
    //setShowPopup(false);
  };
  const handleOverlapCheck = (details) => {
    return selectedAreas.some((existing) => {
      const rightExisting = existing.left + existing.width;
      const rightNew = details.left + details.width;
      const bottomExisting = existing.top + existing.height;
      const bottomNew = details.top + details.height;

      return (
        (rightExisting < rightNew &&
          existing.left > details.left &&
          bottomExisting < bottomNew &&
          existing.top > details.top) ||
        (rightExisting > details.left &&
          rightExisting < rightNew &&
          bottomExisting > details.top &&
          bottomExisting < bottomNew) ||
        (existing.left > details.left &&
          existing.left < rightNew &&
          existing.top > details.top &&
          existing.top < bottomNew) ||
        (existing.top > details.top &&
          bottomExisting < bottomNew &&
          existing.left < details.left &&
          rightExisting > rightNew) ||
        (existing.top < details.top &&
          bottomExisting > bottomNew &&
          existing.left < details.left &&
          rightExisting > rightNew) ||
        (existing.top < bottomNew &&
          bottomExisting > bottomNew &&
          existing.left < details.left &&
          rightExisting > rightNew) ||
        (rightExisting > rightNew &&
          existing.left < rightNew &&
          existing.top < details.top &&
          bottomExisting > details.top) ||
        (existing.left < details.left &&
          rightExisting > details.left &&
          existing.top < details.top &&
          bottomExisting > details.top) ||
        (existing.top < bottomNew &&
          bottomExisting > bottomNew &&
          existing.left < details.left &&
          rightExisting > details.left) ||
        (existing.top < bottomNew &&
          bottomExisting > bottomNew &&
          existing.left > details.left &&
          rightExisting < rightNew)
      );
    });
  };

  const handleSubmit = async () => {
    if (selectedFile && selectedAreas) {
      if (checkInput(module_Name)) return;
      if (selectedAreas.length === 0) {
        setDialogMessage("Configure issue details");
        setsnackbarSeverity("error");
        setDialogPopup(true);
        return;
      }
      const requestData = {
        plant_id: plantid,
        application_name: application_name,
        module_name: module_Name,
        selectedFile: selectedFile,

        issueslist: selectedAreas,
        module_image: Array.from(selectedByteArray),
      };
      console.log("Module name:" + module_Name);
      console.log("Request Data====>" + JSON.stringify(requestData));
      //Send formData to the new API endpoint
      try {
        const response = await fetch(
          `http://${DB_IP}/application/admin/plant_id/application_name/moduleName`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );
        //const data = await response.json();
        //console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Please select a file and draw an area before submitting.");
    }
    setCategoryname("");
    setIssueName("");
    setSeverity("Minor");
  };

  const checkInput = (input) => {
    console.log("Check Input===>" + input);
    if (input == null || input.trim() == "") {
      setsnackbarSeverity("error");
      setDialogMessage("Empty string is not allowed");
      setDialogPopup(true);
      return true;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(input.trim())) {
      setDialogPopup(true);
      setsnackbarSeverity("error");
      setDialogMessage("Special Character is not allowed");
      return true;
    }
    return false;
  };
  
  const handleModuleProceed = () => {
    console.log("On blur called")
    setUpdateModuleDialog(true);
    
  };
  const handleUpdateModuleName=async()=>{
    console.log("Handle update module name")
    try {
      if (
        modulelist !== null &&
        modulelist.some(
          (module) =>
            module.modulename.toLowerCase().trim() ===
            updatedModuleName.toLowerCase().trim()
        )
      ) {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setDialogMessage("Module Name is already present");
        setUpdateModuleDialog(false);
        
        return;
      }
      if (updatedModuleName.trim() === "") {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setDialogMessage("Blank string is not accepted");
        setUpdateModuleDialog(false);
        return;
      }
      const regex = /[^A-Za-z0-9 _]/;
      if (regex.test(updatedModuleName.trim())) {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setDialogMessage("Special Character is not allowed");
        setUpdateModuleDialog(false);
        return;
      }
      ///admin/{plant_id}/{application}/{module}/{updatemodule}/updatemodulename
      const response = await axios.put(
        `http://${DB_IP}/application/admin/updatemodulename/${plantid}/${selectedProject}/${application_name}/${module_Name}/${updatedModuleName}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Optionally, update the UI or perform any additional actions after successful deletion
      setUpdateModuleDialog(false);
      setSelectedModuleForUpdate(null);
      setIsEditModule(false)
      setModule_Name(updatedModuleName)
      setUpdateModuleName("");
      
    } catch (error) {
      // Handle errors, such as displaying an error message to the user

      setsnackbarSeverity("error");
      setDialogPopup(true);
      setUpdateModuleDialog(false);
      setUpdateModuleName("");
      setDialogMessage("Database error");
      setIsEditModule(false)
    }
  }
  const handleDeleteModule = async () => {
    setDeleteModuleDialog(true);
    setContextMenuPosition(null)
  };
  const handleContextClick = (event, module) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedModuleForDelete(module_Name);
    setUpdateModuleName(module_Name);
  };
  const handleDeleteModuleConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://${DB_IP}/application/admin/${plantid}/${selectedProject}/${application_name}/${module_Name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setImageUrl(null)
      setSelectedAreas([])
      setDeleteModuleDialog(false)
      setContextMenuPosition(null);
    } catch (error) {
      // Handle errors, such as displaying an error message to the user

      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDeleteModuleDialog(false)
      setDialogMessage("Database error");
    }
  };
  
  
  if (localStorage.getItem("token") === null) return <NotFound />;

  return (
    <div>
      {divIsVisibleList.length !== 0 &&
        divIsVisibleList.includes("add-module-existing-issues") && (
          <Box>
            {!imageUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-100px' // Adjust this value to move the card upward
              }}>
              <Card style={cardStyleToInputImage}>
                <form style={formStyleToInputImage}>
                <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
              fontWeight={700}
            >
              Current Application: &nbsp;
              <span style={{ color: "red" }}>{application_name}</span>
            </Typography>

                  <TextField
                    label="Enter Module Name"
                    id="issuecategory"
                    sx={{ width: '100%' }}
                    value={module_Name}
                    onChange={handleModuleNameChange}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    color="success"
                    onClick={handleModuleNameCheck}
                  >
                    Upload Image
                    {inputLink&&
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      multiple={false}
                    />}
                  </Button>
                </form>
              </Card>
            </div>)}

            {imageUrl && (
              <Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {isEditModule ? (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'cemter'}}>
                          <Textfield
                            value={updatedModuleName}
                             onChange={(event)=>setUpdateModuleName(event.target.value)}
                            //  onBlur={()=>{console.log("On blur");handleModuleProceed()}}
                           
                          />
                          

                                  <Tooltip
                                  TransitionComponent={Fade}
                                  title="Save"
                                >
                                  <IconButton onClick={() => handleModuleProceed()} color="success">
                                 < SaveOutlinedIcon color="sucess"/></IconButton>
                                </Tooltip>

                                <Tooltip
                                  TransitionComponent={Fade}
                                  title="Cancel"
                                >
                                  <IconButton
                                    onClick={() => setIsEditModule(false)} color="error"
                                  >
                                    <CancelOutlinedIcon color="error"/>
                                  </IconButton>
                                </Tooltip>

                          </div>
                        ) : (
                  <Chip 
                    label={
                      <div onContextMenu={handleContextClick}>
                        <Tooltip title='Right Click to modify module'>
                          <Typography>
                            {module_Name}
                          </Typography>
                          </Tooltip>
                        
                      </div>
                    }
                    color="primary"
                    variant="outlined"
                  />)}
                </Box>
                <Divider
                  sx={{
                    height: "1px", // Adjust the height as needed
                    backgroundColor: "#000", // Change the color as needed
                    margin: "16px 0", // Add margin for spacing
                  }}
                />
              </Box>
            

            <Box
              sx={{
                position: "relative",
                width: "95vw",
                height: "80vh",
                objectFit: "contain",
              }}
            >
              <Box
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                {imageUrl && (
                  <img
                    draggable={false}
                    className={styles.imagestyle}
                    src={imageUrl}
                    alt=""
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    style={{
                      cursor: "crosshair",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}

                {/* Render selected areas */}
                {selectedAreas.map((area, index) => (
                  <div
                    key={index}
                    onClick={() => handleAreaClick(area)}
                    style={{
                      position: "absolute",
                      left: `${area.left * 100}%`,
                      top: `${area.top * 100}%`,
                      width: `${area.width * 100}%`,
                      height: `${area.height * 100}%`,
                      border: "2px solid #2196f3", // Blue color
                      backgroundColor: "rgba(33, 150, 243, 0.5)", // Semi-transparent blue
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(33, 150, 243, 0.7)"; // Lighter blue on hover
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(33, 150, 243, 0.5)";
                    }}
                  >
                    <DeleteIcon
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#d11a2a",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAreaClick(area); // Call a function to delete the area when delete icon is clicked
                      }}
                    />
                  </div>
                ))}

                {/* Render the selection area */}
                {selection && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${selection.left * 100}%`,
                      top: `${selection.top * 100}%`,
                      width: `${selection.width * 100}%`,
                      height: `${selection.height * 100}%`,
                      border: "2px dashed red",
                    }}
                  />
                )}

                {/* Render the pop-up */}
                {showPopup && selection && (
                  <Dialog
                    open={showPopup}
                    onClose={handleClosePopupForm}
                    maxWidth="md" // Adjust maxWidth as needed
                    PaperProps={{
                      sx: {
                        padding: "15px", // Add padding in the four corners
                        borderRadius: 2,
                        overflowX: "hidden", // Hide horizontal overflow
                      },
                    }}
                  >
                    <Container>
                      <form
                        onSubmit={(event) => {
                          handleAddIssue(event, module);
                        }}
                      >
                        {!categorySubmitted && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="textSecondary"
                              component="h2"
                              gutterBottom
                              fontWeight={800}
                              sx={{
                                paddingBottom: "0.8rem",
                                fontSize: "0.8rem",
                              }}
                            >
                              Name of The Selected Snippet
                            </Typography>
                            <TextField
                              label={"Snippet Name"}
                              id="issue"
                              value={categoryname}
                              onChange={(e) => {
                                setCategoryname(e.target.value);
                              }}
                              //style={{ width: "50%" }}
                            />
                            &nbsp;&nbsp;
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleAddCategory}
                              style={{
                                width: "50%",
                                backgroundImage:
                                  "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                              }}
                            >
                              Add&nbsp;
                              <AddCircleOutlineOutlinedIcon fontSize="medium" />
                            </Button>
                          </Box>
                        )}
                        {categorySubmitted && (
                          <div style={{ width: "32rem" }}>
                            <>
                              <Typography
                                variant="h6"
                                color="textSecondary"
                                component="h2"
                                gutterBottom
                                fontWeight={900}
                                sx={{ paddingBottom: "0.8rem" }}
                              >
                                Current Snippet Name ➥ &nbsp;
                                <span style={{ color: "red" }}>
                                  {categoryname}
                                </span>
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  label={"Issue Name"}
                                  id="issue"
                                  value={issueName}
                                  onChange={(e) => setIssueName(e.target.value)}
                                  style={{
                                    width: "50%",
                                    paddingBottom: "0.8rem",
                                  }}
                                />
                                <Dropdown
                                  label={"Severity"}
                                  value={severity}
                                  onChange={(e) => setSeverity(e.target.value)}
                                  list={["Critical", "Major", "Minor"]}
                                  formstyle={{
                                    width: "50%",
                                    paddingBottom: "0.8rem",
                                  }}
                                />

                                <Button
                                  color="primary"
                                  variant="contained"
                                  type="submit"
                                  style={{
                                    width: "50%",
                                    marginBottom: "0.8rem",
                                    backgroundImage:
                                      "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                                  }}
                                >
                                  Add&nbsp;
                                  <AddCircleOutlineOutlinedIcon
                                    fontSize="medium"
                                    sx={{ color: "white" }}
                                  />
                                </Button>
                              </Box>
                              <Table
                                rows={issues}
                                progressVisible={true}
                                setRows={setissues}
                                savetoDatabse={handleEditIssue}
                                deleteFromDatabase={handleDeleteIssue}
                                columns={columns}
                                isDeleteDialog={true}
                                editActive={true}
                                tablename={"Existing Issues"} /*style={}*/
                              />
                            </>
                          </div>
                        )}
                      </form>
                    </Container>
                  </Dialog>
                )}
              </Box>
            </Box>
            <Menu
              open={contextMenuPosition !== null}
              onClose={() => setContextMenuPosition(null)}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenuPosition !== null
                  ? { top: contextMenuPosition.y, left: contextMenuPosition.x }
                  : undefined
              }
            >
              <MenuItem onClick={handleDeleteModule}>Delete Module</MenuItem>
              <MenuItem onClick={handleUpdateModule}>Update Module</MenuItem>
            </Menu>
            
            
            <CustomDialog
              open={deleteDialog}
              setOpen={setDeleteDialog}
              proceedButtonText={<Chip color="success" label="Delete"/>}
              proceedButtonClick={handleDeleteAreaConfirm}
              cancelButtonText={<Chip color="error" label="Cancel"/>}
            />
            <CustomDialog
              open={updateModuleDialog}
              setOpen={setUpdateModuleDialog}
              proceedButtonText={<Chip color="success" label="Update"/>}
              proceedButtonClick={handleUpdateModuleName}
              cancelButtonText={<Chip color="error" label="Cancel"/>}
            />
            <CustomDialog
              open={deleteModuleDialog}
              setOpen={setDeleteModuleDialog}
              proceedButtonText={<Chip color="success" label="Delete"/>}
              proceedButtonClick={handleDeleteModuleConfirm}
              cancelButtonText={<Chip color="success" label="Cancel"/>}
            />
            </Box>
            )}
            <Snackbar
              openPopup={dialogPopup}
              snackbarSeverity={snackbarSeverity}
              setOpenPopup={setDialogPopup}
              dialogMessage={dialogMessage}
            />
          </Box>
        )}
    </div>
  );
};

export default Application;
