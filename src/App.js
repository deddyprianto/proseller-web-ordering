/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import loadable from '@loadable/component';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';

import { AuthActions } from './redux/actions/AuthAction';
import { Redirect, Switch, Route, HashRouter } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { OutletAction } from './redux/actions/OutletAction';
import { MasterDataAction } from './redux/actions/MasterDataAction';
import { OrderAction } from './redux/actions/OrderAction';
import { PaymentAction } from './redux/actions/PaymentAction';
import { ReferralAction } from './redux/actions/ReferralAction';

import locale_en from 'react-intl/locale-data/en';
import locale_id from 'react-intl/locale-data/id';

import messages_id from './languages/id.json';
import messages_en from './languages/en.json';

import config from './config';

import { lsLoad } from './helpers/localStorage';

import jss from 'jss';
import preset from 'jss-preset-default';

import styles from './styles/theme';
import NotFound from './pages/NotFound';
import Loading from 'components/loading/Loading';

const Layout = loadable(() => import('./components/template/Layout'));

const base64 = require('base-64');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const messages = {
  ID: messages_id,
  EN: messages_en,
};

jss.setup(preset());

const sheet = jss.createStyleSheet(styles, { link: true }).attach();

addLocaleData([...locale_id, ...locale_en]);

const App = (props) => {
  let {
    lang,
    isLoggedIn,
    deliveryProviders,
    deliveryAddress,
    setting,
    defaultOutlet,
    dispatch,
  } = props;
  let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));


  const [enableOrdering, setEnableOrdering] = useState(false);
  const domainNameExist = props.domainName && props.domainName.length > 0;
  const initialDomainNameExists = domainNameExist;

  const lightenDarkenColor = (col, amt) => {
    const num = parseInt(col, 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00ff) + amt;
    const g = (num & 0x0000ff) + amt;
    const newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
  };

  const getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split('?')[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split('&');
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split('=');
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  };

  const handleReLogin = async (account) => {
    account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));
    let timeExp = account.accessToken.payload.exp * 1000 - 60000;
    let timeNow = moment().format();
    if (moment(timeNow).isSameOrAfter(timeExp)) {
      await props.dispatch(AuthActions.refreshToken());
    }
  };

  const checkUser = async () => {
    window.onhashchange = function () {
      try {
        // get modals
        const modals = document.getElementsByClassName('modal');

        // get modal backdrops
        for (let i = 0; i < modals.length; i++) {
          modals[i].classList.remove('show');
          modals[i].setAttribute('aria-hidden', 'true');
          modals[i].setAttribute('style', 'display: none');
        }

        // get modal backdrops
        const modalsBackdrops =
          document.getElementsByClassName('modal-backdrop');

        // remove every modal backdrop
        for (let i = 0; i < modalsBackdrops.length; i++) {
          document.body.removeChild(modalsBackdrops[i]);
        }
      } catch (e) {
        // console.log(e);
      }
    };

    const responseSettings = await props.dispatch(
      OrderAction.getSettingOrdering()
    );

    try {
      let position = JSON.parse(
        localStorage.getItem(`${config.prefix}_locationCustomer`)
      );

      if (!position) {
        props.dispatch(OutletAction.getCoordinates());
      }
    } catch (error) {
      console.log('Get location false');
    }

    if (!isLoggedIn || !account)
      localStorage.removeItem(`${config.prefix}_account`);

    if (account) {
      await props.dispatch(PaymentAction.getPaymentCard());
      await handleReLogin(account);
      setInterval(async () => {
        await handleReLogin(account);
      }, 1000);
    }

    let param = getUrlParameters();
    if (param && param['input']) {
      param = getUrlParameters(base64.decode(decodeURI(param['input'])));
      localStorage.setItem(
        `${config.prefix}_scanTable`,
        JSON.stringify(encryptor.encrypt(param))
      );
      console.log('input url', param);

      if (param.orderingMode)
        localStorage.setItem(
          `${config.prefix}_ordering_mode`,
          param.orderingMode
        );
      defaultOutlet = await props.dispatch(
        MasterDataAction.getOutletByID(param['outlet'].split('::')[1], true)
      );

      if (defaultOutlet && defaultOutlet.id)
        defaultOutlet = config.getValidation(defaultOutlet);
      await props.dispatch(OutletAction.fetchDefaultOutlet(defaultOutlet));
    } else {
      // localStorage.removeItem(`${config.prefix}_scanTable`);
      let outletSelectionMode = 'DEFAULT';
      if (responseSettings && responseSettings.settings !== undefined) {
        const find = responseSettings.settings.find(
          (item) => item.settingKey === 'OutletSelection'
        );
        if (find !== undefined) outletSelectionMode = find.settingValue;
      }
      if (outletSelectionMode !== 'MANUAL') {
        if (_.isEmpty(defaultOutlet) || (defaultOutlet && !defaultOutlet.id)) {
          defaultOutlet = await props.dispatch(
            OutletAction.fetchDefaultOutlet()
          );
        }
      }
    }

    if (param && param['referral'] && !isLoggedIn && !account) {
      const referralCode = param['referral'].split('#')[0];

      const isAvailable = await props.dispatch(
        ReferralAction.getReferralById(referralCode)
      );
      if (isAvailable) {
        props.dispatch(AuthActions.setInvitationCode(referralCode));
        setTimeout(() => {
          try {
            document.getElementById('login-register-btn').click();
          } catch (error) {
            console.log(error);
          }
        }, 600);
      }
    }

    if (window.location.hash.split('#')[1] !== '/') {
      if (!param && defaultOutlet && defaultOutlet.id && enableOrdering) {
        defaultOutlet = await props.dispatch(
          MasterDataAction.getOutletByID(defaultOutlet.id, true)
        );
      }
      props.dispatch(OrderAction.getCart());
    }
  };

  useEffect(() => {
    if (setting) {
      let enableOrdering = setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrdering) {
        setEnableOrdering(enableOrdering.settingValue);
      }
    }
  }, [deliveryAddress, deliveryProviders, setting]);

  useEffect(() => {
    if (
      domainNameExist &&
      props.domainName &&
      props.domainName.length > 0 &&
      props.domainName !== 'NOT_FOUND'
    ) {
      checkUser();
    } else {
      props.getDomainName();
    }
  }, [domainNameExist, props.domainName]);

  useEffect(() => {
    if (
      !initialDomainNameExists &&
      props.domainName &&
      props.domainName.length > 0
    ) {
      window.location.reload();
    }
  }, [props.domainName]);

  useEffect(() => {
    if (
      props.orderingModeSelectedOn &&
      props.orderingSetting &&
      props.orderingModes &&
      props.orderingModes.length > 1
    ) {
      const orderingModeExpiredIn = parseInt(
        props.orderingSetting.OrderingModeExpiredIn
      );
      if (orderingModeExpiredIn && orderingModeExpiredIn > 0) {
        const stopInterval = (intervalObj) => {
          clearInterval(intervalObj);
        };
        const interval = setInterval(() => {
          const now = new Date();
          if (
            props.orderingModeSelectedOn.getTime() +
              orderingModeExpiredIn * 60000 <=
            now.getTime()
          ) {
            stopInterval(interval);
            dispatch({ type: 'REMOVE_ORDERING_MODE' });
          }
        }, 60000);
      }
    }
  }, [
    props.orderingModeSelectedOn,
    props.orderingSetting,
    props.orderingModes,
  ]);

  useEffect(() => {
    if (props.theme && props.banners) {
      const hoverColor = `#${lightenDarkenColor(
        (props.theme.color.primary || '#c00a27').substring(1),
        -10
      )}`;

      sheet.update({
        theme: {
          ...props.theme,
          hoverColor,
          withBanners: props.banners.length > 0,
        },
      });
    }
  }, [props.banners, props.theme]);

  return domainNameExist ? (
    props.domainName !== 'NOT_FOUND' ? (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <HashRouter>
          <Switch>
            <Route component={Layout} />
            <Redirect from='*' to='/' />
          </Switch>
        </HashRouter>
      </IntlProvider>
    ) : (
      <NotFound></NotFound>
    )
  ) : (
    <Loading loadingType='ListLoading' />
  );
};

const mapStateToProps = (state) => {
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
    outletSelection: state.order.outletSelection,
    defaultEmail: state.customer.defaultEmail,
    defaultPhoneNumber: state.customer.defaultPhoneNumber,
    domainName: state.masterdata.domainName,
    orderingModeSelectedOn: state.order.orderingModeSelectedOn,
    orderingSetting: state.order.orderingSetting,
    orderingModes: state.order.orderingModes,
    banners: state.promotion.banners,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    onLogin: (username, password) => {
      dispatch(AuthActions.auth(username, password));
    },
    getDomainName: () => {
      dispatch(MasterDataAction.getDomainName());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
