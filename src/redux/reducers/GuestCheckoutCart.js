import { CONSTANT } from '../../helpers';

function GuestCheckoutCart(
  state = {
    data: { message: 'Cart it empty.' },
    orderingModeGuestCheckout: '',
    address: { deliveryAddress: null },
    response: null,
    addressPlaceHolderForm: null,
    modalDeliveryAddress: false,
    outletResponse: null,
    addressTakeAway: null,
    addressPickup: null,
    providerGuestCheckout: null,
    openOrderingMode: false,
    trackorder: {},
    isCartDeleted: false,
    saveTimeSlotCalendar: '',
    saveTimeSlotForEdit: '',
  },
  action
) {
  switch (action.type) {
    case CONSTANT.GUESTMODE:
      return { ...state, response: action.payload };
    case CONSTANT.GUEST_MODE_BASKET:
      return { ...state, data: action.payload };
    case CONSTANT.SAVE_ADDRESS_GUESTMODE:
      return { ...state, address: action.payload };
    case CONSTANT.SAVE_ADDRESS_TAKEAWAY:
      return { ...state, addressTakeAway: action.payload };
    case CONSTANT.SAVE_ADDRESS_PICKUP:
      return { ...state, addressPickup: action.payload };
    case CONSTANT.SAVE_ADDRESS_PLACEHOLDER:
      return { ...state, addressPlaceHolderForm: action.payload };
    case CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT:
      return { ...state, orderingModeGuestCheckout: action.payload };
    case CONSTANT.SET_DELIVERY_PROVIDER_GUEST_CHECKOUT:
      return { ...state, providerGuestCheckout: action.payload };
    case CONSTANT.URL_PAYMENT:
      return { ...state, url: action.payload };
    case CONSTANT.SUCCESS_DELETE:
      return { ...state, notice: action.payload };
    case CONSTANT.TRACKORDER:
      return { ...state, trackorder: action.payload };
    case CONSTANT.SAVE_DATE:
      return { ...state, date: action.payload };
    case CONSTANT.SAVE_TIMESLOT:
      return { ...state, timeslot: action.payload };
    case CONSTANT.SAVE_TIME:
      return { ...state, time: action.payload };
    case CONSTANT.SAVE_GUESTMODE_STATE:
      return { ...state, mode: action.payload };
    case CONSTANT.MODAL_DELIVERY_ADDRESS:
      return { ...state, modalDeliveryAddress: action.payload };
    case CONSTANT.OUTLET_RESPONSE:
      return { ...state, outletResponse: action.payload };
    case CONSTANT.OPENMODAL_DIALOG_GUESTCHECKOUT:
      return { ...state, openOrderingMode: action.payload };
    case CONSTANT.SAVE_EDIT_RESPONSE_GUESTCHECKOUT:
      return { ...state, saveEditResponse: action.payload };
    case CONSTANT.IS_CART_DELETED:
      return { ...state, isCartDeleted: action.payload };
    case CONSTANT.SAVE_TIMESLOT_CALENDER:
      return { ...state, saveTimeSlotCalendar: action.payload };
    case CONSTANT.SAVE_TIMESLOT_FOR_EDIT:
      return { ...state, saveTimeSlotForEdit: action.payload };
    default:
      return state;
  }
}
export default GuestCheckoutCart;
