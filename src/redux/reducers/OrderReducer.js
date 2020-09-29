import { CONSTANT } from "../../helpers";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  basket: {},
  productsSearch: undefined,
  deliveryProviders: null,
  selectedDeliveryProviders: null,
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
    case "SET_DELIVERY_ADDRESS":
      return {
        ...state,
        deliveryAddress: action.payload,
      };
    default:
      return state;
  }
}
