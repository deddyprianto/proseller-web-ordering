import { CONSTANT } from "../../helpers";
import { lsLoad } from "../../helpers/localStorage";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  basket: JSON.parse(localStorage.getItem(`${config.prefix}_offlineCart`)) || {},
  productsSearch: undefined,
  deliveryProviders: null,
  dataPendingLength: undefined,
  setting: [],
  selectedDeliveryProvider:
    encryptor.decrypt(lsLoad(`${config.prefix}_deliveryProvider`, true)) ||
    null,
  deliveryAddress:
    encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_deliveryAddress`))
    ) || null,
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DATA_BASKET:
      return {
        ...state,
        basket: action.data,
      };
    case "SEARCH":
      return {
        ...state,
        productsSearch: action.data,
      };
    case "SET_DELIVERY_PROVIDERS":
      return {
        ...state,
        deliveryProviders: action.payload,
      };
    case "SET_SELECTED_DELIVERY_PROVIDERS":
      localStorage.setItem(
        `${config.prefix}_deliveryProvider`,
        JSON.stringify(encryptor.encrypt(action.payload))
      );
      return {
        ...state,
        selectedDeliveryProvider: action.payload,
      };
    case "SET_DELIVERY_ADDRESS":
      return {
        ...state,
        deliveryAddress: action.payload,
      };
    case "DATA_SETTING_ORDERING":
      return {
        ...state,
        setting: action.payload,
      };
    case "PENDING_ORDERS":
      return {
        ...state,
        dataPendingLength: action.payload,
      };
    default:
      return state;
  }
}
