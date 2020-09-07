import { CONSTANT } from '../../helpers';

const defaultState = {};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.DATA_PRODUCT:
            return Object.assign({}, state, {
                product: action.data
            });
        default:
            return state;
    }
}