import { CONSTANT } from '../../helpers';

function AppointmentReducer(
  state = {
    isOpenModalLeavePage: false,
    locationAppointment: {},
    popupLocation: false,
    cartAppointment: [],
    responseAddCart: {},
    indexFooter: 0,
    searchBar: [],
  },
  action
) {
  switch (action.type) {
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT:
      return { ...state, isOpenModalLeavePage: action.payload };
    case CONSTANT.LOCATION_APPOINTMENT:
      return { ...state, locationAppointment: action.payload };
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE:
      return { ...state, popupLocation: action.payload };
    case CONSTANT.CART_APPOINTMENT:
      return { ...state, cartAppointment: action.payload };
    case CONSTANT.RESPONSEADDCART_APPOINTMENT:
      return { ...state, responseAddCart: action.payload };
    case CONSTANT.INDEX_FOOTER:
      return { ...state, indexFooter: action.payload };
    case CONSTANT.SEARCHBAR:
      return { ...state, searchBar: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
