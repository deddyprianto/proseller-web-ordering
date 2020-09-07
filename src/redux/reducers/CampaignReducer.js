import { CONSTANT } from '../../helpers';
const defaultState = {
    data: {},
};
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.KEY_GET_CAMPAIGN_STAMPS:
            return Object.assign({}, state, {
                data: action.data,
            });
        case CONSTANT.KEY_GET_CAMPAIGN_POINTS:
            return Object.assign({}, state, {
                data: action.data,
            });
        default:
            return state;
    }
}