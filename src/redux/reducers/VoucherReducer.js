const initialState = {
  vouchers: [],
  isSending: false,
  sendFailed: false,
  errorMessage: '',
  successMessage: '',
  indexVoucer: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_VOUCHER_SUCCESS':
      console.log(action.type);
      return {
        ...state,
        vouchers: action.payload,
      };
    case 'INIT_VOUCHER_SEND':
      return {
        ...state,
        isSending: false,
        sendFailed: false,
        errorMessage: '',
        successMessage: '',
      };
    case 'SEND_VOUCHER':
      return {
        ...state,
        isSending: true,
        sendFailed: false,
        errorMessage: '',
        successMessage: '',
      };
    case 'SEND_VOUCHER_SUCCESS':
      return {
        ...state,
        isSending: false,
        sendFailed: false,
        errorMessage: '',
        successMessage: 'Voucher sent',
      };
    case 'SEND_VOUCHER_FAILED':
      return {
        ...state,
        isSending: false,
        sendFailed: true,
        errorMessage: action.payload,
        successMessage: '',
      };
    case 'INDEX_VOUCHER':
      return {
        ...state,
        indexVoucer: action.payload,
      };
    default:
      return state;
  }
}
