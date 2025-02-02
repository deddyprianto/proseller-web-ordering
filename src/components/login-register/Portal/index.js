import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory, useLocation } from 'react-router-dom';
import countryCodes from 'country-codes-list';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '../../../assets/images/VectorButton.png';
import iconDown from '../../../assets/images/IconDown.png';
import Swal from 'sweetalert2';
import styles from './styles.module.css';
import { OrderAction } from 'redux/actions/OrderAction';
import config from 'config';
import search from 'assets/images/search.png';
import SearchInput, { createFilter } from 'react-search-input';
import { CONSTANT } from 'helpers';

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
  const dispatch = useDispatch();
  const backgroundTheme = useSelector((state) => state.theme.color);
  const history = useHistory();
  const location = useLocation();
  const mode = useSelector((state) => state.guestCheckoutCart.mode);
  const matches = useMediaQuery('(max-width:1200px)');
  const initialCountry = companyInfo?.countryCode || 'SG';
  const initialCodePhone = '+65';
  const [value, setValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [valueSearchCode, setValueSearchCode] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
    setValueSearchCode('');
  };
  const isGuestMode = localStorage.getItem('settingGuestMode');

  useEffect(() => {
    if (isGuestMode === 'GuestMode') {
      dispatch({ type: CONSTANT.SAVE_GUESTMODE_STATE, payload: isGuestMode });
    }
  }, [isGuestMode, dispatch]);

  useEffect(() => {
    if (initialCountry === 'ID') {
      setPhoneCountryCode('+62');
    }

    handleChange(
      method === 'phone' ? 'phoneNumber' : 'email',
      method === 'phone' ? phoneCountryCode + value : value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, phoneCountryCode, companyInfo]);

  useEffect(() => {
    if (document.querySelector('#phone-number-input')) {
      document
        .querySelector('#phone-number-input')
        .addEventListener('keypress', (evt) => {
          if (
            (evt.which !== 8 && evt.which !== 0 && evt.which < 48) ||
            evt.which > 57
          ) {
            evt.preventDefault();
          }
        });
    }
    setValue('');
  }, [method]);

  const myCountryCodesObject = countryCodes.customList(
    'countryCode',
    '{countryNameEn}: +{countryCallingCode}'
  );

  const optionCodePhone = Object.keys(myCountryCodesObject).map(
    (key) => myCountryCodesObject[key]
  );

  optionCodePhone.sort((a, b) => {
    let item = a.substring(a.indexOf(':') + 2);
    if (item === phoneCountryCode) {
      return -1;
    } else {
      return 1;
    }
  });

  const filteredPhoneCode = optionCodePhone.filter(
    createFilter(valueSearchCode)
  );

  const renderPhone = () => {
    return (
      <>
        <div
          style={{
            width: '100%',
            padding: '16px',
            paddingBottom: error ? '0px' : '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'black' }}>
              Enter your Phone Number
            </div>
            <div style={{ color: 'red', fontSize: '16px', marginLeft: '3px' }}>
              *
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              border: '1px solid rgba(141, 141, 141, 0.44)',
              borderRadius: '7px',
              boxShadow:
                '0px 0px 0.2px rgba(0, 0, 0, 0.02),\n  0px 0px 0.5px rgba(0, 0, 0, 0.028),\n  0px 0px 0.9px rgba(0, 0, 0, 0.035),\n  0px 0px 1.6px rgba(0, 0, 0, 0.042),\n  0px 0px 2.9px rgba(0, 0, 0, 0.05),\n  0px 0px 7px rgba(0, 0, 0, 0.07)',
            }}
          >
            <div style={{ width: '25%' }}>
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggle}
                direction='down'
                className={styles.dropDownMenu}
                size='100px'
              >
                <DropdownToggle
                  id='country-code-dropdown'
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: backgroundTheme.primary,
                  }}
                >
                  <div id='selected-country-code'>{phoneCountryCode}</div>
                  <img
                    src={iconDown}
                    style={{ marginLeft: '10px' }}
                    alt='ic_down'
                  />
                </DropdownToggle>
                <DropdownMenu
                  style={{
                    width: matches ? '80vw' : '27.5vw',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    height: '235px',
                    overflowY: 'auto',
                    marginTop: '5px',
                  }}
                >
                  <div
                    style={{
                      width: '97%',
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      justifyContent: 'space-between',
                      margin: '5px 0px',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <SearchInput
                        id='search-country-code-input'
                        placeholder='Search for country code'
                        style={{
                          width: '100%',
                          padding: '10px',
                          marginLeft: '5px',
                          border: 'none',
                          outline: 'none',
                        }}
                        onChange={(e) => setValueSearchCode(e)}
                      />
                    </div>
                    <img
                      src={search}
                      style={{ marginRight: '10px' }}
                      alt='search'
                    />
                  </div>
                  {filteredPhoneCode.map((item, i) => {
                    const getPhoneCodeFromStr = item.substring(
                      item.indexOf(':') + 1
                    );
                    let countryCodeOption = '';

                    const phoneCode = getPhoneCodeFromStr.split(' ')[1];
                    if (phoneCode === '+65') {
                      countryCodeOption = 'country-code-singapore-option';
                    } else if (phoneCode === '+62') {
                      countryCodeOption = 'country-code-indonesia-option';
                    }
                    // refactor code for input search result in code phone numeber
                    let colorPhoneSelected;

                    if (valueSearchCode) {
                      colorPhoneSelected = 'black';
                    } else if (i === 0) {
                      colorPhoneSelected = backgroundTheme.primary;
                    } else {
                      colorPhoneSelected = 'black';
                    }
                    return (
                      <DropdownItem
                        style={{
                          cursor: 'pointer',
                          fontFamily: 'Plus Jakarta Sans',
                          color: 'black',
                          fontWeight: 500,
                          fontSize: '16px',
                          padding: '5px 0 0 0',
                          margin: 0,
                          opacity: 0.9,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        header
                        key={item}
                      >
                        <p
                          id={countryCodeOption}
                          style={{
                            padding: '0px 0px 7px 0px',
                            margin: 0,
                            cursor: 'pointer',
                            color: colorPhoneSelected,
                          }}
                          onClick={() => {
                            setPhoneCountryCode(
                              getPhoneCodeFromStr.split(' ')[1]
                            );
                            setDropdownOpen(false);
                          }}
                        >
                          {item}
                        </p>
                        <hr style={{ width: '95%' }} />
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </div>
            <input
              id='phone-number-input'
              value={value}
              type='number'
              placeholder='Phone Number'
              className={styles.phoneField}
              onChange={(e) => {
                setValue(e.target.value.replace(/[^0-9]/g, ''));
              }}
            ></input>
          </div>
        </div>
        {error && (
          <div
            style={{
              padding: '5px 16px',
              color: 'red',
            }}
          >
            <div>{error}</div>
          </div>
        )}

        <hr
          style={{
            backgroundColor: '#B8B8B8',
            opacity: 0.5,
            padding: '0px',
            margin: '0px',
          }}
        />
        <div
          style={{
            padding: '16px',
            paddingBottom: '0px',
            paddingTop: '0px',
          }}
        >
          <Button
            id='next-signup-login-button'
            disabled={isSubmitting}
            className={cx('button', styles.submitButton)}
            onClick={() => {
              handlePhoneCheck();
            }}
          >
            Next
          </Button>
        </div>

        {loginByEmail && (
          <div
            id='change-login-method-button'
            className={cx('modal-title', styles.switchMethodButton)}
            onClick={() => handleMethodChange('email')}
          >
            Use Email Address to Login / Register
          </div>
        )}
      </>
    );
  };

  const renderEmail = () => {
    return (
      <>
        <div
          style={{
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'black' }}>
              Enter your Email Address
            </div>
            <div style={{ color: 'red', fontSize: '16px', marginLeft: '3px' }}>
              *
            </div>
          </div>
          <input
            placeholder='Email'
            id='email-address-input'
            type='email'
            value={value}
            className={styles.emailField}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: '5px 16px',
              color: 'red',
            }}
          >
            <div>{error}</div>
          </div>
        )}

        <hr
          style={{
            backgroundColor: '#B8B8B8',
            opacity: 0.5,
            padding: '0px',
            margin: '0px',
            marginTop: error ? '0px' : '20px',
          }}
        />
        <div
          style={{
            padding: '16px',
            paddingBottom: '0px',
            paddingTop: '0px',
          }}
        >
          <Button
            id='next-signup-login-email-button'
            disabled={isSubmitting}
            className={cx('button', styles.submitButton)}
            onClick={() => {
              handleEmailCheck();
            }}
          >
            Next
          </Button>
        </div>

        {loginByMobile && (
          <div
            id='change-login-method-button'
            className={cx('modal-title', styles.switchMethodButton)}
            onClick={() => handleMethodChange('phone')}
          >
            Use Phone Number to Login / Register
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
  const handleMergeOfflineCart = () => {
    const isOfflineCart = JSON.parse(
      localStorage.getItem(`${config.prefix}_offlineCart`)
    );
    return !!isOfflineCart;
  };

  const handleGuestCheckoutMode = async () => {
    const idGuestCheckout = uuidv4();
    if (!mode) {
      localStorage.setItem('settingGuestMode', settingGuessCheckout);
      localStorage.setItem('idGuestCheckout', idGuestCheckout);
      if (handleMergeOfflineCart()) {
        Swal.showLoading();
        await dispatch(
          OrderAction.addOfflineCartToGuestModeCart(idGuestCheckout)
        );
        Swal.hideLoading();
      }
      Swal.fire({
        icon: 'info',
        iconColor: '#333',
        title: 'You are currently using guest checkout mode',
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: backgroundTheme.primary,
        customClass: {
          confirmButton: styles.buttonSweetAlert,
          icon: styles.customIconColor,
        },
      });

      if (location.pathname === '/outlets') {
        history.push('/outlets');
      } else if (location.pathname === '/') {
        history.push('/');
      } else {
        history.push('/cartguestcheckout');
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'You are currently using guest checkout mode',
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: backgroundTheme.primary,
        customClass: {
          confirmButton: styles.buttonSweetAlert,
          icon: styles.customIconColor,
        },
        iconColor: '#000',
      });
    }
  };

  return (
    <div
      className='modal-content'
      style={{
        justifyContent: 'center',
        width: matches ? '90vw' : '30vw',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '16px',
          paddingBottom: '0px',
        }}
      >
        <h5
          style={{ fontSize: '24px', fontWeight: 700, color: 'black' }}
          className={cx('modal-title', styles.modalTitle)}
        >
          Welcome!
        </h5>
        {location.pathname !== '/cart' && (
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
        )}
        <p
          style={{
            fontSize: '14px',
            color: '#8D8D8D',
            fontWeight: 500,
            padding: 0,
            margin: 0,
            lineHeight: 'normal',
          }}
        >
          {`to Login or Register, please enter your ${
            method === 'phone' ? 'Phone number' : 'Email'
          }.`}
        </p>
      </div>

      <div
        style={{
          width: '100%',
        }}
      >
        {handleRenderByMethod(method)}
        {settingGuessCheckout === 'GuestMode' && (
          <>
            <hr style={{ opacity: 0.5, marginTop: '25px' }} />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <button
                aria-label='Close'
                data-dismiss='modal'
                onClick={handleGuestCheckoutMode}
                style={{
                  marginBottom: '10px',
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
                  <img
                    src={IconButton}
                    width={14.4}
                    height={19.2}
                    alt='ic_button'
                  />
                </span>
                <div style={{ marginLeft: '5px' }}>Guest Checkout</div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
