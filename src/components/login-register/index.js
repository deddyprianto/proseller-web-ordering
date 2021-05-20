import React, { Component } from "react";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import generate from "password-generation";
import { AuthActions } from "../../redux/actions/AuthAction";

import Login from "./Login";
import Portal from "./Portal";
import SignUp from "./Signup";

import { lsLoad, lsStore } from "../../helpers/localStorage";

import config from "../../config";

const regEmail =
  /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method: this.props.defaultEmail || "phone",
      userStatus: "NOT_CHECKED",
      isLoading: false,
      payloadResponse: {},

      phoneNumber: this.props.defaultPhoneNumber || "",
      modalShow: false,
      errorPhone: "",
      show: false,
      errorLogin: "",
      language: "English",
      dictionary: {},
      configLang: {},
      infoCompany: null,

      otpLastTry: null,
      allowSendEmailOTP: true,
      allowSendPhoneOTP: true,
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
      errorName: "",
      email: this.props.defaultEmail || "",
      errorEmail: "",

      enableRegisterWithPassword: false,
      errorPassword: "",
      signUpSuccess: false,

      loginByMobile: false,
      loginByEmail: false,
      enableSMSOTP: false,
      enableWhatsappOTP: false,
      enableOrdering: false,
      minimumAge: null,
    };
  }

  componentDidMount = async () => {
    const otpData = lsLoad(config.prefix + "_otp") || null;
    if (otpData) {
      const waitTime = this.state.method === "phone" ? 60 : 300;
      const countdown =
        waitTime - Math.floor((new Date() - new Date(otpData.lastTry)) / 1000);
      if (countdown > 0) {
        console.log("OTP cant be sent now");
        const counterMinutes = Math.floor(countdown / 60);
        const counter = countdown % 60;
        this.setState({
          allowSendEmailOTP: false,
          allowSendPhoneOTP: false,
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
              allowSendPhoneOTP: true,
              counterMinutes,
              minutes,
              seconds: 59,
              counter: "59",
            });
            if (minutes < 0 && seconds === 0) {
              clearInterval(timer);
              this.setState({ btnSend: true, allowSendEmailOTP: true });
            }
          }
        }, 1000);
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      let enableRegisterWithPassword = this.props.setting.find((items) => {
        return items.settingKey === "EnableRegisterWithPassword";
      });
      if (enableRegisterWithPassword) {
        this.setState({
          enableRegisterWithPassword: enableRegisterWithPassword.settingValue,
        });
      }

      let loginByMobile = this.props.setting.find((items) => {
        return items.settingKey === "LoginByMobile";
      });
      if (loginByMobile) {
        this.setState({ loginByMobile: loginByMobile.settingValue || true });
      }

      let loginByEmail = this.props.setting.find((items) => {
        return items.settingKey === "LoginByEmail";
      });
      if (loginByEmail) {
        this.setState({ loginByEmail: loginByEmail.settingValue || true });
      }
      if (
        loginByEmail &&
        (loginByEmail.settingValue || true) &&
        loginByMobile &&
        !loginByMobile.settingValue
      ) {
        this.setState({ method: "email" });
      }

      let mobileOTP = this.props.setting.find((items) => {
        return items.settingKey === "MobileOTP";
      });
      if (mobileOTP) {
        let check = mobileOTP.settingValue !== "WHATSAPP";
        this.setState({ enableSMSOTP: check, enableWhatsappOTP: !check });
      }

      let enableOrdering = this.props.setting.find((items) => {
        return items.settingKey === "EnableOrdering";
      });
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }

      let minimumAge = this.props.setting.find((items) => {
        return items.settingKey === "MinimumAge";
      });
      if (minimumAge) {
        this.setState({ minimumAge: Number(minimumAge.settingValue) });
      }
      if (this.props.defaultEmail) {
        this.setState({
          email: this.props.defaultEmail,
          method: "email",
          userStatus: "NOT_REGISTERED",
          payloadResponse: { email: this.props.defaultEmail },
        });
      }
      if (this.props.defaultPhoneNumber) {
        this.setState({
          phoneNumber: this.props.defaultPhoneNumber,
          method: "phone",
          userStatus: "NOT_REGISTERED",
          payloadResponse: { phoneNumber: this.props.defaultPhoneNumber },
        });
      }
      if (this.props.referralCode) {
        this.setState({
          referralCode: this.props.referralCode,
        });
      }
    }

    if (this.state.method !== prevState.method) {
      const otpData = lsLoad(config.prefix + "_otp") || null;
      if (otpData) {
        const waitTime = this.state.method === "phone" ? 60 : 300;
        const countdown =
          waitTime -
          Math.floor((new Date() - new Date(otpData.lastTry)) / 1000);
        if (countdown > 0) {
          console.log("OTP cant be sent now");
          const counterMinutes = Math.floor(countdown / 60);
          const counter = countdown % 60;
          this.setState({
            allowSendEmailOTP: false,
            allowSendPhoneOTP: false,
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
            let counter =
              seconds.toString().length < 2 ? "0" + seconds : seconds;
            this.setState({ counter, seconds });
            if (seconds === 0) {
              let minutes = this.state.minutes - 1;
              let counterMinutes =
                minutes.toString().length < 2 ? "0" + minutes : minutes;
              this.setState({
                allowSendPhoneOTP: true,
                counterMinutes,
                minutes,
                seconds: 59,
                counter: "59",
              });
              if (minutes < 0 && seconds === 0) {
                clearInterval(timer);
                this.setState({ btnSend: true, allowSendEmailOTP: true });
              }
            }
          }, 1000);
        }
      }
    }

    if (this.state.isLoading !== prevState.isLoading) {
      if (this.state.isLoading) Swal.showLoading();
      else Swal.close();
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
    if (jenis === "name") {
      if (/^[A-Za-z\s]+$/.test(data)) this.setState({ errorName: "" });
      else this.setState({ errorName: "Name is alphabets only" });
    } else if (jenis === "phoneNumber") {
      this.setState({ errorPhone: "" });
      if (
        this.state.name !== "" &&
        this.state.phoneNumber.trim() !== "" &&
        this.state.phoneNumber.trim().length > 5 &&
        !enableRegisterWithPassword
      ) {
        this.setState({ btnSubmit: true });
      } else if (!enableRegisterWithPassword) {
        this.setState({ btnSubmit: false });
      } else {
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
    let enableSMSOTP = this.state.enableSMSOTP;
    let enableWhatsappOTP = this.state.enableWhatsappOTP;
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
      if (response && response.status === false) {
        this.setState({
          userStatus: "NOT_REGISTERED",
          payloadResponse: { phoneNumber },
          btnSubmit: false,
        });
      } else if (response) {
        if (response.data.status === "SUSPENDED") {
          Swal.fire(
            "Suspended!",
            "Your account has been suspended. Please contact administrator.",
            "error"
          );
        } else if (response.data.confirmation) {
          if (enableSMSOTP && !enableWhatsappOTP) this.handleSendOTP("SMSOTP");
          if (!enableSMSOTP && enableWhatsappOTP)
            this.handleSendOTP("WhatsappOTP");
          this.setState({
            userStatus: "REGISTERED",
            payloadResponse: response.data,
            btnSubmit: false,
          });
        } else {
          if (enableSMSOTP && !enableWhatsappOTP) this.handleSendOTP("SMSOTP");
          if (!enableSMSOTP && enableWhatsappOTP)
            this.handleSendOTP("WhatsappOTP");
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

  handleSendOTP = async (sendBy = "SMSOTP") => {
    if (!this.state.enableRegisterWithPassword) {
      let payloadResponse = this.state.payloadResponse;
      let phoneNumber = this.state.phoneNumber;
      let sendCounter = this.state.sendCounter + 1;
      if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();

      if (sendCounter <= 2) {
        const countdown = 59;
        const counterMinutes = Math.floor(countdown / 60);
        const counter = countdown % 60;
        this.setState({
          isLoading: false,
          sendCounter,
          btnSend: false,
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

      const otpLastTry = new Date();
      this.setState({ otpLastTry });
      lsStore(config.prefix + "_otp", {
        lastTry: otpLastTry,
        counter: sendCounter,
      });

      try {
        let payload = { phoneNumber: this.state.phoneNumber, sendBy };
        if (this.state.sendCounter > 2)
          payload = { email: payloadResponse.email };

        // console.log(this.state.sendCounter)
        console.log(payload);
        let response = await this.props.dispatch(AuthActions.sendOtp(payload));
        response = response.Data;
        // console.log(response)

        if (response.status === false) throw response.status;
        this.setState({ isLoading: false, box: true });
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false });
      }
    }
  };

  handleMobileLogin = async (withOtp) => {
    let payloadResponse = this.state.payloadResponse;
    Swal.showLoading();
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
      const offlineCart = lsLoad(config.prefix + "_offlineCart", true);
      const lsKeyList = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key.includes(`${config.prefix}_`) &&
          !key.includes(`${config.prefix}_scanTable`) &&
          !key.includes(`${config.prefix}_ordering_mode`)
        ) {
          lsKeyList.push(key);
        }
      }
      lsKeyList.forEach((key) => localStorage.removeItem(key));
      lsStore(config.prefix + "_account", encryptor.encrypt(response), true);
      lsStore(config.prefix + "_offlineCart", offlineCart, true);
      const url = window.location.href.split("?")[0];
      window.location.replace(url);
      window.location.reload();
    } catch (err) {
      console.log(err);
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      Swal.fire("Oppss!", error, "error");
    }
  };

  getAge = (DOB) => {
    let today = new Date();
    let birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    return age;
  };

  handleMobileRegister = async () => {
    let enableSMSOTP = this.state.enableSMSOTP;
    let enableWhatsappOTP = this.state.enableWhatsappOTP;
    let payloadResponse = this.state.payloadResponse;

    try {
      let password = this.state.password;
      let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
      let email = this.state.email.toLowerCase().trim();
      const fields = this.props.fields;
      let mandatory = [];
      mandatory = fields.filter((items) => {
        return items.signUpField === true && items.mandatory === true;
      });
      mandatory.push({ fieldName: "name", displayName: "Name" });
      mandatory.push({ fieldName: "phoneNumber", displayName: "Phone Number" });
      mandatory.push({ fieldName: "email", displayName: "Email" });
      mandatory.push({ fieldName: "password", displayName: "Password" });

      const customFields =
        fields &&
        fields.reduce((acc, field) => {
          if (!field.signUpField) return { ...acc };
          return {
            ...acc,
            [field.fieldName]: this.state[field.fieldName] || "",
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

      let errorEmail = "";
      let cekEmail = regEmail.test(String(email).toLowerCase());
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
        this.setState({ errorPassword, errorEmail });
        return;
      }

      if (!enableRegisterWithPassword)
        password = generate([8], {
          specials: 0,
          nums: 2,
          uppers: 3,
          lowers: 3,
        });

      let payload = {
        phoneNumber: payloadResponse.phoneNumber,
        email: email,
        password: password,
        username: payloadResponse.phoneNumber,
        ...(this.state.referralCode && {
          referralCode: this.state.referralCode,
        }),
        ...customFields,
      };

      let listName = "";
      mandatory.forEach((field) => {
        if (
          !payload[field.fieldName] ||
          (payload[field.fieldName] &&
            (payload[field.fieldName] === "" ||
              payload[field.fieldName] === "Invalid date"))
        ) {
          if (
            this.state[field.fieldName] &&
            this.state[field.fieldName] !== "" &&
            this.state[field.fieldName] !== "Invalid date"
          ) {
            payload[field.fieldName] = this.state[field.fieldName];
            field.check = true;
          } else if (
            this.state[field.fieldName] &&
            this.state[field.fieldName] !== "" &&
            this.state[field.fieldName] !== "Invalid date" &&
            field.defaultValue &&
            field.defaultValue !== "-" &&
            field.defaultValue !== ""
          ) {
            payload[field.fieldName] = field.defaultValue;
            field.check = true;
          } else {
            listName += field.displayName + ", ";
            field.check = false;
          }
        } else {
          field.check = true;
        }
      });

      mandatory = mandatory.filter((items) => {
        return items.check === false;
      });
      if (mandatory.length > 0) {
        listName = listName.substr(0, listName.length - 2);
        Swal.fire("Oppss!", `${listName} is required`, "error");
        return;
      }

      // Validate minimum age
      if (this.state.minimumAge > 0) {
        const currentAge = this.getAge(payload.birthDate);
        if (currentAge < this.state.minimumAge) {
          Swal.fire(
            "Oppss!",
            `The minimum age for registration is ${this.state.minimumAge} years old`,
            "error"
          );
          return;
        }
      }

      this.setState({ isLoading: true });
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
          lsStore(
            config.prefix + "_account",
            encryptor.encrypt({
              phoneNumber: payloadResponse.phoneNumber,
              email: this.state.email.toLowerCase().trim(),
            }),
            true
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
            this.setState({ showPage: "mobileSignUp", signUpSuccess: true });
            if (enableSMSOTP && !enableWhatsappOTP)
              this.handleSendOTP("SMSOTP");
            if (!enableSMSOTP && enableWhatsappOTP)
              this.handleSendOTP("WhatsappOTP");
            if (enableSMSOTP && enableWhatsappOTP) this.handleSendOTP("SMSOTP");
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
      let cekEmail = regEmail.test(String(email).toLowerCase());
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
            this.handleSendEmailOTP();
            this.setState({
              userStatus: "REGISTERED",
              payloadResponse: response.data,
              btnSubmit: false,
            });
          } else {
            this.handleSendEmailOTP();
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
    if (!this.state.enableRegisterWithPassword) {
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
      lsStore(config.prefix + "_otp", {
        lastTry: otpLastTry,
        counter: sendCounter,
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

      try {
        let payload = { email: this.state.email.toLowerCase() };
        let response = await this.props.dispatch(AuthActions.sendOtp(payload));
        response = response.Data;
        // console.log(response)

        if (response.status === false) throw response.status;
        this.setState({ isLoading: false, box: true });
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false });
      }
    }
  };

  handleEmailLogin = async (withOtp) => {
    let payloadResponse = this.state.payloadResponse;
    Swal.showLoading();
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
      const offlineCart = lsLoad(config.prefix + "_offlineCart", true);
      const lsKeyList = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key.includes(`${config.prefix}_`) &&
          !key.includes(`${config.prefix}_scanTable`) &&
          !key.includes(`${config.prefix}_ordering_mode`)
        ) {
          lsKeyList.push(key);
        }
      }
      lsKeyList.forEach((key) => localStorage.removeItem(key));
      lsStore(config.prefix + "_account", encryptor.encrypt(response), true);
      if (offlineCart !== null) {
        lsStore(config.prefix + "_offlineCart", offlineCart, true);
      }
      const url = window.location.href.split("?")[0];
      window.location.replace(url);
      window.location.reload();
    } catch (err) {
      console.log(err);
      Swal.close();
      let error = "Account not exist";
      if (err.message) {
        error = err.message;
      }
      Swal.fire("Oppss!", error, "error");
    }
  };

  handleEmailRegister = async () => {
    let phoneNumber = this.state.phoneNumber;
    let password = this.state.password;
    let enableRegisterWithPassword = this.state.enableRegisterWithPassword;
    if (phoneNumber.charAt(0) !== "+") phoneNumber = "+" + phoneNumber.trim();

    let payloadResponse = this.state.payloadResponse;

    try {
      let errorPhone = "";
      const fields = this.props.fields;
      let mandatory = [];
      mandatory = fields.filter((items) => {
        return items.signUpField === true && items.mandatory === true;
      });
      mandatory.push({ fieldName: "name", displayName: "Name" });
      mandatory.push({ fieldName: "phoneNumber", displayName: "Phone Number" });
      mandatory.push({ fieldName: "email", displayName: "Email" });
      mandatory.push({ fieldName: "password", displayName: "Password" });

      const customFields =
        fields &&
        fields.reduce((acc, field) => {
          if (!field.signUpField) return { ...acc };
          return {
            ...acc,
            [field.fieldName]: this.state[field.fieldName] || "",
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

      if (phoneNumber === "") errorPhone = "Phone number is empty";
      if (phoneNumber.length < 6) errorPhone = "Phone number is not valid";

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
        this.setState({ errorPassword, errorPhone });
        return;
      }

      if (!enableRegisterWithPassword)
        password = generate([8], {
          specials: 0,
          nums: 2,
          uppers: 3,
          lowers: 3,
        });

      let payload = {
        phoneNumber: phoneNumber,
        email: payloadResponse.email.toLowerCase(),
        password: password,
        username: payloadResponse.email.toLowerCase(),
        ...(this.state.referralCode && {
          referralCode: this.state.referralCode,
        }),
        ...customFields,
      };

      let listName = "";
      mandatory.forEach((field) => {
        if (
          !payload[field.fieldName] ||
          (payload[field.fieldName] &&
            (payload[field.fieldName] === "" ||
              payload[field.fieldName] === "Invalid date"))
        ) {
          if (
            this.state[field.fieldName] &&
            this.state[field.fieldName] !== "" &&
            this.state[field.fieldName] !== "Invalid date"
          ) {
            payload[field.fieldName] = this.state[field.fieldName];
            field.check = true;
          } else if (
            this.state[field.fieldName] &&
            this.state[field.fieldName] !== "" &&
            this.state[field.fieldName] !== "Invalid date" &&
            field.defaultValue &&
            field.defaultValue !== "-" &&
            field.defaultValue !== ""
          ) {
            payload[field.fieldName] = field.defaultValue;
            field.check = true;
          } else {
            listName += field.displayName + ", ";
            field.check = false;
          }
        } else {
          field.check = true;
        }
      });

      mandatory = mandatory.filter((items) => {
        return items.check === false;
      });
      if (mandatory.length > 0) {
        listName = listName.substr(0, listName.length - 2);
        Swal.fire("Oppss!", `${listName} is required`, "error");
        return;
      }

      // Validate minimum age
      if (this.state.minimumAge > 0) {
        const currentAge = this.getAge(payload.birthDate);
        if (currentAge < this.state.minimumAge) {
          Swal.fire(
            "Oppss!",
            `The minimum age for registration is ${this.state.minimumAge} years old`,
            "error"
          );
          return;
        }
      }

      this.setState({ isLoading: true });
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
          lsStore(
            config.prefix + "_account",
            encryptor.encrypt({
              phoneNumber: phoneNumber,
              email: payloadResponse.email,
            }),
            true
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
            this.setState({ showPage: "emailSignUp", signUpSuccess: true });
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
    let {
      // isLoading,
      userStatus,
      method,
      email,
      phoneNumber,
      loginByEmail,
      loginByMobile,
      enableSMSOTP,
      enableWhatsappOTP,
      enableOrdering,
      minimumAge,
    } = this.state;
    return (
      <div>
        {/* {isLoading ? Swal.showLoading() : Swal.close()} */}
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
                sendOtpToPhone={(sendBy) => this.handleSendOTP(sendBy)}
                sendOtpToEmail={this.handleSendEmailOTP}
                isSubmitting={!this.state.btnSubmit}
                otpTimer={{
                  isSending: !this.state.btnSend,
                  sendCounter: this.state.sendCounter,
                  counterMinutes: this.state.counterMinutes,
                  counter: this.state.counter,
                }}
                enableSMSOTP={enableSMSOTP}
                enableWhatsappOTP={enableWhatsappOTP}
                enableOrdering={enableOrdering}
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
                sendOtpToPhone={(sendBy) => this.handleSendOTP(sendBy)}
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
                errorName={this.state.errorName}
                enablePassword={this.state.enableRegisterWithPassword}
                enableOrdering={enableOrdering}
                enableSMSOTP={enableSMSOTP}
                enableWhatsappOTP={enableWhatsappOTP}
                minimumAge={minimumAge}
              ></SignUp>
            ) : (
              <Portal
                color={this.props.color.background}
                method={method}
                handleMethodChange={(value) => {
                  this.setState({ method: value });
                }}
                handlePhoneCheck={this.handleMobileCheck}
                handleChange={this.handleInput}
                handleEmailCheck={this.handleEmailCheck}
                error={this.state.errorPhone || this.state.errorEmail}
                loginByEmail={loginByEmail}
                loginByMobile={loginByMobile}
                enableOrdering={enableOrdering}
                companyInfo={this.props.companyInfo}
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
  fields: state.customer.fields,
  setting: state.order.setting,
  color: state.theme.color,
  defaultPhoneNumber: state.customer.defaultPhoneNumber,
  defaultEmail: state.customer.defaultEmail,
  referralCode: state.auth.invitationCode,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
