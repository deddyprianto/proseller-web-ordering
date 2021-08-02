import moment from "moment";
import { CONSTANT } from "../../helpers";
import { lsLoad } from "../../helpers/localStorage";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  outletSelection: "DEFAULT",
  basket:
    JSON.parse(localStorage.getItem(`${config.prefix}_offlineCart`)) || {},
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
  orderingMode: localStorage.getItem(`${config.prefix}_ordering_mode`) || null,
  orderingModeSelectedOn: localStorage.getItem(
    `${config.prefix}_ordering_mode_selected_on`
  )
    ? new Date(
        localStorage.getItem(`${config.prefix}_ordering_mode_selected_on`)
      )
    : null,
  orderingModes: [],
  orderActionDate:
    localStorage.getItem(`${config.prefix}_order_action_date`) ||
    moment().format("YYYY-MM-DD"),
  orderActionTime:
    localStorage.getItem(`${config.prefix}_order_action_time`) ||
    moment().add(1, "h").format("HH") + ":00",
  orderActionTimeSlot:
    localStorage.getItem(`${config.prefix}_order_action_time_slot`) || null,
  orderingSetting: {},
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DATA_BASKET:
      return {
        ...state,
        basket: action.data,
      };
    case "OUTLET_SELECTION":
      return {
        ...state,
        outletSelection: action.data,
      };
    case "SEARCH":
      return {
        ...state,
        productsSearch: action.data,
      };
    case "SET_ORDERING_SETTINGS":
      return {
        ...state,
        orderingSetting: action.data,
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
    case "SET_ORDERING_MODE":
      const selectedOn = new Date();
      localStorage.setItem(`${config.prefix}_ordering_mode`, action.payload);
      localStorage.setItem(`${config.prefix}_ordering_selected_on`, selectedOn);
      return {
        ...state,
        orderingMode: action.payload,
        orderingModeSelectedOn: selectedOn,
      };
    case "REMOVE_ORDERING_MODE":
      localStorage.removeItem(`${config.prefix}_ordering_mode`);
      localStorage.removeItem(`${config.prefix}_ordering_selected_on`);
      return {
        ...state,
        orderingMode: null,
        orderingModeSelectedOn: null,
      };
    case "SET_ORDERING_MODES":
      return {
        ...state,
        orderingModes: action.payload,
      };
    case "SET_ORDER_ACTION_DATE":
      localStorage.setItem(
        `${config.prefix}_order_action_date`,
        action.payload
      );
      return {
        ...state,
        orderActionDate: action.payload,
      };
    case "SET_ORDER_ACTION_TIME":
      localStorage.setItem(
        `${config.prefix}_order_action_time`,
        action.payload
      );
      return {
        ...state,
        orderActionTime: action.payload,
      };
    case "SET_ORDER_ACTION_TIME_SLOT":
      localStorage.setItem(
        `${config.prefix}_order_action_time_slot`,
        action.payload
      );
      return {
        ...state,
        orderActionTimeSlot: action.payload,
      };
    case "DELETE_ORDER_ACTION_TIME_SLOT":
      localStorage.removeItem(
        `${config.prefix}_order_action_time`,
        action.payload
      );
      localStorage.removeItem(
        `${config.prefix}_order_action_time_slot`,
        action.payload
      );
      localStorage.removeItem(
        `${config.prefix}_order_action_date`,
        action.payload
      );
      return {
        ...state,
        orderActionDate: moment().format("YYYY-MM-DD"),
        orderActionTime: moment().add(1, "h").format("HH") + ":00",
        orderActionTimeSlot: null,
      };
    default:
      return state;
  }
}
