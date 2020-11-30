import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import PasswordField from "../PasswordField";
import CheckBox from "../../setting/checkBoxCostume";

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

  const [agreeTC, setAgreeTC] = useState(true)

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
          style={{borderRadius: 5}}
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
          style={{borderRadius: 5}}
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
      <div onClick={() => setAgreeTC(!agreeTC)} className="form-group form-check" style={{ marginTop: 5 }} data-toggle="collapse" href="#collapseExample">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox 
            className="form-check-input"
            handleChange={() => setAgreeTC(!agreeTC)}
            selected={!agreeTC} 
            setRadius={5} setHeight={20}
          />
          <label className="form-check-label" for="exampleCheck1" style={{ marginLeft: 10 }}>I Agree to Terms & Conditions </label>
        </div>
      </div>
      <div className="collapse" id="collapseExample">
        <div className="card card-body" style={{ textAlign: 'justify', fontSize: 11 }}>
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
        </div>
      </div>
      <Button
        disabled={isSubmitting || agreeTC}
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5, height: 50 }}
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
