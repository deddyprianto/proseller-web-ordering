import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { OutletAction } from 'redux/actions/OutletAction';
import { OrderAction } from 'redux/actions/OrderAction';
import fontStyles from './style/styles.module.css';
import { makeStyles } from '@material-ui/core/styles';

import { CONSTANT } from 'helpers';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import Image2 from 'assets/images/2.png';
import Image3 from 'assets/images/3.png';
import Image4 from 'assets/images/4.png';
import Image5 from '../../assets/images/Table.png';

const OrderingModeDialog = ({ open, onClose }) => {
  const [orderingModeActive, setOrderingModeActive] = useState();
  const [itemOrderingMode, setItemOrderingMode] = useState({});
  const colorState = useSelector((state) => state.theme.color);
  const defaultOutlet = useSelector((state) => state.order.basket.outlet);
  const selectedDeliveryProvider = useSelector(
    (state) => state.order.selectedDeliveryProvider
  );

  const orderingMode = useSelector((state) => state.order.orderingMode);
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px' },
  }));
  const classes = useStyles();

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
    iconAlign: {
      textAlign: 'right',
    },
    dialogContent: {
      '& .MuiDialogContent-root': {
        paddingBottom: 0,
      },
    },
  };

  const dispatch = useDispatch();
  const [orderingModes, setOrderingModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = (value) => {
    return value === 'TRUE';
  };

  useEffect(() => {
    const getOrderingModes = async () => {
      setIsLoading(true);
      const data = await dispatch(
        OutletAction?.fetchSingleOutlet(defaultOutlet)
      );
      if (data) {
        const orderingModesField = [
          {
            isEnabledFieldName: 'enableStorePickUp',
            name: CONSTANT.ORDERING_MODE_STORE_PICKUP,
            displayName: data.storePickUpName || null,
            img: Image3,
          },
          {
            isEnabledFieldName: 'enableDelivery',
            name: CONSTANT.ORDERING_MODE_DELIVERY,
            displayName: data.deliveryName || null,
            img: Image2,
          },
          {
            isEnabledFieldName: 'enableTakeAway',
            name: CONSTANT.ORDERING_MODE_TAKE_AWAY,
            displayName: data.takeAwayName || null,
            img: Image4,
          },
          {
            isEnabledFieldName: 'enableDineIn',
            name: CONSTANT.ORDERING_MODE_DINE_IN,
            displayName: data.dineInName || null,
            img: Image5,
          },
        ];
        //TODO: Please remove the function after update from backend
        const orderingModesFieldFiltered = orderingModesField.filter((mode) =>
          handleFilter(
            data[mode?.isEnabledFieldName]?.toString()?.toUpperCase()
          )
        );
        const orderingModesMapped = orderingModesFieldFiltered.map(
          (mode) => mode
        );

        await setOrderingModes(orderingModesMapped);
      }
      setIsLoading(false);
    };
    getOrderingModes();
  }, []);

  const handleConfirmOrderingMode = async (value) => {
    setIsLoading(true);

    await dispatch({
      type: 'SET_ORDERING_MODE',
      payload: value.name,
    });

    const responseChangeOrderingMode = await dispatch(
      OrderAction.changeOrderingMode({
        orderingMode: value.name,
        provider: selectedDeliveryProvider ? selectedDeliveryProvider : {},
      })
    );

    await dispatch(
      OrderAction.setData(value.displayName, 'SET_ORDERING_MODE_DISPlAY_NAME')
    );

    await dispatch(
      OrderAction.setData(responseChangeOrderingMode.data, CONSTANT.DATA_BASKET)
    );

    setIsLoading(false);
    onClose();
  };

  const renderButton = () => {
    return orderingModes.map((item, index) => {
      return (
        <div
          onClick={() => {
            setItemOrderingMode(item);
            setOrderingModeActive(item);
          }}
          style={
            item.name === orderingMode
              ? {
                  height: '80px',
                  borderRadius: 10,
                  padding: '10px 0px',
                  color: colorState.primary,
                  fontWeight: 500,
                  fontSize: 14,
                  border: '1px solid #4386A1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '76px',
                  margin: '0px 5px',
                  backgroundColor: `${colorState.primary}90`,
                }
              : {
                  height: '80px',
                  borderRadius: 10,
                  padding: '10px 0px',
                  color: colorState.primary,
                  fontWeight: 500,
                  fontSize: 14,
                  border: '1px solid #4386A1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '76px',
                  margin: '0px 10px',
                  backgroundColor:
                    orderingModeActive === item
                      ? `${colorState.primary}90`
                      : 'white',
                }
          }
          className={fontStyles.myFont}
          key={index}
        >
          <h1
            style={{
              color: '#4386A1',
              fontSize: '13px',
            }}
          >
            {item.name}
          </h1>
          <img src={item.img} width={25} height={25} alt='myLogo' />
        </div>
      );
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
        <DialogTitle sx={style.dialogTitle}>
          <Typography
            className={fontStyles.myFont}
            fontSize={16}
            fontWeight={700}
            textAlign='center'
          >
            Ordering Mode
          </Typography>
        </DialogTitle>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {renderButton()}
        </div>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            marginTop: '20px',
          }}
        >
          <button
            onClick={onClose}
            className={fontStyles.myFont}
            style={{
              backgroundColor: 'white',
              border: '1px solid #4386A1',
              color: '#4386A1',
              width: '50%',
              paddingTop: '10px',
              paddingBottom: '10px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleConfirmOrderingMode(itemOrderingMode)}
            className={fontStyles.myFont}
            style={{
              color: 'white',
              width: '50%',
              paddingTop: '10px',
              paddingBottom: '10px',
            }}
          >
            Confirm
          </button>
        </DialogActions>
      </LoadingOverlayCustom>
    </Dialog>
  );
};

OrderingModeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderingModeDialog;
