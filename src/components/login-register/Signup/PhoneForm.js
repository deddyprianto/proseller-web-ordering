import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import PasswordField from '../PasswordField';
import CheckBox from '../../setting/checkBoxCostume';
import { useSelector } from 'react-redux';

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
  isTCAvailable,
  termsAndConditions,
  invitationCode,
}) => {
  const [agreeTC, setAgreeTC] = useState(true);
  const orderState = useSelector((state) => state.order.setting);

  const [settingFilterEmail] = orderState.filter(
    (setting) => setting.settingKey === 'RegistrationEmailMandatory'
  );

  //TODO: this is not the best practice and must be removed when backend is ready.

  if (
    termsAndConditions === undefined ||
    termsAndConditions === null ||
    termsAndConditions === ''
  ) {
    isTCAvailable = false;
  }

  const renderEmailTextRequired = () => {
    if (settingFilterEmail?.settingValue) {
      return (
        <div>
          Email <span className='required'>*</span>
        </div>
      );
    } else {
      return 'Email';
    }
  };

  const renderEmailInput = () => {
    return (
      <p className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
        <label for='email'>{renderEmailTextRequired()}</label>
        <input
          type='email'
          className='woocommerce-Input woocommerce-Input--text input-text'
          style={{ borderRadius: 5 }}
          onChange={(e) => handleChange('email', e.target.value, true)}
        />
        {error !== '' && (
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              color: 'red',
              lineHeight: '15px',
            }}
          >
            {error}
          </div>
        )}
      </p>
    );
  };

  return (
    <div className='modal-body'>
      <p className='text-muted'>{`Register for ${phoneNumber || '-'}`}</p>
      <p className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'>
        <label for='name'>
          Name <span className='required'>*</span>
        </label>
        <input
          type='text'
          className='woocommerce-Input woocommerce-Input--text input-text'
          style={{ borderRadius: 5 }}
          onChange={(e) => handleChange('name', e.target.value, true)}
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
      {renderEmailInput()}
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
        disabled={isSubmitting}
        className='button'
        style={{ width: '100%', marginTop: 10, borderRadius: 5, height: 50 }}
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
  termsAndConditions: PropTypes.string,
  isTCAvailable: PropTypes.bool,
  invitationCode: PropTypes.string,
};

export default PhoneForm;
