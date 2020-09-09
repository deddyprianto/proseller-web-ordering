import React, { Component } from "react";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import generate from "password-generation";
import { AuthActions } from "../../redux/actions/AuthAction";
import Loading from "../loading";

import Login from "./Login";
import Portal from "./Portal";
import SignUp from "./Signup";

import { lsLoad, lsStore } from "../../helpers/localStorage";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method: "phone",
      userStatus: "NOT_CHECKED",
      isLoading: false,
      payloadResponse: {},

      phoneNumber: "",
      modalShow: false,
      errorPhone: "",
      show: false,
      errorLogin: "",
      language: "English",
      dictionary: {},
      configLang: {},
      infoCompany: null,

      otpLastTry: null,
      otp: true,
      box: false,
      btnSend: true,
      seconds: 0,
      minutes: 0,
      counter: "00",
      counterMinutes: "00",
      sendCounter: 0,
      txtOpt: "",
      errorOpt: "",
      btnSubmit: false,
      password: "",

      name: "",
      email: "",
      errorEmail: "",

      enableRegisterWithPassword: false,
      errorPassword: "",
      signUpSuccess: false,
    };
  }

  componentDidMount = async () => {
    const otpData = lsLoad("webordering_otp") || null;
    if (otpData) {
      const countdown =
        300 - Math.floor((new Date() - new Date(otpData.lastTry)) / 1000);
      if (countdown > 0) {
        const counterMinutes = Math.floor(countdown / 60);
        const counter = countdown % 60;
        this.setState({
          btnSend: false,
          otpLastTry: new Date(otpData.lastTry),
          sendCounter: otpData.counter,
          minutes: counterMinutes,
          counterMinutes: `${counterMinutes}`,
          seconds: counter,
          counter: `${counter}`,
        });
        let timer = setInterval(() => {
          let seconds = this.state.seconds - 1;
          let counter = seconds.toString().length < 2 ? "0" + seconds : seconds;
          this.setState({ counter, seconds });
          if (seconds === 0) {
            let minutes = this.state.minutes - 1;
            let counterMinutes =
              minutes.toString().length < 2 ? "0" + minutes : minutes;
            this.setState({
              counterMinutes,
              minutes,
              seconds: 59,
              counter: "59",
            });
            if (minutes < 0 && seconds === 0) {
              clearInterval(timer);
              this.setState({ btnSend: true });
            }
          }
        }, 1000);
      }
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (
        !this.props.fetchingCompanyInfo &&
        !this.props.companyInfoError &&
        this.props.companyInfo
      ) {
        this.setState({
          enableRegisterWithPassword: this.props.companyInfo
            .enableRegisterWithPassword,
          otp: false,
        });
      }
    }
  }

  handleInput = (jenis, data) => {
    this.setState({ [jenis]: data });
    if (jenis === "phoneNumber") {
      this.setState({ errorPhone: "" });
      if (
        this.state.name !== "" &&
        this.state.phoneNumber.trim() !== "" &&
        this.state.phoneNumber.trim().length > 7
      ) {
        this.setState({ btnSubmit: true });
      } else {
        this.setState({ btnSubmit: false });
      }
    } else if (jenis === "txtOtp") {
      if (data.length === 4) this.setState({ btnSubmit: true });
      else this.setState({ btnSubmit: false });
    } else if (jenis === "password") {
      if (data.length >= 8) this.setState({ btnSubmit: true });
      else this.setState({ btnSubmit: false });
    } else if (jenis === "email") {
      this.setState({ errorEmail: "" });
      if (
        this.state.name !== "" &&
        this.state.email.toLowerCase().trim() !== ""
      ) {
        this.setState({ btnSubmit: true });
      } else {
        this.setState({ btnSubmit: false });
      }
    }
  };

  handleInputRegister = (jenis, data) => {
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    this.setState({ [jenis]: data });
    if (jenis === "phoneNumber") {
      this.setState({ errorPhone: "" });
      if (
        this.state.name !== "" &&
        this.state.phoneNumber.trim() !== "" &&
        this.state.phoneNumber.trim().length > 7 &&
        !enableRegisterWithPassword
      ) {
        this.setState({ btnSubmit: true });
      } else if (!enableRegisterWithPassword) {
        this.setState({ btnSubmit: false });
      }
    } else if (jenis === "txtOtp") {
      if (data.length === 4) this.setState({ btnSubmit: true });
      else this.setState({ btnSubmit: false });
    } else if (jenis === "password") {
      this.setState({ errorPassword: "" });
      if (data.length >= 8) this.setState({ btnSubmit: true });
      else this.setState({ btnSubmit: false });
    } else if (jenis === "email") {
      this.setState({ errorEmail: "" });
      if (
        this.state.name !== "" &&
        this.state.email.toLowerCase().trim() !== "" &&
        !enableRegisterWithPassword
      ) {
        this.setState({ btnSubmit: true });
      } else if (!enableRegisterWithPassword) {
        this.setState({ btnSubmit: false });
      }
    }
  };

  handleMobileCheck = async () => {
    let phoneNumber = this.state.phoneNumber;
    if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();

    this.setState({ isLoading: true });
    if (phoneNumber === "" || phoneNumber.length <= 4) {
      if (phoneNumber === "")
        this.setState({ errorPhone: "Phone number is empty" });
      if (phoneNumber.length <= 4)
        this.setState({ errorPhone: "Phone number is not valid" });
    } else {
      this.setState({ errorPhone: "" });
      let response = await this.props.dispatch(
        AuthActions.check({ phoneNumber })
      );
      response = response.Data;
      // console.log(response)
      if (response.status === false) {
        this.setState({
          userStatus: "NOT_REGISTERED",
          payloadResponse: { phoneNumber },
          btnSubmit: false,
        });
      } else {
        if (response.data.status === "SUSPENDED") {
          Swal.fire(
            "Suspended!",
            "Your account has been suspended. Please contact administrator.",
            "error"
          );
        } else if (response.data.confirmation) {
          this.setState({
            userStatus: "REGISTERED",
            payloadResponse: response.data,
            btnSubmit: false,
          });
        } else {
          this.setState({
            userStatus: "REGISTERED",
            payloadResponse: response.data,
            btnSubmit: false,
          });
        }
      }
    }
    this.setState({ isLoading: false });
  };

  handleSendOTP = async () => {
    let payloadResponse = this.state.payloadResponse;
    let phoneNumber = this.state.phoneNumber;
    let sendCounter = this.state.sendCounter + 1;
    if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();

    if (sendCounter <= 2) {
      this.setState({
        isLoading: false,
        sendCounter,
        btnSend: false,
        minutes: 0,
        counterMinutes: "00",
        seconds: 59,
        counter: "59",
      });
      let timer = setInterval(() => {
        let seconds = this.state.seconds - 1;
        let counter = seconds.toString().length < 2 ? "0" + seconds : seconds;
        this.setState({ counter, seconds });
        if (seconds === 0) {
          clearInterval(timer);
          this.setState({ btnSend: true });
        }
      }, 1000);
    } else {
      this.setState({
        isLoading: false,
        sendCounter,
        btnSend: false,
        minutes: 4,
        counterMinutes: "04",
        seconds: 59,
        counter: "59",
      });
      let timer = setInterval(() => {
        let seconds = this.state.seconds - 1;
        let counter = seconds.toString().length < 2 ? "0" + seconds : seconds;
        this.setState({ counter, seconds });
        if (seconds === 0) {
          let minutes = this.state.minutes - 1;
          let counterMinutes =
            minutes.toString().length < 2 ? "0" + minutes : minutes;
          this.setState({
            counterMinutes,
            minutes,
            seconds: 59,
            counter: "59",
          });
          if (minutes < 0 && seconds === 0) {
            clearInterval(timer);
            this.setState({ btnSend: true });
          }
        }
      }, 1000);
    }

    try {
      let payload = { phoneNumber: payloadResponse.phoneNumber };
      if (this.state.sendCounter >= 2)
        payload = { email: payloadResponse.email };

      let response = await this.props.dispatch(AuthActions.sendOtp(payload));
      response = response.Data;
      // console.log(response)

      if (response.status === false) throw response.status;
      this.setState({ isLoading: false, box: true });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  handleMobileLogin = async (withOtp) => {
    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });
    try {
      let payload = { phoneNumber: payloadResponse.phoneNumber };

      if (withOtp) payload.codeOTP = this.state.txtOtp;
      else payload.password = this.state.password;
      // console.log(payload)
      let response = await this.props.dispatch(AuthActions.login(payload));
      response = response.Data;
      // console.log(response)
      if (response.status === false) throw response;
      response.isLogin = true;
      const offlineCart = localStorage.getItem("webordering_offlineCart");
      localStorage.clear();
      localStorage.setItem(
        "webordering_account",
        JSON.stringify(encryptor.encrypt(response))
      );
      localStorage.setItem("webordering_offlineCart", offlineCart);
      window.location.reload();
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      Swal.fire("Oppss!", error, "error");
      this.setState({ isLoading: false });
    }
  };

  handleMobileRegister = async () => {
    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });

    try {
      let password = this.state.password;
      let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
      let email = this.state.email.toLowerCase().trim();
      let errorEmail = "";
      let cekEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email
      );
      if (!cekEmail) errorEmail = "Email not valid";

      let errorPassword = "";
      if (password === "") errorPassword = "Password is empty";
      if (password.length < 8)
        errorPassword = "Password consists of 8 characters or more";
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password))
        errorPassword = `Password must contain 1 uppercase, 1 lowercase, and 1 special character`;

      if (
        (enableRegisterWithPassword && errorPassword !== "") ||
        errorEmail !== ""
      ) {
        this.setState({ errorPassword, isLoading: false, errorEmail });
        return;
      }

      let payload = {
        phoneNumber: payloadResponse.phoneNumber,
        email: email,
        password: generate([8], { specials: 0, nums: 2, uppers: 3, lowers: 3 }),
        username: payloadResponse.phoneNumber,
        name: this.state.name,
      };

      if (this.state.password !== "") payload.password = this.state.password;
      // console.log(payload)
      // return

      let response = await this.props.dispatch(
        AuthActions.register(payload, enableRegisterWithPassword)
      );
      response = response.Data;
      // console.log(response)
      if (response.message) {
        this.setState({ isLoading: false, errorLogin: response.message });
        Swal.fire("Oppss!", response.message, "error");
      } else {
        enableRegisterWithPassword &&
          localStorage.setItem(
            "webordering_account",
            JSON.stringify(
              encryptor.encrypt({
                phoneNumber: payloadResponse.phoneNumber,
                email: this.state.email.toLowerCase().trim(),
              })
            )
          );

        try {
          this.setState({
            payloadResponse: payload,
            btnSubmit: false,
            isLoading: false,
            sendCounter: 0,
            btnSend: false,
          });
          if (enableRegisterWithPassword) this.handleMobileLogin();
          else {
            this.setState({ showPage: "mobileSignUp" });
            this.handleSendOTP();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (
        err.response &&
        err.response.data &&
        err.response.data.Data &&
        err.response.data.Data.message
      ) {
        error = err.response.data.Data.message;
      }
      Swal.fire("Oppss!", error, "error");
      this.setState({ isLoading: false });
    }
  };

  // Email login mode

  handleEmailCheck = async () => {
    this.setState({ isLoading: true });
    let email = this.state.email.toLowerCase().trim();
    if (email === "") {
      this.setState({ errorEmail: "Email is empty", isLoading: false });
    } else {
      let cekEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email
      );
      if (cekEmail) {
        let response = await this.props.dispatch(AuthActions.check({ email }));
        response = response.Data;
        // console.log(response)
        if (response.status === false) {
          this.setState({
            userStatus: "NOT_REGISTERED",
            payloadResponse: { email },
            btnSubmit: false,
          });
        } else {
          if (response.data.status === "SUSPENDED") {
            Swal.fire(
              "Suspended!",
              "Your account has been suspended. Please contact administrator.",
              "error"
            );
          } else if (response.data.confirmation) {
            this.setState({
              userStatus: "REGISTERED",
              payloadResponse: response.data,
              btnSubmit: false,
            });
          } else {
            this.setState({
              userStatus: "REGISTERED",
              payloadResponse: response.data,
              btnSubmit: false,
            });
          }
        }
      } else {
        this.setState({ errorEmail: "Email not valid", isLoading: false });
      }
    }
    this.setState({ isLoading: false });
  };

  handleSendEmailOTP = async () => {
    let payloadResponse = this.state.payloadResponse;
    let sendCounter = this.state.sendCounter + 1;
    const countdown = 299;
    const counterMinutes = Math.floor(countdown / 60);
    const counter = countdown % 60;
    this.setState({
      isLoading: false,
      sendCounter,
      btnSend: false,
      minutes: 4,
      counterMinutes,
      seconds: counter,
      counter: `${counter}`,
    });

    const otpLastTry = new Date();
    this.setState({ otpLastTry });
    lsStore("webordering_otp", { lastTry: otpLastTry, counter: sendCounter });

    let timer = setInterval(() => {
      let seconds = this.state.seconds - 1;
      let counter = seconds.toString().length < 2 ? "0" + seconds : seconds;
      this.setState({ counter, seconds });
      if (seconds === 0) {
        let minutes = this.state.minutes - 1;
        let counterMinutes =
          minutes.toString().length < 2 ? "0" + minutes : minutes;
        this.setState({ counterMinutes, minutes, seconds: 59, counter: "59" });
        if (minutes < 0 && seconds === 0) {
          clearInterval(timer);
          this.setState({ btnSend: true });
        }
      }
    }, 1000);

    try {
      let payload = { email: payloadResponse.email };
      let response = await this.props.dispatch(AuthActions.sendOtp(payload));
      response = response.Data;
      // console.log(response)

      if (response.status === false) throw response.status;
      this.setState({ isLoading: false, box: true });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  handleEmailLogin = async (withOtp) => {
    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });
    try {
      let payload = { email: payloadResponse.email };

      if (withOtp) payload.codeOTP = this.state.txtOtp;
      else payload.password = this.state.password;
      console.log(payload);
      let response = await this.props.dispatch(AuthActions.login(payload));
      response = response.Data;
      console.log(response);
      if (response.status === false) throw response;
      response.isLogin = true;
      const offlineCart = localStorage.getItem("webordering_offlineCart");
      localStorage.clear();
      localStorage.setItem(
        "webordering_account",
        JSON.stringify(encryptor.encrypt(response))
      );
      localStorage.setItem("webordering_offlineCart", offlineCart);
      window.location.reload();
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      Swal.fire("Oppss!", error, "error");
      this.setState({ isLoading: false });
    }
  };

  handleEmailRegister = async () => {
    let phoneNumber = this.state.codePhoneNumber + this.state.phoneNumber;
    let password = this.state.password;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();

    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });

    try {
      let errorPhone = "";
      if (phoneNumber === "") errorPhone = "Phone number is empty";
      if (phoneNumber.length <= 10) errorPhone = "Phone number is not valid";

      let errorPassword = "";
      if (password === "") errorPassword = "Password is empty";
      if (password.length < 8)
        errorPassword = "Password consists of 8 characters or more";
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password))
        errorPassword = `Password must contain 1 uppercase, 1 lowercase, and 1 special character`;

      if (
        (enableRegisterWithPassword && errorPassword !== "") ||
        errorPhone !== ""
      ) {
        this.setState({ errorPassword, isLoading: false, errorPhone });
        return;
      }

      let payload = {
        phoneNumber: phoneNumber,
        email: payloadResponse.email,
        password: generate([8], { specials: 0, nums: 2, uppers: 3, lowers: 3 }),
        username: payloadResponse.email,
        name: this.state.name,
      };
      if (this.state.password !== "") payload.password = password;
      // console.log(payload)
      // return
      let response = await this.props.dispatch(
        AuthActions.register(payload, enableRegisterWithPassword)
      );
      response = response.Data;
      // console.log(response)
      if (response.message) {
        this.setState({ isLoading: false, errorLogin: response.message });
        Swal.fire("Oppss!", response.message, "error");
      } else {
        enableRegisterWithPassword &&
          localStorage.setItem(
            "webordering_account",
            JSON.stringify(
              encryptor.encrypt({
                phoneNumber: phoneNumber,
                email: payloadResponse.email,
              })
            )
          );

        try {
          this.setState({
            payloadResponse: payload,
            btnSubmit: false,
            isLoading: false,
            sendCounter: 2,
            btnSend: false,
          });
          if (enableRegisterWithPassword) this.handleEmailLogin();
          else {
            this.setState({ showPage: "emailSignUp" });
            this.handleSendEmailOTP();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (
        err.response &&
        err.response.data &&
        err.response.data.Data &&
        err.response.data.Data.message
      ) {
        error = err.response.data.Data.message;
      }
      Swal.fire("Oppss!", error, "error");
      this.setState({ isLoading: false });
    }
  };

  render() {
    let { isLoading, userStatus, method, email, phoneNumber } = this.state;
    return (
      <div>
        {isLoading && <Loading />}
        <div
          className="modal fade"
          id="login-register-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            {userStatus === "REGISTERED" ? (
              <Login
                method={method}
                username={method === "email" ? email : phoneNumber}
                enablePassword={this.state.enableRegisterWithPassword}
                handleSubmit={
                  method === "email"
                    ? this.handleEmailLogin
                    : this.handleMobileLogin
                }
                handleBackButtonClick={() =>
                  this.setState({ userStatus: "NOT_CHECKED" })
                }
                handleChange={this.handleInput}
                sendOtpToPhone={this.handleSendOTP}
                sendOtpToEmail={this.handleSendEmailOTP}
                isSubmitting={!this.state.btnSubmit}
                otpTimer={{
                  isSending: !this.state.btnSend,
                  sendCounter: this.state.sendCounter,
                  counterMinutes: this.state.counterMinutes,
                  counter: this.state.counter,
                }}
              ></Login>
            ) : userStatus === "NOT_REGISTERED" ? (
              <SignUp
                method={method}
                initialUserData={this.state.payloadResponse}
                handleBackButtonClick={() =>
                  this.setState({ userStatus: "NOT_CHECKED" })
                }
                handleChange={this.handleInputRegister}
                handleEmailSubmit={this.handleEmailRegister}
                handlePhoneSubmit={this.handleMobileRegister}
                sendOtpToPhone={this.handleSendOTP}
                sendOtpToEmail={this.handleSendEmailOTP}
                handleEmailLogin={this.handleEmailLogin}
                handlePhoneLogin={this.handleMobileLogin}
                signUpSuccess={this.state.signUpSuccess}
                isSubmitting={!this.state.btnSubmit}
                otpTimer={{
                  isSending: !this.state.btnSend,
                  sendCounter: this.state.sendCounter,
                  counterMinutes: this.state.counterMinutes,
                  counter: this.state.counter,
                }}
                errorPhone={this.state.errorPhone}
                errorEmail={this.state.errorEmail}
                errorPassword={this.state.errorPassword}
                enablePassword={this.state.enableRegisterWithPassword}
              ></SignUp>
            ) : (
              <Portal
                initialMethod={method}
                handleMethodChange={(value) => this.setState({ method: value })}
                handlePhoneCheck={this.handleMobileCheck}
                handleChange={this.handleInput}
                handleEmailCheck={this.handleEmailCheck}
                error={this.state.errorPhone || this.state.errorEmail}
              ></Portal>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const reducer = "masterdata";

const mapStateToProps = (state) => ({
  companyInfo: state[reducer].companyInfo.data,
  fetchingCompanyInfo: state[reducer].companyInfo.isFetching,
  companyInfoError: state[reducer].companyInfo.errors,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
