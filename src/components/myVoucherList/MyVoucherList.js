import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import _ from 'lodash';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { isEmptyArray } from 'helpers/CheckEmpty';

import Voucher from './components/Voucher';

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const mapStateToProps = (state) => {
  return {
    selectedVoucher: state.payment.selectedVoucher,
    myVoucher: state.customer.myVoucher,
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

  const styles = {
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
    const voucherGroup = handleVoucherGroup(props.myVoucher);

    setVouchers(voucherGroup);
  }, [props.myVoucher]);

  const renderVoucherList = () => {
    if (!isEmptyArray(vouchers)) {
      const voucherList = vouchers.map((voucher, index) => {
        console.log('%cdedd =>', 'color: green;', voucher);
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
  };

  return (
    <Box component='div' sx={styles.root}>
      {renderVoucherList()}
    </Box>
  );
};

MyVoucherList.defaultProps = {
  dispatch: null,
  selectedVoucher: [],
  myVoucher: [],
};

MyVoucherList.propTypes = {
  dispatch: PropTypes.func,
  myVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(MyVoucherList);
