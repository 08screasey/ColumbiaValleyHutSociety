import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = (props) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(props.time) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    let timeout = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="Timer Font2 BrightBlue">
      {timeLeft.minutes ? timeLeft.minutes : "00"}:
      {timeLeft.seconds && timeLeft.seconds.toString().length === 2
        ? timeLeft.seconds
        : timeLeft.seconds
        ? "0" + timeLeft.seconds
        : "00"}
    </div>
  );
};

export default Timer;
