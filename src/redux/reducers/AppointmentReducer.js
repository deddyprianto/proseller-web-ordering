import { CONSTANT } from '../../helpers';

function AppointmentReducer(
  state = {
    isOpenModalLeavePage: false,
    openPopupAppointment: true,
    locationAppointment: {},
    popupLocation: false,
  },
  action
) {
  switch (action.type) {
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT:
      return { ...state, isOpenModalLeavePage: action.payload };
    case CONSTANT.OPEN_POPUP_APPOINTMENT:
      return { ...state, openPopupAppointment: action.payload };
    case CONSTANT.LOCATION_APPOINTMENT:
      return { ...state, locationAppointment: action.payload };
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE:
      return { ...state, popupLocation: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
