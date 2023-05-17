import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';

import config from '../../config';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import { MasterDataAction } from '../../redux/actions/MasterDataAction';
import ModalDeliveryAddress from './components/ModalDeliveryAddress';
import validationPostalCode from 'helpers/PostalCodeCheck';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { CONSTANT } from 'helpers';
import useMobileSize from 'hooks/useMobileSize';

const DeliveryAddress = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const profileMatch = useRouteMatch('/profile/delivery-address');

  const state = useSelector((state) => state);

  const mobileSize = useMobileSize();

  const style = {
    buttonAddAddress: {
      minWidth: 165,
      paddingX: 2,
      borderRadius: 1,
      height: 40,
      backgroundColor: state.theme.color.primary,
      color: state.theme.color.textButtonColor,
      fontSize: '1.1rem',
    },
    iconStyle: {
      fontSize: 14,
      color: state.theme.color.font,
    },
    locationNotPin: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#808080',
    },
    editButton: {
      backgroundColor: state.theme.color.primary,
      color: state.theme.color.textButtonColor,
      width: '100%',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    button: {
      backgroundColor: state.theme.color.background,
      color: state.theme.color.primary,
      width: '100%',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    iconPined: {
      fontSize: 14,
      color: state.theme.color.primary || '#c00a27',
    },
    locationPinText: { fontSize: 13, fontWeight: 'bold' },
    boxContent: {
      flexDirection: 'row',
      position: 'fixed',
      alignItems: 'center',
      zIndex: 10,
      width: 'auto',
      marginTop: mobileSize ? 0 : 1,
      boxShadow: '1px 2px 5px rgba(128, 128, 128, 0.5)',
      display: 'flex',
      height: 40,
      left: 0,
      right: 0,
    },
    mainBox: {
      mt: 10,
      mb: 10,
    },
  };

  const getDeliveryAddress = JSON.parse(
    localStorage.getItem(`${config.prefix}_getDeliveryAddress`) || false
  );

  const [addressDelivery, setAddressDelivery] = useState('');
  const [optionsProvince, setOptionsProvince] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(
    state?.masterdata?.companyInfo?.data?.countryCode || ''
  );
  const [isCreate, setIsCreate] = useState(true);
  const [indexEdit, setIndexEdit] = useState(null);
  const [optionsCity, setOptionsCity] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [onSuccess, setOnSuccess] = useState(false);

  const [modalDeliveryAddressOpen, setModalDeliveryAddressOpen] =
    useState(false);

  const handleUpdateDialogClose = () => {
    setModalDeliveryAddressOpen(false);
  };

  const optionAddressName = [
    { value: 'Home', label: 'Home' },
    { value: 'Work', label: 'Work' },
    { value: 'School', label: 'School' },
    { value: 'Office', label: 'Office' },
    { value: 'Other', label: 'Other' },
  ];

  const handleEdit = async (indexEdit, item, setCoordinate = false) => {
    item = JSON.parse(item);

    item.setAddress = false;

    item.indexEdit = indexEdit;
    localStorage.setItem(
      `${config.prefix}_backupAddress`,
      JSON.stringify(item)
    );

    if (item.coordinate !== undefined && !setCoordinate) {
      localStorage.setItem(
        `${config.prefix}_locationPinned`,
        JSON.stringify(item.coordinate)
      );
    }

    if (item.postalCode === '' || !item.postalCode) {
      item.isDisabledPostalCode = false;
    } else {
      item.isDisabledPostalCode = true;
    }

    if (setCoordinate) {
      let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
      coordinate = JSON.parse(coordinate);
      item.coordinate = coordinate;

      let formattedStreet = '';
      try {
        let route = coordinate.detailAddress.address_components.find((item) =>
          item.types.includes('route')
        ).long_name;
        let street_number = coordinate.detailAddress.address_components.find(
          (item) => item.types.includes('street_number')
        ).long_name;
        let premise = coordinate.detailAddress.address_components.find(
          (item) =>
            item.types.includes('premise') ||
            item.types.includes('neighborhood') ||
            item.types.includes('political')
        ).long_name;

        formattedStreet = `${street_number} ${route}, ${premise}`;
      } catch (e) {
        //silent error
        formattedStreet = coordinate.userLocation;
      }

      let postalCode = '';
      try {
        postalCode = coordinate.detailAddress.address_components.find(
          (item) => item.types[0] === 'postal_code'
        ).long_name;
      } catch (err) {
        console.log(err);
      }

      item.street = formattedStreet;
      item.streetName = formattedStreet;
      item.postalCode = postalCode;

      if (item.postalCode === '' || !item.postalCode) {
        item.isDisabledPostalCode = false;
      } else {
        item.isDisabledPostalCode = true;
      }
    }

    localStorage.setItem(`${config.prefix}_addressName`, item.addressName);

    let province = optionsProvince.find((items) => {
      return items.value === item.province;
    });

    if (province) {
      setLoading(true);
      let city = await dispatch(
        MasterDataAction.getAddressLocation(countryCode, province.code)
      );
      await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
      let optionsCity = [];
      city.data.forEach((element) => {
        optionsCity.push({
          value: element.name,
          label: element.name,
          code: element.code,
        });
      });

      setOptionsCity(optionsCity);
      setLoading(false);
    }

    item.streetName = item.street;

    if (item.phoneNumber) {
      item.phoneCountryCode = item.phoneNumber.substr(0, 3);
      item.phoneNumber = item.phoneNumber.substr(3);
    }

    setModalDeliveryAddressOpen(true);
    setDeliveryAddress(item);
    setIsCreate(false);
    setIndexEdit(indexEdit);
  };

  const getLocationPinned = async () => {
    let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
    let backupAddress = localStorage.getItem(`${config.prefix}_backupAddress`);

    try {
      if (coordinate !== null && coordinate !== '') {
        coordinate = JSON.parse(coordinate);
        if (
          backupAddress === '' ||
          backupAddress === null ||
          backupAddress === undefined
        ) {
          setModalDeliveryAddressOpen(true);
        } else {
          let item = localStorage.getItem(`${config.prefix}_backupAddress`);
          item = JSON.parse(item);
          setIsCreate(false);
          handleEdit(item.indexEdit, item, coordinate);
          setModalDeliveryAddressOpen(true);
        }
      }
    } catch (err) {
      //silent error
    }
  };

  const handleGetProvider = async () => {
    try {
      let province = await dispatch(
        MasterDataAction.getAddressLocation(countryCode)
      );
      let optionsProvinceArray = [];
      province?.data?.forEach((element) => {
        optionsProvinceArray.push({
          value: element.name,
          label: element.name,
          code: element.code,
        });
      });
      setOptionsProvince(optionsProvinceArray);
    } catch (error) {
      //silent error
    }
  };

  const getDataDeliveryAddress = async () => {
    setLoading(true);
    let infoCompany = await dispatch(MasterDataAction.getInfoCompany());

    let addressDelivery = await dispatch(CustomerAction.getDeliveryAddress());
    if (addressDelivery.ResultCode === 200) {
      setAddressDelivery(addressDelivery?.Data);
    }
    await handleGetProvider();
    setLoading(false);
    setCountryCode(infoCompany.countryCode);
  };

  const handleAdd = async () => {
    let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
    let addressName = localStorage.getItem(`${config.prefix}_addressName`);

    try {
      let deliveryAddress = {};
      coordinate = JSON.parse(coordinate);
      if (coordinate && coordinate.detailAddress !== '') {
        deliveryAddress.coordinate = coordinate;
        deliveryAddress.addressName = addressName;

        let formattedStreet = '';
        try {
          let route = coordinate.detailAddress.address_components.find((item) =>
            item.types.includes('route')
          ).long_name;
          let street_number = coordinate.detailAddress.address_components.find(
            (item) => item.types.includes('street_number')
          ).long_name;
          let premise = coordinate.detailAddress.address_components.find(
            (item) =>
              item.types.includes('premise') ||
              item.types.includes('neighborhood') ||
              item.types.includes('political')
          ).long_name;

          formattedStreet = `${street_number} ${route}, ${premise}`;
        } catch (e) {
          formattedStreet = coordinate.userLocation;
        }

        let postalCode = '';
        try {
          postalCode = coordinate.detailAddress.address_components.find(
            (item) => item.types[0] === 'postal_code'
          ).long_name;
        } catch (e) {
          console.log(e);
        }

        deliveryAddress.street = formattedStreet;
        deliveryAddress.streetName = formattedStreet;
        deliveryAddress.postalCode = postalCode;

        if (postalCode === '' || !postalCode) {
          deliveryAddress.isDisabledPostalCode = false;
        } else {
          deliveryAddress.isDisabledPostalCode = true;
        }

        setDeliveryAddress(deliveryAddress);
        setIsCreate(true);
      } else {
        setDeliveryAddress({ address: {} });
        setIsCreate(true);
      }
    } catch (e) {
      setDeliveryAddress({ address: {} });
      setIsCreate(true);
      //silent error
    }

    localStorage.removeItem(`${config.prefix}_backupAddress`);

    if (!coordinate) {
      history.push('/map');
    }
  };

  const handleDelete = async (data) => {
    Swal.fire({
      title: `Remove ${data.addressName}?`,
      text: `The address ${data.addressName} will be deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.value) {
        if (
          state.deliveryAddress &&
          state.deliveryAddress.address === data.address
        ) {
          dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: null });
        }
        const addressDeliveryFiltered = addressDelivery.filter(function (a) {
          return a.address !== data.address;
        });

        let payload = {
          username: state.auth.account.idToken.payload.username,
          deliveryAddress: addressDeliveryFiltered,
        };

        let response = await dispatch(
          CustomerAction.updateCustomerProfile(payload)
        );

        if (response.ResultCode === 200) {
          await getDataDeliveryAddress();
          setLoading(false);
          Swal.fire({
            icon: 'success',
            timer: 1500,
            title: response.message,
            showConfirmButton: false,
          });
        } else {
          setLoading(false);
          Swal.fire({
            icon: 'error',
            timer: 1500,
            title: response.message,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const handleSelected = async (items) => {
    await dispatch(OrderAction.setData(items, 'SET_DELIVERY_ADDRESS'));
    history.goBack();
  };

  const handleChange = (field, value) => {
    deliveryAddress[field] = value;
    if (field !== 'address') {
      deliveryAddress.address = `${deliveryAddress.street || ''}, ${
        deliveryAddress.unitNo || ''
      }, ${deliveryAddress.postalCode || ''}`;
    } else {
      deliveryAddress.setAddress = true;
    }
    if (field === 'street') {
      deliveryAddress.setAddress = false;
      if (deliveryAddress.postalCode) {
        validationPostalCode(deliveryAddress.codePostal);
        validationPostalCode(deliveryAddress.postalCode);
      }
    }
    if (field === 'postalCode') {
      validationPostalCode(value, deliveryAddress.codePostal);
    }
    setDeliveryAddress(deliveryAddress);
  };

  useEffect(() => {
    getLocationPinned();
    getDataDeliveryAddress();
  }, [onSuccess]);

  return (
    <LoadingOverlayCustom active={loading} spinner>
      <Box className='site-main' sx={style.mainBox}>
        <ModalDeliveryAddress
          open={modalDeliveryAddressOpen}
          onClose={() => {
            handleUpdateDialogClose();
          }}
          isCreate={isCreate}
          handleChange={(field, value) => handleChange(field, value)}
          handleSelected={(update) => handleSelected(update)}
          initialValue={{
            optionAddressName,
            getDeliveryAddress,
            handleSelected,
            addressDelivery,
            deliveryAddress: state.order.deliveryAddress,
            optionsProvince,
            optionsCity,
            countryCode,
            indexEdit,
            hidden: countryCode === undefined || countryCode === 'SG',
            color: state.theme.color,
            companyInfo: state.companyInfo,
          }}
          getDataDeliveryAddress={() => getDataDeliveryAddress()}
          onSuccess={() => {
            setOnSuccess(true);
            handleUpdateDialogClose();
          }}
          onCreateError={(err) => {
            console.log(err);
            handleUpdateDialogClose();
          }}
        />

        <Box className='content-area'>
          <Box
            className='background-theme'
            component='div'
            sx={style.boxContent}
          >
            <div
              style={{ marginLeft: 10, fontSize: 16 }}
              onClick={() => history.goBack()}
            >
              <i className='fa fa-chevron-left'></i> Back
            </div>
          </Box>

          <Box className='site-main' sx={{ marginY: 2, marginX: 1 }}>
            <Grid
              container
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              spacing={2}
            >
              <Grid
                container
                direction='row'
                columnSpacing={2}
                rowSpacing={1}
                alignItems='center'
                mt={8}
                ml={0}
              >
                <Grid item xs={6}>
                  <Typography fontSize={16} fontWeight={700} className='color'>
                    Delivery Address
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign='right'>
                  <Button
                    sx={style.buttonAddAddress}
                    onClick={() => {
                      setModalDeliveryAddressOpen(true);
                    }}
                    className='btn-ordering'
                    startIcon={<Add />}
                  >
                    Add New Address
                  </Button>
                </Grid>
                {addressDelivery?.length > 0
                  ? addressDelivery?.map((items, index) => {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card
                            // TODO: dont used inline css
                            sx={{
                              maxWidth: '100%',
                              boxShadow: 'rgb(128 128 128 / 50%) 1px 2px 5px',
                              cursor: 'pointer',
                              marginTop: 2,
                              border:
                                state?.order?.deliveryAddress?.address ===
                                items?.address
                                  ? // TODO: ask gilang
                                    `2px solid ${state.theme.color.primary}`
                                  : 'none',
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant='h5'
                                fontWeight='bold'
                                color={state.theme.color.primary}
                                gutterBottom
                              >
                                {items.addressName}
                              </Typography>
                              <Typography
                                color='#666'
                                fontSize={14}
                                fontWeight={700}
                              >
                                {items.recipient}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='#666'
                                fontSize={12}
                                fontWeight={400}
                                lineHeight={2}
                              >
                                {items.street || items.streetName}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='#666'
                                fontSize={12}
                                fontWeight={400}
                                lineHeight={2}
                              >
                                {items.unitNo}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='#666'
                                fontSize={12}
                                fontWeight={400}
                                lineHeight={2}
                              >
                                {items.city}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='#666'
                                fontSize={12}
                                fontWeight={400}
                                lineHeight={2}
                              >
                                {items.postalCode}
                              </Typography>
                              {items.coordinate ? (
                                <div>
                                  <i
                                    style={style.iconPined}
                                    className='fa fa-map-pin'
                                  />{' '}
                                  <span
                                    style={style.locationPinText}
                                    className='customer-group-name'
                                  >
                                    Location Already Pinned
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <i
                                    style={style.iconStyle}
                                    className='fa fa-map-pin'
                                  />{' '}
                                  <span style={style.locationNotPin}>
                                    Location Not Pinned
                                  </span>
                                </div>
                              )}
                            </CardContent>
                            <CardActions>
                              <Grid
                                container
                                direction='row'
                                justifyContent='space-between'
                                alignItems='center'
                                spacing={2}
                              >
                                <Grid item xs={6} md={6}>
                                  <Button
                                    sx={style.editButton}
                                    onClick={() => {
                                      dispatch({
                                        type: CONSTANT.PLACEHOLDER_ADDRESS_CUSTOMER_FOR_EDIT,
                                        data: items,
                                      });
                                      setIsCreate(false);
                                      setModalDeliveryAddressOpen(true);
                                      setIndexEdit(index);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                  {!profileMatch ? (
                                    <Button
                                      sx={style.button}
                                      onClick={() => handleSelected(items)}
                                      variant='outlined'
                                    >
                                      Select
                                    </Button>
                                  ) : (
                                    <Button
                                      sx={style.button}
                                      variant='outlined'
                                      onClick={() => handleDelete(items)}
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </LoadingOverlayCustom>
  );
};

export default DeliveryAddress;
