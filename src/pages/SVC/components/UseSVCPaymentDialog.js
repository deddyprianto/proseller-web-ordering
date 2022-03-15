import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { useHistory } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ThousandSeparator from 'helpers/ThousandSeparator';
import { LoadingButton } from '@mui/lab';

import { SVCAction } from '../../../redux/actions/SVCAction';

// import { OrderAction } from 'redux/actions/OrderAction';
import { PaymentAction } from 'redux/actions/PaymentAction';
// import config from 'config';
// import Sound_Effect from '../../../assets/sound/Sound_Effect.mp3';
// import { isEmptyArray } from 'helpers/CheckEmpty';

// const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const UseSVCPaymentDialog = ({ onClose, open, maxAmount }) => {
  //TODO: Uncomment to pay full with SVC

  const color = useSelector((state) => state.theme.color);
  const dataSettle = useSelector((state) => state.order.basket);
  // const orderingMode = useSelector((state) => state.order.orderingMode);
  // const deliveryAddress = useSelector((state) => state.order.deliveryAddress);
  // const selectedDeliveryProvider = useSelector(
  //   (state) => state.order.selectedDeliveryProvider
  // );

  // const audio = new Audio(Sound_Effect);

  const dispatch = useDispatch();
  // const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const getSVCAction = async () => {
      const result = await dispatch(SVCAction.summarySVC());
      if (result.resultCode === 200) {
        setCurrentBalance(result?.data?.balance);
      }
    };
    getSVCAction();
  }, []);

  const style = {
    boxTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: 'background.paper',
      borderRadius: 1,
    },
    typographyTitle: {
      marginX: 'auto',
      fontSize: 20,
      fontWeight: 700,
    },
    typographyPrice: {
      fontSize: 30,
      fontWeight: 700,
      marginX: 'auto',
      marginBottom: 1,
    },
    typographyAmount: {
      fontSize: 18,
    },
    inputBaseMargin: {
      paddingX: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: 0,
      border: '1px solid #ccc',
      borderRadius: 1,
      height: 30,
      fontSize: '1.2rem',
      width: '100%',
    },
    useSvc: {
      backgroundColor: color.primary,
      color: color.textButtonColor,
      borderRadius: 1,
      height: 40,
      fontSize: 14,
      fontWeight: 700,
      textTransform: 'none',
      marginTop: 2,
      marginBottom: -2,
    },
  };

  // const handleAudio = () => {
  //   audio.play();
  // };

  const handleSubmitPayWithSVC = async (item) => {
    const payload = {
      isSVC: true,
      paymentAmount: Number(item.amountToUse),
      paymentName: 'Store Value Card',
      paymentType: 'Store Value Card',
    };

    await dispatch(PaymentAction.setData(payload, 'USE_SVC'));

    onClose();
  };

  const checkAmountToUse = (value) => {
    if (value >= maxAmount && maxAmount <= currentBalance) {
      return maxAmount;
    } else if (value >= maxAmount && maxAmount >= currentBalance) {
      return currentBalance;
    } else {
      return value;
    }
  };

  const validationSchema = yup.object({
    amountToUse: yup
      .number()
      .required('Please Enter Amount to Use')
      .max(
        maxAmount ? maxAmount : dataSettle?.totalNettAmount,
        'Please enter a valid amount'
      ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      amountToUse: 0,
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setIsLoading(true);
      Object.keys(values).forEach((key) => {
        if (values[key] === null || values[key] === '') {
          values[key] = undefined;
        }
      });

      await handleSubmitPayWithSVC(values);

      setIsLoading(false);
      setSubmitting(false);
      resetForm();
    },
  });

  return (
    <div>
      <Dialog
        onClose={onclose}
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '-webkit-fill-available',
            minWidth: '90%',
            marginX: 1,
          },
        }}
      >
        <DialogTitle>
          <Box sx={style.boxTitle}>
            <div />
            <Typography
              id='tkb-dialog-title'
              className='color'
              sx={style.typographyTitle}
            >
              Use Store Value Card
            </Typography>
            <IconButton
              aria-label='close'
              size='large'
              onClick={() => onClose()}
              sx={style.iconCloseStyle}
            >
              <CloseRoundedIcon fontSize='inherit' />
            </IconButton>
          </Box>
        </DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            p: 1,
            bgcolor: color.primary,
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Typography
            id='tkb-dialog-title'
            color={color.textButtonColor}
            sx={style.typographyTitle}
          >
            Total Balance
          </Typography>
          <Typography
            id='tkb-dialog-title'
            color={color.textButtonColor}
            sx={style.typographyPrice}
          >
            SGD {ThousandSeparator(currentBalance)}
          </Typography>
        </Box>
        <form onSubmit={formik.handleSubmit} autoComplete='off' noValidate>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              p: 1,
              mt: -1,
              bgcolor: color.background,
              borderRadius: '8px 8px 0 0',
            }}
          >
            <Typography
              fontSize={18}
              fontWeight={700}
              id='tkb-dialog-title'
              color={color.font}
              sx={style.typographyAmount}
            >
              Amount to use
            </Typography>

            <Box
              disabled={isLoading}
              type='number'
              name='amountToUse'
              component={InputBase}
              fullWidth
              margin='dense'
              sx={style.inputBaseMargin}
              size='small'
              placeholder='0'
              value={formik.values.amountToUse}
              onChange={(e) => {
                const checkAmount = checkAmountToUse(e.target.value);
                formik.setFieldValue('amountToUse', checkAmount);
              }}
            />
            {formik.errors.amountToUse ? (
              <div
                className='text text-warning-theme small'
                style={{ lineHeight: '15px', marginTop: 5 }}
              >
                {formik.errors.amountToUse}
              </div>
            ) : null}
            <LoadingButton
              fullWidth
              sx={style.useSvc}
              variant='contained'
              type='submit'
              loading={isLoading}
              disabled={formik.values.amountToUse > currentBalance}
            >
              Use SGD {ThousandSeparator(formik.values.amountToUse)}
            </LoadingButton>
          </Box>
        </form>
      </Dialog>
    </div>
  );
};

UseSVCPaymentDialog.defaultProps = {
  maxAmount: 0,
  // anotherPayment: [],
};

UseSVCPaymentDialog.propTypes = {
  // anotherPayment: PropTypes.array,
  maxAmount: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UseSVCPaymentDialog;
