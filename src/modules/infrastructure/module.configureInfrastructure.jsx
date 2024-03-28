import { Alert, Button, Snackbar } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";

import Textfield from "../../components/textfield/textfield.component";
import CustomTable from "../../components/table/table.component";
import AnimatedPage from "../../components/animation_/AnimatedPage";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";

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
  const [categoryError, setCategoryError] = useState(false);
  const [onEditError, setOnEditError] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);

  const navigate = useNavigate();

  const fetchInfraFromDb = async () => {
    setProgressVisible(true);
    console.log("fetchInfraFromDb() called");
    try {
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin/1`
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
      setProgressVisible(false);
      // setsnackbarSeverity("success")
      // setSnackbarText("Data refereshed successfully !")
      // setOpen(true)
    } catch (error) {
      setProgressVisible(false);
      setsnackbarSeverity("error");
      setSnackbarText(error.toString());
      setOpen(true);
      console.log("Error fetching data from database !");
    }
  };

  useEffect(() => {
    fetchInfraFromDb();
  }, []);

  useEffect(() => {
    //This useEffect is keeping track of the search whenever it is visible  or not
    console.log("useEffect for search");
    setClearVisible(search === "" ? false : true);
  }, [search]);

  //Will include id later on to implement the same to identify the list item .....
  //Will include plantID too..
  // const handleClick = (infrastructure) => {
  //   const paramIssue = infrastructure.trim();
  //   console.log("Category is => ", paramIssue);
  //   const data={infrastructure:infrastructure,plantID:1};
  //   console.log("Data sent is => ",data)
  //   history.push({ pathname: "/conf", state: data });
  // };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });
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
    const regex = /[^A-Za-z0-9 _]/;
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
    const data = { infrastructure: newCateogry, plantID: 1 };
    console.log("Data sent is => ", data);
    navigate("/admin/infrastructure/addIssues", { state: data });
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
    console.log("updateInfraNameDB() called");
    console.log("Previous Infrastructure : ", prev_infra);
    console.log("New Infrastucture : ", new_infraname);
    try {
      const plantID = "1";
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
        //   const foundindex = originalInfrarows.indexOf(prev_infra);
        //   console.log('Modificaition initiated')
        //   const newInfraList = [...originalInfrarows];
        //   newInfraList[foundindex] = editValue.trim();
        //   setInfraList(newInfraList);
        //   setoriginalInfraRows(newInfraList);
        //   console.log("newInfraList => ", newInfraList);
        //   setSearch("");
        //   setEditRowIndex(null);
        //   setEditValue("");
        //   setsnackbarSeverity("success");
        //   setSnackbarText("Changes are saved !");
        // setOpen(true);
        return true;
      }
    } catch (error) {
      console.log("Error in updating infra name");
      setsnackbarSeverity("error");
      setSnackbarText("Database Error !");
      setOpen(true);
      setSearch("");
      setEditRowIndex(null);
      setEditValue("");
      return false;
    }
  };

  const deletefromDB = async (infra_name) => {
    try {
      const plantID = "1";
      const response = await fetch(
        `http://localhost:8081/infrastructure/admin`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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

  const handleDeleteClick = async (row) => {
    console.log("handleDeleteClick() called");
    const infra_name = row.categoryname;
    console.log(" Row  to delete: ", infra_name);
    // return true;
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
      const regex = /[^A-Za-z0-9 _]/;
      if (regex.test(currentSearch.trim())) {
        setsnackbarSeverity("error");
        setSnackbarText("Special Characters are not allowed ! ");
        setCategoryError(true);
        setOpen(true);
        return;
      }
      const updatedRows = [...originalInfrarows];
      const filteredRows = updatedRows.filter((infra) =>
        infra.toLowerCase().includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredRows);
      setInfraList(filteredRows);
      setEditRowIndex(null);
    }
  };

  const handleCategoryChange = (e) => {
    console.log("handleCategoryChange() called");
    setCategoryError(false);
    setNewCategory(e.target.value);
    const currentCategory = e.target.value;
    const regex = /[^A-Za-z0-9 _]/;
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
    const data = { infrastructure: categoryname, plantID: 1 };
    console.log("Data sent is => ", data);
    navigate("/admin/infrastructure/addIssues", { state: data });
    //history.push({pathname:"/"})
    // console.log("Category==========>"+category.categoryname);
    // navigate(`/Device/Category/Issue`, {
    //   state: { issuelist: category.issuelist, categoryname: category.categoryname },
    // });
  };

  return (
    <AnimatedPage>
      <div>
        <center>
          <Container sx={classes.conatiner}>
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
            ></CustomTable>
          </Container>
          <br />
          <br />
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
