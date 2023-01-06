import { CONSTANT } from '../../helpers';
const defaultState = {
  data: {},
  getPoints: [],
};
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONSTANT.KEY_GET_CAMPAIGN_POINTS:
      return {
        ...state,
        data: action.data,
      };
    case CONSTANT.KEY_GET_CAMPAIGN_BY_POINTS:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
