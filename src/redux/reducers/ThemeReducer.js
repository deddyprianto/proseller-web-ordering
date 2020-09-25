const initialState = {
  color: {
    primary: "#c00a27",
    secondary: "#c00a27",
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        color: action.payload,
      };
    default:
      return state;
  }
}
