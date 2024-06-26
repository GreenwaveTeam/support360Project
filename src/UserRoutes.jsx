import { useEffect, useState } from "react";
import CustomSideBar from "./CustomSideBar";
import Test1 from "./Test1";
import Test2 from "./Test2";

import Topbar from "./components/navigation/topbar/topbar";
import Main from "./components/navigation/mainbody/mainbody";
import Sidebar from "./components/navigation/sidebar/sidebar";
import DrawerHeader from "./components/navigation/drawerheader/drawerheader.component";
import { Box } from "@mui/system";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Samplemodule from "./modules/device/module.samplemodule";
import NotFound from "./components/notfound/notfound.component";

import DeviceIssueCategoryUpload from "./modules/device/admin/module.deviceIssueCategoryUpload";
import DeviceIssueUpload from "./modules/device/admin/module.deviceIssueUpload";
import ApplicationConfiguration from "./modules/application/admin/module.applicationConfiguration";
import ModuleConfiguration from "./modules/application/admin/module.moduleConfiguration";
import ModuleUpload from "./modules/application/admin/module.moduleUpload";
import UserDeviceTree from "./modules/device/user/DeviceTreeForUser";
import ApplicationUser from "./modules/application/user/modules.application";
import InfrastructureUser from "./modules/infrastructure/user/InfrastructureUser";
import UserHome from "./modules/homepages/module.homepage.userhome";

function UserRoutes() {
  const [urllist, setUrllist] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [IsNotFound, setIsNotFound] = useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Callback function to receive data from child
  const receiveUrllist = (data) => {
    console.log("Current Url List => ", data);
    // Update parent state with data received from child
    setUrllist(data);
  };
  const location = useLocation().pathname;
  // useEffect(()=>{
  //   console.log("Location====>",location)
  //   if(IsNotFound)
  //   {
  //     navigate("/*")
  //   }
  // },[IsNotFound])
  const NotfoundComponent = ({ setIsNotFound }) => {
    useEffect(() => {
      console.log("Entering Not Found Component ! ");
      setIsNotFound(true);
    }, []); // empty dependency array ensures this runs only once after initial render

    // Render whatever content you want for the NotFound component
    return (
      <div>
        <NotFound />
      </div>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      {!IsNotFound && (
        <Topbar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          urllist={urllist}
        />
      )}
      <Sidebar
        open={open}
        setOpen={setOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box>
          <Routes>
            <Route
              path="/home"
              element={<UserHome sendUrllist={receiveUrllist} />}
            />
            <Route
              path="/ReportDevice"
              element={<UserDeviceTree sendUrllist={receiveUrllist} />}
            />
            <Route
              path="/ReportApplication"
              element={<ApplicationUser sendUrllist={receiveUrllist} />}
            />
            <Route
              path="/ReportInfrastructure"
              element={<InfrastructureUser sendUrllist={receiveUrllist} />}
            />
            <Route
              path="/*"
              element={<NotfoundComponent setIsNotFound={setIsNotFound} />}
            />
            {/*  */}
          </Routes>
        </Box>
      </Main>
    </Box>
  );
}
export default UserRoutes;
