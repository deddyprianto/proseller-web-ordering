import { CONSTANT } from '../../helpers';
const defaultState = {
    broadcast: {
        broadcast: [],
        broadcastLength: 0,
        broadcastUnreadLength: 0,
    },
};
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.KEY_GET_BROADCAST:
            return {
                ...state,
                broadcast: action.data,
            };
        default:
            return state;
    }
}