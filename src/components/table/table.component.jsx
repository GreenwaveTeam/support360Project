import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'

export default function CustomTable ({tableheader,rows}) {
    // useEffect(() => {
    //     console.log('CustomTable Rendered')
    //   }, [])
  return (
    <div>
      <TableContainer>
        <Table  aria-label="customized table">
        <TableHead>
            <TableRow>
                <TableCell>
                    {tableheader}
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row,index)=>(

                <TableRow>
                    
                </TableRow>

            ))}
            
        </TableBody>
        </Table>       
     </TableContainer> 
    </div>
  )
}
