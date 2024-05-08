import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function BreadCrumbs({ urllist }) {
  return (
    <Breadcrumbs
      sx={{
        fontWeight: "bold",
        fontSize: "15px",
        fontStyle: "italic",
        color: "#0C0C0C",
      }}
      separator="›"
      aria-label="breadcrumb"
    >
      {urllist.map((url) => (
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={url.pagelink}
          key={url.pageName}
        >
          {url.pageName}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
