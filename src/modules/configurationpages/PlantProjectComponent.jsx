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

const PlantProjectComponent = ({
  plant_name: initialPlantName,
  plant_id: initialPlantId,
}) => {
  const [plant_name, setPlant_name] = useState(initialPlantName);
  const [plant_id, setPlant_id] = useState(initialPlantId);
  const [project_name, setProject_name] = useState("");
  const [support_start_date, setSupport_start_date] = useState(null);
  const [support_end_date, setSupport_end_date] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");

  useEffect(() => {
    console.log(
      `PlantProjectComponent called with name ${initialPlantName} and is ${initialPlantId}`
    );
    fetchProjects();
  }, []);

  // const fetchProjects = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://${DB_IP}/plants/projectDetails`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("fetchProjects : ", response.data);
  //     setProjects(response.data);
  //   } catch (error) {
  //     console.error("Error fetching project details:", error);
  //     showSnackbar("Error fetching project details", "error");
  //   }
  // };

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

      const filteredProjects = response.data.filter(
        (project) =>
          project.plant_name === initialPlantName &&
          project.plant_id === initialPlantId
      );

      setProjects(filteredProjects);
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

    const formattedStartDate = support_start_date
      ? dayjs(support_start_date).format("YYYY-MM-DD")
      : null;
    const formattedEndDate = support_end_date
      ? dayjs(support_end_date).format("YYYY-MM-DD")
      : null;

    const formData = {
      plant_name,
      plant_id,
      project_name,
      support_start_date: formattedStartDate,
      support_end_date: formattedEndDate,
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
    setProject_name("");
    setSupport_start_date(null);
    setSupport_end_date(null);
    setFormDialogOpen(false); // Close the form dialog
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setProject_name(project.project_name);
    setSupport_start_date(dayjs(project.support_start_date));
    setSupport_end_date(dayjs(project.support_end_date));
    setEditIndex(index);
    setFormDialogOpen(true); // Open the form dialog for editing
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
      {/* <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setTableDialogOpen(true)}
          sx={{ ml: 2 }}
        >
          Show Projects
        </Button>
      </Box> */}
      <Dialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editIndex !== null ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Plant Name"
                  fullWidth
                  value={plant_name}
                  onChange={(e) => setPlant_name(e.target.value)}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Plant Id"
                  fullWidth
                  value={plant_id}
                  onChange={(e) => setPlant_id(e.target.value)}
                  disabled
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editIndex !== null ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Projects</DialogTitle>
        <DialogContent> */}
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
      {/* </DialogContent>
        <DialogContent> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFormDialogOpen(true)}
        >
          Add New Project
        </Button>
      </Box>
      {/* </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
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
