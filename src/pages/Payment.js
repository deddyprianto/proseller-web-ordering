import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import config from 'config';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

import UseSVCPaymentDialog from './SVC/components/UseSVCPaymentDialog';

import PointAddModal from 'components/pointAddModal';
import { PaymentAction } from 'redux/actions/PaymentAction';
import { CampaignAction } from 'redux/actions/CampaignAction';
import { OrderAction } from 'redux/actions/OrderAction';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';

import MyVoucherWarningModal from 'components/myVoucherList/components/MyVoucherWarningModal';

import Sound_Effect from '../assets/sound/Sound_Effect.mp3';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,

    campaignPoint: state.campaign.data,
    selectedPoint: state.payment.selectedPoint,
    selectedVoucher: state.payment.selectedVoucher,

    orderingMode: state.order.orderingMode,
    deliveryAddress: state.order.deliveryAddress,
    orderActionDate: state.order.orderActionDate,
    orderActionTime: state.order.orderActionTime,
    orderActionTimeSlot: state.order.orderActionTimeSlot,
    selectedDeliveryProvider: state.order.selectedDeliveryProvider,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

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

const Payment = ({ ...props }) => {
  const audio = new Audio(Sound_Effect);

  const history = useHistory();
  const [isOpenPointAddModal, setIsOpenPointAddModal] = useState(false);
  const [isOpenWarningModal, setIsOpenWarningModal] = useState(false);
  const [isOpenSVC, setIsOpenSVC] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState({});
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [warningMessage, serWarningMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const [width] = useWindowSize();
  const gadgetScreen = width < 600;

  const styles = {
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 12,
      paddingLeft: gadgetScreen ? 2 : 10,
      paddingRight: gadgetScreen ? 2 : 10,
    },
    outletName: {
      width: '100%',
      borderColor: props.color.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
    },
    badge: { '& .MuiBadge-badge': { fontSize: 10, fontWeight: 'bold' } },
    button: {
      width: '100%',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
    },
    buttonVoucher: {
      width: '100%',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    buttonPay: {
      borderRadius: 5,
      width: '100%',
      height: 40,
      textTransform: 'none',
      backgroundColor: props.color.primary,
    },
    displayFlexAndAlignCenter: { display: 'flex', alignItems: 'center' },
    divider: {
      backgroundColor: 'rgb(220, 220, 220)',
      width: '100%',
      height: 1,
    },
    dividerOutletName: {
      backgroundColor: 'rgb(220, 220, 220)',
      width: '100%',
      height: 1,
      marginTop: 10,
      marginBottom: 10,
    },
    icon: {
      color: props.color.primary,
      fontSize: 16,
      marginRight: 5,
    },
    iconArrow: {
      fontSize: 13,
      color: props.color.primary,
    },
    iconButtonRemove: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    iconShopping: {
      color: props.color.primary,
      fontSize: 25,
    },
    iconRemove: {
      fontSize: 16,
      color: props.color.primary,
      fontWeight: 600,
    },
    iconRemoveVoucherSelected: {
      fontSize: 13,
      color: props.color.primary,
      fontWeight: 600,
    },
    paper: {
      width: '100%',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: props.color.background,
    },
    paperOutletName: {
      borderRadius: '50%',
      width: 40,
      height: 40,
      borderColor: props.color.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: props.color.background,
    },
    paperVoucher: {
      width: '100%',
      marginBottom: 10,
      padding: 10,
      backgroundColor: props.color.background,
    },
    typography: {
      color: props.color.primary,
      fontSize: 13,
      textTransform: 'none',
      fontWeight: 'bold',
    },
    typographyPrice: {
      color: 'black',
      fontSize: 40,
      fontWeight: 600,
      marginTop: -5,
    },
    typographyCutPrice: {
      color: 'black',
      fontSize: 16,
      textDecorationLine: 'line-through',
    },
    typographyConfirmPayment: {
      color: props.color.primary,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    typographyPay: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
  };

  const handlePriceLength = (price) => {
    const result = parseFloat(price.toFixed(2));
    return result;
  };

  const handlePrice = () => {
    let price = props.basket?.totalNettAmount || 0;
    if (!isEmptyObject(selectedPoint)) {
      price = price - selectedPoint.paymentAmount;
    }
    if (!isEmptyArray(selectedVouchers)) {
      selectedVouchers.forEach((selectedVoucher) => {
        price = price - selectedVoucher.discount;
      });
    }

    if (price < 0) {
      return 0;
    }
    return handlePriceLength(price);
  };

  const getCampaignPoints = () => {
    if (props.companyInfo?.companyId) {
      props.dispatch(
        CampaignAction.getCampaignPoints(
          { history: 'true' },
          props.companyInfo?.companyId
        )
      );
    }
  };

  useEffect(() => {
    const price = handlePrice();

    setSelectedPoint(props.selectedPoint);
    setSelectedVouchers(props.selectedVoucher);
    getCampaignPoints();
    setTotalPrice(price);

    props.dispatch(PaymentAction.setData(price, 'SET_TOTAL_PAYMENT_AMOUNT'));
  }, [
    selectedPoint,
    selectedVouchers,
    props.selectedPoint,
    totalPrice,
    props.basket,
    props.companyInfo,
  ]);

  const handleOpenPointAddModal = () => {
    setIsOpenPointAddModal(true);
  };

  const handleClosePointAddModal = () => {
    setIsOpenPointAddModal(false);
  };

  const handleOpenWarningModal = () => {
    setIsOpenWarningModal(true);
  };

  const handleCloseWarningModal = () => {
    setIsOpenWarningModal(false);
  };

  const handleCloseSVC = () => {
    setIsOpenSVC(false);
  };

  const handleCurrency = (price) => {
    if (props.companyInfo) {
      const result = price || 0;
      return result.toLocaleString(props.companyInfo.currency.locale, {
        style: 'currency',
        currency: props.companyInfo.currency.code,
      });
    }
  };

  const handleCutPrice = () => {
    const price = props.basket?.totalNettAmount;
    if (totalPrice !== price) {
      return price;
    }
  };
  const handleDisableButton = () => {
    if (totalPrice === 0) {
      return true;
    }
    return false;
  };

  const handleSelectVoucher = () => {
    if (selectedVouchers[0]?.cannotBeMixed) {
      serWarningMessage('this voucher cannot be mixed with other voucher');
      handleOpenWarningModal();
    } else {
      history.push('/my-voucher');
    }
  };
  const handlePoint = () => {
    if (selectedPoint?.redeemValue) {
      return parseFloat(selectedPoint.redeemValue);
    }
    return 'Use';
  };

  const handleRemovePoint = () => {
    setSelectedPoint({});

    props.dispatch(PaymentAction.setData({}, 'SELECT_POINT'));
  };

  const handleRemoveVoucher = (value) => {
    const result = selectedVouchers.filter(
      (setSelectedVoucher) => setSelectedVoucher.serialNumber !== value
    );

    props.dispatch(PaymentAction.setData(result, 'SELECT_VOUCHER'));
    setSelectedVouchers(result);
  };

  const renderPrice = () => {
    return (
      <Badge
        badgeContent='SGD'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={styles.badge}
      >
        <Badge
          badgeContent={
            <Typography style={styles.typographyCutPrice}>
              {handleCutPrice()}
            </Typography>
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          sx={styles.badge}
        >
          <Typography style={styles.typographyPrice}>{totalPrice}</Typography>
        </Badge>
      </Badge>
    );
  };

  const renderOutletName = () => {
    return (
      <div style={styles.outletName}>
        <Paper variant='outlined' style={styles.paperOutletName}>
          <ShoppingCartIcon style={styles.iconShopping} />
        </Paper>
        <Typography
          style={{
            color: props.color.primary,
            fontSize: 13,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          {props.basket?.outlet?.name}
        </Typography>
      </div>
    );
  };

  const renderSelectedVoucher = () => {
    if (!isEmptyArray(selectedVouchers)) {
      return selectedVouchers.map((selectedVoucher, index) => {
        return (
          <div key={index}>
            <div style={styles.buttonVoucher} variant='outlined'>
              <Typography style={styles.typography}>
                {selectedVoucher.name}
              </Typography>

              <IconButton
                onClick={() => {
                  handleRemoveVoucher(selectedVoucher.serialNumber);
                }}
              >
                <CloseIcon style={styles.iconRemoveVoucherSelected} />
              </IconButton>
            </div>
            <div style={styles.divider} />
          </div>
        );
      });
    }
  };

  const renderVoucher = () => {
    return (
      <Paper variant='outlined' style={styles.paperVoucher}>
        <Button
          style={styles.buttonVoucher}
          variant='outlined'
          disabled={handleDisableButton()}
          onClick={() => {
            handleSelectVoucher();
          }}
        >
          <div style={styles.displayFlexAndAlignCenter}>
            <CardGiftcardIcon style={styles.icon} />
            <Typography style={styles.typography}>Use Voucher</Typography>
          </div>
          <ArrowForwardIosIcon style={styles.iconArrow} />
        </Button>

        {renderSelectedVoucher()}
      </Paper>
    );
  };

  const renderPoint = () => {
    const pointToRebateRatio = props?.campaignPoint?.pointsToRebateRatio;
    if (pointToRebateRatio && pointToRebateRatio !== '0:0') {
      return (
        <Paper variant='outlined' style={styles.paper}>
          <Button
            style={styles.button}
            disabled={handleDisableButton()}
            onClick={handleOpenPointAddModal}
            variant='outlined'
          >
            <div style={styles.displayFlexAndAlignCenter}>
              <LocalOfferIcon style={styles.icon} />
              <Typography style={styles.typography}>
                {handlePoint()} Point
              </Typography>
            </div>
            <ArrowForwardIosIcon style={styles.iconArrow} />
          </Button>
          {selectedPoint.redeemValue > 0 && (
            <IconButton
              style={styles.iconButtonRemove}
              onClick={() => {
                handleRemovePoint();
              }}
            >
              <CloseIcon style={styles.iconRemove} />
            </IconButton>
          )}
        </Paper>
      );
    }
  };

  const renderSVC = () => {
    return (
      <Paper variant='outlined' style={styles.paper}>
        <Button
          style={styles.button}
          variant='outlined'
          onClick={() => setIsOpenSVC(true)}
        >
          <div style={styles.displayFlexAndAlignCenter}>
            <CreditCardIcon style={styles.icon} />
            <Typography style={styles.typography}>
              Use Store Value Card
            </Typography>
          </div>
          <ArrowForwardIosIcon style={styles.iconArrow} />
        </Button>

        {/* TODO:: change the condition */}
        {selectedPoint.redeemValue > 0 && (
          <IconButton
            style={styles.iconButtonRemove}
            onClick={() => {
              handleRemovePoint();
            }}
          >
            <CloseIcon style={styles.iconRemove} />
          </IconButton>
        )}
      </Paper>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <Paper variant='outlined' style={styles.paper}>
        <Button style={styles.button} variant='outlined'>
          <div style={styles.displayFlexAndAlignCenter}>
            <CreditCardIcon style={styles.icon} />
            <Typography style={styles.typography}>Visa 11111</Typography>
          </div>
          <ArrowForwardIosIcon style={styles.iconArrow} />
        </Button>

        {/* TODO:: change the condition */}
        {selectedPoint.redeemValue > 0 && (
          <IconButton
            style={styles.iconButtonRemove}
            onClick={() => {
              handleRemovePoint();
            }}
          >
            <CloseIcon style={styles.iconRemove} />
          </IconButton>
        )}
      </Paper>
    );
  };

  const handleAudio = () => {
    audio.play();
  };

  const handlePay = async () => {
    let payload = {
      cartID: props.basket.cartID,
      totalNettAmount: props.basket.totalNettAmount,
      payments: [],
      isNeedConfirmation: false,
      payAtPOS: false,
      orderingMode: props.orderingMode,
      orderActionDate: props.orderActionDate,
      orderActionTime: props.orderActionTime,
      orderActionTimeSlot: props.orderActionTimeSlot,
    };

    if (props.orderingMode === 'DELIVERY') {
      payload.deliveryAddress = props.deliveryAddress;
      payload.deliveryProvider = props.selectedDeliveryProvider.name;
      payload.deliveryProviderName = props.selectedDeliveryProvider.name;
      payload.deliveryService = '-';
      payload.deliveryProviderId = props.selectedDeliveryProvider.id;
      payload.deliveryFee = props.selectedDeliveryProvider.deliveryFeeFloat;
    }

    if (!isEmptyArray(selectedVouchers)) {
      payload.payments = payload.payments.concat(selectedVouchers);
    }

    if (!isEmptyObject(selectedPoint)) {
      payload.payments.push(selectedPoint);
    }

    // if (!isEmptyObject(selectedAmountSVC)) {
    //   payload.payments.push(selectedAmountSVC);
    // }

    // if (!isEmptyObject(selectedCard)) {
    //   payload.payments.push(selectedCard);
    // }

    const dateTime = new Date();
    payload.clientTimezone = Math.abs(dateTime.getTimezoneOffset());

    const response = await props.dispatch(OrderAction.submitAndPay(payload));

    if (response && response.resultCode >= 400) {
      serWarningMessage('Payment Failed!');
      handleOpenWarningModal();
    } else {
      localStorage.setItem(
        `${config.prefix}_paymentSuccess`,
        JSON.stringify(
          encryptor.encrypt({ totalPrice: payload.totalNettAmount })
        )
      );
      // localStorage.removeItem(`${config.prefix}_isOutletChanged`);
      // localStorage.removeItem(`${config.prefix}_outletChangedFromHeader`);
      // localStorage.removeItem(`${config.prefix}_selectedPoint`);
      // localStorage.removeItem(`${config.prefix}_selectedVoucher`);
      // localStorage.removeItem(`${config.prefix}_dataSettle`);
      // await props.dispatch(OrderAction.setData({}, 'DATA_BASKET'));
      // await props.dispatch(PaymentAction.clearAll());

      handleAudio();
      // if (selectedCard?.paymentID === 'MANUAL_TRANSFER') {
      //   document.getElementById('open-modal-info-transfer').click();
      // } else {
      history.push('/settleSuccess');
      // }
    }
  };

  const handleDisabledButtonPay = () => {
    // if (isEmptyObject(selectedCard)) {
    //   return true;
    // }
    return false;
  };

  const renderButtonPay = () => {
    return (
      <Button
        style={styles.buttonPay}
        variant='outlined'
        disabled={handleDisabledButtonPay()}
        onClick={() => handlePay()}
      >
        <Typography style={styles.typographyPay}>
          Pay {handleCurrency(totalPrice)}
        </Typography>
      </Button>
    );
  };

  return (
    <>
      {isOpenPointAddModal && (
        <PointAddModal
          open={isOpenPointAddModal}
          handleClose={handleClosePointAddModal}
          price={totalPrice}
        />
      )}

      {isOpenWarningModal && (
        <MyVoucherWarningModal
          open={isOpenWarningModal}
          handleClose={handleCloseWarningModal}
          message={warningMessage}
        />
      )}

      {isOpenSVC && (
        <UseSVCPaymentDialog open={isOpenSVC} onClose={handleCloseSVC} />
      )}

      <Box component='div' sx={styles.root}>
        <Typography style={styles.typographyConfirmPayment}>
          Confirm Payment
        </Typography>
        {renderPrice()}

        <div style={styles.dividerOutletName} />
        {renderOutletName()}
        <div style={styles.dividerOutletName} />
        {renderVoucher()}
        {renderPoint()}
        {renderSVC()}
        {renderPaymentMethod()}
        {renderButtonPay()}
      </Box>
    </>
  );
};

Payment.defaultProps = {
  basket: {},
  color: {},
  companyInfo: {},
  selectedPoint: {},
  selectedVoucher: [],
  campaignPoint: {},
  dispatch: null,
  deliveryAddress: {},
  orderActionDate: {},
  orderActionTime: {},
  orderActionTimeSlot: {},
  orderingMode: {},
  selectedDeliveryProvider: {},
};

Payment.propTypes = {
  basket: PropTypes.object,
  campaignPoint: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  deliveryAddress: PropTypes.object,
  dispatch: PropTypes.func,
  orderActionDate: PropTypes.object,
  orderActionTime: PropTypes.object,
  orderActionTimeSlot: PropTypes.object,
  orderingMode: PropTypes.object,
  selectedDeliveryProvider: PropTypes.object,
  selectedPoint: PropTypes.object,
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
