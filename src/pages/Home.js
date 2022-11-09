/* eslint-disable react/prop-types */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Banner from 'components/banner';
import ProductList from 'components/ProductList';
import { useHistory } from 'react-router-dom';
import { OutletAction } from 'redux/actions/OutletAction';
import OutletSelection from './OutletSelection';

import { PromotionAction } from 'redux/actions/PromotionAction';
import { isEmptyObject } from 'helpers/CheckEmpty';
import { OrderAction } from 'redux/actions/OrderAction';
import Swal from 'sweetalert2';
import { CONSTANT } from 'helpers';

const base64 = require('base-64');

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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Home = ({ ...props }) => {
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
        if (outletById) {
          await props.dispatch(OutletAction.setDefaultOutlet(outletById));
          history.push('/');
        }
      }
    };
    if (isLanding) {
      loadData();
    }
  }, [window.location.href, isLanding]);

  useEffect(() => {
    if (isEmptyObject(props.defaultOutlet)) {
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
    if (
      props.setting.outletSelection === 'MANUAL' &&
      !props.defaultOutlet?.id &&
      !isEmenu
    ) {
      return <OutletSelection />;
    } else {
      return (
        <div style={styles.rootProduct}>
          <Banner />
          <ProductList />
        </div>
      );
    }
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
