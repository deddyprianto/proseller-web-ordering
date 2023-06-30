import React, { Component } from 'react';

import LoadingOverlay from 'react-loading-overlay';
import styles from '../login-register/Portal/styles.module.css';
import PhoneInput from 'react-phone-input-2';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import cx from 'classnames';
import { AuthActions } from '../../redux/actions/AuthAction';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import { CONSTANT } from '../../helpers';
import { lsStore } from '../../helpers/localStorage';
import config from '../../config';

let Swal = require('sweetalert2');
let encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class ModalEditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode:
        (this.props.companyInfo && this.props.companyInfo.countryCode) || 'SG',
      phoneCountryCode:
        (this.props.companyInfo && this.props.companyInfo.countryCode) === 'SG'
          ? '+65'
          : '+62',
      newPhoneNumber: '',
      isUsed: false,
      isSame: false,
      isWrong: false,
      txtOtp: '',
      isWaitingOTP: false,
      isSending: true,
      isLoading: false,
      waitTime:
        this.props.title && this.props.title.field === 'email' ? 300 : 60,
      minutes: 1,
      counterMinutes: '01',
      seconds: 59,
      counterSeconds: '59',
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.title &&
      this.props.title &&
      prevProps.title.field !== this.props.title.field
    ) {
      this.setState({
        waitTime: this.props.title.field === 'email' ? 300 : 60,
        isUsed: false,
        isSame: false,
        isWrong: false,
        isWaitingOTP: false,
        isSending: true,
      });
    }

    if (prevProps.companyInfo !== this.props.companyInfo) {
      this.setState({
        countryCode:
          (this.props.companyInfo && this.props.companyInfo.countryCode) ||
          'SG',
        phoneCountryCode:
          (this.props.companyInfo && this.props.companyInfo.countryCode) ===
          'SG'
            ? '+65'
            : '+62',
      });
    }
    if (document.querySelector('#phoneInputEdit')) {
      document
        .querySelector('#phoneInputEdit')
        .addEventListener('keypress', (evt) => {
          if (
            (evt.which !== 8 && evt.which !== 0 && evt.which < 48) ||
            evt.which > 57
          ) {
            evt.preventDefault();
          }
        });
    }
  }

  async handleCheckExistence(field, value) {
    if (!this.validationField(field, value))
      return this.setState({ isWrong: true });

    let isSame = this.props.account.idToken.payload[field] === value;
    if (!isSame) {
      let response = await this.props.dispatch(
        AuthActions.check({ [field]: value })
      );
      let isUsed = await response.Data.status;
      this.setState({ isUsed, isSame: false, isWrong: false });
      return !isUsed;
    }
    this.setState({ isSame: true, isUsed: false, isWrong: false });
    return !isSame;
  }

  viewPhoneNumber() {
    let {
      phoneCountryCode,
      newPhoneNumber,
      isWaitingOTP,
      isSending,
      counterMinutes,
      counterSeconds,
    } = this.state;
    let phoneNumber = `${phoneCountryCode}${newPhoneNumber}`;
    const color = this.props.color.background;

    if (isWaitingOTP) {
      return (
        <div>
          <div style={{ marginBottom: 10 }}>
            You will receive 4-digit verification code via {phoneNumber}
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <input
              type='password'
              className='woocommerce-Input woocommerce-Input--text input-text'
              style={{
                height: 50,
                width: '50%',
                borderRadius: 5,
                textAlign: 'center',
              }}
              onChange={(e) => this.setState({ txtOtp: e.target.value })}
            />
            <Button
              disabled={isSending}
              className='button'
              style={{
                width: '50%',
                fontSize: 12,
                paddingLeft: 5,
                marginLeft: 10,
                paddingRight: 5,
                height: 50,
                borderRadius: 5,
              }}
              onClick={() => this.handleSubmit('newPhoneNumber', phoneNumber)}
            >
              Resend OTP
            </Button>
          </div>
          {isSending && (
            <div
              className='text-muted'
              style={{ fontSize: 12, marginTop: 5, textAlign: 'center' }}
            >
              {`Resend after ${counterMinutes}:${counterSeconds}`}
            </div>
          )}
        </div>
      );
    }

    return (
      <LoadingOverlay active={this.state.isLoading} spinner>
        <div style={{ marginBottom: 10 }}>Enter your new Phone Number</div>
        <div className={styles.fieldGroup}>
          <div className={styles.phoneCountryCodeGroup}>
            <PhoneInput
              country={this.state.countryCode}
              value={phoneCountryCode}
              enableSearch
              autoFormat={false}
              onChange={(e) => {
                this.setState({ phoneCountryCode: `+${e}` });
              }}
              onKeyDown={() =>
                document.getElementById('phoneInputEdit').focus()
              }
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
          <input
            type='number'
            id='phoneInputEdit'
            value={newPhoneNumber}
            className={styles.phoneField}
            onChange={(e) => this.setState({ newPhoneNumber: e.target.value })}
          />
        </div>
      </LoadingOverlay>
    );
  }

  viewEmail() {
    let { newEmail, isWaitingOTP, isSending, counterMinutes, counterSeconds } =
      this.state;

    if (isWaitingOTP) {
      return (
        <div>
          <div style={{ marginBottom: 10 }}>
            You will receive 4-digit verification code via {newEmail}
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <input
              type='password'
              className='woocommerce-Input woocommerce-Input--text input-text'
              style={{
                height: 50,
                width: '50%',
                borderRadius: 5,
                textAlign: 'center',
              }}
              onChange={(e) => this.setState({ txtOtp: e.target.value })}
            />
            <Button
              disabled={isSending}
              className='button'
              style={{
                width: '50%',
                fontSize: 12,
                paddingLeft: 5,
                marginLeft: 10,
                paddingRight: 5,
                height: 50,
                borderRadius: 5,
              }}
              onClick={() => this.handleSubmit('newEmail', newEmail)}
            >
              Resend OTP
            </Button>
          </div>
          {isSending && (
            <div
              className='text-muted'
              style={{ fontSize: 12, marginTop: 5, textAlign: 'center' }}
            >
              {`Resend after ${counterMinutes}:${counterSeconds}`}
            </div>
          )}
        </div>
      );
    }

    return (
      <LoadingOverlay active={this.state.isLoading} spinner>
        <div style={{ marginBottom: 10 }}>Enter your new Email</div>
        <div className={styles.fieldGroup}>
          <Input
            type='email'
            value={newEmail}
            style={{ height: 40, borderRadius: 5 }}
            onChange={(e) => this.setState({ newEmail: e.target.value })}
          ></Input>
        </div>
      </LoadingOverlay>
    );
  }

  async submitPhoneNumber(isWaitingOTP) {
    let { phoneCountryCode, newPhoneNumber } = this.state;
    let phoneNumber = `${phoneCountryCode}${newPhoneNumber}`;

    this.setState({ isLoading: true });

    if (!isWaitingOTP) {
      let check = await this.handleCheckExistence('phoneNumber', phoneNumber);
      if (check) this.handleSubmit('newPhoneNumber', phoneNumber);
      else this.setState({ isLoading: false });
    } else {
      this.handleSubmit('newPhoneNumber', phoneNumber, isWaitingOTP);
      this.setState({ isLoading: false });
    }
  }

  async submitEmail(isWaitingOTP) {
    let { newEmail } = this.state;

    this.setState({ isLoading: true });

    if (!isWaitingOTP) {
      let check = await this.handleCheckExistence('email', newEmail);
      if (check) this.handleSubmit('newEmail', newEmail);
      else this.setState({ isLoading: false });
    } else {
      this.handleSubmit('newEmail', newEmail, isWaitingOTP);
      this.setState({ isLoading: false });
    }
  }

  async handleSubmit(field, value, isWaitingOTP) {
    this.setState({ isLoading: true });
    let account = this.props.account;
    let payload = { username: account.idToken.payload.username };
    payload[field] = value;
    if (!isWaitingOTP) {
      let response = await this.props.dispatch(
        CustomerAction.updateCustomerAccount(payload)
      );
      if (response.ResultCode === 200) {
        this.setState({ isWaitingOTP: true });
        this.handleCounterDown();
        this.setState({ isLoading: false });
      } else {
        Swal.fire(
          'Oppss!',
          response.message || response.Data.message || 'Send OTP is failed!',
          'error'
        );
      }
    } else {
      payload['otp'] = this.state.txtOtp;
      this.setState({ isLoading: true });
      let response = await this.props.dispatch(
        CustomerAction.updateCustomerProfile(payload)
      );
      if (response.ResultCode === 200) {
        this.setState({ isLoading: false });
        Swal.fire(
          'Success!',
          response.message || response.Data.message || 'Confirmation success!',
          'success'
        ).then((res) => {
          if (res.isConfirmed) {
            window.location.reload();
          }
        });

        if (
          (account.idToken.payload.username.includes('+') &&
            field === 'newPhoneNumber') ||
          (account.idToken.payload.username.includes('@') &&
            field === 'newEmail')
        )
          account.idToken.payload.username = value;

        if (field === 'newPhoneNumber')
          account.idToken.payload.phoneNumber = value;
        if (field === 'newEmail') account.idToken.payload.email = value;

        await this.props.dispatch(
          AuthActions.setData({ Data: account }, CONSTANT.KEY_AUTH_LOGIN)
        );
        lsStore(`${config.prefix}_account`, encryptor.encrypt(account), true);
      } else {
        Swal.fire(
          'Oppss!',
          response.message ||
            response.Data.message ||
            'Confirmation is failed!',
          'error'
        );
        this.setState({ isLoading: false });
      }
    }
  }

  validationField(field, value) {
    const regEmail = /^[\w][\w-+.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (field === 'email') return regEmail.test(String(value).toLowerCase());
    if (field === 'phoneNumber') return value.length >= 10;
  }

  counterString(value) {
    return value.toString().length < 2 ? `0${value}` : value;
  }

  handleCounterDown() {
    let waitTime = this.state.waitTime;
    let minutes = Math.floor(waitTime / 60);
    let seconds = waitTime % 60;
    let counterSeconds = this.counterString(seconds);
    let counterMinutes = this.counterString(minutes);

    this.setState({
      minutes,
      counterMinutes,
      seconds,
      counterSeconds,
      isSending: true,
    });

    let timer = setInterval(() => {
      if (seconds !== 0) {
        seconds = this.state.seconds - 1;
        counterSeconds = this.counterString(seconds);
        this.setState({ counterSeconds, seconds });
      }
      if (seconds === 0) {
        minutes = this.state.minutes - 1;
        seconds = 59;
        counterMinutes = this.counterString(minutes);
        counterSeconds = this.counterString(seconds);
        this.setState({
          minutes,
          counterMinutes,
          seconds,
          counterSeconds,
        });
        if (minutes < 0) {
          clearInterval(timer);
          this.setState({ isSending: false });
        }
      }
    }, 1000);
  }

  render() {
    let { isWaitingOTP } = this.state;
    return (
      <div>
        {this.props.title && (
          <div
            className='modal fade'
            tabIndex={-1}
            id='edit-account-modal'
            role='dialog'
            aria-labelledby='exampleModalCenterTitle'
            aria-hidden='true'
          >
            <div
              className='modal-dialog modal-dialog-centered'
              role='document'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div
                className='modal-content'
                style={{ width: '100%', marginTop: 100, marginBottom: 100 }}
              >
                <div
                  className='modal-header'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <h5
                    className='modal-title'
                    id='exampleModalLabel'
                    style={{ fontSize: 16 }}
                  >{`Edit ${this.props.title.display}`}</h5>
                  <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    aria-label='Close'
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 16,
                    }}
                  >
                    <span aria-hidden='true' style={{ fontSize: 30 }}>
                      ×
                    </span>
                  </button>
                </div>
                <div className='modal-body'>
                  {this.props.title.field === 'email'
                    ? this.viewEmail()
                    : this.viewPhoneNumber()}

                  {this.state.isSame && (
                    <div className='text text-warning-theme small'>
                      <em>{`${this.props.title.display} same as the previous`}</em>
                    </div>
                  )}

                  {this.state.isUsed && (
                    <div className='text text-warning-theme small'>
                      <em>{`${this.props.title.display} already used`}</em>
                    </div>
                  )}

                  {this.state.isWrong && (
                    <div className='text text-warning-theme small'>
                      <em>
                        {`You have entered an invalid ${this.props.title.display}, please try again. `}
                      </em>
                    </div>
                  )}

                  <Button
                    className={cx('button', styles.submitButton)}
                    style={{ marginTop: 20 }}
                    onClick={() =>
                      this.props.title.field === 'phoneNumber'
                        ? this.submitPhoneNumber(isWaitingOTP)
                        : this.submitEmail(isWaitingOTP)
                    }
                  >
                    <i className='fa fa-paper-plane' aria-hidden='true' />
                    {isWaitingOTP ? 'Confirm' : 'Submit'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
    account: state.auth.account,
    color: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditAccount);
