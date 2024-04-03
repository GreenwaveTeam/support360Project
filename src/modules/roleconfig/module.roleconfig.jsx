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
export default function RoleConfiguration() {
  const [role, setRole] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState(null);

  const navigate = useNavigate();

  const columns = [
    {
      id: "role",
      label: "Role Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://localhost:8081/role`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        // Extract data from the response
        const data = await response.data;
        console.log("data=====>", JSON.stringify(data));
        if (data) {
          const renamedData = data.map((item) => ({
            role: item,
          }));
          console.log(renamedData);
          setRows(renamedData);
          setFilteredRows(renamedData);
        }
      } catch (e) {
        //console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage("Database Error");
        setsnackbarSeverity("error");
      }
    };
    fetchData();
  }, []);
  const handleRedirect = () => {
    //if()
    navigate(`/admin/role/Page`, {
      state: { role: role },
    });
  };
  const handleDelete = async (rowdata) => {
    const requestBody = {
      role: rowdata.role,
    };
    console.log("Delete=>" + JSON.stringify(requestBody));
    try {
      const response = await axios.delete(
        "http://localhost:8081/role/currentrole",
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
      state: { role: row.role },
    });
  };
  return (
    <Box>
      <Container sx={{ marginTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label={"Role "}
            id="role"
            value={role}
            style={{ width: "200px" }}
            onChange={(e) => setRole(e.target.value)}
          />
          &nbsp;
          <Button
            color="primary"
            variant="contained"
            style={{ width: "200px" }}
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
          // savetoDatabse={editCategory}   isDeleteDialog={true}
          // editActive={true} tablename={"Existing Device Issue Category"}
          // /*style={}*/
        />
      </Container>
    </Box>
  );
}
