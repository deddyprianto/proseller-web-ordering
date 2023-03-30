import httpBuildQuery from 'http-build-query';

export const Header = function () {
  // your custom header here
  return {
    'Content-Type': 'application/json',
  };
};

export const jsonToQueryString = function (json) {
  return httpBuildQuery(json);
};

export const CONSTANT = {
  LOADING_ON_MODAL_REGISTER: 'LOADING_ON_MODAL_REGISTER',
  KEY_LOADER_TOGGLE: 'LOADER_TOGGLE',
  KEY_ISLOGIN: 'islogin',
  KEY_PROMOTION: 'PROMOTION_BANNER',
  KEY_CHECK_LOGIN: 'CHECK_LOGIN',
  KEY_SEND_OTP: 'SEND_OTP',
  KEY_AUTH_LOGIN: 'AUTH_LOGIN',
  KEY_AUTH_REGISTER: 'AUTH_REGISTER',
  DEFAULT_OUTLET: 'DEFAULT_OUTLET',
  LIST_CATEGORY: 'LIST_CATEGORY',
  LIST_CATEGORY_APPOINTMENT: 'LIST_CATEGORY_APPOINTMENT',
  LIST_SERVICE_APPOINTMENT: 'LIST_SERVICE_APPOINTMENT',
  LIST_PRODUCT: 'LIST_PRODUCT',
  KEY_GET_CAMPAIGN_STAMPS: 'GET_CAMPAIGN_STAMPS',
  KEY_GET_CAMPAIGN_POINTS: 'GET_CAMPAIGN_POINTS',
  KEY_GET_CAMPAIGN_BY_POINTS: 'GET_CAMPAIGN_BY_POINTS',
  KEY_GET_CUSTOMER_PROFILE: 'GET_CUSTOMER_PROFILE',
  KEY_UPDATE_CUSTOMER_PROFILE: 'UPDATE_CUSTOMER_PROFILE',
  KEY_MANDATORY_FIELD_CUSTOMER: 'MANDATORY_FIELD_CUSTOMER',
  IS_ALL_FIELD_HAS_BEEN_FULLFILED: 'IS_ALL_FIELD_HAS_BEEN_FULLFILED',
  DATA_BASKET: 'DATA_BASKET',
  DATA_BASKET_UPDATE: 'DATA_BASKET_UPDATE',
  LIST_OUTLET: 'LIST_OUTLET',
  DATA_PRODUCT: 'DATA_PRODUCT',
  KEY_GET_BROADCAST: 'KEY_GET_BROADCAST',
  GET_VOUCHER: 'GET_VOUCHER',
  GET_CAMPAIGN_STAMPS: 'GET_CAMPAIGN_STAMPS',
  PLACEHOLDER_ADDRESS_CUSTOMER: 'PLACEHOLDER_ADDRESS_CUSTOMER',
  PLACEHOLDER_ADDRESS_CUSTOMER_FOR_EDIT:
    'PLACEHOLDER_ADDRESS_CUSTOMER_FOR_EDIT',
  //Ordering Constant
  ORDERING_MODE_STORE_PICKUP: 'STOREPICKUP',
  ORDERING_MODE_CHECKOUT: 'STORECHECKOUT',
  ORDERING_MODE_DELIVERY: 'DELIVERY',
  ORDERING_MODE_DINE_IN: 'DINEIN',
  ORDERING_MODE_TAKE_AWAY: 'TAKEAWAY',
  SET_LOGO: 'LOGOSAVE',
  TIME_SLOT_INVALID: 'Invalid setup timeslot',
  TRACKORDER: 'TRACKORDER',
  GUESTMODE: 'GUESTMODE_RESPONSE',
  GUEST_MODE_BASKET: 'GUEST_MODE_BASKET',
  SAVE_ADDRESS_GUESTMODE: 'SAVE_ADDRESS_GUESTMODE',
  SAVE_ADDRESS_PICKUP: 'SAVE_ADDRESS_PICKUP',
  SAVE_ADDRESS_TAKEAWAY: 'SAVE_ADDRESS_TAKEAWAY',
  SET_ORDERING_MODE_GUEST_CHECKOUT: 'SET_ORDERING_MODE_GUEST_CHECKOUT',
  SET_ORDERING_MODE_GUEST_CHECKOUT_OBJ: 'SET_ORDERING_MODE_GUEST_CHECKOUT_OBJ',
  SET_DELIVERY_PROVIDER_GUEST_CHECKOUT: 'SET_DELIVERY_PROVIDER_GUEST_CHECKOUT',
  URL_PAYMENT: 'URL_PAYMENT',
  SUCCESS_DELETE: 'SUCCESS_DELETE',
  SAVE_DATE: 'SAVE_DATE',
  SAVE_TIMESLOT: 'SAVE_TIMESLOT',
  SAVE_TIME: 'SAVE_TIME',
  SAVE_TIMESLOT_FOR_EDIT: 'SAVE_TIMESLOT_FOR_EDIT',
  SAVE_GUESTMODE_STATE: 'SAVE_GUESTMODE_STATE',
  SAVE_ADDRESS_PLACEHOLDER: 'SAVE_ADDRESS_PLACEHOLDER',
  MODAL_DELIVERY_ADDRESS: 'MODAL_DELIVERY_ADDRESS',
  OUTLET_RESPONSE: 'OUTLET_RESPONSE',
  OPENMODAL_DIALOG_GUESTCHECKOUT: 'OPENMODAL_DIALOG_GUESTCHECKOUT',
  SAVE_EDIT_RESPONSE_GUESTCHECKOUT: 'SAVE_EDIT_RESPONSE_GUESTCHECKOUT',
  IS_CART_DELETED: 'IS_CART_DELETED',
  SAVE_TIMESLOT_CALENDER_LOGIN: 'SAVE_TIMESLOT_CALENDER_LOGIN',
  SAVE_DATE_LOGIN: 'SAVE_DATE_LOGIN',
  SAVE_TIMESLOT_LOGIN: 'SAVE_TIMESLOT_LOGIN',
  SAVE_VALUE_EDIT: 'SAVE_VALUE_EDIT',
  SAVE_DATE_EDIT: 'SAVE_DATE_EDIT',
  SAVE_TIMESLOT_CALENDER: 'SAVE_TIMESLOT_CALENDER',
  SAVE_SELECTED_PRODUCT_MODIFIER: 'SAVE_SELECTED_MODIFIER',
  NO_TABLE: 'NO_TABLE',
  IS_OPEN_MODAL_APPOINTMENT: 'IS_OPEN_MODAL_APPOINTMENT',
  NO_TABLE_GUESTCO: 'NO_TABLE_GUESTCO',
  NO_TABLE_GUESTCO_ACTIVE: 'NO_TABLE_GUESTCO_ACTIVE',
  LOCATION_APPOINTMENT: 'LOCATION_APPOINTMENT',
  IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE:
    'IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE',
};
