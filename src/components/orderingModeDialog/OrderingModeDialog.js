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

import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ArticleIcon from '@mui/icons-material/Article';
import { OutletAction } from 'redux/actions/OutletAction';
import { OrderAction } from 'redux/actions/OrderAction';

const OrderingModeDialog = ({ open, onClose, defaultOutlet }) => {
  const colorState = useSelector((state) => state.theme.color);
  //orderingMode in down below is selected ordering mode from local storage.
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
  };

  const dispatch = useDispatch();
  const [orderingModes, setOrderingModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const orderingModesField = [
    { isEnabledFieldName: 'enableStorePickUp', name: 'STOREPICKUP' },
    { isEnabledFieldName: 'enableStoreCheckOut', name: 'STORECHECKOUT' },
    { isEnabledFieldName: 'enableDelivery', name: 'DELIVERY' },
    { isEnabledFieldName: 'enableTakeAway', name: 'TAKEAWAY' },
    { isEnabledFieldName: 'enableDineIn', name: 'DINEIN' },
  ];

  useEffect(() => {
    const getOrderingModes = async () => {
      const data = await dispatch(
        OutletAction?.fetchSingleOutlet(defaultOutlet)
      );
      if (!!data) {
        const orderingModesFieldFiltered = orderingModesField.filter(
          (mode) => data[mode.isEnabledFieldName]
        );
        const orderingModesMapped = orderingModesFieldFiltered.map(
          (mode) => mode.name
        );

        await setOrderingModes(orderingModesMapped);
      }
    };
    getOrderingModes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderingMode]);

  const iconCheck = (item) => {
    if (item === 'STOREPICKUP') {
      return <StoreMallDirectoryIcon />;
    } else if (item === 'STORECHECKOUT') {
      return <LocalMallIcon />;
    } else if (item === 'DELIVERY') {
      return <DeliveryDiningIcon />;
    } else {
      return <ArticleIcon />;
    }
  };

  const handleConfirmOrderingMode = async (value) => {
    setIsLoading(true);
    await dispatch({
      type: 'SET_ORDERING_MODE',
      payload: value,
    });

    if (value !== '' && value !== undefined && value !== null) {
      const payload = {
        orderingMode: value,
      };
      await dispatch(OrderAction.updateCartInfo(payload));
    }

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
            startIcon={iconCheck(item)}
            loading={isLoading}
            onClick={() => handleConfirmOrderingMode(item)}
          >
            {item}
          </LoadingButton>
        </Box>
      );
    });

    return rendering;
  };

  return (
    <Dialog fullWidth maxWidth={'xs'} open={open} onClose={onClose}>
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
          I'm just browsing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OrderingModeDialog.defaultProps = {
  defaultOutlet: {},
  open: false,
  onClose: null,
};
OrderingModeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultOutlet: PropTypes.object.isRequired,
};

export default OrderingModeDialog;
