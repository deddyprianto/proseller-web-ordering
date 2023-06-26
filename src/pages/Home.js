import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import loadable from '@loadable/component';

import Banner from 'components/banner';
import ProductList from 'components/ProductList';
import { useHistory } from 'react-router-dom';
import { OutletAction } from 'redux/actions/OutletAction';

import { PromotionAction } from 'redux/actions/PromotionAction';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import { OrderAction } from 'redux/actions/OrderAction';
import { CONSTANT } from 'helpers';
import { useLocalStorage } from 'hooks/useLocalStorage';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import config from 'config';

const LayoutTypeA = loadable(() => import('components/template/LayoutTypeA'));
const ModalAppointment = loadable(() =>
  import('components/modalAppointment/ModalAppointment')
);
const OutletSelection = loadable(() => import('./OutletSelection'));

const base64 = require('base-64');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const Home = () => {
  const history = useHistory();
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const gadgetScreen = width < 980;
  const isEmenu = window.location.hostname.includes('emenu');
  const isLanding = window.location.href.includes('landing');

  const setting = useSelector((state) => state.order.setting);
  const outletSelection = useSelector((state) => state.order.outletSelection);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const basketGuestCo = useSelector(
    (state) => state.guestCheckoutCart.basketGuestCo
  );
  const productList = useSelector((state) => state.product.productList);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'EnableAppointment';
  });
  const [name, setName] = useLocalStorage(
    'popup_appointment',
    settingAppoinment?.settingValue
  );

  const styles = {
    root: {
      paddingBottom: 100,
    },
    rootProduct: {
      paddingLeft: gadgetScreen ? '3%' : '10%',
      paddingRight: gadgetScreen ? '3%' : '10%',
      height: '100%',
    },
  };

  useEffect(() => {
    const loadData = async () => {
      const href = window.location.href;
      const hrefSplit = href.split('input=');
      const key = hrefSplit[1];

      const keyDecoded = base64.decode(decodeURI(key));
      const keyDecodedSplit = keyDecoded.split('::');
      const outletId = keyDecodedSplit[1];

      if (outletId) {
        const outletById = await dispatch(OutletAction.getOutletById(outletId));

        await dispatch(OutletAction.setDefaultOutlet(outletById));

        if (outletById.orderingStatus === 'UNAVAILABLE') {
          const settings = await dispatch(OrderAction.getSettingOrdering());
          const primaryColor = settings.settings.find((items) => {
            return items.settingKey === 'PrimaryColor';
          });

          handleAlert(outletById, primaryColor.settingValue);
        } else {
          history.push('/');
        }
      }
    };
    if (isLanding) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href, isLanding]);

  useEffect(() => {
    if (name) {
      setName(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  useEffect(() => {
    if (
      isEmptyObject(defaultOutlet) ||
      (defaultOutlet.orderingStatus === 'UNAVAILABLE' && !isLanding)
    ) {
      history.push('/outlets');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOutlet]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(PromotionAction.fetchPromotion());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'SAVE_DETAIL_TOP_UP_SVC',
      payload: {},
    });
    dispatch({ type: 'INDEX_VOUCHER', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    const isOfflineCartGuestCO = JSON.parse(
      localStorage.getItem('BASKET_GUESTCHECKOUT')
    );
    const idGuestCheckout = localStorage.getItem('idGuestCheckout');

    const fetchBasket = async () => {
      if (idGuestCheckout) {
        await dispatch(
          OrderAction.getCartGuestMode(`guest::${idGuestCheckout}`)
        );
      }
    };

    fetchBasket();

    const saveGuestCheckoutOfflineCart = async () => {
      Swal.showLoading();
      const response = await dispatch(
        OrderAction.addCartFromGuestCOtoCartLogin(isOfflineCartGuestCO)
      );
      Swal.hideLoading();
      if (response?.type === 'DATA_BASKET') {
        localStorage.removeItem('BASKET_GUESTCHECKOUT');
      }
      Swal.fire({
        icon: 'success',
        title: 'Saving',
        text: 'We are saving your previous Cart!',
      });
    };
    const isBasketEmpty = basketGuestCo?.message === 'Cart it empty.';

    const isOfflineCartGuestCOExist =
      isOfflineCartGuestCO &&
      isOfflineCartGuestCO?.message !== 'Cart it empty.' &&
      isLoggedIn;

    if (isBasketEmpty) {
      dispatch({
        type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT,
        payload: '',
      });
    }

    if (isOfflineCartGuestCOExist) {
      saveGuestCheckoutOfflineCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderProductListOrOutletSelection = () => {
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );

    if (outletSelection === 'MANUAL' && !defaultOutlet?.id && !isEmenu) {
      return (
        <div style={{ height: '100%' }}>
          <OutletSelection />
        </div>
      );
    } else {
      return (
        <div style={styles.rootProduct}>
          <Banner outletId={defaultOutlet?.id || 0} />
          {infoCompany?.companyName === 'PinkCity' ? (
            <LayoutTypeA />
          ) : (
            <ProductList />
          )}
          {!isEmptyArray(productList) && (
            <ModalAppointment
              name={name}
              setName={setName}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      );
    }
  };

  const handleAlert = (item, color) => {
    Swal.fire({
      title: '<p>The outlet is not available</p>',
      html: `<h5 style='color:#B7B7B7; font-size:14px'>${item.name} is currently not available, please select another outlet</h5>`,
      allowOutsideClick: false,
      confirmButtonText: 'OK',
      confirmButtonColor: color,
      width: '40em',
      customClass: {
        confirmButton: fontStyleCustom.buttonSweetAlert,
        title: fontStyleCustom.fontTitleSweetAlert,
      },
    }).then(() => {
      history.push('/outlets');
    });
  };

  return <div style={styles.root}>{renderProductListOrOutletSelection()}</div>;
};

export default Home;
