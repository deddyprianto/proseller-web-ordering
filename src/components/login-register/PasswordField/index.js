import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

const PasswordField = ({ handleChange, error }) => {
  const [show, setShow] = useState(false);
  return (
    <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
      <label for="password">
        Enter Password <span className="required">*</span>
      </label>
      <div className={styles.passwordField}>
        <input
          type={show ? "text" : "password"}
          className="woocommerce-Input woocommerce-Input--text input-text"
          name="password"
          id="password"
          style={{ borderRadius: 5 }}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <div className={styles.showHideIcon}>
          <i
            className={show ? "fa fa-eye" : "fa fa-eye-slash"}
            onClick={() => setShow(!show)}
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
    </p>
  );
};

PasswordField.propTypes = {
  handleChange: PropTypes.func,
  error: PropTypes.string,
};

export default PasswordField;
