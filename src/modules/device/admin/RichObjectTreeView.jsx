import React, { useState } from "react";
import "./styles.css";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import CustomDatePicker from "./dateComp";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Card } from "@mui/material";
import { Dialog } from "primereact/dialog";
//import CustomTree from "../../../components/Tree/tree.component";
import CustomTreeView from "../../../components/Tree/tree.component";
import TopbarPage from "../../../components/navigation/topbar/topbar";
import SidebarPage from "../../../components/navigation/sidebar/sidebar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";
import CustomDialog from "../../../components/dialog/dialog.component";

export default function RichObjectTreeView() {
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
  const [plantId, setPlantId] = useState("P009");
  const [showAddItemButton, setShowAddItemButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [clickedNode, setClickedNode] = useState(null);
  const [visible, setVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // To track if the node is being edited
  const [isEditingMake, setIsEditingMake] = useState(false); // To track if the node is being edited
  const [isEditingModel, setIsEditingModel] = useState(false); // To track if the node is being edited
  const [isEditingCapacity, setIsEditingCapacity] = useState(false); // To track if the node is being edited
  const [isEditingDescription, setIsEditingDescription] = useState(false); // To track if the node is being edited
  const [isEditingWarrantyDate, setIsEditingWarrantyDate] = useState(false); // To track if the node is being edited
  const [isEditingSupportDate, setIsEditingSupportDate] = useState(false); // To track if the node is being edited
  const [isEditingImageFile, setIsEditingImageFile] = useState(false); // To track if the node is being edited
  const [isEditingCatagory, setIsEditingCatagory] = useState(false); // To track if the node is being edited

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
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/device/admin/getTree/P009",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const devData = await response.json();
          console.log("from API => ", JSON.stringify(devData));
          setData(devData);
          console.log("data");
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/device/admin/P009/categories",
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
  }, []);

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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
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
        setEditedSupportDate(selectedNode.warranty_support_end_date);
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

  const handleSaveName = (property) => {
    let selNode = selectedNode;
    let localData;
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
      setData(updatedData);
      handlePostData(localData);

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
          node.issue_category_name = Array.from(editedCategory1);
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

  const handleChildNodeAdd = () => {
    console.log("selectedImageBytes => ", selectedImageBytes);
    let img_file = null;
    if (selectedImageBytes != null) {
      img_file = Array.from(selectedImageBytes);
    }
    if (childNodeName.trim() !== "" && selectedNode) {
      const newChildNode = {
        id: Date.now().toString(),
        name: childNodeName,
        node_level: selectedNode.node_level + 1, // Calculate child nodeLevel
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
      handlePostData(dataLocal);
      setVisible(false);
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
    try {
      const response = await fetch(
        "http://localhost:8081/device/admin/saveTree/" + plantId,
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
      } else {
        setPostDataStatus("Error posting data. Please try again.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setPostDataStatus("Error posting data. Please try again.");
    }
  };

  const handleDeleteData = async () => {
    console.log("handle Delete call");
    try {
      const response = await fetch(
        "http://localhost:8081/device/admin/delete/" + plantId,
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
      setData(null);
      setSelectedNode(null);
      setDelOpen(false);
    } else if (selectedNode) {
      let dataForDelete;
      // For other nodes, delete the selected node
      setData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        findAndDeleteNode(updatedData, selectedNode.id);
        dataForDelete = updatedData;
        return updatedData;
      });
      setSelectedNode(null);
      setDelOpen(false);
      handlePostData(dataForDelete);
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

  return (
    <Box sx={{ display: "flex" }}>
      <TopbarPage
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[
          { pageName: "Home", pagelink: "/AdminPage" },
          {
            pageName: "Configure Device",
            pagelink: "/admin/DeviceConfigure",
          },
        ]}
      />
      <SidebarPage
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[
          {
            pagename: "Device Issue Category",
            pagelink: "/admin/Device/CategoryConfigure",
          },
          { pagename: "Application", pagelink: "/admin/ApplicationConfigure" },
          { pagename: "Device ", pagelink: "/admin/DeviceConfigure" },
          {
            pagename: "Infrastructure ",
            pagelink: "/admin/InfrastructureConfigure",
          },
        ]}
        userList={[
          {
            pagename: "Report Application",
            pagelink: "/user/ReportApplication",
          },
          {
            pagename: "Report Infrastructure",
            pagelink: "/user/ReportInfrastructure",
          },
          { pagename: "Report Device", pagelink: "/user/ReportDevice" },
        ]}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="split-screen" onClick={handleClickOutsideNode}>
            <div className="left-panel">
              {data === null && (
                <>
                  <TextField
                    className="textInput"
                    label="Enter Parent Node Name"
                    variant="outlined"
                    fullWidth
                    value={rootNodeName}
                    onChange={(e) => setRootNodeName(e.target.value)}
                  />
                  <Button
                    className="button"
                    variant="contained"
                    color="primary"
                    onClick={handleRootNodeCreate}
                  >
                    Create Parent Node
                  </Button>
                </>
              )}
              {data !== null && (
                <div className="treeViewContainer">
                  <p>Device Tree:</p>
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
            <div className={`right-panel ${data === null ? "hidden" : ""}`}>
              {data !== null && selectedNode && (
                <>
                  <Box>
                    <p className="selectedNodeInfo">
                      {selectedNode
                        ? `Selected Node: ${selectedNode.name}
                              `
                        : "Select a node          "}
                      <Button
                        className="button"
                        variant="contained"
                        color="secondary" // Use secondary color for delete button
                        onClick={handleDeleteNode}
                      >
                        Delete Node
                      </Button>
                    </p>
                  </Box>

                  <div>
                    <Dialog
                      header={`Create Child Node for : ${selectedNode.name}`}
                      visible={visible}
                      style={{
                        width: "50vw",
                      }}
                      onHide={() => setVisible(false)}
                    >
                      <br />
                      <center>
                        <Card
                          sx={{
                            minWidth: 10,
                            maxWidth: 500,
                            padding: "20px",
                            backgroundColor: "#f4f4f4",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 10)",
                          }}
                        >
                          <TextField
                            required
                            className="textInput"
                            label="Enter Child Node"
                            variant="outlined"
                            fullWidth
                            value={childNodeName}
                            onChange={(e) => setChildNodeName(e.target.value)}
                          />
                          <br />
                          <br />

                          <TextField
                            required
                            className="textInput"
                            label="Enter Make"
                            variant="outlined"
                            fullWidth
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                          />
                          <br />
                          <br />
                          <TextField
                            required
                            className="textInput"
                            label="Enter Model"
                            variant="outlined"
                            fullWidth
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                          />
                          <br />
                          <br />
                          <TextField
                            required
                            className="textInput"
                            label="Enter Capacity"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                          />
                          <br />
                          <br />
                          <TextField
                            required
                            className="textInput"
                            label="Enter Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            maxRows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                          <br />
                          <br />
                          <CustomDatePicker
                            label="Warranty End Date"
                            value={warrantyEndDate}
                            onChange={(newDate) => setwarrantyEndDate(newDate)}
                          />
                          <br />
                          <br />
                          <CustomDatePicker
                            label="Support End Date"
                            value={supportEndDate}
                            onChange={(newDate) => setSupportEndDate(newDate)}
                          />
                          <br />
                          <br />
                          <Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            displayEmpty
                            inputProps={{
                              "aria-label": "Select Issue Category",
                            }}
                          >
                            <MenuItem value="" disabled>
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
                          <br />
                          <br />
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                          <br />
                          <br />
                          {selectedImage && (
                            <div className="image-preview">
                              Preview:
                              <br />
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
                          <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            onClick={handleChildNodeAdd}
                          >
                            Add Node
                          </Button>
                        </Card>
                        <br />
                        <br />
                        <br />
                      </center>
                    </Dialog>
                  </div>

                  <br></br>
                  {clickedNode &&
                    selectedNode.id !== "root" &&
                    clickedNode.id !== "root" && (
                      <div className="dlg">
                        <div className="clicked-node">
                          <Card
                            sx={{
                              minWidth: 550,
                              padding: "20px",
                              backgroundColor: "#f4f4f4",
                              borderRadius: "10px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <div className="Card-Components">
                              <h3
                                style={{ marginBottom: "15px", color: "#333" }}
                              >
                                Node Details:
                              </h3>
                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                    textAlign: "left",
                                  }}
                                >
                                  Name:
                                </p>
                              </div>

                              <div>
                                {isEditing ? (
                                  <>
                                    <TextField
                                      label="Edit Node Name"
                                      variant="outlined"
                                      value={editedName}
                                      onChange={(e) =>
                                        setEditedName(e.target.value)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleSaveName("Name")}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Name")
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Name")}
                                    >
                                      {selectedNode.name}
                                    </div>
                                  </>
                                )}
                              </div>

                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Make:
                                </p>
                              </div>

                              <div>
                                {isEditingMake ? (
                                  <>
                                    <TextField
                                      label="Edit Node Name"
                                      variant="outlined"
                                      value={editedMake}
                                      onChange={(e) =>
                                        setEditedMake(e.target.value)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleSaveName("Make")}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Make")
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Make")}
                                    >
                                      {selectedNode.make}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Model:
                                </p>
                              </div>
                              <div>
                                {isEditingModel ? (
                                  <>
                                    <TextField
                                      label="Edit Node Name"
                                      variant="outlined"
                                      value={editedModel}
                                      onChange={(e) =>
                                        setEditedModel(e.target.value)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleSaveName("Model")}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Model")
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Model")}
                                    >
                                      {selectedNode.model}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Capacity:
                                </p>
                              </div>
                              <div>
                                {isEditingCapacity ? (
                                  <>
                                    <TextField
                                      label="Edit Node Name"
                                      variant="outlined"
                                      type="number"
                                      value={editedCapacity}
                                      onChange={(e) =>
                                        setEditedCapacity(e.target.value)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleSaveName("Capacity")}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Capacity")
                                      }
                                    >
                                      Cancel
                                    </Button>
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

                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Description:
                                </p>
                              </div>

                              <div>
                                {isEditingDescription ? (
                                  <>
                                    <TextField
                                      label="Edit Node Name"
                                      variant="outlined"
                                      value={editedDescription}
                                      onChange={(e) =>
                                        setEditedDescription(e.target.value)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleSaveName("Description")
                                      }
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Description")
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Description")}
                                    >
                                      {selectedNode.description}
                                    </div>
                                  </>
                                )}
                              </div>

                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Warranty End Date:
                                </p>
                              </div>

                              <div>
                                {isEditingSupportDate ? (
                                  <>
                                    <CustomDatePicker
                                      label="Warranty End Date"
                                      value={editedSupportDate}
                                      onChange={(newDate) =>
                                        setEditedSupportDate(newDate)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleSaveName("SupportDate")
                                      }
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("SupportDate")
                                      }
                                    >
                                      Cancel
                                    </Button>
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

                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Support End Date:
                                </p>
                              </div>

                              <div>
                                {isEditingWarrantyDate ? (
                                  <>
                                    <CustomDatePicker
                                      label="Warranty End Date"
                                      value={editedWarrantyDate}
                                      onChange={(newDate) =>
                                        setEditedWarrantyDate(newDate)
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleSaveName("WarrantyDate")
                                      }
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("WarrantyDate")
                                      }
                                    >
                                      Cancel
                                    </Button>
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

                              <div style={{ marginBottom: "10px" }}>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "5px",
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
                                      <MenuItem value="" disabled>
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
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleSaveName("Catagory")}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleCancelNameEdit("Catagory")
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="value-comp"
                                      onClick={() => handleEdit("Catagory")}
                                    >
                                      {selectedNode.issue_category_name}
                                    </div>
                                  </>
                                )}
                              </div>

                              {selectedNode.image_file && (
                                <div style={{ marginBottom: "10px" }}>
                                  <div>
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      Image:
                                    </p>
                                  </div>

                                  <div>
                                    {isEditingImageFile ? (
                                      <>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleEditImageChange}
                                        />
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            handleSaveName("ImageFile")
                                          }
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          onClick={() =>
                                            handleCancelNameEdit("ImageFile")
                                          }
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className="value-comp"
                                          onClick={() =>
                                            handleEdit("ImageFile")
                                          }
                                        >
                                          <div>
                                            <img
                                              width="120"
                                              height="100"
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
                              )}
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
                      <Button
                        className="button"
                        variant="contained"
                        color="secondary"
                        onClick={() => setVisible(true)}
                      >
                        Add Item
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* <CustomDialog
              open={delOpen}
              setOpen={setDelOpen}
              proceedButtonText={"YES"}
              proceedButtonClick={handleDeleteNode}
              cancelButtonText={"NO"}
            ></CustomDialog> */}
          </div>
        </Box>
      </Main>
    </Box>
  );
}
