import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';

import ProductAddModal from './ProductAddModal';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { OrderAction } from 'redux/actions/OrderAction';

const ProductUpdateModal = ({
  open,
  handleClose,
  product,
  width,
  productDetail,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [productInBasket, setProductInBasket] = useState([]);
  const [selectedProductBasketUpdate, setSelectedProductBasketUpdate] =
    useState({});

  const basket = useSelector((state) => state.order.basket);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const mode = useSelector((state) => state.guestCheckoutCart.mode);
  const basketGuestCo = useSelector((state) => state.guestCheckoutCart.data);
  const basketGuestCoResponse = useSelector(
    (state) => state.guestCheckoutCart.response
  );
  const editResponse = useSelector(
    (state) => state.guestCheckoutCart.saveEditResponse
  );

  const styles = {
    productRoot: {
      marginTop: 20,
    },
    productBody: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    productModifierBody: {
      display: 'flex',
      paddingLeft: 4,
    },
    productModifierQuantity: {
      fontStyle: 'italic',
      fontSize: 10,
      color: color.primary,
    },
    productModifierName: {
      fontStyle: 'italic',
      fontSize: 10,
      paddingRight: 2,
      paddingLeft: 2,
    },
    productModifierTypography: {
      fontStyle: 'italic',
      fontSize: 10,
    },
    productModifierAddOn: {
      fontStyle: 'italic',
      fontSize: 10,
      paddingTop: 4,
    },
    buttonEdit: {
      display: 'flex',
      alignItems: 'center',
    },
    iconEdit: {
      height: 10,
      width: 10,
      color: color.primary,
      marginRight: 5,
    },
    textEdit: {
      textTransform: 'none',
      fontWeight: '700',
      fontSize: '10px',
      lineHeight: '13px',
      color: '#4386A1',
    },
    header: {
      display: 'flex',
      flexDirection: 600 > width ? 'column' : 'row',
    },
    typography: {
      fontSize: 12,
      lineHeight: '17px',
      color: '#000000',
      fontWeight: 600,
    },
    icon: {
      height: 20,
      width: 20,
      color: '#8A8D8E',
    },
    price: {
      fontSize: 12,
      lineHeight: '17px',
      fontWeight: 600,
      paddingRight: 4,
      color: color.primary,
    },
    quantity: {
      fontSize: '7.5px',
      fontWeight: 600,
      color: color.font,
      backgroundColor: color.primary,
      height: '17px',
      lineHeight: '9px',
      width: '17px',
      borderRadius: '20%',
      marginRight: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWidth: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    addText: {
      color: 'white',
      fontWeight: 500,
      fontSize: 14,
      textTransform: 'none',
    },
    addButton: {
      height: 35,
      width: '100%',
      backgroundColor: color.primary,
      borderRadius: 5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    displayFlex: { display: 'flex' },
    dialog: {
      position: 'fixed',
      bottom: 0,
      top: '50%',
      borderRadius: 10,
    },
    dialogContent: { backgroundColor: '#D0D0D0' },
    dialogActions: { backgroundColor: '#D0D0D0' },
    itemAlreadyInCartText: {
      fontStyle: 'bold',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#000000',
    },
  };

  useEffect(() => {
    const loadData = async () => {
      await dispatch(OrderAction.getCart());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (!isEmptyArray(product.variants)) {
      const items = handleProductVariants();
      setProductInBasket(items);
    } else {
      if (!isEmptyObject(basket)) {
        const items = basket?.details?.filter(
          (item) => item.product.id === product.id
        );
        setProductInBasket(items);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket, product]);

  useEffect(() => {
    if (mode === 'GuestMode') {
      if (!isEmptyArray(product.variants)) {
        const items = handleProductVariantsGuestCO();
        setProductInBasket(items);
      } else {
        if (!isEmptyObject(basketGuestCoResponse)) {
          const items = basketGuestCoResponse?.details?.filter(
            (item) => item.product.id === product.id
          );
          setProductInBasket(items);
        } else if (basketGuestCo.message !== 'Cart it empty.') {
          const items = basketGuestCo?.details?.filter(
            (item) => item.product.id === product.id
          );
          setProductInBasket(items);
        }

        if (!isEmptyObject(editResponse)) {
          const items = editResponse?.details?.filter(
            (item) => item.product.id === product.id
          );
          setProductInBasket(items);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    product.variants,
    basketGuestCo,
    basketGuestCoResponse,
    editResponse,
  ]);

  const handleOpenAddModal = (value) => {
    setIsOpenAddModal(true);
    setSelectedProductBasketUpdate(value);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
    setSelectedProductBasketUpdate({});
  };

  const handleCurrency = (value) => {
    const price = value ? value : 0;
    const result = price.toLocaleString(companyInfo.currency.locale, {
      style: 'currency',
      currency: companyInfo.currency.code,
    });

    return result;
  };

  const handleProductVariantIds = (product) => {
    let items = [];
    if (product) {
      if (!isEmptyArray(product?.variants || [])) {
        product.variants.forEach((variant) => {
          items.push(variant.id);
        });
      }
      items.push(product.id);
    }
    return items;
  };

  const handleProductVariantInBasket = ({ basketDetails, product }) => {
    const productItemIds = handleProductVariantIds(product);
    if (!isEmptyArray(productItemIds)) {
      const result = filter(
        basketDetails,
        (basketDetail) =>
          indexOf(productItemIds, basketDetail.product.id) !== -1
      );
      return result;
    }
    return [];
  };

  const handleProductVariants = () => {
    const productItemInBasket = handleProductVariantInBasket({
      basketDetails: basket.details,
      product,
    });
    return productItemInBasket;
  };

  const handleProductVariantsGuestCO = () => {
    const handleBasketDetails = () => {
      if (basketGuestCo?.details?.length) {
        return basketGuestCo.details;
      }
      if (
        editResponse?.details &&
        basketGuestCoResponse?.details?.length <= editResponse?.details?.length
      ) {
        return editResponse.details;
      }
      return basketGuestCoResponse?.details;
    };

    const productItemInBasket = handleProductVariantInBasket({
      basketDetails: handleBasketDetails(),
      product,
    });
    return productItemInBasket;
  };

  const renderProductModifierItems = (items) => {
    const productModifierItems = items.map((item, index) => {
      return (
        <div key={index} style={styles.productModifierBody}>
          <Typography style={styles.productModifierQuantity}>
            {item.quantity}x
          </Typography>
          <Typography style={styles.productModifierName}>
            {item.name}
          </Typography>
          <Typography style={styles.productModifierTypography}>
            ({handleCurrency(item.price)})
          </Typography>
        </div>
      );
    });
    return productModifierItems;
  };
  const renderProductModifiers = (productModifiers) => {
    if (!isEmptyArray(productModifiers)) {
      const result = productModifiers.map((productModifier, index) => {
        return (
          <div key={index}>
            <Typography style={styles.productModifierAddOn}>Add On:</Typography>
            {renderProductModifierItems(productModifier?.modifier?.details)}
          </div>
        );
      });

      return result;
    }
  };

  const renderProducts = () => {
    if (!isEmptyArray(productInBasket)) {
      const result = productInBasket.map((product, index) => {
        return (
          <div key={index}>
            <div style={styles.productRoot}>
              <div style={styles.displayFlex}>
                <Typography style={styles.quantity}>
                  {product?.quantity}x
                </Typography>
                <Typography style={styles.typography}>
                  {product?.product?.name}
                </Typography>
              </div>

              {renderProductModifiers(product?.modifiers)}
              <div style={styles.productBody}>
                <Typography style={styles.price}>
                  {handleCurrency(product?.grossAmount)}
                </Typography>
                <Button
                  style={styles.buttonEdit}
                  onClick={() => {
                    handleOpenAddModal(product);
                  }}
                >
                  <EditIcon style={styles.iconEdit} />
                  <Typography style={styles.textEdit}>Edit</Typography>
                </Button>
              </div>
            </div>
            <Divider />
          </div>
        );
      });

      return result;
    } else if (mode === 'GuestMode') {
      const result = productInBasket?.map((product, index) => {
        return (
          <div key={index}>
            <div style={styles.productRoot}>
              <div style={styles.displayFlex}>
                <Typography style={styles.quantity}>
                  {product?.quantity}x
                </Typography>
                <Typography style={styles.typography}>
                  {product?.product?.name}
                </Typography>
              </div>

              {renderProductModifiers(product?.modifiers)}
              <div style={styles.productBody}>
                <Typography style={styles.price}>
                  {handleCurrency(product?.grossAmount)}
                </Typography>
                <Button
                  style={styles.buttonEdit}
                  onClick={() => {
                    handleOpenAddModal(product);
                  }}
                >
                  <EditIcon style={styles.iconEdit} />
                  <Typography style={styles.textEdit}>Edit</Typography>
                </Button>
              </div>
            </div>
            <Divider />
          </div>
        );
      });

      return result;
    }
  };

  return (
    <div>
      {isOpenAddModal && (
        <ProductAddModal
          open={isOpenAddModal}
          width={width}
          handleClose={handleCloseAddModal}
          selectedProduct={selectedProductBasketUpdate}
          product={product}
          productDetail={productDetail}
        />
      )}

      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
        style={styles.dialog}
      >
        <DialogContent style={styles.dialogContent}>
          <div style={styles.header}>
            <div style={styles.fullWidth}>
              <Typography style={styles.itemAlreadyInCartText}>
                This item already in cart
              </Typography>

              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                style={styles.icon}
              />
            </div>
          </div>
          <div>{renderProducts()}</div>
        </DialogContent>
        <DialogActions style={styles.dialogActions}>
          <Button
            style={styles.addButton}
            onClick={() => {
              handleOpenAddModal();
            }}
          >
            <Typography style={styles.addText}>Make Another</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ProductUpdateModal.defaultProps = {
  open: false,
  handleClose: () => {},
  product: {},
  width: 600,
};

ProductUpdateModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  product: PropTypes.object,
  width: PropTypes.number,
};

export default ProductUpdateModal;
