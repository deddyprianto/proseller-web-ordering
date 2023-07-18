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
    timeSlot: [],
    date: '',
    time: '',
    dateSorted: [],
    staffServices: [],
    textNotes: '',
    responseSubmit: {},
    staffID: '',
    indexPath: 0,
    timeActiveDropDown: '',
    bookingHistory: [],
    isLocationSelected: false,
    isDateSelected: false,
    locationAppointmentPersisted: {},
    cartSave: {},
    tabStateHistory: 'Orders',
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
    case CONSTANT.TIME_SLOT_APPOINTMENT:
      return { ...state, timeSlot: action.payload };
    case CONSTANT.DATE_APPOINTMENT:
      return { ...state, date: action.payload };
    case CONSTANT.TIME_APPOINTMENT:
      return { ...state, time: action.payload };
    case CONSTANT.DATE_SORTED:
      return { ...state, dateSorted: action.payload };
    case CONSTANT.STAFF_SERVICES:
      return { ...state, staffServices: action.payload };
    case CONSTANT.TEXT_NOTE:
      return { ...state, textNotes: action.payload };
    case CONSTANT.RESPONSE_SUBMIT_APPOINTMENT:
      return { ...state, responseSubmit: action.payload };
    case CONSTANT.STAFFID_APPOINTMENT:
      return { ...state, staffID: action.payload };
    case CONSTANT.INDEX_PATH_APPOINTMENT:
      return { ...state, indexPath: action.payload };
    case CONSTANT.TIME_ACTIVE_DROPDOWN_CART_APPOINTMENT:
      return { ...state, timeActiveDropDown: action.payload };
    case CONSTANT.BOOKING_HISTORY:
      return { ...state, bookingHistory: action.payload };
    case CONSTANT.IS_LOCATION_SELECTED:
      return { ...state, isLocationSelected: action.payload };
    case CONSTANT.IS_DATE_SELECTED:
      return { ...state, isDateSelected: action.payload };
    case CONSTANT.LOCATION_APPOINTMENT_PERSISTED: {
      localStorage.setItem(
        'LOCATION_APPOINTMENT_PERSISTED',
        JSON.stringify(action.payload)
      );
      return { ...state, locationAppointmentPersisted: action.payload };
    }
    case CONSTANT.CART_SAVE_APPOINTMENT:
      return { ...state, cartSave: action.payload };
    case CONSTANT.TAB_STATE_HISTORY:
      return { ...state, tabStateHistory: action.payload };
    default:
      return state;
  }
}
export default AppointmentReducer;
