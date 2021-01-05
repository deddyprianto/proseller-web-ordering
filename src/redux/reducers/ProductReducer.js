import { CONSTANT } from "../../helpers";
import config from "../../config";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

const defaultState = {
  categories:
    encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_productsBackup`))
    ) || [],
  products: [],
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
    case CONSTANT.LIST_PRODUCT:
      return Object.assign({}, state, {
        products: action.data,
      });
    default:
      return state;
  }
}
