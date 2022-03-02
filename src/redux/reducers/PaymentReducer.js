const defaultState = {
  paymentCard: [],
  selectedVoucher: [],
  selectedPoint: {},
  totalPaymentAmount: 0,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'GET_PAYMENT_CARD':
      return {
        ...state,
        paymentCard: action.data,
      };
    case 'SELECT_VOUCHER':
      return {
        ...state,
        selectedVoucher: action.data,
      };
    case 'SELECT_POINT':
      return {
        ...state,
        selectedPoint: action.data,
      };
    case 'SET_TOTAL_PAYMENT_AMOUNT':
      return {
        ...state,
        totalPaymentAmount: action.data,
      };
    case 'ALL':
      return {
        ...action.data,
      };
    default:
      return state;
  }
}
