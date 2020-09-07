import {CONSTANT} from '../../helpers';
 
const defaultState = {
    defaultOutlet: {}
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.DEFAULT_OUTLET: 
            return Object.assign({}, state, { 
                defaultOutlet: action.data
            });
        default:
            return state;
    }
}