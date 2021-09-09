const initialState = {
  color: {
    primary: "#c00a27",
    secondary: "#c00a27",
  },
  menu: {
    navBar: [
      {
        text: "Menu",
        path: "/",
        showOnOrderingEnabled: true,
        icon: "fa fa-th",
      },
      {
        text: "History",
        path: "/history",
        loggedInOnly: true,
        icon: "fa fa-history",
      },
      {
        text: "Profile",
        path: "/profile",
        loggedInOnly: true,
        icon: "fa fa-user",
      },
      {
        text: "Rewards",
        path: "/rewards",
        loggedInOnly: true,
        icon: "fa fa-gift",
      },
      {
        text: "Inbox",
        path: "/inbox",
        loggedInOnly: true,
        icon: "fa fa-envelope",
      },
      {
        text: "Login",
        loggedInOnly: false,
        path: "/history",
        icon: "fa fa-sign-in",
      },
    ],
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
