/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import IconButton from '../../../assets/images/VectorButton.png';
import PhoneInput from 'react-phone-input-2';
import cx from 'classnames';
import LoadingOverlay from 'react-loading-overlay';

import styles from './styles.module.css';

const Portal = ({
  method,
  handleMethodChange,
  handlePhoneCheck,
  handleEmailCheck,
  handleChange,
  error,
  isSubmitting,
  enableOrdering,
  companyInfo,
  color,
  loginByMobile,
  loginByEmail,
  settingGuessCheckout,
}) => {
  const initialCountry = (companyInfo && companyInfo.countryCode) || 'SG';
  const initialCodePhone = '+65';

  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialCountry === 'ID') setPhoneCountryCode('+62');

    handleChange(
      method === 'phone' ? 'phoneNumber' : 'email',
      method === 'phone' ? phoneCountryCode + value : value
    );
  }, [value, phoneCountryCode, companyInfo]);

  useEffect(() => {
    setValue('');
  }, [method]);

  const renderPhone = () => {
    return (
      <>
        <div className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
          <label htmlFor='email'>
            Enter your Mobile Number
            <span className='required'>*</span>
          </label>
          <div
            className={styles.fieldGroup}
            style={{
              border: '1px solid rgba(141, 141, 141, 0.44)',
              borderRadius: '7px',
            }}
          >
            <div
              style={{
                width: '40%',
                border: 0,
                borderRadius: 0,
              }}
            >
              <PhoneInput
                country={initialCountry}
                value={phoneCountryCode}
                enableSearch
                autoFormat={false}
                onChange={(e) => {
                  setPhoneCountryCode(`+${e}`);
                }}
                containerStyle={{
                  border: 0,
                  borderRadius: 0,
                  outline: 0,
                }}
                buttonStyle={{
                  border: 'none',
                  backgroundColor: 'transparent',
                }}
                onKeyDown={() => document.getElementById('phoneInput').focus()}
                disableSearchIcon
                inputStyle={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: '#F2F2F2',
                  borderLeft: '7px',
                  ':focus': {
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                  },
                }}
                dropdownStyle={{
                  color: '#808080',
                }}
              />
            </div>
            <input
              id='phoneInput'
              value={value}
              placeholder='Phone Number'
              style={{
                height: '40px',
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
              }}
              onChange={(e) => {
                setValue(e.target.value.replace(/[^0-9]/g, ''));
              }}
            ></input>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Button
          disabled={isSubmitting}
          className={cx('button', styles.submitButton)}
          onClick={() => {
            setIsLoading(true);
            handlePhoneCheck();
          }}
        >
          Next
        </Button>
        {loginByEmail && (
          <div
            className={cx('modal-title', styles.switchMethodButton)}
            onClick={() => handleMethodChange('email')}
          >
            Use Email Address to Sign In / Sign Up
          </div>
        )}
      </>
    );
  };

  const renderEmail = () => {
    return (
      <>
        <div>
          <label htmlFor='email'>
            Enter your Email Address
            <span className='required'>*</span>
          </label>
          <div className={styles.fieldGroup}>
            <input
              type='email'
              value={value}
              className={cx(
                'woocommerce-Input woocommerce-Input--text input-text',
                styles.emailField
              )}
              onChange={(e) => setValue(e.target.value)}
            ></input>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Button
          disabled={isSubmitting}
          className={cx('button', styles.submitButton)}
          onClick={() => handleEmailCheck()}
        >
          Next
        </Button>
        {loginByMobile && (
          <div
            className={cx('modal-title', styles.switchMethodButton)}
            onClick={() => handleMethodChange('phone')}
          >
            Use Mobile Number to Sign In / Sign Up
          </div>
        )}
      </>
    );
  };

  const handleRenderByMethod = (key) => {
    if (key === 'phone') {
      return renderPhone();
    }
    return renderEmail();
  };

  return (
    <LoadingOverlay active={isLoading} spinner text='Loading...'>
      <div
        className='modal-content'
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <div className={cx('modal-header', styles.modalHeader)}>
          <h5 style={{ fontSize: '16px', color: '#4386A1' }}>
            {method === 'phone' ? 'Mobile' : 'Email'} Log In / Sign Up
          </h5>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-label='Close'
            disabled={!enableOrdering}
            style={{
              position: 'absolute',
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden='true' className={styles.closeButton}>
              ×
            </span>
          </button>
        </div>

        <div className='modal-body'>{handleRenderByMethod(method)}</div>
        {settingGuessCheckout === 'GuestMode' && (
          <>
            <hr style={{ opacity: 0.5, marginTop: '15px' }} />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => {
                  localStorage.setItem(
                    'settingGuestMode',
                    settingGuessCheckout
                  );
                  window.location.reload();
                }}
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  padding: '8px',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontSize: '14px',
                  backgroundColor: '#4386A133',
                  color: '#4386A1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '70%',
                }}
                className={styles.myFont}
              >
                <span>
                  <img src={IconButton} width={14.4} height={19.2} />
                </span>
                <div style={{ marginLeft: '5px' }}>Guest Checkout</div>
              </button>
            </div>
          </>
        )}
      </div>
    </LoadingOverlay>
  );
};

Portal.defaultProps = {
  handleMethodChange: null,
  handleChange: null,
  handleEmailCheck: null,
  handlePhoneCheck: null,
  error: '',
  isSubmitting: false,
  enableOrdering: false,
  companyInfo: {},
  color: '',
  loginByMobile: false,
  loginByEmail: false,
};

Portal.propTypes = {
  color: PropTypes.string,
  companyInfo: PropTypes.object,
  enableOrdering: PropTypes.bool,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleEmailCheck: PropTypes.func,
  handleMethodChange: PropTypes.func,
  handlePhoneCheck: PropTypes.func,
  isSubmitting: PropTypes.bool,
  loginByEmail: PropTypes.bool,
  loginByMobile: PropTypes.bool,
  method: PropTypes.oneOf(['phone', 'email']).isRequired,
};

export default Portal;
