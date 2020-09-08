import React, { Component } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import generate from "password-generation";
import { Button, Input } from "reactstrap";
import { AuthActions } from "../../redux/actions/AuthAction";
import Loading from "../loading";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPage: "mobileCheck",
      payloadResponse: {},

      phoneNumber: "",
      defaultCodePhoneNumber: "+65",
      codePhoneNumber: "+65",
      defaultCountry: "SG",
      modalShow: false,
      errorPhone: "",
      show: false,
      errorLogin: "",
      language: "English",
      dictionary: {},
      configLang: {},
      infoCompany: null,

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
      errorPassword: "",

      name: "",
      email: "",
      errorEmail: "",

      enableRegisterWithPassword: false,
      showPassword: false,
    };
  }

  componentDidMount = async () => {
    let infoCompany = await encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    let time = setInterval(async () => {
      infoCompany = await encryptor.decrypt(
        JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
      );
      // console.log(infoCompany)
      if (infoCompany) {
        if (infoCompany.enableRegisterWithPassword !== false)
          this.setState({ enableRegisterWithPassword: true, otp: false });
        clearInterval(time);
      }
    }, 0);
  };

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

  // Mobile login mode

  handleMobileCheck = async () => {
    let phoneNumber = this.state.codePhoneNumber + this.state.phoneNumber;
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
          showPage: "mobileRegister",
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
            showPage: "mobileLogin",
            payloadResponse: response.data,
            btnSubmit: false,
          });
        } else {
          this.setState({
            showPage: "mobileLogin",
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
    let phoneNumber = this.state.codePhoneNumber + this.state.phoneNumber;
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

  handleMobileLogin = async () => {
    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });
    try {
      let payload = { phoneNumber: payloadResponse.phoneNumber };

      if (this.state.otp) payload.codeOTP = this.state.txtOtp;
      else payload.password = this.state.password;
      // console.log(payload)
      let response = await this.props.dispatch(AuthActions.login(payload));
      response = response.Data;
      // console.log(response)
      if (response.status === false) throw response;
      response.isLogin = true;
      const offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      localStorage.clear();
      localStorage.setItem(
        `${config.prefix}_account`,
        JSON.stringify(encryptor.encrypt(response))
      );
      localStorage.setItem(`${config.prefix}_offlineCart`, offlineCart);
      window.location.reload();
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      this.setState({ isLoading: false });
      Swal.fire("Oppss!", error, "error");
    }
  };

  viewMobileCheck = () => {
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Mobile Log In / Sign Up
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label htmlFor="name">
              Enter your Mobile Number <span className="required">*</span>
            </label>
            <div style={{ display: "flex", marginBottom: 20 }}>
              <div style={{ display: "flex" }}>
                <PhoneInput
                  country={this.state.defaultCountry}
                  value={this.state.defaultCodePhoneNumber}
                  enableSearch={true}
                  autoFormat={false}
                  onChange={(e) => this.setState({ codePhoneNumber: `+${e}` })}
                  inputStyle={{
                    width: "0px",
                    border: "1px solid #FFF",
                    height: 40,
                  }}
                />
                <div
                  style={{
                    height: 45,
                    width: 40,
                    left: 55,
                    top: 45,
                    position: "absolute",
                    backgroundColor: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.state.codePhoneNumber}
                </div>
              </div>
              <Input
                type="number"
                value={this.state.phoneNumber}
                onChange={(e) =>
                  this.handleInput("phoneNumber", e.target.value)
                }
                style={{ marginLeft: 20, height: 40 }}
              />
            </div>
          </div>
          {this.state.errorPhone === "" ? null : (
            <div style={{ marginTop: -14, marginBottom: 20, color: "red" }}>
              {this.state.errorPhone}
            </div>
          )}
          <Button
            className="button"
            style={{ width: "100%", borderRadius: 5 }}
            onClick={() => this.handleMobileCheck()}
          >
            Next
          </Button>
          <div
            className="modal-title"
            onClick={() => this.setState({ showPage: "emailCheck" })}
            style={{ marginTop: 20, textAlign: "center", cursor: "pointer" }}
          >
            Use Email Address to Sign In / Sign Up
          </div>
        </div>
      </div>
    );
  };

  viewUseOTP = () => {
    return (
      <div>
        <label for="txtOtp">
          Enter 4 digin OTP <span className="required">*</span>
        </label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="password"
            className="woocommerce-Input woocommerce-Input--text input-text"
            style={{ height: 50, width: "40%" }}
            onChange={(e) => this.handleInput("txtOtp", e.target.value)}
          />
          <div style={{ width: "57%" }}>
            <Button
              disabled={!this.state.btnSend}
              className="button"
              style={{
                width: "100%",
                fontSize: 12,
                paddingLeft: 5,
                paddingRight: 5,
                height: 50,
              }}
              onClick={() => this.handleSendOTP()}
            >
              {this.state.sendCounter > 0
                ? this.state.sendCounter >= 2
                  ? "Get OTP via Email"
                  : "Resend OTP"
                : "Get OTP via SMS"}
            </Button>
            {!this.state.btnSend && (
              <span
                className="text-muted"
                style={{ fontSize: 10, marginTop: 3, marginLeft: 10 }}
              >{`Resend after ${this.state.counterMinutes}:${this.state.counter}`}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  viewUsePassword = () => {
    let showPassword = this.state.showPassword;
    return (
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <div>
          <label for="password">
            Enter Password <span className="required">*</span>
          </label>
          <div style={{ display: "flex" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) => this.handleInput("password", e.target.value)}
              style={{
                borderRadius: 5,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <div
              style={{
                width: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #cccccc",
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
            >
              <i
                className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => {
                  this.setState({ showPassword: showPassword ? false : true });
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          {/* <div>Or</div>
          <div>
            <Button
              color="link"
              size="lg"
              onClick={() => this.setState({ showPage: "forgotPassword" })}
            >
              Forgot Password?
            </Button>
          </div> */}
        </div>
      </p>
    );
  };

  viewMobileLogin = () => {
    let phoneNumber = this.state.codePhoneNumber + this.state.phoneNumber;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "mobileCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Mobile Sign In
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Sign in to ${phoneNumber}`}</p>
          {/* <div style={{ flexDirection: "row", marginBottom: 20 }}>
            {
              enableRegisterWithPassword &&
              <Button className={!this.state.otp ? "use-select" : "un-select"} style={{ height: 50 }} onClick={() => this.setState({ otp: false })}>Use Password</Button>
            }
            {
              !enableRegisterWithPassword &&
              <Button className={this.state.otp ? "use-select" : "un-select"} style={{ height: 50 }} onClick={() => this.setState({ otp: true })}>Use SMS OTP</Button>
            }
          </div> */}
          {this.state.otp && this.viewUseOTP()}
          {!this.state.otp && this.viewUsePassword()}
          <Button
            disabled={!this.state.btnSubmit}
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleMobileLogin()}
          >
            Submit
          </Button>
        </div>
      </div>
    );
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
        localStorage.setItem(
          `${config.prefix}_account`,
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

  viewMobileRegister = () => {
    let payloadResponse = this.state.payloadResponse;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    let showPassword = this.state.showPassword;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "mobileCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Mobile Register
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Register for ${
            payloadResponse.phoneNumber || "-"
            }`}</p>
          <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label for="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) => this.handleInputRegister("name", e.target.value)}
            />
          </p>

          <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label for="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) =>
                this.handleInputRegister("email", e.target.value)
              }
            />
            {!this.state.errorEmail !== "" && (
              <div
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                  color: "red",
                  fontSize: 10,
                  lineHeight: "15px",
                }}
              >
                {this.state.errorEmail}
              </div>
            )}
          </p>

          {enableRegisterWithPassword && (
            <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
              <label for="name">
                Password <span className="required">*</span>
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="woocommerce-Input woocommerce-Input--text input-text"
                  onChange={(e) =>
                    this.handleInputRegister("password", e.target.value)
                  }
                  style={{
                    borderRadius: 5,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <div
                  style={{
                    width: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #cccccc",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <i
                    className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    onClick={() => {
                      this.setState({
                        showPassword: showPassword ? false : true,
                      });
                    }}
                  />
                </div>
              </div>
              {this.state.errorPassword !== "" && (
                <div
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    color: "red",
                    fontSize: 10,
                    lineHeight: "15px",
                  }}
                >
                  {this.state.errorPassword}
                </div>
              )}
            </p>
          )}

          <Button
            disabled={!this.state.btnSubmit}
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleMobileRegister()}
          >
            Create Account
          </Button>
        </div>
      </div>
    );
  };

  viewMobileSignUp = () => {
    let payloadResponse = this.state.payloadResponse;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "mobileRegister" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Mobile Register
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted" style={{ textAlign: "center" }}>
            You will receive 4-digit verification code via SMS at
          </p>
          <h2 style={{ textAlign: "center", marginTop: 10 }}>
            {payloadResponse.phoneNumber || "-"}
          </h2>

          <Button
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.setState({ showPage: "mobileSignupOtp" })}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  viewMobileSignupOpt = () => {
    let payloadResponse = this.state.payloadResponse;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "mobileCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Mobile Sign In
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Sign in to ${
            payloadResponse.phoneNumber || "-"
            }`}</p>
          {this.state.otp && this.viewUseOTP()}
          {!this.state.otp && this.viewUsePassword()}
          <Button
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleMobileLogin()}
          >
            Continue
          </Button>
        </div>
      </div>
    );
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
            showPage: "emailRegister",
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
              showPage: "emailLogin",
              payloadResponse: response.data,
              btnSubmit: false,
            });
          } else {
            this.setState({
              showPage: "emailLogin",
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

  viewEmailCheck = () => {
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Email Log In / Sign Up
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label for="email">
              Enter your Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) => this.handleInput("email", e.target.value)}
            />
          </p>
          {!this.state.errorEmail === "" ? null : (
            <div style={{ marginTop: -14, marginBottom: 20, color: "red" }}>
              {this.state.errorEmail}
            </div>
          )}
          <Button
            className="button"
            style={{ width: "100%", borderRadius: 5 }}
            onClick={() => this.handleEmailCheck()}
          >
            Next
          </Button>
          <div
            className="modal-title"
            onClick={() => this.setState({ showPage: "mobileCheck" })}
            style={{ marginTop: 20, textAlign: "center", cursor: "pointer" }}
          >
            Use Mobile Number to Sign In / Sign Up
          </div>
        </div>
      </div>
    );
  };

  handleSendEmailOTP = async () => {
    let payloadResponse = this.state.payloadResponse;
    let sendCounter = this.state.sendCounter + 1;
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

  handleEmailLogin = async () => {
    let payloadResponse = this.state.payloadResponse;
    this.setState({ isLoading: true });
    try {
      let payload = { email: payloadResponse.email };

      if (this.state.otp) payload.codeOTP = this.state.txtOtp;
      else payload.password = this.state.password;
      // console.log(payload)
      let response = await this.props.dispatch(AuthActions.login(payload));
      response = response.Data;
      // console.log(response)
      if (response.status === false) throw response;
      response.isLogin = true;
      const offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      localStorage.clear();
      localStorage.setItem(
        `${config.prefix}_account`,
        JSON.stringify(encryptor.encrypt(response))
      );
      localStorage.setItem(`${config.prefix}_offlineCart`, offlineCart);
      window.location.reload();
    } catch (err) {
      console.log(`error on handleEmailLogin : ${err}`);
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      this.setState({ isLoading: false });
      Swal.fire("Oppss!", error, "error");
    }
  };

  viewUseEmailOTP = () => {
    return (
      <div>
        <label for="txtOtp">
          Enter 4 digin OTP <span className="required">*</span>
        </label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="password"
            className="woocommerce-Input woocommerce-Input--text input-text"
            style={{ height: 50, width: "40%" }}
            onChange={(e) => this.handleInput("txtOtp", e.target.value)}
          />
          <div style={{ width: "57%" }}>
            <Button
              disabled={!this.state.btnSend}
              className="button"
              style={{
                width: "100%",
                fontSize: 12,
                paddingLeft: 5,
                paddingRight: 5,
                height: 50,
              }}
              onClick={() => this.handleSendEmailOTP()}
            >
              {this.state.sendCounter > 0 ? "Resend OTP" : "Get OTP via Email"}
            </Button>
            {!this.state.btnSend && (
              <span
                className="text-muted"
                style={{ fontSize: 10, marginTop: 3, marginLeft: 10 }}
              >{`Resend after ${this.state.counterMinutes}:${this.state.counter}`}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  viewEmailLogin = () => {
    let email = this.state.email;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "emailCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Email Sign In
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Sign in to ${email}`}</p>
          {/* <div style={{ flexDirection: "row", marginBottom: 20 }}>
            {
              enableRegisterWithPassword &&
              <Button className={!this.state.otp ? "use-select" : "un-select"} style={{ height: 50 }} onClick={() => this.setState({ otp: false })}>Use Password</Button>
            }
            {
              !enableRegisterWithPassword &&
              <Button className={this.state.otp ? "use-select" : "un-select"} style={{ height: 50 }} onClick={() => this.setState({ otp: true })}>Use Email OTP</Button>
            }
          </div> */}
          {this.state.otp && this.viewUseEmailOTP()}
          {!this.state.otp && this.viewUsePassword()}
          <Button
            disabled={!this.state.btnSubmit}
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleEmailLogin()}
          >
            Submit
          </Button>
        </div>
      </div>
    );
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
        localStorage.setItem(
          `${config.prefix}_account`,
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

  viewEmailRegister = () => {
    let payloadResponse = this.state.payloadResponse;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    let showPassword = this.state.showPassword;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "emailCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Email Register
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Register for ${
            payloadResponse.email || "-"
            }`}</p>
          <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label for="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) => this.handleInputRegister("name", e.target.value)}
            />
          </p>

          <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label for="name">
              Phone Number <span className="required">*</span>
            </label>
            <div style={{ display: "flex", marginBottom: 20 }}>
              <div style={{ display: "flex" }}>
                <PhoneInput
                  country={this.state.defaultCountry}
                  value={this.state.defaultCodePhoneNumber}
                  enableSearch={true}
                  autoFormat={false}
                  onChange={(e) => this.setState({ codePhoneNumber: `+${e}` })}
                  inputStyle={{
                    width: "0px",
                    border: "1px solid #FFF",
                    height: 40,
                  }}
                />
                <div
                  style={{
                    height: 45,
                    width: 40,
                    left: 55,
                    top: 183,
                    position: "absolute",
                    backgroundColor: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.state.codePhoneNumber}
                </div>
              </div>
              <Input
                type="number"
                value={this.state.phoneNumber}
                onChange={(e) =>
                  this.handleInputRegister("phoneNumber", e.target.value)
                }
                style={{ marginLeft: 20, height: 40 }}
              />
            </div>
          </div>
          {this.state.errorPhone === "" ? null : (
            <div
              style={{
                marginTop: -14,
                marginBottom: 5,
                color: "red",
                fontSize: 10,
                lineHeight: "15px",
              }}
            >
              {this.state.errorPhone}
            </div>
          )}
          {enableRegisterWithPassword && (
            <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
              <label for="name">
                Password <span className="required">*</span>
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="woocommerce-Input woocommerce-Input--text input-text"
                  onChange={(e) =>
                    this.handleInputRegister("password", e.target.value)
                  }
                  style={{
                    borderRadius: 5,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <div
                  style={{
                    width: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #cccccc",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <i
                    className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    onClick={() => {
                      this.setState({
                        showPassword: showPassword ? false : true,
                      });
                    }}
                  />
                </div>
              </div>
              {this.state.errorPassword === "" ? null : (
                <div
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    color: "red",
                    fontSize: 10,
                    lineHeight: "15px",
                  }}
                >
                  {this.state.errorPassword}
                </div>
              )}
            </p>
          )}
          <Button
            disabled={!this.state.btnSubmit}
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleEmailRegister()}
          >
            Create Account
          </Button>
        </div>
      </div>
    );
  };

  viewEmailSignUp = () => {
    let payloadResponse = this.state.payloadResponse;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "emailRegister" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Email Register
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted" style={{ textAlign: "center" }}>
            You will receive 4-digit verification code via Email at
          </p>
          <h2 style={{ textAlign: "center", marginTop: 10 }}>
            {payloadResponse.email || "-"}
          </h2>

          <Button
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.setState({ showPage: "emailSignupOtp" })}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  viewEmailSignupOpt = () => {
    let payloadResponse = this.state.payloadResponse;
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onClick={() => this.setState({ showPage: "emailCheck" })}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Email Sign In
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          <p className="text-muted">{`Sign in to ${
            payloadResponse.email || "-"
            }`}</p>
          {this.state.otp && this.viewUseEmailOTP()}
          {!this.state.otp && this.viewUsePassword()}
          <Button
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.handleEmailLogin()}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  viewForgotPassword = () => {
    return (
      <div className="modal-content" style={{ width: "100%" }}>
        <div
          className="modal-header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5
            className="modal-title"
            id="exampleModalLabel"
            style={{ fontSize: 20 }}
          >
            Forgot Password
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 16,
            }}
            onClick={() => this.setState({ showPage: "mobileCheck" })}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <div className="modal-body">
          A password reset instruction has been sent to your e-mail / phone.
          <Button
            data-dismiss="modal"
            className="button"
            style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
            onClick={() => this.setState({ showPage: "mobileCheck" })}
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  render() {
    let { showPage, isLoading } = this.state;
    return (
      <div>
        <div
          className="modal fade"
          id="login-register-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            {showPage === "mobileCheck" && this.viewMobileCheck()}
            {showPage === "mobileLogin" && this.viewMobileLogin()}
            {showPage === "mobileRegister" && this.viewMobileRegister()}
            {showPage === "mobileSignUp" && this.viewMobileSignUp()}
            {showPage === "mobileSignupOtp" && this.viewMobileSignupOpt()}

            {showPage === "emailCheck" && this.viewEmailCheck()}
            {showPage === "emailLogin" && this.viewEmailLogin()}
            {showPage === "emailRegister" && this.viewEmailRegister()}
            {showPage === "emailSignUp" && this.viewEmailSignUp()}
            {showPage === "emailSignupOtp" && this.viewEmailSignupOpt()}

            {showPage === "forgotPassword" && this.viewForgotPassword()}
          </div>
        </div>
        {isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
