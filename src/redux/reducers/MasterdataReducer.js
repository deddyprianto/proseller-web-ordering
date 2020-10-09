import { CONSTANT } from "../../helpers";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  infoCompany: {
    data: null,
    isFetching: false,
    errors: false,
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.DATA_PRODUCT:
      return Object.assign({}, state, {
        product: action.data,
      });
    case "GET_COMPANY_INFO":
      return {
        ...state,
        companyInfo: {
          ...state.companyInfo,
          data: null,
          isFetching: true,
        },
      };
    case "GET_COMPANY_INFO_SUCCESS":
      return {
        ...state,
        companyInfo: {
          ...state.companyInfo,
          data: action.payload,
          isFetching: false,
          errors: false,
        },
      };
    case "GET_COMPANY_INFO_FAILED":
      return {
        ...state,
        companyInfo: {
          isFetching: false,
          errors: true,
        },
      };
    case CONSTANT.DEFAULT_OUTLET:
      localStorage.setItem(
        `${config.prefix}_defaultOutlet`,
        JSON.stringify(encryptor.encrypt(action.data))
      );
      return {
        ...state,
        defaultOutlet: action.data,
      };
    default:
      return state;
  }
}
