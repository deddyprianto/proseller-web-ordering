import { CONSTANT } from "../../helpers";
const defaultState = {
  isOpen: true,
  myVoucher: null,
  fields: null,
  stamps: null,
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.KEY_MENU_TOGGLE:
      return {
        ...state,
        isOpen: action.isOpen,
      };
    case CONSTANT.GET_VOUCHER:
      return {
        ...state,
        myVoucher: action.data,
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
    case "SET_DEFAULT_EMAIL":
      return {
        ...state,
        defaultEmail: action.data,
      };
    default:
      return state;
  }
}
