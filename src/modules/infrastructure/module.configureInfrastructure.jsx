import { Box, Chip } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useLayoutEffect, useState } from "react";

import Swal from "sweetalert2";

import { useLocation, useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/animation_/AnimatedPage";
import CustomButton from "../../components/button/button.component";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import Main from "../../components/navigation/mainbody/mainbody";
import SidebarPage from "../../components/navigation/sidebar/sidebar";
import TopbarPage from "../../components/navigation/topbar/topbar";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import CustomTable from "../../components/table/table.component";
import Textfield from "../../components/textfield/textfield.component";
import { useUserContext } from "../contexts/UserContext";
import { extendTokenExpiration } from "../helper/Support360Api";
import {
  deleteInfrastructureFromDb,
  fetchDivs,
  fetchUser,
  getAllInfrastructure,
  updateInfraNameDB,
} from "./infrastructureAdminAPI";
import Dropdown from "../../components/dropdown/dropdown.component";
import { fetchAllProjectDetails } from "../helper/AllProjectDetails";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ConfigureInfrastructure({ sendUrllist }) {
  // const [search, setSearch] = useState("");
  const [newCateogry, setNewCategory] = useState("");
  // const [editRowIndex, setEditRowIndex] = useState(null);
  // const [editValue, setEditValue] = useState("");
  const [originalInfrarows, setoriginalInfraRows] = useState([]);
  const [infraList, setInfraList] = useState([]);
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const location = useLocation();
  const urllist = [
    { pageName: "Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    {
      pageName: "Configure Infrastructure",
      pagelink: "/admin/InfrastructureConfigure",
    },
  ];

  //const [onEditError, setOnEditError] = useState(false);
  //const [progressVisible, setProgressVisible] = useState(false);
  //const [clearVisible, setClearVisible] = useState(false);
  //Modified
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  const navigate = useNavigate();
  const currentPageLocation = useLocation().pathname;
  const { userData, setUserData } = useUserContext();

  const [booleanProgressVisible, setBooleanProgressVisible] = useState(false);

  //new change added project

  const [selectedPlantAndProject, setSelectedPlantAndProject] = useState({
    plantName: "",
    project: "",
  });

  const [plantNameList, setPlantNameList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [masterAllProjectDetailsList, setMasterAllDetailsProjectList] =
    useState([]);

  /******************************* useEffect()********************************/

  useEffect(() => {
    //fetchDivsForCurrentPage();
    fetchUserAndRole();
    extendTokenExpiration();
    fetchProjectAndPlantDetails();

    // fetchInfraFromDb();
    // fetchDivsForCurrentPage(userData);
    sendUrllist(urllist);
  }, []);

  useEffect(() => {
    console.log("useEffect triggered:", selectedPlantAndProject);

    if (selectedPlantAndProject.plantName && selectedPlantAndProject.project) {
      console.log(
        "Plant Id:",
        selectedPlantAndProject.plantId,
        "Project:",
        selectedPlantAndProject.project
      );
      console.log(
        "masterAllProjectDetailsList : ",
        masterAllProjectDetailsList
      );
      const foundPlantId = masterAllProjectDetailsList.find(
        (element) => element.plant_name === selectedPlantAndProject.plantName
      )?.plant_id;
      if (foundPlantId && masterAllProjectDetailsList?.length > 0)
        fetchInfraFromDb(foundPlantId, selectedPlantAndProject.project);
    } else {
      console.log("Plant ID or Project is missing:", selectedPlantAndProject);
    }
  }, [selectedPlantAndProject, masterAllProjectDetailsList]);

  //Will include id later on to implement the same to identify the list item .....
  //Will include plantID too..
  // const handleClick = (infrastructure) => {
  //   const paramIssue = infrastructure.trim();
  //   console.log("Category is => ", paramIssue);
  //   const data={infrastructure:infrastructure,plantID:1};
  //   console.log("Data sent is => ",data)
  //   history.push({ pathname: "/conf", state: data });
  // };

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: "top-end",
  //   showConfirmButton: false,
  //   timer: 1000,
  //   timerProgressBar: true,
  // });
  const handleAddIssues = () => {
    console.log("handleAddIssues called !");
    setCategoryError(false);
    if (newCateogry.length === 0 || newCateogry.trim() === "") {
      setsnackbarSeverity("error");
      setSnackbarText("Category name cannot be blank ! ");
      setOpen(true);
      setCategoryError(true);
      return;
    }
    const regex = /[^A-Za-z0-9 _/]/;
    if (regex.test(newCateogry.trim())) {
      setsnackbarSeverity("error");
      setSnackbarText("Special Characters are not allowed ! ");
      setCategoryError(true);
      setOpen(true);
      return;
    }
    //remmeber modified the main data with an object property categoryname
    console.log("Current new Category : ", newCateogry);
    console.log("Current InfraList ", infraList);
    if (
      infraList.some(
        (item) =>
          item.categoryname.trim().toLowerCase() ===
          newCateogry.trim().toLowerCase()
      )
    ) {
      console.log("Infrastructure already exists ! ");
      setsnackbarSeverity("error");
      setSnackbarText("Category already exists ! ");
      setOpen(true);
      setCategoryError(true);

      return;
    }
    // if (selectedPlantAndProject.plantId&&selectedPlantAndProject.project) {
    //   const data = { infrastructure: categoryname, plantID: selectedPlantAndProject.plantId,project:selectedPlantAndProject.project };
    //   console.log("Data sent is => ", data);
    //   navigate("/admin/infrastructure/addIssues", { state: data });
    // }

    // if (selectedPlantAndProject.plantName&&selectedPlantAndProject.project) {
    //   const foundPlantId=masterAllProjectDetailsList.find(element=>element.plant_name===selectedPlantAndProject.plantName).plant_id
    //   if(foundPlantId)
    //     {
    //   const data = { infrastructure: categoryname, plantID: foundPlantId,project:selectedPlantAndProject.project };
    //   console.log("Data sent is => ", data);
    //   navigate("/admin/infrastructure/addIssues", { state: data });
    //     }

    if (selectedPlantAndProject.plantName && selectedPlantAndProject.project) {
      const foundPlantId = masterAllProjectDetailsList.find(
        (element) => element.plant_name === selectedPlantAndProject.plantName
      )?.plant_id;
      const data = {
        infrastructure: newCateogry,
        plantID: foundPlantId,
        project: selectedPlantAndProject.project,
      };
      console.log("Data sent is => ", data);
      navigate("/admin/infrastructure/addIssues", { state: data });
    } else {
      setsnackbarSeverity("error");
      setSnackbarText("PlantID not found !");
      setOpen(true);
    }
  };

  // const handleAlertClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  // const handleEditClick = (issue, index) => {
  //   console.log("edit click for issue ", issue, " with index ", index);
  //   setEditRowIndex(index);
  //   setEditValue(issue);
  // };

  /**************************************************   API    **************************************************** */

  const fetchProjectAndPlantDetails = async () => {
    console.log("fetchProjectAndPlantDetails() called");
    const projectDetails = await fetchAllProjectDetails();
    console.log("Project Details : ", projectDetails);
    const allProjects = [];
    const plantNameList = [];
    const projectList = [];
    // let uniqueplantId=new Set();
    // const selectedPlantIdProjects=[];
    let plantNameAtIndexZero = "";
    if (projectDetails) {
      plantNameAtIndexZero = projectDetails[0].plant_name;
      projectDetails.forEach((data) => {
        //  const currentPlant=data.plant_id;
        //  const currentProject=data.project_name;
        //  if(data.plant_id===userData.plantID)
        //   {
        allProjects.push(data);
        plantNameList.push(data.plant_name);
        // projectList.push(data)
        if (data.plant_name === plantNameAtIndexZero) {
          projectList.push(data.project_name);
        }
      });
    }
    console.log("Final PlantList : ", plantNameList);
    console.log("All ProjectList : ", projectList);
    const finalPlantIDList = Array.from(new Set(plantNameList));
    console.log("Final PlantId List :", finalPlantIDList);
    setPlantNameList(finalPlantIDList);
    setProjectList(projectList);
    setMasterAllDetailsProjectList(allProjects);
    //  const projectAtIndexZeroByPlantId=[];
    //  const selectedprojects=projectList.filter((plant)=>(plant===plantIdList[0]))
    // const selectedprojects=projectList.filter(data=>{
    //  return  data===projectList[0]
    // })
    //  setProjectList(selectedprojects)
    //  setPlantIdList(Array.from(new Set(selectedprojects)))

    const indexAtZeroPlantName = finalPlantIDList[0];
    const indexAtZeroProject = projectList[0];
    setSelectedPlantAndProject({
      ...selectedPlantAndProject,
      plantName: indexAtZeroPlantName,
      project: indexAtZeroProject,
    });
    //  await fetchInfraFromDb(indexAtZeroPlantName, indexAtZeroProject);
  };

  const fetchUserAndRole = async () => {
    console.log("fetchUserAndRole() called");
    const user = await fetchUser();
    if (user) {
      fetchDivsForCurrentPage(user.role);
    }
  };
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
  //     fetchDivsForCurrentPage(role);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

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

  // const updateInfraNameDB = async (prev_infra, new_infraname) => {
  //   console.log("updateInfraNameDB() called");
  //   console.log("Previous Infrastructure : ", prev_infra);
  //   console.log("New Infrastucture : ", new_infraname);
  //   let plantID = "";
  //   try {
  //     if (userData.plantID) {
  //       plantID = userData.plantID;
  //     } else {
  //       throw new Error("PlantID not found ! ");
  //     }
  //     const response = await fetch(
  //       `http://localhost:8081/infrastructure/admin`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "text/plain",
  //         },
  //         body: JSON.stringify({
  //           prev_infra: prev_infra,
  //           new_infraname: new_infraname,
  //           plantID: plantID,
  //         }),
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     if (response.ok) {
  //       return true;
  //     }
  //   } catch (error) {
  //     console.log("Error in updating infra name");
  //     setsnackbarSeverity("error");
  //     setSnackbarText("Database Error !");
  //     setOpen(true);
  //     // setSearch("");
  //     // setEditRowIndex(null);
  //     // setEditValue("");
  //     return false;
  //   }
  // };

  const deletefromDB = async (infra_name) => {
    // let plantID = "";
    // try {
    //   if (userData.plantID) {
    //     plantID = userData.plantID;
    //   } else {
    //     throw new Error("PlantID not found ! ");
    //   }
    //   const response = await fetch(
    //     `http://localhost:8081/infrastructure/admin`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         infrastructureName: infra_name,
    //         plantID: plantID,
    //       }),
    //     }
    //   );
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    const success = await deleteInfrastructureFromDb(
      selectedPlantAndProject.plantId,
      infra_name,
      selectedPlantAndProject.project
    );
    if (success) {
      const rowCopy = [...infraList];
      const filterArray = rowCopy.filter(
        (item) => item.categoryname !== infra_name
      );
      setInfraList(filterArray);
      // setSearch("");
      setsnackbarSeverity("success");
      setSnackbarText("Data deleted successfully ! ");
      setOpen(true);
    } else {
      setsnackbarSeverity("error");
      setSnackbarText("Database error ! ");
      setOpen(true);
    }
  };

  const fetchInfraFromDb = async (plantId, project) => {
    // setProgressVisible(true);
    console.log("fetchInfraFromDb() called");
    console.log("Current Pager Location : ", currentPageLocation);
    console.log("Current Plant Id : ", plantId, " Current Project : ", project);
    // console.log("PlantID for InfrafromDb  : ");
    // console.log("Context value :  ", userData.plantID);
    //  const plantID = "P009";
    //  console.log(
    //    "Fetched Token from LS=>  ",
    //    `Bearer ${localStorage.getItem("token")}`
    //  );
    // let plantId = "";
    // let project="";
    try {
      // if (selectedPlantAndProject.plantId&&selectedPlantAndProject.project) {
      //   plantId = selectedPlantAndProject.plantId;
      //   project= selectedPlantAndProject.project;
      // } else {
      //   throw new Error("PlantID and project not found ! ");
      // }
      // const response = await fetch(
      //   `http://localhost:8081/infrastructure/admin/${plantID}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // if (!response.ok) {
      //   console.log("Response => " + response.status);
      //   throw new Error("HTTP error " + response.status);
      // }
      // const data = await response.json();
      const data = await getAllInfrastructure(plantId, project);
      console.log("Data from DB => ", data);
      let infrastructureList = [];
      if (data.infraDetails) {
        console.log("infraDetails from Db => ", data.infraDetails);
        data.infraDetails.map((item) => {
          console.log("inf name => ", item.infrastructure_name);
          let tempItem = { categoryname: item.infrastructure_name };
          infrastructureList.push(tempItem);
          console.log("infrastructure array => ", infrastructureList);
        });
      }
      setInfraList(infrastructureList);
      setoriginalInfraRows(infrastructureList);

      //setProgressVisible(false);
      // setsnackbarSeverity("success")
      // setSnackbarText("Data refereshed successfully !")
      // setOpen(true)
    } catch (error) {
      //setProgressVisible(false);
      setsnackbarSeverity("error");
      setSnackbarText(error.toString());
      setOpen(true);
      console.log("Error fetching data from database !");
      // navigate("/notfound");
    }
  };

  /******************************************************* API ends ************************************************* */

  const handleDeleteClick = async (row) => {
    console.log("handleDeleteClick() called");
    const infra_name = row.categoryname;
    console.log(" Row  to delete: ", infra_name);
    // return true;
    // Swal.fire({
    //   title: "Do you really want to delete ? ",
    //   showDenyButton: true,
    //   confirmButtonText: "Delete",
    //   denyButtonText: `Cancel`,
    // }).then((result) => {
    //   if (result.isConfirmed) {
    deletefromDB(infra_name);
    //   }
    // });
  };

  // const handleSaveClick = async(selected_category, updated_category) => {
  //   // const  dataCopy = [...issueList];
  // //   setOnEditError(false);
  // //   if(editValue.trim()==='')
  // //   {
  // //     setsnackbarSeverity("error")
  // //     setSnackbarText("Category Name cannot be empty ! ")
  // //     setOnEditError(true)
  // //     setOpen(true)
  // //     //setEditRowIndex(null)
  // //     return;
  // //   }
  // //   const regex = /[^A-Za-z0-9 _]/;
  // //   if(regex.test(editValue.trim())) {
  // //     setsnackbarSeverity("error")
  // //     setSnackbarText("Special Characters are not allowed ! ")
  // //     setOnEditError(true)
  // //     setOpen(true)
  // //     return ;
  // //   }
  // //   console.log("Current Edit for row => ", issue);
  // //   const foundindex = originalInfrarows.indexOf(issue);
  // //   console.log("original index in the list => ", foundindex);
  // //   if (
  // //     foundindex === -1 ||
  // //     originalInfrarows[foundindex] === editValue.trim()
  // //   ) {
  // //     console.log("Index ", foundindex, " or issue already exists");
  // //     setEditRowIndex(null);
  // //     return;
  // //   }
  // console.log('handleSaveClick() props called')
  //   console.log('The category to update => ',selected_category.categoryname)
  //   console.log('The updated category => ',updated_category.categoryname)
  //   const success= await updateInfraNameDB(selected_category.categoryname, updated_category.categoryname);
  //   console.log('The success returned handleSaveClick() => ',success)
  //   return success;
  //   //setOnEditError(false);
  //   //console.log('success',success)

  // };
  const handleSaveClick = async (selected_category, updated_category) => {
    // Your validation and error handling logic goes here

    console.log("handleSaveClick() props called");
    console.log("The category to update => ", selected_category.categoryname);
    console.log("The updated category => ", updated_category.categoryname);
    console.log("Current Project : ", selectedPlantAndProject.project);

    // let plantID = "";
    try {
      // if (userData.plantID) {//
      //   plantID = userData.plantID;
      // } else {
      //   throw new Error("PlantID not found ! ");
      // }
      const success = await updateInfraNameDB(
        selected_category.categoryname,
        updated_category.categoryname,
        selectedPlantAndProject.project,
        selectedPlantAndProject.plantId
      );
      console.log("The success returned handleSaveClick() => ", success);

      return success;
    } catch (error) {
      console.error("Error occurred during update:", error);
      return false;
      //   throw error;
    }
  };

  // const handleCancelClick = (issue, index) => {
  //   setEditRowIndex(null);
  //   setEditValue("");
  // };

  // const handleSearchChange = (event) => {
  //   //setSearch(event.target.value);
  //   const currentSearch = event.target.value;
  //   console.log("Search => ", search);

  //   if (currentSearch === "" || currentSearch.length === 0) {
  //     setInfraList(originalInfrarows);
  //   } else {
  //     const regex = /[^A-Za-z0-9 _/]/;
  //     if (regex.test(currentSearch.trim())) {
  //       setsnackbarSeverity("error");
  //       setSnackbarText("Special Characters are not allowed ! ");
  //       setCategoryError(true);
  //       setOpen(true);
  //       return;
  //     }
  //     const updatedRows = [...originalInfrarows];
  //     const filteredRows = updatedRows.filter((infra) =>
  //       infra.toLowerCase().includes(currentSearch.trim().toLowerCase())
  //     );
  //     console.log("Filtered Rows => ", filteredRows);
  //     setInfraList(filteredRows);
  //     setEditRowIndex(null);
  //   }
  // };

  const handleCategoryChange = (e) => {
    console.log("handleCategoryChange() called");
    setCategoryError(false);
    setNewCategory(e.target.value);
    const currentCategory = e.target.value;
    const regex = /[^A-Za-z0-9 _/]/;
    if (regex.test(currentCategory.trim())) {
      setsnackbarSeverity("error");
      setSnackbarText("Special Characters are not allowed ! ");
      setCategoryError(true);
      setOpen(true);
      return;
    }
  };

  const columns = [
    {
      id: "categoryname",
      label: "Category Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    // {
    //     "id": "categoryname",
    //     "label": "Category Name",
    //     "type": "textbox",
    //     "canRepeatSameValue":false
    //   }
  ];

  const addIssueCategory = async (selectedCategory, updatedCategory) => {
    console.log("Save to database method called");
    console.log("Selected category : ", selectedCategory);
    console.log("Updated Category : ", updatedCategory);
    const success = await handleSaveClick(selectedCategory, updatedCategory);
    console.log("addIssueCategory : ", success);
    if (success === false) {
      setsnackbarSeverity("error");
      setSnackbarText("Error !");
      setOpen(true);
    }
    return success;
    // if (updatedCategory.issuelist !== null) {
    //   const requestData = {
    //     issuecategoryname: updatedCategory.categoryname,
    //     plantid: plantid,
    //     issueList: updatedCategory.issuelist
    //   };
    //   try {
    //     const response = await axios.put(`http://localhost:9080/device/admin/${plantid}/categories/` + selectedCategory.categoryname, requestData, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     console.log(response.data); // Handle response data
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // }
  };
  const handleRedirect = (category) => {
    const categoryname = category.categoryname;
    console.log("Redirected Catefory : ", categoryname);
    //         const paramIssue = infrastructure.trim();
    // console.log("Category is => ", paramIssue);
    if (selectedPlantAndProject.plantName && selectedPlantAndProject.project) {
      const foundPlantId = masterAllProjectDetailsList.find(
        (element) => element.plant_name === selectedPlantAndProject.plantName
      ).plant_id;
      if (foundPlantId) {
        const data = {
          infrastructure: categoryname,
          plantID: foundPlantId,
          project: selectedPlantAndProject.project,
        };
        console.log("Data sent is => ", data);
        navigate("/admin/infrastructure/addIssues", { state: data });
      }
    } else {
      setsnackbarSeverity("error");
      setSnackbarText("Error ! ");
      setOpen(true);
    }
    //history.push({pathname:"/"})
    // console.log("Category==========>"+category.categoryname);
    // navigate(`/Device/Category/Issue`, {
    //   state: { issuelist: category.issuelist, categoryname: category.categoryname },
    // });
  };

  const classes = {
    conatiner: {
      marginTop: "10px",
    },
    tablehead: {
      fontWeight: "bold",
      backgroundColor: "#B5C0D0",
      lineHeight: 4,
    },
    textField: {
      width: "300px",
    },
    btn: {
      transition: "0.3s",
      "&:hover": { borderBottomWidth: 0, transform: "translateY(5px)" },
    },
  };

  /******************************* Component Return ********************************* */
  return (
    <AnimatedPage>
      <div>
        <center>
          <Container sx={classes.conatiner}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {
                <>
                  <div style={{ display: "flex" }}>
                    <Dropdown
                      id={"plantName-dropdown"}
                      value={
                        selectedPlantAndProject.plantName
                          ? selectedPlantAndProject.plantName
                          : ""
                      }
                      onChange={(event) => {
                        const newPlantName = event.target.value;
                        console.log("New Plant Name  : ", newPlantName);
                        const finalProjectList = [];
                        console.log(
                          "Current Master AllProject Details : ",
                          masterAllProjectDetailsList
                        );
                        const selectedPlantProjects =
                          masterAllProjectDetailsList
                            .filter((data) => data.plant_name === newPlantName)
                            .map((data) => data.project_name);

                        console.log(
                          "Current Selected Plant Projects : ",
                          selectedPlantProjects
                        );

                        setSelectedPlantAndProject({
                          ...selectedPlantAndProject,
                          plantName: newPlantName,
                          project: "",
                        });

                        // console.log('selectedPlantProjects :',selectedPlantAndProject)

                        setProjectList(selectedPlantProjects);
                      }}
                      list={plantNameList}
                      label={"Plant-Name"}
                      // error={dropDownError}
                      style={{ width: "110px" }}
                    ></Dropdown>

                    <Dropdown
                      id={"project-dropdown"}
                      value={
                        selectedPlantAndProject.project
                          ? selectedPlantAndProject.project
                          : ""
                      }
                      onChange={(event) =>
                        setSelectedPlantAndProject({
                          ...selectedPlantAndProject,
                          project: event.target.value,
                        })
                      }
                      list={projectList}
                      label={"Project"}
                      // error={dropDownError}
                      style={{ width: "110px", marginLeft: "10px" }}
                    ></Dropdown>
                  </div>
                </>
              }

              {divIsVisibleList &&
                divIsVisibleList.includes(
                  "add-new-infrastructure-category"
                ) && (
                  <div
                    id="add-new-infrastructure-category"
                    style={{ display: "flex" }}
                  >
                    <Textfield
                      label={"Infrastructure Category"}
                      variant={"outlined"}
                      required
                      value={newCateogry}
                      helpertext={"Enter a new Infrastructure category *"}
                      onChange={(e) => handleCategoryChange(e)}
                      size="large"
                      error={categoryError}
                    ></Textfield>
                    &nbsp;&nbsp;
                    <CustomButton
                      variant={"contained"}
                      size={"large"}
                      color={"success"}
                      style={classes.btn}
                      onClick={() => handleAddIssues()}
                      buttontext={" Add Infrastructure "}
                    ></CustomButton>
                  </div>
                )}
            </div>
            {
              <div
                style={{
                  paddingTop: "14px",
                  display: "grid",
                  justifyContent: "start",
                }}
              >
                <Chip
                  label={
                    <div>
                      <InfoOutlinedIcon fontSize="small" />
                      Please select Plant-ID and Project from the above dropdown
                    </div>
                  }
                />
              </div>
            }
            <br />
            {/* <br />
            <br />
            {divIsVisibleList &&
              divIsVisibleList.includes("existing-infrastructure-table") &&
              divIsVisibleList.includes("add-new-infrastructure-category") && (
                <div id="or-div">
                  <b>OR</b>
                </div>
              )}
            <br />
            <br /> */}
            {divIsVisibleList &&
              divIsVisibleList.includes("existing-infrastructure-table") && (
                <div id="existing-infrastructure-table">
                  <CustomTable
                    rows={infraList}
                    columns={columns}
                    setRows={setInfraList}
                    savetoDatabse={addIssueCategory}
                    redirectColumn={"categoryname"}
                    handleRedirect={handleRedirect}
                    deleteFromDatabase={handleDeleteClick}
                    editActive={true}
                    tablename={"Edit Existing Category List "}
                    style={{ borderRadius: 10, maxHeight: 440, maxWidth: 1200 }}
                    redirectIconActive={true}
                    isDeleteDialog={true}
                    progressVisible={true}
                  ></CustomTable>
                </div>
              )}
          </Container>
          <br />
          <br />
        </center>
        <SnackbarComponent
          openPopup={open}
          setOpenPopup={setOpen}
          dialogMessage={snackbarText}
          snackbarSeverity={snackbarSeverity}
        ></SnackbarComponent>
      </div>
    </AnimatedPage>
  );
}
