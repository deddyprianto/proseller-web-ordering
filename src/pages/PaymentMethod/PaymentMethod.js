import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { MasterdataAction } from 'redux/actions/MaterdataAction';
import { PaymentAction } from 'redux/actions/PaymentAction';
import config from 'config';
import Loading from 'components/loading/Loading';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const PaymentMethodPage = () => {
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

  const colorState = useSelector((state) => state.theme.color);
  const account = useSelector((state) => state.auth.account.idToken.payload);
  // const defaultOutlet = useSelector((state) => state.basket.outlet.name);

  const [width] = useWindowSize();
  const gadgetScreen = 900 > width;

  const profileRouteMatch = useRouteMatch('/profile/payment-method');

  const style = {
    root: {
      boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
      padding: 1,
      borderRadius: gadgetScreen ? 2 : 4,
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
      position: 'sticky',
      zIndex: 10,
      width: 'auto',
      marginTop: 16,
      boxShadow: '1px 2px 5px rgba(128, 128, 128, 0.5)',
      display: 'flex',
      height: 40,
      left: 0,
      right: 0,
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
  };

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
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
      MasterdataAction.getInfoCompany()
    );
    const responsePaymentCardAccount = await dispatch(
      PaymentAction.getPaymentCard()
    );

    if (responseCompanyInfo && responsePaymentCardAccount.resultCode === 200) {
      setListCardAccount(responsePaymentCardAccount.data);
      setPaymentMethodList(responseCompanyInfo);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
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
  }, [openDialogConfirm]);

  const handleCheckRegisteredCard = async (payload, openNewTab) => {
    setIsLoading(true);
    const response = await dispatch(PaymentAction.registerPaymentCard(payload));

    if (response.resultCode === 200) {
      await setPaymentURL(response.data.url);
      await setAccountId(response.data.accountID);
      if (openNewTab) {
        childWindow = window.open(response.data.url, '_blank');
        childWindow.focus();
      } else {
        setOpenDialogConfirm(true);
      }
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

    if (item.forceNewTab || item.paymentID === 'MASTERCARD_PAYMENT_GATEWAY') {
      const response = await dispatch(
        PaymentAction.registerPaymentCard(payload)
      );
      setPaymentURL(response.data.url);

      handleCheckRegisteredCard(payload, true);
    }
    handleCheckRegisteredCard(payload, false);
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

  const handleSelectedCard = async (item) => {
    await dispatch(PaymentAction.setData(item, 'SET_SELECTED_PAYMENT_CARD'));

    localStorage.removeItem(`${config.prefix}_getPaymentMethod`);

    history.goBack();
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

  const renderCardList = (paymentID) => {
    return listCardAccount
      .filter((item) => item.paymentID === paymentID)
      .map((item, index) => {
        return (
          <Box
            component={Grid}
            item
            xs={12}
            md={6}
            sx={style.root}
            key={index}
            onClick={() => {
              setCreditCardSelected(item);
              if (profileRouteMatch) {
                setOpenSetDefaultPaymentMethod(true);
              } else {
                handleSelectedCard(item);
              }
            }}
          >
            <Grid container justifyContent='space-between'>
              <Grid item xs={9}>
                <Typography variant='inherit' fontWeight={700} paddingX={1}>
                  {item?.details?.cardIssuer?.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={3} textAlign='right'>
                {item.isDefault || item.id === selectedCard?.id ? (
                  <div className='profile-dashboard' style={style.cornerBadge}>
                    {handleRenderCornerBadge(item)}
                  </div>
                ) : (
                  <CreditCardIcon style={{ fontSize: 20 }} />
                )}
              </Grid>
              <Grid item xs={12} textAlign='center'>
                <Typography variant='inherit' fontSize={18} paddingY={3}>
                  {item.details.maskedAccountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} textAlign='right'>
                <Typography variant='inherit' fontSize={14} paddingX={1}>
                  {`VALID THRU ${item.details.cardExpiryMonth} / ${item.details.cardExpiryYear}`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      });
  };

  const renderPaymentList = () => {
    return paymentMethodList?.paymentTypes?.map((item, index) => {
      if (item.paymentID === 'MANUAL_TRANSFER') {
        return (
          <Button
            sx={style.buttonManualTransfer}
            fullWidth
            startIcon={<CreditCardIcon />}
            onClick={handleSelectedCard(item)}
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
          }}
          key={index}
        >
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            marginY={2}
          >
            <Grid item xs={6}>
              <Typography
                className='customer-group-name'
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                <CreditCardIcon fontSize='large' viewBox='0 -4 24 24' />
                {item.paymentID}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign='right'>
              <LoadingButton
                loading={isLoading}
                variant='contained'
                sx={style.buttonAddCard}
                startIcon={<AddRoundedIcon />}
                onClick={() => handleAddPaymentMethod(item)}
              >
                Add Card
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container>{renderCardList(item.paymentID)}</Grid>
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
            minHeight: '70%',
            maxHeight: '70%',
            marginX: 0,
            height: '-webkit-fill-available',
          },
        }}
      >
        <iframe src={paymentURL} width='100%' height='100%' />
      </Dialog>
    );
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
              setOpenDialogIframe(true);
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
        <DialogContent
          sx={{
            '& .MuiDialogContent-root': {
              paddingBottom: 0,
            },
          }}
        >
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

  return (
    <Box>
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

      <Box className='site-main' sx={{ marginTop: 2 }}>
        <Typography
          color={colorState.primary}
          textAlign='center'
          fontWeight={700}
          fontSize={24}
        >
          Payment Method
        </Typography>

        <Box
          sx={{
            marginTop: '1em',
          }}
        >
          {isLoading ? (
            <Loading loadingType='ButtonList' />
          ) : (
            renderPaymentList()
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentMethodPage;
