import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import moment from "moment";
import { connect } from "react-redux";
import _ from "lodash";

import { AuthActions } from "./redux/actions/AuthAction";
import { Redirect, Switch, Route, HashRouter } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { OutletAction } from "./redux/actions/OutletAction";
import { MasterdataAction } from "./redux/actions/MaterdataAction";
import { OrderAction } from "./redux/actions/OrderAction";
import { CustomerAction } from "./redux/actions/CustomerAction";
import { PaymentAction } from "./redux/actions/PaymentAction";

import locale_en from "react-intl/locale-data/en";
import locale_id from "react-intl/locale-data/id";

import messages_id from "./languages/id.json";
import messages_en from "./languages/en.json";

import config from "./config";

import { lsLoad } from "./helpers/localStorage";

import jss from "jss";
import preset from "jss-preset-default";

import styles from "./styles/theme";

const Layout = loadable(() => import("./components/template/Layout"));
// import Layout from "./components/template/Layout";
const base64 = require("base-64");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

const messages = {
  ID: messages_id,
  EN: messages_en,
};

jss.setup(preset());

const sheet = jss.createStyleSheet(styles, { link: true }).attach();

addLocaleData([...locale_id, ...locale_en]);

const App = (props) => {
  const {
    lang,
    isLoggedIn,
    deliveryProviders,
    basket,
    deliveryAddress,
    dispatch,
    companyInfo,
    setting
  } = props;

  const [enableOrdering, setEnableOrdering] = useState(false)

  const lightenDarkenColor = (col, amt) => {
    const num = parseInt(col, 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00ff) + amt;
    const g = (num & 0x0000ff) + amt;
    const newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
  };

  const hoverColor = `#${lightenDarkenColor(
    props.theme.color.primary.substring(1),
    -10
  )}`;

  sheet.update({ theme: { ...props.theme, hoverColor } });

  const getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split("?")[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split("&");
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split("=");
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  };

  const getCurrency = (price) => {
    if (companyInfo && companyInfo.data) {
      if (price !== undefined) {
        const { currency } = companyInfo.data;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
    return price;
  };

  const checkUser = async () => {
    if(window.location.hash.split("#")[1] === "/signin" && !isLoggedIn){
      try {
        document.getElementById("login-register-btn").click();
      } catch (error) {}
    }

    try {
      let position = await props.dispatch(OutletAction.getCoordinates())
      let location = { latitude: position.coords.latitude, longitude: position.coords.longitude }
      localStorage.setItem(`${config.prefix}_locationCustomer`, JSON.stringify(location));
    } catch (error) {
      console.log("Get location false")
    }

    if (!isLoggedIn || !account) localStorage.removeItem(`${config.prefix}_account`);
    if (account) {
      await props.dispatch(PaymentAction.getPaymentCard());
      setInterval(async () => {
        account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));
        let timeExp = account.accessToken.payload.exp * 1000 - 60000;
        let timeNow = moment().format();
        if (moment(timeNow).isSameOrAfter(timeExp)) {
          await props.dispatch(AuthActions.refreshToken());
        }
      }, 1000);
    }

    let param = getUrlParameters();
    let defaultOutlet = null
    if (param && param["input"]) {
      param = getUrlParameters(base64.decode(decodeURI(param["input"])));
      localStorage.setItem(`${config.prefix}_scanTable`, JSON.stringify(encryptor.encrypt(param)));
      console.log("input url", param)

      if (param.orderingMode) localStorage.setItem(`${config.prefix}_ordering_mode`, param.orderingMode);

      defaultOutlet = props.defaultOutlet
      if(_.isEmpty(defaultOutlet) || (defaultOutlet && !defaultOutlet.id)) {
        defaultOutlet = await props.dispatch(MasterdataAction.getOutletByID(param["outlet"].split("::")[1], true));
      }
      
      if (defaultOutlet && defaultOutlet.id) defaultOutlet = config.getValidation(defaultOutlet)
      await props.dispatch(OutletAction.fetchDefaultOutlet(defaultOutlet));
    } else {
      localStorage.removeItem(`${config.prefix}_scanTable`);
      
      defaultOutlet = props.defaultOutlet;
      if (_.isEmpty(defaultOutlet) || (defaultOutlet && !defaultOutlet.id)){
        defaultOutlet = await props.dispatch(OutletAction.fetchDefaultOutlet());
      }
    }

    if (window.location.hash.split("#")[1] !== "/") {
      if (!param && props.defaultOutlet && enableOrdering) {
        defaultOutlet =  props.defaultOutlet
        if(_.isEmpty(defaultOutlet) || (defaultOutlet && !defaultOutlet.id)){
          defaultOutlet = await props.dispatch(OutletAction.fetchDefaultOutlet());
        } else {
          defaultOutlet = await props.dispatch(MasterdataAction.getOutletByID(defaultOutlet.id,true));
        }
      }

      await props.dispatch(OrderAction.getCart());
    }

    props.dispatch(CustomerAction.mandatoryField());
  };

  const refreshDeliveryProvider = async () => {
    if (deliveryProviders && basket && basket.outlet) {
      let isEqual = true;
      console.log("Refreshing delivery providers...");
      // console.log(deliveryProviders);
      const newDeliveryProvider = await Promise.all(
        deliveryProviders.map(async (provider) => {
          const payload = {
            outletId: basket.outlet.id,
            cartID: basket.cartID,
            provider: provider.id,
            service: provider.name,
            deliveryAddress,
          };
          const response = await dispatch(OrderAction.getCalculateFee(payload));
          const deliveryFee = await response.deliveryFee;
          if (provider.deliveryFeeFloat !== deliveryFee) isEqual = false;
          return {
            ...provider,
            deliveryFee: getCurrency(deliveryFee),
            deliveryFeeFloat: deliveryFee,
          };
        })
      );
      if (!isEqual) {
        dispatch({
          type: "SET_SELECTED_PROVIDERS",
          payload: newDeliveryProvider,
        });
      }
      if (newDeliveryProvider.length === 1) {
        const newSelectedDeliveryProvider = await newDeliveryProvider[0];
        dispatch({
          type: "SET_SELECTED_DELIVERY_PROVIDERS",
          payload: newSelectedDeliveryProvider,
        });
      } else {
        dispatch({
          type: "SET_SELECTED_DELIVERY_PROVIDERS",
          payload: null,
        });
      }
    } else {
      // console.log(
      //   "Trying to refresh delivery providers, but current delivery providers is null :("
      // );
    }
  };
  useEffect(() => {
    if (deliveryAddress) {
      refreshDeliveryProvider();
    }
    if (setting) {
      let enableOrdering = setting.find(items => { return items.settingKey === "EnableOrdering" })
      if (enableOrdering) {
        setEnableOrdering(enableOrdering.settingValue)
      }
    }
  }, [deliveryAddress, deliveryProviders, setting]);

  useEffect(async () => {
    await props.dispatch(OrderAction.getTheme());
    await props.dispatch(OrderAction.getSettingOrdering());
    refreshDeliveryProvider();
    checkUser();
  }, []);

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <HashRouter>
        <Switch>
          <Route component={Layout} />
          <Redirect from="*" to="/" />
        </Switch>
      </HashRouter>
    </IntlProvider>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    lang: state.language.lang,
    theme: state.theme,
    defaultOutlet: state.outlet.defaultOutlet,
    deliveryProviders: state.order.deliveryProviders,
    deliveryAddress: state.order.deliveryAddress,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo,
    setting: state.order.setting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    onLogin: (username, password) => {
      dispatch(AuthActions.auth(username, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
