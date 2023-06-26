import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import dateFormatter from 'helpers/dateFormatter';
import { PaymentAction } from 'redux/actions/PaymentAction';
import PicVoucherDefault from 'assets/images/voucher-icon.png';

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
    color: state.theme.color,
    basket: state.order.basket,
    selectedVoucher: state.payment.selectedVoucher,
    totalPaymentAmount: state.payment.totalPaymentAmount,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Voucher = ({ item, quantity, ...props }) => {
  const [width] = useWindowSize();
  const gadgetScreen = 900 > width;
  const styles = {
    root: {
      borderRadius: 5,
      boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
      border: '1px solid rgba(128, 128, 128, 0.5)',
      display: 'flex',
      position: 'relative',
    },
    rootBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    rootQuantity: {
      position: 'absolute',
      top: '10px',
      right: '2px',
      height: 30,
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 19,
      borderTopRightRadius: 19,
      marginTop: -10,
      marginRight: -2,
      backgroundColor: props.color.primary,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10,
    },

    iconDescription: {
      paddingTop: '7px',
      marginRight: 2,
      fontSize: 12,
      display: 'flex',
      alignItems: 'start',
      color: props.color.font,
    },
    iconExpiryDate: {
      width: 12,
      height: 12,
      marginRight: 2,
      color: props.color.font,
    },
    image: {
      maxWidth: gadgetScreen ? 120 : 160,
      borderBottomLeftRadius: 19,
      borderTopLeftRadius: 19,
      marginRight: 10,
    },
    rootDescription: {
      display: 'flex',
      alignItems: 'start',
      maxHeight: 100,
    },
    rootExpiryDate: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 5,
    },
    typographyDescription: {
      maxWidth: gadgetScreen ? 200 : 340,
      fontSize: 12,
      color: props.color.font,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      minHeight: 56,
      paddingTop: '5px',
    },
    typographyDiscount: {
      color: props.color.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    typographyExpiryDate: {
      fontSize: 12,
      color: props.color.font,
    },
    typographyName: {
      color: props.color.primary,
      fontSize: 14,
      fontWeight: 'bold',
      width: gadgetScreen ? 180 : 280,
    },
    typographyQuantity: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'white',
    },
  };

  const history = useHistory();

  const handleSelectVoucher = async () => {
    props.dispatch(
      PaymentAction.setData(
        [
          ...props.selectedVoucher,
          {
            name: item.name,
            isVoucher: true,
            voucherId: item.id,
            paymentType: 'voucher',
            serialNumber: item.serialNumber,
            cannotBeMixed: item.validity?.cannotBeMixed,
            capAmount: item?.capAmount,
            applyToLowestItem: item?.applyToLowestItem,
          },
        ],
        'SELECT_VOUCHER'
      )
    );
    history.push('/payment');
  };

  const renderImageProduct = (item) => {
    if (item?.image) {
      return item.image;
    } else if (props?.color?.productPlaceholder) {
      return props.color.productPlaceholder;
    } else {
      return PicVoucherDefault;
    }
  };

  const renderDescription = () => {
    if (item?.voucherDesc) {
      return (
        <div style={styles.rootDescription}>
          <div style={styles.iconDescription}>
            <i className='fa fa-commenting-o' />
          </div>
          <Typography style={styles.typographyDescription}>
            {item?.voucherDesc}
          </Typography>
        </div>
      );
    }
    return <div style={styles.typographyDescription} />;
  };

  const renderExpiredDate = () => {
    return (
      <div style={styles.rootExpiryDate}>
        <AccessTimeIcon style={styles.iconExpiryDate} />
        <Typography style={styles.typographyExpiryDate}>
          Expired on {dateFormatter(item?.expiryDate)}
        </Typography>
      </div>
    );
  };

  const renderDiscountValue = () => {
    if (item.voucherType === 'discAmount') {
      return (
        <Typography style={styles.typographyDiscount}>
          Discount ${item?.voucherValue}
        </Typography>
      );
    }

    return (
      <Typography style={styles.typographyDiscount}>
        Discount {item?.voucherValue}%
      </Typography>
    );
  };

  const renderName = () => {
    return <Typography style={styles.typographyName}>{item?.name}</Typography>;
  };

  const renderQuantity = () => {
    return (
      <div style={styles.rootQuantity}>
        <Typography style={styles.typographyQuantity}>{quantity}x</Typography>
      </div>
    );
  };

  return (
    <>
      <Box component='div' sx={styles.root} onClick={handleSelectVoucher}>
        <div onClick={handleSelectVoucher} style={styles.rootBody}>
          <img
            style={styles.image}
            src={renderImageProduct(item)}
            alt={item?.name || ''}
            title={item?.name}
          />
        </div>
        <div style={styles.body}>
          {renderName()}
          {renderDescription()}
          {renderExpiredDate()}
          {renderDiscountValue()}
        </div>
        {renderQuantity()}
      </Box>
    </>
  );
};

Voucher.defaultProps = {
  quantity: 0,
  color: {},
  item: {},
  dispatch: null,
  selectedVoucher: [],
  basket: {},
  totalPaymentAmount: 0,
};

Voucher.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  dispatch: PropTypes.func,
  item: PropTypes.object,
  quantity: PropTypes.number,
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  totalPaymentAmount: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
