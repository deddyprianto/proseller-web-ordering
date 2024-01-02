import { combineReducers } from 'redux';
import auth from './AuthReducer';
import outlet from './OutletReducer';
import loader from './LoaderReducer';
import alert from './AlertReducer';
import order from './OrderReducer';
import product from './ProductReducer';
import customer from './CustomerReducer';
import broadcast from './InboxReducer';
import campaign from './CampaignReducer';
import language from './LanguageReducer';
import promotion from './PromotionReducer';
import masterdata from './MasterdataReducer';
import theme from './ThemeReducer';
import voucher from './VoucherReducer';
import payment from './PaymentReducer';
import svc from './SVCReducer';
import getSpaceLogo from './LogoReducer';
import guestCheckoutCart from './GuestCheckoutCart';
import appointmentReducer from './AppointmentReducer';
import packageReducer from "./PackageReducer";

const rootReducer = combineReducers({
  auth,
  outlet,
  loader,
  alert,
  order,
  language,
  customer,
  campaign,
  promotion,
  product,
  masterdata,
  broadcast,
  theme,
  voucher,
  payment,
  svc,
  getSpaceLogo,
  guestCheckoutCart,
  appointmentReducer,
  packageReducer,
});

export default rootReducer;
