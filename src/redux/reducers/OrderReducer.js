import moment from 'moment';
import { CONSTANT } from '../../helpers';
import { lsLoad } from '../../helpers/localStorage';
import config from '../../config';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  basketUpdate: false,
  outletSelection: 'DEFAULT',
  basket:
    JSON.parse(localStorage.getItem(`${config.prefix}_offlineCart`)) || {},
  productsSearch: undefined,
  deliveryProviders: null,
  dataPendingLength: undefined,
  setting: [],
  selectedDeliveryProvider:
    encryptor.decrypt(lsLoad(`${config.prefix}_deliveryProvider`, true)) ||
    null,
  deliveryAddress: null,
  orderingMode: localStorage.getItem(`${config.prefix}_ordering_mode`) || null,
  orderingModeDisplayName:
    localStorage.getItem(`${config.prefix}_ordering_mode_display_name`) || null,
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
    moment().format('YYYY-MM-DD'),
  orderActionTime:
    localStorage.getItem(`${config.prefix}_order_action_time`) ||
    moment().add(1, 'h').format('HH') + ':00',
  orderActionTimeSlot:
    localStorage.getItem(`${config.prefix}_order_action_time_slot`) || null,
  orderingSetting: {},
  itemOrderingMode: {},
  orderingModeActive: null,
  date: '',
  timeslot: '',
  saveValueEdit: '',
  saveTimeSlotCalendarLogin: '',
  saveDateEdit: '',
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DATA_BASKET:
      return {
        ...state,
        basket: action.data,
      };
    case CONSTANT.DATA_BASKET_UPDATE:
      return {
        ...state,
        basketUpdate: action.data,
      };
    case 'OUTLET_SELECTION':
      return {
        ...state,
        outletSelection: action.data,
      };
    case 'SEARCH':
      return {
        ...state,
        productsSearch: action.data,
      };
    case 'SET_ORDERING_SETTINGS':
      return {
        ...state,
        orderingSetting: action.data,
      };
    case 'SET_DELIVERY_PROVIDERS':
      return {
        ...state,
        deliveryProviders: action.payload,
      };
    case 'SET_SELECTED_DELIVERY_PROVIDERS':
      localStorage.setItem(
        `${config.prefix}_delivery_providers`,
        JSON.stringify(encryptor.encrypt(action?.data))
      );
      return {
        ...state,
        selectedDeliveryProvider: action.data,
      };
    case 'SET_DELIVERY_ADDRESS':
      localStorage.setItem(
        `${config.prefix}_delivery_address`,
        JSON.stringify(encryptor.encrypt(action.data))
      );
      return {
        ...state,
        deliveryAddress: action.data,
      };
    case 'DATA_SETTING_ORDERING':
      return {
        ...state,
        setting: action.payload,
      };
    case 'PENDING_ORDERS':
      return {
        ...state,
        dataPendingLength: action.payload,
      };
    case 'SET_ORDERING_MODE_DISPlAY_NAME':
      localStorage.setItem(
        `${config.prefix}_ordering_mode_display_name`,
        action.data
      );
      return {
        ...state,
        orderingModeDisplayName: action.data,
      };
    case 'SET_ORDERING_MODE': {
      const selectedOn = new Date();
      localStorage.setItem(`${config.prefix}_ordering_mode`, action.payload);
      localStorage.setItem(`${config.prefix}_ordering_selected_on`, selectedOn);
      return {
        ...state,
        orderingMode: action.payload,
        orderingModeSelectedOn: selectedOn,
      };
    }
    case 'REMOVE_ORDERING_MODE':
      localStorage.removeItem(`${config.prefix}_ordering_mode`);
      localStorage.removeItem(`${config.prefix}_ordering_selected_on`);
      return {
        ...state,
        orderingMode: null,
        orderingModeSelectedOn: null,
      };
    case 'SET_ORDERING_MODES':
      return {
        ...state,
        orderingModes: action.payload,
      };
    case 'SET_ORDER_ACTION_DATE':
      localStorage.setItem(`${config.prefix}_order_action_date`, action.data);
      return {
        ...state,
        orderActionDate: action.data,
      };
    case 'SET_ORDER_ACTION_TIME':
      localStorage.setItem(`${config.prefix}_order_action_time`, action.data);
      return {
        ...state,
        orderActionTime: action.data,
      };
    case 'SET_ORDER_ACTION_TIME_SLOT':
      localStorage.setItem(
        `${config.prefix}_order_action_time_slot`,
        action.data
      );
      return {
        ...state,
        orderActionTimeSlot: action.data,
      };
    case 'DELETE_ORDER_ACTION_TIME_SLOT':
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
        orderActionDate: moment().format('YYYY-MM-DD'),
        orderActionTime: moment().add(1, 'h').format('HH') + ':00',
        orderActionTimeSlot: null,
      };
    case 'ORDERING_MODE_ACTIVE':
      return { ...state, orderingModeActive: action.data };
    case 'ITEM_ORDERING_MODE':
      return { ...state, itemOrderingMode: action.data };
    case CONSTANT.SAVE_DATE_EDIT:
      return { ...state, saveDateEdit: action.payload };
    case CONSTANT.SAVE_TIMESLOT_CALENDER_LOGIN:
      return { ...state, saveTimeSlotCalendarLogin: action.payload };
    case CONSTANT.SAVE_DATE_LOGIN:
      return { ...state, date: action.payload };
    case CONSTANT.SAVE_TIMESLOT_LOGIN:
      return { ...state, timeslot: action.payload };
    case CONSTANT.SAVE_VALUE_EDIT:
      return { ...state, saveValueEdit: action.payload };
    default:
      return state;
  }
}
