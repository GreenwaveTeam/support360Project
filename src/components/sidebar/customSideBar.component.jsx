import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";

const Home = () => <h1>Home Page</h1>;
const Project = () => <h1>Project Page</h1>;
const Other = () => <h1>Other Page</h1>;

const CustomPanelBar = () => {
  const redirectTo = (path) => {
    window.location.href = path;
  };

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
              url: "/admin/applicationConfigure",
            },
            {
              label: "Infrastructure",
              icon: "pi pi-fw pi-globe",
              url: "/admin/InfrastructureConfigure",
            },
            {
              label: "Device",
              icon: "pi pi-fw pi-mobile",
              items: [
                {
                  label: "Device Category",
                  icon: "pi pi-fw pi-tags",
                  url: "/admin/device/CategoryConfigure",
                },
                {
                  label: "Device Tree",
                  icon: "pi pi-fw pi-sitemap",
                  url: "/admin/deviceConfigure",
                },
              ],
            },
          ],
        },
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          url: "/admin/home",
        },
        {
          label: "Create Admin",
          icon: "pi pi-fw pi-user-plus",
          url: "/admin/registration",
        },
        {
          label: "Create User",
          icon: "pi pi-fw pi-user-plus",
          url: "/user/registration",
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
          url: "/user/home",
        },

        {
          label: "Report",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            {
              label: "Application",
              icon: "pi pi-fw pi-desktop",
              url: "/user/reportapplication",
            },
            {
              label: "Device",
              icon: "pi pi-fw pi-mobile",
              url: "/user/reportdevice",
            },
            {
              label: "Infrastructure",
              icon: "pi pi-fw pi-globe",
              url: "/user/reportinfrastructure",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="sidebar">
        <PanelMenu model={items} />
      </div>
      <div className="layout-content">{/* Content of each page */}</div>
    </div>
  );
};

export default CustomPanelBar;
