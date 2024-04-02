import { Divider } from "@mui/material";
import Dropdown from "../../components/dropdown/dropdown.component";

import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';

import Table from '../../components/table/table.component'


export default function Roleconfig() {
    const pageDetails=[{pagename:'Page1',components:['component1','component2']},{pagename:'Page2',components:['component3','component4']}]
    const pagelist=['Page1','Page2']
    const [selectedPage,setSelectedPage]=useState('')
    const [componentList,setComponentList]=useState([])
    const [selectedComponent,setSelectedComponent]=useState('')
    const [rows,setRows]=useState([])
    const handleCheck=()=>{}
    const columns=[{
        "id": "page",
        "label": "Page Name",
        "type": "textbox",
        "canRepeatSameValue":false
      },{
        "id": "component",
        "label": "Component Name",
        "type": "textbox",
        "canRepeatSameValue":false
      },]
    const handlePageChange=(event)=>{
        setSelectedPage(event.target.value)
        console.log("selected page==>"+event.target.value)
        setComponentList(
            pageDetails.find((page) => {
              if (page.pagename === event.target.value) {
                console.log(page.components);
                return page;
              }
            }).components
          );
              
    }
    const handleComponentSelect=(event)=>{
        setSelectedComponent(event.target.value)
    }
    const handleRoleSubmit=()=>{
        setRows(prev => [...prev, { page: selectedPage, component: selectedComponent }]);

    }
   
  return (
    <Box>
        <Box>
        <Dropdown
            id="pageDetails"
            label="Page"
            value={selectedPage}
            onChange={handlePageChange}
            list={pagelist}/>&nbsp;&nbsp;
          {componentList.length>0 &&(
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {componentList.map((value) => {
              
              return (
                <ListItem
                  key={value}
                  
                  disablePadding
                >
                  <ListItemButton role={undefined}  dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={handleCheck}
                        tabIndex={-1}
                        disableRipple
                        //inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={value} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          )}
            &nbsp;&nbsp;
            <Button color="primary"
              variant="contained" 
              type='submit' onClick={handleRoleSubmit}>Add</Button>
            </Box>
             <Table rows={rows} setRows={setRows} columns={columns} editActive={false}/>
           
    </Box>  

    )
}
