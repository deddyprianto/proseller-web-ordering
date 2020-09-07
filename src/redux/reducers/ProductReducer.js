import {CONSTANT} from '../../helpers';
 
const defaultState = {
    categories: [],
    products: []
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.LIST_CATEGORY: 
            return Object.assign({}, state, { 
                categories: action.data
            });
        case CONSTANT.LIST_PRODUCT: 
            return Object.assign({}, state, { 
                products: action.data
            });
        default:
            return state;
    }
}