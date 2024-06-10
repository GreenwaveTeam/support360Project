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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/dropdown/dropdown.component";
import Table from "../../components/table/table.component";
import { Container } from "@mui/material";
import axios from "axios";
/*Navigation Pane*/
import Sidebar from "../../components/navigation/sidebar/sidebar";
import Topbar from "../../components/navigation/topbar/topbar";
import Main from "../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { extendTokenExpiration } from "../helper/Support360Api";

export default function RoleConfiguration({ sendUrllist }) {
  const [role, setRole] = useState("");
  const [description,setDescription]=useState("")
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);
  const [open, setOpen] = useState(false);
  const DB_IP = process.env.REACT_APP_SERVERIP;
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Role", pagelink: "/admin/role" },
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
    }
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`user/home Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://${DB_IP}/role`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        // Extract data from the response
        const data = await response.data;
        // console.log("data=====>", JSON.stringify(data));
        // if (data) {
        //   const renamedData = data.map((item) => ({
        //     role: item,
        //   }));
        //   console.log(renamedData);
          setRows(data);
          setFilteredRows(data);
        console.log("Role configure:",data)
      } catch (e) {
        //console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage("Database Error");
        setsnackbarSeverity("error");
      }
    };
    extendTokenExpiration();
    fetchData();
    sendUrllist(urllist);
  }, []);
  const handleRedirect = () => {
    //if()
    navigate(`/admin/role/Page`, {
      state: { role: role ,description:description},
    });
  };
  const handleDelete = async (rowdata) => {
    const requestBody = {
      role: rowdata.role,
    };
    console.log("Delete=>" + JSON.stringify(requestBody));
    try {
      const response = await axios.delete(
        `http://${DB_IP}/role/currentrole`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        }
      );
      setRows(rows.filter((row) => row !== rowdata));
      console.log("Successfully deleted");
    } catch (error) {
      console.error("Error:", error);
      setOpenPopup(true);
      setDialogMessage("Database Error");
      setsnackbarSeverity("error");
    }
  };
  const handleRedirectToRolePage = (row) => {
    navigate(`/admin/role/Page`, {
      state: { role: row.role,description:row.description },
    });
  };
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
          />&nbsp;&nbsp;
          <TextField
            label={"Description "}
            id="description"
            value={description}
            style={{ width: "200px" }}
            onChange={(e) => setDescription(e.target.value)}
          />
          &nbsp;
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
            onClick={handleRedirect}
          >
            Add
          </Button>
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
          // savetoDatabse={editCategory}   isDeleteDialog={true}
          // editActive={true} tablename={"Existing Device Issue Category"}
          // /*style={}*/
        />
      </Container>
    </Box>
  );
}
