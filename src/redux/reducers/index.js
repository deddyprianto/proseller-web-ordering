import { combineReducers } from "redux";
import auth from "./AuthReducer";
import outlet from "./OutletReducer";
import loader from "./LoaderReducer";
import alert from "./AlertReducer";
import order from "./OrderReducer";
import product from "./ProductReducer";
import customer from "./CustomerReducer";
import broadcast from "./InboxReducer";
import campaign from "./CampaignReducer";
import language from "./LanguageReducer";
import promotion from "./PromotionReducer";
import masterdata from "./MasterdataReducer";
import theme from "./ThemeReducer";
import voucher from "./VoucherReducer";

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
});

export default rootReducer;
