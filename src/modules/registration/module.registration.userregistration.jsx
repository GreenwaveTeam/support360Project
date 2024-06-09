import React, { useEffect, useState } from "react";
import {
  Avatar,
  CssBaseline,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Slide,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  ListItemText,
  Chip,
} from "@mui/material";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import {
  extendTokenExpiration,
  fetchPagesByRole,
} from "../helper/Support360Api";
import axios from "axios";

export default function UserRegistration({ sendUrllist }) {
  const [newPlantName, setNewPlantName] = useState({
    plantName: "",
    plantID: "",
    address: "",
    customerName: "",
    division: "",
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
    projectName: "",
  });

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    designation: "",
    email: "",
    password: "",
    phoneNumber: "",
    plantID: "",
    plantName: newPlantName.plantName,
    address: "",
    division: "",
    customerName: "",
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
    // supportStartDate: "",
    // supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
    homepage: "",
    projectName: [],
  });

  const [formErrors, setFormErrors] = useState({
    userId: false,
    name: false,
    designation: false,
    email: false,
    password: false,
    phoneNumber: false,
    plantID: false,
    plantName: false,
    address: false,
    division: false,
    customerName: false,
    // supportStartDate: false,
    // supportEndDate: false,
    accountOwnerCustomer: false,
    accountOwnerGW: false,
    role: false,
    homepage: false,
    confirmPassword: false,
    phoneNumberLength: false,
    passwordNotMatch: false,
    weakPassword: false,
    projectName: false,
    invalidEmailForEmailField: false,
    invalidEmailForAccountOwnerGW: false,
    invalidEmailForAccountOwnerCustomer: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    userId: "",
    name: "",
    designation: "",
    email: "",
    phoneNumber: "",
    plantID: "",
    plantName: newPlantName.plantName,
    address: "",
    division: "",
    customerName: "",
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
    // supportStartDate: "",
    // supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
    homepage: "",
    projectName: [],
  });

  const [updateFormErrors, setUpdateFormErrors] = useState({
    userId: false,
    name: false,
    designation: false,
    email: false,
    password: false,
    phoneNumber: false,
    plantID: false,
    plantName: false,
    address: false,
    division: false,
    customerName: false,
    // supportStartDate: false,
    // supportEndDate: false,
    accountOwnerCustomer: false,
    accountOwnerGW: false,
    role: false,
    homepage: false,
    confirmPassword: false,
    phoneNumberLength: false,
    passwordNotMatch: false,
    projectName: false,
    invalidEmailForAccountOwnerGW: false,
    invalidEmailForAccountOwnerCustomer: false,
  });

  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [plantList, setPlantList] = useState([]);
  // const [userExist, setUserExist] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const navigate = useNavigate();
  const [isStatePresent, setIsStatePresent] = useState(false);
  const [unchangedUserID, setUnchangedUserID] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [homePageNames, setHomePageNames] = useState([]);
  const [updateHomePageNames, setUpdateHomePageNames] = useState([]);

  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");

  const [passwordErrorOpen, setPasswordErrorOpen] = useState(false);

  const DB_IP = process.env.REACT_APP_SERVERIP;

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPasswordErrorOpen(false);
  };

  const handleClick = () => {
    setPasswordErrorOpen(true);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const { state } = useLocation();

  const checkstate = () => {
    // console.log(typeof state.user);
    if (state === null) {
      setIsStatePresent(false);
    } else {
      setIsStatePresent(true);
      setUpdateFormData({
        userId: state.user.userId,
        name: state.user.name,
        designation: state.user.designation,
        email: state.user.email,
        phoneNumber: state.user.phoneNumber,
        plantID: state.user.plantID,
        plantName: state.user.plantName,
        address: state.user.address,
        division: state.user.division,
        customerName: state.user.customerName,
        // supportStartDate: state.user.supportStartDate,
        // supportEndDate: state.user.supportEndDate,
        accountOwnerCustomer: state.user.accountOwnerCustomer,
        accountOwnerGW: state.user.accountOwnerGW,
        role: state.user.role,
        homepage: state.user.homepage,
        projectName: state.user.projectName,
      });
      fetchProjects(state.user.plantID);
    }
  };

  const location = useLocation();
  const currentPageLocation = useLocation().pathname;

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const [isRoleChanged, setIsRoleChanged] = useState(false);
  const [allCustomerAccountEmailList, setAllCustomerAccountEmailList] =
    useState([]);
  const [allGWAccountEmailList, setAllGWAccountEmailList] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // console.log("user : ", state.user);
    extendTokenExpiration();
    checkstate();
    fetchPlantData();
    fetchRoles();
    sendUrllist(urllist);
    const fetchData = async () => {
      if (formData.role) {
        const pages = await fetchPagesByRole(formData.role);
        setHomePageNames(pages);
      }
    };
    fetchData();
    fetchUser();
    fetchAllEmails();
    // fetchProjects();
  }, [formData.role]);

  const fetchAllEmails = async () => {
    try {
      const response = await fetch(`http://${DB_IP}/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("fetchAllEmails data : ", data);
      // setAllAccountEmailList(data.map((user) => user.email));
      setAllCustomerAccountEmailList(
        data
          .map((user) => user.email)
          .filter((email) => !email.endsWith("@greenwave.co.in"))
      );
      setAllGWAccountEmailList(
        data
          .map((user) => user.email)
          .filter((email) => email.endsWith("@greenwave.co.in"))
      );
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchUser = async () => {
    console.log("expire : ", localStorage.getItem("expire"));
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("fetchUser data : ", data);
      console.log("fetchUser email : ", data.email);

      let role = data.role;
      console.log("Role Test : ", role);
      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchDivs = async (role) => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
      console.log("Currently passed Data : ", location.state);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        navigate("/*");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
        console.log("data.components.length : ", data.components.length);
        if (data.components.length === 0) {
          navigate("/*");
        }
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      if (fetchDivs.length === 0) {
        navigate("/*");
      }
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  const fetchUpdateData = async (selectedRole) => {
    console.log("fetchUpdateData called");
    const pages = await fetchPagesByRole(selectedRole);
    console.log("updateFormData.role : ", selectedRole);
    setUpdateHomePageNames(pages);
  };

  const urllist =
    state === null
      ? [
          { pageName: "Admin Home", pagelink: "/admin/home" },
          {
            pageName: "User Registration",
            pagelink: "/admin/userregistration",
          },
        ]
      : [
          { pageName: "Admin Home", pagelink: "/admin/home" },
          { pageName: "User Update", pagelink: "/admin/userregistration" },
        ];

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  function convertToTitleCase(str) {
    let words = str.split(/(?=[A-Z])/);
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  function removeSpaceAndLowerCase(str) {
    return str.replace(/\s/g, "").toLowerCase();
  }

  function removeAllSpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z\s]/g, "");
    var stringWithoutExtraSpaces = stringWithoutSpecialChars.replace(
      /\s+/g,
      " "
    );
    return stringWithoutExtraSpaces;
  }

  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  function removeOnlySpecialCharExceptAtTheRate(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z@.]/g, "");
    var atIndex = stringWithoutSpecialChars.indexOf("@");
    if (atIndex !== -1) {
      var nextAtIndex = stringWithoutSpecialChars.indexOf("@", atIndex + 1);
      if (nextAtIndex !== -1) {
        stringWithoutSpecialChars = stringWithoutSpecialChars.slice(
          0,
          nextAtIndex
        );
      }
    }
    return stringWithoutSpecialChars;
  }

  function removeOnlySpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9@.]/g, "");
    var atIndex = stringWithoutSpecialChars.indexOf("@");
    if (atIndex !== -1) {
      var nextAtIndex = stringWithoutSpecialChars.indexOf("@", atIndex + 1);
      if (nextAtIndex !== -1) {
        stringWithoutSpecialChars = stringWithoutSpecialChars.slice(
          0,
          nextAtIndex
        );
      }
    }
    return stringWithoutSpecialChars;
  }

  function removeOnlySpecialCharforplantid(str) {
    // var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9]/g, "");
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9]/g, "");
    return stringWithoutSpecialChars;
  }

  function removeNumberAndSpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z@.]/g, "");
    var atIndex = stringWithoutSpecialChars.indexOf("@");
    if (atIndex !== -1) {
      var nextAtIndex = stringWithoutSpecialChars.indexOf("@", atIndex + 1);
      if (nextAtIndex !== -1) {
        stringWithoutSpecialChars = stringWithoutSpecialChars.slice(
          0,
          nextAtIndex
        );
      }
    }
    return stringWithoutSpecialChars;
  }

  function removeAllExceptNumber(str) {
    var stringWithOnlyNumber = str.replace(/[^0-9]/g, "");
    return stringWithOnlyNumber;
  }

  const handleAddPlantClick = () => {
    setOpenDeleteDialog(true);
  };

  const handlenewPlantNameInputChangeForAll = () => {
    // plantName: "",
    // plantID: "",
    // address: "",
    // customerName: "",
    // division: "",
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
    setUpdateFormData({
      ...updateFormData,
      plantName: newPlantName.plantName,
      plantID: newPlantName.plantID,
      address: newPlantName.address,
      customerName: newPlantName.customerName,
      division: newPlantName.division,
      // supportStartDate: newPlantName.supportStartDate,
      // supportEndDate: newPlantName.supportEndDate,
      projectName: newPlantName.projectName,
    });
    setFormData({
      ...formData,
      plantName: newPlantName.plantName,
      plantID: newPlantName.plantID,
      address: newPlantName.address,
      customerName: newPlantName.customerName,
      division: newPlantName.division,
      // supportStartDate: newPlantName.supportStartDate,
      // supportEndDate: newPlantName.supportEndDate,
      projectName: newPlantName.projectName,
    });
  };

  const updateHandleFormdataInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const updateHandleHomepageChange = (e) => {
    const { value } = e.target;
    setUpdateFormData({ ...updateFormData, homepage: value });
  };

  const confirmPassword = async (e) => {
    const passwordsMatch = pass === e;
    if (!passwordsMatch) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
    }
  };

  const convertToInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    } else if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  function removeLeadingSlash(path) {
    if (path.startsWith("/")) {
      return path.substring(1);
    }
    return path;
  }

  const fetchPlantData = async () => {
    try {
      const response = await fetch(`http://${DB_IP}/plants/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        navigate("/admin/home");
        return;
      }
      const data = await response.json();
      console.log("plantDetails : ", data);
      const filteredPlantList = data.filter(
        (plant) => plant.plantName !== "NA"
      );
      console.log("filteredPlantList : ", filteredPlantList);
      setPlantList(filteredPlantList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://${DB_IP}/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        console.log("error featching roles");
        return;
      }
      const data = await response.json();
      console.log("Roles : ", data);
      setRoleList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postPlantName = async () => {
    if (
      plantList.some(
        (p) =>
          p.plantName.toLowerCase().trim() ===
          newPlantName.plantName.toLowerCase().trim()
      )
    ) {
      handleClick();
      setSnackbarText("Plant name already exist");
      setsnackbarSeverity("error");
      return;
    }
    if (
      plantList.some(
        (p) =>
          p.plantID.toLowerCase().trim() ===
          newPlantName.plantID.toLowerCase().trim()
      )
    ) {
      handleClick();
      setSnackbarText("Plant Id already exist");
      setsnackbarSeverity("error");
      return;
    }
    try {
      const response = await fetch(`http://${DB_IP}/plants/plant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlantName),
      });
      if (response.status === 201) {
        setOpenDeleteDialog(false);
        console.log("Plant Added successfully : ", newPlantName);
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("success");
      } else {
        console.error("Failed to Add Plant");
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    fetchPlantData();
  };

  const handleAutocompleteChange = (e, newValue) => {
    if (newValue) {
      const selectedPlant = plantList.find(
        (plant) => plant.plantName === newValue
      );
      console.log("selectedPlant : ", selectedPlant);
      fetchProjects(selectedPlant.plantID);
      setFormData({
        ...formData,
        plantID: selectedPlant ? selectedPlant.plantID : "",
        plantName: newValue,
        address: selectedPlant ? selectedPlant.address : "",
        customerName: selectedPlant ? selectedPlant.customerName : "",
        division: selectedPlant ? selectedPlant.division : "",
        projectName: [],
        // supportStartDate: selectedPlant ? selectedPlant.supportStartDate : "",
        // supportEndDate: selectedPlant ? selectedPlant.supportEndDate : "",
      });
      setUpdateFormData({
        ...updateFormData,
        plantID: selectedPlant ? selectedPlant.plantID : "",
        plantName: newValue,
        address: selectedPlant ? selectedPlant.address : "",
        customerName: selectedPlant ? selectedPlant.customerName : "",
        division: selectedPlant ? selectedPlant.division : "",
        projectName: [],
        // supportStartDate: selectedPlant ? selectedPlant.supportStartDate : "",
        // supportEndDate: selectedPlant ? selectedPlant.supportEndDate : "",
      });
    } else {
      setFormData({
        ...formData,
        plantID: "",
        plantName: "",
        address: "",
        customerName: "",
        division: "",
        projectName: [],
        // supportStartDate: "",
        // supportEndDate: "",
      });
      setUpdateFormData({
        ...updateFormData,
        plantID: "",
        plantName: "",
        address: "",
        customerName: "",
        division: "",
        projectName: [],
        // supportStartDate: "",
        // supportEndDate: "",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    for (const key in updateFormData) {
      if (updateFormData[key] === null || updateFormData[key] === "") {
        handleClick();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${convertToTitleCase(key)} must be filled`);
        setUpdateFormErrors({ ...updateFormErrors, [key]: true });
        return;
      }
    }
    // if (updateFormData.supportStartDate > updateFormData.supportEndDate) {
    //   handleClick();
    //   setSnackbarText(
    //     "Support Start Date should not be Greater than Support End Date !"
    //   );
    //   setsnackbarSeverity("error");
    //   return;
    // }
    if (updateFormData.projectName.length === 0) {
      handleClick();
      setSnackbarText("ProjectName must be filled");
      setsnackbarSeverity("error");
      return;
    }

    if (!isValidEmail(updateFormData.accountOwnerCustomer)) {
      handleClick();
      setSnackbarText("Account Owner Customer Email is not valid");
      setsnackbarSeverity("error");
      return;
    }

    if (!isValidEmail(updateFormData.accountOwnerGW)) {
      handleClick();
      setSnackbarText("Account Owner GW Email is not valid");
      setsnackbarSeverity("error");
      return;
    }

    try {
      console.log(
        "updateFormData.userId : ",
        `http://${DB_IP}/users/user/${updateFormData.userId}`
      );
      console.log("updateFormData : ", updateFormData);
      const response = await fetch(
        `http://${DB_IP}/users/user/${updateFormData.userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateFormData),
        }
      );
      if (response.ok) {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("success");
        navigate(`/admin/home`);
      } else {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("error");
        return;
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("formData : : ", formData);
  //   try {
  //     const response = await fetch("http://localhost:8081/auth/user/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     if (response.ok) {
  //       console.log("User registered successfully");
  //       navigate("/admin/home");
  //     } else if (response.status === 400) {
  //       console.error("User Already Exist");
  //     } else {
  //       console.error("Failed to register user");
  //     }
  //   } catch (error) {
  //     console.error("Error : ", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === null || formData[key] === "") {
        newFormErrors[key] = true;
      } else if (cnfpass === "") {
        setFormErrors({ ...formErrors, confirmPassword: cnfpass === "" });
      } else if (formData.phoneNumber.length !== 10) {
        setFormErrors({ ...formErrors, phoneNumberLength: true });
      } else if (pass !== cnfpass) {
        setFormErrors({ ...formErrors, passwordNotMatch: true });
      } else {
        newFormErrors[key] = false;
      }
    });
    setFormErrors(newFormErrors);

    for (const key in formData) {
      if (formData[key] === null || formData[key] === "") {
        handleClick();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${convertToTitleCase(key)} must be filled`);
        setFormErrors({ ...formErrors, [key]: true });
        return;
      }
    }

    if (!validatePassword(pass)) {
      handleClick();
      setSnackbarText(
        "Password must contain at least 6 characters, including uppercase, lowercase, numeric, and special characters"
      );
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, weakPassword: true });
      return;
    }

    if (formData["phoneNumber"].length !== 10) {
      handleClick();
      setSnackbarText("Phone Number must be 10 digits");
      setsnackbarSeverity("error");
      console.log("Phone Number must be 10 digits");
      setFormErrors({ ...formErrors, phoneNumberLength: true });
      return;
    }

    if (cnfpass === "") {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, confirmPassword: true });
      return;
    }

    if (pass !== cnfpass) {
      handleClick();
      setSnackbarText("Password does not match !");
      setsnackbarSeverity("error");
      setFormErrors({ ...formErrors, passwordNotMatch: true });
      return;
    }

    if (formData.projectName.length === 0) {
      handleClick();
      setSnackbarText("ProjectName must be filled");
      setsnackbarSeverity("error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      handleClick();
      setSnackbarText("Email is not valid");
      setsnackbarSeverity("error");
      return;
    }

    if (!isValidEmail(formData.accountOwnerCustomer)) {
      handleClick();
      setSnackbarText("Account Owner Customer Email is not valid");
      setsnackbarSeverity("error");
      return;
    }

    if (!isValidEmail(formData.accountOwnerGW)) {
      handleClick();
      setSnackbarText("Account Owner GW Email is not valid");
      setsnackbarSeverity("error");
      return;
    }

    // if (formData.supportStartDate > formData.supportEndDate) {
    //   handleClick();
    //   setSnackbarText(
    //     "Support Start Date should not be Greater than Support End Date !"
    //   );
    //   setsnackbarSeverity("error");
    //   return;
    // }

    console.log("formData : : ", formData);
    try {
      const response = await fetch(`http://${DB_IP}/auth/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("success");
        navigate(`/admin/home`);
      } else {
        const text = await response.text();
        handleClick();
        setSnackbarText(text);
        setsnackbarSeverity("error");
        return;
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const fetchProjects = async (selectedPlantid) => {
    console.log("fetchProjects selectedPlantid : ", selectedPlantid);

    try {
      const response = await axios.get(
        `http://${DB_IP}/plants/projectDetails`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const filteredProjects = response.data.filter(
        (project) => project.plant_id === selectedPlantid
      );

      console.log("fetchProjects : ", response.data);
      const projectNames = filteredProjects.map(
        (project) => project.project_name
      );
      console.log("projectNames : ", projectNames);
      setProjects(projectNames);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  return (
    <>
      {divIsVisibleList && divIsVisibleList.includes("user-registration") && (
        <>
          <Box sx={{ display: "flex" }}>
            <Container component="main" maxWidth="md">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {isStatePresent ? (
                  // update form starts here...
                  <>
                    <Avatar
                      sx={{
                        backgroundImage:
                          "linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);",
                        width: "45px !important",
                        height: "45px !important",
                      }}
                    >
                      {convertToInitials(updateFormData.name)}
                    </Avatar>
                    <br></br>
                    <Typography component="h1" variant="h5">
                      Update for :{"  "}
                      <Typography
                        component="span"
                        variant="h4"
                        sx={{ fontWeight: "bold" }}
                      >
                        {updateFormData.userId}
                      </Typography>
                    </Typography>
                    <form>
                      <Box noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Textfield
                              name="name"
                              required
                              fullWidth
                              id="name"
                              label="Name"
                              autoFocus
                              value={updateFormData.name}
                              onBlur={(e) => {
                                setUpdateFormData({
                                  ...updateFormData,
                                  name: capitalizeWords(e.target.value.trim()),
                                });
                              }}
                              onChange={(e) => {
                                setUpdateFormData({
                                  ...updateFormData,
                                  name: removeAllSpecialChar(e.target.value),
                                });
                                setUpdateFormErrors({
                                  ...updateFormErrors,
                                  name: e.target.value.trim() === "",
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            {/* <Dropdown
                        id="designation"
                        value={updateFormData.designation}
                        label="Designation"
                        onChange={updateHandleDesignationChange}
                        list={[
                          "Operator",
                          "Supervisor",
                          "Lab Tester",
                          "Engineer",
                        ]}
                        fullWidth
                      /> */}
                            <FormControl
                              fullWidth
                              error={updateFormErrors.designation}
                            >
                              <InputLabel id="designation-label">
                                Designation
                              </InputLabel>
                              <Select
                                labelId="designation-label"
                                label="Designation"
                                id="designation"
                                value={updateFormData.designation}
                                onChange={(e) => {
                                  const selectedDesignation = e.target.value;
                                  setUpdateFormData({
                                    ...updateFormData,
                                    designation: selectedDesignation,
                                  });
                                  if (selectedDesignation !== "") {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      designation: false,
                                    });
                                  } else {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      designation: true,
                                    });
                                  }
                                }}
                              >
                                <MenuItem value="Operator">Operator</MenuItem>
                                <MenuItem value="Supervisor">
                                  Supervisor
                                </MenuItem>
                                <MenuItem value="Lab Tester">
                                  Lab Tester
                                </MenuItem>
                              </Select>
                              {updateFormErrors.designation && (
                                <FormHelperText>
                                  Designation must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              InputProps={{ readOnly: true }}
                              required
                              fullWidth
                              id="email"
                              type="email"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                              value={updateFormData.email}
                              // onChange={handleEmailChange}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              InputProps={{ readOnly: true }}
                              autoComplete="userId"
                              name="userId"
                              required
                              fullWidth
                              id="userId"
                              label="User ID"
                              value={updateFormData.userId}
                              // onChange={handleUserIDChange}
                            />
                          </Grid>
                          {/* {!userExist && (
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          label="Password"
                          autoComplete="password"
                          name="password"
                          required
                          fullWidth
                          id="password"
                          // label="Password"
                          value={pass}
                          onChange={hashedPasswordChange}
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {!userExist && (
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={cnfpass}
                        onBlur={(e) => confirmPassword(e.target.value)}
                        onChange={(e) => {
                          const confirmPass = e.target.value;
                          setCnfpass(confirmPass);
                        }}
                      />
                      {showPasswordError && (
                        <Stack
                          sx={{ display: "flex", justifyContent: "right" }}
                          spacing={2}
                        >
                          <Alert variant="filled" severity="error">
                            Password Does Not Match
                          </Alert>
                        </Stack>
                      )}
                    </Grid>
                    {showPasswordError && (
                <Box
                  sx={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 9999,
                  }}
                >
                  <Alert variant="filled" severity="error">
                    Password Does Not Match
                  </Alert>
                </Box>
              )} */}
                          <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              name="phoneNumber"
                              label="Phone Number"
                              id="phoneNumber"
                              autoComplete="phoneNumber"
                              value={updateFormData.phoneNumber}
                              onBlur={(e) => {
                                setUpdateFormData({
                                  ...updateFormData,
                                  phoneNumber: e.target.value.trim(),
                                });
                              }}
                              onChange={(e) => {
                                const isValidPhoneNumber =
                                  !isNaN(e.target.value) &&
                                  e.target.value.length <= 10;
                                const isPhoneNumberFilled =
                                  e.target.value.trim() === "";
                                const isPhoneNumberLengthValid =
                                  e.target.value.length <= 9;
                                setUpdateFormData({
                                  ...updateFormData,
                                  phoneNumber: isValidPhoneNumber
                                    ? removeAllExceptNumber(e.target.value)
                                    : updateFormData.phoneNumber,
                                });
                                setUpdateFormErrors({
                                  ...updateFormErrors,
                                  phoneNumber: isPhoneNumberFilled,
                                  phoneNumberLength: isPhoneNumberLengthValid,
                                });
                              }}
                              error={
                                updateFormErrors.phoneNumber ||
                                updateFormErrors.phoneNumberLength
                              }
                              helperText={
                                (updateFormErrors.phoneNumber &&
                                  "Phone Number must be filled") ||
                                (updateFormErrors.phoneNumberLength &&
                                  "Phone Number must be 10 digits")
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              name="accountOwnerCustomer"
                              label="Account Owner Customer"
                              id="accountOwnerCustomer"
                              autoComplete="accountOwnerCustomer"
                              value={updateFormData.accountOwnerCustomer}
                              onBlur={(e) => {
                                setUpdateFormData({
                                  ...updateFormData,
                                  accountOwnerCustomer: e.target.value.trim(),
                                });
                              }}
                              onChange={updateHandleFormdataInputChange}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              name="accountOwnerGW"
                              label="Account Owner GW"
                              id="accountOwnerGW"
                              autoComplete="accountOwnerGW"
                              value={updateFormData.accountOwnerGW}
                              onBlur={(e) => {
                                setUpdateFormData({
                                  ...updateFormData,
                                  accountOwnerGW: e.target.value.trim(),
                                });
                              }}
                              onChange={updateHandleFormdataInputChange}
                            />
                          </Grid> */}
                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              error={
                                updateFormErrors.accountOwnerCustomer ||
                                updateFormErrors.invalidEmailForAccountOwnerCustomer
                              }
                            >
                              <Autocomplete
                                id="updateAccountOwnerCustomer"
                                options={allCustomerAccountEmailList}
                                value={updateFormData.accountOwnerCustomer}
                                onChange={(event, newValue) => {
                                  setUpdateFormData({
                                    ...updateFormData,
                                    accountOwnerCustomer: newValue,
                                  });
                                  // setUpdateFormErrors({
                                  //   ...updateFormErrors,
                                  //   invalidEmailForAccountOwnerCustomer:
                                  //     !isValidEmail(newValue),
                                  // });
                                  if (
                                    newValue !== null &&
                                    newValue !== "" &&
                                    isValidEmail(newValue)
                                  ) {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      accountOwnerCustomer: false,
                                      invalidEmailForAccountOwnerCustomer: false,
                                    });
                                  } else {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      accountOwnerCustomer: true,
                                    });
                                  }
                                }}
                                onInputChange={(event, newInputValue) => {
                                  // Save the new input value even if it's not in the options list
                                  setUpdateFormData({
                                    ...updateFormData,
                                    accountOwnerCustomer: newInputValue,
                                  });
                                  // Remove the error when the user starts typing manually
                                  setUpdateFormErrors({
                                    ...updateFormErrors,
                                    accountOwnerCustomer: false,
                                  });
                                  setUpdateFormErrors({
                                    ...updateFormErrors,
                                    invalidEmailForAccountOwnerCustomer:
                                      !isValidEmail(newInputValue),
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Account Owner Customer"
                                    error={
                                      updateFormErrors.accountOwnerCustomer ||
                                      updateFormErrors.invalidEmailForAccountOwnerCustomer
                                    }
                                    helperText={
                                      (updateFormErrors.accountOwnerCustomer &&
                                        "Account Owner Customer must be filled") ||
                                      (updateFormErrors.invalidEmailForAccountOwnerCustomer &&
                                        "Account Owner Customer Email is not valid")
                                    }
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              error={
                                updateFormErrors.accountOwnerGW ||
                                updateFormErrors.invalidEmailForAccountOwnerGW
                              }
                            >
                              <Autocomplete
                                id="updateAccountOwnerGW"
                                options={allGWAccountEmailList}
                                value={updateFormData.accountOwnerGW}
                                onChange={(event, newValue) => {
                                  setUpdateFormData({
                                    ...updateFormData,
                                    accountOwnerGW: newValue,
                                  });
                                  // setUpdateFormErrors({
                                  //   ...updateFormErrors,
                                  //   invalidEmailForAccountOwnerGW:
                                  //     !isValidEmail(newValue),
                                  // });
                                  if (
                                    newValue !== null &&
                                    newValue !== "" &&
                                    isValidEmail(newValue)
                                  ) {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      accountOwnerGW: false,
                                      invalidEmailForAccountOwnerGW: false,
                                    });
                                  } else {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      accountOwnerGW: true,
                                    });
                                  }
                                }}
                                onInputChange={(event, newInputValue) => {
                                  // Save the new input value even if it's not in the options list
                                  setUpdateFormData({
                                    ...updateFormData,
                                    accountOwnerGW: newInputValue,
                                  });
                                  // Remove the error when the user starts typing manually
                                  setUpdateFormErrors({
                                    ...updateFormErrors,
                                    accountOwnerGW: false,
                                  });
                                  setUpdateFormErrors({
                                    ...updateFormErrors,
                                    invalidEmailForAccountOwnerGW:
                                      !isValidEmail(newInputValue),
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Account Owner GW"
                                    error={
                                      updateFormErrors.accountOwnerGW ||
                                      updateFormErrors.invalidEmailForAccountOwnerGW
                                    }
                                    helperText={
                                      (updateFormErrors.accountOwnerGW &&
                                        "Account Owner GW must be filled") ||
                                      (updateFormErrors.invalidEmailForAccountOwnerGW &&
                                        "Account Owner GW Email is not valid")
                                    }
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            {/* <Dropdown
                        fullWidth
                        id="role"
                        value={updateFormData.role}
                        label="Role"
                        onChange={(e) => {
                          const { value } = e.target;
                          for (let i of roleList) {
                            if (i === value) {
                              setUpdateFormData({
                                ...updateFormData,
                                role: value,
                              });
                              return;
                            }
                          }
                        }}
                        list={roleList.map((p) => p)}
                      /> */}
                            <FormControl
                              fullWidth
                              error={updateFormErrors.role}
                            >
                              <InputLabel id="role-label">Role</InputLabel>
                              <Select
                                labelId="role-label"
                                label="Role"
                                id="role"
                                value={updateFormData.role}
                                onChange={(e) => {
                                  setIsRoleChanged(true);
                                  const selectedRole = e.target.value;
                                  setUpdateFormData({
                                    ...updateFormData,
                                    role: selectedRole,
                                    homepage: "",
                                  });
                                  console.log(
                                    "updateFormData.homepage : : : ",
                                    updateFormData.homepage
                                  );
                                  if (selectedRole !== "") {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      role: false,
                                    });
                                  } else {
                                    setUpdateFormErrors({
                                      ...updateFormErrors,
                                      role: true,
                                    });
                                  }
                                  fetchUpdateData(selectedRole);
                                }}
                              >
                                {roleList.map((role) => (
                                  <MenuItem key={role} value={role}>
                                    {role}
                                  </MenuItem>
                                ))}
                              </Select>
                              {updateFormErrors.role && (
                                <FormHelperText>
                                  Role must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          {!isRoleChanged ? (
                            <>
                              <Grid item xs={6}>
                                <Tooltip title="change the role first">
                                  <TextField
                                    name="homepage"
                                    required
                                    fullWidth
                                    id="homepage"
                                    label="Homepage"
                                    autoFocus
                                    value={updateFormData.homepage}
                                    InputProps={{ readOnly: true }}
                                  />
                                </Tooltip>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid item xs={6}>
                                {/* <Dropdown
                        fullWidth
                        id="homepage"
                        value={updateFormData.homepage}
                        label="Homepage"
                        onChange={updateHandleHomepageChange}
                        list={["admin/home", "user/home"]}
                      /> */}
                                <FormControl
                                  fullWidth
                                  error={updateFormErrors.homepage}
                                >
                                  <InputLabel id="homepage-label">
                                    Homepage
                                  </InputLabel>
                                  <Select
                                    labelId="homepage-label"
                                    label="Homepage"
                                    id="homepage"
                                    value={updateFormData.homepage}
                                    onChange={(e) => {
                                      const selectedHomepage = e.target.value;
                                      setUpdateFormData({
                                        ...updateFormData,
                                        homepage: selectedHomepage,
                                      });
                                      console.log(
                                        "homepage updated to : ",
                                        selectedHomepage
                                      );
                                      if (
                                        selectedHomepage !== "" ||
                                        updateFormData.homepage !== ""
                                      ) {
                                        setUpdateFormErrors({
                                          ...updateFormErrors,
                                          homepage: false,
                                        });
                                      } else {
                                        setUpdateFormErrors({
                                          ...updateFormErrors,
                                          homepage: true,
                                        });
                                      }
                                    }}
                                  >
                                    {/* <MenuItem value="admin/home">admin/home</MenuItem>
                          <MenuItem value="user/home">user/home</MenuItem> */}
                                    {updateHomePageNames.map((page) => (
                                      <MenuItem
                                        defaultValue={removeLeadingSlash(
                                          updateHomePageNames[0]
                                        )}
                                        key={page}
                                        value={removeLeadingSlash(page)}
                                      >
                                        {removeLeadingSlash(page)}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {updateFormErrors.homepage && (
                                    <FormHelperText>
                                      Homepage must be filled
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </>
                          )}
                          <Grid item xs={6}>
                            <Autocomplete
                              value={
                                updateFormData.plantName +
                                " (" +
                                updateFormData.plantID +
                                ")"
                              }
                              disablePortal
                              fullWidth
                              id="plantName"
                              options={plantList.map((p, index) => p.plantName)}
                              getOptionLabel={(option) => option}
                              onChange={handleAutocompleteChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Plant Name"
                                  error={updateFormErrors.plantName}
                                  helperText={
                                    updateFormErrors.plantName &&
                                    "Plant Name must be filled"
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              error={updateFormErrors.plantID}
                            >
                              <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                              <OutlinedInput
                                inputProps={{
                                  readOnly: true,
                                }}
                                label="PlantID"
                                autoComplete="PlantID"
                                name="PlantID"
                                required
                                fullWidth
                                id="PlantID"
                                value={updateFormData.plantID}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Add Plant">
                                      <IconButton
                                        onClick={handleAddPlantClick}
                                        edge="end"
                                      >
                                        <AddCircleOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                              />
                              {updateFormErrors.plantID && (
                                <FormHelperText>
                                  Plant ID must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="address"
                              label="Address"
                              id="address"
                              autoComplete="address"
                              value={updateFormData.address}
                              // onChange={(e) => {
                              //   setupdateFormData({
                              //     ...updateFormData,
                              //     address: e.target.value,
                              //   });
                              //   setupdateFormErrors({
                              //     ...updateFormErrors,
                              //     address: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={updateFormErrors.address}
                              helperText={
                                updateFormErrors.address &&
                                "Address must be filled"
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="division"
                              label="Division"
                              id="division"
                              autoComplete="division"
                              value={updateFormData.division}
                              // onChange={(e) => {
                              //   setupdateFormData({
                              //     ...updateFormData,
                              //     division: e.target.value,
                              //   });
                              //   setupdateFormErrors({
                              //     ...updateFormErrors,
                              //     division: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={updateFormErrors.division}
                              helperText={
                                updateFormErrors.division &&
                                "Division must be filled"
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="customer"
                              label="Customer"
                              id="customer"
                              autoComplete="customer"
                              value={updateFormData.customerName}
                              // onChange={(e) => {
                              //   setupdateFormData({
                              //     ...updateFormData,
                              //     customerName: removeAllSpecialChar(e.target.value),
                              //   });
                              //   setupdateFormErrors({
                              //     ...updateFormErrors,
                              //     customerName: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={updateFormErrors.customerName}
                              helperText={
                                updateFormErrors.customerName &&
                                "Customer Name must be filled"
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="project-select-label">
                                Project Name
                              </InputLabel>
                              <Select
                                labelId="project-select-label"
                                label="Project Name"
                                multiple
                                value={updateFormData.projectName || []}
                                onChange={(event) => {
                                  setUpdateFormData({
                                    ...updateFormData,
                                    projectName: event.target.value,
                                  });
                                }}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                {projects.map((project) => (
                                  <MenuItem key={project} value={project}>
                                    <Checkbox
                                      checked={
                                        updateFormData.projectName.indexOf(
                                          project
                                        ) > -1
                                      }
                                    />
                                    <ListItemText primary={project} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          {/* <Grid item xs={6}>
                            <TextField
                              label="Project Name"
                              fullWidth
                              value={updateFormData.projectName}
                              onChange={(e) => {
                                setUpdateFormData({
                                  ...updateFormErrors,
                                  projectName: removeAllSpecialChar(
                                    e.target.value
                                  ),
                                });
                                setUpdateFormErrors({
                                  ...updateFormErrors,
                                  projectName: e.target.value.trim() === "",
                                });
                              }}
                            />
                          </Grid> */}
                          {/*<Grid item xs={6}>
                             <Datepicker
                        label="Support Start Date"
                        value={dayjs(updateFormData.supportStartDate)}
                        onChange={(startDate) =>
                          setupdateFormData({
                            ...updateFormData,
                            supportStartDate: startDate.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      /> */}
                          {/* <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="supportStartDate"
                              label="Support Start Date"
                              id="supportStartDate"
                              autoComplete="supportStartDate"
                              value={updateFormData.supportStartDate}
                              error={updateFormErrors.supportStartDate}
                              helperText={
                                updateFormErrors.supportStartDate &&
                                "Support Start Date must be filled"
                              }
                            />
                          </Grid> */}
                          {/* <Grid item xs={6}> */}
                          {/* <Datepicker
                        label="Support End Date"
                        value={dayjs(updateFormData.supportEndDate)}
                        onChange={(endDate) =>
                          setupdateFormData({
                            ...updateFormData,
                            supportEndDate: endDate.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      /> */}
                          {/* <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="supportEndDate"
                              label="Support End Date"
                              id="supportEndDate"
                              autoComplete="supportEndDate"
                              value={updateFormData.supportEndDate}
                              error={updateFormErrors.supportEndDate}
                              helperText={
                                updateFormErrors.supportEndDate &&
                                "Support End Date must be filled"
                              }
                            />
                          </Grid> */}
                        </Grid>
                        <Button
                          type="submit"
                          color="secondary"
                          fullWidth
                          startIcon={<SaveSharpIcon />}
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                          onClick={handleUpdate}
                        >
                          Update User
                        </Button>
                      </Box>
                    </form>
                  </>
                ) : (
                  // registration form starts here...

                  <>
                    <Avatar>{convertToInitials(formData.name)}</Avatar>
                    <br></br>
                    <Typography component="h1" variant="h5">
                      User Registration Page
                    </Typography>
                    <form>
                      <Box noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Textfield
                              name="name"
                              required
                              fullWidth
                              id="name"
                              label="Name"
                              autoFocus
                              value={formData.name}
                              onBlur={(e) => {
                                setFormData({
                                  ...formData,
                                  name: capitalizeWords(e.target.value.trim()),
                                });
                              }}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  name: removeAllSpecialChar(e.target.value),
                                });
                                setFormErrors({
                                  ...formErrors,
                                  name: e.target.value.trim() === "",
                                });
                              }}
                              error={formErrors.name}
                              helperText={
                                formErrors.name && "Name must be filled"
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                      <Dropdown
                        id="designation"
                        value={formData.designation}
                        label="Designation"
                        onChange={handleDesignationChange}
                        list={["Operator", "Supervisor", "Lab Tester"]}
                        fullWidth
                        error={formErrors.designation}
                        helperText={
                          formErrors.designation &&
                          "Designation must be filled"
                        }
                      />
                    </Grid> */}
                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              error={formErrors.designation}
                            >
                              <InputLabel id="designation-label">
                                Designation
                              </InputLabel>
                              <Select
                                labelId="designation-label"
                                label="Designation"
                                id="designation"
                                value={formData.designation}
                                onChange={(e) => {
                                  const selectedDesignation = e.target.value;
                                  setFormData({
                                    ...formData,
                                    designation: selectedDesignation,
                                  });
                                  if (selectedDesignation !== "") {
                                    setFormErrors({
                                      ...formErrors,
                                      designation: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      designation: true,
                                    });
                                  }
                                }}
                              >
                                <MenuItem value="Operator">Operator</MenuItem>
                                <MenuItem value="Supervisor">
                                  Supervisor
                                </MenuItem>
                                <MenuItem value="Lab Tester">
                                  Lab Tester
                                </MenuItem>
                              </Select>
                              {formErrors.designation && (
                                <FormHelperText>
                                  Designation must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              id="email"
                              type="email"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  email: removeNumberAndSpecialChar(
                                    removeSpaceAndLowerCase(
                                      e.target.value.trim()
                                    )
                                  ),
                                });
                                setFormErrors({
                                  ...formErrors,
                                  email: e.target.value.trim() === "",
                                });
                                setFormErrors({
                                  ...formErrors,
                                  invalidEmailForEmailField: !isValidEmail(
                                    e.target.value
                                  ),
                                });
                                console.log(
                                  "isValidEmail : ",
                                  isValidEmail(e.target.value)
                                );
                              }}
                              error={
                                formErrors.email ||
                                formErrors.invalidEmailForEmailField
                              }
                              helperText={
                                (formErrors.email && "Email must be filled") ||
                                (formErrors.invalidEmailForEmailField &&
                                  "Email is not valid")
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            {/* <FormControl fullWidth error={formErrors.userId}>
                        <InputLabel htmlFor="userId">UserID</InputLabel>
                        <OutlinedInput
                          autoComplete="userId"
                          name="userId"
                          required
                          fullWidth
                          id="userId"
                          label="User ID"
                          value={formData.userId}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              userId: removeOnlySpecialChar(e.target.value),
                            });
                            setUnchangedUserID(e.target.value);
                            setFormErrors({
                              ...formErrors,
                              userId: e.target.value.trim() === "",
                            });
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Auto-fill UserID with Email Address">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        formData.userId === formData.email
                                      }
                                      onChange={(e) => {
                                        setFormData({
                                          ...formData,
                                          userId:
                                            formData.userId === formData.email
                                              ? unchangedUserID
                                              : formData.email,
                                        });
                                      }}
                                      name="autoFillUserID"
                                      color="primary"
                                    />
                                  }
                                />
                              </Tooltip>
                            </InputAdornment>
                          }
                        />
                        {formErrors.userId && (
                          <FormHelperText>
                            User ID must be filled
                          </FormHelperText>
                        )}
                      </FormControl> */}
                            <FormControl fullWidth error={formErrors.userId}>
                              <InputLabel htmlFor="userId">UserID</InputLabel>
                              <OutlinedInput
                                autoComplete="userId"
                                name="userId"
                                required
                                fullWidth
                                id="userId"
                                label="UserID"
                                value={formData.userId}
                                onBlur={(e) => {
                                  setFormData({
                                    ...formData,
                                    userId: e.target.value.trim(),
                                  });
                                }}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    userId: removeOnlySpecialChar(
                                      e.target.value.trim()
                                    ),
                                  });
                                  setUnchangedUserID(e.target.value);
                                  setFormErrors({
                                    ...formErrors,
                                    userId: e.target.value.trim() === "",
                                  });
                                }}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Auto-fill UserID with Email Address">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              formData.userId === formData.email
                                            }
                                            onChange={(e) => {
                                              setFormData({
                                                ...formData,
                                                userId:
                                                  formData.userId ===
                                                  formData.email
                                                    ? unchangedUserID
                                                    : formData.email,
                                              });
                                            }}
                                            name="autoFillUserID"
                                            color="primary"
                                          />
                                        }
                                      />
                                    </Tooltip>
                                  </InputAdornment>
                                }
                              />
                              {formErrors.userId && (
                                <FormHelperText>
                                  User ID must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl
                              fullWidth
                              error={
                                formErrors.password ||
                                formErrors.passwordNotMatch ||
                                formErrors.weakPassword
                              }
                            >
                              <InputLabel htmlFor="password">
                                Password
                              </InputLabel>
                              <OutlinedInput
                                label="Password"
                                autoComplete="password"
                                name="password"
                                required
                                fullWidth
                                id="password"
                                value={pass}
                                onChange={(e) => {
                                  const password = e.target.value;
                                  setPass(password);
                                  const isPasswordValid =
                                    validatePassword(password);
                                  setFormData({
                                    ...formData,
                                    password: password,
                                  });
                                  setFormErrors({
                                    ...formErrors,
                                    password: password.trim() === "",
                                    passwordNotMatch: password !== cnfpass,
                                    weakPassword: !isPasswordValid,
                                  });
                                  console.log(
                                    "password !== cnfpass : ",
                                    password !== cnfpass
                                  );
                                }}
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {formErrors.password && (
                                <FormHelperText>
                                  Password must be filled
                                </FormHelperText>
                              )}
                              {formErrors.weakPassword && (
                                <FormHelperText>
                                  Password must contain at least 6 characters,
                                  including uppercase, lowercase, numeric, and
                                  special characters
                                </FormHelperText>
                              )}
                              {formErrors.passwordNotMatch && (
                                <FormHelperText>
                                  Password does not match !
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              name="confirmPassword"
                              label="Confirm Password"
                              type="password"
                              id="confirmPassword"
                              value={cnfpass}
                              onBlur={(e) => confirmPassword(e.target.value)}
                              onChange={(e) => {
                                const confirmPass = e.target.value;
                                setCnfpass(confirmPass);
                                setFormErrors({
                                  ...formErrors,
                                  confirmPassword: e.target.value.trim() === "",
                                  passwordNotMatch: pass !== confirmPass,
                                });
                              }}
                              error={
                                formErrors.confirmPassword ||
                                formErrors.passwordNotMatch
                              }
                              helperText={
                                (formErrors.confirmPassword &&
                                  "Confirm Password must be filled") ||
                                (formErrors.passwordNotMatch &&
                                  "Password does not match !")
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Textfield
                              required
                              fullWidth
                              name="phoneNumber"
                              label="Phone Number"
                              id="phoneNumber"
                              autoComplete="phoneNumber"
                              value={formData.phoneNumber}
                              onBlur={(e) => {
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value.trim(),
                                });
                              }}
                              onChange={(e) => {
                                const isValidPhoneNumber =
                                  !isNaN(e.target.value) &&
                                  e.target.value.length <= 10;
                                const isPhoneNumberFilled =
                                  e.target.value.trim() === "";
                                const isPhoneNumberLengthValid =
                                  e.target.value.length <= 9;
                                setFormData({
                                  ...formData,
                                  phoneNumber: isValidPhoneNumber
                                    ? removeAllExceptNumber(e.target.value)
                                    : formData.phoneNumber,
                                });
                                setFormErrors({
                                  ...formErrors,
                                  phoneNumber: isPhoneNumberFilled,
                                  phoneNumberLength: isPhoneNumberLengthValid,
                                });
                              }}
                              error={
                                formErrors.phoneNumber ||
                                formErrors.phoneNumberLength
                              }
                              helperText={
                                (formErrors.phoneNumber &&
                                  "Phone Number must be filled") ||
                                (formErrors.phoneNumberLength &&
                                  "Phone Number must be 10 digits")
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            {/* <Textfield
                              required
                              fullWidth
                              name="accountOwnerCustomer"
                              label="Account Owner Customer"
                              id="accountOwnerCustomer"
                              autoComplete="accountOwnerCustomer"
                              value={formData.accountOwnerCustomer}
                              onBlur={(e) => {
                                setFormData({
                                  ...formData,
                                  accountOwnerCustomer: e.target.value.trim(),
                                });
                              }}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  accountOwnerCustomer:
                                    // removeNumberAndSpecialChar(
                                    //   removeSpaceAndLowerCase(
                                    e.target.value,
                                  // )),
                                });
                                setFormErrors({
                                  ...formErrors,
                                  accountOwnerCustomer:
                                    e.target.value.trim() === "",
                                });
                              }}
                              error={formErrors.accountOwnerCustomer}
                              helperText={
                                formErrors.accountOwnerCustomer &&
                                "Account Owner Customer must be filled"
                              }
                            /> */}

                            <FormControl
                              fullWidth
                              error={
                                formErrors.accountOwnerCustomer ||
                                formErrors.invalidEmailForAccountOwnerCustomer
                              }
                            >
                              {/* <InputLabel id="account-owner-customer-label">
                                Account Owner Customer
                              </InputLabel>
                              <Select
                                labelId="account-owner-customer-label"
                                label="Account Owner Customer"
                                id="accountOwnerCustomer"
                                value={formData.accountOwnerCustomer}
                                onChange={(e) => {
                                  const selectedAccount = e.target.value;
                                  setFormData({
                                    ...formData,
                                    accountOwnerCustomer: selectedAccount,
                                  });
                                  console.log(
                                    "formData.accountOwnerCustomer : : : ",
                                    formData.accountOwnerCustomer
                                  );
                                  if (selectedAccount !== "") {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerCustomer: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerCustomer: true,
                                    });
                                  }
                                }}
                              >
                                {allCustomerAccountEmailList.map((email) => (
                                  <MenuItem key={email} value={email}>
                                    {email}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formErrors.accountOwnerCustomer && (
                                <FormHelperText>
                                  Account Owner Customer must be filled
                                </FormHelperText>
                              )} */}
                              <Autocomplete
                                id="accountOwnerCustomer"
                                options={allCustomerAccountEmailList}
                                value={formData.accountOwnerCustomer}
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    accountOwnerCustomer: newValue,
                                  });
                                  // setFormErrors({
                                  //   ...formErrors,
                                  //   invalidEmailForAccountOwnerCustomer:
                                  //     !isValidEmail(newValue),
                                  // });
                                  if (
                                    newValue !== null &&
                                    newValue !== "" &&
                                    isValidEmail(newValue)
                                  ) {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerCustomer: false,
                                      invalidEmailForAccountOwnerCustomer: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerCustomer: true,
                                    });
                                  }
                                }}
                                onInputChange={(event, newInputValue) => {
                                  // Save the new input value even if it's not in the options list
                                  setFormData({
                                    ...formData,
                                    accountOwnerCustomer: newInputValue,
                                  });
                                  // Remove the error when the user starts typing manually
                                  setFormErrors({
                                    ...formErrors,
                                    accountOwnerCustomer: false,
                                  });
                                  setFormErrors({
                                    ...formErrors,
                                    invalidEmailForAccountOwnerCustomer:
                                      !isValidEmail(newInputValue),
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Account Owner Customer"
                                    error={
                                      formErrors.accountOwnerCustomer ||
                                      formErrors.invalidEmailForAccountOwnerCustomer
                                    }
                                    helperText={
                                      (formErrors.accountOwnerCustomer &&
                                        "Account Owner Customer must be filled") ||
                                      (formErrors.invalidEmailForAccountOwnerCustomer &&
                                        "Account Owner Customer Email is not valid")
                                    }
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            {/* <Textfield
                              required
                              fullWidth
                              name="accountOwnerGW"
                              label="Account Owner GW"
                              id="accountOwnerGW"
                              autoComplete="accountOwnerGW"
                              value={formData.accountOwnerGW}
                              onBlur={(e) => {
                                setFormData({
                                  ...formData,
                                  accountOwnerGW: e.target.value.trim(),
                                });
                              }}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  accountOwnerGW:
                                    // removeNumberAndSpecialChar(
                                    //   removeSpaceAndLowerCase(
                                    e.target.value,
                                  // )),
                                });
                                setFormErrors({
                                  ...formErrors,
                                  accountOwnerGW: e.target.value.trim() === "",
                                });
                              }}
                              error={formErrors.accountOwnerGW}
                              helperText={
                                formErrors.accountOwnerGW &&
                                "Account Owner GW must be filled"
                              }
                            /> */}
                            <FormControl
                              fullWidth
                              error={
                                formErrors.accountOwnerGW ||
                                formErrors.invalidEmailForAccountOwnerGW
                              }
                            >
                              {/* <InputLabel id="account-owner-GW-label">
                                Account Owner GW
                              </InputLabel>
                              <Select
                                labelId="account-owner-GW-label"
                                label="Account Owner GW"
                                id="accountOwnerGW"
                                value={formData.accountOwnerGW}
                                onChange={(e) => {
                                  const selectedAccount = e.target.value;
                                  setFormData({
                                    ...formData,
                                    accountOwnerGW: selectedAccount,
                                  });
                                  console.log(
                                    "formData.accountOwnerGW : : : ",
                                    formData.accountOwnerGW
                                  );
                                  if (selectedAccount !== "") {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerGW: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerGW: true,
                                    });
                                  }
                                }}
                              >
                                {allGWAccountEmailList.map((email) => (
                                  <MenuItem key={email} value={email}>
                                    {email}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formErrors.accountOwnerGW && (
                                <FormHelperText>
                                  Account Owner GW must be filled
                                </FormHelperText>
                              )} */}
                              <Autocomplete
                                id="accountOwnerGW"
                                options={allGWAccountEmailList}
                                value={formData.accountOwnerGW}
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    accountOwnerGW: newValue,
                                  });
                                  // setFormErrors({
                                  //   ...formErrors,
                                  //   invalidEmailForAccountOwnerGW:
                                  //     !isValidEmail(newValue),
                                  // });
                                  if (
                                    newValue !== null &&
                                    newValue !== "" &&
                                    isValidEmail(newValue)
                                  ) {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerGW: false,
                                      invalidEmailForAccountOwnerGW: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      accountOwnerGW: true,
                                    });
                                  }
                                }}
                                onInputChange={(event, newInputValue) => {
                                  // Save the new input value even if it's not in the options list
                                  setFormData({
                                    ...formData,
                                    accountOwnerGW: newInputValue,
                                  });
                                  // Remove the error when the user starts typing manually
                                  setFormErrors({
                                    ...formErrors,
                                    accountOwnerGW: false,
                                  });
                                  setFormErrors({
                                    ...formErrors,
                                    invalidEmailForAccountOwnerGW:
                                      !isValidEmail(newInputValue),
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Account Owner GW"
                                    error={
                                      formErrors.accountOwnerGW ||
                                      formErrors.invalidEmailForAccountOwnerGW
                                    }
                                    helperText={
                                      (formErrors.accountOwnerGW &&
                                        "Account Owner GW must be filled") ||
                                      (formErrors.invalidEmailForAccountOwnerGW &&
                                        "Account Owner GW Email is not valid")
                                    }
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth error={formErrors.role}>
                              <InputLabel id="role-label">Role</InputLabel>
                              <Select
                                labelId="role-label"
                                label="Role"
                                id="role"
                                value={formData.role}
                                onChange={(e) => {
                                  const selectedRole = e.target.value;
                                  setFormData({
                                    ...formData,
                                    role: selectedRole,
                                  });
                                  if (selectedRole !== "") {
                                    setFormErrors({
                                      ...formErrors,
                                      role: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      role: true,
                                    });
                                  }
                                }}
                              >
                                <MenuItem value="">
                                  <h5>Select Role</h5>
                                </MenuItem>
                                {roleList.map((role) => (
                                  <MenuItem key={role} value={role}>
                                    {role}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formErrors.role && (
                                <FormHelperText>
                                  Role must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth error={formErrors.homepage}>
                              <InputLabel id="homepage-label">
                                Homepage
                              </InputLabel>
                              <Select
                                labelId="homepage-label"
                                label="Homepage"
                                id="homepage"
                                value={formData.homepage}
                                onChange={(e) => {
                                  const selectedHomepage = e.target.value;
                                  setFormData({
                                    ...formData,
                                    homepage: selectedHomepage,
                                  });
                                  if (selectedHomepage !== "") {
                                    setFormErrors({
                                      ...formErrors,
                                      homepage: false,
                                    });
                                  } else {
                                    setFormErrors({
                                      ...formErrors,
                                      homepage: true,
                                    });
                                  }
                                }}
                              >
                                <MenuItem value="">
                                  <h5>Select Homepage</h5>
                                </MenuItem>
                                {/* <MenuItem value="admin/home">admin/home</MenuItem>
                          <MenuItem value="user/home">user/home</MenuItem> */}
                                {homePageNames.map((page) => (
                                  <MenuItem
                                    key={page}
                                    value={removeLeadingSlash(page)}
                                  >
                                    {removeLeadingSlash(page)}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formErrors.homepage && (
                                <FormHelperText>
                                  Homepage must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          {/* <Grid item xs={6}>
                      <Autocomplete
                        value={formData.plantName}
                        disablePortal
                        fullWidth
                        id="plantName"
                        options={plantList.map((p) => p.plantName)}
                        getOptionLabel={(option) => option}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Plant Name"
                            error={formErrors.plantName}
                            helperText={
                              formErrors.plantName &&
                              "Plant Name must be filled"
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={formErrors.plantID}>
                        <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                        <OutlinedInput
                          inputProps={{
                            readOnly: true,
                          }}
                          label="PlantID"
                          autoComplete="PlantID"
                          name="PlantID"
                          required
                          fullWidth
                          id="PlantID"
                          value={formData.plantID}
                          endAdornment={
                            <InputAdornment position="end">
                              <Tooltip title="Add Plant">
                                <IconButton
                                  onClick={handleAddPlantClick}
                                  edge="end"
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          }
                        />
                        {formErrors.plantID && (
                          <FormHelperText>
                            Designation must be filled
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        id="address"
                        autoComplete="address"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          });
                          setFormErrors({
                            ...formErrors,
                            address: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.address}
                        helperText={
                          formErrors.address && "Address must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="division"
                        label="Division"
                        id="division"
                        autoComplete="division"
                        value={formData.division}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            division: e.target.value,
                          });
                          setFormErrors({
                            ...formErrors,
                            division: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.division}
                        helperText={
                          formErrors.division && "Division must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Textfield
                        required
                        fullWidth
                        name="customerName"
                        label="Customer Name"
                        id="customerName"
                        autoComplete="customerName"
                        value={formData.customerName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            customerName: removeAllSpecialChar(e.target.value),
                          });
                          setFormErrors({
                            ...formErrors,
                            customerName: e.target.value.trim() === "",
                          });
                        }}
                        error={formErrors.customerName}
                        helperText={
                          formErrors.customerName &&
                          "Customer Name must be filled"
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Datepicker
                        label="Support Start Date"
                        value={dayjs(formData.supportStartDate)}
                        onChange={(startDate) =>
                          setFormData({
                            ...formData,
                            supportStartDate: startDate.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Datepicker
                        label="Support End Date"
                        value={dayjs(formData.supportEndDate)}
                        onChange={(startDate) =>
                          setFormData({
                            ...formData,
                            supportStartDate: startDate.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid> */}

                          <Grid item xs={6}>
                            <Autocomplete
                              value={formData.plantName}
                              disablePortal
                              fullWidth
                              id="plantName"
                              options={plantList.map((p) => p.plantName)}
                              getOptionLabel={(option) => option}
                              onChange={handleAutocompleteChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Plant Name"
                                  error={formErrors.plantName}
                                  helperText={
                                    formErrors.plantName &&
                                    "Plant Name must be filled"
                                  }
                                />
                              )}
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                            <FormControl fullWidth error={formErrors.plantID}>
                              <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                              <OutlinedInput
                                inputProps={{
                                  readOnly: true,
                                }}
                                label="PlantID"
                                autoComplete="PlantID"
                                name="PlantID"
                                required
                                fullWidth
                                id="PlantID"
                                value={formData.plantID}
                                {divIsVisibleList && divIsVisibleList.includes("add-plant") && (
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Add Plant">
                                      <IconButton
                                        onClick={handleAddPlantClick}
                                        edge="end"
                                      >
                                        <AddCircleOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                              )}
                              />
                              {formErrors.plantID && (
                                <FormHelperText>
                                  Plant ID must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid> */}
                          <Grid item xs={6}>
                            <FormControl fullWidth error={formErrors.plantID}>
                              <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                              {divIsVisibleList &&
                              divIsVisibleList.includes("add-plant") ? (
                                <OutlinedInput
                                  inputProps={{
                                    readOnly: true,
                                  }}
                                  label="PlantID"
                                  autoComplete="PlantID"
                                  name="PlantID"
                                  required
                                  fullWidth
                                  id="PlantID"
                                  value={formData.plantID}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Tooltip title="Add Plant">
                                        <IconButton
                                          onClick={handleAddPlantClick}
                                          edge="end"
                                        >
                                          <AddCircleOutlineIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </InputAdornment>
                                  }
                                />
                              ) : (
                                <OutlinedInput
                                  inputProps={{
                                    readOnly: true,
                                  }}
                                  label="PlantID"
                                  autoComplete="PlantID"
                                  name="PlantID"
                                  required
                                  fullWidth
                                  id="PlantID"
                                  value={formData.plantID}
                                />
                              )}
                              {formErrors.plantID && (
                                <FormHelperText>
                                  Plant ID must be filled
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="address"
                              label="Address"
                              id="address"
                              autoComplete="address"
                              value={formData.address}
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     address: e.target.value,
                              //   });
                              //   setFormErrors({
                              //     ...formErrors,
                              //     address: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={formErrors.address}
                              helperText={
                                formErrors.address && "Address must be filled"
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="division"
                              label="Division"
                              id="division"
                              autoComplete="division"
                              value={formData.division}
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     division: e.target.value,
                              //   });
                              //   setFormErrors({
                              //     ...formErrors,
                              //     division: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={formErrors.division}
                              helperText={
                                formErrors.division && "Division must be filled"
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              inputProps={{
                                readOnly: true,
                              }}
                              required
                              fullWidth
                              name="customer"
                              label="Customer"
                              id="customer"
                              autoComplete="customer"
                              value={formData.customerName}
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     customerName: removeAllSpecialChar(e.target.value),
                              //   });
                              //   setFormErrors({
                              //     ...formErrors,
                              //     customerName: e.target.value.trim() === "",
                              //   });
                              // }}
                              error={formErrors.customerName}
                              helperText={
                                formErrors.customerName &&
                                "Customer Name must be filled"
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                            <TextField
                              label="Project Name"
                              fullWidth
                              value={formData.projectName}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  projectName: removeAllSpecialChar(
                                    e.target.value
                                  ),
                                });
                                setFormErrors({
                                  ...formErrors,
                                  projectName: e.target.value.trim() === "",
                                });
                              }}
                            />
                          </Grid> */}
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="project-select-label">
                                Project Name
                              </InputLabel>
                              <Select
                                labelId="project-select-label"
                                label="Project Name"
                                multiple
                                value={formData.projectName || []}
                                onChange={(event) => {
                                  setFormData({
                                    ...formData,
                                    projectName: event.target.value,
                                  });
                                }}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                {projects.map((project) => (
                                  <MenuItem key={project} value={project}>
                                    <Checkbox
                                      checked={
                                        formData.projectName.indexOf(project) >
                                        -1
                                      }
                                    />
                                    <ListItemText primary={project} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                          onClick={handleSubmit}
                        >
                          Register User
                        </Button>
                      </Box>
                    </form>
                  </>
                )}
                <>
                  <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Add New Plant"}
                    </DialogTitle>
                    <DialogContent style={{ padding: "10px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Textfield
                            required
                            fullWidth={true}
                            name="plantName"
                            label="Plant Name"
                            id="plantName"
                            autoComplete="plantName"
                            value={newPlantName.plantName}
                            onChange={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                plantName: removeAllSpecialChar(e.target.value),
                              });
                            }}
                            onBlur={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                plantName: removeAllSpecialChar(
                                  e.target.value.trim()
                                ),
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Textfield
                            required
                            fullWidth={true}
                            name="plantID"
                            label="PlantID"
                            id="plantID"
                            autoComplete="plantID"
                            value={newPlantName.plantID}
                            onChange={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                plantID: removeOnlySpecialCharforplantid(
                                  e.target.value
                                ),
                              });
                            }}
                            onBlur={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                plantID: removeOnlySpecialCharforplantid(
                                  e.target.value.trim()
                                ),
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Textfield
                            required
                            fullWidth={true}
                            name="address"
                            label="Address"
                            id="address"
                            autoComplete="address"
                            value={newPlantName.address}
                            onChange={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                address: e.target.value,
                              });
                            }}
                            onBlur={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                address: e.target.value.trim(),
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Textfield
                            required
                            fullWidth={true}
                            name="customerName"
                            label="Customer"
                            id="customer"
                            autoComplete="customer"
                            value={newPlantName.customerName}
                            onChange={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                customerName: removeAllSpecialChar(
                                  e.target.value
                                ),
                              });
                            }}
                            onBlur={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                customerName: removeAllSpecialChar(
                                  e.target.value.trim()
                                ),
                              });
                            }}
                          />
                        </Grid>
                        {/* <Grid item xs={6}>
                          <Datepicker
                            label="Support Start Date"
                            value={dayjs(newPlantName.supportStartDate)}
                            onChange={(startDate) =>
                              setNewPlantName({
                                ...newPlantName,
                                supportStartDate:
                                  startDate.format("YYYY-MM-DD"),
                              })
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Datepicker
                            label="Support End Date"
                            value={dayjs(newPlantName.supportEndDate)}
                            onChange={(endDate) =>
                              setNewPlantName({
                                ...newPlantName,
                                supportEndDate: endDate.format("YYYY-MM-DD"),
                              })
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </Grid> */}
                        <Grid item xs={12}>
                          <Textfield
                            required
                            fullWidth={true}
                            name="division"
                            label="Division"
                            id="division"
                            autoComplete="division"
                            value={newPlantName.division}
                            onChange={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                division: removeAllSpecialChar(e.target.value),
                              });
                            }}
                            onBlur={(e) => {
                              setNewPlantName({
                                ...newPlantName,
                                division: removeAllSpecialChar(
                                  e.target.value.trim()
                                ),
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          postPlantName();
                          fetchPlantData();
                          handlenewPlantNameInputChangeForAll();
                        }}
                        color="success"
                        autoFocus
                        disabled={
                          newPlantName.plantName.trim() === "" ||
                          newPlantName.plantID.trim() === "" ||
                          newPlantName.address.trim() === "" ||
                          newPlantName.customerName.trim() === "" ||
                          newPlantName.division.trim() === ""
                          // ||
                          // newPlantName.supportStartDate === "" ||
                          // newPlantName.supportEndDate === ""
                        }
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              </Box>
            </Container>
            <Snackbar
              open={passwordErrorOpen}
              autoHideDuration={3000}
              onClose={handleClose}
              TransitionComponent={Slide}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleClose}
                severity={snackbarSeverity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbarText}
              </Alert>
            </Snackbar>
          </Box>
        </>
      )}
    </>
    //   </Main>
    // </Box>
  );
}
