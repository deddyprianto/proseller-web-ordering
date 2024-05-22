import React, { useEffect } from 'react';
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
import useWindowSize from 'hooks/useWindowSize';
import commonAlert from 'components/template/commonAlert';
import { ItemResults } from 'components/InputSearch/ItemResults';

const LayoutTypeA = loadable(() => import('components/template/LayoutTypeA'));
const LayoutTypeB = loadable(() => import('components/template/LayoutTypeB'));
const ModalAppointment = loadable(() =>
  import('components/modalAppointment/ModalAppointment')
);
const OutletSelection = loadable(() => import('./OutletSelection'));

const base64 = require('base-64');

const Home = () => {
  const history = useHistory();
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const gadgetScreen = width < 980;
  const isEmenu = window.location.hostname.includes('emenu');
  const isLanding = window.location.href.includes('landing');

  const setting = useSelector((state) => state.order.setting);
  const {isSearchItem,keywordSearch} = useSelector(state => state.getSpaceLogo);
  const outletSelection = useSelector((state) => state.order.outletSelection);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const basketGuestCo = useSelector(
    (state) => state.guestCheckoutCart.basketGuestCo
  );
  const productList = useSelector((state) => state.product.productList);
  const color = useSelector((state) => state.theme.color);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'EnableAppointment';
  });
  const settingCategoryHeader = setting.find((items) => {
    return items.settingKey === 'CategoryHeaderType';
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
      paddingTop: '3%',
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
          commonAlert({
            color: color.primary,
            title: 'The outlet is not available',
            content: `${outletById.name} is currently not available, please select another outlet`,
            onConfirm: () => {
              history.push('/outlets');
            },
          });
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
      dispatch({
        type: CONSTANT.BUILD_CART_ERROR_DATA,
        payload: null,
      });
      Swal.hideLoading();
      if (response?.type === 'DATA_BASKET' || !response) {
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

  const renderLayout = () => {
    if (settingCategoryHeader?.settingValue === "WITH_CATEGORY_PAGE") {
      return <LayoutTypeA />;
    }

    if (settingCategoryHeader?.settingValue === "CATEGORY_WITH_ALL_PRODUCT") {
      return <LayoutTypeB />;
    }

    return (
      <div style={{ padding: gadgetScreen ? "0 3%" : "0 10%" }}>
        <ProductList />
      </div>
    );
  };

  const renderProductListOrOutletSelection = () => {
    if (outletSelection === 'MANUAL' && !defaultOutlet?.id && !isEmenu) {
      return (
        <div style={{ height: '100%' }}>
          <OutletSelection />
        </div>
      );
    } else {
      return (
        <div style={styles.rootProduct}>
          {isSearchItem ||  settingCategoryHeader?.settingValue !==
            'CATEGORY_WITH_ALL_PRODUCT' && (
            <Banner outletId={defaultOutlet?.id || 0} />
          )}
          
          {
              keywordSearch ? (
                <ItemResults/>
              )  : (
                <div>
                <div className={isSearchItem && 'product-item'}/> 
                {renderLayout()}
                </div>
              )
            }

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
  return <div style={styles.root}>{renderProductListOrOutletSelection()}</div>;
};

export default Home;
