import React, { useState, useEffect } from "react";

const OTPCountdown = ({
  setDisableButtonResendOTP,
  resendOTP,
  setResendOTP,
  setSeconds,
  setMinutes,
  seconds,
  minutes,
}) => {
  useEffect(() => {
    let interval;
    if (resendOTP) {
      console.log("YOUR LOG =>", "pukimak");
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setSeconds(59);
          setMinutes(minutes - 1);
        } else {
          setDisableButtonResendOTP(false);
          setResendOTP(false);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [minutes, seconds, resendOTP, setDisableButtonResendOTP, setResendOTP]);

  return (
    <div
      style={{
        color: "#000",
        textAlign: "center",
        fontFamily: '"Plus Jakarta Sans"',
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: "normal",
        marginTop: "16px",
      }}
    >
      <p>
        Resend After: {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default OTPCountdown;
