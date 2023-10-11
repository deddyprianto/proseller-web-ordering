const defaultState = {
  paymentCard: [],
  selectedVoucher: [],
  selectedPoint: {},
  useSVC: 0,
  selectedPaymentCard: {},
  totalPaymentAmount: 0,
  responseFomoPayPayment: {},
  iconCheck: '',
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
    case 'USE_SVC':
      return {
        ...state,
        useSVC: action.data,
      };
    case 'SET_TOTAL_PAYMENT_AMOUNT':
      return {
        ...state,
        totalPaymentAmount: action.data,
      };
    case 'SET_SELECTED_PAYMENT_CARD':
      return {
        ...state,
        selectedPaymentCard: action.data,
      };
    case 'RESPONSE_FOMOPAY':
      return {
        ...state,
        responseFomoPayPayment: action.data,
      };
    case 'ICON_CHECK':
      return {
        ...state,
        iconCheck: action.data,
      };
    case 'ALL':
      return {
        ...action.data,
      };
    default:
      return state;
  }
}
