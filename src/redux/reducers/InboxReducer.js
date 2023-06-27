import { CONSTANT } from '../../helpers';
const defaultState = {
  broadcast: {
    broadcast: [],
    broadcastLength: 0,
    broadcastUnreadLength: 0,
  },
  detailBroadcast: {},
};
export default function reducer(state = defaultState, action) {
    switch (action.type) {
      case CONSTANT.KEY_GET_BROADCAST:
        return {
          ...state,
          broadcast: action.data,
        };
      case CONSTANT.KEY_GET_BROADCAST_DETAIL:
        localStorage.setItem(
          'KEY_GET_BROADCAST_DETAIL',
          JSON.stringify(action.data)
        );
        return {
          ...state,
          detailBroadcast: action.data,
        };
      default:
        return state;
    }
}