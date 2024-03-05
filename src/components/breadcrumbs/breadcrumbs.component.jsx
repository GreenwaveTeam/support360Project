import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function BreadCrumbs({ urllist }) {
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {urllist.map(url => (
          <Link underline="hover" color="inherit" href={url.pagelink} key={url.pageName}>
            {url.pageName}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
