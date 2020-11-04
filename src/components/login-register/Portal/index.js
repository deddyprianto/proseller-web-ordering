import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";
import PhoneInput from "react-phone-input-2";
import cx from "classnames";

import styles from "./styles.module.css";

let Portal = ({
  method,
  handleMethodChange,
  handlePhoneCheck,
  handleEmailCheck,
  handleChange,
  error,
  loginByEmail,
  loginByMobile,
  enableOrdering,
  companyInfo
}) => {
  // console.log(companyInfo)
  // let [method, setMethod] = useState(initialMethod);
  let initialCountry = (companyInfo && companyInfo.countryCode) || "SG";
  let initialCodePhone = "+65";

  let [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  let [value, setValue] = useState("");
  let handleValueChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if(initialCountry === "ID") setPhoneCountryCode("+62")

    handleChange(
      method === "phone" ? "phoneNumber" : "email",
      method === "phone" ? phoneCountryCode + value : value
    );
  }, [value, phoneCountryCode, companyInfo]);

  useEffect(() => {
    setValue("");
  }, [method]);

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
      <div className="modal-body">
        <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
          <label htmlFor="email">
            {`Enter your ${method === "phone" ? "Mobile Number" : "Email Address"} `}
            <span className="required">*</span>
          </label>
          <div className={styles.fieldGroup}>
            {method === "phone" && (
              <div className={styles.phoneCountryCodeGroup}>
                <PhoneInput
                  country={initialCountry}
                  value={phoneCountryCode}
                  enableSearch={true}
                  autoFormat={false}
                  onChange={(e) => setPhoneCountryCode(`+${e}`)}
                  inputStyle={{
                    width: "0",
                    border: "1px solid #FFF",
                    height: 40,
                  }}
                  dropdownStyle={{
                    color: "#808080"
                  }}
                ></PhoneInput>
                <div className={styles.phoneCountryCode}>
                  {phoneCountryCode}
                </div>
              </div>
            )}
            {method === "phone" ? (
              <Input
                type="number"
                value={value}
                className={styles.phoneField}
                onChange={handleValueChange}
              ></Input>
            ) : (
                <input
                  type="email"
                  value={value}
                  className={cx(
                    "woocommerce-Input woocommerce-Input--text input-text",
                    styles.emailField
                  )}
                  onChange={handleValueChange}
                ></input>
              )}
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Button
          className={cx("button", styles.submitButton)}
          onClick={method === "phone" ? handlePhoneCheck : handleEmailCheck}
        >
          Next
        </Button>
        {
          ((method === 'email' && loginByMobile) || (method === 'phone' && loginByEmail)) &&
          <div
            className={cx("modal-title", styles.switchMethodButton)}
            onClick={() => handleMethodChange(method === "phone" ? "email" : "phone")}
          >
            Use {method !== "phone" ? "Mobile Number" : "Email Address"} to Sign
            In / Sign Up
          </div>
        }
      </div>
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
