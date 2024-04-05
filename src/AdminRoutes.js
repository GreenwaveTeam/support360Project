import { useState } from "react";
import CustomSideBar from "./CustomSideBar";
import Test1 from "./Test1";
import Test2 from "./Test2";

import Topbar from './components/navigation/topbar/topbar';
import Main from './components/navigation/mainbody/mainbody';
import Sidebar from './components/navigation/sidebar/sidebar';
import DrawerHeader from './components/navigation/drawerheader/drawerheader.component';
import { Box } from "@mui/system";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Samplemodule from "./modules/device/module.samplemodule";
import NotFound from "./components/notfound/notfound.component";

import DeviceIssueCategoryUpload from "./modules/device/admin/module.deviceIssueCategoryUpload";
import DeviceIssueUpload from "./modules/device/admin/module.deviceIssueUpload";
import ApplicationConfiguration from "./modules/application/admin/module.applicationConfiguration";
import ModuleConfiguration from "./modules/application/admin/module.moduleConfiguration";
import ModuleUpload from "./modules/application/admin/module.moduleUpload";



function AdminRoutes() {
    const [urllist, setUrllist] = useState([]);
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
		setOpen(true);
	};
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Callback function to receive data from child
  const receiveUrllist = (data) => {
    // Update parent state with data received from child
    setUrllist(data);
  };
    return (
      <Box sx={{ display: 'flex' }}>
        <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={urllist} />
        <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        
      />
      <Main open={open}>
      <DrawerHeader />
        <Box>
          <Routes>
          
            <Route path="/Sample" element={<Samplemodule sendUrllist={receiveUrllist}/>} />
            <Route path="/test1" element={<Test1  sendUrllist={receiveUrllist}/>} />
            <Route
                  path="/Device/CategoryConfigure"
                  element={<DeviceIssueCategoryUpload sendUrllist={receiveUrllist}/>}
                />
                <Route
                  path="/Device/CategoryConfigure/Issue"
                  element={<DeviceIssueUpload sendUrllist={receiveUrllist}/>}
                />
                <Route
                  path="/ApplicationConfigure"
                  element={<ApplicationConfiguration sendUrllist={receiveUrllist}/>}
                />
                <Route
                  path="/ApplicationConfigure/Modules"
                  element={<ModuleConfiguration sendUrllist={receiveUrllist}/>}
                />
                <Route
                  path="/ApplicationConfigure/Module"
                  element={<ModuleUpload sendUrllist={receiveUrllist}/>}
                />
                
            {/*  */}
          </Routes>
          </Box>
          </Main>
      </Box>
    );
  }
export default AdminRoutes;