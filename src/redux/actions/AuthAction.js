import { CONSTANT } from "../../helpers";
import { loader } from "../actions/LoaderAction";
import { CRMService } from "../../Services/CRMService";
import config from "../../config";

import { lsLoad, lsStore } from "../../helpers/localStorage";

let encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

export const AuthActions = {
  check,
  sendOtp,
  login,
  register,
  refreshToken,
  setData,
  setInvitationCode
};

function check(payload) {
  return async (dispatch) => {
    dispatch(loader(true));
    let response = await CRMService.api(
      "POST",
      payload,
      "customer/login/check-account"
    );
    dispatch(setData(response, CONSTANT.KEY_CHECK_LOGIN));
    dispatch(loader(false));
    return response;
  };
}

function sendOtp(payload) {
  return async (dispatch, getState) => {
    dispatch(loader(true));
    
    // Check Sender Name
    try{
      const state = getState();
      if (state.order.setting.length > 0) {
        const find = state.order.setting.find(item => item.settingKey === "SenderName")
        if (find !== undefined) {
          payload.senderName = find.settingValue
        }
      }
    }catch(e){}

    let response = await CRMService.api(
      "POST",
      payload,
      "customer/login/send-otp"
    );
    dispatch(setData(response, CONSTANT.KEY_SEND_OTP));
    dispatch(loader(false));
    return response;
  };
}

function login(payload) {
  return async (dispatch) => {
    dispatch(loader(true));
    let response = await CRMService.api("POST", payload, "customer/login");
    dispatch(setData(response, CONSTANT.KEY_AUTH_LOGIN));
    dispatch(loader(false));
    return response;
  };
}

function register(payload, enableRegisterWithPassword = false) {
  return async (dispatch) => {
    dispatch(loader(true));
    let url =
      (enableRegisterWithPassword && "customer/registerByPassword") ||
      "customer/register";
    let response = await CRMService.api("POST", payload, url);
    dispatch(setData(response, CONSTANT.KEY_AUTH_REGISTER));
    dispatch(loader(false));
    return response;
  };
}

function refreshToken() {
  return async (dispatch) => {
    if (account) {
      let response = await CRMService.api(
        "POST",
        { refreshToken: account.refreshToken.token },
        "auth/refresh"
      );
      response = response.Data && response.Data.accessToken;
      // console.log(response)
      if (response !== undefined) {
        account.accessToken.jwtToken = response.jwtToken;
        account.accessToken.payload = response.payload;
        lsStore(`${config.prefix}_account`, encryptor.encrypt(account), true);
      } else {
        console.log("Refresh token", false)
        // localStorage.clear();
        // window.location.reload();
      }
    }
  };
}

function setInvitationCode(code) {
  return async (dispatch) => {
    dispatch({type : 'SET_REFERRAL_CODE', data: code});
  }
}


function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}
