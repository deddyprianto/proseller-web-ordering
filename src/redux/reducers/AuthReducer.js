import { CONSTANT } from '../../helpers';
import config from '../../config';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_account`)));

let defaultState = { isLoggedIn: false };

if (account) {
    defaultState.isLoggedIn = account.isLogin
    defaultState.account = account
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.KEY_AUTH_LOGIN:
            return Object.assign({}, state, {
                isLoggedIn: true,
                payload: action.data
            });
        case CONSTANT.KEY_CHECK_LOGIN:
            return Object.assign({}, state, {
                payload: action.data
            });
        case CONSTANT.KEY_SEND_OTP:
            return Object.assign({}, state, {
                payload: action.data
            });
        case CONSTANT.KEY_AUTH_REGISTER:
            return Object.assign({}, state, {
                payload: action.data
            });
        default:
            return state;
    }
}