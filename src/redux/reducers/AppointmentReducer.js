import { CONSTANT } from '../../helpers';

function AppointmentReducer(
  state = {
    isOpenModalLeavePage: false,
  },
  action
) {
  switch (action.type) {
    case CONSTANT.IS_OPEN_MODAL_APPOINTMENT:
      return { ...state, isOpenModalLeavePage: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
