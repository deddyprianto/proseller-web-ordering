import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

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

import { OrderAction } from 'redux/actions/OrderAction';
import Swal from 'sweetalert2';
import { PaymentAction } from 'redux/actions/PaymentAction';

const UseSVCPaymentDialog = ({ onClose, open, onSuccess }) => {
  const color = useSelector((state) => state.theme.color);
  const dataSettle = useSelector((state) => state.order.basket);

  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    console.log(dataSettle, '>>>>>>>>');
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

  const handleSubmitPayWithSVC = async (item) => {
    const { cartID, totalNettAmount, orderingMode } = dataSettle;

    if (totalNettAmount === item.amountToUse) {
      const payloadFullSVC = {
        cartID,
        totalNettAmount,
        payments: [
          {
            paymentType: 'Store Value Card',
            paymentName: 'Store Value Card',
            paymentAmount: item.amountToUse,
            isSVC: true,
          },
        ],
        isNeedConfirmation: false,
        payAtPOS: false,
        orderingMode,
        tableNo: '-',
        deliveryAddress: dataSettle?.deliveryAddress,
        deliveryProvider: dataSettle?.deliveryProvider?.name,
        deliveryProviderId: dataSettle?.deliveryProvider?.id,
        deliveryFee: dataSettle?.deliveryProvider?.deliveryFee,
        clientTimezone: 480,
        orderActionDate: dataSettle?.orderActionDate,
        orderActionTime: dataSettle?.orderActionTime,
        orderActionTimeSlot: dataSettle?.orderActionTimeSlot,
      };
      try {
        const response = await dispatch(
          OrderAction.submitAndPay(payloadFullSVC)
        );
        if (response.resultCode === 200) {
          onClose();
          Swal.fire(
            'Order Submitted',
            'Your order has been submitted',
            'success'
          ).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              history.push('/history');
            }
          });
        }
      } catch (error) {
        console.log(error);
        onClose();
        Swal.fire('Please try again!', 'Failed to submit order', 'error');
      }
    } else {
      const payload = {
        isSVC: true,
        paymentAmount: item.amountToUse,
        paymentName: 'Store Value Card',
        paymentType: 'Store Value Card',
      };
      onSuccess(payload);
      await dispatch(PaymentAction.setData(payload, 'USE_SVC'));
      onClose();
    }
  };

  const validationSchema = yup.object({
    amountToUse: yup
      .number()
      .required('Please Enter Amount to Use')
      .max(dataSettle?.totalNettAmount),
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
              fontSize={20}
              fontWeight={700}
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
            fontSize={16}
            fontWeight={700}
            id='tkb-dialog-title'
            color={color.textButtonColor}
            sx={style.typographyTitle}
          >
            Total Balance
          </Typography>
          <Typography
            fontSize={30}
            fontWeight={700}
            id='tkb-dialog-title'
            color={color.textButtonColor}
            sx={{
              marginX: 'auto',
              marginBottom: 1,
            }}
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
              onChange={formik.handleChange}
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
              disabled={formik.values.amountToUse >= currentBalance}
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
  // svcAmount: 0,
  onSuccess: null,
  // onSubmitError: null,
};

UseSVCPaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  // svcAmount: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  // onSubmitError: PropTypes.func,
};

export default UseSVCPaymentDialog;
