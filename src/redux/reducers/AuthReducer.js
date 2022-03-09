import { CONSTANT } from '../../helpers';
import config from '../../config';

import { lsLoad } from '../../helpers/localStorage';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

let defaultState = { isLoggedIn: false };

if (account) {
  defaultState.isLoggedIn = account.isLogin;
  defaultState.account = account;
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.KEY_AUTH_LOGIN:
      return Object.assign({}, state, {
        isLoggedIn: true,
        payload: action.data,
      });
    case CONSTANT.KEY_CHECK_LOGIN:
      return Object.assign({}, state, {
        payload: action.data,
      });
    case CONSTANT.KEY_SEND_OTP:
      return Object.assign({}, state, {
        payload: action.data,
      });
    case CONSTANT.KEY_AUTH_REGISTER:
      return Object.assign({}, state, {
        payload: action.data,
      });
    case 'SET_REFERRAL_CODE':
      return { ...state, invitationCode: action.data };
    default:
      return state;
  }
}
