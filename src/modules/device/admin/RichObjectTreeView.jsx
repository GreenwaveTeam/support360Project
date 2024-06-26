import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
//import DeleteIcon from "@mui/icons-material/Delete";
import CardHeader from "@mui/material/CardHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import CustomDatePicker from "./dateComp";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Typography from "@mui/material/Typography";
import { Toast } from "primereact/toast";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { Dialog } from "@mui/material";
//import CustomTree from "../../../components/Tree/tree.component";
import CustomTreeView from "../../../components/Tree/tree.component";
import TopbarPage from "../../../components/navigation/topbar/topbar";
import SidebarPage from "../../../components/navigation/sidebar/sidebar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";
import CustomDialog from "../../../components/dialog/dialog.component";
import Textfield from "../../../components/textfield/textfield.component";
import CustomButton from "../../../components/button/button.component";
import { useLocation, useNavigate } from "react-router-dom";
import { display, fontWeight, margin, width } from "@mui/system";
import { useUserContext } from "../../contexts/UserContext";
import DialogTitle from "@mui/material/DialogTitle";
import { Visibility } from "@mui/icons-material";
import SnackbarComponent from "../../../components/snackbar/customsnackbar.component";
import { extendTokenExpiration } from "../../helper/Support360Api";
import Dropdown from "../../../components/dropdown/dropdown.component";
import { fetchAllProjectDetails } from "../../helper/AllProjectDetails";

const DB_IP = process.env.REACT_APP_SERVERIP;
export default function RichObjectTreeView({ sendUrllist }) {
  const toast = useRef(null);
  const [selectedPlantAndProject, setSelectedPlantAndProject] = useState({
    plantId: "",
    project: "",
  });
  const [plantIdList, setPlantIdList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isError, setIsError] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [childNodeName, setChildNodeName] = useState("");
  const [rootNodeName, setRootNodeName] = useState("");
  const [data, setData] = useState(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [warrantyEndDate, setwarrantyEndDate] = useState(dayjs());
  const [supportEndDate, setSupportEndDate] = useState(dayjs());
  const [selectedImage, setSelectedImage] = useState(null);
  const [postDataStatus, setPostDataStatus] = useState(null);
  const [selectedImageBytes, setSelectedImageBytes] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [plantId, setPlantId] = useState("P009");
  const [plantid, setPlantid] = useState(null);
  const [showAddItemButton, setShowAddItemButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [clickedNode, setClickedNode] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To track if the node is being edited
  const [isEditingMake, setIsEditingMake] = useState(false); // To track if the node is being edited
  const [isEditingModel, setIsEditingModel] = useState(false); // To track if the node is being edited
  const [isEditingCapacity, setIsEditingCapacity] = useState(false); // To track if the node is being edited
  const [isEditingDescription, setIsEditingDescription] = useState(false); // To track if the node is being edited
  const [isEditingWarrantyDate, setIsEditingWarrantyDate] = useState(false); // To track if the node is being edited
  const [isEditingSupportDate, setIsEditingSupportDate] = useState(false); // To track if the node is being edited
  const [isEditingImageFile, setIsEditingImageFile] = useState(false); // To track if the node is being edited
  const [isEditingCatagory, setIsEditingCatagory] = useState(false); // To track if the node is being edited
  const [plantDetails, setPlantDetails] = useState([]);
  const [editedName, setEditedName] = useState("");
  const [editedMake, setEditedMake] = useState("");
  const [editedModel, setEditedModel] = useState("");
  const [editedCapacity, setEditedCapacity] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedWarrantyDate, setEditedWarrantyDate] = useState(dayjs());
  const [editedSupportDate, setEditedSupportDate] = useState(dayjs());
  const [editedImageBytes, setEditedImageBytes] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const { userData, setUserData } = useUserContext();
  // const [plantid, setPlantid] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  // const [selectedPlantId, setSelectedPlantId] = useState("Plant Demo 1");
  // const [selectedProject, setselectedProject] = useState("Project Demo 1");
  // const [plantDetails, setPlantDetails] = useState([]);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const currentPageLocation = useLocation().pathname;

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    extendTokenExpiration();
    fetchUser();
    // fetchDivs();
    fetchProjectAndPlantDetails();
    sendUrllist(urllist);
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
    setData(null);
    setSelectedNode();
  }, [selectedPlant]);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log(
        "Fetch : ",
        `http://${DB_IP}/device/admin/getTree/${plantid}/${selectedProject}`
      );
      try {
        const response = await fetch(
          `http://${DB_IP}/device/admin/getTree/${plantid}/${selectedProject}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Response is Ok");
        }

        if (
          response.ok &&
          (response !== null || response !== undefined || response !== "")
        ) {
          console.log("data true");
          const devData = await response.json();
          console.log("from API => ", JSON.stringify(devData));
          setData(devData);
        } else {
          setData(null);
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        setData(null);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setSelectedNode();
  }, [selectedProject]);

  const fetchProjectAndPlantDetails = async () => {
    console.log("fetchProjectAndPlantDetails() called");
    const projectDetails = await fetchAllProjectDetails();
    console.log("Project Details : ", projectDetails);
    const plantIdList = [];
    const projectList = [];
    if (projectDetails) {
      projectDetails.forEach((data) => {
        const currentPlant = data.plant_id;
        const currentProject = data.project_name;
        plantIdList.push(currentPlant);
        projectList.push(currentProject);
      });
    }
    console.log("Final PlantList : ", plantIdList);
    console.log("Final ProjectList : ", projectList);
    setPlantIdList(plantIdList);
    setProjectList(projectList);

    const indexAtZeroPlantId = plantIdList[0];
    const indexAtZeroProject = projectList[0];
    setSelectedPlantAndProject({
      ...selectedPlantAndProject,
      plantId: indexAtZeroPlantId,
      project: indexAtZeroProject,
    });
  };
  const functionsCalledOnUseEffect = async () => {
    // fetchDivs();
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
    // setShowpipispinner(false);
  };
  useEffect(() => {
    functionsCalledOnUseEffect();
  }, []);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${DB_IP}/device/admin/${plantid}/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [plantid, selectedProject]);
  // useEffect(() => {
  //   console.log('useEffect triggered:', selectedPlantAndProject);

  //   if (selectedPlantAndProject.plantId && selectedPlantAndProject.project) {
  //     console.log('Plant Id:', selectedPlantAndProject.plantId, 'Project:', selectedPlantAndProject.project);
  //     fetchInfraFromDb(selectedPlantAndProject.plantId, selectedPlantAndProject.project);
  //   } else {
  //     console.log('Plant ID or Project is missing:', selectedPlantAndProject);
  //   }
  // }, [selectedPlantAndProject]);
  React.useEffect(() => {
    console.log("useEffect called ");
    console.log("Data => ", data);
    // Recursively update the nodeLevel in the data
    const updateNodeLevel = (node, level) => {
      node.node_level = level;
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => updateNodeLevel(child, level + 1));
      }
    };

    if (data) {
      updateNodeLevel(data, 0);
    }
  }, [data]);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        if (data.components.length === 0) {
          navigate("/*");
          return;
        }

        setDivIsVisibleList(data.components);
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (value === "selectAnyone") {
      setSelectedCategory();
    }
    setSelectedCategory(value);
  };
  const handleEditCategoryChange = (event) => {
    setEditedCategory(event.target.value);
  };
  const handleEdit = (property) => {
    console.log("property ==> ", property);
    switch (property) {
      case "Name":
        setEditedName(selectedNode.name);
        setIsEditing(true);
        break;
      case "Make":
        setEditedMake(selectedNode.make);
        setIsEditingMake(true);
        break;
      case "Model":
        setEditedModel(selectedNode.model);
        setIsEditingModel(true);
        break;
      case "Capacity":
        setEditedCapacity(selectedNode.capacity);
        setIsEditingCapacity(true);
        break;
      case "Description":
        setEditedDescription(selectedNode.description);
        setIsEditingDescription(true);
        break;
      case "WarrantyDate":
        setEditedWarrantyDate(dayjs());
        setIsEditingWarrantyDate(true);
        break;
      case "SupportDate":
        setEditedSupportDate(dayjs());
        setIsEditingSupportDate(true);
        break;
      case "ImageFile":
        setEditedImageBytes(selectedNode.image_file);
        setIsEditingImageFile(true);
        break;
      case "Catagory":
        setEditedCategory(selectedNode.issue_category_name);
        setIsEditingCatagory(true);
        break;
      default:
        break;
    }
  };

  const handleSaveName = async (property) => {
    let selNode = selectedNode;
    let localData;
    console.log("Edited Category : ", editedCategory);
    if (selectedNode) {
      const updatedData = JSON.parse(JSON.stringify(data));
      findAndEditNode(
        property,
        updatedData,
        selectedNode.id,
        editedName,
        editedMake,
        editedModel,
        editedCapacity,
        editedDescription,
        editedWarrantyDate,
        editedSupportDate,
        editedImageBytes,
        editedCategory
      );

      localData = updatedData;

      const success = await handlePostData(localData);
      console.log("success ?", success);
      if (success) {
        setData(updatedData);

        setIsEditing(false);
        setIsEditingMake(false);
        setIsEditingModel(false);
        setIsEditingCapacity(false);
        setIsEditingDescription(false);
        setIsEditingWarrantyDate(false);
        setIsEditingSupportDate(false);
        setIsEditingImageFile(false);
        setIsEditingCatagory(false);
      }
    }
    console.log(selNode);
  };

  const handleCancelNameEdit = (property) => {
    console.log("cancel property= ", property);
    switch (property) {
      case "Name":
        setIsEditing(false);
        break;
      case "Make":
        setIsEditingMake(false);
        break;
      case "Model":
        setIsEditingModel(false);
        break;
      case "Capacity":
        setIsEditingCapacity(false);
        break;
      case "Description":
        setIsEditingDescription(false);
        break;
      case "WarrantyDate":
        setIsEditingWarrantyDate(false);
        break;
      case "SupportDate":
        setIsEditingSupportDate(false);
        break;
      case "ImageFile":
        setIsEditingImageFile(false);
        break;
      case "Catagory":
        setIsEditingCatagory(false);
        break;
      default:
        break;
    }

    setIsEditingMake(false);
    setIsEditingModel(false);
    setIsEditingCapacity(false);
    setIsEditingDescription(false);
    setIsEditingSupportDate(false);
    setIsEditingWarrantyDate(false);
    setIsEditingImageFile(false);
    setIsEditingCatagory(false);
  };
  const findAndEditNode = (
    property,
    node,
    targetNodeId,
    editedValue,
    editedMake1,
    editedModel1,
    editedCapacity1,
    editedDescription1,
    editedWarrantyDate1,
    editedSupportDate1,
    editedImageBytes1,
    editedCategory1
  ) => {
    if (node.id === targetNodeId) {
      switch (property) {
        case "Name":
          node.name = editedValue;
          setSelectedNode(node);
          break;
        case "Make":
          node.make = editedMake1;
          setSelectedNode(node);
          break;
        case "Model":
          node.model = editedModel1;
          setSelectedNode(node);
          break;
        case "Capacity":
          node.capacity = editedCapacity1;
          setSelectedNode(node);
          break;
        case "Description":
          node.description = editedDescription1;
          setSelectedNode(node);
          break;
        case "WarrantyDate":
          node.warranty_end_date = editedWarrantyDate1.format("YYYY-MM-DD");
          setSelectedNode(node);
          break;
        case "SupportDate":
          node.warranty_support_end_date =
            editedSupportDate1.format("YYYY-MM-DD");
          setSelectedNode(node);
          break;
        case "ImageFile":
          node.image_file = Array.from(editedImageBytes1);
          setSelectedNode(node);
          break;
        case "Catagory":
          node.issue_category_name = editedCategory1;
          setSelectedNode(node);
          break;
        default:
          break;
      }
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) =>
        findAndEditNode(
          property,
          child,
          targetNodeId,
          editedValue,
          editedMake1,
          editedModel1,
          editedCapacity1,
          editedDescription1,
          editedWarrantyDate1,
          editedSupportDate1,
          editedImageBytes1,
          editedCategory1
        )
      );
    }
  };
  const createInitialData = (rootName, level = 0) => ({
    id: "root",
    name: rootName,
    node_level: level,
    children: [],
  });
  const getAllNodeIds = (nodes) => {
    console.log("Traversing nodes...");
    console.log("Data structure:", nodes);

    const nodeIds = [];

    const traverse = (node) => {
      console.log("Node ID:", node.id);
      nodeIds.push(node.id);
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => traverse(child));
      }
    };

    if (Array.isArray(nodes)) {
      nodes.forEach((node) => {
        console.log("Parent Node:", node);
        traverse(node);
      });
    } else {
      console.log("Parent Node:", nodes);
      traverse(nodes);
    }

    console.log("All node IDs:", nodeIds);
    return nodeIds;
  };

  // console.log("Data:", data);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => handleNodeClick(nodes)}
      onContextMenu={(e) => handleContextMenu(e, nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const handleNodeClick = (node) => {
    console.log("left click ", node.name);

    setSelectedNode(node);
    setClickedNode(node);
    setShowAddItemButton(false);
  };

  const handleContextMenu = (event, node) => {
    console.log("Right click ", node.name);

    event.preventDefault();
    event.stopPropagation();
    setSelectedNode(node);
    setShowAddItemButton(true);
    setButtonPosition({ x: event.clientX, y: event.clientY });
  };
  const handleClickOutsideNode = () => {
    setShowAddItemButton(false);
  };

  const handleRootNodeCreate = () => {
    const rootName = rootNodeName.trim();
    if (rootName !== "") {
      setData(createInitialData(rootName));
      setRootNodeName("");
    }
  };

  const handleChildNodeAdd = async () => {
    if (childNodeName.trim() === "") {
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error",
      //   detail: "Please enter a node name.",
      // });
      setsnackbarSeverity("error");
      setSnackbarText("Please enter a Asset name !");
      setSnackbarOpen(true);
      setCategoryError(true);
      setIsError(true);
      setIsError(true);
      return;
    }
    console.log("selectedImageBytes => ", selectedImageBytes);
    let img_file = null;
    if (selectedImageBytes != null) {
      img_file = Array.from(selectedImageBytes);
    }
    if (childNodeName.trim() !== "" && selectedNode) {
      const parentNodeId =
        selectedNode.id === "root" ? selectedNode.name : selectedNode.id;
      const newChildNodeId = `${parentNodeId}/${childNodeName.trim()}`;

      // Check if the child node name is unique within the selected node's hierarchy
      const selectedNodeIdParts = parentNodeId.split("/");
      const nodeNameAlreadyExists = selectedNodeIdParts.some(
        (part) => part.toLowerCase() === childNodeName.trim().toLowerCase()
      );

      if (nodeNameAlreadyExists) {
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error",
        //   detail: "Node name allready exist in this branch",
        // });

        setsnackbarSeverity("error");
        setSnackbarText("Asset name allready exist in this branch");
        setSnackbarOpen(true);
        setCategoryError(true);
        setIsError(true);
        return; // Don't proceed with adding the node
      }

      // Check if the parent node already has a child node with the same name
      if (
        selectedNode.children.some(
          (child) =>
            child.name.toLowerCase() === childNodeName.trim().toLowerCase()
        )
      ) {
        // alert(
        //   "A parent node cannot have more than one child node with the same name."
        // );
        setsnackbarSeverity("error");
        setSnackbarText(
          "A parent node cannot have more than one child Asset with the same name."
        );
        setSnackbarOpen(true);
        setCategoryError(true);
        setIsError(true);
        return; // Don't proceed with adding the node
      }

      const newChildNode = {
        id: newChildNodeId,
        name: childNodeName,
        node_level: selectedNode.node_level + 1,
        make,
        model,
        capacity,
        description,
        warranty_end_date: warrantyEndDate.format("YYYY-MM-DD"),
        warranty_support_end_date: supportEndDate.format("YYYY-MM-DD"),
        issue_category_name: selectedCategory,
        image_file: img_file,
        children: [],
      };

      let dataLocal;
      console.log();
      setData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        findAndAddChildNode(updatedData, selectedNode.id, newChildNode);
        dataLocal = updatedData;
        return updatedData;
      });

      // Clear input fields after adding a child node
      setChildNodeName("");
      setMake("");
      setModel("");
      setCapacity("");
      setwarrantyEndDate(dayjs());
      setSupportEndDate(dayjs());
      setSelectedImage(null);
      setSelectedImageBytes();
      setDescription("");
      await handlePostData(dataLocal);
      setVisible(false);

      setsnackbarSeverity();
      setSnackbarText("Assest added Successfully");
      setSnackbarOpen(true);
      setCategoryError(true);
      // setIsError(true);
      // setIsError(true);
    }
  };

  const findAndAddChildNode = (node, targetNodeId, childNode) => {
    if (node.id === targetNodeId) {
      node.children.push(childNode);
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) =>
        findAndAddChildNode(child, targetNodeId, childNode)
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);

        const dataUrl = reader.result;
        const base64String = dataUrl.split(",")[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        setSelectedImageBytes(byteArray);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);

        const dataUrl = reader.result;
        const base64String = dataUrl.split(",")[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        setEditedImageBytes(byteArray);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintJson = () => {
    if (data) {
      console.log("JSON Representation:", JSON.stringify(data, null, 2));
    } else {
      console.log("No data available to print.");
    }
  };
  const handlePostData = async (dataLocal) => {
    console.log("data for post ", dataLocal);

    try {
      const response = await fetch(
        `http://${DB_IP}/device/admin/saveTree/${plantid}/${selectedProject}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dataLocal),
        }
      );

      if (response.ok) {
        setPostDataStatus("Data successfully posted!");
        console.log("post completed");
        return true;
      } else {
        setPostDataStatus("Error posting data. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setPostDataStatus("Error posting data. Please try again.");
      return false;
    }
  };

  const handleDeleteData = async () => {
    console.log("handle Delete call");
    try {
      const response = await fetch(
        `http://${DB_IP}/device/admin/delete/${plantid}/${selectedProject}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setPostDataStatus("Data successfully Delete!");
        console.log("Delete completed");
      } else {
        setPostDataStatus("Error posting data. Please try again.");
      }
    } catch (error) {
      console.error("Error Deleting data:", error);
      setPostDataStatus("Error Deleting data. Please try again.");
    }
  };

  const handleDialogOpen = () => {
    setDelOpen(true);
  };
  const handleDeleteNode = async () => {
    if (selectedNode && selectedNode.id === "root") {
      // If the selected node is the root, clear all data and hide the right panel

      handleDeleteData();
      setsnackbarSeverity();
      setSnackbarText("Delete Asset Successfully");
      setSnackbarOpen(true);
      setCategoryError(true);
      setData(null);
      setSelectedNode(null);

      setDelOpen(false);
    } else if (selectedNode) {
      let localData;

      const setDataPromise = new Promise((resolve, reject) => {
        setData((prevData) => {
          const updatedData = JSON.parse(JSON.stringify(prevData));
          findAndDeleteNode(updatedData, selectedNode.id);
          localData = updatedData;
          resolve(); // Resolve the promise once data is updated
          return updatedData;
        });
      });

      setDataPromise.then(() => {
        // Now you can safely use localData
        handlePostData(localData);
      });

      setSelectedNode(null);
      setDelOpen(false);
      // handlePostData(testData);
    }
  };
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const findAndDeleteNode = (node, targetNodeId) => {
    if (node.children) {
      node.children = node.children.filter(
        (child) => child.id !== targetNodeId
      );
      node.children.forEach((child) => findAndDeleteNode(child, targetNodeId));
    }
  };
  const urllist = [
    { pageName: "Home", pagelink: "/admin/home" },
    { pageName: "Configuration", pagelink: "/admin/configurePage" },
    {
      pageName: "Configure Device",
      pagelink: "/admin/DeviceConfigure",
    },
  ];
  return (
    <Container maxWidth="lg">
      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        <div className="split-screen" onClick={handleClickOutsideNode}>
          <div className="left-panel">
            <div id="create-device-tree">
              <>
                <div
                  style={{ display: "flex", marginTop: "3%", marginLeft: "2%" }}
                >
                  <Dropdown
                    // id={"plantId-dropdown"}
                    // value={
                    //   selectedPlantAndProject.plantId
                    //     ? selectedPlantAndProject.plantId
                    //     : ""
                    // }
                    // onChange={(event) =>
                    //   setSelectedPlantAndProject({
                    //     ...selectedPlantAndProject,
                    //     plantId: event.target.value,
                    //   })
                    // }
                    // list={plantIdList}
                    // label={"Plant-ID"}
                    list={plantDetails}
                    label={"Select Plant"}
                    value={selectedPlant}
                    onChange={(event) => {
                      setSelectedPlant(event.target.value);
                      setPlantid(event.target.value);
                    }}
                    // error={dropDownError}
                    style={{ width: "170px" }}
                  ></Dropdown>
                  <div style={{ marginLeft: "20px" }}>
                    {""}
                    {plantid && (
                      <Dropdown
                        list={projects}
                        label={"Select Project"}
                        style={{ width: "170px" }}
                        onChange={(event) => {
                          setSelectedProject(event.target.value);
                        }}
                        // error={dropDownError}
                      ></Dropdown>
                    )}
                  </div>
                </div>
              </>

              {selectedProject && data === null && (
                <>
                  <Textfield
                    className="textInput"
                    label="Enter Device Group Name"
                    variant="outlined"
                    value={rootNodeName}
                    onChange={(e) => setRootNodeName(e.target.value)}
                    style={{
                      marginTop: "0.6rem",
                      marginLeft: "2%",
                      width: "360px",
                    }}
                  />
                  <CustomButton
                    style={{
                      marginLeft: "2%",
                      width: "360px",
                      marginTop: "0.2rem",
                    }}
                    className="button"
                    variant="contained"
                    color="primary"
                    onClick={handleRootNodeCreate}
                    buttontext={"Create Device Group"}
                  ></CustomButton>
                </>
              )}

              {data !== null && (
                <div className="treeViewContainer">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Chip
                      sx={{
                        marginLeft: "5px",
                        // fontSize: "0.9rem",
                        marginBottom: "15px",
                      }}
                      label="Device Tree:"
                      color="info"
                      //variant="outlined"
                    />
                    <Chip
                      label={
                        <div>
                          <InfoOutlinedIcon fontSize="small" />
                          Select Device to view details
                        </div>
                      }
                    />
                  </div>
                  <Divider sx={{ marginBottom: "0.6rem", opacity: 0.8 }} />
                  <CustomTreeView
                    data={data}
                    renderTree={renderTree}
                    handleNodeClick={handleNodeClick}
                    handleContextMenu={handleContextMenu}
                  />
                  <br />
                </div>
              )}
            </div>
          </div>

          <div className={`right-panel ${data === null ? "hidden" : ""}`}>
            {data !== null && selectedNode && (
              <>
                {/* <Box style={{ display: "flex" }}>
              <p className="selectedNodeInfo">
                {selectedNode
                  ? `Selected Node: ${selectedNode.name}
                              `
                  : "Select a node          "}
              </p>
              &nbsp;&nbsp;&nbsp;
              {divIsVisibleList &&
                divIsVisibleList.includes("delete-selected-node") && (
                  <div id="delete-selected-node" style={{ display: "flex" }}>
                    <CustomButton
                      className="button"
                      variant="contained"
                      size={"small"}
                      color="secondary" // Use secondary color for delete button
                      //onClick={handleDeleteNode}
                      onClick={handleDialogOpen}
                      buttontext={"Delete Node"}
                    ></CustomButton>
                  </div>
                )}
              &nbsp;&nbsp;
              {divIsVisibleList &&
                divIsVisibleList.includes("add-new-node") && (
                  <div id="add-new-node" style={{ display: "flex" }}>
                    <CustomButton
                      className="button"
                      size={"small"}
                      variant="contained"
                      color="secondary" // Use secondary color for delete button
                      //onClick={handleDeleteNode}
                      onClick={() => setVisible(true)}
                      buttontext={"Add Item"}
                    ></CustomButton>
                  </div>
                )}
            </Box> */}

                <div>
                  <Dialog
                    header={`Create Asset for : ${selectedNode.name}`}
                    open={visible}
                    style={{}}
                    fullWidth
                    onClose={() => setVisible(false)}
                  >
                    <DialogTitle
                      id="alert-dialog-title"
                      sx={{ fontSize: "1rem", fontWeight: "600" }}
                    >
                      {`Create Asset for : ${selectedNode.name}`}
                    </DialogTitle>
                    <Divider sx={{ opacity: "0.8" }} />
                    <br />
                    <center>
                      <Box
                        sx={{
                          minWidth: 10,
                          maxWidth: 500,
                        }}
                      >
                        <Textfield
                          required
                          className="textInput"
                          label="Asset Name"
                          variant="outlined"
                          fullWidth
                          value={childNodeName}
                          onChange={(e) => setChildNodeName(e.target.value)}
                        />
                        <br />
                        <br />

                        <Textfield
                          required
                          className="textInput"
                          label="Make"
                          variant="outlined"
                          fullWidth
                          value={make}
                          onChange={(e) => setMake(e.target.value)}
                        />
                        <br />
                        <br />
                        <Textfield
                          required
                          className="textInput"
                          label="Model"
                          variant="outlined"
                          fullWidth
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                        />
                        <br />
                        <br />
                        <Textfield
                          required
                          className="textInput"
                          label="Capacity"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                        />
                        <br />
                        <br />
                        <Textfield
                          required
                          className="textInput"
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          maxRows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <br />
                        <br />
                        <div style={{ display: "flex", columnGap: "1rem" }}>
                          <CustomDatePicker
                            label="Warranty End Date"
                            value={warrantyEndDate}
                            onChange={(newDate) => setwarrantyEndDate(newDate)}
                          />

                          <CustomDatePicker
                            label="Support End Date"
                            value={supportEndDate}
                            onChange={(newDate) => setSupportEndDate(newDate)}
                          />
                        </div>
                        <br />

                        <Select
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Select Issue Category",
                          }}
                        >
                          <MenuItem value="">Select Issue Category</MenuItem>

                          {categories.map((category) => (
                            <MenuItem
                              key={category.issuecategoryname}
                              value={category.issuecategoryname}
                            >
                              {category.issuecategoryname}
                            </MenuItem>
                          ))}
                        </Select>
                        <br />
                        <br />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>

                        {selectedImage && (
                          <div className="image-preview">
                            Preview:
                            <br />
                            <img
                              src={selectedImage}
                              height="100px"
                              width="200px"
                              alt="Preview"
                            />
                          </div>
                        )}
                        <br />
                        <br />
                        <CustomButton
                          className="button"
                          variant="contained"
                          color="primary"
                          onClick={handleChildNodeAdd}
                          buttontext={"Add Asset"}
                        ></CustomButton>
                      </Box>
                      <br />
                      <br />
                      <br />
                    </center>
                  </Dialog>
                </div>

                {clickedNode &&
                  selectedNode &&
                  selectedNode.id === "root" &&
                  clickedNode.id === "root" && (
                    <>
                      <div style={{ display: "flex" }}>
                        &nbsp;&nbsp;&nbsp;
                        {divIsVisibleList &&
                          divIsVisibleList.includes("delete-selected-node") && (
                            <div
                              id="delete-selected-node"
                              style={{ display: "flex" }}
                            >
                              <CustomButton
                                className="button"
                                variant="contained"
                                size={"small"}
                                color="error" // Use secondary color for delete button
                                //onClick={handleDeleteNode}
                                endIcon={<DeleteIcon />}
                                onClick={handleDialogOpen}
                                buttontext={"Delete Node"}
                              ></CustomButton>
                            </div>
                          )}
                        &nbsp;&nbsp;
                        {divIsVisibleList &&
                          divIsVisibleList.includes("add-new-node") && (
                            <div id="add-new-node" style={{ display: "flex" }}>
                              <CustomButton
                                className="button"
                                size={"small"}
                                variant="contained"
                                color="secondary" // Use secondary color for delete button
                                //onClick={handleDeleteNode}

                                onClick={() => setVisible(true)}
                                endIcon={<AddCircleIcon />}
                                buttontext={"Add Item"}
                              ></CustomButton>
                            </div>
                          )}
                      </div>
                      <br></br>
                      <Chip
                        size="large"
                        sx={{ fontSize: "0.8rem", fontWeight: "600" }}
                        label={
                          selectedNode
                            ? `Selected Asset: 
                              `
                            : "Select a Asset"
                        }
                      />
                      <div>
                        {isEditing ? (
                          <>
                            {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  value={editedName}
                                  onChange={(e) =>
                                    setEditedName(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Name")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleCancelNameEdit("Name")}
                                  buttontext={"Cancel"}
                                ></CustomButton> */}
                            <FormControl fullWidth>
                              <InputLabel htmlFor="EditNodeName">
                                Edit Name
                              </InputLabel>
                              <OutlinedInput
                                autoFocus
                                autoComplete="Edit Name"
                                name="Edit Name"
                                required
                                fullWidth
                                id="EditNodeName"
                                label="Edit Name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                endAdornment={
                                  <>
                                    <Tooltip title="Save">
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => handleSaveName("Name")}
                                          edge="end"
                                        >
                                          <SaveOutlinedIcon color="success" />
                                        </IconButton>
                                      </InputAdornment>
                                    </Tooltip>

                                    <Tooltip title="Cancel">
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() =>
                                            handleCancelNameEdit("Name")
                                          }
                                          edge="end"
                                        >
                                          <CancelOutlinedIcon color="error" />
                                        </IconButton>
                                      </InputAdornment>
                                    </Tooltip>
                                  </>
                                }
                              />
                            </FormControl>
                          </>
                        ) : (
                          <>
                            <div
                              className="value-comp"
                              onClick={() => handleEdit("Name")}
                            >
                              {selectedNode.name === ""
                                ? "NA"
                                : selectedNode.name}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                {clickedNode &&
                  selectedNode &&
                  selectedNode.id !== "root" &&
                  clickedNode.id !== "root" && (
                    <div className="dlg">
                      <div className="clicked-node">
                        <Card
                          sx={{
                            minWidth: 550,

                            //backgroundColor: "#f4f4f4",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0.9rem",
                            }}
                          >
                            <Chip
                              size="large"
                              sx={{ fontSize: "0.8rem", fontWeight: "600" }}
                              label={
                                selectedNode
                                  ? `Selected Asset: ${selectedNode.name}
                              `
                                  : "Select a Asset"
                              }
                            />

                            <div style={{ display: "flex" }}>
                              &nbsp;&nbsp;&nbsp;
                              {divIsVisibleList &&
                                divIsVisibleList.includes(
                                  "delete-selected-node"
                                ) && (
                                  <div
                                    id="delete-selected-node"
                                    style={{ display: "flex" }}
                                  >
                                    <CustomButton
                                      className="button"
                                      variant="contained"
                                      size={"small"}
                                      color="error" // Use secondary color for delete button
                                      //onClick={handleDeleteNode}
                                      endIcon={<DeleteIcon />}
                                      onClick={handleDialogOpen}
                                      buttontext={"Delete Node"}
                                    ></CustomButton>
                                  </div>
                                )}
                              &nbsp;&nbsp;
                              {divIsVisibleList &&
                                divIsVisibleList.includes("add-new-node") && (
                                  <div
                                    id="add-new-node"
                                    style={{ display: "flex" }}
                                  >
                                    <CustomButton
                                      className="button"
                                      size={"small"}
                                      variant="contained"
                                      color="secondary" // Use secondary color for delete button
                                      //onClick={handleDeleteNode}

                                      onClick={() => setVisible(true)}
                                      endIcon={<AddCircleIcon />}
                                      buttontext={"Add Item"}
                                    ></CustomButton>
                                  </div>
                                )}
                            </div>
                          </Box>
                          <Divider sx={{ opacity: 0.8 }} />

                          <div
                            className="Card-Components"
                            style={{ padding: "0.9rem" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Chip
                                // sx={{ flex: "1" }}
                                label={
                                  <div>
                                    <InfoOutlinedIcon fontSize="small" />
                                    Click on the fields to edit
                                  </div>
                                }
                              />
                            </div>

                            {/* <h3
                          style={{
                            marginBottom: "15px",
                            color: "#333",
                          }}
                        >
                          Node Details:
                        </h3> */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                    textAlign: "left",
                                  }}
                                >
                                  Name:
                                </Typography>
                              </div>

                              <div>
                                {isEditing ? (
                                  <>
                                    {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  value={editedName}
                                  onChange={(e) =>
                                    setEditedName(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Name")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleCancelNameEdit("Name")}
                                  buttontext={"Cancel"}
                                ></CustomButton> */}
                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="EditNodeName">
                                        Edit Name
                                      </InputLabel>
                                      <OutlinedInput
                                        autoFocus
                                        autoComplete="Edit Name"
                                        name="Edit Name"
                                        required
                                        fullWidth
                                        id="EditNodeName"
                                        label="Edit Name"
                                        value={editedName}
                                        onChange={(e) =>
                                          setEditedName(e.target.value)
                                        }
                                        endAdornment={
                                          <>
                                            <Tooltip title="Save">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleSaveName("Name")
                                                  }
                                                  edge="end"
                                                >
                                                  <SaveOutlinedIcon color="success" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>

                                            <Tooltip title="Cancel">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleCancelNameEdit("Name")
                                                  }
                                                  edge="end"
                                                >
                                                  <CancelOutlinedIcon color="error" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>
                                          </>
                                        }
                                      />
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Name")}
                                    >
                                      {selectedNode.name === ""
                                        ? "NA"
                                        : selectedNode.name}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Make:
                                </p>
                              </div>

                              <div>
                                {isEditingMake ? (
                                  <>
                                    {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  value={editedMake}
                                  onChange={(e) =>
                                    setEditedMake(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Make")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleCancelNameEdit("Make")}
                                  buttontext={"Cancel"}
                                ></CustomButton> */}

                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="EditNodeName">
                                        Edit Make
                                      </InputLabel>
                                      <OutlinedInput
                                        autoFocus
                                        autoComplete="Edit Make"
                                        name="Edit Make"
                                        required
                                        fullWidth
                                        id="EditNodeName"
                                        label="Edit Make"
                                        value={editedMake}
                                        onChange={(e) =>
                                          setEditedMake(e.target.value)
                                        }
                                        endAdornment={
                                          <>
                                            <Tooltip title="Save">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleSaveName("Make")
                                                  }
                                                  edge="end"
                                                >
                                                  <SaveOutlinedIcon color="success" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>

                                            <Tooltip title="Cancel">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleCancelNameEdit("Make")
                                                  }
                                                  edge="end"
                                                >
                                                  <CancelOutlinedIcon color="error" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>
                                          </>
                                        }
                                      />
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Make")}
                                    >
                                      {selectedNode.make === ""
                                        ? "NA"
                                        : selectedNode.make}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Model:
                                </p>
                              </div>
                              <div>
                                {isEditingModel ? (
                                  <>
                                    {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  value={editedModel}
                                  onChange={(e) =>
                                    setEditedModel(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Model")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleCancelNameEdit("Model")}
                                  buttontext={"Cancel"}
                                ></CustomButton> */}

                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="EditNodeName">
                                        Edit Model
                                      </InputLabel>
                                      <OutlinedInput
                                        autoFocus
                                        autoComplete="Edit Model"
                                        name="Edit Model"
                                        required
                                        fullWidth
                                        id="EditNodeName"
                                        label="Edit Model"
                                        value={editedModel}
                                        onChange={(e) =>
                                          setEditedModel(e.target.value)
                                        }
                                        endAdornment={
                                          <>
                                            <Tooltip title="Save">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleSaveName("Model")
                                                  }
                                                  edge="end"
                                                >
                                                  <SaveOutlinedIcon color="success" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>

                                            <Tooltip title="Cancel">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleCancelNameEdit(
                                                      "Model"
                                                    )
                                                  }
                                                  edge="end"
                                                >
                                                  <CancelOutlinedIcon color="error" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>
                                          </>
                                        }
                                      />
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Model")}
                                    >
                                      {selectedNode.model === ""
                                        ? "NA"
                                        : selectedNode.model}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Capacity:
                                </p>
                              </div>
                              <div>
                                {isEditingCapacity ? (
                                  <>
                                    {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  type="number"
                                  value={editedCapacity}
                                  onChange={(e) =>
                                    setEditedCapacity(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Capacity")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleCancelNameEdit("Capacity")
                                  }
                                  buttontext={"Cancel"}
                                ></CustomButton> */}

                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="EditNodeName">
                                        Edit Capacity
                                      </InputLabel>
                                      <OutlinedInput
                                        autoFocus
                                        autoComplete="Edit Capacity"
                                        name="Edit Capacity"
                                        required
                                        type="number"
                                        fullWidth
                                        id="EditNodeName"
                                        label="Edit Capacity"
                                        value={editedCapacity}
                                        onChange={(e) =>
                                          setEditedCapacity(e.target.value)
                                        }
                                        endAdornment={
                                          <>
                                            <Tooltip title="Save">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleSaveName("Capacity")
                                                  }
                                                  edge="end"
                                                >
                                                  <SaveOutlinedIcon color="success" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>

                                            <Tooltip title="Cancel">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleCancelNameEdit(
                                                      "Capacity"
                                                    )
                                                  }
                                                  edge="end"
                                                >
                                                  <CancelOutlinedIcon color="error" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>
                                          </>
                                        }
                                      />
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Capacity")}
                                    >
                                      {selectedNode.capacity}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Description:
                                </p>
                              </div>

                              <div>
                                {isEditingDescription ? (
                                  <>
                                    {/* <Textfield
                                  label="Edit Node Name"
                                  variant="outlined"
                                  value={editedDescription}
                                  onChange={(e) =>
                                    setEditedDescription(e.target.value)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Description")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleCancelNameEdit("Description")
                                  }
                                  buttontext={"Cancel"}
                                ></CustomButton> */}

                                    <FormControl fullWidth>
                                      <InputLabel htmlFor="EditNodeName">
                                        Edit Description
                                      </InputLabel>
                                      <OutlinedInput
                                        autoFocus
                                        autoComplete="Edit Description"
                                        name="Edit Description"
                                        required
                                        fullWidth
                                        id="EditNodeName"
                                        label="Edit Description"
                                        value={editedDescription}
                                        onChange={(e) =>
                                          setEditedDescription(e.target.value)
                                        }
                                        endAdornment={
                                          <>
                                            <Tooltip title="Save">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleSaveName(
                                                      "Description"
                                                    )
                                                  }
                                                  edge="end"
                                                >
                                                  <SaveOutlinedIcon color="success" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>

                                            <Tooltip title="Cancel">
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() =>
                                                    handleCancelNameEdit(
                                                      "Description"
                                                    )
                                                  }
                                                  edge="end"
                                                >
                                                  <CancelOutlinedIcon color="error" />
                                                </IconButton>
                                              </InputAdornment>
                                            </Tooltip>
                                          </>
                                        }
                                      />
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Description")}
                                    >
                                      {selectedNode.description === ""
                                        ? "NA"
                                        : selectedNode.description}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Support End Date:
                                </p>
                              </div>

                              <div>
                                {isEditingSupportDate ? (
                                  <>
                                    <FormControl fullWidth>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div>
                                          <CustomDatePicker
                                            label="Edit Support End Date"
                                            value={editedSupportDate}
                                            onChange={(newDate) =>
                                              setEditedSupportDate(newDate)
                                            }
                                          />
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Tooltip title="Save">
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() =>
                                                  handleSaveName("SupportDate")
                                                }
                                                edge="end"
                                              >
                                                <SaveOutlinedIcon color="success" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() =>
                                                  handleCancelNameEdit(
                                                    "SupportDate"
                                                  )
                                                }
                                                edge="end"
                                              >
                                                <CancelOutlinedIcon color="error" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>
                                        </div>
                                      </div>
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("SupportDate")}
                                    >
                                      {selectedNode.warranty_support_end_date}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Warranty End Date:
                                </p>
                              </div>

                              <div>
                                {isEditingWarrantyDate ? (
                                  <>
                                    {/* <CustomDatePicker
                                  label="Warranty End Date"
                                  value={editedWarrantyDate}
                                  onChange={(newDate) =>
                                    setEditedWarrantyDate(newDate)
                                  }
                                />
                                <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("WarrantyDate")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleCancelNameEdit("WarrantyDate")
                                  }
                                  buttontext={"Cancel"}
                                ></CustomButton> */}

                                    <FormControl fullWidth>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div>
                                          <CustomDatePicker
                                            label="Edit Warranty End Date"
                                            value={editedWarrantyDate}
                                            onChange={(newDate) =>
                                              setEditedWarrantyDate(newDate)
                                            }
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Tooltip title="Save">
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() =>
                                                  handleSaveName("WarrantyDate")
                                                }
                                                edge="end"
                                              >
                                                <SaveOutlinedIcon color="success" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() =>
                                                  handleCancelNameEdit(
                                                    "WarrantyDate"
                                                  )
                                                }
                                                edge="end"
                                              >
                                                <CancelOutlinedIcon color="error" />
                                              </IconButton>
                                            </InputAdornment>
                                          </Tooltip>
                                        </div>
                                      </div>
                                    </FormControl>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("WarrantyDate")}
                                    >
                                      {selectedNode.warranty_end_date}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "1rem",
                                marginBottom: "15px",
                              }}
                            >
                              <div style={{ marginBottom: "0px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Issue Category Name:
                                </p>
                              </div>
                              <div>
                                {isEditingCatagory ? (
                                  <>
                                    <Select
                                      value={editedCategory}
                                      onChange={handleEditCategoryChange}
                                      displayEmpty
                                      inputProps={{
                                        "aria-label": "Select Issue Category",
                                      }}
                                    >
                                      <MenuItem value="NA">
                                        Select Issue Category
                                      </MenuItem>
                                      {categories.map((category) => (
                                        <MenuItem
                                          key={category.issuecategoryname}
                                          value={category.issuecategoryname}
                                        >
                                          {category.issuecategoryname}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {/* <CustomButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveName("Catagory")}
                                  buttontext={"Save"}
                                ></CustomButton>
                                <CustomButton
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleCancelNameEdit("Catagory")
                                  }
                                  buttontext={"Cancel"}
                                ></CustomButton> */}
                                    <Tooltip title="Save">
                                      <IconButton
                                        onClick={() =>
                                          handleSaveName("Catagory")
                                        }
                                        edge="end"
                                      >
                                        <SaveOutlinedIcon color="success" />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Cancel">
                                      <IconButton
                                        onClick={() =>
                                          handleCancelNameEdit("Catagory")
                                        }
                                        edge="end"
                                      >
                                        <CancelOutlinedIcon color="error" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Catagory")}
                                    >
                                      {selectedNode.issue_category_name === ""
                                        ? "NA"
                                        : selectedNode.issue_category_name}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                              <div>
                                {isEditingImageFile ? (
                                  <>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleEditImageChange}
                                    />
                                    {/* <CustomButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSaveName("ImageFile")}
                                    buttontext={"Save"}
                                  ></CustomButton>
                                  <CustomButton
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                      handleCancelNameEdit("ImageFile")
                                    }
                                    buttontext={"Cancel"}
                                  ></CustomButton> */}
                                    <Tooltip title="Save">
                                      <IconButton
                                        onClick={() =>
                                          handleSaveName("ImageFile")
                                        }
                                        edge="end"
                                      >
                                        <SaveOutlinedIcon color="success" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        onClick={() =>
                                          handleCancelNameEdit("ImageFile")
                                        }
                                        edge="end"
                                      >
                                        <CancelOutlinedIcon color="error" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("ImageFile")}
                                    >
                                      <div
                                        style={{
                                          display: "grid",
                                          justifyItems: "center",
                                        }}
                                      >
                                        <img
                                          width="240"
                                          height="150"
                                          src={
                                            selectedNode.image_file
                                              ? `data:image/jpeg;base64,${selectedNode.image_file}`
                                              : "path/to/placeholder/image.jpg"
                                          }
                                          alt="NoImage"
                                          style={{ borderRadius: "5px" }}
                                          onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            if (selectedNode.image_file) {
                                              const base64String =
                                                arrayBufferToBase64(
                                                  selectedNode.image_file
                                                );
                                              e.target.src = `data:image/jpeg;base64,${base64String}`;
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                {/* <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            onClick={handlePrintJson}
                          >
                            Print JSON
                          </Button> */}
                <br></br>
                {/* <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            onClick={handlePostData}
                          >
                            Save
                          </Button> */}
                <br />

                {showAddItemButton && (
                  <div
                    style={{
                      position: "absolute",
                      top: buttonPosition.y,
                      left: buttonPosition.x,
                      zIndex: 9999,
                    }}
                  >
                    {/* <CustomButton
                        className="button"
                        variant="contained"
                        color="secondary"
                        onClick={() => setVisible(true)}
                        buttontext={"Add Item"}
                      ></CustomButton> */}
                  </div>
                )}
              </>
            )}
          </div>

          <CustomDialog
            open={delOpen}
            setOpen={setDelOpen}
            proceedButtonText={"YES"}
            proceedButtonClick={handleDeleteNode}
            cancelButtonText={"NO"}
          ></CustomDialog>
          <SnackbarComponent
            openPopup={snackbarOpen}
            setOpenPopup={setSnackbarOpen}
            dialogMessage={snackbarText}
            snackbarSeverity={snackbarSeverity}
          ></SnackbarComponent>
        </div>
      </Card>
    </Container>
  );
}
