import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";

import PhoneInput from "react-phone-input-2";
import cx from "classnames";

import styles from "./styles.module.css";

const Portal = ({
  method,
  handleMethodChange,
  handlePhoneCheck,
  handleEmailCheck,
  handleChange,
  error,
  isSubmitting,
  enableOrdering,
  companyInfo,
  color,
}) => {
  const initialCountry = (companyInfo && companyInfo.countryCode) || "SG";
  const initialCodePhone = "+65";

  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (initialCountry === "ID") setPhoneCountryCode("+62");

    handleChange(
      method === "phone" ? "phoneNumber" : "email",
      method === "phone" ? phoneCountryCode + value : value
    );
  }, [value, phoneCountryCode, companyInfo]);

  useEffect(() => {
    setValue("");
  }, [method]);

  const renderPhone = () => {
    return (
      <>
        <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
          <label htmlFor="email">
            Enter your "Mobile Number"
            <span className="required">*</span>
          </label>
          <div className={styles.fieldGroup}>
            <div className={styles.phoneCountryCodeGroup}>
              <PhoneInput
                country={initialCountry}
                value={phoneCountryCode}
                enableSearch={true}
                autoFormat={false}
                onChange={(e) => {
                  setPhoneCountryCode(`+${e}`);
                }}
                onKeyDown={() => document.getElementById("phoneInput").focus()}
                disableSearchIcon
                inputStyle={{
                  width: 0,
                  border: `1px solid ${color}`,
                  backgroundColor: color,
                  height: 40,
                  outline: "none",
                  boxShadow: "none",
                }}
                dropdownStyle={{
                  color: "#808080",
                }}
              ></PhoneInput>
              <div className={styles.phoneCountryCode}>{phoneCountryCode}</div>
            </div>
            <Input
              id="phoneInput"
              value={value}
              className={styles.phoneField}
              onChange={(e) => {
                setValue(e.target.value.replace(/[^0-9]/g, ""));
              }}
            ></Input>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Button
          disabled={isSubmitting}
          className={cx("button", styles.submitButton)}
          onClick={() => {
            handlePhoneCheck();
          }}
        >
          Next
        </Button>
        <div
          className={cx("modal-title", styles.switchMethodButton)}
          onClick={() => handleMethodChange("email")}
        >
          Use Email Address to Sign In / Sign Up
        </div>
      </>
    );
  };

  const renderEmail = () => {
    return (
      <>
        <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
          <label htmlFor="email">
            Enter your Email Address
            <span className="required">*</span>
          </label>
          <div className={styles.fieldGroup}>
            <input
              type="email"
              value={value}
              className={cx(
                "woocommerce-Input woocommerce-Input--text input-text",
                styles.emailField
              )}
              onChange={(e) => setValue(e.target.value)}
            ></input>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Button
          disabled={isSubmitting}
          className={cx("button", styles.submitButton)}
          onClick={() => handleEmailCheck()}
        >
          Next
        </Button>
        <div
          className={cx("modal-title", styles.switchMethodButton)}
          onClick={() => handleMethodChange("phone")}
        >
          Use Mobile Number to Sign In / Sign Up
        </div>
      </>
    );
  };

  const handleRenderByMethod = (key) => {
    if (key === "phone") {
      return renderPhone();
    }
    return renderEmail();
  };

  return (
    <div className="modal-content" style={{ width: "100%" }}>
      <div className={cx("modal-header", styles.modalHeader)}>
        <h5 className={cx("modal-title", styles.modalTitle)}>
          {method === "phone" ? "Mobile" : "Email"} Log In / Sign Up
        </h5>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          disabled={!enableOrdering}
          style={{
            position: "absolute",
            right: 10,
            top: 16,
          }}
        >
          <span aria-hidden="true" className={styles.closeButton}>
            ×
          </span>
        </button>
      </div>

      <div className="modal-body">{handleRenderByMethod(method)}</div>
    </div>
  );
};

Portal.propTypes = {
  initialMethod: PropTypes.oneOf(["phone", "email"]).isRequired,
  handleMethodChange: PropTypes.func,
  handleChange: PropTypes.func,
  handleEmailCheck: PropTypes.func,
  handlePhoneCheck: PropTypes.func,
  error: PropTypes.string,
};

Portal.defaultProps = {
  initialMethod: "phone",
};

export default Portal;
