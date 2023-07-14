import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import OtpField from '../OtpField';

const SignUpSuccess = ({
  method,
  username,
  handleLogin,
  sendOtpToEmail,
  sendOtpToPhone,
  isSending,
  handleChange,
  sendCounter,
  counterMinutes,
  counter,
  usePassword,
  enableSMSOTP,
  enableWhatsappOTP,
  isLoading,
}) => {
  const [showOtp, setShowOtp] = useState(false);

  const guestMode = localStorage.getItem('settingGuestMode');
  const idGuestCheckout = localStorage.getItem('idGuestCheckout');

  return (
    <div className='modal-body'>
      {showOtp ? (
        <div>
          <p style={{ fontWeight: 500 }}>
            Sign in to{' '}
            <span style={{ fontWeight: 'bold' }}>{username || '-'}</span>
          </p>
          <OtpField
            method={method}
            sendEmailOtp={sendOtpToEmail}
            sendPhoneOtp={sendOtpToPhone}
            handleChange={handleChange}
            sendCounter={sendCounter}
            counterMinutes={counterMinutes}
            counter={counter}
            isSending={isSending}
            enableSMSOTP={enableSMSOTP}
            enableWhatsappOTP={enableWhatsappOTP}
          ></OtpField>
        </div>
      ) : (
        <div>
          <p className='font-color-theme' style={{ textAlign: 'center' }}>
            You will receive 4-digit verification code via{' '}
            {method === 'phone' ? 'SMS' : 'Email'} at
          </p>
          {method === 'phone' ? (
            <h2
              className='font-color-theme'
              style={{ textAlign: 'center', marginTop: 10 }}
            >
              {username || '-'}
            </h2>
          ) : (
            <h4
              className='font-color-theme'
              style={{ textAlign: 'center', marginTop: 10 }}
            >
              {username || '-'}
            </h4>
          )}
        </div>
      )}

      <Button
        id='continue-button'
        className='button'
        style={{
          width: '100%',
          marginTop: 10,
          borderRadius: 5,
          height: 50,
        }}
        onClick={async () => {
          if (usePassword) {
            handleLogin(!usePassword);
          } else if (!showOtp) {
            setShowOtp(true);
          } else {
            await handleLogin(true);

            if (guestMode && idGuestCheckout) {
              localStorage.removeItem('settingGuestMode');
              localStorage.removeItem('idGuestCheckout');
            }
          }
        }}
      >
        Continue
      </Button>
    </div>
  );
};
SignUpSuccess.propTypes = {
  username: PropTypes.string,
  handleLogin: PropTypes.func,
  sendOtpToEmail: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  handleChange: PropTypes.func,
  isSending: PropTypes.bool,
  sendCounter: PropTypes.number,
  counterMinutes: PropTypes.string,
  counter: PropTypes.string,
  usePassword: PropTypes.bool,
};

export default SignUpSuccess;
