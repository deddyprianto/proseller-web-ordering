import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

import { isEmptyArray } from 'helpers/CheckEmpty';

import ProductAddModal from './ProductAddModal';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    companyInfo: state.masterdata.companyInfo.data,
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductUpdateModal = ({
  open,
  handleClose,
  product,
  width,
  ...props
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const styles = {
    backgroundColor: {
      backgroundColor: props.color.background,
    },
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
      color: props.color.primary,
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
    divider: {},
    buttonEdit: {
      display: 'flex',
      alignItems: 'center',
    },
    iconEdit: {
      height: 10,
      width: 10,
      color: props.color.primary,
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
      // color: '#808080',
      color: '#000000',
      fontWeight: 600,
    },
    imageSize: {
      height: 340,
      width: 340,
      borderRadius: 5,
    },
    productName: {
      width: '100%',
      fontSize: 26,
      // color: props.color.primary,
      color: 'black',
      lineHeight: '30px',
      fontWeight: 600,
      paddingBottom: 10,
      paddingLeft: 600 > width ? 0 : 10,
      paddingTop: 600 > width && 10,
    },
    productDescription: {
      width: '100%',
      fontSize: 16,
      color: props.color.primary,
      lineHeight: '17px',
      paddingLeft: 600 > width ? 0 : 10,
    },
    buttonIcon: {
      height: 15,
      width: 20,
      backgroundColor: props.color.primary,
      borderRadius: 5,
      // padding: 10,
      marginRight: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',

      padding: '3.75px',
      gap: '7.5px',
    },
    icon: {
      height: 20,
      width: 20,
      // color: 'white',
      color: '#8A8D8E',
    },
    price: {
      fontSize: 12,
      lineHeight: '17px',
      fontWeight: 600,
      paddingRight: 4,
      color: props.color.primary,
    },
    quantity: {
      fontSize: '7.5px',
      fontWeight: 600,
      color: '#FFFFFF',
      backgroundColor: '#4386A1',
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
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      alignItems: 'center',
      alignContents: 'center',
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
      backgroundColor: props.color.primary,
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

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [productInBasket, setProductInBasket] = useState([]);
  const [selectedProductBasketUpdate, setSelectedProductBasketUpdate] =
    useState({});

  const handleOpenAddModal = (value) => {
    setIsOpenAddModal(true);
    setSelectedProductBasketUpdate(value);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
    setSelectedProductBasketUpdate({});
  };

  const handleCurrency = (price) => {
    const result = price.toLocaleString(props.companyInfo.currency.locale, {
      style: 'currency',
      currency: props.companyInfo.currency.code,
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
      basketDetails: props.basket.details,
      product,
    });
    return productItemInBasket;
  };

  useEffect(() => {
    if (!isEmptyArray(product.variants)) {
      const items = handleProductVariants();
      setProductInBasket(items);
    } else {
      const items = props.basket?.details?.filter(
        (item) => item.product.id === product.id
      );

      setProductInBasket(items);
    }
  }, [props.basket, product]);

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
                  {handleCurrency(product?.nettAmount)}
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
            <Divider style={styles.divider} />
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
  basket: {},
  companyInfo: {},
  handleClose: null,
  product: {},
  defaultOutlet: {},
  color: {},
  dispatch: null,
  width: 600,
};

ProductUpdateModal.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object,
  width: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductUpdateModal);
