import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

import styles from "./styles.module.css";

import cx from "classnames";
import PasswordField from "../PasswordField";
import OtpField from "../OtpField";

const Login = ({
  method,
  handleBackButtonClick,
  handleSubmit,
  handleChange,
  sendOtpToEmail,
  sendOtpToPhone,
  username,
  otpTimer,
  isSubmitting,
  enablePassword,
}) => {
  const { sendCounter, counterMinutes, counter, isSending } = otpTimer;
  return (
    <div className="modal-content" style={{ width: "100%" }}>
      <div
        className="modal-header"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          type="button"
          className={cx("close", styles.backButton)}
          onClick={handleBackButtonClick}
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        <h5 className={cx("modal-title", styles.modalTitle)}>
          {method === "phone" ? "Mobile Sign In" : "Email Sign In"}
        </h5>
        <button
          type="button"
          className={cx("close", styles.closeButton)}
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="modal-body">
        <p className="text-muted">{`Sign in to ${username}`}</p>
        {/* <div style={{ flexDirection: "row", marginBottom: 20 }}>
          <Button
            className={otp ? "use-select" : "un-select"}
            style={{ height: 50 }}
            onClick={() => setOtp(true)}
          >
            Use Email OTP
          </Button>
          <Button
            className={!otp ? "use-select" : "un-select"}
            style={{ height: 50 }}
            onClick={() => setOtp(false)}
          >
            Use Password
          </Button>
        </div> */}
        {enablePassword ? (
          <PasswordField handleChange={handleChange}></PasswordField>
        ) : (
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
        )}
        <Button
          disabled={isSubmitting}
          className="button"
          style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
          onClick={() => handleSubmit(!enablePassword)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

Login.propTypes = {
  method: PropTypes.oneOf(["phone", "email"]).isRequired,
  handleBackButtonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  sendOtpToEmail: PropTypes.func,
  username: PropTypes.string.isRequired,
  otpTimer: PropTypes.object,
  isSubmitting: PropTypes.bool,
  enablePassword: PropTypes.bool,
};

Login.defaultProps = {
  method: "phone",
};

export default Login;
