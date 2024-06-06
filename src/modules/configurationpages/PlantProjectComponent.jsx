import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import Datepicker from "../../components/datepicker/datepicker.component";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const DB_IP = process.env.REACT_APP_SERVERIP;

const PlantProjectComponent = () => {
  const [plant_name, setPlant_name] = useState("");
  const [plant_id, setPlant_id] = useState("");
  const [project_name, setProject_name] = useState("");
  const [support_start_date, setSupport_start_date] = useState(null);
  const [support_end_date, setSupport_end_date] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `http://${DB_IP}/plants/projectDetails`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("fetchProjects : ", response.data);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
      showSnackbar("Error fetching project details", "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !plant_name ||
      !plant_id ||
      !project_name ||
      !support_start_date ||
      !support_end_date
    ) {
      showSnackbar("All fields are required.", "error");
      return;
    }

    const formData = {
      plant_name,
      plant_id,
      project_name,
      support_start_date,
      support_end_date,
    };
    console.log("handleSubmit : ", formData);

    try {
      if (editIndex !== null) {
        // Update existing project
        const response = await axios.put(
          `http://${DB_IP}/plants/projectDetails`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updatedProjects = [...projects];
        updatedProjects[editIndex] = response.data;
        setProjects(updatedProjects);
        setEditIndex(null);
        showSnackbar("Project updated successfully", "success");
      } else {
        // Add new project
        const response = await axios.post(
          `http://${DB_IP}/plants/projectDetails`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProjects([...projects, response.data]);
        showSnackbar("Project added successfully", "success");
      }
      fetchProjects();
    } catch (error) {
      console.error("Error submitting project:", error);
      showSnackbar("Error submitting project", "error");
    }

    // Reset form fields
    setPlant_name("");
    setPlant_id("");
    setProject_name("");
    setSupport_start_date(null);
    setSupport_end_date(null);
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setPlant_name(project.plant_name);
    setPlant_id(project.plant_id);
    setProject_name(project.project_name);
    setSupport_start_date(dayjs(project.support_start_date));
    setSupport_end_date(dayjs(project.support_end_date));
    setEditIndex(index);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://${DB_IP}/plants/projectDetails`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { projectId: projectToDelete.project_name },
      });
      setProjects(
        projects.filter(
          (project) => project.project_name !== projectToDelete.project_name
        )
      );
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      showSnackbar("Project deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting project:", error);
      showSnackbar("Error deleting project", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarText(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Plant Name"
              fullWidth
              value={plant_name}
              onChange={(e) => setPlant_name(e.target.value)}
              disabled={editIndex !== null}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Plant Id"
              fullWidth
              value={plant_id}
              onChange={(e) => setPlant_id(e.target.value)}
              disabled={editIndex !== null}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Project Name"
              fullWidth
              value={project_name}
              onChange={(e) => setProject_name(e.target.value)}
              disabled={editIndex !== null}
            />
          </Grid>
          <Grid item xs={6}>
            <Datepicker
              label="Support Start Date"
              value={support_start_date ? dayjs(support_start_date) : null}
              onChange={(startDate) =>
                setSupport_start_date(startDate.format("YYYY-MM-DD"))
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Datepicker
              label="Support End Date"
              value={support_end_date ? dayjs(support_end_date) : null}
              onChange={(endDate) =>
                setSupport_end_date(endDate.format("YYYY-MM-DD"))
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {editIndex !== null ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Support Start Date</TableCell>
                <TableCell>Support End Date</TableCell>
                <TableCell>Plant Id</TableCell>
                <TableCell>Plant Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>{project.support_start_date}</TableCell>
                  <TableCell>{project.support_end_date}</TableCell>
                  <TableCell>{project.plant_id}</TableCell>
                  <TableCell>{project.plant_name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(project)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default PlantProjectComponent;
