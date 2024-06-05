import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function ImageTest() {
  const [testImgList, setTestImgList] = useState([]);

  useEffect(() => {
    async function getTestImages() {
      try {
        const response = await fetch(`http://localhost:8081/application/user/test`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        console.log("testImagesData data:", data);

        // Ensure that data is an array
        if (Array.isArray(data)) {
          setTestImgList(data);
        } else {
          console.error("Received data is not an array");
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    }

    getTestImages();
  }, []);

  return (
    <>
      {testImgList?.map((data, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {data && (
            <Paper elevation={3}>
              <img
                src={`data:image/jpeg;base64,${data}`}
                alt={`image-${index}`}
                style={{ width: "100%", height: "100%" }}
              />
            </Paper>
          )}
        </div>
      ))}
    </>
  );
}
