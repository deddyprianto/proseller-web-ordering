const initialState = {
  isSending: false,
  sendFailed: false,
  errorMessage: "",
  successMessage: "",
  summary: 0,
  defaultBalance: 0,
  history: {},
  historyExpiration: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "INIT_TRANSFER_SVC":
      return {
        ...state,
        isSending: false,
        sendFailed: false,
        errorMessage: "",
        successMessage: "",
      };
    case "GET_SUMMARY_SUCCESS":
      return {
        ...state,
        summary: action.payload.balance,
        defaultBalance: action.payload.defaultBalance,
      };
    case "GET_HISTORY_SUCCESS":
      return {
        ...state,
        history: action.payload,
      };
    case "GET_HISTORY_EXPIRATION_SUCCESS":
      return {
        ...state,
        historyExpiration: action.payload,
      };
    case "TRANSFER_SVC_SUCCESS":
      return {
        ...state,
        isSending: false,
        sendFailed: false,
        errorMessage: "",
        successMessage: "Transfer Success!",
      };
    case "TRANSFER_SVC_FAILED":
      return {
        ...state,
        isSending: false,
        sendFailed: true,
        errorMessage: action.payload,
        successMessage: "",
      };
    default:
      return state;
  }
}
