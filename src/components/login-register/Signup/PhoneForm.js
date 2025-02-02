import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import PasswordField from '../PasswordField';
import CheckBox from '../../setting/checkBoxCostume';
import { useSelector } from 'react-redux';
import { isEmptyArray } from 'helpers/CheckEmpty';

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
  const isCustomFieldHaveValue = useSelector(
    (state) => state.customer.isCustomFieldHaveValue
  );
  const isAllFieldHasBeenFullFiled = useSelector(
    (state) => state.customer.isAllFieldHasBeenFullFiled
  );
  const [agreeTC, setAgreeTC] = useState(false);
  const orderState = useSelector((state) => state.order.setting);

  const [userNameValue, setUserNameValue] = useState("");
  const [userEmailValue, setUserEmailValue] = useState("");
  const [settingFilterEmail] = orderState.filter(
    (setting) => setting.settingKey === "RegistrationEmailMandatory"
  );

  //TODO: this is not the best practice and must be removed when backend is ready.

  if (
    termsAndConditions === undefined ||
    termsAndConditions === null ||
    termsAndConditions === ""
  ) {
    isTCAvailable = false;
  }

  const renderEmailTextRequired = () => {
    if (settingFilterEmail?.settingValue) {
      return (
        <div>
          Email <span className="required">*</span>
        </div>
      );
    } else {
      return "Email";
    }
  };
  const handleDisabelButtonForTNC = () => {
    const emailNotRequired = settingFilterEmail?.settingValue === false;
    const emailFulfilled = userEmailValue || emailNotRequired;

    if (!isEmptyArray(isCustomFieldHaveValue)) {
      const customField = isCustomFieldHaveValue.every((item) => {
        if (item.mandatory) {
          return item.children
            ? item.children.every(
                (child) => isAllFieldHasBeenFullFiled[child.fieldName]
              )
            : isAllFieldHasBeenFullFiled[item.fieldName];
        } else {
          return true;
        }
      });
      const isAllFieldMandatoryFullfilled =
        agreeTC &&
        isTCAvailable &&
        userNameValue &&
        emailFulfilled &&
        customField;

      if (isAllFieldMandatoryFullfilled) {
        return false;
      } else {
        return true;
      }
    } else {
      const isAllFieldMandatoryFullfilled =
        agreeTC && isTCAvailable && userNameValue && emailFulfilled;

      if (isAllFieldMandatoryFullfilled) {
        return false;
      } else {
        return true;
      }
    }
  };

  const renderEmailInput = () => {
    return (
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="email">{renderEmailTextRequired()}</label>
        <input
          id="email-input"
          type="email"
          className="woocommerce-Input woocommerce-Input--text input-text"
          style={{ borderRadius: 5 }}
          onChange={(e) => {
            handleChange("email", e.target.value, true);
            setUserEmailValue(e.target.value);
          }}
        />
        {error !== "" && (
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              color: "red",
              lineHeight: "15px",
            }}
          >
            {error}
          </div>
        )}
      </p>
    );
  };
  const handleDisabelButton = () => {
    const emailNotRequired = settingFilterEmail?.settingValue === false;
    const emailFulfilled = userEmailValue || emailNotRequired;

    const iSAllPassed = userNameValue && emailFulfilled ? false : true;
    if (isTCAvailable) {
      return agreeTC;
    } else {
      return iSAllPassed || isSubmitting;
    }
  };

  return (
    <div className="modal-body">
      <p className="text-muted">{`Register for ${phoneNumber || "-"}`}</p>
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="name">
          Name <span className="required">*</span>
        </label>
        <input
          id="name-phone-input"
          type="text"
          className="woocommerce-Input woocommerce-Input--text input-text"
          style={{ borderRadius: 5 }}
          onChange={(e) => {
            handleChange("name", e.target.value, true);
            setUserNameValue(e.target.value);
          }}
        />
        {errorName !== "" && (
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              color: "red",
              lineHeight: "15px",
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
        <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
          <label for="referral">Referral Code</label>
          <input
            type="text"
            value={invitationCode}
            disabled
            className="woocommerce-Input woocommerce-Input--text input-text"
            style={{ borderRadius: 5 }}
            onChange={(e) => handleChange("referral", e.target.value, true)}
          />
        </p>
      )}
      {isTCAvailable && (
        <>
          <div style={{ marginTop: "2rem" }}>
            <div
              className="card card-body"
              style={{ textAlign: "justify", fontSize: 11 }}
            >
              <textarea
                rows={10}
                readOnly
                style={{ backgroundColor: "#F8F8F8" }}
              >
                {termsAndConditions}
              </textarea>
            </div>
          </div>
          <div
            onClick={() => setAgreeTC(!agreeTC)}
            className="form-group form-check"
            style={{ marginTop: 5 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                id="tnc-checkbox"
                className="form-check-input"
                handleChange={() => setAgreeTC(!agreeTC)}
                selected={agreeTC}
                setRadius={5}
                setHeight={20}
              />
              <label
                className="form-check-label"
                for="exampleCheck1"
                style={{ marginLeft: 10 }}
              >
                I Agree to Terms & Conditions{" "}
              </label>
            </div>
          </div>
        </>
      )}
      {isTCAvailable ? (
        <Button
          id="create-account-button"
          disabled={handleDisabelButtonForTNC()}
          className="button"
          style={{
            width: "100%",
            marginTop: 10,
            borderRadius: 5,
            height: 50,
          }}
          onClick={handleSubmit}
        >
          Create Account
        </Button>
      ) : (
        <Button
          id="create-account-button"
          disabled={handleDisabelButton()}
          className="button"
          style={{
            width: "100%",
            marginTop: 10,
            borderRadius: 5,
            height: 50,
          }}
          onClick={handleSubmit}
        >
          Create Account
        </Button>
      )}
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
