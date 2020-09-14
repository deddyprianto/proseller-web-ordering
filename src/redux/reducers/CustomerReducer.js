import { CONSTANT } from '../../helpers';
const defaultState = {
    isOpen: true,
    myVoucher: null
};
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.KEY_MENU_TOGGLE:
            return {
                ...state,
                isOpen: action.isOpen,
            };
        case CONSTANT.GET_VOUCHER:
            return {
                ...state,
                myVoucher: action.data,
            };
        default:
            return state;
    }
}