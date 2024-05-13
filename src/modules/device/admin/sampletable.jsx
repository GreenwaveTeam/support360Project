import React from 'react'
import CustomTable from '../../../components/table/table.component';

export default function Sampletable() {
    
  const columns = [
    {
      id: "name",
      label: "Button",
      type: "button",
      canRepeatSameValue: false,
      buttonlabel:"Submit",
      function:(row)=>{
        console.log(row)
      }
    },
    // {
    //   id: "severity",
    //   label: "Severity",
    //   type: "dropdown",
    //   canRepeatSameValue: true,
    //   values: ["Critical", "Major", "Minor"],
    // },
  ];
  const rows = [
    { id: 'name', label: 'Name', buttonLabel:"Submit" ,value: 'Jon', age: 35,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', buttonLabel:"Submit", age: 42 ,function:(row)=>{console.log(row)}},
    { id: 'name', label: 'Name', value: 'Jaime', age: 45,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: 'Arya', age: 16,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: 'Daenerys', age: null,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: null, age: 150,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: 'Ferrara', age: 44,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: 'Rossini', age: 36,function:(row)=>{console.log(row)} },
    { id: 'name', label: 'Name', value: 'Harvey', age: 65,function:(row)=>{console.log(row)} },
  ];
    return (
    <div>
      <CustomTable
              progressVisible={true}
              rows={rows}
              isNotDeletable={true}
              columns={columns}
              tablename={"Existing Device Issues"} /*style={}*/
            />
    </div>
  )
}
