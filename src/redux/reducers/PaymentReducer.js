const defaultState = {
    paymentCard: [],
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "GET_PAYMENT_CARD":
            return {
                ...state,
                paymentCard: action.data,
            };
        default:
            return state;
    }
}