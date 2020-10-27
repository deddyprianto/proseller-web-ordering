const defaultState = {
    paymentCard: [],
    selectedVoucher: []
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "GET_PAYMENT_CARD":
            return {
                ...state,
                paymentCard: action.data,
            };
        case "SELECT_VOUCHER":
            return {
                ...state,
                selectedVoucher: action.data,
            };
        default:
            return state;
    }
}