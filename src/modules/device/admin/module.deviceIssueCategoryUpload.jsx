// import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import React, { useState, useEffect, useContext } from "react";
import { extendTokenExpiration } from "../../../modules/helper/Support360Api";

/*Navigation Pane*/
import Sidebar from "../../../components/navigation/sidebar/sidebar";
import Topbar from "../../../components/navigation/topbar/topbar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";

/*Custom Components */
import Table from "../../../components/table/table.component";
import DialogBox from "../../../components/snackbar/customsnackbar.component";
import Textfield from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import NotFound from "../../../components/notfound/notfound.component";
import { useUserContext } from "../../contexts/UserContext";
import { fetchAllProjectDetails } from "../../helper/AllProjectDetails";
import { display } from "@mui/system";

const DeviceCategory = ({ sendUrllist }) => {
  const { userData, setUserData } = useUserContext();

  // const plantid = 'NA';
  //const role = userData.role;
  console.log(userData);
  const [open, setOpen] = useState(false);
  const [categorylist, setCategorylist] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;
  const [showpipispinner, setShowpipispinner] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantDetails, setPlantDetails] = useState([]);
  const [plantid, setPlantid] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);

  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    {
      pageName: "Device Issue Category",
      pagelink: "/admin/Device/CategoryConfigure",
    },
  ];

  const columns = [
    {
      id: "categoryname",
      label: "Category Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];
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
  const fetchDivs = async (role) => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=/admin/Device/CategoryConfigure`,
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
      console.log("Error in getting divs name :", error);
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
      console.log(`userhome Bearer ${localStorage.getItem("token")}`);
      // Make the API call to fetch data
      const response = await axios.get(
        `http://${DB_IP}/device/admin/${plantid}/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extract data from the response
      const data = await response.data;
      console.log("data=====>", JSON.stringify(data));
      if (data) {
        const renamedData = data.map((item) => ({
          categoryname: item.issuecategoryname, // Use correct key
          issuelist: item.issueList.map((issue) => ({
            issuename: issue.issuename, // Use correct key
            severity: issue.severity,
          })),
        }));
        console.log(renamedData);
        setCategorylist(renamedData);
        setFilteredRows(renamedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const functionsCalledOnUseEffect = async () => {
    console.log("Function called on useEffect")
    if( localStorage.getItem("token")===null||localStorage.getItem("token")===''){
      console.log("Local storage::", localStorage.getItem("token"))
      navigate("/login")
    }
    else{
    extendTokenExpiration();

    sendUrllist(urllist);
    //await fetchData();
    // fetchDivs();
    const projects = await fetchAllProjectDetails();
    setProjectDetails(projects);
    const uniquePlantNames = Array.from(
      new Set(projects.map((plant) => plant.plant_name))
    );
    setPlantDetails(uniquePlantNames);
    await fetchUser();
    setShowpipispinner(false);
  }
  };
  useEffect(() => {
    const plant = projectDetails.find(
      (plant) => plant.plant_name.trim() === selectedPlant.trim()
    )?.plant_id;
    setPlantid(plant);
  }, [selectedPlant]);
  useEffect(() => {
    fetchData();
  }, [plantid]);
  useEffect(() => {
    functionsCalledOnUseEffect();
    
  }, []);

  const handleEditClick = (rowData) => {
    console.log("Edit Click: " + rowData.categoryname);
    setEditRow(rowData);
    setEditedValue(rowData.categoryname); // Set initial value of input
  };

  const checkInput = (input) => {
    console.log("Check Input===>" + input);
    if (input == null || input.trim() === "") {
      setDialogMessage("Empty string is not allowed");
      setOpenPopup(true);
      setsnackbarSeverity("error");
      return true;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(input.trim())) {
      setOpenPopup(true);
      setDialogMessage("Special Character is not allowed");
      setsnackbarSeverity("error");
      return true;
    }
    return false;
  };

  const handleDeleteClick = async (rowData) => {
    console.log("Handle del");
    // Create a request body object
    const requestBody = {
      plantid: plantid,
      categoryname: rowData.categoryname,
    };

    try {
      // Send requestBody as request body in the DELETE request
      await axios.delete(`http://${DB_IP}/device/admin/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });
      setCategorylist(categorylist.filter((category) => category !== rowData));
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database error");
      setsnackbarSeverity("error");
      // Handle errors, such as displaying an error message to the user
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEditedValue(value); // Update input value
  };
  const handleDisableIssueButton = () => {
      console.log("Disabled function entered,");
      console.log(plantid, ":::");
      return plantid === '' || plantid === null || plantid===undefined;
    };
  
  const handleRedirect = (category) => {
    const categoryname = category.categoryname;
    console.log("Category==========>" + category.categoryname);
    navigate(`/admin/Device/CategoryConfigure/Issue`, {
      state: {
        plantid: plantid,
        issuelist: category.issuelist,
        categoryname: category.categoryname,
      },
    });
  };

  const editCategory = async (selectedCategory, updatedCategory) => {
    console.log("Save to database method called");
    if (updatedCategory.issuelist !== null) {
      const requestData = {
        issuecategoryname: updatedCategory.categoryname,
        plantid: plantid,
        issueList: updatedCategory.issuelist,
      };
      try {
        const response = await axios.put(
          `http://${DB_IP}/device/admin/${plantid}/categories/` +
            selectedCategory.categoryname,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return true;
        console.log(response.data); // Handle response data
      } catch (error) {
        console.error("Error:", error);
        setOpenPopup(true);
        setDialogMessage("Databse Error");
        setsnackbarSeverity("error");
        return false;
      }
    }
  };

  const navigate = useNavigate();

  function submitCategory(event) {
    event.preventDefault();
    if (categoryName.trim() !== "") {
      const categoryExists = categorylist.some(
        (cat) => cat.categoryname === categoryName
      );
      if (categoryExists) {
        setDialogMessage("Category name already exists.");
        setOpenPopup(true);
        return;
      }
      if (checkInput(categoryName)) return;
      const row = { categoryname: categoryName, issuelist: [] };
      setCategorylist([...categorylist, row]);
      handleRedirect(row);
      setCategoryName("");
    } else {
      setDialogMessage("Please provide a category name.");
      setOpenPopup(true);
    }
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  if (localStorage.getItem("token") === null) {
    console.log("Not found");
    return <NotFound />;
  }

  return (
    <div>
      {showpipispinner && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "40px" }} />
        </div>
      )}
      {divIsVisibleList.length !== 0 && (
        <Box>
          <div>
            <Container>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {divIsVisibleList.length != 0 && (
                  <Box>
                    <div style={{ padding: "10px" }}>
                      <Dropdown
                        list={plantDetails}
                        label={"Select Plant"}
                        value={selectedPlant}
                        onChange={(event) => {
                          setSelectedPlant(event.target.value);
                          setPlantid(event.target.value);
                        }}
                        style={{ width: "200px" }}
                      />
                    </div>
                  </Box>
                )}
                {divIsVisibleList &&
                  divIsVisibleList.includes("add-new-category") && (
                    <form
                      onSubmit={submitCategory}
                      style={{ marginLeft: "40%" }}
                    >
                      <Textfield
                        label={"Issue Category "}
                        id="issuecategory"
                        value={categoryName}
                        style={{ width: "200px" }}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                      &nbsp;
                      <Button
                        color="primary"
                        variant="contained"
                        // style={{ width: "200px" }}
                        type="submit"
                        size="medium"
                        sx={{
                          padding: "15px 18px",
                          backgroundImage:
                            "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                        }}
                        disabled={handleDisableIssueButton()}
                      >
                        Add &nbsp;
                        <AddCircleOutlineOutlinedIcon
                          fontSize="medium"
                          sx={{ color: "white" }}
                        ></AddCircleOutlineOutlinedIcon>
                      </Button>
                    </form>
                  )}
              </Box>
              &nbsp;&nbsp;
              {divIsVisibleList &&
                divIsVisibleList.includes("device-category-table") && (
                  <Table
                    rows={categorylist}
                    columns={columns}
                    progressVisible={true}
                    setRows={setCategorylist}
                    savetoDatabse={editCategory}
                    redirectColumn={"categoryname"}
                    handleRedirect={handleRedirect}
                    isDeleteDialog={true}
                    deleteFromDatabase={handleDeleteClick}
                    editActive={true}
                    tablename={"Existing Device Issue Category"}
                    /*style={}*/ redirectIconActive={true}
                  />
                )}
            </Container>

            {/* </Box> */}
          </div>
          <DialogBox
            snackbarSeverity={snackbarSeverity}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            dialogMessage={dialogMessage}
          />
        </Box>
      )}
    </div>
  );
};

export default DeviceCategory;
