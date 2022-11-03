import { CONSTANT } from '../../helpers';
const defaultState = {
  data: {},
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.KEY_GET_CAMPAIGN_POINTS:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
