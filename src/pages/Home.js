/* eslint-disable react/prop-types */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import Banner from 'components/banner';
import ProductList from 'components/ProductList';
import { useHistory } from 'react-router-dom';
import { OutletAction } from 'redux/actions/OutletAction';
import OutletSelection from './OutletSelection';

import { PromotionAction } from 'redux/actions/PromotionAction';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import { OrderAction } from 'redux/actions/OrderAction';
import { CONSTANT } from 'helpers';
import ModalAppointment from 'components/modalAppointment/ModalAppointment';
import { useLocalStorage } from 'hooks/useLocalStorage';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import LayoutTypeA from 'components/template/LayoutTypeA';
import config from 'config';

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

const mapStateToProps = (state) => {
  return {
    setting: state.order,
    defaultOutlet: state.outlet.defaultOutlet,
    isLoggedIn: state.auth.isLoggedIn,
    orderingMode: state.order.orderingMode,
    basketGuestCo: state.guestCheckoutCart.data,
    basket: state.order.basket,
    color: state.theme.color,
    product: state.product.productList,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Home = ({ ...props }) => {
  const settingAppoinment = props.setting.setting.find((items) => {
    return items.settingKey === 'EnableAppointment';
  });
  const [name, setName] = useLocalStorage(
    'popup_appointment',
    settingAppoinment?.settingValue
  );
  const history = useHistory();
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const gadgetScreen = width < 980;
  const styles = {
    root: {
      paddingBottom: 100,
    },
    rootProduct: {
      paddingLeft: gadgetScreen ? '3%' : '10%',
      paddingRight: gadgetScreen ? '3%' : '10%',
    },
  };
  const isEmenu = window.location.hostname.includes('emenu');

  const isLanding = window.location.href.includes('landing');

  useEffect(() => {
    const loadData = async () => {
      const href = window.location.href;
      const hrefSplit = href.split('input=');
      const key = hrefSplit[1];

      const keyDecoded = base64.decode(decodeURI(key));
      const keyDecodedSplit = keyDecoded.split('::');
      const outletId = keyDecodedSplit[1];

      if (outletId) {
        const outletById = await props.dispatch(
          OutletAction.getOutletById(outletId)
        );

        await props.dispatch(OutletAction.setDefaultOutlet(outletById));

        if (outletById.orderingStatus === 'UNAVAILABLE') {
          const settings = await props.dispatch(
            OrderAction.getSettingOrdering()
          );
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
  }, [window.location.href, isLanding]);

  useEffect(() => {
    if (name) {
      setName(true);
    }
  }, [props.setting]);

  useEffect(() => {
    if (
      isEmptyObject(props.defaultOutlet) ||
      (props.defaultOutlet.orderingStatus === 'UNAVAILABLE' && !isLanding)
    ) {
      history.push('/outlets');
    }
  }, [props.defaultOutlet]);

  useEffect(() => {
    const loadData = async () => {
      // TODO: need explain for this
      await props.dispatch(PromotionAction.fetchPromotion());
    };
    loadData();
  }, []);

  useEffect(() => {
    props.dispatch({
      type: 'SAVE_DETAIL_TOP_UP_SVC',
      payload: {},
    });
    props.dispatch({ type: 'INDEX_VOUCHER', payload: {} });
  }, []);

  useEffect(() => {
    const isOfflineCartGuestCO = JSON.parse(
      localStorage.getItem('BASKET_GUESTCHECKOUT')
    );

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
    const isBasketEmpty = props.basketGuestCo.message === 'Cart it empty.';

    const isOfflineCartGuestCOExist =
      isOfflineCartGuestCO &&
      isOfflineCartGuestCO?.message !== 'Cart it empty.' &&
      props.isLoggedIn;

    if (isBasketEmpty) {
      dispatch({
        type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT,
        payload: '',
      });
    }

    if (isOfflineCartGuestCOExist) {
      saveGuestCheckoutOfflineCart();
    }
  }, []);

  const renderProductListOrOutletSelection = () => {
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );

    if (
      props.setting.outletSelection === 'MANUAL' &&
      !props.defaultOutlet?.id &&
      !isEmenu
    ) {
      return <OutletSelection />;
    } else if (infoCompany?.companyName === 'PinkCity') {
      return (
        <div style={styles.rootProduct}>
          <Banner />
          <LayoutTypeA />
        </div>
      );
    } else {
      return (
        <div style={styles.rootProduct}>
          <Banner />
          <ProductList />
          {!isEmptyArray(props.product) && (
            <ModalAppointment
              name={name}
              setName={setName}
              isLoggedIn={props.isLoggedIn}
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

Home.defaultProps = {
  defaultOutlet: {},
  setting: {},
  dispatch: null,
};

Home.propTypes = {
  defaultOutlet: PropTypes.object,
  dispatch: PropTypes.func,
  setting: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
