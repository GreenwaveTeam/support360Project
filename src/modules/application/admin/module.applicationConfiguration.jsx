import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

/*Navigation Pane*/
import Sidebar from "../../../components/navigation/sidebar/sidebar";
import Topbar from "../../../components/navigation/topbar/topbar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";

/*Custom Components*/
import Table from "../../../components/table/table.component";
import DialogBox from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import NotFound from "../../../components/notfound/notfound.component";
import { useUserContext } from "../../contexts/UserContext";
import { extendTokenExpiration } from "../../helper/Support360Api";
import Dropdown from "../../../components/dropdown/dropdown.component";
import { display, padding } from "@mui/system";
import { fetchAllProjectDetails } from "../../helper/AllProjectDetails";

const DB_IP = process.env.REACT_APP_SERVERIP;
export default function ModuleConfiguration({ sendUrllist }) {
  const { userData, setUserData } = useUserContext();

  // const plantid = userData.plantID;
  // const [role,setRole] = useState("")
  const [plantid, setPlantid] = useState(null);
  const [open, setOpen] = useState(false);
  const [application_name, setApplication_name] = useState("");
  const [dialogPopup, setDialogPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  const [showpipispinner, setShowpipispinner] = useState(true);
  const [projectDetails, setProjectDetails] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const columns = [
    {
      id: "project_name",
      label: "Project Name",
      type: "dropdown",
      canRepeatSameValue: false,
      values: projects,
      isSpecialCharacterAllowed:true
    },
    {
      id: "application_name",
      label: "Application Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
   
  ];
  const [data, setData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    { pageName: "Application", pagelink: "/admin/ApplicationConfigure" },
  ];

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;

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
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=/admin/ApplicationConfigure`,
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
      const response = await axios.get(
        `http://${DB_IP}/application/admin/${plantid}/${selectedProject}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const moduleData = response.data;
      console.log("Application Data:",moduleData)
      setData(moduleData);
      setFilteredRows(moduleData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const functionsCalledOnUseEffect = async () => {
    // fetchDivs();
    if( localStorage.getItem("token")===null||localStorage.getItem("token")===''){
      console.log("Local storage::", localStorage.getItem("token"))
      navigate("/login")
    }
    else{
    sendUrllist(urllist);
    extendTokenExpiration();
    const projects = await fetchAllProjectDetails();
    setProjectDetails(projects);
    const uniquePlantNames = Array.from(
      new Set(projects.map((plant) => plant.plant_name))
    );
    setPlantDetails(uniquePlantNames);
    //await fetchData();
    await fetchUser();
    setShowpipispinner(false);
  }
  };
  useEffect(() => {
    functionsCalledOnUseEffect();
  }, []);
  useEffect(() => {
    const selectedprojects = projectDetails.filter(
      (plant) => plant.plant_name === selectedPlant
    );
    setProjects(selectedprojects.map((project) => project.project_name));
    console.log("Selected plant:", selectedPlant);
    const plant = projectDetails.find(
      (plant) => plant.plant_name.trim() === selectedPlant.trim()
    )?.plant_id;
    console.log("Plant:", plant);
    setPlantid(plant);
    setData([]);
    setFilteredRows([]);
    setSelectedProject(null)
  }, [selectedPlant]);
  useEffect(() => {
    setData([]);
    setFilteredRows([]);

    fetchData();
  }, [selectedProject]);

  const handleDeleteClick = async (rowData) => {
    try {
      const requestBody = {
        plant_id: plantid,
        application_name: rowData.application_name,
        project_name: selectedProject,
        // Add other properties from rowData if needed
      };
      await axios.delete(
        `http://${DB_IP}/application/admin/plantid/applicationname`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        }
      );
      const updatedCategories = data.filter(
        (app) => app.application_name !== rowData.application_name
      );
      setData(updatedCategories);
    } catch (e) {
      console.log("Exception");
      setDialogPopup(true);
      setDialogMessage("Database error!");
      setsnackbarSeverity("error");
    }
  };

  const handleSaveClick = async (prev, rowData) => {
    // Create a request body object

    try {
      // Send requestBody as request body in the PUT request
      const response = await axios.put(
        `http://${DB_IP}/application/admin/updateApplicationDetails/${plantid}/${selectedProject}/${prev.application_name}`,
        rowData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error:", error);
      setDialogPopup(true);
      setDialogMessage("Database error!");
      setsnackbarSeverity("error");
      return false;
      // Handle errors, such as displaying an error message to the user
    }
  };

  const handleRedirect = (appdata) => {
    console.log("Handle redirect method invoked");
    navigate(`/admin/ApplicationConfigure/Modules`, {
      state: {
        application_name: appdata.application_name,
        plantid: plantid,
        selectedProject: selectedProject,
      },
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.some((app) => app.application_name === application_name)) {
      setDialogPopup(true);
      setDialogMessage("Application Name already Exists");
      setsnackbarSeverity("error");
      return;
    }
    if (application_name.trim() === "") {
      setDialogPopup(true);
      setDialogMessage("Application Name cannot remain blank");
      setsnackbarSeverity("error");
      return;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(application_name.trim())) {
      setsnackbarSeverity("error");
      setDialogPopup(true);
      setDialogMessage("Special characters are not allowed");
      return true;
    }
    navigate(`/admin/ApplicationConfigure/Module`, {
      state: {
        application_name: application_name,
        modulelist: null,
        plantid: plantid,
        selectedProject: selectedProject,
      },
    });
  };
  if (localStorage.getItem("token") === null) return <NotFound />;

  return (
    <Container maxWidth="lg">
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
          <Box>
            <Box style={{ display: "flex", flexDirection: "row" }}>
              <Box style={{ display: "flex", flexDirection: "row" }}>
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
                {selectedPlant&&
                  <div style={{ padding: "10px" }}>
                  <Dropdown
                    list={projects}
                    label={"Select Project"}
                    style={{ width: "200px" }}
                    onChange={(event) => {
                      setSelectedProject(event.target.value);
                    }}
                  />
                </div>
                }
              </Box>
              {divIsVisibleList &&
                divIsVisibleList.includes("add-new-application") && !(selectedProject===null 
                  ||selectedProject==='' || selectedProject===undefined
                )&&(
                  <form onSubmit={handleSubmit} style={{ marginLeft: "20%" }}>
                    <TextField
                      label={"Application Name"}
                      id="issuecategory"
                      size="medium"
                      onChange={(e) => {
                        setApplication_name(e.target.value);
                      }}
                    />
                    &nbsp; &nbsp;
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      size="medium"
                      sx={{
                        padding: "15px 18px",
                        backgroundImage:
                          "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                      }} disabled={selectedProject===null}
                    >
                      Add&nbsp;
                      <AddCircleOutlineOutlinedIcon
                        fontSize="medium"
                        sx={
                          {
                            //color: "white",
                          }
                        }
                      ></AddCircleOutlineOutlinedIcon>
                    </Button>
                  </form>
                )}
            </Box>
            {/* <Box boxShadow={3} p={3} borderRadius={10}  
            sx={{backgroundColor: "#B5C0D0",display: 'flex',flexDirection:'column',width:'40%',
            justifyContent: 'center',}}alignItems={'center'} marginTop={'10px'}>
            <Typography variant="h6"fontWeight={900} gutterBottom >Existing Application</Typography>
            
            
            <DataTable
                value={data}
                paginator
                
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                 width="100%" height="100%"
            >
                <Column
                field="applicationname"
                header="Existing Application"
                body={(rowData) => (
                        <Typography variant="body1">{rowData.application_name}</Typography>
                    )}/>
                <Column
          
          body={(rowData) => (
            <>

                  <ArrowForwardIcon onClick={() => {handleRedirect(rowData)}} />
                  <DeleteIcon onClick={() => handleDeleteClick(rowData)} />
                </>
          )}
        />
                
            </DataTable> 
            </Box>*/}
            &nbsp;
            {divIsVisibleList &&
                
              divIsVisibleList.includes("existing-application-table") && (
                <Table
                  rows={data}
                  setRows={setData}
                  redirectColumn={"application_name"}
                  isDeleteDialog={true}
                  columns={columns}
                  savetoDatabse={handleSaveClick}
                  handleRedirect={handleRedirect}
                  deleteFromDatabase={handleDeleteClick}
                  editActive={true}
                  tablename={"Existing Applications"}
                  progressVisible={true}
                  /*style={}*/ redirectIconActive={true}
                />
              )}
          </Box>
          <DialogBox
            snackbarSeverity={snackbarSeverity}
            openPopup={dialogPopup}
            setOpenPopup={setDialogPopup}
            dialogMessage={dialogMessage}
          />
        </Box>
      )}
    </Container>
  );
}
