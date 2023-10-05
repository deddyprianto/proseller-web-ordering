import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { MasterDataAction } from 'redux/actions/MasterDataAction';
import { PaymentAction } from 'redux/actions/PaymentAction';
import config from 'config';
import Loading from 'components/loading/Loading';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';

import useMobileSize from 'hooks/useMobileSize';
import iconCheck from 'assets/images/iconCheckHighQuality.png';
import cardpaymentDefault from 'assets/images/cardpaymentDefault.png';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const PaymentMethodPage = () => {
  const colorState = useSelector((state) => state.theme.color);
  const account = useSelector((state) => state.auth.account.idToken.payload);
  const amountToPay = useSelector((state) => state.payment.totalPaymentAmount);

  const mobileSize = useMobileSize();

  const profileRouteMatch = useRouteMatch('/profile/payment-method');

  const style = {
    root: {
      boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
      padding: 1,
      borderRadius: mobileSize ? 4 : 2,
      marginBottom: 2,
      color: '#FFF',
      cursor: 'pointer',
      backgroundColor: '#1d282e',
      width: '100%',
      minHeight: '20vh',
    },
    dialogTitle: {
      borderBottom: '1px solid #e5e5e5',
      marginBottom: 2,
    },
    button: {
      marginBottom: '0.3rem',
      backgroundColor: colorState.primary,
      fontWeight: 600,
      fontSize: 14,
      color: colorState.textButtonColor,
    },
    buttonCancel: {
      marginBottom: '0.5rem',
      color: colorState.primary,
      fontWeight: 600,
      fontSize: 12,
    },
    boxContent: {
      boxShadow: '1px 2px 5px rgba(128, 128, 128, 0.5)',
      backgroundColor: '#FFF',
      flexDirection: 'row',
      position: 'fixed',
      zIndex: 10,
      width: '100%',
      display: 'flex',
      height: 40,
      alignItems: 'center',
      marginTop: mobileSize ? 8 : 9,
    },
    buttonSetDefault: {
      width: '100%',
      color: colorState.textButtonColor,
      backgroundColor: colorState.primary,
      fontWeight: 700,
      fontSize: 18,
      marginY: 1,
    },
    buttonSetDelete: {
      width: '100%',
      color: colorState.primary,
      fontWeight: 700,
      fontSize: 18,
      marginY: 1,
    },
    buttonAddCard: {
      minWidth: 100,
      paddingX: 2,
      borderRadius: 1,
      height: 40,
      backgroundColor: colorState.primary,
      color: colorState.textButtonColor,
      fontWeight: 700,
      fontSize: '1.3rem',
    },
    buttonManualTransfer: {
      borderRadius: 1,
      height: 45,
      backgroundColor: colorState.primary,
      color: colorState.textButtonColor,
      fontWeight: 700,
      fontSize: '1.3rem',
      marginBottom: 2,
    },
    cornerBadge: {
      paddingRight: 10,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 5,
      marginTop: -8,
      marginRight: -8,
      fontSize: 12,
      fontWeight: 'bold',
    },
    dialogContent: {
      '& .MuiDialogContent-root': {
        paddingBottom: 0,
      },
    },
    warningText: {
      fontSize: '1.5rem',
      textAlign: 'center',
      fontWeight: 500,
      marginTop: 1,
      color: colorState.textWarningColor,
    },
  };

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [namePayment, setNamePayment] = useState('');
  const [paymentMethodList, setPaymentMethodList] = useState({});
  const [paymentURL, setPaymentURL] = useState('');
  const [creditCardSelected, setCreditCardSelected] = useState();
  const [listCardAccount, setListCardAccount] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [openDialogIframe, setOpenDialogIframe] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [openDialogRemoveCard, setOpenDialogRemoveCard] = useState(false);
  const [openSetDefaultPaymentMethod, setOpenSetDefaultPaymentMethod] =
    useState(false);

  const [openAlertMinimumPayment, setOpenAlertMinimumPayment] = useState(false);
  const [minimumPaymentAmount, setMinimumPaymentAmount] = useState(1);
  const [renderInNewTab, setRenderInNewTab] = useState(false);

  const selectedCard = encryptor.decrypt(
    JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
  );

  let childWindow = null;

  const handleCloseDialog = () => {
    setOpenDialogIframe(false);
  };

  const dispatch = useDispatch();
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const responseCompanyInfo = await dispatch(
      MasterDataAction.getInfoCompany()
    );
    const responsePaymentCardAccount = await dispatch(
      PaymentAction.getPaymentCard()
    );

    if (responseCompanyInfo && responsePaymentCardAccount.resultCode === 200) {
      setListCardAccount(responsePaymentCardAccount.data);
      setPaymentMethodList(responseCompanyInfo);
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openDialogConfirm) {
      return;
    }

    //This interval used for check the registration card
    const interval = setInterval(async () => {
      const responseCheckPaymentCard = await dispatch(
        PaymentAction.checkPaymentCard(accountId)
      );
      if (responseCheckPaymentCard?.data?.active) {
        setOpenDialogIframe(false);
        loadData();
        childWindow?.close();
        clearInterval(interval);
      } else if (responseCheckPaymentCard.ResultCode >= 400) {
        setOpenDialogIframe(false);
        childWindow?.close();
        clearInterval(interval);
      }
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialogConfirm]);

  const handleCheckRegisteredCard = async (payload) => {
    setIsLoading(true);
    const response = await dispatch(PaymentAction.registerPaymentCard(payload));

    if (response.resultCode === 200) {
      await setPaymentURL(response.data.url);
      await setAccountId(response.data.accountID);
      setOpenDialogConfirm(true);
    }
    setIsLoading(false);
  };

  const handleAddPaymentMethod = async (item) => {
    const payload = {
      companyID: account.companyId,
      name: item.paymentName,
      referenceNo: uuid(),
      paymentID: item.paymentID,
    };

    setRenderInNewTab(item.forceNewTab || false);

    handleCheckRegisteredCard(payload);
  };

  const handleSelectedDefaultCard = async () => {
    setIsLoading(true);
    if (creditCardSelected.isDefault) {
      localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`);
    }
    await dispatch(
      PaymentAction.setDefaultPaymentCard(creditCardSelected.accountID)
    );

    localStorage.setItem(
      `${config.prefix}_paymentCardAccountDefault`,
      JSON.stringify(encryptor.encrypt(creditCardSelected))
    );
    loadData();
    setOpenSetDefaultPaymentMethod(false);
    setIsLoading(false);
  };

  const handleSelectedCard = async (paymentSelected, minimumPayment) => {
    if (amountToPay < minimumPayment) {
      setMinimumPaymentAmount(minimumPayment);
      setOpenAlertMinimumPayment(true);
    } else {
      const dataPaymentSelected = {
        ...paymentSelected,
        minimumPayment,
      };
      await dispatch(
        PaymentAction.setData(dataPaymentSelected, 'SET_SELECTED_PAYMENT_CARD')
      );

      localStorage.removeItem(`${config.prefix}_getPaymentMethod`);

      history.goBack();
    }
  };

  const handleRemoveCard = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`);
      await dispatch(
        PaymentAction.removePaymentCard(creditCardSelected.accountID)
      );
      loadData();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setOpenDialogRemoveCard(false);
    }
    loadData();
    setOpenDialogRemoveCard(false);
    setIsLoading(false);
  };

  const handleRenderCornerBadge = (item) => {
    if (item?.isDefault) {
      return 'DEFAULT';
    } else if (item?.id === selectedCard?.id) {
      return 'SELECTED';
    } else {
      return 'SELECTED DEFAULT';
    }
  };

  const renderCardList = (cardList) => {
    return listCardAccount
      .filter((cardAccount) => cardAccount.paymentID === cardList.paymentID)
      .map((card, index) => {
        return (
          <Box
            component={Grid}
            item
            xs={12}
            md={6}
            sx={style.root}
            key={index}
            onClick={() => {
              setCreditCardSelected(card);
              if (profileRouteMatch) {
                setOpenSetDefaultPaymentMethod(true);
              } else {
                handleSelectedCard(card, cardList.minimumPayment);
              }
            }}
          >
            <Grid container justifyContent='space-between'>
              <Grid item xs={9}>
                <Typography variant='inherit' fontWeight={700} paddingX={1}>
                  {card?.details?.cardIssuer?.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={3} textAlign='right'>
                {card.isDefault || card.id === selectedCard?.id ? (
                  <div className='profile-dashboard' style={style.cornerBadge}>
                    {handleRenderCornerBadge(card)}
                  </div>
                ) : (
                  <CreditCardIcon style={{ fontSize: 20 }} />
                )}
              </Grid>
              <Grid item xs={12} textAlign='center'>
                <Typography variant='inherit' fontSize={18} paddingY={3}>
                  {card.details.maskedAccountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} textAlign='right'>
                <Typography variant='inherit' fontSize={14} paddingX={1}>
                  {`VALID THRU ${card.details.cardExpiryMonth} / ${card.details.cardExpiryYear}`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      });
  };

  function imageWithFallback({ imageUrl, defaultImageUrl }) {
    const handleImageError = (e) => {
      e.target.src = defaultImageUrl;
    };

    return (
      <img width={70} src={imageUrl} alt='logo' onError={handleImageError} />
    );
  }

  const renderPaymentList = () => {
    return paymentMethodList?.paymentTypes?.map((item) => {
      if (item.paymentID === 'MANUAL_TRANSFER') {
        return (
          <Button
            key={item.paymentID}
            sx={style.buttonManualTransfer}
            fullWidth
            startIcon={<CreditCardIcon />}
            onClick={() => handleSelectedCard(item, item.minimumPayment)}
          >
            {item.paymentName}
          </Button>
        );
      }
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            marginTop: '10px',
          }}
          key={item.paymentID}
        >
          <div
            onClick={() => {
              if (item.paymentID === 'FOMO_PAY') {
                const fomoPayData = paymentMethodList.paymentTypes.find(
                  (itemFind) => itemFind.paymentID === item.paymentID
                );
                dispatch({
                  type: 'SET_SELECTED_PAYMENT_CARD',
                  data: {
                    paymentID: fomoPayData?.paymentID,
                    paymentName: fomoPayData?.paymentName,
                    paymentType: 'PayNow',
                  },
                });
                history.goBack();
              } else {
                setNamePayment(item.paymentID);
                handleAddPaymentMethod(item);
              }
            }}
            style={{
              boxShadow: '0px 4.55467px 11.38667px 0px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {imageWithFallback({
                defaultImageUrl: cardpaymentDefault,
                imageUrl: item.image,
              })}
              <div
                style={{
                  fontSize: '15px',
                  color: '#343A4A',
                  fontWeight: 600,
                  marginLeft: '10px',
                }}
              >
                {item.paymentID}
              </div>
            </div>
            {namePayment === item.paymentID && (
              <img src={iconCheck} alt='check icon' />
            )}
          </div>
          <Grid container sx={{ marginTop: '20px' }}>
            {renderCardList(item)}
          </Grid>
        </Box>
      );
    });
  };

  const dialogIframe = () => {
    return (
      <Dialog
        open={openDialogIframe}
        onClose={() => handleCloseDialog()}
        fullWidth
        maxWidth='xl'
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '100%',
            maxHeight: '100%',
            minWidth: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <iframe
          src={paymentURL}
          width='100%'
          height='950px'
          onScroll={false}
          title='payment'
        />
      </Dialog>
    );
  };

  const openNewTab = (url) => {
    const win = window.open(url, '_blank');
    win.focus();

    return;
  };

  const dialogConfirmation = () => {
    return (
      <Dialog
        open={openDialogConfirm}
        onClose={() => setOpenDialogConfirm(false)}
        maxWidth='xs'
      >
        <DialogTitle sx={style.dialogTitle}>
          <Typography
            fontSize={20}
            fontWeight={700}
            className='color'
            textAlign='center'
          >
            Add a New Card
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            fontSize={16}
            fontWeight={600}
            color='#666'
            textAlign='center'
          >
            Do you want to add a new card?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => {
              setOpenDialogConfirm(false);

              if (renderInNewTab) {
                openNewTab(paymentURL);
              } else {
                setOpenDialogIframe(true);
              }
            }}
            sx={style.button}
            autoFocus
          >
            Yes
          </Button>
          <Button
            variant='outlined'
            sx={style.buttonCancel}
            onClick={() => setOpenDialogConfirm(!openDialogConfirm)}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const dialogRemoveCardConfirmation = () => {
    return (
      <Dialog
        open={openDialogRemoveCard}
        onClose={() => setOpenDialogRemoveCard(false)}
        maxWidth='xs'
      >
        <DialogTitle sx={style.dialogTitle}>
          <Typography
            fontSize={20}
            fontWeight={700}
            className='color'
            textAlign='center'
          >
            Remove New Card
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            fontSize={16}
            fontWeight={600}
            color='#666'
            textAlign='center'
          >
            Please make sure your choice, this action will delete your card.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant='contained'
            onClick={() => {
              handleRemoveCard();
            }}
            sx={style.button}
            loadingPosition='start'
            loading={isLoading}
            autoFocus
          >
            Delete
          </LoadingButton>
          <Button
            disabled={isLoading}
            autoFocus
            variant='outlined'
            sx={style.buttonCancel}
            onClick={() => setOpenDialogRemoveCard(false)}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const dialogSelectDefaultPaymentMethod = () => {
    return (
      <Dialog
        fullWidth
        maxWidth='xs'
        open={openSetDefaultPaymentMethod}
        onClose={() => setOpenSetDefaultPaymentMethod(false)}
      >
        <DialogTitle sx={style.dialogTitle}>
          <Typography
            fontSize={20}
            fontWeight={700}
            className='color'
            textAlign='center'
          >
            {creditCardSelected?.details?.cardIssuer?.toUpperCase()}
          </Typography>
        </DialogTitle>
        <DialogContent sx={style.dialogContent}>
          <LoadingButton
            sx={style.buttonSetDefault}
            loadingPosition='start'
            loading={isLoading}
            onClick={() => handleSelectedDefaultCard()}
          >
            Set as default
          </LoadingButton>
          <LoadingButton
            sx={style.buttonSetDelete}
            loadingPosition='start'
            loading={isLoading}
            variant='outlined'
            onClick={() => {
              setOpenDialogRemoveCard(true);
              setOpenSetDefaultPaymentMethod(false);
            }}
          >
            Delete
          </LoadingButton>
        </DialogContent>
      </Dialog>
    );
  };

  const dialogAlertMinimumPayment = () => {
    return (
      <Dialog
        fullWidth
        maxWidth='xs'
        open={openAlertMinimumPayment}
        onClose={() => setOpenAlertMinimumPayment(false)}
      >
        <DialogTitle sx={style.dialogTitle}>
          <Typography
            fontSize={20}
            fontWeight={700}
            className='color'
            textAlign='center'
          >
            Warning
          </Typography>
        </DialogTitle>
        <DialogContent sx={style.dialogContent}>
          <Typography sx={style.warningText}>
            You&apos;re not reach the minimum payment. The minimum payment is{' '}
            {new Intl.NumberFormat('en-SG', {
              style: 'currency',
              currency: 'SGD',
            }).format(minimumPaymentAmount)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            autoFocus
            variant='outlined'
            sx={style.buttonAddCard}
            onClick={() => {
              history.goBack();
              setOpenAlertMinimumPayment(false);
            }}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner>
      {dialogAlertMinimumPayment()}
      {dialogConfirmation()}
      {dialogIframe()}
      {dialogSelectDefaultPaymentMethod()}
      {dialogRemoveCardConfirmation()}
      <Box component='div' sx={style.boxContent}>
        <div
          style={{ marginLeft: 10, fontSize: 16 }}
          onClick={() => history.goBack()}
        >
          <i className='fa fa-chevron-left'></i> Back
        </div>
      </Box>

      <Box className='site-main' sx={{ paddingTop: 17 }}>
        <Typography color='#343A4A' fontWeight={500} fontSize={16}>
          Available payment methods
        </Typography>
        <Box>
          {isLoading ? (
            <Loading loadingType='ButtonList' />
          ) : (
            renderPaymentList()
          )}
        </Box>
      </Box>
    </LoadingOverlayCustom>
  );
};

export default PaymentMethodPage;
