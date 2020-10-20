import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import EmailForm from "./EmailForm";
import PhoneForm from "./PhoneForm";
import SignUpSuccess from "./SignUpSuccess";
import CustomFields from "../../profile/CustomFields";

const SignUp = ({
  method,
  initialUserData,
  handleBackButtonClick,
  handleChange,
  handleEmailSubmit,
  handlePhoneSubmit,
  handleEmailLogin,
  handlePhoneLogin,
  sendOtpToEmail,
  sendOtpToPhone,
  otpTimer,
  isSubmitting,
  errorPhone,
  errorEmail,
  errorPassword,
  enablePassword,
  errorName,
  signUpSuccess,
  fields,
  enableSMSOTP,
  enableWhatsappOTP,
  enableOrdering,
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
          className="close"
          style={{
            position: "absolute",
            left: 10,
            top: 20,
          }}
          onClick={handleBackButtonClick}
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
      {signUpSuccess ? (
        <SignUpSuccess
          method={method}
          handleLogin={method === "phone" ? handlePhoneLogin : handleEmailLogin}
          username={
            method === "phone"
              ? initialUserData.phoneNumber
              : initialUserData.email
          }
          handleChange={handleChange}
          sendOtpToEmail={sendOtpToEmail}
          sendOtpToPhone={sendOtpToPhone}
          sendCounter={sendCounter}
          counterMinutes={counterMinutes}
          counter={counter}
          isSending={isSending}
          isSubmitting={isSubmitting}
          usePassword={enablePassword}
          enableOrdering={enableOrdering}
          enableSMSOTP={enableSMSOTP}
          enableWhatsappOTP={enableWhatsappOTP}
        ></SignUpSuccess>
      ) : method === "phone" ? (
        <PhoneForm
          phoneNumber={initialUserData.phoneNumber}
          handleChange={handleChange}
          handleSubmit={handlePhoneSubmit}
          error={errorEmail}
          errorPassword={errorPassword}
          enablePassword={enablePassword}
          errorName={errorName}
        >
          <CustomFields
            fields={fields}
            handleChange={handleChange}
            showSignUpFields={true}
          ></CustomFields>
        </PhoneForm>
      ) : (
            <EmailForm
              email={initialUserData.email}
              handleChange={handleChange}
              handleSubmit={handleEmailSubmit}
              error={errorPhone}
              errorPassword={errorPassword}
              enablePassword={enablePassword}
              errorName={errorName}
            >
              <CustomFields
                fields={fields}
                handleChange={handleChange}
                showSignUpFields={true}
              ></CustomFields>
            </EmailForm>
          )}
    </div>
  );
};

SignUp.propTypes = {
  method: PropTypes.oneOf(["phone", "email"]),
  initialUserData: PropTypes.object,
  handleChange: PropTypes.func,
  handleEmailSubmit: PropTypes.func,
  handlePhoneSubmit: PropTypes.func,
  handleBackButtonClick: PropTypes.func,
  handleEmailLogin: PropTypes.func,
  handlePhoneLogin: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  sendOtpToEmail: PropTypes.func,
  otpTimer: PropTypes.object,
  isSubmitting: PropTypes.bool,
  signUpSuccess: PropTypes.bool,
  errorPhone: PropTypes.string,
  errorEmail: PropTypes.string,
  errorPassword: PropTypes.string,
  enablePassword: PropTypes.bool,
  fields: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    fields: state.customer.fields,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
