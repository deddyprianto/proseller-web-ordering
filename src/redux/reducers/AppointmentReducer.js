import { CONSTANT } from '../../helpers';

function AppointmentReducer(
  state = {
    isOpenModalLeavePage: false,
    locationAppointment: {},
    popupLocation: false,
    cartAppointment: [],
    responseAddTocart: {},
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
    case CONSTANT.RESPONSEADDTOCART_APPOINTMENT:
      return { ...state, responseAddTocart: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
