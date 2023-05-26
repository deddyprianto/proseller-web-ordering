import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from '../style/styles.module.css';
import FormGroup from '@mui/material/FormGroup';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useSelector, useDispatch } from 'react-redux';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import RenderModifier from './RenderModifier';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import calendarIcon from 'assets/images/calendarIcon.png';

const DetailAppointment = ({
  isOpenModalDetail,
  color,
  styleSheet,
  setIsOpenModalDetail,
  itemAppointment,
  handleCurrency,
  productId,
  convertTimeToStr,
  settingAppoinment,
  selectedLocation,
}) => {
  // initial
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //some state
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addService, setAddService] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(1);
  // some selectors
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  // some functions
  const filterCart = cartAppointment?.details?.find(
    (itemCart) => itemCart.productID === productId
  );

  const handleProductModifierSelected = () => {
    if (!isEmptyArray(cartAppointment?.details)) {
      if (!isEmptyArray(filterCart?.product?.productModifiers)) {
        let defaultValue = [];
        filterCart.modifiers.forEach((item) => {
          item.modifier.details.forEach((detail) => {
            defaultValue.push({
              modifierId: item?.modifierID,
              modifierProductId: detail.productID,
              name: detail.name,
              price: detail.price,
              qty: detail.quantity,
              orderingStatus: detail?.orderingStatus,
            });
          });
        });
        setQty(filterCart?.quantity);
        // setNotes(filterCart?.remark);
        setSelectedProductModifiers(defaultValue);
        // dispatch({
        //   type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
        //   payload: defaultValue,
        // });
      }
    }
  };
  const handleDisabledAddProductButton = () => {
    if (!isEmptyArray(itemAppointment?.productModifiers) && !isLoading) {
      let qtyModifierSelected = 0;
      const productModifiers = itemAppointment.productModifiers.map(
        (productModifier) => {
          selectedProductModifiers.forEach((selectedProductModifier) => {
            if (
              productModifier.modifierID === selectedProductModifier.modifierId
            ) {
              qtyModifierSelected =
                qtyModifierSelected + selectedProductModifier.qty;
            }
          });
          const isMinZero = productModifier.modifier?.min || 0;
          const result = qtyModifierSelected >= isMinZero;
          qtyModifierSelected = 0;
          return result;
        }
      );
      const productModifierAllTrue = productModifiers.every((v) => v === true);
      return !productModifierAllTrue;
    }

    if (!isLoading) {
      return false;
    }

    return true;
  };
  const handleButtonCart = async () => {
    if (!isEmptyObject(filterCart)) {
      try {
        setIsLoading(true);
        await dispatch(
          OrderAction.updateCartAppointment(addService, filterCart.id)
        );
        setIsLoading(false);
        setIsOpenModalDetail(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setIsLoading(true);
        await dispatch(OrderAction.addCartAppointment(addService));
        setIsLoading(false);
        setIsOpenModalDetail(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handlePrice = (qty, totalPrice) => {
    setTotalPrice(qty * totalPrice);
  };

  const handleProductModifierFormated = (items) => {
    let totalPrice = 0;
    let productModifiers = [];

    if (!isEmptyArray(items)) {
      items.forEach((item) => {
        totalPrice = totalPrice + item.qty * item.price;
        productModifiers.push({
          modifierId: item.modifierId,
          modifiers: [
            {
              productId: item.modifierProductId,
              quantity: item.qty,
            },
          ],
        });
      });

      const productModifierMerged = productModifiers.reduce((obj, a) => {
        if (obj[a.modifierId]) {
          obj[a.modifierId].modifiers.push(...a.modifiers);
        } else {
          obj[a.modifierId] = { ...a };
        }
        return obj;
      }, {});

      const result = Object.values(productModifierMerged);

      totalPrice = totalPrice + (itemAppointment.retailPrice || 0);

      handlePrice(qty, totalPrice);

      return result;
    }

    totalPrice = totalPrice + (itemAppointment.retailPrice || 0);
    handlePrice(qty, totalPrice);
    return productModifiers;
  };
  // some eff
  useEffect(() => {
    handleProductModifierSelected();
  }, []);

  useEffect(() => {
    const productModifierFormated = handleProductModifierFormated(
      selectedProductModifiers
    );
    selectedLocation?.id &&
      setAddService({
        outletId: `outlet::${selectedLocation.id}`,
        item: {
          productId: `product::${itemAppointment.id}`,
          quantity: 1,
          modifierGroups: productModifierFormated,
        },
      });
  }, [selectedProductModifiers]);

  // some .scss
  const styles = {
    radioSizeModifier: {
      '& .MuiSvgIcon-root': {
        fontSize: 24,
        color: '#667080',
        borderRadius: '3px',
      },
    },
    modifierOption: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '2px',
    },
    modalModif: {
      '&.MuiTypography-root': {
        padding: 0,
        margin: 0,
        marginTop: '10px',
        marginBottom: '10px',
      },
      '&.MuiDialogContent-root': {
        padding: 0,
        margin: 0,
      },
    },
  };

  // COMPONENTS
  const HistoryTimeIcon = ({ color }) => {
    return (
      <svg
        width={18}
        height={19}
        viewBox='0 0 18 19'
        fill={color}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M9 2.75C5.27208 2.75 2.25 5.77208 2.25 9.5C2.25 13.2279 5.27208 16.25 9 16.25C12.7279 16.25 15.75 13.2279 15.75 9.5C15.75 5.77208 12.7279 2.75 9 2.75ZM0.75 9.5C0.75 4.94365 4.44365 1.25 9 1.25C13.5563 1.25 17.25 4.94365 17.25 9.5C17.25 14.0563 13.5563 17.75 9 17.75C4.44365 17.75 0.75 14.0563 0.75 9.5Z'
          fill={color}
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M9 4.25C9.41421 4.25 9.75 4.58579 9.75 5V9.03647L12.3354 10.3292C12.7059 10.5144 12.8561 10.9649 12.6708 11.3354C12.4856 11.7059 12.0351 11.8561 11.6646 11.6708L8.66459 10.1708C8.4105 10.0438 8.25 9.78408 8.25 9.5V5C8.25 4.58579 8.58579 4.25 9 4.25Z'
          fill={color}
        />
      </svg>
    );
  };
  const RenderMainDetail = () => {
    return (
      <div style={{ width: '90%', margin: '0px auto' }}>
        <div
          style={{
            marginTop: '30px',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <PhotoProvider>
            <PhotoSlider
              maskOpacity={0.5}
              images={itemAppointment?.imageFiles.map((item) => ({
                src: item,
                key: item,
              }))}
              visible={visible}
              onClose={() => setVisible(false)}
            />
          </PhotoProvider>
          <img
            src={
              itemAppointment.defaultImageURL
                ? itemAppointment.defaultImageURL
                : calendarIcon
            }
            alt='myPic'
            style={{ width: '100%', cursor: 'pointer', borderRadius: '10px' }}
            onClick={() => setVisible(true)}
          />

          {itemAppointment?.imageFiles.length > 0 && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                position: 'absolute',
                bottom: 4,
                right: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 15px',
              }}
            >
              <div>1/{itemAppointment?.imageFiles.length}</div>
            </div>
          )}
        </div>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            margin: 0,
            padding: 0,
            color: 'black',
          }}
        >
          {itemAppointment.name}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '15px',
          }}
        >
          {itemAppointment.duration && (
            <HistoryTimeIcon color={'rgba(183, 183, 183, 1)'} />
          )}
          <div
            style={{
              fontSize: '14px',
              marginLeft: '5px',
              color: 'rgba(183, 183, 183, 1)',
              display: 'flex',
              fontWeight: 500,
            }}
          >
            {convertTimeToStr(itemAppointment?.duration)}
          </div>
        </div>
        <div
          style={{
            justifySelf: 'end',
            display: 'flex',
            fontSize: '14px',
          }}
        >
          <div
            style={{ color: color.primary, fontWeight: 700, fontSize: '18px' }}
          >
            {settingAppoinment && handleCurrency(itemAppointment.retailPrice)}
          </div>
          {/* <div
            style={{
              marginLeft: '5px',
              textDecorationLine: 'line-through',
              opacity: 0.5,
              fontWeight: 700,
            }}
          >
            SGD 10.00
          </div> */}
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            marginTop: '15px',
          }}
        />
        {itemAppointment.description && (
          <React.Fragment>
            <p
              style={{
                padding: 0,
                margin: 0,
                fontWeight: 'bold',
                marginTop: '15px',
                color: 'black',
              }}
            >
              About this service
            </p>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.8,
                lineHeight: '20px',
                color: 'rgba(157, 157, 157, 1)',
                marginTop: '16px',
              }}
            >
              {itemAppointment.description}
            </p>
          </React.Fragment>
        )}
      </div>
    );
  };
  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          alignItems: 'center',
          justifyItems: 'center',
          paddingTop: '10px',
        }}
      >
        <ArrowBackIosIcon
          sx={{ color: color.primary }}
          fontSize='large'
          onClick={() => {
            setIsOpenModalDetail(false);
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 'bold',
            fontSize: '20px',
            color: 'rgba(255, 85, 99, 1)',
          }}
        >
          Service Detail
        </p>
      </div>
    );
  };

  const RenderAddOnLabel = () => {
    return (
      <div style={{ width: '90%', margin: 'auto' }}>
        <p style={{ marginTop: '20px', fontWeight: 'bold', color: 'black' }}>
          Add Ons
        </p>
      </div>
    );
  };

  const RenderPrice = () => {
    if (settingAppoinment) {
      return (
        <div style={styles.modifierOption}>
          <div style={{ fontWeight: 700 }}>Price</div>
          <div
            style={{
              fontWeight: 'bold',
              color: 'rgba(255, 85, 99, 1)',
              fontSize: '18px',
            }}
          >
            {handleCurrency(totalPrice)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const RenderButtonPrice = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '5px',
        }}
      >
        <button
          disabled={handleDisabledAddProductButton()}
          onClick={handleButtonCart}
          style={{
            width: '100%',
            borderRadius: '5px',
            fontSize: '13px',
            padding: '10px',
            marginBottom: '5px',
          }}
        >
          {!isEmptyObject(filterCart)
            ? 'Update Booking Cart'
            : 'Add to Booking Cart'}
        </button>
      </div>
    );
  };
  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Please wait...'>
      <Dialog
        className={fontStyles.myfont}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
        open={isOpenModalDetail}
        onClose={() => setIsOpenModalDetail(false)}
      >
        <DialogTitle sx={styles.modalModif}>
          <RenderHeader />
        </DialogTitle>
        <DialogContent sx={styles.modalModif}>
          <RenderMainDetail />
          {itemAppointment.productModifiers.length > 0 && (
            <FormGroup>
              <RenderAddOnLabel />
              <RenderModifier
                settingAppoinment={settingAppoinment}
                setSelectedProductModifiers={setSelectedProductModifiers}
                selectedProductModifiers={selectedProductModifiers}
                productModifiers={itemAppointment.productModifiers}
                product={itemAppointment}
              />
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: '#F2F2F2',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <RenderPrice />
          <RenderButtonPrice />
        </DialogActions>
      </Dialog>
    </LoadingOverlayCustom>
  );
};

export default DetailAppointment;
