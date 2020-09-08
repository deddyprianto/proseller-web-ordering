import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const EmailSignUpSuccess = ({ email, handleLogin }) => {
  const [showOtp, setShowOtp] = useState(false);
  return (
    <div className="modal-body">
      {showOtp ? (
        <div>
          <p className="text-muted">{`Sign in to ${email || "-"}`}</p>
          <OtpField
            method={"email"}
            sendEmailOtp={sendOtpToEmail}
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
              You will receive 4-digit verification code via Email at
          </p>
            <h2 style={{ textAlign: "center", marginTop: 10 }}>{email || "-"}</h2>
          </div>
        )}

      <Button
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        onClick={() => {
          !showOtp ? setShowOtp(true) : handleLogin;
        }}
      >
        Continue
      </Button>
    </div>
  );
};
EmailSignUpSuccess.propTypes = {
  email: PropTypes.string,
  handleLogin: PropTypes.func,
};

export default EmailSignUpSuccess;
