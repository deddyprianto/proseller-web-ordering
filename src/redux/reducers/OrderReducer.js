import { CONSTANT } from '../../helpers';
const defaultState = {
    basket: {},
    productsSearch: undefined
};
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.DATA_BASKET:
            return {
                ...state,
                basket: action.data,
            };
        case "SEARCH":
            return {
                ...state,
                productsSearch: action.data,
            };
        default:
            return state;
    }
}