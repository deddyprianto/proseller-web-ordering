import { CONSTANT } from '../../helpers';

function LogoReducer(state = { logo: null,isSearchItem: false }, action) {
  switch (action.type) {
    case CONSTANT.SET_LOGO:
      return { ...state, logo: action.payload };
    case CONSTANT.IS_SEARCH_ITEM:
      return { ...state, isSearchItem: action.payload };
    default:
      return state;
  }
}
export default LogoReducer;
