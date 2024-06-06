import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, MenuItem, Button, Container } from "@mui/material";

/*Custom Components*/
import Table from "../../../components/table/table.component";
import DialogBox from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import NotFound from "../../../components/notfound/notfound.component";
import { useUserContext } from "../../contexts/UserContext";
import { padding } from "@mui/system";
import { extendTokenExpiration } from "../../helper/Support360Api";

const DeviceIssue = ({ sendUrllist }) => {
  const [open, setOpen] = useState(false);
  const { userData, setUserData } = useUserContext();

  const plantid = 'NA';
  const role = userData.role;
  //const history=useHis
  const location = useLocation();
  // if(location.state.categoryname===null)
  // navigate('/notfound');
  const categoryname = location.state.categoryname;
  const [showpipispinner,setShowpipispinner]=useState(true)
  const [issueList, setIssueList] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "User Configure", pagelink: "/admin/configurePage" },
    {
      pageName: "Device Issue Category",
      pagelink: "/admin/Device/CategoryConfigure",
    },
  ];

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const currentPageLocation = useLocation().pathname;
  const navigate = useNavigate();

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
  const [issueName, setIssueName] = useState("");
  const [severity, setSeverity] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  // useEffect(() => {
  //   console.log("Location.state");
  //   // Create a copy of the location object
  //   const updatedLocation = { ...location };
  //   // Update the state inside the copied location object
  //   updatedLocation.state = {
  //     ...updatedLocation.state,
  //     issuelist: issueList
  //   };
  //   // Replace the location with the updated one
  //   window.history.replaceState({issuelist: issueList}, '', location.pathname );
  // }, [issueList]);
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
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=/admin/Device/CategoryConfigure/Issue`,
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
        `http://${DB_IP}/device/admin/${plantid}/${categoryname}`,
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
        setIssueList(data.issueList);
        setFilteredRows(data.issueList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const functionsCalledOnUseEffect=async()=>{
    
    extendTokenExpiration();
    if (plantid === null) navigate("/notfound");
    
    sendUrllist(urllist);
    await fetchData();
    // fetchDivs();
    await fetchUser();
    setShowpipispinner(false)
    //const issues = location.state.issuelist;
  }
  useEffect(() => {
    
    functionsCalledOnUseEffect()
  }, []);
  const addIssueCategory = async () => {
    console.log("Add Issue");

    try {
      const requestData = {
        issuecategoryname: categoryname,
        plantid: plantid,
        issueList: [{ issuename: issueName, severity: severity }],
      };
      const response = await axios.post(
        `http://${DB_IP}/device/admin/${plantid}/categories/` + categoryname,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return true; // Handle response data
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const editIssueCategory = async (prev, rowData) => {
    console.log("useEffectIssue");

    try {
      const requestData = {
        issuecategoryname: categoryname,
        plantid: plantid,
        issueList: [
          { issuename: rowData.issuename, severity: rowData.severity },
        ],
      };
      console.log("Edit Issue called");
      const response = await axios.put(
        `http://${DB_IP}/device/admin/${plantid}/categories/${categoryname}/` +
          prev.issuename,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return true; // Handle response data
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database Error");
      setsnackbarSeverity("error");
      return false;
    }
  };
  const deleteIssueCategory = async (rowdata) => {
    console.log("useEffectIssue");
    const requestBody = {
      plantid: plantid,
      categoryname: categoryname,
      issuename: rowdata.issuename,
    };
    try {
      const response = await axios.delete(
        `http://${DB_IP}/device/admin/categories/issue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        }
      );
      setIssueList(issueList.filter((issue) => issue !== rowdata));
      console.log("Successfully deleted");
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database Error");
      setsnackbarSeverity("error");
    }
  };

  const submitIssue = async (event) => {
    event.preventDefault();
    if (issueName.trim() !== "" && severity.trim() !== "") {
      const issueExists = issueList.some(
        (issue) => issue.issuename === issueName
      );

      if (issueExists) {
        setOpenPopup(true);
        setDialogMessage("Issue name already exists.");
        setsnackbarSeverity("error");
        return;
      }
      const regex = /[^A-Za-z0-9 _]/;
      if (regex.test(issueName.trim())) {
        setOpenPopup(true);
        setDialogMessage("Special Character is not allowed");
        setsnackbarSeverity("error");
        return;
      }
      const check = await addIssueCategory();

      if (check === false) {
        setOpenPopup(true);
        setDialogMessage("Database Error");
        setsnackbarSeverity("error");
        return;
      }
      const newIssue = { issuename: issueName, severity: severity };
      setIssueList((prevIssues) => [...prevIssues, newIssue]);
      setFilteredRows((prevIssues) => [...prevIssues, newIssue]);
    } else {
      setOpenPopup(true);
      setDialogMessage("Please provide both issue name and severity.");
      setsnackbarSeverity("error");
      return;
    }

    setIssueName("");
    setSeverity("");
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  if (localStorage.getItem("token") === null) return <NotFound />;
  return (
    <Container maxWidth="lg">
      {showpipispinner&& 
        <div  style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <i className="pi pi-spin pi-spinner"  style={{ fontSize: '40px' }} />
        </div>
      }
      {divIsVisibleList.length !== 0 && (
        <Box>
          <Box
          // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Box>
              <Container>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onSubmit={submitIssue}
                >
                  {/* <CustomTextfield
              //onChange={(e) => setAddIssue(e.target.value)}
              // sx={classes.txt}
              label={"Enter Issue Name"}
              variant={"outlined"}  onChange={(e) => setIssueName(e.target.value)} 
              required
              value={issueName}
              //error={addIssueError}
            />&nbsp;&nbsp;
            <CustomDropdown
              id={"add-severity"}
              value={severity} onChange={(e) => setSeverity(e.target.value)}
              label={"Severity"}
            > 
              <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Major">Major</MenuItem>
                <MenuItem value="Minor">Minor</MenuItem>
              
            </CustomDropdown>*/}
                  <TextField
                    label={"Issue Name"}
                    id="issue"
                    style={{ width: "200px", paddingBottom: "1rem" }}
                    value={issueName}
                    onChange={(e) => setIssueName(e.target.value)}
                  />
                  <Dropdown
                    label={"Severity"}
                    value={severity}
                    style={{ width: "200px" }}
                    onChange={(e) => setSeverity(e.target.value)}
                    list={["Critical", "Major", "Minor"]}
                  />
                  &nbsp;&nbsp;
                  <Button
                    style={{ width: "200px" }}
                    color="primary"
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundImage:
                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                    }}
                  >
                    Add &nbsp;
                    <AddCircleOutlineOutlinedIcon
                      fontSize="medium"
                      sx={{ color: "white" }}
                    ></AddCircleOutlineOutlinedIcon>
                  </Button>
                  {/* <Button variant="contained" sx={{ width: '300px' }} type='submit'>Add Issue</Button> */}
                </form>
                {/* <Table rows={issues} header={'Current Acronym Name ➥ '+categoryname} filteredRows={issues} setRows={setissues} setFilteredRows={setissues} editIssueCategory={handleEditIssue} deleteIssueCategory={handleDeleteIssue}/>
                 */}
              </Container>
            </Box>
            &nbsp;
            <Table
              progressVisible={true}
              rows={issueList}
              setRows={setIssueList}
              columns={columns}
              savetoDatabse={editIssueCategory}
              deleteFromDatabase={deleteIssueCategory}
              editActive={true}
              snackbarSeverity={snackbarSeverity}
              isDeleteDialog={true}
              tablename={"Existing Device Issues"} /*style={}*/
            />
          </Box>
          <DialogBox
            openPopup={openPopup}
            snackbarSeverity={snackbarSeverity}
            setOpenPopup={setOpenPopup}
            dialogMessage={dialogMessage}
          />
        </Box>
      )}
    </Container>
  );
};

export default DeviceIssue;
