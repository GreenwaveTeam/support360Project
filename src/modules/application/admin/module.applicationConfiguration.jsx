import React, { useContext, useEffect, useState } from "react";
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

export default function ModuleConfiguration({ sendUrllist }) {
  const { userData, setUserData } = useUserContext();

  const plantid = userData.plantID;
  const role = userData.role;
  const [open, setOpen] = useState(false);
  const [application_name, setApplication_name] = useState("");
  const [dialogPopup, setDialogPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);

  const columns = [
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
    { pageName: "Application", pagelink: "/admin/ApplicationConfigure" },
  ];

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;

  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);

      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=${role}&pagename=/admin/ApplicationConfigure`,
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

  useEffect(() => {
    const fetchData = async () => {
      console.log("Ischjscnjqnck");
      try {
        const response = await axios.get(
          `http://localhost:8081/application/admin/${plantid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const moduleData = response.data;
        setData(moduleData);
        setFilteredRows(moduleData);
        console.log(moduleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchDivs();
    sendUrllist(urllist);
  }, []);

  const [editRow, setEditRow] = useState(false);
  const handleEditSave = () => {};
  const handleDeleteClick = async (rowData) => {
    try {
      const requestBody = {
        plant_id: plantid,
        application_name: rowData.application_name,
        // Add other properties from rowData if needed
      };
      console.log("Request body=>" + JSON.stringify(requestBody));
      await axios.delete(
        `http://localhost:8081/application/admin/plantid/applicationname`,
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
    console.log("applicationedit===>" + JSON.stringify(rowData));

    // Create a request body object

    try {
      // Send requestBody as request body in the PUT request
      const response = await axios.put(
        `http://localhost:8081/application/admin/${plantid}/${prev.application_name}`,
        rowData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Posted data");
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

  const handleEditCancel = () => {};

  const handleRedirect = (appdata) => {
    console.log(appdata);
    navigate(`/admin/ApplicationConfigure/Modules`, {
      state: { application_name: appdata.application_name },
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
    console.log("Application name:" + application_name);
    navigate(`/admin/ApplicationConfigure/Module`, {
      state: { application_name: application_name, modulelist: null },
    });
  };
  if (localStorage.getItem("token") === null) return <NotFound />;

  return (
    <Container maxWidth="lg">
      {divIsVisibleList.length !== 0 && (
        <Box>
          <Box>
            {divIsVisibleList &&
              divIsVisibleList.includes("add-new-application") && (
                <form onSubmit={handleSubmit}>
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
                    }}
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
