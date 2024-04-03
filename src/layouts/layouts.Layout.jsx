import { useState } from "react";
import SidebarPage from "../components/navigation/sidebar/sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [open, setOpen] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const role = "superadmin";
    fetchPageName(role);
  }, []);

  const fetchPageName = async (role) => {
    console.log("first", localStorage.getItem("token"));
    try {
      const response = await fetch(`http://localhost:8081/role/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("data ", data);
      console.log("data.adminList", data.pagedetails);
      console.log("data.userList", data.pagedetails);
      // setAdminList(data.adminList);
      setAdminList(convertToFormat(data.pagedetails));
      // setUserList(data.userList);
      setUserList(convertToFormat(data.pagedetails));
    } catch (error) {
      localStorage.clear();
      // navigate("/");
      console.error("Error fetching user list:", error);
    }
  };

  function convertToFormat(pageDetails) {
    const formattedPages = [];
    const pageDetailsSet = new Set();

    pageDetails.forEach((page, index) => {
      pageDetailsSet.add(page.pagename); // Add pagename to the Set
    });

    // Convert Set to array
    const uniquePageNames = Array.from(pageDetailsSet);

    // Create formatted pages using uniquePageNames
    uniquePageNames.forEach((pagename) => {
      formattedPages.push({
        pagename: pagename,
        pagelink: pagename,
      });
    });
    console.log("formattedPages : ", formattedPages);
    return formattedPages;
  }

  return (
    <div>
      <SidebarPage
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={adminList}
        userList={userList}
      />
    </div>
  );
}

export default Layout;
