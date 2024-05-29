import React, { useState } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../modules/contexts/UserContext";
import "./newStyle.css";
import { createContext, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
// import { useUserContext } from "../../contexts/UserContext";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
const defaultStyles = {
  //color: "#c50808",
};
const DB_IP = process.env.REACT_APP_SERVERIP;
const CustomMenuItem = ({ label, path }) => {
  const navigate = useNavigate();

  if (path) {
    return (
      <div
        onClick={() => {
          navigate(path);
        }}
        style={defaultStyles}
      >
        {label}
      </div>
    );
  } else {
    return <div>{label}</div>;
  }
};

const CustomPanelBar = () => {
  // const items = [
  //   {
  //     label: "Admin",
  //     icon: "pi pi-fw pi-user",
  //     items: [
  //       {
  //         label: "Configure",
  //         icon: "pi pi-fw pi-cog",
  //         items: [
  //           {
  //             label: "Application",
  //             icon: "pi pi-fw pi-desktop",
  //             path: "/admin/applicationConfigure",
  //           },
  //           {
  //             label: "Infrastructure",
  //             icon: "pi pi-fw pi-globe",
  //             path: "/admin/InfrastructureConfigure",
  //           },
  //           {
  //             label: "Device",
  //             icon: "pi pi-fw pi-mobile",
  //             items: [
  //               {
  //                 label: "Device Category",
  //                 icon: "pi pi-fw pi-tags",
  //                 path: "/admin/device/CategoryConfigure",
  //               },
  //               {
  //                 label: "Device Tree",
  //                 icon: "pi pi-fw pi-sitemap",
  //                 path: "/admin/deviceConfigure",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         label: "Home",
  //         icon: "pi pi-fw pi-home",
  //         path: "/admin/home",
  //       },
  //       {
  //         label: "Create Admin",
  //         icon: "pi pi-fw pi-user-plus",
  //         path: "/admin/registration",
  //       },
  //       {
  //         label: "Create User",
  //         icon: "pi pi-fw pi-user-plus",
  //         path: "/user/registration",
  //       },
  //     ],
  //   },
  //   {
  //     label: "User",
  //     icon: "pi pi-fw pi-users",
  //     items: [
  //       {
  //         label: "Home",
  //         icon: "pi pi-fw pi-home",
  //         path: "/user/home",
  //       },
  //       {
  //         label: "Report",
  //         icon: "pi pi-fw pi-chart-bar",
  //         items: [
  //           {
  //             label: "Application",
  //             icon: "pi pi-fw pi-desktop",
  //             path: "/user/reportapplication",
  //           },
  //           {
  //             label: "Device",
  //             icon: "pi pi-fw pi-mobile",
  //             path: "/user/reportdevice",
  //           },
  //           {
  //             label: "Infrastructure",
  //             icon: "pi pi-fw pi-globe",
  //             path: "/user/reportinfrastructure",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  const [menuJson, SetMenuJson] = useState();
  const { userData, setUserData } = useUserContext();
  const [formData, setFormData] = useState();
  const [currentTheme, setCurrentTheme] = useState("dark");

  const theme = createTheme({
    palette: {
      type: "dark",
      background: {
        default: "#000000",
      },
      secondary: {
        main: "#E19A4C",
      },
    },
  });

  const storedTheme = localStorage.getItem("theme");
  console.log(`CurrentTheme ${storedTheme}`);
  // const [mode, setMode] = useState(storedTheme || "light");

  //console.log("navi role => ", formData.role);

  React.useEffect(() => {
    fetchUser();
    fetchToken();
    // fetchData();
  }, []);

  const fetchData = async (role) => {
    try {
      console.log("navi role => ", role);
      console.log(
        "navi link ",
        `http://${DB_IP}/navigation/${role ? role : ""}`
      );
      const response = await fetch(
        `http://${DB_IP}/navigation/${role ? role : ""}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const menuData = await response.json();
        console.log("");
        SetMenuJson(menuData.items);
        //SetMenuJson = menuData;
        console.log("from API MenuJSON => ", JSON.stringify(menuData.items));

        console.log("data");
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchToken = async () => {
    console.log("Token Test : ", localStorage.getItem("token"));
  };

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
      setFormData(data.role);
      role = data.role;

      console.log("formData : ", formData);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
    fetchData(role);
  };

  const renderMenuItems = (items) => {
    console.log("renderedMenutitems call", items);
    if (items === null) {
      return null;
    } else {
      return items.map((item) => ({
        ...item,
        label: <CustomMenuItem label={item.label} path={item.path} />,
        items: item.items ? renderMenuItems(item.items) : undefined,
      }));
    }
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className="sidebar">
          {menuJson && (
            <PanelMenu
              className={
                storedTheme === "light" || storedTheme == null
                  ? "panelMenuStyleLightMode"
                  : "panelMenuStyleDarkMode"
              }
              //className="panelMenuStyle  panelMenuStyleDarkMode  panelMenuStyleLightMode"
              model={renderMenuItems(menuJson)}
            />
          )}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default CustomPanelBar;
