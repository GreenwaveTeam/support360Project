import { useEffect, useState } from "react";
import CustomSideBar from "./CustomSideBar";
import Test1 from "./Test1";
import Test2 from "./Test2";

import Topbar from './components/navigation/topbar/topbar';
import Main from './components/navigation/mainbody/mainbody';
import Sidebar from './components/navigation/sidebar/sidebar';
import DrawerHeader from './components/navigation/drawerheader/drawerheader.component';
import { Box } from "@mui/system";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Samplemodule from "./modules/device/module.samplemodule";
import NotFound from "./components/notfound/notfound.component";

import DeviceIssueCategoryUpload from "./modules/device/admin/module.deviceIssueCategoryUpload";
import DeviceIssueUpload from "./modules/device/admin/module.deviceIssueUpload";
import ApplicationConfiguration from "./modules/application/admin/module.applicationConfiguration";
import ModuleConfiguration from "./modules/application/admin/module.moduleConfiguration";
import ModuleUpload from "./modules/application/admin/module.moduleUpload";
import AddInfrastructureIssue from "./modules/infrastructure/module.addinfrastructureIssue";
import ConfigureInfrastructure from "./modules/infrastructure/module.configureInfrastructure";
import UserRegistration from "./modules/registration/UserRegistration";
import AdminRegistration from "./modules/registration/modules.registration.adminRegistration.component";
import AdminHome from "./modules/homepages/AdminHome";
import RichObjectTreeView from "./modules/device/admin/RichObjectTreeView";
import RoleConfiguration from "./modules/roleconfiguration/module.roleConfiguration";
import RolePageConfiguration from "./modules/roleconfiguration/module.rolePageConfiguration";
import AdminPage from "./modules/configurationpages/AdminPage";


function AdminRoutes() {
    const [urllist, setUrllist] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate=useNavigate();
    const handleDrawerOpen = () => {
		setOpen(true);
	};
 
  const [IsNotFound,setIsNotFound]=useState(false)
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Callback function to receive data from child
  const receiveUrllist = (data) => {
    // Update parent state with data received from child
    setUrllist(data);
  };
  const location=useLocation().pathname
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
        <NotFound/>
      </div>
    );
  };
  


    return (
      
      <Box  sx={{ display: 'flex' }}>
       {!IsNotFound && <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={urllist} />}
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
                 <Route
                  path="/InfrastructureConfigure"
                  element={<ConfigureInfrastructure  sendUrllist={receiveUrllist} />}
                />
                <Route
                  path="/infrastructure/addIssues"
                  element={<AddInfrastructureIssue  sendUrllist={receiveUrllist} />}
                />
                <Route
                  path="/userregistration"
                  element={<UserRegistration  sendUrllist={receiveUrllist}/>}
                  // this  should be /admin/userRegistration
                />
                 <Route
                  path="/adminregistration"
                  element={<AdminRegistration  sendUrllist={receiveUrllist}/>}
                />
                 <Route path="/home" element={<AdminHome  sendUrllist={receiveUrllist}/>} />

                 <Route
                  path="/DeviceConfigure"
                  element={<RichObjectTreeView  sendUrllist={receiveUrllist}/>}
                />

                <Route path="/Role" element={<RoleConfiguration  sendUrllist={receiveUrllist} />} />
                <Route
                  path="/Role/Page"
                  element={<RolePageConfiguration  sendUrllist={receiveUrllist}/>}
                />
                  <Route path="/configurePage" element={<AdminPage  sendUrllist={receiveUrllist} />} />

                <Route
                  path="/*"
                  element={<NotfoundComponent  setIsNotFound={setIsNotFound}/>}
                />
            {/*  */}
          </Routes>
          </Box>
          </Main>
      </Box>
     
    );
  }
export default AdminRoutes;