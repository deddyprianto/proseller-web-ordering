import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from 'config';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import _ from 'lodash';
import LoadingOverlay from 'react-loading-overlay';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { isEmptyArray } from 'helpers/CheckEmpty';

import { CustomerAction } from 'redux/actions/CustomerAction';

import Voucher from './components/Voucher';

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const mapStateToProps = (state) => {
  return {
    selectedVoucher: state.payment.selectedVoucher,
  };
};

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

const MyVoucherList = ({ ...props }) => {
  const [width] = useWindowSize();
  const gadgetScreen = width < 900;
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: gadgetScreen ? 2 : 40,
      paddingRight: gadgetScreen ? 2 : 40,
    },
  };

  const handleVoucherSerialNumbers = () => {
    let items = [];
    if (!isEmptyArray(props.selectedVoucher)) {
      props.selectedVoucher.forEach((voucher) => {
        items.push(voucher.serialNumber);
      });
    }
    return items;
  };

  const handleFilterVoucher = (vouchers) => {
    const voucherSerialNumbers = handleVoucherSerialNumbers();
    const result = filter(
      vouchers,
      (voucher) => indexOf(voucherSerialNumbers, voucher.serialNumber) === -1
    );
    return result;
  };

  const handleVoucherById = (voucher) => {
    const voucherGroupById = _.chain(voucher)
      .groupBy((item) => {
        return item.id;
      })
      .map((value, key) => ({ id: key, values: value }))
      .value();
    return voucherGroupById;
  };

  const handleVoucherByExpiryDate = (voucher) => {
    const voucherGroupByExpiryDate = _.chain(voucher)
      .groupBy((item) => {
        return item.expiryDate;
      })
      .map((value, key) => ({ expiryDate: key, values: value }))
      .value();
    return voucherGroupByExpiryDate;
  };

  const handleVoucherGroup = (vouchers) => {
    const voucherFiltered = handleFilterVoucher(vouchers);
    if (!isEmptyArray(voucherFiltered)) {
      let result = [];
      const voucherGroupById = handleVoucherById(voucherFiltered);

      voucherGroupById.forEach((voucherById) => {
        const voucherGroupByExpiry = handleVoucherByExpiryDate(
          voucherById.values
        );

        voucherGroupByExpiry.forEach((voucherByExpiry) => {
          result.push({
            id: voucherById.id,
            values: voucherByExpiry.values,
          });
        });
      });
      return result;
    }
  };

  useEffect(() => {
    try {
      const loadData = async () => {
        setIsLoading(true);
        const vouchers = await props.dispatch(CustomerAction.getVoucher());
        const voucherGroup = handleVoucherGroup(vouchers.data);

        setVouchers(voucherGroup);

        setIsLoading(false);
      };
      loadData();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  const renderVoucherList = () => {
    if (!isEmptyArray(vouchers)) {
      const voucherList = vouchers.map((voucher, index) => {
        return (
          <Grid key={index} item xs={12} sm={6} md={6}>
            <Voucher
              item={voucher.values[0]}
              quantity={voucher.values.length}
            />
          </Grid>
        );
      });

      return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {voucherList}
        </Grid>
      );
    }

    if (isEmptyArray(vouchers) && !isLoading) {
      return (
        <div>
          <img src={config.url_emptyImage} alt='is empty' />
          <Typography>Oppss.. Voucher Not Found.</Typography>
        </div>
      );
    }
  };

  return (
    <Box component='div' sx={styles.root}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        {renderVoucherList()}
      </LoadingOverlay>
    </Box>
  );
};

MyVoucherList.defaultProps = {
  dispatch: null,
  selectedVoucher: [],
};

MyVoucherList.propTypes = {
  dispatch: PropTypes.func,
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(MyVoucherList);
