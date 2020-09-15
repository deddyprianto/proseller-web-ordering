import { CONSTANT } from "../../helpers";

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
    default:
      return state;
  }
}
