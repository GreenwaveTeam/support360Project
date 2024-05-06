import { Box } from "@mui/material";
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

  /******************************* useEffect()********************************/

  useLayoutEffect(() => {
    fetchInfraFromDb();
    fetchDivs();
    sendUrllist(urllist);

  }, []);

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
      setSnackbarText("Category aready exists ! ");
      setOpen(true);
      setCategoryError(true);

      return;
    }
    //plantID here is harcoded
    if (userData.plantID) {
      const data = { infrastructure: newCateogry, plantID: userData.plantID };
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

  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
      console.log("Currently passed Data : ", location.state);
      console.log("Current UserData in fetchDivs() : ", userData);
      let role = "";
      if (userData.role) {
        role = userData.role;
      } else {
        throw new Error("UserRole not found ! ");
      }
      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
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
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
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

  const updateInfraNameDB = async (prev_infra, new_infraname) => {
    console.log("updateInfraNameDB() called");
    console.log("Previous Infrastructure : ", prev_infra);
    console.log("New Infrastucture : ", new_infraname);
    let plantID = "";
    try {
      if (userData.plantID) {
        plantID = userData.plantID;
      } else {
        throw new Error("PlantID not found ! ");
      }
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            prev_infra: prev_infra,
            new_infraname: new_infraname,
            plantID: plantID,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log("Error in updating infra name");
      setsnackbarSeverity("error");
      setSnackbarText("Database Error !");
      setOpen(true);
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
      return false;
    }
  };

  const deletefromDB = async (infra_name) => {
    let plantID = "";
    try {
      if (userData.plantID) {
        plantID = userData.plantID;
      } else {
        throw new Error("PlantID not found ! ");
      }
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            infrastructureName: infra_name,
            plantID: plantID,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.ok) {
        const rowCopy = [...infraList];
        const filterArray = rowCopy.filter(
          (item) => item.categoryname !== infra_name
        );
        setInfraList(filterArray);
        // setSearch("");
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

  const fetchInfraFromDb = async () => {
    // setProgressVisible(true);
    console.log("fetchInfraFromDb() called");
    console.log("Current Pager Location : ", currentPageLocation);
    console.log("PlantID for InfrafromDb  : ");
    console.log("Context value :  ", userData.plantID);
    //  const plantID = "P009";
    //  console.log(
    //    "Fetched Token from LS=>  ",
    //    `Bearer ${localStorage.getItem("token")}`
    //  );
    let plantID = "";
    try {
      if (userData.plantID) {
        plantID = userData.plantID;
      } else {
        throw new Error("PlantID not found ! ");
      }
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin/${plantID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("Response => " + response.status);
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      let infrastructure = [];
      if (data.infraDetails) {
        console.log("infraDetails from Db => ", data.infraDetails);
        data.infraDetails.map((item) => {
          console.log("inf name => ", item.infrastructure_name);
          let tempItem = { categoryname: item.infrastructure_name };
          infrastructure.push(tempItem);
          console.log("infrastructure array => ", infrastructure);
        });
      }
      setInfraList(infrastructure);
      setoriginalInfraRows(infrastructure);
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
      navigate("/notfound");
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

    try {
      const success = await updateInfraNameDB(
        selected_category.categoryname,
        updated_category.categoryname
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

  const addIssueCategory = (selectedCategory, updatedCategory) => {
    console.log("Save to database method called");
    console.log("Selected category : ", selectedCategory);
    console.log("Updated Category : ", updatedCategory);
    const success = handleSaveClick(selectedCategory, updatedCategory);
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
    if (userData.plantID) {
      const data = { infrastructure: categoryname, plantID: userData.plantID };
      console.log("Data sent is => ", data);
      navigate("/admin/infrastructure/addIssues", { state: data });
    } else {
      setsnackbarSeverity("error");
      setSnackbarText("PlantID not found ! ");
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
            {divIsVisibleList &&
              divIsVisibleList.includes("add-new-infrastructure-category") && (
                <div id="add-new-infrastructure-category">
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
                  <br />
                  <br />
                  <CustomButton
                    variant={"contained"}
                    size={"large"}
                    color={"success"}
                    style={classes.btn}
                    onClick={() => handleAddIssues()}
                    buttontext={" Add Issues "}
                  ></CustomButton>
                </div>
              )}
            <br />
            <br />
            {divIsVisibleList &&
              divIsVisibleList.includes("existing-infrastructure-table") &&
              divIsVisibleList.includes("add-new-infrastructure-category") && (
                <div id="or-div">
                  <b>OR</b>
                </div>
              )}
            <br />
            <br />
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
