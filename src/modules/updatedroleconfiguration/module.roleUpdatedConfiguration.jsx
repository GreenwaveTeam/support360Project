import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/dropdown/dropdown.component";
import Table from "../../components/table/table.component";
import { Container } from "@mui/material";
/*Navigation Pane*/
import Sidebar from "../../components/navigation/sidebar/sidebar";
import Topbar from "../../components/navigation/topbar/topbar";
import Main from "../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { extendTokenExpiration } from "../helper/Support360Api";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import {
  deleteRole,
  fetchAllRoleDetails,
  updateAccessibilityRoleDescription,
} from "./allocaterole";

export default function RoleUpdatedConfiguration({ sendUrllist }) {
  //States
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  //States to hold data
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  //Snackbar related states
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);

  const [open, setOpen] = useState(false);

  const DB_IP = process.env.REACT_APP_SERVERIP;
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Role", pagelink: "/admin/roleconfigure" },
  ];

  const navigate = useNavigate();

  const columns = [
    {
      id: "role",
      label: "Role Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "description",
      label: "Description",
      type: "textbox",
      canRepeatSameValue: true,
    },
  ];

  //Functions
  const handleRedirect = () => {
    if (role.trim() !== "") {
      const roleExists = rows.some(
        (row) => row.role.toLowerCase() === role.trim().toLowerCase()
      );
      if (roleExists) {
        setDialogMessage("Role already exists.");
        setOpenPopup(true);
        return;
      }
    }
    navigate(`/admin/allocaterole`, {
      state: { role: role, description: description },
    });
  };
  const handleDelete = async (rowdata) => {
    const requestBody = {
      role: rowdata.role,
    };
    console.log("Delete=>" + JSON.stringify(requestBody));
    try {
      await deleteRole(requestBody);
      setRows(rows.filter((row) => row !== rowdata));
      console.log("Successfully deleted");
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database Error");
      setsnackbarSeverity("error");
    }
  };
  const editRole = async (selectedRow, updatedRow) => {
    try {
      await updateAccessibilityRoleDescription(updatedRow, selectedRow.role);
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database Error");
      setsnackbarSeverity("error");
    }
  };
  const handleRedirectToRolePage = (row) => {
    navigate(`/admin/allocaterole`, {
      state: { role: row.role, description: row.description },
    });
  };

  //Useeffects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllRoleDetails();
        setRows(data);
        setFilteredRows(data);
        console.log("Role configure:", data);
      } catch (e) {
        //console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage("Database Error");
        setsnackbarSeverity("error");
      }
    };
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("token") === ""
    ) {
      console.log("Local storage::", localStorage.getItem("token"));
      navigate("/login");
    } else {
      extendTokenExpiration();
      fetchData();
      sendUrllist(urllist);
    }
  }, []);
  return (
    <Box
    // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            // alignItems: "center",
          }}
        >
          <TextField
            label={"Role "}
            id="role"
            value={role}
            style={{ width: "200px" }}
            onChange={(e) => setRole(e.target.value)}
          />
          &nbsp;&nbsp;
          <TextField
            label={"Description "}
            id="description"
            value={description}
            style={{ width: "200px" }}
            onChange={(e) => setDescription(e.target.value)}
          />
          &nbsp;
          {role !== null && role !== undefined && role !== "" && (
            <Button
              color="primary"
              variant="contained"
              // style={{ width: "200px" }}
              startIcon={<AddCircleIcon />}
              sx={{
                backgroundImage:
                  "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
              }}
              type="submit"
              // disabled={role === null || role === undefined || role === ""}
              onClick={handleRedirect}
            >
              Add
            </Button>
          )}
        </Box>
        &nbsp;&nbsp;
        <Table
          rows={rows}
          columns={columns}
          setRows={setRows}
          handleRedirect={handleRedirectToRolePage}
          deleteFromDatabase={handleDelete}
          redirectColumn={"role"}
          redirectIconActive={true}
          tablename={"Role Configuration"}
          isDeleteDialog={true}
          savetoDatabse={editRole}
          editActive={true}
          // tablename={"Existing Device Issue Category"}
          // /*style={}*/
        />
        <SnackbarComponent
          openPopup={openPopup}
          snackbarSeverity={snackbarSeverity}
          setOpenPopup={setOpenPopup}
          dialogMessage={dialogMessage}
        />
      </Container>
    </Box>
  );
}
