/* eslint-disable react/prop-types */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link as LinkRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import _ from 'lodash';
import * as yup from 'yup';

import { useFormik } from 'formik';

import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputBase from '@mui/material/InputBase';
import SaveIcon from '@mui/icons-material/Save';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import MapAtom from '../../../pages/Map/MapAtom';
import config from '../../../config';
import { MasterDataAction } from 'redux/actions/MasterDataAction';
import { CustomerAction } from 'redux/actions/CustomerAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';

const ModalDeliveryAddress = ({
  initialValue,
  open,
  onClose,
  onSuccess,
  onCreateError,
  isCreate,
  handleSelected,
  getDataDeliveryAddress,
}) => {
  const style = {
    chipStyle: {
      borderRadius: 1,
      backgroundColor: initialValue.color.primary,
      color: initialValue.color.textButtonColor,
      fontWeight: 700,
      fontSize: 10,
      padding: 0,
      marginBottom: 0,
      marginRight: '0.5rem',
    },
    inputBaseMargin: {
      paddingX: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: 0,
      border: '1px solid #ccc',
      borderRadius: 1,
      height: 30,
      fontSize: '1.2rem',
    },
    boxPadding: {
      marginTop: '1rem',
    },
    dialogBorderBottom: {
      borderBottom: '1px solid #e5e5e5',
    },
    saveAddress: {
      backgroundColor: initialValue.color.primary,
      color: initialValue.color.textButtonColor,
      borderRadius: 1,
      height: 40,
      fontSize: 14,
      fontWeight: 700,
      textTransform: 'none',
      marginTop: 10,
    },
    boxTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: 'background.paper',
      borderRadius: 1,
    },
    typographyTitle: {
      textAlign: 'center',
      marginLeft: 2,
      fontSize: 20,
      fontWeight: 700,
    },
    iconCloseStyle: {
      padding: 0,
    },
    dialogContentStyle: {
      paddingTop: 0,
      paddingX: 2,
      overflowY: 'revert',
      minWidth: '60%',
    },
    addressInput: {
      paddingX: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: 0,
      marginBottom: '0.5rem',
    },
    dialogStyle: {
      '& .MuiDialog-paper': {
        width: 'calc(100% - 16px)',
        maxWidth: 'calc(100% - 40px)',
        minHeight: '60%',
        marginX: 0,
      },
    },
    errorMessage: { lineHeight: '15px', marginTop: 1 },
  };
  let {
    addressDelivery, // address delivery is array of address
    indexEdit,
  } = initialValue;
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const color = useSelector((state) => state.theme.color);
  const configNameLocation = `${config?.prefix}_locationPinned`;

  const pinnedLocation = JSON.parse(localStorage.getItem(configNameLocation));

  const [isLoading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [streetName, setStreetName] = useState('');

  const handleCheckHavePostalCode = useCallback(() => {
    if (pinnedLocation?.userLocation) {
      const splitItem = pinnedLocation?.userLocation?.split(' ');
      if (!_.isNaN(parseInt(splitItem[splitItem?.length - 1]))) {
        const postalCode = splitItem?.pop();
        setPostalCode(postalCode);
        setStreetName(splitItem.join(' '));
      }
    }
    setStreetName(pinnedLocation?.userLocation);
    return pinnedLocation?.userLocation;
  }, []);

  const validationSchema = yup.object({
    addressName: yup.string().required('Please enter Address Name.'),
    postalCode: yup
      .string()
      .required('Please enter Postal code')
      .matches(/^[0-9]+$/, 'Please enter a valid postal code')
      .min(6, 'Postal code must be exactly 6 digits')
      .max(6, 'Postal code must be exactly 6 digits'),
    unitNo: yup
      .string()
      .required('Please enter Unit Number')
      .matches(/^[a-z0-9.-]*$/, 'Please enter a valid unit number'),
    streetName: yup.string().required('Please enter Street Name'),
  });

  useEffect(() => {
    handleCheckHavePostalCode();
  }, [handleCheckHavePostalCode]);

  const handleSaveAddress = async (value) => {
    let currentAddresses = initialValue.addressDelivery || [];

    let province = await dispatch(
      MasterDataAction.getAddressLocation(initialValue.countryCode)
    );

    if (province.resultCode === 200) value.city = province.data[0].name;

    const finalValues = {
      ...value,
      address: `${value.streetName || ''}, ${value.unitNo || ''}, ${
        value.postalCode || ''
      }`,
      isDisabledPostalCode: true,
      street: value.streetName,
    };

    if (isCreate) {
      currentAddresses?.push(finalValues);
    } else {
      currentAddresses[initialValue.indexEdit] = finalValues;
    }

    const payload = {
      username: state.auth.account.idToken.payload.username,
      deliveryAddress: currentAddresses,
    };

    let response = await dispatch(
      CustomerAction.updateCustomerProfile(payload)
    );

    if (response.ResultCode === 200) {
      const getDeliveryAddress = getDataDeliveryAddress();
      if (getDeliveryAddress) {
        await handleSelected(finalValues);
      } else {
        dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: currentAddresses });
      }
      Swal.fire({
        icon: 'success',
        timer: 1500,
        title: response.message,
        showConfirmButton: false,
      });
      onSuccess();
    } else {
      Swal.fire({
        icon: 'error',
        timer: 1500,
        title: response.message,
        showConfirmButton: false,
      });
      onCreateError();
    }
    localStorage.removeItem(`${config.prefix}_locationPinned`);
    localStorage.removeItem(`${config.prefix}_addressName`);
  };

  const renderErrorMessage = (item) => {
    if (item) {
      return (
        <Typography
          className='text text-warning-theme small'
          sx={style.errorMessage}
        >
          {item}
        </Typography>
      );
    } else {
      return;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      addressName: isCreate ? '' : addressDelivery[indexEdit].addressName,
      streetName: isCreate
        ? streetName
          ? streetName.substring(0, 140)
          : ''
        : addressDelivery[indexEdit].streetName,
      unitNo: isCreate ? '' : addressDelivery[indexEdit].unitNo,
      postalCode:
        isCreate && postalCode
          ? postalCode
          : !isCreate
          ? addressDelivery[indexEdit].postalCode
          : '',
      coordinate: isCreate
        ? pinnedLocation
        : addressDelivery[indexEdit].coordinate,
    },
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setLoading(true);
      Object.keys(values).forEach((key) => {
        if (values[key] === null || values[key] === '') {
          values[key] = undefined;
        }
      });

      await handleSaveAddress(values);

      setLoading(false);
      setSubmitting(false);
      resetForm();
    },
  });

  return (
    <Dialog
      open={open}
      scroll='body'
      onClose={() => {
        formik.resetForm();
        localStorage.removeItem(`${config.prefix}_locationPinned`);
        onClose();
      }}
      sx={style.dialogStyle}
      fullWidth
      maxWidth='xl'
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
        <DialogTitle sx={style.dialogBorderBottom}>
          <Box sx={style.boxTitle}>
            <div />
            <Typography
              id='tkb-dialog-title'
              className='color'
              sx={style.typographyTitle}
            >
              Delivery Address
            </Typography>
            <IconButton
              aria-label='close'
              size='large'
              onClick={() => {
                onClose();
              }}
              sx={style.iconCloseStyle}
            >
              <CloseRoundedIcon fontSize='inherit' />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit} autoComplete='off' noValidate>
          <DialogContent sx={style.dialogContentStyle}>
            <Box sx={style.boxPadding}>
              <Typography fontSize={12} fontWeight='500' color='#666'>
                Address Name <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='addressName'
                component={InputBase}
                fullWidth
                border='1px solid #ccc'
                borderRadius={1}
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={style.addressInput}
                value={formik.values.addressName || ''}
                size='small'
                onChange={formik.handleChange}
              />
              {initialValue?.optionAddressName.map((item, index) => {
                return (
                  <Chip
                    size='small'
                    sx={style.chipStyle}
                    onClick={() =>
                      formik.setFieldValue('addressName', item.value)
                    }
                    key={index}
                    label={item.label}
                  />
                );
              })}
            </Box>
            {renderErrorMessage(formik.errors.addressName)}
            <Box sx={style.boxPadding}>
              <Typography fontSize={12} fontWeight='500' color='#666'>
                Street Name <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='streetName'
                component={InputBase}
                fullWidth
                margin='dense'
                sx={style.inputBaseMargin}
                size='small'
                value={formik.values.streetName || ''}
                onChange={formik.handleChange}
              />
            </Box>
            {renderErrorMessage(formik.errors.streetName)}

            <Box sx={style.boxPadding}>
              <Typography fontSize={12} fontWeight='500' color='#666'>
                Unit Number <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='unitNo'
                component={InputBase}
                fullWidth
                margin='dense'
                sx={style.inputBaseMargin}
                input
                size='small'
                type='text'
                value={formik.values.unitNo || ''}
                onChange={formik.handleChange}
              />
            </Box>
            {renderErrorMessage(formik.errors.unitNo)}

            <Box sx={style.boxPadding}>
              <Typography fontSize={12} fontWeight='500' color='#666'>
                Postal code <span className='required'>*</span>
              </Typography>
              <Box
                name='postalCode'
                component={InputBase}
                fullWidth
                margin='dense'
                disabled={!isCreate || isLoading || postalCode}
                sx={style.inputBaseMargin}
                size='small'
                value={formik.values.postalCode || ''}
                onChange={formik.handleChange}
                type='number'
              />
              {renderErrorMessage(formik.errors.postalCode)}
            </Box>
            <div
              className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'
              style={{ marginTop: 10 }}
            >
              <label style={{ fontSize: 12 }}>
                Pin Location <span className='required'>*</span>
              </label>
              <LinkRouter to='/map'>
                {isCreate ? (
                  <MapAtom
                    name='coordinate'
                    coordinate={pinnedLocation}
                    alreadyPinned
                    color={color}
                  />
                ) : (
                  <MapAtom
                    name='coordinate'
                    coordinate={{
                      latitude: formik.values.coordinate?.latitude,
                      longitude: formik.values.coordinate?.longitude,
                    }}
                    alreadyPinned
                    color={color}
                  />
                )}
              </LinkRouter>
            </div>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              fullWidth
              sx={style.saveAddress}
              variant='contained'
              startIcon={<SaveIcon />}
              type='submit'
              loading={isLoading}
              loadingPosition='start'
            >
              Save Address
            </LoadingButton>
          </DialogActions>
        </form>
      </LoadingOverlayCustom>
    </Dialog>
  );
};

ModalDeliveryAddress.defaultProps = {
  initialValue: {},
  onSuccess: null,
  onCreateError: null,
  isCreate: true,
  getDataDeliveryAddress: null,
  handleSelected: null,
};

ModalDeliveryAddress.propTypes = {
  getDataDeliveryAddress: PropTypes.func,
  handleSelected: PropTypes.func,
  initialValue: PropTypes.object,
  isCreate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateError: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default ModalDeliveryAddress;
