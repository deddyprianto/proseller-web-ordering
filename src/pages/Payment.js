import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import config from 'config';
import _, { concat } from 'lodash';

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
import LoadingButton from '@mui/lab/LoadingButton';

import PointAddModal from 'components/pointAddModal';

import { PaymentAction } from 'redux/actions/PaymentAction';
import { CampaignAction } from 'redux/actions/CampaignAction';
import { CustomerAction } from 'redux/actions/CustomerAction';
import { OrderAction } from 'redux/actions/OrderAction';
import { SVCAction } from 'redux/actions/SVCAction';

import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';

import MyVoucherWarningModal from 'components/myVoucherList/components/MyVoucherWarningModal';
import UseSVCPaymentDialog from './SVC/components/UseSVCPaymentDialog';

import Sound_Effect from '../assets/sound/Sound_Effect.mp3';
import ModalInfoTransferDialog from 'components/payment/ModalInfoTransferDialog';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,

    campaignPoint: state.campaign.data,
    selectedPoint: state.payment.selectedPoint,
    selectedVoucher: state.payment.selectedVoucher,
    selectedPaymentCard: state.payment.selectedPaymentCard,
    useSVC: state.payment.useSVC,
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
  const [myVouchers, setMyVouchers] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [useSVCPayment, setUseSVCPayment] = useState({});
  const [checkSVCAvailable, setCheckSVCAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

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
      textTransform: 'none',
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
    paperPaymentMethod: {
      width: '100%',
      marginBottom: 10,
      display: 'flex',
      backgroundColor: props.color.background,
    },
    paperPaymentMethodInside: {
      width: '100%',
      display: 'flex',
      backgroundColor: props.color.background,
    },
    warningText: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      fontWeight: 500,
      marginX: 2,
      marginY: 1,
      marginTop: 0,
      color: props.color.textWarningColor,
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
        price = price - selectedVoucher.paymentAmount;
      });
    }
    if (props.useSVC?.paymentAmount) {
      price = price - props.useSVC.paymentAmount;
    }

    // setOpenTransferDialog(true);

    if (price < 0) {
      return 0;
    }
    return handlePriceLength(price);
  };

  const handleCloseManualTransfer = () => {
    setOpenTransferDialog(false);
    handlePay();
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

  const getSVCData = async () => {
    const result = await props.dispatch(SVCAction.summarySVC());
    if (result.resultCode === 200 && result?.data?.balance) {
      setCheckSVCAvailable(true);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const vouchers = await props.dispatch(CustomerAction.getVoucher());

      setMyVouchers(vouchers.data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const price = handlePrice();
    setSelectedPoint(props.selectedPoint);
    setSelectedVouchers(props.selectedVoucher);
    getCampaignPoints();
    getSVCData();
    setTotalPrice(price);
    setUseSVCPayment(props.useSVC);
    props.dispatch(PaymentAction.setData(price, 'SET_TOTAL_PAYMENT_AMOUNT'));
    if (!isEmptyObject(props.selectedPaymentCard) && price === 0) {
      handleRemovePaymentCard();
    }
  }, [
    props.useSVC,
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
      setWarningMessage('This voucher cannot be mixed with other voucher');
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

  const handleRemovePaymentCard = () => {
    props.dispatch(PaymentAction.setData({}, 'SET_SELECTED_PAYMENT_CARD'));
  };

  const handleRemoveSVC = () => {
    setUseSVCPayment({});
    props.dispatch(PaymentAction.setData({}, 'USE_SVC'));
  };

  const handleRemoveVoucher = (value) => {
    const result = selectedVouchers.filter(
      (setSelectedVoucher) => setSelectedVoucher.serialNumber !== value
    );

    props.dispatch(PaymentAction.setData(result, 'SELECT_VOUCHER'));
    setSelectedVouchers(result);
  };

  const handleMixSVC = () => {
    let temp = [];
    if (!isEmptyArray(selectedVouchers)) {
      temp.push(...selectedVouchers);
    }

    if (!isEmptyObject(selectedPoint)) {
      temp.push(selectedPoint);
    }

    return temp;
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
    if (!isEmptyArray(myVouchers)) {
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
    }
  };

  const renderPoint = () => {
    const pointToRebateRatio = props?.campaignPoint?.pointsToRebateRatio;
    const isTotalPoint = props.campaignPoint.totalPoint > 0;

    if (pointToRebateRatio && pointToRebateRatio !== '0:0' && isTotalPoint) {
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

  const renderSVCAmount = () => {
    if (props.useSVC?.isSVC) {
      return `Use Store Value Card (${handleCurrency(
        props.useSVC?.paymentAmount
      )})`;
    } else {
      return 'Use Store Value Card';
    }
  };

  const renderSVC = () => {
    if (checkSVCAvailable) {
      return (
        <Paper variant='outlined' style={styles.paper}>
          <Button
            style={styles.button}
            variant='outlined'
            disabled={handleDisableButton()}
            onClick={() => {
              props.dispatch(PaymentAction.setData({}, 'USE_SVC'));
              setIsOpenSVC(true);
            }}
          >
            <div style={styles.displayFlexAndAlignCenter}>
              <CreditCardIcon style={styles.icon} />
              <Typography style={styles.typography}>
                {renderSVCAmount()}
              </Typography>
            </div>
            <ArrowForwardIosIcon style={styles.iconArrow} />
          </Button>

          {useSVCPayment?.isSVC && (
            <IconButton
              style={styles.iconButtonRemove}
              onClick={() => {
                handleRemoveSVC();
              }}
            >
              <CloseIcon style={styles.iconRemove} />
            </IconButton>
          )}
        </Paper>
      );
    }
    return;
  };

  const renderPaymentDetail = () => {
    if (!isEmptyObject(props.selectedPaymentCard)) {
      const cardIssuer =
        props.selectedPaymentCard?.details?.cardIssuer?.toUpperCase() || '';
      const maskedAccountNumber =
        props.selectedPaymentCard?.details?.maskedAccountNumber || '';

      if (props.selectedPaymentCard.paymentID === 'MANUAL_TRANSFER') {
        return 'Manual Transfer';
      }
      return `${cardIssuer} ${maskedAccountNumber} (SGD ${handlePrice()})`;
    } else {
      return 'Payment With Card';
    }
  };

  const renderFullPaymentMix = () => {
    if (
      isEmptyObject(props.selectedPaymentCard) &&
      totalPrice === 0 &&
      (!isEmptyObject(props.useSVC) ||
        !isEmptyArray(selectedVouchers) ||
        !isEmptyObject(selectedPoint))
    ) {
      const label = [];
      if (!isEmptyObject(props.useSVC)) {
        label.push('Store Value Card');
      }
      if (!isEmptyArray(selectedVouchers)) {
        label.push('Voucher');
      }
      if (!isEmptyObject(selectedPoint)) {
        label.push('Points');
      }
      return (
        <Typography sx={styles.warningText}>
          * You have selected full payment with {label.join(', ')}
        </Typography>
      );
    } else {
      return null;
    }
  };

  const renderPaymentMethod = () => {
    return (
      <Box
        flexDirection='column'
        component={Paper}
        variant='outlined'
        style={styles.paperPaymentMethod}
      >
        <Box style={styles.paperPaymentMethodInside}>
          <Button
            style={styles.button}
            variant='outlined'
            component={Link}
            textTransform='none'
            disabled={handleDisableButton()}
            to='/payment-method'
          >
            <div style={styles.displayFlexAndAlignCenter}>
              <CreditCardIcon style={styles.icon} />
              <Typography style={styles.typography}>
                {renderPaymentDetail()}
              </Typography>
            </div>
            <ArrowForwardIosIcon style={styles.iconArrow} />
          </Button>
          {!isEmptyObject(props.selectedPaymentCard) && (
            <IconButton
              style={styles.iconButtonRemove}
              onClick={() => {
                handleRemovePaymentCard();
              }}
            >
              <CloseIcon style={styles.iconRemove} />
            </IconButton>
          )}
        </Box>
        {renderFullPaymentMix()}
      </Box>
    );
  };

  const handleAudio = () => {
    audio.play();
  };

  const handlePay = async () => {
    setIsLoading(true);
    let payload = {
      cartID: props.basket.cartID,
      totalNettAmount: props.basket.totalNettAmount,
      payments: [],
      isNeedConfirmation: false,
      payAtPOS: false,
      tableNo: '-',
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

    if (!isEmptyObject(useSVCPayment)) {
      payload.payments.push(useSVCPayment);
    }

    if (!isEmptyObject(props.selectedPaymentCard)) {
      const dataPaymentMethod = {
        accountId: props.selectedPaymentCard.accountID,
        paymentAmount: totalPrice,
        paymentID: props.selectedPaymentCard.paymentID,
        paymentName: props.selectedPaymentCard.paymentName,
        paymentType: props.selectedPaymentCard.paymentID,
        description: props.selectedPaymentCard.description,
        manual_transfer_image:
          props.selectedPaymentCard?.configurations?.filter(
            (item) => item.name === 'manual_transfer_image'
          )[0].value || null,
      };

      payload.payments.push(dataPaymentMethod);
    }

    const dateTime = new Date();
    payload.clientTimezone = Math.abs(dateTime.getTimezoneOffset());

    const response = await props.dispatch(OrderAction.submitAndPay(payload));

    if (response && response.resultCode === 200) {
      localStorage.setItem(
        `${config.prefix}_paymentSuccess`,
        JSON.stringify(
          encryptor.encrypt({ totalPrice: payload.totalNettAmount })
        )
      );
      localStorage.removeItem(`${config.prefix}_isOutletChanged`);
      localStorage.removeItem(`${config.prefix}_outletChangedFromHeader`);
      localStorage.removeItem(`${config.prefix}_selectedPoint`);
      localStorage.removeItem(`${config.prefix}_selectedVoucher`);
      localStorage.removeItem(`${config.prefix}_dataSettle`);

      localStorage.setItem(
        `${config.prefix}_settleSuccess`,
        JSON.stringify(encryptor.encrypt(response.data))
      );

      await props.dispatch(OrderAction.setData({}, 'DATA_BASKET'));
      await props.dispatch(PaymentAction.clearAll());
      await props.dispatch(OrderAction.setData({}, 'REMOVE_ORDERING_MODE'));
      await props.dispatch(
        OrderAction.setData({}, 'DELETE_ORDER_ACTION_TIME_SLOT')
      );

      handleAudio();
      return history.push('/settleSuccess');
    } else {
      setWarningMessage('Payment Failed!');
      handleOpenWarningModal();
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleDisabledButtonPay = () => {
    if (!isEmptyObject(props.selectedPaymentCard) || totalPrice !== 0) {
      return false;
    } else if (
      (!isEmptyObject(selectedPoint) ||
        !isEmptyArray(selectedVouchers) ||
        !isEmptyObject(useSVCPayment)) &&
      totalPrice === 0
    ) {
      return false;
    }
    return true;
  };

  const renderButtonPay = () => {
    return (
      <LoadingButton
        loading={isLoading}
        loadingPosition='center'
        style={styles.buttonPay}
        variant='outlined'
        disabled={handleDisabledButtonPay()}
        onClick={() => {
          if (props.selectedPaymentCard?.paymentID === 'MANUAL_TRANSFER') {
            setOpenTransferDialog(true);
          } else {
            handlePay();
          }
        }}
      >
        <Typography style={styles.typographyPay}>
          Pay {handleCurrency(totalPrice)}
        </Typography>
      </LoadingButton>
    );
  };

  return (
    <>
      <ModalInfoTransferDialog
        open={openTransferDialog}
        onClose={handleCloseManualTransfer}
        data={props.selectedPaymentCard}
      />
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
        <UseSVCPaymentDialog
          open={isOpenSVC}
          onClose={handleCloseSVC}
          maxAmount={totalPrice}
          anotherPayment={handleMixSVC()}
        />
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
  selectedPaymentCard: {},
  useSVC: {},
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
  selectedPaymentCard: PropTypes.object,
  selectedPoint: PropTypes.object,
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  useSVC: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
