import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import Textfield from '../textfield/textfield.component'

export default function CustomTable ({tableheader,rows}) {
    // useEffect(() => {
    //     console.log('CustomTable Rendered')
    //   }, [])

    const customobj=[
        {
            'name':'Suraj',
            'age':'22'
        }
        ,
        {
            'name':'Suraj12',
            'age':'22'
        },
        {
            'name':'Suraj32',
            'age':'22'
        }
    ]
  return (
    <div>
      <TableContainer>
        <Table  aria-label="customized table">
        <TableHead>
            <TableRow>
                <TableCell>
                    tableheader
                </TableCell>
            </TableRow>
        </TableHead>
        <br/>
        <br/>
        <TableBody>
    {customobj.map((row, index) => (
        <TableRow key={index}>
            {Object.keys(row).map((key) => (
                <TableCell key={key}>
                {row[key] && <Textfield/>}
                </TableCell>
            ))}
        </TableRow>
    ))}
</TableBody>

        </Table>       
     </TableContainer> 
    </div>
  )
}
