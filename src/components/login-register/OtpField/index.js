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
  enableSMSOTP,
  enableWhatsappOTP
}) => {
  return (
    <div>

      {
        !enableSMSOTP && method === "email" &&
        <Button
          disabled={isSending}
          className="button"
          style={{
            width: "100%",
            fontSize: 12,
            paddingLeft: 5,
            paddingRight: 5,
            height: 40,
            borderRadius: 5
          }}
          onClick={() =>
            method === "phone" ? sendPhoneOtp('SMSOTP') : sendEmailOtp()
          }
        >
          {sendCounter <= 2 ? `${sendCounter >= 1 ? "Resend" : "Send"} OTP ${method === 'phone' ? 'via SMS' : "via Email"}` : "Get OTP via Email"}
        </Button>
      }

      {
        enableSMSOTP &&
        <Button
          disabled={isSending}
          className="button"
          style={{
            width: "100%",
            fontSize: 12,
            paddingLeft: 5,
            paddingRight: 5,
            height: 40,
            borderRadius: 5
          }}
          onClick={() =>
            method === "phone" ? sendPhoneOtp('SMSOTP') : sendEmailOtp()
          }
        >
          {sendCounter <= 2 ? `${sendCounter >= 1 ? "Resend" : "Send"} OTP ${method === 'phone' ? 'via SMS' : "via Email"}` : "Get OTP via Email"}
        </Button>
      }

      {
        enableWhatsappOTP && (
          (enableSMSOTP && sendCounter <= 2) ||
          !enableSMSOTP
        ) && method === "phone" &&
        <Button
          disabled={isSending}
          className="button"
          style={{
            width: "100%",
            fontSize: 12,
            paddingLeft: 5,
            paddingRight: 5,
            height: 40,
            borderRadius: 5,
            backgroundColor: "#12950A",
            marginTop: 10
          }}
          onClick={() =>
            method === "phone" ? sendPhoneOtp('WhatsappOTP') : sendEmailOtp()
          }
        >
          {sendCounter <= 2 ? `${sendCounter >= 1 ? "Resend" : "Send"} OTP ${method === 'phone' ? 'via WhatsApp' : "via Email"}` : "Get OTP via Email"}
        </Button>
      }
      {isSending &&
        <div
          className="text-muted"
          style={{ fontSize: 12, marginTop: 5, textAlign: "center" }}
        >{`Resend after ${counterMinutes}:${counter}`}</div>
      }
      <label for="txtOtp">
        Enter 4 digit OTP <span className="required">*</span>
      </label>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="password"
          className="woocommerce-Input woocommerce-Input--text input-text"
          style={{ height: 50, width: "100%", borderRadius: 5, textAlign: "center" }}
          onChange={(e) => handleChange("txtOtp", e.target.value)}
        />
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
