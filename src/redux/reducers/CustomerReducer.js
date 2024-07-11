import { CONSTANT } from '../../helpers';
const defaultState = {
  isOpen: true,
  myVoucher: null,
  fields: null,
  stamps: null,
  showLoadingOnModal: false,
  placeholderAddressCustomer: {},
  placeholderForEditAddressCustomer: {},
  isUserHasBeenCompletedfillData: false,
  isAllFieldHasBeenFullFiled: {},
  isCustomFieldHaveValue: [],
  showMessageConfirm: true,
  saveMultipleCustomField: {},
  payloadNew: {},
  otpVerify: "",
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.KEY_MENU_TOGGLE:
      return {
        ...state,
        isOpen: action.isOpen,
      };
    case CONSTANT.OTP_VERIFY:
      return {
        ...state,
        otpVerify: action.payload,
      };
    case CONSTANT.GET_VOUCHER:
      return {
        ...state,
        myVoucher: action.data,
      };
    case CONSTANT.IS_ALL_FIELD_HAS_BEEN_FULLFILED:
      return {
        ...state,
        isAllFieldHasBeenFullFiled: action.data,
      };
    case CONSTANT.KEY_MANDATORY_FIELD_CUSTOMER:
      return {
        ...state,
        fields: action.data,
      };
    case CONSTANT.GET_CAMPAIGN_STAMPS:
      return {
        ...state,
        stamps: action.payload,
      };
    case "SET_DEFAULT_PHONE_NUMBER":
      return {
        ...state,
        defaultPhoneNumber: action.data,
      };
    case "SHOW_MESSAGE_CONFIRM":
      return {
        ...state,
        showMessageConfirm: action.data,
      };
    case "SET_DEFAULT_EMAIL":
      return {
        ...state,
        defaultEmail: action.data,
      };
    case CONSTANT.LOADING_ON_MODAL_REGISTER:
      return { ...state, showLoadingOnModal: action.data };
    case CONSTANT.PLACEHOLDER_ADDRESS_CUSTOMER:
      return {
        ...state,
        placeholderAddressCustomer: action.data,
      };
    case CONSTANT.PLACEHOLDER_ADDRESS_CUSTOMER_FOR_EDIT:
      return {
        ...state,
        placeholderForEditAddressCustomer: action.data,
      };
    case "IS_USER_COMPLETED_FILL_ALL_DATA":
      return {
        ...state,
        isUserHasBeenCompletedfillData: action.data,
      };
    case "MULTIPLE_TYPE_CUSTOM_FIELD":
      return {
        ...state,
        saveMultipleCustomField: action.data,
      };
    case "PAYLOAD_CUSTOM":
      return {
        ...state,
        payloadNew: action.data,
      };

    case "IS_CUSTOM_FIELD_HAVE_VALUE":
      return { ...state, isCustomFieldHaveValue: action.data };
    default:
      return state;
  }
}
