import {CONSTANT} from '../../helpers';
 
const defaultState = {
    banners:[]
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.KEY_PROMOTION: 
            return Object.assign({}, state, { 
                banners:action.data
            });
        default:
            return state;
    }
}