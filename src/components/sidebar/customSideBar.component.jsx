import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Link, NavLink, useNavigate } from "react-router-dom";

const defaultStyles = {
  color: '#000'
};

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
    return <div>{label}</div >;
  }
};

const CustomPanelBar = () => {
  const items = [
    {
      label: "Admin",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Configure",
          icon: "pi pi-fw pi-cog",
          items: [
            {
              label: "Application",
              icon: "pi pi-fw pi-desktop",
              path: "/admin/applicationConfigure",
            },
            {
              label: "Infrastructure",
              icon: "pi pi-fw pi-globe",
              path: "/admin/InfrastructureConfigure",
            },
            {
              label: "Device",
              icon: "pi pi-fw pi-mobile",
              items: [
                {
                  label: "Device Category",
                  icon: "pi pi-fw pi-tags",
                  path: "/admin/device/CategoryConfigure",
                },
                {
                  label: "Device Tree",
                  icon: "pi pi-fw pi-sitemap",
                  path: "/admin/deviceConfigure",
                },
              ],
            },
          ],
        },
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          path: "/admin/home",
        },
        {
          label: "Create Admin",
          icon: "pi pi-fw pi-user-plus",
          path: "/admin/registration",
        },
        {
          label: "Create User",
          icon: "pi pi-fw pi-user-plus",
          path: "/user/registration",
        },
      ],
    },
    {
      label: "User",
      icon: "pi pi-fw pi-users",
      items: [
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          path: "/user/home",
        },
        {
          label: "Report",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            {
              label: "Application",
              icon: "pi pi-fw pi-desktop",
              path: "/user/reportapplication",
            },
            {
              label: "Device",
              icon: "pi pi-fw pi-mobile",
              path: "/user/reportdevice",
            },
            {
              label: "Infrastructure",
              icon: "pi pi-fw pi-globe",
              path: "/user/reportinfrastructure",
            },
          ],
        },
      ],
    },
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => ({
      ...item,
      label: <CustomMenuItem label={item.label} path={item.path} />,
      items: item.items ? renderMenuItems(item.items) : undefined,
    }));
  };

  return (
    <div>
      <div className="sidebar">
        <PanelMenu model={renderMenuItems(items)} />
      </div>
    </div>
  );
};

export default CustomPanelBar;
