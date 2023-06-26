/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';

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
import { isEmpty } from 'helpers/utils';

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

const App = ({ version }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const lang = useSelector((state) => state.language.lang);
  const theme = useSelector((state) => state.theme);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const {
    deliveryProviders,
    deliveryAddress,
    setting,
    orderingModeSelectedOn,
    orderingSetting,
    orderingModes,
  } = useSelector((state) => state.order);
  const domainName = useSelector((state) => state.masterdata.domainName);
  const banners = useSelector((state) => state.promotion.banners);

  let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

  const [enableOrdering, setEnableOrdering] = useState(false);
  const domainNameExist = domainName?.length;

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
    let timeNow = new Date();

    if (timeNow >= new Date(timeExp)) {
      await dispatch(AuthActions.refreshToken());
    }
  };

  const checkUser = async () => {
    let defaultOutletTemp = defaultOutlet;

    window.onhashchange = function () {
      try {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
          modals[i].classList.remove('show');
          modals[i].setAttribute('aria-hidden', 'true');
          modals[i].setAttribute('style', 'display: none');
        }

        const modalsBackdrops =
          document.getElementsByClassName('modal-backdrop');
        for (let i = 0; i < modalsBackdrops.length; i++) {
          document.body.removeChild(modalsBackdrops[i]);
        }
      } catch (e) {
        throw e;
      }
    };

    const responseSettings = await dispatch(OrderAction.getSettingOrdering());

    try {
      let position = JSON.parse(
        localStorage.getItem(`${config.prefix}_locationCustomer`)
      );
      if (!position) {
        dispatch(OutletAction.getCoordinates());
      }
    } catch (error) {
      console.log('Get location false');
    }

    if (!isLoggedIn || !account) {
      localStorage.removeItem(`${config.prefix}_account`);
    }

    if (account) {
      await dispatch(PaymentAction.getPaymentCard());
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

      if (param.orderingMode) {
        localStorage.setItem(
          `${config.prefix}_ordering_mode`,
          param.orderingMode
        );
      }

      defaultOutletTemp = await dispatch(
        MasterDataAction.getOutletByID(param['outlet'].split('::')[1], true)
      );

      if (defaultOutletTemp && defaultOutletTemp.id) {
        defaultOutletTemp = config.getValidation(defaultOutletTemp);
      }
      await dispatch(OutletAction.fetchDefaultOutlet(defaultOutletTemp));
    } else {
      let outletSelectionMode = 'DEFAULT';
      if (responseSettings && responseSettings.settings !== undefined) {
        const find = responseSettings.settings.find(
          (item) => item.settingKey === 'OutletSelection'
        );
        if (find !== undefined) {
          outletSelectionMode = find.settingValue;
        }
      }
      if (outletSelectionMode !== 'MANUAL') {
        if (
          isEmpty(defaultOutletTemp) ||
          (defaultOutletTemp && !defaultOutletTemp.id)
        ) {
          defaultOutletTemp = await dispatch(OutletAction.fetchDefaultOutlet());
        }
      }
    }

    if (param && param['referral'] && !isLoggedIn && !account) {
      const referralCode = param['referral'].split('#')[0];
      const isAvailable = await dispatch(
        ReferralAction.getReferralById(referralCode)
      );
      if (isAvailable) {
        dispatch(AuthActions.setInvitationCode(referralCode));
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
      if (
        !param &&
        defaultOutletTemp &&
        defaultOutletTemp.id &&
        enableOrdering
      ) {
        defaultOutletTemp = await dispatch(
          MasterDataAction.getOutletByID(defaultOutletTemp.id, true)
        );
      }
      dispatch(OrderAction.getCart());
    }
  };

  useEffect(() => {
    localStorage.setItem('APP_VERSION_WEBORDERING', version);
  }, [version]);

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
    const getDomainName = () => {
      dispatch(MasterDataAction.getDomainName());
    };

    if (domainNameExist && domainName !== 'NOT_FOUND') {
      checkUser();
    } else if (!domainNameExist) {
      window.location.reload();
    } else {
      getDomainName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainNameExist, domainName, dispatch]);

  useEffect(() => {
    if (
      orderingModeSelectedOn &&
      orderingSetting &&
      orderingModes &&
      orderingModes.length > 1
    ) {
      const orderingModeExpiredIn = parseInt(
        orderingSetting.OrderingModeExpiredIn
      );
      if (orderingModeExpiredIn && orderingModeExpiredIn > 0) {
        const stopInterval = (intervalObj) => {
          clearInterval(intervalObj);
        };
        const interval = setInterval(() => {
          const now = new Date();
          if (
            orderingModeSelectedOn.getTime() + orderingModeExpiredIn * 60000 <=
            now.getTime()
          ) {
            stopInterval(interval);
            dispatch({ type: 'REMOVE_ORDERING_MODE' });
          }
        }, 60000);
      }
    }
  }, [orderingModeSelectedOn, orderingSetting, orderingModes, dispatch]);

  useEffect(() => {
    if (theme && banners) {
      const hoverColor = `#${lightenDarkenColor(
        (theme.color.primary || '#c00a27').substring(1),
        -10
      )}`;

      sheet.update({
        theme: {
          ...theme,
          hoverColor,
          withBanners: banners.length > 0,
        },
      });
    }
  }, [banners, theme]);

  return domainNameExist ? (
    domainName !== 'NOT_FOUND' ? (
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

export default App;
