import { CONSTANT } from "../../helpers";
import config from "../../config";
import { data } from "jquery";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const defaultState = {
  defaultOutlet:
    encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_defaultOutlet`))
    ) || {},
  outletChanged:
    encryptor.decrypt(localStorage.getItem(`${config.prefix}_outletChanged`)) ||
    false,
  outlets: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DEFAULT_OUTLET:
      if (!(action.data.status && action.data.status === "failed")) {
        localStorage.setItem(
          `${config.prefix}_defaultOutlet`,
          JSON.stringify(encryptor.encrypt(action.data))
        );
        return {
          ...state,
          defaultOutlet: action.data,
        };
      }
      return;
    case CONSTANT.LIST_OUTLET:
      return {
        ...state,
        outlets: action.data,
      };
    case "OUTLET_CHANGED":
      localStorage.setItem(
        `${config.prefix}_outletChanged`,
        encryptor.encrypt(action.data)
      );
      return {
        ...state,
        outletChanged: action.data,
      };
    default:
      return state;
  }
}
