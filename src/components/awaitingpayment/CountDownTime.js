import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector } from 'react-redux';

function CountdownTimer({ targetDate, onCountdownComplete, color }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = getTimeRemaining(targetDate);
      setTimeLeft(remainingTime);

      if (remainingTime.totalSeconds <= 0) {
        clearInterval(timer);
        onCountdownComplete(true); // Call the callback with true when countdown is complete
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [targetDate, onCountdownComplete]);

  function getTimeRemaining(endTime) {
    const totalMilliseconds = Date.parse(endTime) - Date.now();
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = Math.max(totalSeconds % 60, 0); // Ensure seconds are not negative
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = Math.max(totalMinutes % 60, 0); // Ensure minutes are not negative
    const hours = Math.max(Math.floor(totalMinutes / 60), 0); // Ensure hours are not negative

    // Format the time parts as two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return {
      totalSeconds,
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds,
    };
  }

  return (
    <div
      style={{
        fontWeight: 500,
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: color.primary,
        padding: '10px',
        margin: '10px 0px',
      }}
    >
      <div>Waiting for payment</div>
      <div style={{ margin: '0px 7px' }}>
        <span>{timeLeft.hours}:</span>
        <span>{timeLeft.minutes}:</span>
        <span>{timeLeft.seconds}</span>
      </div>
      <AccessTimeIcon
        sx={{
          color: color.primary,
          fontSize: '20px',
          padding: '0px',
          margin: '0px',
        }}
      />
    </div>
  );
}

function CountDownTime({ targetDate, color }) {
  const history = useHistory();

  // const targetDate = '2023-10-03T10:57:09.307Z'; // Replace with your target date
  const [countdownComplete, setCountdownComplete] = useState(false);

  const handleCountdownComplete = (complete) => {
    setCountdownComplete(complete);
  };

  useEffect(() => {
    if (countdownComplete) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownComplete]);

  return (
    <div>
      <CountdownTimer
        targetDate={targetDate}
        onCountdownComplete={handleCountdownComplete}
        color={color}
      />
    </div>
  );
}

export default CountDownTime;
