import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import PasswordField from "../PasswordField";

const PhoneForm = ({
  phoneNumber,
  handleSubmit,
  handleChange,
  isSubmitting,
  errorPassword,
  enablePassword,
  errorName,
  error,
  children,
}) => {
  return (
    <div className="modal-body">
      <p className="text-muted">{`Register for ${phoneNumber || "-"}`}</p>
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="name">
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="woocommerce-Input woocommerce-Input--text input-text"
          onChange={(e) => handleChange("name", e.target.value, true)}
        />
        {errorName !== "" && (
          <div style={{ marginTop: 5, marginBottom: 5, color: "red",lineHeight: "15px", }}>
            {errorName}
          </div>
        )}
      </p>

      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          className="woocommerce-Input woocommerce-Input--text input-text"
          onChange={(e) => handleChange("email", e.target.value, true)}
        />
        {error !== "" && (
          <div style={{ marginTop: 5, marginBottom: 5, color: "red",lineHeight: "15px", }}>
            {error}
          </div>
        )}
      </p>
      {children}
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

PhoneForm.propTypes = {
  phoneNumber: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
  errorPassword: PropTypes.string,
  enablePassword: PropTypes.bool,
};

export default PhoneForm;
