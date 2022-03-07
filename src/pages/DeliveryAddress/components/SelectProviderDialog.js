import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Grid from '@mui/material/Grid';

import { OrderAction } from 'redux/actions/OrderAction';
import Loading from 'components/loading/Loading';
import { CONSTANT } from 'helpers';

const SelectProviderDialog = ({ open, onClose }) => {
  const colorState = useSelector((state) => state.theme.color);

  const style = {
    dialogTitle: {
      borderBottom: '1px solid #e5e5e5',
      marginBottom: 2,
    },
    boxContent: {
      marginTop: 1,
    },
    button: {
      width: '100%',
      borderRadius: 2,
      height: 45,
      marginBottom: '0.5rem',
      color: colorState.primary,
      boxShadow: '0 0 2px 0px #666',
      fontWeight: 600,
      fontSize: 14,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    buttonSelected: {
      width: '100%',
      borderRadius: 2,
      height: 45,
      marginBottom: '0.5rem',
      color: colorState.primary,
      fontWeight: 600,
      fontSize: 14,
      borderStyle: 'solid',
      borderWidth: 'thin',
      borderColor: 'rgb(61, 70, 79)',
    },
  };

  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order);

  const [isLoading, setIsLoading] = useState(false);
  const [dataCalculateFee, setDataCalculateFee] = useState();

  useEffect(() => {
    const getDataProviderListAndFee = async () => {
      setIsLoading(true);
      let payload = {
        outletId: orderState.basket.outlet.id,
        cartID: orderState.basket.cartID,
        deliveryAddress: orderState.deliveryAddress,
      };

      let responseCalculateFee = await dispatch(
        OrderAction.getCalculateFee(payload)
      );

      if (!_.isEmpty(responseCalculateFee)) {
        setDataCalculateFee(responseCalculateFee);
      }

      setIsLoading(false);
    };

    getDataProviderListAndFee();
  }, [open]);

  const handleSelectDeliveryProvider = async (value) => {
    setIsLoading(true);

    await dispatch({
      type: 'SET_SELECTED_DELIVERY_PROVIDERS',
      payload: value,
    });

    // const payload = {
    //   ...dataBasket,
    //   totalNettAmount: dataBasket.totalNettAmount + value.deliveryFee,
    // };

    // await dispatch(OrderAction.setData(payload, CONSTANT.DATA_BASKET));

    const response = await dispatch(
      OrderAction.changeOrderingMode({
        orderingMode: 'DELIVERY',
        provider: value,
      })
    );

    await dispatch(OrderAction.setData(response.data, CONSTANT.DATA_BASKET));

    setIsLoading(false);
    onClose();
  };

  const renderButtonProvider = () => {
    const rendering = dataCalculateFee?.dataProvider?.map((item, index) => {
      return (
        <Box sx={style.boxContent} key={index}>
          <LoadingButton
            sx={
              orderState.selectedDeliveryProvider === item
                ? style.buttonSelected
                : style.button
            }
            loadingPosition='center'
            loading={isLoading}
            onClick={() => handleSelectDeliveryProvider(item)}
          >
            <Grid
              container
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Grid item xs={9}>
                <Typography
                  className='text'
                  textOverflow='ellipsis'
                  noWrap
                  fontWeight={600}
                  fontSize={14}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    '-webkit-box-orient': 'vertical',
                  }}
                >
                  <LocalShippingIcon
                    sx={{
                      fontSize: 21,
                      marginRight: 1,
                    }}
                    viewBox='0 -5 24 24'
                  />
                  {item.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                {`(SGD ${item.deliveryFee})`}
              </Grid>
            </Grid>
          </LoadingButton>
        </Box>
      );
    });

    return rendering;
  };

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
      <DialogTitle sx={style.dialogTitle}>
        <Typography
          fontSize={20}
          fontWeight={700}
          className='color'
          textAlign='center'
        >
          Delivery Provider
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          '& .MuiDialogContent-root': {
            paddingBottom: 0,
          },
        }}
      >
        {isLoading ? (
          <Loading loadingType='ButtonList' />
        ) : (
          renderButtonProvider()
        )}
      </DialogContent>
    </Dialog>
  );
};

SelectProviderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SelectProviderDialog;
