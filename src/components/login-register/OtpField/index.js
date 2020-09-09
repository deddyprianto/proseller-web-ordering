import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const OtpField = ({
  sendPhoneOtp,
  sendEmailOtp,
  isSending,
  handleChange,
  method,
  sendCounter,
  counterMinutes,
  counter,
}) => {
  return (
    <div>
      <label for="txtOtp">
        Enter 4 digit OTP <span className="required">*</span>
      </label>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="password"
          className="woocommerce-Input woocommerce-Input--text input-text"
          style={{ height: 50, width: "40%" }}
          onChange={(e) => handleChange("txtOtp", e.target.value)}
        />
        <div style={{ width: "57%" }}>
          <Button
            disabled={isSending}
            className="button"
            style={{
              width: "100%",
              fontSize: 12,
              paddingLeft: 5,
              paddingRight: 5,
              height: 50,
            }}
            onClick={() =>
              method === "phone" ? sendPhoneOtp() : sendEmailOtp()
            }
          >
            {sendCounter > 0 ? "Resend OTP" : "Get OTP via Email"}
          </Button>
          {isSending && (
            <span
              className="text-muted"
              style={{ fontSize: 10, marginTop: 3, marginLeft: 10 }}
            >{`Resend after ${counterMinutes}:${counter}`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

OtpField.propTypes = {
  method: PropTypes.oneOf(["phone", "email"]),
  handleChange: PropTypes.func,
  sendCounter: PropTypes.number,
  counterMinutes: PropTypes.string,
  counter: PropTypes.string,
  isSending: PropTypes.bool,
  sendEmailOtp: PropTypes.func,
  sendPhoneOtp: PropTypes.func,
};

export default OtpField;
