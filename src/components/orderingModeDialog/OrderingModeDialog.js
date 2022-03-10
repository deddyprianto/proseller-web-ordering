import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ArticleIcon from '@mui/icons-material/Article';
import { OutletAction } from 'redux/actions/OutletAction';
import { OrderAction } from 'redux/actions/OrderAction';

import { CONSTANT } from 'helpers';

const OrderingModeDialog = ({ open, onClose }) => {
  const colorState = useSelector((state) => state.theme.color);
  const defaultOutlet = useSelector((state) => state.order.basket.outlet);
  const selectedDeliveryProvider = useSelector(
    (state) => state.order.selectedDeliveryProvider
  );

  const orderingMode = useSelector((state) => state.order.orderingMode);

  const style = {
    buttonJustBrowsing: {
      textTransform: 'none',
      fontSize: '1.5rem',
      fontWeight: 400,
      color: colorState.primary,
    },
    dialogTitle: {
      borderBottom: '1px solid #e5e5e5',
      marginBottom: 2,
    },
    boxContent: {
      display: 'flex',
      flexDirection: 'column',
      m: 'auto',
      paddingY: '0.5rem',
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
    gridIconCheck: {
      textAlign: 'left',
      paddingLeft: 20,
    },
    divInsideGirdIconCheck: {
      paddingLeft: 18,
    },
  };

  const dispatch = useDispatch();
  const [orderingModes, setOrderingModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const orderingModesField = [
    {
      isEnabledFieldName: 'enableStorePickUp',
      name: CONSTANT.ORDERING_MODE_STORE_PICKUP,
    },
    {
      isEnabledFieldName: 'enableDelivery',
      name: CONSTANT.ORDERING_MODE_DELIVERY,
    },
    {
      isEnabledFieldName: 'enableTakeAway',
      name: CONSTANT.ORDERING_MODE_TAKE_AWAY,
    },
    {
      isEnabledFieldName: 'enableDineIn',
      name: CONSTANT.ORDERING_MODE_DINE_IN,
    },
  ];

  const handleFilter = (value) => {
    return value === 'TRUE';
  };

  useEffect(() => {
    const getOrderingModes = async () => {
      const data = await dispatch(
        OutletAction?.fetchSingleOutlet(defaultOutlet)
      );
      if (data) {
        //TODO: Please remove the function after update from backend
        const orderingModesFieldFiltered = orderingModesField.filter((mode) =>
          handleFilter(
            data[mode?.isEnabledFieldName]?.toString()?.toUpperCase()
          )
        );
        const orderingModesMapped = orderingModesFieldFiltered.map(
          (mode) => mode.name
        );

        await setOrderingModes(orderingModesMapped);
      }
    };
    getOrderingModes();
  }, []);

  const iconCheck = (item) => {
    if (item === CONSTANT.ORDERING_MODE_STORE_PICKUP) {
      return (
        <Grid container spacing={1} marginLeft={{ xs: 0, sm: 2 }}>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <StoreMallDirectoryIcon />
          </Grid>
          <Grid item xs={8} sx={style.gridIconCheck}>
            <div style={style.divInsideGirdIconCheck}>{item}</div>
          </Grid>
        </Grid>
      );
    } else if (item === CONSTANT.ORDERING_MODE_CHECKOUT) {
      return (
        <Grid container spacing={1} marginLeft={{ xs: 0, sm: 2 }}>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <LocalMallIcon />
          </Grid>
          <Grid item xs={8} sx={style.gridIconCheck}>
            <div style={style.divInsideGirdIconCheck}>{item}</div>
          </Grid>
        </Grid>
      );
    } else if (item === CONSTANT.ORDERING_MODE_DELIVERY) {
      return (
        <Grid container spacing={1} marginLeft={{ xs: 0, sm: 2 }}>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <DeliveryDiningIcon />
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              textAlign: 'left',
            }}
          >
            <div style={style.divInsideGirdIconCheck}>{item}</div>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1} marginLeft={{ xs: 0, sm: 2 }}>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <ArticleIcon />
          </Grid>
          <Grid item xs={8} sx={style.gridIconCheck}>
            <div style={style.divInsideGirdIconCheck}>{item}</div>
          </Grid>
        </Grid>
      );
    }
  };

  const handleConfirmOrderingMode = async (value) => {
    setIsLoading(true);

    await dispatch({
      type: 'SET_ORDERING_MODE',
      payload: value,
    });

    const responseChangeOrderingMode = await dispatch(
      OrderAction.changeOrderingMode({
        orderingMode: value,
        provider: selectedDeliveryProvider ? selectedDeliveryProvider : {},
      })
    );

    await dispatch(
      OrderAction.setData(responseChangeOrderingMode.data, CONSTANT.DATA_BASKET)
    );

    setIsLoading(false);
    onClose();
  };

  const renderButton = () => {
    const rendering = orderingModes.map((item, index) => {
      return (
        <Box sx={style.boxContent} key={index}>
          <LoadingButton
            sx={orderingMode === item ? style.buttonSelected : style.button}
            loadingPosition='start'
            loading={isLoading}
            onClick={() => handleConfirmOrderingMode(item)}
          >
            {iconCheck(item)}
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
          Ordering Mode
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          '& .MuiDialogContent-root': {
            paddingBottom: 0,
          },
        }}
      >
        {renderButton()}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button sx={style.buttonJustBrowsing} onClick={onClose}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OrderingModeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderingModeDialog;
