import React from 'react';
import { TextField } from '@mui/material';

export default function Textfield({ id, value, onChange }) {
  return (
    <>
      <TextField id={id} value={value} onChange={onChange} />
    </>
  );
}
