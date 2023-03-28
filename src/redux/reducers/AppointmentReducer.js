import { CONSTANT } from '../../helpers';

function AppointmentReducer(
  state = {
    isOpenModalLeavePage: false,
    openPopupAppointment: true,
  },
  action
) {
  switch (action.type) {
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT:
      return { ...state, isOpenModalLeavePage: action.payload };
    case CONSTANT.OPEN_POPUP_APPOINTMENT:
      return { ...state, openPopupAppointment: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
