/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css';
import { connect } from 'react-redux';
import generate from 'password-generation';
import { AuthActions } from '../../redux/actions/AuthAction';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import Login from './Login';
import Portal from './Portal';
import SignUp from './Signup';

import { lsLoad, lsStore } from '../../helpers/localStorage';

import config from '../../config';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { CONSTANT } from 'helpers';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const Swal = require('sweetalert2');

let max_retries = 0;

const reducer = 'masterdata';

const mapStateToProps = (state) => ({
  companyInfo: state[reducer].companyInfo.data,
  fetchingCompanyInfo: state[reducer].companyInfo.isFetching,
  companyInfoError: state[reducer].companyInfo.errors,
  fields: state.customer.fields,
  setting: state.order.setting,
  color: state.theme.color,
  defaultPhoneNumber: state.customer.defaultPhoneNumber,
  defaultEmail: state.customer.defaultEmail,
  referralCode: state.auth.invitationCode,
  orderingSetting: state.order.orderingSetting,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const LoginRegister = (props) => {
  const [method, setMethod] = useState('phone' || props.defaultEmail);
  const [userStatus, setUserStatus] = useState('NOT_CHECKED');
  const [payloadResponse, setPayloadResponse] = useState({});
  const [guessCheckout, setGuessCheckout] = useState();
  const [btnSend, setBtnSend] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [counter, setCounter] = useState('00');
  const [counterMinutes, setCounterMinutes] = useState('00');
  const [sendCounter, setSendCounter] = useState(0);
  const [txtOtp, setTxtOtp] = useState('');
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState(props.defaultEmail || '');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(
    props.defaultPhoneNumber || ''
  );

  const [enableRegisterWithPassword, setEnableRegisterWithPassword] =
    useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [loginByMobile, setLoginByMobile] = useState(false);
  const [loginByEmail, setLoginByEmail] = useState(false);
  const [enableSMSOTP, setEnableSMSOTP] = useState(false);
  const [enableWhatsappOTP, setEnableWhatsappOTP] = useState(false);
  const [enableOrdering, setEnableOrdering] = useState(false);
  const [minimumAge, setMinimumAge] = useState(null);

  const [errorName, setErrorName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  //   const [errorBirthdate, setErrorBirthDate] = useState("");
  const [errorPhone, setErrorPhone] = useState('');
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrorPhone('');
    setErrorEmail('');
    const otpData = lsLoad(config.prefix + '_otp') || null;
    if (otpData) {
      const waitTime = method === 'phone' ? 60 : 300;
      const countdown =
        waitTime - Math.floor((new Date() - new Date(otpData.lastTry)) / 1000);
      if (countdown > 0) {
        const counterMinutesCountdown = Math.floor(countdown / 60);
        const counterCountdown = countdown % 60;

        setBtnSend(false);
        setSendCounter(otpData.counter || 0);
        setMinutes(counterMinutesCountdown);
        setCounterMinutes(`${counterMinutesCountdown}`);
        setSeconds(counterCountdown);
        setCounter(`${counterCountdown}`);

        let secondsTimer = counterCountdown;
        let timer = setInterval(() => {
          secondsTimer = secondsTimer - 1;
          let counterTimer =
            secondsTimer.toString().length < 2
              ? '0' + secondsTimer
              : secondsTimer;

          setCounter(counterTimer);
          setSeconds(secondsTimer);

          if (secondsTimer === 0) {
            let minutesTimer = minutes - 1;
            let counterMinutesTimer =
              minutesTimer.toString().length < 2
                ? '0' + minutesTimer
                : minutesTimer;

            setCounterMinutes(counterMinutesTimer);
            setMinutes(minutesTimer);
            setSeconds(59);
            setCounter('59');

            if (minutesTimer < 0 && secondsTimer === 0) {
              clearInterval(timer);
              setBtnSend(true);
            }
          }
        }, 1000);
      }
    }
  }, [method]);

  useEffect(() => {
    setIsLoading(true);
    if (props) {
      const enableRegisterWithPassword = props.setting.find((items) => {
        return items.settingKey === 'EnableRegisterWithPassword';
      });
      if (enableRegisterWithPassword) {
        setEnableRegisterWithPassword(enableRegisterWithPassword.settingValue);
      }
      const settingGuestCheckout = props.setting.find((items) => {
        return items.settingKey === 'GuestMode';
      });

      if (settingGuestCheckout?.settingValue) {
        setGuessCheckout(settingGuestCheckout.settingKey);
      }

      const loginByEmail = props.setting.find((items) => {
        return (
          items.settingKey === 'LoginByEmail' && items.settingValue === true
        );
      });
      if (loginByEmail) {
        setLoginByEmail(true);
        setMethod('email');
      }

      const loginByMobile = props.setting.find((items) => {
        return (
          items.settingKey === 'LoginByMobile' && items.settingValue === true
        );
      });
      if (loginByMobile) {
        setLoginByMobile(true);
        setMethod('phone');
      }

      const mobileOTP = props.setting.find((items) => {
        return items.settingKey === 'MobileOTP';
      });
      if (mobileOTP) {
        const check = mobileOTP.settingValue === 'WHATSAPP';
        setEnableSMSOTP(!check);
        setEnableWhatsappOTP(check);
      }

      const enableOrdering = props.setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrdering) {
        setEnableOrdering(enableOrdering.settingValue);
      }

      const minimumAge = props.setting.find((items) => {
        return items.settingKey === 'MinimumAge';
      });
      if (minimumAge) {
        setMinimumAge(Number(minimumAge.settingValue));
      }

      if (props.defaultEmail) {
        setEmail(props.defaultEmail);
        setMethod('email');
        setUserStatus('NOT_REGISTERED');
        setPayloadResponse({ email: props.defaultEmail });
      }
      if (props.defaultPhoneNumber) {
        setEmail(props.defaultPhoneNumber);
        setMethod('phone');
        setUserStatus('NOT_REGISTERED');
        setPayloadResponse({ phoneNumber: props.defaultPhoneNumber });
      }
      if (props.referralCode) {
        setReferralCode(props.referralCode);
      }
    }

    setIsLoading(false);
  }, [props]);

  const handleInput = (jenis, data) => {
    if (jenis) {
      setInputs({ ...inputs, [jenis]: data });
    }

    switch (jenis) {
      case 'phoneNumber': {
        const number = data.trim();
        setPhoneNumber(data);
        if (number && number.length > 7) {
          setErrorPhone('');
          setBtnSubmit(true);
        } else if (number.length === 3) {
          setErrorPhone('');
          setBtnSubmit(false);
        } else {
          setErrorPhone('Phone Number not valid');
          setBtnSubmit(false);
        }
        break;
      }

      case 'txtOtp':
        setTxtOtp(data);
        if (data.length === 4) {
          setBtnSubmit(true);
        } else {
          setBtnSubmit(false);
        }
        break;

      case 'password':
        setPassword(data);
        if (data === '') {
          setBtnSubmit(false);
          return;
        }
        if (data.length < 8) {
          setBtnSubmit(false);
          setErrorPassword('Password consists of 8 characters or more');
          return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data)) {
          setBtnSubmit(false);
          setErrorPassword(
            'Password must contain 1 uppercase, 1 lowercase, and 1 special character'
          );
          return;
        } else {
          setErrorPassword('');
          setBtnSubmit(true);
        }
        break;

      case 'email': {
        const regEmail = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        const email = data;
        const checkEmail = regEmail.test(email);

        setInputs({ ...inputs, [jenis]: email });
        setEmail(email);
        if (email === '') {
          //   setErrorEmail("Email is required");
          setBtnSubmit(false);
          return;
        } else if (!checkEmail) {
          setErrorEmail('Email not valid');
          setBtnSubmit(false);
        } else {
          setErrorEmail('');
          setBtnSubmit(true);
        }
        break;
      }

      default:
        if (data) {
          setBtnSubmit(true);
        } else {
          setBtnSubmit(false);
        }
        return;
    }
  };

  const handleInputRegister = (jenis, data) => {
    if (jenis) {
      setInputs({ ...inputs, [jenis]: data });
    }
    switch (jenis) {
      case 'name':
        setName(data);
        if (data === '') {
          setErrorName('Name is required');
          setBtnSubmit(false);
        } else if (/^[A-Za-z\s]+$/.test(data)) {
          setErrorName('');
          setBtnSubmit(true);
        } else {
          setErrorName('Name is alphabets only');
          setBtnSubmit(false);
        }
        break;

      case 'phoneNumber': {
        const number = data.trim();
        setPhoneNumber(data);
        if (number && number.length > 7) {
          setErrorPhone('');
          setBtnSubmit(true);
        } else if (number.length === 3) {
          setErrorPhone('');
          setBtnSubmit(false);
        } else {
          setErrorPhone('Phone Number not valid');
          setBtnSubmit(false);
        }
        break;
      }

      case 'txtOtp':
        setTxtOtp(data);
        if (data.length === 4) {
          setBtnSubmit(true);
        } else {
          setBtnSubmit(false);
        }
        break;

      case 'passwords':
        setPassword(data);
        if (data === '') {
          setErrorPassword('Password is required');
          setBtnSubmit(false);
        } else if (data.length < 8) {
          setErrorPassword('Password consists of 8 characters or more');
          setBtnSubmit(false);
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data)) {
          setErrorPassword(
            'Password must contain 1 uppercase, 1 lowercase, and 1 special character'
          );
          setBtnSubmit(false);
        } else {
          setErrorPassword('');
          setBtnSubmit(true);
        }
        break;

      case 'email': {
        const regEmail = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const email = data.toLowerCase().trim();
        const checkEmail = regEmail.test(String(email).toLowerCase());
        setInputs({ ...inputs, [jenis]: email });
        setEmail(email);

        if (email === '') {
          setErrorEmail('Email is required');
          setBtnSubmit(false);
          return;
        } else if (!checkEmail) {
          setErrorEmail('Email not valid');
          setBtnSubmit(false);
        } else {
          setErrorEmail('');
          setBtnSubmit(true);
        }
        break;
      }

      case 'birthDate':
        setBirthDate(data);
        if (data) {
          setBtnSubmit(true);
        } else {
          setBtnSubmit(false);
        }
        break;

      default:
        if (data) {
          setBtnSubmit(true);
        } else {
          setBtnSubmit(false);
        }
        return;
    }
  };

  const handleSendOTP = async (sendBy = 'SMSOTP') => {
    if (!enableRegisterWithPassword) {
      let payloadResponseOtp = payloadResponse;
      let phoneNumberOtp = phoneNumber;
      let sendCounterOtp = sendCounter + 1;
      if (phoneNumberOtp.charAt(0) !== '+')
        phoneNumberOtp = '+' + phoneNumberOtp.trim();

      setSendCounter(sendCounterOtp);
      setBtnSend(false);

      if (sendCounter <= 2) {
        const countdown = 59;
        const counterMinutesCountDown = Math.floor(countdown / 60);
        const counterCountDown = countdown % 60;

        setSendCounter(sendCounterOtp);
        setMinutes(counterMinutesCountDown);
        setCounterMinutes(`${counterMinutesCountDown}`);
        setSeconds(counterCountDown);
        setCounter(`${counterCountDown}`);

        let secondsTimer = counterCountDown;

        let timer = setInterval(() => {
          secondsTimer = secondsTimer - 1;
          const counterTimer =
            secondsTimer.toString().length < 2
              ? '0' + secondsTimer
              : secondsTimer;

          setCounter(counterTimer);
          setSeconds(secondsTimer);

          if (secondsTimer === 0) {
            clearInterval(timer);

            setBtnSend(true);
          }
        }, 1000);
      } else {
        setSendCounter(sendCounterOtp);
        setMinutes(4);
        setCounterMinutes('04');
        setSeconds(59);
        setCounter('59');

        let secondsTimer = 0;
        let minutesTimer = 0;

        let timer = setInterval(() => {
          secondsTimer = secondsTimer - 1;
          let counterTimer =
            secondsTimer.toString().length < 2
              ? '0' + secondsTimer
              : secondsTimer;

          setCounter(counterTimer);
          setSeconds(secondsTimer);

          if (secondsTimer === 0) {
            minutesTimer = minutesTimer - 1;
            let counterMinutesTimer =
              minutesTimer.toString().length < 2
                ? '0' + minutesTimer
                : minutesTimer;

            setCounterMinutes(counterMinutesTimer);
            setMinutes(minutesTimer);
            setCounter('59');
            setSeconds(59);

            if (minutesTimer < 0 && seconds === 0) {
              clearInterval(timer);
              setBtnSend(true);
            }
          }
        }, 1000);
      }

      const otpLastTry = new Date();
      lsStore(config.prefix + '_otp', {
        lastTry: otpLastTry,
        counterTimer: sendCounterOtp,
      });

      try {
        const payload = { phoneNumber: phoneNumberOtp, sendBy };

        if (sendCounter > 2) {
          payload.push({ email: payloadResponseOtp.email });
        }

        let response = await props.dispatch(AuthActions.sendOtp(payload));
        response = response.Data;

        if (response.status === false) {
          throw response.status;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMobileCheck = async () => {
    setIsLoading(true);

    let response = await props.dispatch(AuthActions.check({ phoneNumber }));

    response = response.Data;

    if (response && response.status === false) {
      // Fetch Custom & Mandatory Fields
      await props.dispatch(CustomerAction.mandatoryField());
      setUserStatus('NOT_REGISTERED');
      setMethod('phone');
      setPayloadResponse({ phoneNumber });
      setBtnSubmit(false);
    } else if (response) {
      if (response.status === 'SUSPENDED') {
        Swal.fire(
          'Suspended!',
          'Your account has been suspended. Please contact administrator.',
          'error'
        );
      } else {
        if (enableSMSOTP && !enableWhatsappOTP) {
          handleSendOTP('SMSOTP');
        }
        if (!enableSMSOTP && enableWhatsappOTP) {
          handleSendOTP('whatsappOTP');
        }

        setUserStatus('REGISTERED');
        setMethod('phone');
        setPayloadResponse(response.data);
        setBtnSubmit(false);

        setIsLoading(false);
      }
    } else {
      if (max_retries < 5) {
        max_retries += 1;
        setTimeout(() => {
          handleMobileCheck();
        }, 2000);
      } else {
        Swal.fire({
          title: 'Sorry...',
          allowOutsideClick: false,
          icon: 'info',
          text: 'We need to refresh your app, then you can continue to register.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    }

    await setIsLoading(false);
  };

  const handleMobileLogin = async (withOtp) => {
    setIsLoading(true);

    try {
      let payload = { phoneNumber: payloadResponse.phoneNumber };

      if (withOtp) {
        payload.codeOTP = txtOtp;
      } else {
        payload.password = password;
      }

      const response = await props.dispatch(AuthActions.login(payload));
      const responseData = response.Data;

      if (responseData.status === false) {
        throw responseData;
      }

      responseData.isLogin = true;

      const offlineCart = lsLoad(config.prefix + '_offlineCart', true);
      const lsKeyList = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key.includes(`${config.prefix}_`) &&
          !key.includes(`${config.prefix}_scanTable`) &&
          !key.includes(`${config.prefix}_ordering_mode`) &&
          // TODO: need explain for this
          !key.includes(`${config.prefix}_defaultOutlet`)
        ) {
          lsKeyList.push(key);
        }
      }
      lsKeyList.forEach((key) => localStorage.removeItem(key));
      lsStore(
        config.prefix + '_account',
        encryptor.encrypt(responseData),
        true
      );
      lsStore(config.prefix + '_offlineCart', offlineCart, true);
      const url = window.location.href.split('?')[0];
      setIsLoading(false);
      window.location.replace(url);
      window.location.reload();
    } catch (err) {
      let error = 'Please try again.';
      if (err.message) {
        error = err.message;
      }
      Swal.fire('Oppss!', error, 'error');
    }
    setIsLoading(false);
  };

  const getAge = (DOB) => {
    let today = new Date();
    let birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    return age;
  };

  const handleMobileRegister = async () => {
    try {
      const fields = props.fields || [];

      let mandatory =
        fields.filter(
          (items) => items.signUpField === true && items.mandatory === true
        ) || [];

      mandatory.push({ fieldName: 'name', displayName: 'Name' });
      mandatory.push({ fieldName: 'phoneNumber', displayName: 'Phone Number' });
      mandatory.push({ fieldName: 'email', displayName: 'Email' });
      mandatory.push({ fieldName: 'password', displayName: 'Password' });

      const customFields =
        fields &&
        fields.reduce((acc, field) => {
          if (!field.signUpField) {
            return { ...acc };
          }
          return {
            ...acc,
            [field.fieldName]: inputs[field.fieldName] || '',
          };
        });

      if (customFields) {
        delete customFields.displayName;
        delete customFields.fieldName;
        delete customFields.format;
        delete customFields.mandatory;
        delete customFields.sequence;
        delete customFields.signUpField;
        delete customFields.show;
        delete customFields.type;
      }

      const randomPassword = generate([8], {
        specials: 0,
        nums: 2,
        uppers: 3,
        lowers: 3,
      });

      let payload = {
        name,
        email,
        password: enableRegisterWithPassword ? password : randomPassword,
        referralCode,
        birthDate,
        username: payloadResponse.phoneNumber,
        phoneNumber: payloadResponse.phoneNumber,
        ...customFields,
      };

      let listName = '';

      mandatory.forEach((field) => {
        const name = field.fieldName;
        const defaultValue = field.defaultValue;

        if (payload[name] && payload[name] !== 'Invalid date') {
          field.check = true;
        } else if (defaultValue && defaultValue !== '-') {
          payload[name] = defaultValue;
          field.check = true;
        } else if (inputs[name]) {
          payload[name] = inputs[name];
        } else {
          listName += field.displayName + ', ';
          field.check = false;
        }
      });

      mandatory = mandatory.filter((items) => {
        return items.check === false;
      });

      if (mandatory.length > 0) {
        listName = listName.substr(0, listName.length - 2);
        Swal.fire('Oppss!', `${listName} is required`, 'error');
        return;
      }

      // Validate minimum age
      if (minimumAge > 0) {
        const currentAge = getAge(payload.birthDate);
        if (currentAge < minimumAge) {
          Swal.fire(
            'Oppss!',
            `The minimum age for registration is ${minimumAge} years old`,
            'error'
          );
          return;
        }
      }

      setIsLoading(true);

      const response = await props.dispatch(
        AuthActions.register(payload, enableRegisterWithPassword)
      );
      const responseMessage = response.Data.message || '';

      if (responseMessage) {
        Swal.fire('Oppss!', responseMessage, 'error');
        setIsLoading(false);
      } else {
        enableRegisterWithPassword &&
          lsStore(
            config.prefix + '_account',
            encryptor.encrypt({
              phoneNumber: payloadResponse.phoneNumber,
              email,
            }),
            true
          );

        try {
          if (enableRegisterWithPassword) {
            await handleMobileLogin();
          } else {
            setSignUpSuccess(true);
            if (enableSMSOTP && !enableWhatsappOTP) {
              await handleSendOTP('SMSOTP');
            }
            if (!enableSMSOTP && enableWhatsappOTP) {
              await handleSendOTP('WhatsappOTP');
            }
            if (enableSMSOTP && enableWhatsappOTP) {
              await handleSendOTP('SMSOTP');
            }
          }

          setIsLoading(false);

          setPayloadResponse(payload);
          setBtnSubmit(false);
          setSendCounter(0);
          setBtnSend(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    } catch (err) {
      let error = 'Please try again.';
      if (
        err.response &&
        err.response.data &&
        err.response.data.Data &&
        err.response.data.Data.message
      ) {
        error = err.response.data.Data.message;
      }
      Swal.fire('Oppss!', error, 'error');
    }
  };

  // Email login mode

  const handleSendEmailOTP = async () => {
    setIsLoading(true);
    if (!enableRegisterWithPassword) {
      const countdown = 299;
      const counterMinutesOtp = Math.floor(countdown / 60);
      const minutesOtp = 4;
      const counterOtp = countdown % 60;
      const otpLastTry = new Date();

      setBtnSend(false);
      setMinutes(minutesOtp);
      setCounterMinutes(counterMinutesOtp);
      setSeconds(counter);
      setCounter(`${counter}`);

      setSendCounter(sendCounter + 1);
      lsStore(config.prefix + '_otp', {
        lastTry: otpLastTry,
        counter: sendCounter + 1,
      });

      let secondsTimer = counterOtp;
      let minutesTimer = minutesOtp;

      var timer = setInterval(() => {
        secondsTimer = secondsTimer - 1;
        let counterTimer =
          secondsTimer.toString().length < 2
            ? '0' + secondsTimer
            : secondsTimer;

        setSeconds(secondsTimer);
        setCounter(counterTimer);

        if (secondsTimer === 0) {
          minutesTimer = minutesTimer - 1;
          let counterMinutesTimer =
            minutesTimer.toString().length < 2
              ? '0' + minutesTimer
              : minutesTimer;

          setCounter('59');
          setSeconds(59);
          setMinutes(minutesTimer);
          setCounterMinutes(counterMinutesTimer);

          if (minutesTimer < 0 && secondsTimer === 0) {
            setBtnSend(true);
            clearInterval(timer);
          }
        }
      }, 1000);

      try {
        let payload = { email };
        let response = await props.dispatch(AuthActions.sendOtp(payload));

        response = response.Data;

        if (response.status === false) {
          throw response.status;
        }
      } catch (error) {
        setIsLoading(false);

        setBtnSend(false);
      }
    }
    setIsLoading(false);
  };

  const handleEmailCheck = async () => {
    setIsLoading(true);

    if (email) {
      let response = await props.dispatch(AuthActions.check({ email }));
      response = response.Data;

      if (response.status === false) {
        // Fetch Custom & Mandatory Fields
        await props.dispatch(CustomerAction.mandatoryField());
        setUserStatus('NOT_REGISTERED');
        setPayloadResponse({ email });
        setBtnSubmit(false);
        setIsLoading(false);
        setMethod('email');
      } else {
        if (response.data.status === 'SUSPENDED') {
          Swal.fire(
            'Suspended!',
            'Your account has been suspended. Please contact administrator.',
            'error'
          );
          return;
        } else {
          setUserStatus('REGISTERED');
          setPayloadResponse(response.data);
          setBtnSubmit(false);
          handleSendEmailOTP();
        }
      }
    }

    setIsLoading(false);
  };

  const handleEmailLogin = async (withOtp) => {
    setIsLoading(true);
    try {
      let payload = { email: payloadResponse.email };

      if (withOtp) {
        payload.codeOTP = txtOtp;
      } else {
        payload.password = password;
      }

      const response = await props.dispatch(AuthActions.login(payload));
      const responseData = response.Data;

      if (responseData.status === false) {
        throw responseData;
      }
      responseData.isLogin = true;

      const offlineCart = lsLoad(config.prefix + '_offlineCart', true);
      const lsKeyList = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key.includes(`${config.prefix}_`) &&
          !key.includes(`${config.prefix}_scanTable`) &&
          !key.includes(`${config.prefix}_ordering_mode`) &&
          // TODO: need explain for this
          !key.includes(`${config.prefix}_defaultOutlet`)
        ) {
          lsKeyList.push(key);
        }
      }
      lsKeyList.forEach((key) => localStorage.removeItem(key));
      lsStore(
        config.prefix + '_account',
        encryptor.encrypt(responseData),
        true
      );
      if (offlineCart !== null) {
        lsStore(config.prefix + '_offlineCart', offlineCart, true);
      }

      const url = window.location.href.split('?')[0];
      window.location.replace(url);
      window.location.reload();
    } catch (err) {
      setIsLoading(false);
      let error = 'Please try again.';
      if (err.message) {
        error = err.message;
      }
      Swal.fire('Oppss!', error, 'error');
    }
    setIsLoading(false);
  };

  const handleEmailRegister = async () => {
    props.dispatch({
      type: CONSTANT.LOADING_ON_MODAL_REGISTER,
      data: true,
    });
    try {
      setIsLoading(true);
      const fields = props.fields || [];
      let mandatory = [];
      mandatory = fields.filter((items) => {
        return items.signUpField === true && items.mandatory === true;
      });
      mandatory.push({ fieldName: 'name', displayName: 'Name' });
      mandatory.push({ fieldName: 'phoneNumber', displayName: 'Phone Number' });
      mandatory.push({ fieldName: 'email', displayName: 'Email' });
      mandatory.push({ fieldName: 'password', displayName: 'Password' });

      const customFields =
        fields &&
        fields.reduce((acc, field) => {
          if (!field.signUpField) {
            return { ...acc };
          }
          return {
            ...acc,
            [field.fieldName]: inputs[field.fieldName] || '',
          };
        });

      if (customFields) {
        delete customFields.displayName;
        delete customFields.fieldName;
        delete customFields.format;
        delete customFields.mandatory;
        delete customFields.sequence;
        delete customFields.signUpField;
        delete customFields.show;
        delete customFields.type;
      }

      const randomPassword = generate([8], {
        specials: 0,
        nums: 2,
        uppers: 3,
        lowers: 3,
      });

      let payload = {
        phoneNumber,
        email: payloadResponse.email,
        password: enableRegisterWithPassword ? password : randomPassword,
        username: payloadResponse.email,
        referralCode,
        ...customFields,
      };

      //mark
      let listName = '';
      mandatory.forEach((field) => {
        const name = field.fieldName;
        const defaultValue = field.defaultValue;

        if (payload[name] && payload[name] !== 'Invalid date') {
          field.check = true;
        } else if (defaultValue && defaultValue !== '-') {
          payload[name] = defaultValue;
          field.check = true;
        } else if (inputs[name]) {
          payload[name] = inputs[name];
          field.check = true;
        } else {
          listName += name + ', ';
          field.check = false;
        }
      });

      mandatory = mandatory.filter((items) => {
        return items.check === false;
      });

      if (mandatory.length > 0) {
        listName = listName.substr(0, listName.length - 2);
        Swal.fire('Oppss!', `${listName} is required`, 'error');
        return;
      }

      // Validate minimum age
      if (minimumAge > 0) {
        setIsLoading(false);
        const currentAge = getAge(payload.birthDate);
        if (currentAge < minimumAge) {
          Swal.fire(
            'Oppss!',
            `The minimum age for registration is ${minimumAge} years old`,
            'error'
          );
          return;
        }
      }

      setIsLoading(false);
      let response = await props.dispatch(
        AuthActions.register(payload, enableRegisterWithPassword)
      );
      response = response.Data;

      if (response.message) {
        setIsLoading(false);
        Swal.fire('Oppss!', response.message, 'error');
      } else {
        if (enableRegisterWithPassword) {
          lsStore(
            config.prefix + '_account',
            encryptor.encrypt({
              phoneNumber: phoneNumber,
              email: payloadResponse.email,
            }),
            true
          );
        }

        try {
          setIsLoading(true);
          setPayloadResponse(payload);
          setBtnSubmit(false);
          setSendCounter(2);
          setBtnSend(false);
          if (enableRegisterWithPassword) {
            await handleEmailLogin();
          } else {
            setSignUpSuccess(true);
            await handleSendEmailOTP();
          }

          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
      return response;
    } catch (err) {
      setIsLoading(false);
      let error = 'Please try again.';
      if (
        err.response &&
        err.response.data &&
        err.response.data.Data &&
        err.response.data.Data.message
      ) {
        error = err.response.data.Data.message;
      }
      Swal.fire('Oppss!', error, 'error');
    }
  };

  const handleClear = () => {
    setPhoneNumber('');
    setEmail('');
    setErrorPhone('');
    setErrorEmail('');
    setSignUpSuccess(false);
    setBtnSubmit(false);
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
      <div
        className='modal fade'
        id='login-register-modal'
        tabIndex={-1}
        role='dialog'
        aria-labelledby='exampleModalCenterTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered'
          role='document'
          style={{
            justifyContent: 'center',
          }}
        >
          {userStatus === 'REGISTERED' ? (
            <Login
              method={method}
              username={method === 'email' ? email : phoneNumber}
              enablePassword={enableRegisterWithPassword}
              handleSubmit={
                method === 'email' ? handleEmailLogin : handleMobileLogin
              }
              handleBackButtonClick={() => {
                setUserStatus('NOT_CHECKED');
                handleClear();
              }}
              handleChange={handleInput}
              sendOtpToPhone={(sendBy) => handleSendOTP(sendBy)}
              sendOtpToEmail={handleSendEmailOTP}
              isSubmitting={!btnSubmit}
              otpTimer={{
                isSending: !btnSend,
                sendCounter: sendCounter,
                counterMinutes: counterMinutes,
                counter: counter,
              }}
              enableSMSOTP={enableSMSOTP}
              enableWhatsappOTP={enableWhatsappOTP}
              enableOrdering={enableOrdering}
            ></Login>
          ) : userStatus === 'NOT_REGISTERED' ? (
            <SignUp
              method={method}
              initialUserData={payloadResponse}
              handleBackButtonClick={() => {
                setUserStatus('NOT_CHECKED');
                handleClear();
              }}
              handleChange={handleInputRegister}
              handleEmailSubmit={handleEmailRegister}
              handlePhoneSubmit={handleMobileRegister}
              sendOtpToPhone={(sendBy) => handleSendOTP(sendBy)}
              sendOtpToEmail={handleSendEmailOTP}
              handleEmailLogin={handleEmailLogin}
              handlePhoneLogin={handleMobileLogin}
              signUpSuccess={signUpSuccess}
              isSubmitting={!btnSubmit}
              otpTimer={{
                isSending: !btnSend,
                sendCounter: sendCounter,
                counterMinutes: counterMinutes,
                counter: counter,
              }}
              errorPhone={errorPhone}
              errorEmail={errorEmail}
              errorPassword={errorPassword}
              errorName={errorName}
              enablePassword={enableRegisterWithPassword}
              enableOrdering={enableOrdering}
              enableSMSOTP={enableSMSOTP}
              enableWhatsappOTP={enableWhatsappOTP}
              minimumAge={minimumAge}
            ></SignUp>
          ) : (
            <Portal
              color={props.color.background}
              method={method}
              handleMethodChange={(value) => {
                setMethod(value);
                handleClear();
              }}
              handlePhoneCheck={handleMobileCheck}
              handleEmailCheck={handleEmailCheck}
              handleChange={handleInput}
              isSubmitting={!btnSubmit}
              error={errorPhone || errorEmail}
              loginByEmail={loginByEmail}
              loginByMobile={loginByMobile}
              enableOrdering={enableOrdering}
              companyInfo={props.companyInfo}
              settingGuessCheckout={guessCheckout}
            />
          )}
        </div>
      </div>
    </LoadingOverlayCustom>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
