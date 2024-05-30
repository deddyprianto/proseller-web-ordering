import { CONSTANT } from '../../helpers';

function LogoReducer(
  state = {
    logo: null,
    isSearchItem: false,
    searchResults: [],
    keywordSearch: "",
    searchLoading: false,
    searchItemEmpty: false,
  },
  action
) {
  switch (action.type) {
    case CONSTANT.SET_LOGO:
      return { ...state, logo: action.payload };
    case CONSTANT.SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    case CONSTANT.IS_SEARCH_ITEM:
      return { ...state, isSearchItem: action.payload };
    case "KEYWORD_SEARCH":
      return { ...state, keywordSearch: action.payload };
    case "SEARCH_LOADING":
      return { ...state, searchLoading: action.payload };
    case "IS_SEARCH_ITEM_EMPTY":
      return { ...state, searchItemEmpty: action.payload };
    default:
      return state;
  }
}
export default LogoReducer;
