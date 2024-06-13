import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Textfield from "../../components/textfield/textfield.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PlantProjectComponent from "./PlantProjectComponent";

export default function PlantPage({ sendUrllist }) {
  const navigate = useNavigate();
  const [selectedplantId, setSelectedplantId] = useState("");
  const [plantList, setPlantList] = useState([]);
  const [filteredPlantRows, setFilteredPlantRows] = useState(plantList);
  const [plantSearch, setPlantSearch] = useState("");
  const [openPlantDeleteDialog, setOpenPlantDeleteDialog] = useState(false);
  const [plantErrorOpen, setPlantErrorOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [newPlant, setNewPlant] = useState({
    plantName: "",
    plantID: "",
    address: "",
    customerName: "",
    division: "",
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
  });
  const [formErrors, setFormErrors] = useState({
    plantName: false,
    plantID: false,
    address: false,
    customerName: false,
    division: false,
    // supportStartDate: dayjs(),
    // supportEndDate: dayjs(),
  });
  const DB_IP = process.env.REACT_APP_SERVERIP;

  const newColors = ["#7e57c2"];
  const getColor = (index) => {
    return newColors[index % newColors.length];
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showForm, setShowForm] = useState(true);

  const [showPlantProjectComponent, setShowPlantProjectComponent] =
    useState(false);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Plant Configure", pagelink: "/admin/plantConfigure" },
  ];

  const location = useLocation();
  const currentPageLocation = useLocation().pathname;

  const [divIsVisibleList, setDivIsVisibleList] = useState([]);

  const [selectedPlantID, setSelectedPlantID] = useState("");
  const [selectedPlantName, setselectedPlantName] = useState("");

  useEffect(() => {
    fetchPlantData();
    sendUrllist(urllist);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    console.log("expire : ", localStorage.getItem("expire"));
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await response.json();
      console.log("fetchUser data : ", data);
      console.log("fetchUser email : ", data.email);

      let role = data.role;
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
      console.log("Currently passed Data : ", location.state);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        navigate("/*");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
        console.log("data.components.length : ", data.components.length);
        if (data.components.length === 0) {
          navigate("/*");
        }
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      if (fetchDivs.length === 0) {
        navigate("/*");
      }
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  const tableStyle = {
    color: "blue",
    border: "1px solid",
    borderColor: colors.grey[800],
    borderRadius: "0.7rem",
  };

  const handleCloseSnackbar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPlantErrorOpen(false);
  };

  const handleClickSnackbar = () => {
    setPlantErrorOpen(true);
  };

  function convertToTitleCase(str) {
    let words = str.split(/(?=[A-Z])/);
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  const handlePlantSearchChange = (event) => {
    setPlantSearch(event.target.value);
    console.log("Search => ", event.target.value);
    const currentSearch = event.target.value;
    console.log("Search => ", plantSearch);
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredPlantRows(plantList);
      console.log("plantList : 1 : ", plantList);
    } else {
      const updatedPlantRows = [...plantList];
      const filteredPlantRows = updatedPlantRows.filter(
        (plant) =>
          plant.plantID
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.plantName
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.address
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.customerName
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.division
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredPlantRows);
      setFilteredPlantRows(filteredPlantRows);
      console.log("plantList : 2 : ", filteredPlantRows);
    }
  };

  const fetchPlantData = async () => {
    console.log("filteredPlantList : ", `http://${DB_IP}/plants/`);
    try {
      const response = await fetch(`http://${DB_IP}/plants/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        // navigate("/Plant/home");
        return;
      }

      const data = await response.json();
      console.log("plantDetails : ", data);

      const filteredPlantList = data.filter((plant) => plant.plantID !== "NA");
      console.log("filteredPlantList : ", filteredPlantList);
      setPlantList(filteredPlantList);
      setFilteredPlantRows(filteredPlantList);
      console.log("plantList : 3 : ", filteredPlantList);
    } catch (error) {
      console.log(error);
    }
  };

  async function deletePlantByplantId(e) {
    console.log("plantId : ", e);
    try {
      const response = await fetch(
        `http://${DB_IP}/plants/plant?plantId=${e}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.ok;
      console.log("e : ", e);
      console.log("data : ", data);
      setPlantList((prevList) => prevList.filter((item) => item.plantID !== e));
      setFilteredPlantRows((prevList) =>
        prevList.filter((item) => item.plantID !== e)
      );

      // if (data) {
      //   navigate("/Plant/home");
      // }
    } catch (error) {
      console.log(error);
    }
  }

  const postPlantData = async () => {
    const newFormErrors = {};
    Object.keys(newPlant).forEach((key) => {
      if (newPlant[key] === null || newPlant[key] === "") {
        newFormErrors[key] = true;
      } else {
        newFormErrors[key] = false;
      }
    });
    setFormErrors(newFormErrors);

    for (const key in newPlant) {
      if (newPlant[key] === null || newPlant[key] === "") {
        handleClickSnackbar();
        setSnackbarText(`${convertToTitleCase(key)} must be filled`);
        setsnackbarSeverity("error");
        console.log(`${convertToTitleCase(key)} must be filled`);
        return;
      }
    }

    if (
      plantList.some(
        (p) =>
          p.plantName.toLowerCase().trim() ===
          newPlant.plantName.toLowerCase().trim()
      )
    ) {
      handleClickSnackbar();
      setSnackbarText("Plant name already exist");
      setsnackbarSeverity("error");
      return;
    }
    if (
      plantList.some(
        (p) =>
          p.plantID.toLowerCase().trim() ===
          newPlant.plantID.toLowerCase().trim()
      )
    ) {
      handleClickSnackbar();
      setSnackbarText("Plant Id already exist");
      setsnackbarSeverity("error");
      return;
    }

    try {
      console.log("JSON.stringify(newPlant) : ", JSON.stringify(newPlant));
      const response = await fetch(`http://${DB_IP}/plants/plant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlant),
      });

      if (response.ok) {
        const text = await response.text();
        handleClickSnackbar();
        setSnackbarText(text);
        setsnackbarSeverity("success");
        setNewPlant({
          ...newPlant,
          plantName: "",
          plantID: "",
          address: "",
          customerName: "",
          division: "",
        });
      } else {
        const text = await response.text();
        handleClickSnackbar();
        setSnackbarText(text);
        setsnackbarSeverity("error");
        return;
      }
      fetchPlantData();
      navigate("/admin/plantConfigure");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlantDelete = (plantId) => {
    setOpenPlantDeleteDialog(true);
    setSelectedplantId(plantId);
  };

  function removeAllSpecialChar(str) {
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9\s]/g, "");
    var stringWithoutExtraSpaces = stringWithoutSpecialChars.replace(
      /\s+/g,
      " "
    );
    return stringWithoutExtraSpaces;
  }

  const handleViewProjects = (name, id) => {
    console.log(`View projects for plant with name : ${name} and id : ${id}`);
    setselectedPlantName(name);
    setSelectedPlantID(id);
    setShowPlantProjectComponent(true);
  };

  const handleCloseDialog = () => {
    setShowPlantProjectComponent(false);
  };

  return (
    <>
      {divIsVisibleList && divIsVisibleList.includes("plant-configure") && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <IconButton
              variant="contained"
              onClick={toggleFormVisibility}
              sx={{
                backgroundColor: "#ff7043",
                borderRadius: "50px",
              }}
            >
              {showForm ? (
                <Tooltip title="Show All Plant">
                  <ArrowDropUpOutlinedIcon />
                </Tooltip>
              ) : (
                <Tooltip title="Add Plant">
                  <ArrowDropDownOutlinedIcon />
                </Tooltip>
              )}
            </IconButton>
          </div>
          {showForm && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Textfield
                    required
                    fullWidth={true}
                    name="plantName"
                    label="Plant Name"
                    id="plantName"
                    value={newPlant.plantName}
                    onChange={(e) => {
                      setNewPlant({
                        ...newPlant,
                        plantName: removeAllSpecialChar(e.target.value),
                      });
                      setFormErrors({
                        ...formErrors,
                        plantName: e.target.value.trim() === "",
                      });
                    }}
                    onBlur={(e) => {
                      setNewPlant({
                        ...newPlant,
                        plantName: removeAllSpecialChar(e.target.value.trim()),
                      });
                    }}
                    error={formErrors.plantName}
                    helperText={
                      formErrors.plantName && "Plant Name must be filled"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Textfield
                    required
                    fullWidth={true}
                    name="plantId"
                    label="plantId"
                    id="plantId"
                    value={newPlant.plantID}
                    onChange={(e) => {
                      setNewPlant({
                        ...newPlant,
                        plantID: removeAllSpecialChar(e.target.value.trim()),
                      });
                      setFormErrors({
                        ...formErrors,
                        plantID: e.target.value.trim() === "",
                      });
                    }}
                    error={formErrors.plantID}
                    helperText={formErrors.plantID && "Plant Id must be filled"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Textfield
                    required
                    fullWidth={true}
                    name="address"
                    label="Address"
                    id="address"
                    value={newPlant.address}
                    onChange={(e) => {
                      setNewPlant({ ...newPlant, address: e.target.value });
                      setFormErrors({
                        ...formErrors,
                        address: e.target.value.trim() === "",
                      });
                    }}
                    onBlur={(e) => {
                      setNewPlant({
                        ...newPlant,
                        address: e.target.value.trim(),
                      });
                    }}
                    error={formErrors.address}
                    helperText={formErrors.address && "Address must be filled"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Textfield
                    required
                    fullWidth={true}
                    name="customer"
                    label="Customer"
                    id="customer"
                    value={newPlant.customerName}
                    onChange={(e) => {
                      setNewPlant({
                        ...newPlant,
                        customerName: removeAllSpecialChar(e.target.value),
                      });
                      setFormErrors({
                        ...formErrors,
                        customerName: e.target.value.trim() === "",
                      });
                    }}
                    onBlur={(e) => {
                      setNewPlant({
                        ...newPlant,
                        customerName: removeAllSpecialChar(
                          e.target.value.trim()
                        ),
                      });
                    }}
                    error={formErrors.customerName}
                    helperText={
                      formErrors.customerName && "Customer Name must be filled"
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Textfield
                    required
                    fullWidth={true}
                    name="division"
                    label="Division"
                    id="division"
                    value={newPlant.division}
                    onChange={(e) => {
                      setNewPlant({
                        ...newPlant,
                        division: removeAllSpecialChar(e.target.value),
                      });
                      setFormErrors({
                        ...formErrors,
                        division: e.target.value.trim() === "",
                      });
                    }}
                    onBlur={(e) => {
                      setNewPlant({
                        ...newPlant,
                        division: removeAllSpecialChar(e.target.value.trim()),
                      });
                    }}
                    error={formErrors.division}
                    helperText={
                      formErrors.division && "Division must be filled"
                    }
                  />
                </Grid>
              </Grid>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1,
                    backgroundImage:
                      "linear-gradient(to top, #0ba360 0%, #3cba92 100%);",
                  }}
                  onClick={() => {
                    postPlantData();
                    fetchPlantData();
                  }}
                >
                  Save Plant
                </Button>
              </div>
            </>
          )}
          <Grid
            item
            xs={12}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TableContainer sx={tableStyle}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      sx={{
                        textAlign: "center",
                        fontSize: "15px",
                        fontWeight: "bold",
                        backgroundColor: colors.primary[400],
                      }}
                    >
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0rem 1rem",
                        }}
                      >
                        <Typography
                          component="h1"
                          variant="h6"
                          sx={{ fontWeight: "600" }}
                        >
                          Existing Plants
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",

                            columnGap: "1rem",
                          }}
                        >
                          <div>
                            <FormControl fullWidth>
                              <InputLabel htmlFor="search">
                                <div style={{ display: "flex" }}>
                                  <SearchOutlinedIcon
                                    style={{
                                      marginRight: "5px",
                                      padding: "14.5px 14px !important",
                                      height: "0.9375rem !important",
                                    }}
                                  />
                                  Search...
                                </div>
                              </InputLabel>

                              <OutlinedInput
                                label="   Search..."
                                autoComplete="search"
                                name="search"
                                required
                                fullWidth
                                id="search"
                                value={plantSearch}
                                sx={{
                                  marginLeft: "5px",
                                  width: "200px",
                                  padding: "23.5px 14px !important",
                                  height: "1.1375rem !important",
                                }}
                                onChange={(e) => handlePlantSearchChange(e)}
                                endAdornment={
                                  <Tooltip title="Clear">
                                    <InputAdornment position="end">
                                      <IconButton
                                        variant="contained"
                                        aria-label="delete"
                                        size="medium"
                                        onClick={() => {
                                          setPlantSearch("");
                                          setFilteredPlantRows(plantList);
                                          console.log(
                                            "plantList : 5 : ",
                                            plantList
                                          );
                                        }}
                                      >
                                        <CloseIcon fontSize="inherit" />
                                      </IconButton>
                                    </InputAdornment>
                                  </Tooltip>
                                }
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.primary[400] }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Plant Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Plant Id
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Division
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Support Start Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Support End Date
                    </TableCell> */}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      align="center"
                    >
                      Delete
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "14px" }}
                      align="center"
                    >
                      Projects
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPlantRows.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{item.plantName}</TableCell>
                      <TableCell align="center">
                        <Chip
                          variant="outlined"
                          label={item.plantID}
                          sx={{
                            color: getColor(index),
                            borderColor: getColor(index),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{item.address}</TableCell>
                      <TableCell align="center">{item.customerName}</TableCell>
                      <TableCell align="center">{item.division}</TableCell>
                      {/* <TableCell align="center">
                        {item.supportStartDate}
                      </TableCell>
                      <TableCell align="center">
                        {item.supportEndDate}
                      </TableCell> */}
                      <TableCell align="center">
                        <DeleteIcon
                          color="error"
                          style={{ cursor: "pointer" }}
                          onClick={() => handlePlantDelete(item.plantID)}
                        />
                        {/* <Dialog
                          open={openPlantDeleteDialog}
                          onClose={() => setOpenPlantDeleteDialog(false)}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Delete Plant Data?"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure you want to delete this Plant:{" "}
                              {selectedplantId} ?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => setOpenPlantDeleteDialog(false)}
                              color="primary"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                deletePlantByplantId(selectedplantId);
                                setOpenPlantDeleteDialog(false);
                              }}
                              color="error"
                              autoFocus
                            >
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog> */}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            handleViewProjects(item.plantName, item.plantID);
                          }}
                        >
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* {showPlantProjectComponent && ( */}
          <Dialog
            open={openPlantDeleteDialog}
            onClose={() => setOpenPlantDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Plant Data?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Plant: {selectedplantId} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenPlantDeleteDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deletePlantByplantId(selectedplantId);
                  setOpenPlantDeleteDialog(false);
                }}
                color="error"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={showPlantProjectComponent} onClose={handleCloseDialog}>
            <DialogContent>
              <PlantProjectComponent
                plant_name={selectedPlantName}
                plant_id={selectedPlantID}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* )} */}
          <Snackbar
            open={plantErrorOpen}
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
        </>
      )}
    </>
  );
}
