import React from 'react';
import { Chip, Typography, Box, Grid } from '@mui/material';

const IssueListTable = ({ issuesList }) => {
  console.log('Issues List for populating below the issues : ',issuesList)
  return (
    <Box sx={{ padding: 2 }}>
      <Chip  label="List of Issues"></Chip>
      <Grid container spacing={1}>
        {issuesList?.map((data, index) => (
          <Grid item key={index + 1}>
            <Chip
            
              label={`${index + 1}. ${data?.issue_name} - ${data?.severity}`}
            ///  sx={{ margin: '2px',color:"white",background:"red" }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IssueListTable;
