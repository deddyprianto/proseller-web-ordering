import { CONSTANT } from '../../helpers';
import config from '../../config';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  categories:
    encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_productsBackup`))
    ) || [],
  products: [],
  selectedCategory: null,
  categoryList: null,
  productList: null,
  productCategory: null,
  loading: false,
  loadingProductCategory: false,
  error: null,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.LIST_CATEGORY:
      localStorage.setItem(
        `${config.prefix}_productsBackup`,
        JSON.stringify(encryptor.encrypt(action.data))
      );
      return Object.assign({}, state, {
        categories: action.data,
      });
    case 'SET_CATEGORY_LIST':
      return {
        ...state,
        categoryList: action.data,
      };
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.data,
      };
    case 'GET_PRODUCT_LIST_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'GET_PRODUCT_CATEGORY_STARTED':
      return {
        ...state,
        loadingProductCategory: true,
      };
    case 'GET_PRODUCT_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        productList: action.data,
      };
    case 'CLEAR_CATEGORY_PRODUCTS':
      return {
        ...state,
        loading: true,
        error: null,
        productList: [],
      };
    case 'GET_PRODUCT_CATEGORY_SUCCESS':
      return {
        ...state,
        loadingProductCategory: false,
        error: null,
        productCategory: action.data,
      };
    case 'GET_PRODUCT_LIST_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case CONSTANT.LIST_PRODUCT:
      return Object.assign({}, state, {
        products: action.data,
      });
    default:
      return state;
  }
}
