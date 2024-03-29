import React, { useState } from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CustomTreeView = ({ data, handleNodeClick, handleContextMenu }) => {
  const renderTreeNodes = (node) => {
    if (node.children && node.children.length > 0) {
      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={node.name}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {node.children.map((child) => renderTreeNodes(child))}
        </TreeItem>
      );
    } else {
      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={node.name}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        />
      );
    }
  };

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

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={getAllNodeIds(data)}
    >
      {renderTreeNodes(data)}
    </TreeView>
  );
};

export default CustomTreeView;
