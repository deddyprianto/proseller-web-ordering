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
import LoadingOverlay from 'react-loading-overlay';
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
  const initialCountry = (companyInfo && companyInfo.countryCode) || 'SG';
  const initialCodePhone = '+65';
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [valueSearchCode, setValueSearchCode] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
    setValueSearchCode('');
  };

  useEffect(() => {
    const isGuestMode = localStorage.getItem('settingGuestMode');
    if (isGuestMode === 'GuestMode') {
      dispatch({ type: CONSTANT.SAVE_GUESTMODE_STATE, payload: isGuestMode });
    }
  }, [localStorage.getItem('settingGuestMode')]);

  useEffect(() => {
    if (initialCountry === 'ID') setPhoneCountryCode('+62');

    handleChange(
      method === 'phone' ? 'phoneNumber' : 'email',
      method === 'phone' ? phoneCountryCode + value : value
    );
  }, [value, phoneCountryCode, companyInfo]);

  useEffect(() => {
    if (document.querySelector('#phoneInput')) {
      document
        .querySelector('#phoneInput')
        .addEventListener('keypress', (evt) => {
          if (
            (evt.which != 8 && evt.which != 0 && evt.which < 48) ||
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
          }}
        >
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
                  {phoneCountryCode}
                  <img src={iconDown} style={{ marginLeft: '10px' }} />
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
                    <img src={search} style={{ marginRight: '10px' }} />
                  </div>
                  {filteredPhoneCode.map((item, i) => {
                    const getPhoneCodeFromStr = item.substring(
                      item.indexOf(':') + 1
                    );
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
                          style={{
                            padding: '0px 0px 7px 0px',
                            margin: 0,
                            cursor: 'pointer',
                            color: valueSearchCode
                              ? 'black'
                              : i === 0
                              ? backgroundTheme.primary
                              : 'black',
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
              id='phoneInput'
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
            Use Email Address to Login / Register
          </div>
        )}
      </>
    );
  };

  const renderEmail = () => {
    return (
      <>
        <div>
          <label htmlFor='email' style={{ fontSize: '14px' }}>
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
              onChange={(e) => {
                const regEmail = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                console.log('dedd =>', regEmail.test(e.target.value));
                setValue(e.target.value);
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
            handleEmailCheck();
          }}
        >
          Next
        </Button>
        {loginByMobile && (
          <div
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
    if (isOfflineCart) {
      return true;
    } else {
      return false;
    }
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
      }).then((res) => {
        if (res.isConfirmed) {
          if (location.pathname === '/outlets') {
            history.push('/outlets');
          } else if (location.pathname === '/') {
            history.push('/');
          } else {
            history.push('/cartguestcheckout');
          }
        }
      });
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
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '20px',
          paddingLeft: '15px',
        }}
      >
        <h5
          style={{ fontSize: '24px', fontWeight: 500 }}
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
        <p style={{ fontSize: '14px', color: '#8D8D8D' }}>
          {`To Login or Register, please enter your ${
            method === 'phone' ? 'Phone number' : 'Email'
          }.`}
        </p>
      </div>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 'min(1280px, 100% - 30px)',
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
