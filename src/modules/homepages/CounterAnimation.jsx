import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const CounterAnimation = ({ targetValue }) => {
  const [count, setCount] = useState(0);

  const animateCount = (targetValue, duration) => {
    const step = Math.ceil(targetValue / duration);
    let currentCount = 0;

    const updateCount = () => {
      if (currentCount < targetValue) {
        setCount(currentCount);
        currentCount += step;
        setTimeout(updateCount, 10); // Update every millisecond
      } else {
        setCount(targetValue); // Ensure final value is exactly targetValue
      }
    };

    updateCount();
  };

  // Start the animation when the component mounts
  useEffect(() => {
    animateCount(targetValue, 1000); // Duration of 1000ms
  }, [targetValue]);

  return (
    <Typography sx={{ fontWeight: 600, fontSize: "1.7rem" }}>
      {count}
    </Typography>
  );
};

export default CounterAnimation;
