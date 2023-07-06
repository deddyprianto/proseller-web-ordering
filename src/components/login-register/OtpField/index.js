import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const OtpField = ({
  sendPhoneOtp,
  sendEmailOtp,
  isSending,
  handleChange,
  method,
  sendCounter,
  counterMinutes,
  counter,
  enableSMSOTP,
  enableWhatsappOTP
}) => {
  return (
    <div>
      {!enableSMSOTP && method === 'email' && (
        <Button
          id='resend-otp-button'
          disabled={isSending}
          className='button'
          style={{
            width: '100%',
            fontSize: 12,
            paddingLeft: 5,
            paddingRight: 5,
            height: 40,
            borderRadius: 5,
          }}
          onClick={() =>
            method === 'phone' ? sendPhoneOtp('SMSOTP') : sendEmailOtp()
          }
        >
          {sendCounter <= 2
            ? `${sendCounter >= 1 ? 'Resend' : 'Send'} OTP ${
                method === 'phone' ? 'via SMS' : 'via Email'
              }`
            : 'Get OTP via Email'}
        </Button>
      )}

      {enableSMSOTP && (
        <Button
          id='resend-otp-button'
          disabled={isSending}
          style={{
            width: '100%',
            fontSize: 14,
            paddingLeft: 5,
            paddingRight: 5,
            height: 42,
            borderRadius: 10,
            border: '1px solid #8A8D8E',
            backgroundColor: 'transparent',
            color: 'black',
            fontWeight: 500,
          }}
          onClick={() =>
            method === 'phone' ? sendPhoneOtp('SMSOTP') : sendEmailOtp()
          }
        >
          {sendCounter <= 2
            ? `${sendCounter >= 1 ? 'Resend' : 'Send'} OTP ${
                method === 'phone' ? 'via SMS' : 'via Email'
              }`
            : 'Get OTP via Email'}
        </Button>
      )}

      {enableWhatsappOTP &&
        ((enableSMSOTP && sendCounter <= 2) || !enableSMSOTP) &&
        method === 'phone' && (
          <Button
            id='resend-otp-button'
            disabled={isSending}
            className='button'
            style={{
              width: '100%',
              fontSize: 12,
              paddingLeft: 5,
              paddingRight: 5,
              height: 40,
              borderRadius: 5,
              backgroundColor: '#12950A',
              marginTop: 10,
            }}
            onClick={() =>
              method === 'phone' ? sendPhoneOtp('WhatsappOTP') : sendEmailOtp()
            }
          >
            {sendCounter <= 2
              ? `${sendCounter >= 1 ? 'Resend' : 'Send'} OTP ${
                  method === 'phone' ? 'via WhatsApp' : 'via Email'
                }`
              : 'Get OTP via Email'}
          </Button>
        )}
      {isSending && (
        <div
          style={{
            fontSize: 12,
            marginTop: 5,
            textAlign: 'center',
            fontWeight: 600,
            color: 'rgba(138, 141, 142, 1)',
          }}
        >{`Resend after ${counterMinutes}:${counter}`}</div>
      )}
      <hr
        style={{
          backgroundColor: 'rgba(141, 141, 141, 1)',
          opacity: 0.3,
          margin: '10px 0px',
        }}
      />
      <label
        for='txtOtp'
        style={{ fontWeight: 500, fontSize: '16px', color: 'black' }}
      >
        Enter 4 digit OTP <span className='required'>*</span>
      </label>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input
          id='otp-input'
          type='text'
          pattern='[0-9]*'
          inputmode='numeric'
          className='woocommerce-Input woocommerce-Input--text input-text'
          style={{
            border: '1px solid #8A8D8E',
            height: 42,
            width: '100%',
            borderRadius: 10,
            textAlign: 'center',
          }}
          onChange={(e) => handleChange('txtOtp', e.target.value)}
        />
      </div>
      <hr
        style={{
          backgroundColor: 'rgba(141, 141, 141, 1)',
          opacity: 0.3,
          margin: '16px 0px',
        }}
      />
    </div>
  );
};

OtpField.propTypes = {
  method: PropTypes.oneOf(["phone", "email"]),
  handleChange: PropTypes.func,
  sendCounter: PropTypes.number,
  counterMinutes: PropTypes.string,
  counter: PropTypes.string,
  isSending: PropTypes.bool,
  sendEmailOtp: PropTypes.func,
  sendPhoneOtp: PropTypes.func,
};

export default OtpField;
