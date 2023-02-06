import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import { OutletAction } from 'redux/actions/OutletAction';
import Swal from 'sweetalert2';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
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
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const deliveryLocal = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_delivery_address`))
);

const deliveryProviderLocal = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_delivery_providers`))
);

const orderActionDate = localStorage.getItem(
  `${config.prefix}_order_action_date`
);
const orderActionTime = localStorage.getItem(
  `${config.prefix}_order_action_time`
);
const orderActionTimeSlot = localStorage.getItem(
  `${config.prefix}_order_action_time_slot`
);

const mapStateToProps = (state) => {
  return {
    account: state.auth.account.idToken.payload,
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,
    settings: state.order.setting,

    campaignPoint: state.campaign.data,
    selectedPoint: state.payment.selectedPoint,
    selectedVoucher: state.payment.selectedVoucher,
    selectedPaymentCard: state.payment.selectedPaymentCard,
    useSVC: state.payment.useSVC,
    orderingMode: state.order.orderingMode,
    deliveryAddress: state.order.deliveryAddress || deliveryLocal,
    orderActionDate: state.order.orderActionDate || orderActionDate,
    orderActionTime: state.order.orderActionTime || orderActionTime,
    orderActionTimeSlot: state.order.orderActionTimeSlot || orderActionTimeSlot,
    selectedDeliveryProvider:
      state.order.selectedDeliveryProvider || deliveryProviderLocal,
    saveDetailTopupSvc: state.svc.saveDetailTopupSvc,
    payment: state.payment.paymentCard,
    defaultOutlet: state.outlet.defaultOutlet,
    itemOrderingMode: state.order.itemOrderingMode,
    dataVoucher: state.voucher.indexVoucer,
    totalPaymentAmount: state.payment.totalPaymentAmount,
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
  const [disableButtonAll, setDisableButtonAll] = useState(false);
  const [referenceNumberConfirmation, setReferenceNumberConfirmation] =
    useState('');
  const [dataPoints, setDataPoints] = useState([]);
  const [
    openConfirmationDialogActionPayment,
    setOpenConfirmationDialogActionPayment,
  ] = useState(false);

  const [urlConfirmationDialog, setUrlConfirmationDialog] = useState('');
  const [isDeletingVoucher, setIsDeletingVoucher] = useState(false);

  const [width] = useWindowSize();
  const gadgetScreen = width < 600;
  const minPayment = props?.selectedPaymentCard?.minimumPayment;

  useEffect(() => {
    const getAllPoints = async () => {
      const dataPoints = await props.dispatch(
        CampaignAction.getCampaignByPoints()
      );
      setDataPoints(dataPoints.data);
    };
    getAllPoints();
  }, []);

  const calculateVoucher = async () => {
    const payload = {
      details: props.basket?.details,
      outletId: props.basket?.outletID,
      total: props.basket?.totalNettAmount,
      customerId: props.basket?.customerId,
      payments: props.selectedVoucher.map((item) => ({
        isVoucher: item.isVoucher,
        serialNumber: item.serialNumber,
        voucherId: item.voucherId,
      })),
    };
    Swal.fire({
      title: 'Please Wait !',
      html: 'Voucher will be applied',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const dataVoucher = await props.dispatch(
      PaymentAction.calculateVoucher(payload)
    );
    const isVoucherCannotApplied = dataVoucher.data.message;

    if (isVoucherCannotApplied) {
      props.dispatch(PaymentAction.setData([], 'SELECT_VOUCHER'));
      props.dispatch({ type: 'INDEX_VOUCHER', payload: {} });
    }

    if (isVoucherCannotApplied) {
      Swal.fire({
        icon: 'info',
        title: dataVoucher.data.message,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: props.color.primary,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'successfully applied the voucher!',
        confirmButtonColor: props.color.primary,
      });
    }
  };

  useEffect(() => {
    if (!isEmptyArray(props.selectedVoucher) && !isDeletingVoucher) {
      calculateVoucher();
    }
  }, [props.selectedVoucher]);

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
      alignItems: 'center',
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

  const handleOpenWarningModal = () => {
    setIsOpenWarningModal(true);
  };

  useEffect(() => {
    if (!referenceNumberConfirmation) {
      return;
    }

    //This interval used for check the registration card
    const interval = setInterval(async () => {
      const getSalesReference = await props.dispatch(
        CustomerAction.getSalesByReference(referenceNumberConfirmation)
      );
      if (getSalesReference?.data?.status === 'COMPLETED') {
        setIsLoading(false);
        setOpenConfirmationDialogActionPayment(false);
        clearInterval(interval);
        return history.push('/settleSuccess');
      } else if (getSalesReference?.data?.status === 'FAILED') {
        setWarningMessage('Payment Failed, please try again.');
        handleOpenWarningModal();
        setIsLoading(false);
        setOpenConfirmationDialogActionPayment(false);
        clearInterval(interval);
      } else if (getSalesReference.ResultCode >= 400) {
        setWarningMessage(getSalesReference?.data?.message);
        handleOpenWarningModal();
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 5000);
  }, [referenceNumberConfirmation]);

  const handlePriceLength = (price) => {
    const result = parseFloat(price.toFixed(2));
    return result;
  };

  const handleRemovePaymentCard = () => {
    if (isEmptyObject(props.saveDetailTopupSvc)) {
      props.dispatch(PaymentAction.setData({}, 'SET_SELECTED_PAYMENT_CARD'));
    }
  };

  const handlePrice = () => {
    let price = props.basket?.totalNettAmount || 0;

    if (!isEmptyObject(props.dataVoucher)) {
      price = props.dataVoucher.total;
    }
    if (!isEmptyObject(selectedPoint)) {
      price = price - selectedPoint.paymentAmount;
    }

    if (price < 0) {
      return 0;
    }
    return handlePriceLength(price);
  };

  const handlePaymentCardPrice = () => {
    let price = props.basket?.totalNettAmount || 0;

    if (!isEmptyObject(useSVCPayment)) {
      price = price - useSVCPayment.paymentAmount;
    }

    if (!isEmptyObject(selectedPoint)) {
      price = price - selectedPoint.paymentAmount;
    }

    if (!isEmptyObject(props.dataVoucher)) {
      price = props.dataVoucher.total;
    }

    if (price === 0) {
      handleRemovePaymentCard();
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
    props.selectedVoucher,
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
    if (isEmptyArray(props.dataVoucher?.payments)) {
      return null;
    } else {
      const price = props.basket?.totalNettAmount;
      if (totalPrice !== price) {
        return price;
      }
    }
  };
  const handleDisableButton = () => {
    if (disableButtonAll) {
      return true;
    }
    if (totalPrice === 0) {
      return true;
    }
    if (useSVCPayment.paymentAmount === totalPrice) {
      return true;
    }

    return false;
  };
  const handleDisableSVCButton = () => {
    if (disableButtonAll) {
      return true;
    }
    if (useSVCPayment.paymentAmount === totalPrice) {
      return false;
    } else {
      return false;
    }
  };

  const handleSelectVoucher = () => {
    if (
      !isEmptyArray(selectedVouchers) &&
      !selectedVouchers[0]?.applyToLowestItem
    ) {
      Swal.fire({
        icon: 'error',
        title: 'This voucher cannot use multiple voucher',
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: props.color.primary,
      });
    } else if (
      !isEmptyArray(selectedVouchers) &&
      selectedVouchers[0]?.cannotBeMixed
    ) {
      Swal.fire({
        icon: 'error',
        title: 'This voucher cannot be mixed with other voucher',
        allowOutsideClick: false,
        confirmButtonText: 'Switch to another voucher',
        confirmButtonColor: props.color.primary,
        showCancelButton: true,
      });
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
  const handleRemoveSVC = () => {
    setUseSVCPayment({});
    props.dispatch(PaymentAction.setData({}, 'USE_SVC'));
  };

  const handleRemoveVoucher = async (value) => {
    setIsDeletingVoucher(true);
    const selectPayment = props.dataVoucher.payments.filter(
      (selectedVoucher) => selectedVoucher.serialNumber !== value
    );
    const selectVoucher = selectedVouchers.filter(
      (selectedVoucher) => selectedVoucher.serialNumber !== value
    );
    const payload = {
      details: props.basket?.details,
      outletId: props.basket?.outletID,
      total: props.basket?.totalNettAmount,
      customerId: props.basket?.customerId,
      payments: selectPayment,
    };
    setIsLoading(true);
    const dataVoucher = await props.dispatch(
      PaymentAction.calculateVoucher(payload)
    );
    setIsLoading(false);
    await props.dispatch(
      PaymentAction.setData(selectVoucher, 'SELECT_VOUCHER')
    );
    props.dispatch({ type: 'INDEX_VOUCHER', payload: dataVoucher.data });
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

  useEffect(() => {
    const disableAnotherPaymentForManual = () => {
      if (props.selectedPaymentCard.paymentID === 'MANUAL_TRANSFER') {
        handleRemovePoint();
        handleRemoveSVC();
        handleRemoveVoucher();
        setDisableButtonAll(true);
      } else {
        setDisableButtonAll(false);
      }
    };

    disableAnotherPaymentForManual();
  }, [props.selectedPaymentCard?.paymentID]);

  const renderLabelPrice = () => {
    if (!isEmptyObject(props.saveDetailTopupSvc)) {
      return (
        <Typography style={styles.typographyPrice}>
          {props.saveDetailTopupSvc.name}
        </Typography>
      );
    } else if (!isEmptyObject(props.dataVoucher)) {
      if (!isEmptyObject(selectedPoint)) {
        return (
          <Typography style={styles.typographyPrice}>{totalPrice}</Typography>
        );
      } else {
        return (
          <Typography style={styles.typographyPrice}>
            {props.dataVoucher?.total}
          </Typography>
        );
      }
    } else {
      return (
        <Typography style={styles.typographyPrice}>{totalPrice}</Typography>
      );
    }
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
          {renderLabelPrice()}
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
          {isEmptyObject(props.saveDetailTopupSvc)
            ? props.basket?.outlet?.name
            : props.defaultOutlet?.name}
        </Typography>
      </div>
    );
  };

  const renderSelectedVoucher = () => {
    if (!isEmptyArray(props.dataVoucher?.payments)) {
      return props.dataVoucher?.payments?.map((selectedVoucher, index) => {
        return (
          <div key={index}>
            <div style={styles.buttonVoucher} variant='outlined'>
              <Typography style={styles.typography}>
                {selectedVoucher.voucherName}
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
    if (dataPoints[0]?.points?.enablePointRedemption) {
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
    } else {
      return null;
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
            disabled={handleDisableSVCButton()}
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
      return `${cardIssuer} ${maskedAccountNumber} (SGD ${handlePaymentCardPrice()})`;
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

  const renderMinimumPaymentWarning = () => {
    let price = props.basket?.totalNettAmount || 0;

    if (!isEmptyObject(useSVCPayment)) {
      price = price - useSVCPayment.paymentAmount;
    }

    if (!isEmptyObject(selectedPoint)) {
      price = price - selectedPoint.paymentAmount;
    }

    if (!isEmptyObject(props.dataVoucher)) {
      price = props.dataVoucher.total;
    }
    if (price < minPayment) {
      return (
        <Typography sx={styles.warningText}>
          * Minimum Payment Using Card is{' '}
          {new Intl.NumberFormat('en-SG', {
            style: 'currency',
            currency: 'SGD',
          }).format(minPayment)}
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
            disabled={
              isEmptyObject(props.saveDetailTopupSvc)
                ? handleDisableButton()
                : false
            }
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
        {renderMinimumPaymentWarning()}
      </Box>
    );
  };

  const handleAudio = () => {
    audio.play();
  };

  const handleAfterPaymentSuccess = async (payload, response) => {
    localStorage.setItem(
      `${config.prefix}_paymentSuccess`,
      JSON.stringify(encryptor.encrypt({ totalPrice: payload.totalNettAmount }))
    );
    localStorage.removeItem(`${config.prefix}_isOutletChanged`);
    localStorage.removeItem(`${config.prefix}_outletChangedFromHeader`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_dataSettle`);
    localStorage.removeItem(`${config.prefix}_delivery_address`);
    localStorage.removeItem(`${config.prefix}_delivery_providers`);

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
    await props.dispatch(
      OrderAction.setData({}, 'SET_SELECTED_DELIVERY_PROVIDERS')
    );
  };

  //TODO : AUTO CONFIRM SHOULD BE HANDLE BY BACKEND
  const handlePay = async () => {
    setIsLoading(true);
    const getAllOutlets = await props.dispatch(
      OutletAction.fetchAllOutlet(true)
    );
    setIsLoading(false);
    const filterOutletUnavailable = getAllOutlets.find(
      (item) => item.name === props.defaultOutlet.name
    );

    if (filterOutletUnavailable?.orderingStatus === 'UNAVAILABLE') {
      Swal.fire({
        title: '<p>The outlet is not available</p>',
        html: `<h5 style='color:#B7B7B7; font-size:14px'>${props.defaultOutlet.name} is currently not available, please select another outlet</h5>`,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: props.color?.primary,
        width: '40em',
        customClass: {
          confirmButton: fontStyleCustom.buttonSweetAlert,
          title: fontStyleCustom.fontTitleSweetAlert,
        },
      }).then(() => {
        history.push('/outlets');
      });
    } else if (
      !filterOutletUnavailable?.[props.itemOrderingMode?.isEnabledFieldName]
    ) {
      Swal.fire({
        title: '<p>Ordering mode is not available</p>',
        html: `<h5 style='color:#B7B7B7; font-size:14px'>${props.itemOrderingMode.name} is currently not available, please select another ordering mode</h5>`,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: props.color?.primary,
        width: '40em',
        customClass: {
          confirmButton: fontStyleCustom.buttonSweetAlert,
          title: fontStyleCustom.fontTitleSweetAlert,
        },
      }).then(() => {
        history.push({
          pathname: '/cart',
          state: {
            data: true,
          },
        });
      });
    } else {
      let isNeedConfirmation = false;
      const enableAutoConfirmation = props.settings.find((item) => {
        return item.settingKey === 'EnableAutoConfirmation';
      });

      if (enableAutoConfirmation) {
        isNeedConfirmation = enableAutoConfirmation?.settingValue || false;
      }
      setIsLoading(true);
      let payload = {
        cartID: props.basket.cartID,
        totalNettAmount: props.basket.totalNettAmount,
        payments: [],
        isNeedConfirmation,
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
        payload.deliveryFee = props.selectedDeliveryProvider.deliveryFee;
      }

      if (!isEmptyArray(props.dataVoucher?.payments)) {
        payload.payments = payload.payments.concat(props.dataVoucher?.payments);
      }

      if (!isEmptyObject(selectedPoint)) {
        payload.payments.push(selectedPoint);
      }

      if (!isEmptyObject(useSVCPayment)) {
        payload.payments.push(useSVCPayment);
      }

      if (!isEmptyObject(props.selectedPaymentCard)) {
        const totalWithSVC = totalPrice - (useSVCPayment.paymentAmount || 0);

        const dataPaymentMethod = {
          accountId: props.selectedPaymentCard.accountID,
          paymentAmount: Number(totalWithSVC),
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

      if (
        response &&
        response.resultCode === 200 &&
        response?.data?.action?.type !== 'url'
      ) {
        handleAfterPaymentSuccess(payload, response);
        handleAudio();

        return history.push('/settleSuccess');
      } else if (
        response &&
        response.resultCode === 200 &&
        response?.data?.action?.type === 'url'
      ) {
        setReferenceNumberConfirmation(response?.data?.referenceNo);
        setUrlConfirmationDialog(response.data.action.url);
        handleAfterPaymentSuccess(payload, response);
        setIsLoading(false);
        setOpenConfirmationDialogActionPayment(true);
      } else {
        setWarningMessage(response?.data?.message);
        handleOpenWarningModal();
        setIsLoading(false);
      }
    }
  };

  const handleDisabledButtonPay = () => {
    const amountSVC = useSVCPayment?.paymentAmount;
    if (
      isEmptyObject(props.selectedPaymentCard) &&
      totalPrice !== 0 &&
      isEmptyObject(useSVCPayment)
    ) {
      return true;
    }
    if (
      !isEmptyObject(selectedPoint) ||
      (!isEmptyArray(selectedVouchers) && totalPrice === 0)
    ) {
      return false;
    }
    if (amountSVC - totalPrice === 0) {
      return false;
    }
    if (totalPrice - amountSVC < minPayment) {
      return true;
    }
    if (!isEmptyObject(props.selectedPaymentCard) && totalPrice > minPayment) {
      return false;
    }
    if (totalPrice < minPayment) {
      return true;
    }
    if (isEmptyObject(props.selectedPaymentCard)) {
      return true;
    }
    return false;
  };

  const handlePaymentTopUpSVC = async () => {
    setIsLoading(true);
    const getAllOutlets = await props.dispatch(
      OutletAction.fetchAllOutlet(true)
    );
    const filterOutletUnavailable = getAllOutlets.find(
      (item) => item.name === props.defaultOutlet.name
    );
    if (filterOutletUnavailable.orderingStatus === 'UNAVAILABLE') {
      Swal.fire({
        title: '<p>The outlet is not available</p>',
        text: `${props.defaultOutlet.name} is currently not available,please select another outlet`,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: props.color?.primary,
        customClass: {
          confirmButton: fontStyleCustom.buttonSweetAlert,
          text: fontStyleCustom.textModalOutlet,
        },
      }).then(() => {
        history.push('/outlets');
      });
    } else {
      const payload = {
        payments: [
          {
            accountId: props.selectedPaymentCard?.accountID,
            paymentType: props.selectedPaymentCard?.paymentID,
            paymentRefNo: '',
            paymentID: props.selectedPaymentCard?.paymentID,
            paymentName: props.selectedPaymentCard?.paymentName,
            paymentAmount: props.saveDetailTopupSvc?.retailPrice,
          },
        ],
        outletId: props.defaultOutlet?.id,
        price: props.saveDetailTopupSvc?.retailPrice,
        customerId: `customer::${props.account?.id}`,
        dataPay: {
          storeValueCard: {
            value: props.saveDetailTopupSvc?.value,
            expiryOnUnit: props.saveDetailTopupSvc?.expiryOnUnit,
            retailPrice: props.saveDetailTopupSvc?.retailPrice,
            totalNettAmount: props.saveDetailTopupSvc?.retailPrice,
          },
          id: props.saveDetailTopupSvc?.id,
        },
      };

      const response = await props.dispatch(
        OrderAction.paymentTopUPSVC(payload)
      );
      if (
        response &&
        response.resultCode === 200 &&
        response?.data?.action?.type !== 'url'
      ) {
        handleAfterPaymentSuccess(payload, response);
        handleAudio();

        return history.push('/settleSuccess');
      } else if (
        response &&
        response.resultCode === 200 &&
        response?.data?.action?.type === 'url'
      ) {
        setReferenceNumberConfirmation(response?.data?.referenceNo);
        setUrlConfirmationDialog(response.data.action.url);
        handleAfterPaymentSuccess(payload, response);
        setIsLoading(false);
        setOpenConfirmationDialogActionPayment(true);
      } else {
        setWarningMessage(response?.data?.message);
        handleOpenWarningModal();
        setIsLoading(false);
      }
    }
  };
  const renderLabelButtonPay = () => {
    if (!isEmptyObject(props.saveDetailTopupSvc)) {
      return (
        <Typography style={styles.typographyPay}>
          Pay {handleCurrency(props.saveDetailTopupSvc.retailPrice)}
        </Typography>
      );
    } else if (!isEmptyObject(props.dataVoucher)) {
      if (!isEmptyObject(selectedPoint)) {
        return (
          <Typography style={styles.typographyPay}>
            Pay {handleCurrency(totalPrice)}
          </Typography>
        );
      } else {
        return (
          <Typography style={styles.typographyPay}>
            Pay {handleCurrency(props.dataVoucher?.total)}
          </Typography>
        );
      }
    } else {
      return (
        <Typography style={styles.typographyPay}>
          Pay {handleCurrency(totalPrice)}
        </Typography>
      );
    }
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
          } else if (!isEmptyObject(props.saveDetailTopupSvc)) {
            handlePaymentTopUpSVC();
          } else {
            handlePay();
          }
        }}
      >
        {renderLabelButtonPay()}
      </LoadingButton>
    );
  };

  const handleCloseDialog = () => {
    handleAudio();
    setOpenConfirmationDialogActionPayment(false);
  };

  const dialogConfirmActionIframe = () => {
    return (
      <Dialog
        open={openConfirmationDialogActionPayment}
        onClose={() => handleCloseDialog()}
        fullWidth
        maxWidth='xl'
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '70%',
            maxHeight: '70%',
            marginX: 0,
            height: '-webkit-fill-available',
            zIndex: 1000001,
          },
        }}
      >
        <iframe src={urlConfirmationDialog} width='100%' height='100%' />
      </Dialog>
    );
  };

  return (
    <>
      <LoadingOverlayCustom
        active={isLoading}
        spinner
        loadingText='Please Wait...'
      />
      {openConfirmationDialogActionPayment ? dialogConfirmActionIframe() : null}
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
        {isEmptyObject(props.saveDetailTopupSvc) ? (
          <React.Fragment>
            <div style={styles.dividerOutletName} />
            {renderOutletName()}
            <div style={styles.dividerOutletName} />
            {renderVoucher()}
            {renderPoint()}
            {renderSVC()}
            {renderPaymentMethod()}
            {renderButtonPay()}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {renderOutletName()}
            {renderPaymentMethod()}
            {renderButtonPay()}
          </React.Fragment>
        )}
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
  settings: [],
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
  settings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  useSVC: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
