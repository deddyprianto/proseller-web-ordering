import { CONSTANT } from "../../helpers";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const defaultState = {
  defaultOutlet: encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_defaultOutlet`))) || {},
  outlets: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DEFAULT_OUTLET:
      localStorage.setItem(`${config.prefix}_defaultOutlet`, JSON.stringify(encryptor.encrypt(action.data)));
      return {
        ...state,
        defaultOutlet: action.data,
      };
    case CONSTANT.LIST_OUTLET:
      return {
        ...state,
        outlets: action.data,
      };
    default:
      return state;
  }
}
