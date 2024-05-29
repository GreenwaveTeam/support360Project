import React, { useState, useEffect } from "react";
import {
  Box,
  MenuItem,
  Button,
  Container,
  Dialog,
  Typography,
  Menu,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

/*Navigation Pane*/
import Sidebar from "../../../components/navigation/sidebar/sidebar";
import Topbar from "../../../components/navigation/topbar/topbar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";

/*Custom Components*/
import Table from "../../../components/table/table.component";
import Snackbar from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";
import CustomDialog from "../../../components/dialog/dialog.component";
import NotFound from "../../../components/notfound/notfound.component";

import styles from "./module.module.css";
import Textfield from "../../../components/textfield/textfield.component";
import { useContext } from "react";

//Theme
import { ColorModeContext, tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { extendTokenExpiration } from "../../helper/Support360Api";
import { display } from "@mui/system";
import { red } from "@mui/material/colors";

export default function ModuleConfigure({ sendUrllist }) {
  const { userData, setUserData } = useUserContext();

  const plantid = userData.plantID;
  // const role = userData.role;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [showPopup, setShowPopup] = useState(false);
  const [selection, setSelection] = useState(null);
  const [issues, setIssues] = useState([]);
  const [issueName, setIssueName] = useState("");
  const location = useLocation();
  const application_name = location.state.application_name;
  const [severity, setSeverity] = useState("");
  const [categoryname, setCategoryname] = useState("");
  const [dialogPopup, setDialogPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  const [isDataChanged, setDataChanged] = useState(1);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [selectedAreas, setSelectedAreas] = useState(null);
  const [module_Name, setModule_Name] = useState(null);
  const [categorySubmitted, setCategorySubmitted] = useState(false);
  const [categories, setCategories] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteModule, setDeleteModule] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleteArea, setDeleteArea] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedModuleForDelete, setSelectedModuleForDelete] = useState(null);
  const [deleteModuleDialog, setDeleteModuleDialog] = useState(false);
  const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
  const [updatedModuleName, setUpdateModuleName] = useState("");
  const [updateModuleDialog, setUpdateModuleDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "User Configure", pagelink: "/admin/configurePage" },
    { pageName: "Application", pagelink: "/admin/ApplicationConfigure" },
  ];

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
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;
  const [showpipispinner,setShowpipispinner]=useState(true)

  const handleContextClick = (event, module) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedModuleForDelete(module.modulename);
    setSelectedModuleForUpdate(module.modulename);
  };
  const handleDeleteModule = async () => {
    setDeleteModuleDialog(true);
  };
  const handleDeleteModuleConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://${DB_IP}/application/admin/${plantid}/${application_name}/${selectedModuleForDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Optionally, update the UI or perform any additional actions after successful deletion
      setData((prev) => ({
        ...prev,
        modulelist: prev.modulelist.filter(
          (module) => module.modulename !== selectedModuleForDelete
        ),
      }));
      setValue("1");
      setContextMenuPosition(null);

      
    } catch (error) {
      // Handle errors, such as displaying an error message to the user

      setsnackbarSeverity("error");
      setDialogPopup(true);

      setDialogMessage("Database error");
    }
  };
  const handleUpdateModule = async () => {
    //setUpdateModuleDialog(true);
    setOpenEditDialog(true);
    setContextMenuPosition(null);
  };
  const handleEditDialogClose=async()=>{
      setUpdateModuleDialog(false);
      setUpdateModuleName("");
      setOpenEditDialog(false);
      
  }
  const handleModuleProceed = () => {
    setUpdateModuleDialog(true);
  };
  const handleUpdateModuleConfirm = async () => {
    try {
      if (
        data.modulelist !== null &&
        data.modulelist.some(
          (module) =>
            module.modulename.toLowerCase().trim() ===
            updatedModuleName.toLowerCase().trim()
        )
      ) {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setDialogMessage("Module Name is already present");
        setUpdateModuleDialog(false);
        setUpdateModuleName("");
        setOpenEditDialog(false);
        setSelectedModuleForUpdate(null);

        return;
      }
      if (updatedModuleName.trim() === "") {
        setDialogPopup(true);
        setsnackbarSeverity("error");
        setOpenEditDialog(false);
        setDialogMessage("Blank string is not accepted");
        setUpdateModuleDialog(false);
        setUpdateModuleName("");
        setSelectedModuleForUpdate(null);
        return;
      }
      const regex = /[^A-Za-z0-9 _]/;
      if (regex.test(updatedModuleName.trim())) {
        setDialogPopup(true);
        setOpenEditDialog(false);
        setsnackbarSeverity("error");
        setDialogMessage("Special Character is not allowed");
        setUpdateModuleDialog(false);
        setUpdateModuleName("");
        setSelectedModuleForUpdate(null);
        return;
      }
      ///admin/{plant_id}/{application}/{module}/{updatemodule}/updatemodulename
      const response = await axios.put(
        `http://${DB_IP}/application/admin/${plantid}/${application_name}/${selectedModuleForUpdate}/${updatedModuleName}/updatemodulename`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Optionally, update the UI or perform any additional actions after successful deletion
      setData((prev) => ({
        ...prev,
        modulelist: prev.modulelist.map((module) => {
          if (module.modulename === selectedModuleForDelete) {
            // Update the module name here
            return { ...module, modulename: updatedModuleName };
          }
          return module;
        }),
      }));
      setValue("1");
      setContextMenuPosition(null);
      setUpdateModuleDialog(false);
      setUpdateModuleName("");
      setOpenEditDialog(false);
      setSelectedModuleForUpdate(null);

    } catch (error) {
      // Handle errors, such as displaying an error message to the user

      setsnackbarSeverity("error");
      setDialogPopup(true);
      setUpdateModuleDialog(false);
      setUpdateModuleName("");
      setOpenEditDialog(false);
      setSelectedModuleForUpdate(null);
      setDialogMessage("Database error");
    }
  };

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
      // setFormData(data.role);
      role = data.role;

      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  const fetchDivs = async (role) => {
    try {

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=/admin/ApplicationConfigure/Modules`,
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
      if (response.ok) {
        setDivIsVisibleList(data.components);
        if (data.components.length === 0) navigate("/notfound");
      }
    } catch (error) {
      navigate("/notfound");
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://${DB_IP}/application/admin/${plantid}/${application_name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const moduleData = response.data;
      setData(moduleData);
      setSelectedAreas(moduleData.modulelist[0].issueslist);
      setCurrentModule(moduleData.modulelist[0]);
      setModule_Name(moduleData.modulelist[0].modulename);
      setCategories(
        moduleData.modulelist[0].issueslist.map(
          (issueDetail) => issueDetail.categoryname
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const functionsCalledOnUseEffect=async()=>{
    
    sendUrllist(urllist);
    extendTokenExpiration();
    await fetchData();
    await fetchUser();
    
    setShowpipispinner(false)
    //fetchDivs();
  }
  useEffect(() => {
    functionsCalledOnUseEffect()
    
  }, []);

  useEffect(() => handleDataChange, [selectedAreas]);
  const handleAddCategory = () => {
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
  const handleDataChange = () => {
    setData((prev) => {
      // Clone the previous data object to avoid mutating the original state
      const newData = { ...prev };

      // Update the specific property inside the data object
      newData.modulelist = newData.modulelist.map((item) => {
        if (item.modulename === module_Name) {
          return {
            ...item,
            issueslist: selectedAreas,
          };
        } else {
          // Return the original object unchanged
          return item;
        }
      });

      // Return the updated data object
      return newData;
    });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelection(null);
    const moduleIndex = parseInt(newValue) - 1;
    const selectedModule = data.modulelist[moduleIndex];
    setModule_Name(selectedModule.modulename);
    setCurrentModule(selectedModule);
    if (selectedModule && selectedModule.issueslist) {
      setSelectedAreas(selectedModule.issueslist);

      setCategories(
        selectedModule.issueslist.map((issueDetail) => issueDetail.categoryname)
      );
    } else {
      setSelectedAreas([]);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Handler function for updating the filter value
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  // Filtered module list based on the filter value
  const filteredModules =
    data !== null &&
    data.modulelist.filter((module) =>
      module.modulename.toLowerCase().includes(filterValue.toLowerCase())
    );
  const handleAreaClick = (area) => {
    setShowPopup(true);
    setSelection(area);
    setIssues(area.issues);
    setCategoryname(area.categoryname);
    setCategorySubmitted(true);
  };
  const handleDeleteAreaClick = (e, moduleName, categoryName, area) => {
    e.preventDefault();
    setDeleteDialog(true);
    setDeleteArea(area);
    setDeleteCategory(categoryName);
    setDeleteModule(moduleName);
  };
  const handleDeleteAreaConfirm = () => {
    handleDeleteArea(deleteModule, deleteCategory, deleteArea);
  };
  const handleDeleteArea = async (moduleName, categoryName, area) => {
    const requestBody = {
      plant_id: plantid,
      application_name: data.application_name,
      moduleName: moduleName,
      categoryname: categoryName,
    };

    try {
      const response = await axios.delete(
        `http://${DB_IP}/application/admin/plant_id/application/module/category`,
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
        prev.filter((areatodel) => areatodel.categoryname !== categoryName)
      );
      setCategories((prev) =>
        prev.filter((category) => category !== categoryName)
      )
    } catch (error) {
      // Handle errors, such as displaying an error message to the user

      setsnackbarSeverity("error");
      setDialogPopup(true);

      setDialogMessage("Database error");
    }
  };

  const handleAddIssue = (event, moduleData) => {
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
      severity.trim === ""
    ) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Please provide both issue name and severity.");
      return;
    }

    if (!checkInput(issueName)) {
      handleCoordinateSubmit(event, moduleData);
    }
  };

  const handleCoordinateSubmit = async (event, moduleData) => {
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
      const requestData = {
        plant_id: plantid,
        application_name: data.application_name,

        modulelist: [
          {
            modulename: moduleData.modulename,
            moduleimage: moduleData.moduleimage,
            issueslist: [details],
          },
        ],
      };
      const detail = {
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
        categoryname: categoryname,
        issues: [...issues, { issuename: issueName, severity: severity }],
      };

      try {
        // Here requestData contains entire module data including module_image
        const response = await axios.post(
          `http://${DB_IP}/application/admin/plant_id/application_name/moduleName`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIssues((prevIssues) => {
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
      } catch (error) {
        console.error("Error:", error);
        setsnackbarSeverity("error");
        setDialogPopup(true);
        setDialogMessage("Database Error.");
      }
    }
  };

  const checkInput = (input) => {
    if (!input || !input.trim()) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Empty string is not allowed");
      return true;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(input.trim())) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Special characters are not allowed");
      return true;
    }
    return false;
  };

  const handleClosePopupForm = () => {
    setShowPopup(false);
    setSelection(null);
    setCategorySubmitted(false);
    setIssues([]);
  };
  const handleDeleteIssue = async (rowdata) => {
    const requestBody = {
      plant_id: plantid,
      application_name: data.application_name,
      moduleName: module_Name,
      categoryname: categoryname,
      issuename: rowdata.issuename,
    };

    try {
      await axios.delete(
        `http://${DB_IP}/application/admin/plant/application/modulename/category/issue`,
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
        issues: issues.filter((issue) => issue.issuename !== rowdata.issuename),
      };
      setSelectedAreas([
        ...selectedAreas.filter(
          (area) => area.categoryname !== detail.categoryname
        ),
        detail,
      ]);
      setIssues(issues.filter((row) => row !== rowdata));
    } catch (error) {
      
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Database Error");
      return false;
      // Handle errors, such as displaying an error message to the user
    }
  };
  const handleEditIssue = async (prev, rowData) => {
    try {
      const deleteRequestBody = {
        plant_id: plantid,
        application_name: data.application_name,
        moduleName: module_Name,
        categoryname: categoryname,
        issuename: prev.issuename,
      };
      const response = await axios.delete(
        `http://${DB_IP}/application/admin/plant/application/modulename/category/issue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          application_name: data.application_name,

          modulelist: [
            {
              modulename: currentModule.modulename,
              moduleimage: currentModule.moduleimage,
              issueslist: [details],
            },
          ],
        };
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
        // Here requestData contains entire module data including module_image
        const response = await axios.post(
          `http://${DB_IP}/application/admin/plant_id/application_name/moduleName`,
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
        return true;
      }
    } catch (error) {
      console.error("Error:", error);
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Database Error");
      return false;
    }
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
      setIssues([]);
      setShowPopup(true);
      const overlaps = handleOverlapCheck(detailsToCheckOverlap);

      if (overlaps) {
        setsnackbarSeverity("error");
        setDialogPopup(true);
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
      setIssues([]);
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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleRedirect = () => {
    navigate(`/admin/ApplicationConfigure/Module`, {
      state: {
        application_name: data.application_name,
        modulelist: data.modulelist,
      },
    });
  };
  if (localStorage.getItem("token") === null) return <NotFound />;
  return (
    <div>
      {showpipispinner &&
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <i className="pi pi-spin pi-spinner"  style={{ fontSize: '40px' }} />
              </div>
              
            }
      
      {divIsVisibleList.length !== 0 &&
        divIsVisibleList.includes("add-module-existing-issues") && (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                //height: "100vh",
                width: "95vw",
              }}
            >
              {data && data.modulelist.length > 0 && (
                <TabContext value={value}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* <Textfield
								id="filter-input"
								label={
									<div style={{ display: "flex", alignItems: "center" }}>
									  <SearchOutlinedIcon />
									  <span style={{ fontSize: "20px" }}>Search Module...</span>
									</div>
								  }
								  variant="outlined"
								value={filterValue}
								onChange={handleFilterChange}
								 // Adjust margin as needed
							/> */}
                    <Box sx={{ flexGrow: 1 }} />
                    <div>
                      {divIsVisibleList &&
                        divIsVisibleList.includes("add-application-module") && (
                          <Button
                            variant="contained"
                            onClick={handleRedirect}
                            color="primary"
                            sx={{}}
                          >
                            Add Module
                            <AddCircleOutlineOutlinedIcon
                              fontSize="medium"
                              sx={{ paddingLeft: "5px" }}
                            ></AddCircleOutlineOutlinedIcon>
                          </Button>
                        )}
                    </div>
                    <br />
                    {/* <Button
									variant="contained"
									onClick={handleDeleteModule}sx={{ marginRight: '50px',padding: '4px ', // Decrease padding to make the button smaller
									fontSize: '0.75rem' , borderRadius:'10px',marginTop: '5px', // Adjust the margin in the y-axis
									marginBottom: '5px' }}
								>
									Delete Module
								</Button> */}
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: colors.primary[400],
                      borderRadius: 3,
                    }}
                  >
                    
                    <Box>
                      <TextField
                        label={"Filter Module"}
                        id="filter"
                        onChange={handleFilterChange}
                      />
                      
                      <TabList
                        onChange={handleChange}
                        // sx={{ backgroundColor: "red" }}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="scrollable auto tabs example"
                      >
                        {filteredModules.map((module, index) => (
                          <Tab
                            key={index}
                            label={<Tooltip title="Right Click to modify module"><div>{module.modulename}</div></Tooltip> }
                            onContextMenu={(event) =>
                              handleContextClick(event, module)
                            }
                            value={(index + 1).toString()}
                          />
                        ))}
                      </TabList>
                    </Box>

                    {filteredModules.map((module, index) => (
                      <TabPanel
                        key={index}
                        value={(index + 1).toString()}
                        sx={{ padding: "1rem" }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "80vh",
                            objectFit: "contain",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {module && module.moduleimage && (
                              <img
                                draggable={false}
                                className={styles.imagestyle}
                                src={`data:image/jpeg;base64,${module.moduleimage}`}
                                alt={`Module ${index + 1}`}
                                style={{
                                  cursor: "crosshair",
                                  width: "100%",
                                  height: "100%",
                                }}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                              />
                            )}
                            {selection && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: `${selection.left * 100}%`,
                                  top: `${selection.top * 100}%`,
                                  width: `${selection.width * 100}%`,
                                  height: `${selection.height * 100}%`,
                                  border: "2px dashed red",
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  overflow: "hidden",
                                }}
                              />
                            )}
                            {module &&
                              selectedAreas.map((area, areaIndex) => (
                                <Box
                                  key={areaIndex}
                                  onClick={() => handleAreaClick(area)}
                                  sx={{
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
                                    textShadow:
                                      "2px 2px 4px rgba(0, 0, 0, 0.5)",
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
                                      color: "white",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      handleDeleteAreaClick(
                                        e,
                                        module.modulename,
                                        area.categoryname,
                                        area
                                      ); // Call a function to delete the area when delete icon is clicked
                                    }}
                                  />
                                </Box>
                              ))}
                          </Box>
                          {/* Render the pop-up */}
                          {showPopup && selection && (
                            <Dialog
                              open={showPopup}
                              onClose={handleClosePopupForm}
                              maxWidth="md" // Adjust maxWidth as needed
                              //fullWidth
                              PaperProps={{
                                sx: {
                                  padding: "15px", // Add padding in the four corners
                                  borderRadius: 2,
                                  overflowX: "hidden", // Hide horizontal overflow
                                },
                              }}
                            >
                              <Container>
                                <Box className="addIssue">
                                  <form
                                    onSubmit={(event) => {
                                      handleAddIssue(event, module);
                                    }}
                                  >
                                    {!categorySubmitted && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          //color="textSecondary"
                                          component="h2"
                                          gutterBottom
                                          fontWeight={800}
                                          sx={{
                                            paddingBottom: "0.8rem",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          Name of the Selected Snippet
                                        </Typography>
                                        <TextField
                                          label={"Snippet Name"}
                                          id="issue"
                                          value={categoryname}
                                          onChange={(e) => {
                                            setCategoryname(e.target.value);
                                          }}
                                        />
                                        &nbsp;&nbsp;
                                        <Button
                                          variant="contained"
                                          onClick={handleAddCategory}
                                          style={{
                                            backgroundImage:
                                              "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                                          }}
                                        >
                                          Add Category
                                          <AddCircleOutlineOutlinedIcon
                                            fontSize="medium"
                                            sx={{ paddingLeft: "0.2rem" }}
                                          />
                                        </Button>
                                      </Box>
                                    )}
                                    {categorySubmitted && (
                                      <div style={{ width: "32rem" }}>
                                        <>
                                          <Typography
                                            variant="h6"
                                            //color="textSecondary"
                                            component="h2"
                                            gutterBottom
                                            fontWeight={900}
                                          >
                                            Current Snippet Name &nbsp;
                                            <span style={{ color: "red" }}>
                                              {categoryname}
                                            </span>
                                          </Typography>
                                          <br />
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
                                              style={{ width: "50%" }}
                                              value={issueName}
                                              onChange={(e) =>
                                                setIssueName(e.target.value)
                                              }
                                            />
                                            <br />
                                            <Dropdown
                                              label={"Severity"}
                                              select
                                              formstyle={{ width: "50%" }}
                                              value={severity}
                                              list={[
                                                "Critical",
                                                "Major",
                                                "Minor",
                                              ]}
                                              onChange={(e) =>
                                                setSeverity(e.target.value)
                                              }
                                            />
                                            &nbsp;
                                            <Button
                                              variant="contained"
                                              style={{
                                                backgroundImage:
                                                  "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                                              }}
                                              type="submit"
                                            >
                                              Add Issue&nbsp;
                                              <AddCircleOutlineOutlinedIcon
                                                fontSize="medium"
                                                sx={{ paddingLeft: "0.2rem" }}
                                              />
                                            </Button>
                                          </Box>
                                          &nbsp;&nbsp;
                                          <Table
                                            rows={issues}
                                            isDeleteDialog={true}
                                            setRows={setIssues}
                                            savetoDatabse={handleEditIssue}
                                            deleteFromDatabase={
                                              handleDeleteIssue
                                            }
                                            columns={columns}
                                            editActive={true}
                                            tablename={
                                              "Existing Issues"
                                            } /*style={}*/
                                          />
                                        </>
                                      </div>
                                    )}
                                  </form>
                                </Box>
                              </Container>
                            </Dialog>
                          )}
                        </Box>
                      </TabPanel>
                    ))}
                  </Box>
                </TabContext>
              )}
            </Box>
            <CustomDialog
              open={deleteDialog}
              setOpen={setDeleteDialog}
              proceedButtonText={"Delete"}
              proceedButtonClick={handleDeleteAreaConfirm}
              cancelButtonText="Cancel"
            />

            <Snackbar
              openPopup={dialogPopup}
              snackbarSeverity={snackbarSeverity}
              setOpenPopup={setDialogPopup}
              dialogMessage={dialogMessage}
            />
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
              open={deleteModuleDialog}
              setOpen={setDeleteModuleDialog}
              proceedButtonText={"Delete"}
              proceedButtonClick={handleDeleteModuleConfirm}
              cancelButtonText="Cancel"
            />
            <CustomDialog
              open={updateModuleDialog}
              setOpen={setUpdateModuleDialog}
              proceedButtonText={"Update"}
              proceedButtonClick={handleUpdateModuleConfirm}
              cancelButtonText="Cancel"
            />
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
              <Container sx={{ display: "flex", flexDirection: "column" }}>
                &nbsp;
                <TextField
                  label={"New Module Name"}
                  id="module"
                  value={updatedModuleName}
                  onChange={(e) => {
                    setUpdateModuleName(e.target.value);
                  }}
                />
                &nbsp;
                <Button variant="contained" onClick={handleModuleProceed}>
                  Update Module Name
                </Button>
                &nbsp;
              </Container>
            </Dialog>
          </Box>
        )}
    </div>
  );
}
