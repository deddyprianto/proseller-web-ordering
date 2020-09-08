import React from "react";
import PropTypes from "prop-types";

const PasswordField = ({ handleChange }) => {
  return (
    <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
      <label for="password">
        Enter Password <span className="required">*</span>
      </label>
      <input
        type="password"
        className="woocommerce-Input woocommerce-Input--text input-text"
        name="password"
        id="password"
        onChange={(e) => handleChange("password", e.target.value)}
      />
    </p>
  );
};

PasswordField.propTypes = {
  handleChange: PropTypes.func,
};

export default PasswordField;
