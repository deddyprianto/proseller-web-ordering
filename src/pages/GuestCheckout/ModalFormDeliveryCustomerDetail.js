/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { CONSTANT } from 'helpers';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import fontStyles from './style/styles.module.css';
import InputBase from '@mui/material/InputBase';
import config from '../../config';
import _, { split } from 'lodash';
import MapAtom from './MapAtomGuestCo';
import { makeStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import countryCodes from 'country-codes-list';
import iconSeru from 'assets/images/IconsSeru.png';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import iconDown from 'assets/images/IconDown.png';
import useMediaQuery from '@mui/material/useMediaQuery';

const ModalFormDeliveryCustomerDetail = ({ modalDeliveryAddress }) => {
  const addressPlaceHolderForm = useSelector(
    (state) => state.guestCheckoutCart.addressPlaceHolderForm
  );
  const deliveryAddress = useSelector(
    (state) => state.guestCheckoutCart.address
  );

  const matches = useMediaQuery('(max-width:1200px)');
  const initialCodePhone = '+65';
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const color = useSelector((state) => state.theme.color);
  const [postalCode, setPostalCode] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const [isLoading, setLoading] = useState(false);
  const [streetName, setStreetName] = useState('');
  const configNameLocation = `${config?.prefix}_locationPinned`;
  const pinnedLocation = JSON.parse(localStorage.getItem(configNameLocation));
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const useStyles = makeStyles(() => ({
    paper: { minWidth: '340px' },
  }));
  const classes = useStyles();

  const style = {
    chipStyle: {
      borderRadius: 1,
      backgroundColor: color.primary,
      color: color.textButtonColor,
      fontWeight: 700,
      fontSize: 10,
      padding: 0,
      marginBottom: 0,
      marginRight: '0.5rem',
    },
    inputBaseMargin: {
      paddingX: '1rem',
      paddingTop: '2rem',
      paddingBottom: '2rem',
      border: '1px solid #ccc',
      borderRadius: '7px',
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
      backgroundColor: color.primary,
      color: color.textButtonColor,
      borderRadius: '10px',
      height: 40,
      fontSize: 14,
      textTransform: 'none',
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
    inputField: {
      paddingX: '1rem',
      paddingTop: '2rem',
      paddingBottom: '2rem',
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

  const myCountryCodesObject = countryCodes.customList(
    'countryCode',
    '{countryNameEn}: +{countryCallingCode}'
  );

  const optionCodePhone = Object.keys(myCountryCodesObject).map(
    (key) => myCountryCodesObject[key]
  );

  optionCodePhone.sort((a, b) => {
    let item = a.substring(a.indexOf(':') + 2);
    if (item === initialCodePhone) {
      return -1;
    } else {
      return 1;
    }
  });

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

  useEffect(() => {
    handleCheckHavePostalCode();
  }, [handleCheckHavePostalCode]);

  const validationSchemaForGuestCheckout = yup.object({
    name: yup.string().required('Please enter your Name'),
    phoneNo: yup.number().required('Please enter your Phone Number'),
    email: yup.string().required('Please Enter your Email'),
    address: yup.string().required('Please enter your Street Name'),
    unitNo: yup.string().required('Please enter your Unit Number'),
    postalCode: yup
      .string()
      .required('Please enter your Postal Code')
      .matches(/^[0-9]+$/, 'Please enter a valid postal code')
      .min(6, 'Postal code must be exactly 6 digits')
      .max(6, 'Postal code must be exactly 6 digits'),
  });

  const handleSaveAddressModeGuestCheckout = async (value) => {
    const payload = {
      deliveryAddress: value,
    };
    dispatch({ type: CONSTANT.SAVE_ADDRESS_GUESTMODE, payload });
    dispatch({ type: CONSTANT.SAVE_ADDRESS_PLACEHOLDER, payload: null });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchemaForGuestCheckout,
    initialValues: {
      name: addressPlaceHolderForm
        ? addressPlaceHolderForm.name
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress?.name
        : '',
      phoneNo: addressPlaceHolderForm
        ? addressPlaceHolderForm.phoneNo
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress?.phoneNo.slice(3)
        : '',
      email: addressPlaceHolderForm
        ? addressPlaceHolderForm.email
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress?.email
        : '',
      address: streetName
        ? streetName
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress.address
        : '',
      unitNo: addressPlaceHolderForm
        ? addressPlaceHolderForm.unitNo
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress?.unitNo
        : '',
      postalCode: postalCode
        ? postalCode
        : deliveryAddress.deliveryAddress
        ? deliveryAddress.deliveryAddress.postalCode
        : '',
      coordinate: pinnedLocation,
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
      const convertPhoneNumberTostring = values.phoneNo.toString();
      let val = convertPhoneNumberTostring.split();
      val.unshift(phoneCountryCode);
      const finalValues = { ...values, phoneNo: val.join(''), addressName: '' };
      handleSaveAddressModeGuestCheckout(finalValues);
      setLoading(false);
      setSubmitting(false);
      resetForm();
      dispatch({ type: CONSTANT.MODAL_DELIVERY_ADDRESS, payload: false });
    },
  });

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

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} autoComplete='off' noValidate>
        <DialogContent sx={style.dialogContentStyle}>
          <h1
            style={{
              fontSize: '16px',
              marginTop: '2rem',
              letterSpacing: '0.2px',
            }}
          >
            Recipient Information
          </h1>
          <Box sx={style.boxPadding}>
            <Typography
              className={fontStyles.myFont}
              fontSize={12}
              fontWeight='500'
              color='#666'
            >
              Name <span className='required'>*</span>
            </Typography>
            <Box
              disabled={isLoading}
              name='name'
              component={InputBase}
              fullWidth
              border='1px solid #ccc'
              borderRadius='7px'
              height={30}
              fontSize='1.2rem'
              margin='dense'
              sx={style.inputField}
              value={formik.values.name}
              size='small'
              placeholder='Recipient Name'
              onChange={formik.handleChange}
            />
          </Box>
          {renderErrorMessage(formik.errors.name)}

          <Box sx={style.boxPadding}>
            <Typography
              className={fontStyles.myFont}
              fontSize={12}
              fontWeight='500'
              color='#666'
            >
              Phone Number <span className='required'>*</span>
            </Typography>
            <div
              style={{
                border: '1px solid rgba(141, 141, 141, 0.44)',
                borderRadius: '7px',
                display: 'flex',
                marginBottom: '1rem',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '35%',
                  border: 0,
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  direction='down'
                  className={fontStyles.dropDownMenu}
                  size='100px'
                >
                  <DropdownToggle
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 500,
                      fontSize: '16px',
                      opacity: 0.5,
                    }}
                  >
                    <div style={{ marginLeft: '-5px' }}>{phoneCountryCode}</div>
                    <img src={iconDown} />
                  </DropdownToggle>
                  <DropdownMenu
                    style={{
                      width: matches ? '75vw' : '100%',
                      borderRadius: '10px',
                      paddingLeft: '10px',
                      height: '200px',
                      overflowY: 'auto',
                      marginTop: '10px',
                    }}
                  >
                    {optionCodePhone.map((item, i) => {
                      const getPhoneCodeFromStr = item.substring(
                        item.indexOf(':') + 2
                      );
                      return (
                        <DropdownItem
                          style={{
                            cursor: 'pointer',
                            fontFamily: 'Plus Jakarta Sans',
                            color: 'black',
                            fontWeight: 500,
                            fontSize: '16px',
                            padding: '5px 0 0 0',
                            margin: 0,
                            opacity: 0.9,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          header
                          key={item}
                        >
                          <p
                            style={{
                              cursor: 'pointer',
                              color: i === 0 ? color.primary : 'black',
                            }}
                            onClick={() => {
                              setPhoneCountryCode(getPhoneCodeFromStr);
                              setDropdownOpen(false);
                            }}
                          >
                            {item}
                          </p>
                          <hr style={{ width: '95%' }} />
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Box
                disabled={isLoading}
                name='phoneNo'
                component={InputBase}
                fullWidth
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={{
                  paddingTop: '2.5rem',
                  paddingBottom: '2rem',
                }}
                value={formik.values.phoneNo}
                size='small'
                placeholder='Recipient Phone Number'
                onChange={formik.handleChange}
                type='number'
              />
            </div>
          </Box>
          {renderErrorMessage(formik.errors.phoneNo)}
          <hr style={{ marginTop: '1.5rem' }} />
          <h1
            style={{
              fontSize: '16px',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              letterSpacing: '0.2px',
            }}
          >
            Recipient Address
          </h1>

          <Box sx={style.boxPadding}>
            <Typography
              className={fontStyles.myFont}
              fontSize={12}
              fontWeight='500'
              color='#666'
            >
              Street Name <span className='required'>*</span>
            </Typography>
            <Box
              disabled={isLoading}
              name='address'
              component={InputBase}
              fullWidth
              border='1px solid #ccc'
              borderRadius='7px'
              height={30}
              fontSize='1.2rem'
              margin='dense'
              sx={style.inputField}
              value={formik.values.address}
              size='small'
              placeholder={streetName ? streetName : 'Your address'}
              onChange={formik.handleChange}
            />
          </Box>
          {renderErrorMessage(formik.errors.address)}

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
              value={formik.values.unitNo}
              onChange={formik.handleChange}
              placeholder='Your unit number'
            />
          </Box>
          {renderErrorMessage(formik.errors.unitNo)}
          <Box sx={style.boxPadding}>
            <Typography fontSize={12} fontWeight='500' color='#666'>
              Postal code <span className='required'>*</span>
            </Typography>
            <Box
              readOnly={postalCode && true}
              name='postalCode'
              component={InputBase}
              fullWidth
              margin='dense'
              disabled={isLoading || postalCode}
              sx={style.inputBaseMargin}
              size='small'
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              placeholder='Your postal code'
            />
            {renderErrorMessage(formik.errors.postalCode)}
          </Box>
          <div
            className='woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide'
            style={{
              marginTop: 10,
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Pin Location
            </label>
            <MapAtom
              valueFields={formik.values}
              name='coordinate'
              coordinate={{
                latitude: formik.values.coordinate?.latitude,
                longitude: formik.values.coordinate?.longitude,
              }}
              alreadyPinned
              color={color}
            />
          </div>
          <hr style={{ marginTop: '11rem' }} />
          <h1
            style={{
              fontSize: '16px',
              marginTop: '1rem',
              letterSpacing: '0.2px',
            }}
          >
            Receipt
          </h1>
          <Box sx={style.boxPadding}>
            <Typography
              className={fontStyles.myFont}
              fontSize={12}
              fontWeight='500'
              color='#666'
            >
              Email <span className='required'>*</span>
            </Typography>
            <Box
              disabled={isLoading}
              name='email'
              component={InputBase}
              fullWidth
              border='1px solid #ccc'
              borderRadius='7px'
              height={30}
              fontSize='1.2rem'
              margin='dense'
              sx={style.inputField}
              value={formik.values.email}
              size='small'
              type='email'
              placeholder='Your Email'
              onChange={formik.handleChange}
            />
          </Box>
          {renderErrorMessage(formik.errors.email)}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <img src={iconSeru} />
            </div>
            <div
              style={{
                color: '#8A8D8E',
                fontSize: '16px',
                fontWeight: 400,
                marginLeft: '5px',
              }}
            >
              Receipt will be sent to this email
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            fullWidth
            className={fontStyles.myFont}
            sx={style.saveAddress}
            variant='contained'
            type='submit'
            loading={isLoading}
            loadingPosition='start'
          >
            Add Address
          </LoadingButton>
        </DialogActions>
      </form>
    );
  };
  return (
    <Dialog
      classes={{ paper: classes.paper }}
      open={modalDeliveryAddress}
      onClose={() => {
        formik.resetForm();
        localStorage.removeItem(`${config.prefix}_locationPinned`);
        dispatch({ type: CONSTANT.MODAL_DELIVERY_ADDRESS, payload: false });
      }}
      fullWidth
      maxWidth='xs'
    >
      <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
        <DialogTitle sx={style.dialogBorderBottom}>
          <Box sx={style.boxTitle}>
            <div />
            <Typography
              id='tkb-dialog-title'
              className={fontStyles.myFont}
              sx={style.typographyTitle}
            >
              Customer Detail
            </Typography>
            <IconButton
              onClick={() => {
                formik.resetForm();
                localStorage.removeItem(`${config.prefix}_locationPinned`);
                dispatch({
                  type: CONSTANT.MODAL_DELIVERY_ADDRESS,
                  payload: false,
                });
              }}
              aria-label='close'
              size='large'
              sx={style.iconCloseStyle}
            >
              <CloseRoundedIcon fontSize='inherit' />
            </IconButton>
          </Box>
        </DialogTitle>
        {renderForm()}
      </LoadingOverlayCustom>
    </Dialog>
  );
};

export default ModalFormDeliveryCustomerDetail;
