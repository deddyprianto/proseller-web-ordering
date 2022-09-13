import { CONSTANT } from '../../helpers';

function LogoReducer(state = { logo: null }, action) {
  switch (action.type) {
    case CONSTANT.SET_LOGO:
      return { ...state, logo: action.payload };
    default:
      return state;
  }
}
export default LogoReducer;
