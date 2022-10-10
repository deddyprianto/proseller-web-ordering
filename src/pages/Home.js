import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Banner from 'components/banner';
import ProductList from 'components/ProductList';
import OrderingRetail from '../components/ordering/indexRetail';
import { useHistory } from 'react-router-dom';
import { OutletAction } from 'redux/actions/OutletAction';
import OutletSelection from './OutletSelection';

import { PromotionAction } from 'redux/actions/PromotionAction';

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
    orderingSetting: state.order.orderingSetting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Home = ({ ...props }) => {
  const history = useHistory();
  const [width] = useWindowSize();
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
      console.log('GILA', outletId);

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

  const renderOrderingRetail = () => {
    if (props.orderingSetting?.CategoryHeaderType === 'WITH_CATEGORY_PAGE') {
      return <OrderingRetail history={props.history}></OrderingRetail>;
    } else {
      return <ProductList />;
    }
  };
  const renderProductListOrOutletSelection = () => {
    if (
      props.setting?.outletSelection === 'MANUAL' &&
      !props.defaultOutlet?.id &&
      !isEmenu
    ) {
      return <OutletSelection />;
    } else {
      return (
        <div style={styles.rootProduct}>
          <Banner />
          {renderOrderingRetail()}
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
