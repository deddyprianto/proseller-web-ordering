const initialState = {
  color: "#c00a27",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        color: action.data,
      };
    default:
      return state;
  }
}
