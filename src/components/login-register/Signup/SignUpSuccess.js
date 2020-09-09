import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import OtpField from "../OtpField";

const SignUpSuccess = ({
  method,
  username,
  handleLogin,
  sendOtpToEmail,
  sendOtpToPhone,
  isSending,
  handleChange,
  sendCounter,
  counterMinutes,
  counter,
  usePassword,
}) => {
  const [showOtp, setShowOtp] = useState(false);
  return (
    <div className="modal-body">
      {showOtp ? (
        <div>
          <p className="text-muted">{`Sign in to ${username || "-"}`}</p>
          <OtpField
            method={method}
            sendEmailOtp={sendOtpToEmail}
            sendPhoneOtp={sendOtpToPhone}
            handleChange={handleChange}
            sendCounter={sendCounter}
            counterMinutes={counterMinutes}
            counter={counter}
            isSending={isSending}
          ></OtpField>
        </div>
      ) : (
        <div>
          <p className="text-muted" style={{ textAlign: "center" }}>
            You will receive 4-digit verification code via{" "}
            {method === "phone" ? "SMS" : "Email"} at
          </p>
          <h2 style={{ textAlign: "center", marginTop: 10 }}>
            {username || "-"}
          </h2>
        </div>
      )}

      <Button
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        onClick={() => {
          usePassword
            ? handleLogin(!usePassword)
            : !showOtp
            ? setShowOtp(true)
            : handleLogin(true);
        }}
      >
        Continue
      </Button>
    </div>
  );
};
SignUpSuccess.propTypes = {
  username: PropTypes.string,
  handleLogin: PropTypes.func,
  sendOtpToEmail: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  handleChange: PropTypes.func,
  isSending: PropTypes.bool,
  sendCounter: PropTypes.number,
  counterMinutes: PropTypes.string,
  counter: PropTypes.string,
  usePassword: PropTypes.bool,
};

export default SignUpSuccess;
