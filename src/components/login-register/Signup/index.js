import React, { useState } from "react";
import PropTypes from "prop-types";
// import PhoneForm from "./PhoneForm";
import EmailForm from "./EmailForm";
import EmailSignUpSuccess from "./EmailSignUpSuccess";

const SignUp = ({
  method,
  initialUserData,
  handleChange,
  handleEmailSubmit,
  handlePhoneSubmit,
  isSubmitting,
  errorPhone,
}) => {
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  return (
    <div className="modal-content" style={{ width: "100%" }}>
      <div
        className="modal-header"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          type="button"
          className="close"
          style={{
            position: "absolute",
            left: 10,
            top: 20,
          }}
          onClick={() => this.setState({ showPage: "mobileCheck" })}
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        <h5
          className="modal-title"
          id="exampleModalLabel"
          style={{ fontSize: 20 }}
        >
          {method === "phone" ? "Mobile" : "Email"} Register
        </h5>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          style={{
            position: "absolute",
            right: 10,
            top: 16,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 30 }}>
            ×
          </span>
        </button>
      </div>
      {method === "phone" ? null : !signUpSuccess ? (
        <EmailForm
          email={initialUserData.email}
          handleChange={handleChange}
          handleSubmit={
            method === "phone" ? handlePhoneSubmit : handleEmailSubmit
          }
          error={errorPhone}
          isSubmitting={isSubmitting}
        ></EmailForm>
      ) : (
          <EmailSignUpSuccess></EmailSignUpSuccess>
        )}
    </div>
  );
};

SignUp.propTypes = {
  method: PropTypes.oneOf("phone", "email"),
  initialUserData: PropTypes.object,
  handleChange: PropTypes.func,
  handleEmailSubmit: PropTypes.func,
  handlePhoneSubmit: PropTypes.func,
  handleBackButtonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  sendOtpToEmail: PropTypes.func,
  username: PropTypes.string.isRequired,
  otpTimer: PropTypes.object,
  isSubmitting: PropTypes.bool,
  errorPhone: PropTypes.string,
  errorEmail: PropTypes.string,
};

export default SignUp;
