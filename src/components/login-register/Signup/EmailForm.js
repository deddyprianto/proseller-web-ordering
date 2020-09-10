import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import { Input, Button } from "reactstrap";

import styles from "./styles.module.css";
import PasswordField from "../PasswordField";

const EmailForm = ({
  email,
  handleSubmit,
  handleChange,
  isSubmitting,
  errorPassword,
  enablePassword,
  error,
}) => {
  const initialCountry = "SG";
  const [phoneCountryCode, setPhoneCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    handleChange("phoneNumber", phoneCountryCode + phone);
  }, [phone, phoneCountryCode]);

  return (
    <div className="modal-body">
      <p className="text-muted">{`Register for ${email || "-"}`}</p>
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="name">
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="woocommerce-Input woocommerce-Input--text input-text"
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </p>

      <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="name">
          Phone Number <span className="required">*</span>
        </label>
        <div className={styles.fieldGroup}>
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
            ></PhoneInput>
            <div className={styles.phoneCountryCode}>{phoneCountryCode}</div>
          </div>
          <Input
            type="number"
            className={styles.phoneField}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      {error === "" ? null : (
        <div
          style={{
            marginTop: 5,
            marginBottom: 5,
            color: "red",
            fontSize: 10,
            lineHeight: "15px",
          }}
        >
          {error}
        </div>
      )}
      {enablePassword && (
        <PasswordField
          handleChange={handleChange}
          error={errorPassword}
        ></PasswordField>
      )}
      <Button
        disabled={isSubmitting}
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        onClick={() => handleSubmit()}
      >
        Create Account
      </Button>
    </div>
  );
};

EmailForm.propTypes = {
  email: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
  errorPassword: PropTypes.string,
  enablePassword: PropTypes.bool,
};

export default EmailForm;
