import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { Input, Button } from 'reactstrap';
import CheckBox from '../../setting/checkBoxCostume';
import LoadingOverlay from 'react-loading-overlay';

import styles from './styles.module.css';
import PasswordField from '../PasswordField';
import { useDispatch } from 'react-redux';

const EmailForm = ({
  email,
  handleSubmit,
  handleChange,
  isSubmitting,
  errorPassword,
  enablePassword,
  errorName,
  error,
  children,
  invitationCode,
  color,
  isTCAvailable,
  termsAndConditions,
}) => {
  const dispatch = useDispatch();
  const initialCountry = 'SG';
  const [phoneCountryCode, setPhoneCountryCode] = useState('+65');
  const [phone, setPhone] = useState('');
  const [agreeTC, setAgreeTC] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nameValue, setNameValue] = useState('');
  useEffect(() => {
    if (phone) {
      handleChange('phoneNumber', phoneCountryCode + phone);
    }
  }, [phone, phoneCountryCode]);

  if (
    termsAndConditions === undefined ||
    termsAndConditions === null ||
    termsAndConditions === ''
  ) {
    isTCAvailable = false;
  }

  const handleDisabelButton = () => {
    const iSAllPassed = nameValue && phone ? false : true;
    if (isTCAvailable) {
      return agreeTC;
    } else {
      return iSAllPassed || isSubmitting;
    }
  };

  return (
    <LoadingOverlay active={isLoading} spinner text='Loading...'>
      <div className='modal-body'>
        <p className='text-muted'>{`Register for ${email || '-'}`}</p>
        <p className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
          <label htmlFor='name'>
            Name <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='woocommerce-Input woocommerce-Input--text input-text'
            style={{ borderRadius: 5 }}
            onChange={(e) => {
              handleChange('name', e.target.value);
              setNameValue(e.target.value);
            }}
          />
          {errorName !== '' && (
            <div
              style={{
                marginTop: 5,
                marginBottom: 5,
                color: 'red',
                lineHeight: '15px',
              }}
            >
              {errorName}
            </div>
          )}
        </p>

        <div className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
          <label htmlFor='name'>
            Phone Number <span className='required'>*</span>
          </label>
          <div className={styles.fieldGroup}>
            <div className={styles.phoneCountryCodeGroup}>
              <PhoneInput
                country={initialCountry}
                value={phoneCountryCode}
                enableSearch
                autoFormat={false}
                onChange={(e) => {
                  setPhoneCountryCode(`+${e}`);
                }}
                onKeyDown={() => document.getElementById('phoneInput').focus()}
                disableSearchIcon
                inputStyle={{
                  width: 0,
                  border: `1px solid ${color}`,
                  backgroundColor: color,
                  height: 40,
                  outline: 'none',
                  boxShadow: 'none',
                }}
                dropdownStyle={{
                  color: '#808080',
                }}
              ></PhoneInput>
              <div className={styles.phoneCountryCode}>{phoneCountryCode}</div>
            </div>
            <Input
              id='phoneInput'
              className={styles.phoneField}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>
        {error === '' ? null : (
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              color: 'red',
              fontSize: 10,
              lineHeight: '15px',
            }}
          >
            {error}
          </div>
        )}
        {children}
        {enablePassword && (
          <PasswordField
            handleChange={handleChange}
            error={errorPassword}
          ></PasswordField>
        )}
        {invitationCode && (
          <p className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
            <label htmlFor='referral'>Referral Code</label>
            <input
              type='text'
              value={invitationCode}
              disabled
              className='woocommerce-Input woocommerce-Input--text input-text'
              style={{ borderRadius: 5 }}
              onChange={(e) => handleChange('referral', e.target.value, true)}
            />
          </p>
        )}
        {isTCAvailable && (
          <>
            <div style={{ marginTop: '2rem' }}>
              <div
                className='card card-body'
                style={{ textAlign: 'justify', fontSize: 11 }}
              >
                <textarea disabled rows={10}>
                  {termsAndConditions}
                </textarea>
              </div>
            </div>
            <div
              onClick={() => setAgreeTC(!agreeTC)}
              className='form-group form-check'
              style={{ marginTop: 5 }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <CheckBox
                  className='form-check-input'
                  handleChange={() => setAgreeTC(!agreeTC)}
                  selected={!agreeTC}
                  setRadius={5}
                  setHeight={20}
                />
                <label
                  className='form-check-label'
                  htmlFor='exampleCheck1'
                  style={{ marginLeft: 10 }}
                >
                  I Agree to Terms & Conditions{' '}
                </label>
              </div>
            </div>
          </>
        )}
        {isTCAvailable ? (
          <Button
            disabled={isSubmitting || agreeTC || !isTCAvailable}
            className='button'
            style={{
              width: '100%',
              marginTop: 10,
              borderRadius: 5,
              height: 50,
            }}
            onClick={() => {
              setIsLoading(true);
              handleSubmit().then((res) => {
                if (!res || !res.status || res.status === 'FAILED') {
                  setIsLoading(false);
                  dispatch({
                    type: 'IS_USER_COMPLETED_FILL_ALL_DATA',
                    data: true,
                  });
                }
              });
            }}
          >
            Create Account
          </Button>
        ) : (
          <Button
            disabled={handleDisabelButton()}
            className='button'
            style={{
              width: '100%',
              marginTop: 10,
              borderRadius: 5,
              height: 50,
            }}
            onClick={() => {
              setIsLoading(true);
              handleSubmit().then((res) => {
                if (!res || !res.status || res.status === 'FAILED') {
                  setIsLoading(false);
                  dispatch({
                    type: 'IS_USER_COMPLETED_FILL_ALL_DATA',
                    data: true,
                  });
                }
              });
            }}
          >
            Create Account
          </Button>
        )}
      </div>
    </LoadingOverlay>
  );
};


EmailForm.propTypes = {
  children: PropTypes.func,
  color: PropTypes.string,
  email: PropTypes.string,
  enablePassword: PropTypes.bool,
  error: PropTypes.string,
  errorName: PropTypes.string,
  errorPassword: PropTypes.string,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  invitationCode: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isTCAvailable: PropTypes.bool,
  termsAndConditions: PropTypes.string,
};

export default EmailForm;
