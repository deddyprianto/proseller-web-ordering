import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { Input, Button } from 'reactstrap';
import CheckBox from '../../setting/checkBoxCostume';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';
import PasswordField from '../PasswordField';

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
  const showLoadingOnModal = useSelector(
    (state) => state.customer.showLoadingOnModal
  );
  const initialCountry = 'SG';
  const [phoneCountryCode, setPhoneCountryCode] = useState('+65');
  const [phone, setPhone] = useState('');
  const [agreeTC, setAgreeTC] = useState(true);

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

  return (
    <LoadingOverlayCustom active={showLoadingOnModal} spinner text='Loading...'>
      <div className='modal-body'>
        <p className='text-muted'>{`Register for ${email || '-'}`}</p>
        <p className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
          <label for='name'>
            Name <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='woocommerce-Input woocommerce-Input--text input-text'
            style={{ borderRadius: 5 }}
            onChange={(e) => handleChange('name', e.target.value)}
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
          <label for='name'>
            Phone Number <span className='required'>*</span>
          </label>
          <div className={styles.fieldGroup}>
            <div className={styles.phoneCountryCodeGroup}>
              <PhoneInput
                country={initialCountry}
                value={phoneCountryCode}
                enableSearch={true}
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
            <label for='referral'>Referral Code</label>
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
                  for='exampleCheck1'
                  style={{ marginLeft: 10 }}
                >
                  I Agree to Terms & Conditions{' '}
                </label>
              </div>
            </div>
          </>
        )}
        <Button
          disabled={isSubmitting || agreeTC || !isTCAvailable}
          className='button'
          style={{ width: '100%', marginTop: 10, borderRadius: 5, height: 50 }}
          onClick={() => handleSubmit()}
        >
          Create Account
        </Button>
      </div>
    </LoadingOverlayCustom>
  );
};

EmailForm.propTypes = {
  email: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
  errorPassword: PropTypes.string,
  enablePassword: PropTypes.bool,
  invitationCode: PropTypes.string,
  isTCAvailable: PropTypes.bool,
  termsAndConditions: PropTypes.string,
};

export default EmailForm;
