/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.css';
import cx from 'classnames';
import PasswordField from '../PasswordField';
import OtpField from '../OtpField';
import LoadingOverlay from 'react-loading-overlay';
import { useSelector, useDispatch } from 'react-redux';

const Login = ({
  method,
  handleBackButtonClick,
  handleSubmit,
  handleChange,
  sendOtpToEmail,
  sendOtpToPhone,
  username,
  otpTimer,
  isSubmitting,
  enablePassword,
  enableSMSOTP,
  enableWhatsappOTP,
  enableOrdering,
}) => {
  const matches = useMediaQuery('(max-width:1200px)');
  const dispatch = useDispatch();
  const basketGuestCo = useSelector((state) => state.guestCheckoutCart.data);
  const history = useHistory();
  const { sendCounter, counterMinutes, counter, isSending } = otpTimer;
  const guestMode = localStorage.getItem('settingGuestMode');
  const idGuestCheckout = localStorage.getItem('idGuestCheckout');
  const isMatchesWithResponsive = matches ? '92vw' : '100%';
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingOverlay active={isLoading} spinner text='Loading...'>
      <div
        className='modal-content'
        style={{
          width: isMatchesWithResponsive,
        }}
      >
        <div
          className='modal-header'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <button
            type='button'
            className={cx('close', styles.backButton)}
            onClick={handleBackButtonClick}
          >
            <i className='fa fa-chevron-left'></i>
          </button>
          <h5 className={cx('modal-title', styles.modalTitle)}>
            {method === 'phone' ? 'Mobile Sign In' : 'Email Sign In'}
          </h5>
          <button
            type='button'
            disabled={!enableOrdering}
            className={cx('close', styles.closeButton)}
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>×</span>
          </button>
        </div>
        <div className='modal-body'>
          <p className='text-muted'>{`Sign in to ${username}`}</p>
          {enablePassword ? (
            <PasswordField handleChange={handleChange}></PasswordField>
          ) : (
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
          )}
          <Button
            disabled={isSubmitting}
            className='button'
            style={{
              width: '100%',
              marginTop: 10,
              borderRadius: 5,
              height: 50,
            }}
            onClick={() => {
              if (guestMode && idGuestCheckout) {
                setIsLoading(true);
                localStorage.removeItem('settingGuestMode');
                localStorage.removeItem('idGuestCheckout');
                handleSubmit(!enablePassword);
                history.push('/');
              } else {
                setIsLoading(true);
                handleSubmit(!enablePassword);
                setIsLoading(false);
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </LoadingOverlay>
  );
};

Login.defaultProps = {
  handleSubmit: null,
  handleChange: null,
  sendOtpToPhone: null,
  sendOtpToEmail: null,

  otpTimer: {},
  isSubmitting: false,
  enablePassword: false,
  enableSMSOTP: false,
  enableWhatsappOTP: false,
  enableOrdering: false,
};

Login.propTypes = {
  enableOrdering: PropTypes.bool,
  enablePassword: PropTypes.bool,
  enableSMSOTP: PropTypes.bool,
  enableWhatsappOTP: PropTypes.bool,
  handleBackButtonClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  method: PropTypes.oneOf(['phone', 'email']).isRequired,
  otpTimer: PropTypes.object,
  sendOtpToEmail: PropTypes.func,
  sendOtpToPhone: PropTypes.func,
  username: PropTypes.string.isRequired,
};

export default Login;
