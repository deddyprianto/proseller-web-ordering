import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import config from 'config';

import IconButton from '@mui/material/IconButton';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import { isEmptyArray } from 'helpers/CheckEmpty';

import ProductAddModal from 'components/productList/components/ProductAddModal';
import ProductCartRemoveModal from 'components/productCartList/components/ProductCartRemoveModal';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductCart = ({ item, ...props }) => {
  const [width] = useWindowSize();
  const styles = {
    textNote: {
      paddingTop: 10,
      fontSize: 12,
    },
    textPromotion: {
      fontSize: 12,
      color: props.color.primary,
    },
    rootProductCart: {
      position: 'relative',
    },
    rootPrice: {
      display: 'flex',
    },
    buttonDelete: {
      display: 'flex',
      justifyContent: 'end',
      color: props.color.primary,
      '&:hover': {
        color: props.color.primary,
      },
      position: 'absolute',
      right: 10,
      bottom: -2,
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
    image: {
      display: 'flex',
      width: 600 > width ? 120 : 180,
      height: 'auto',
      paddingLeft: 10,
      paddingRight: 10,
    },
    imageSize: {
      height: 600 > width ? 75 : 150,
      width: 600 > width ? 75 : 150,
      minWidth: 600 > width ? 75 : 150,
      borderRadius: 5,
    },
    typography: {
      fontSize: 12,
      lineHeight: '17px',
      fontWeight: 600,
    },
    price: {
      paddingRight: 10,
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: props.color.primary,
    },
    priceDiscount: {
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: props.color.primary,
      textDecorationLine: 'line-through',
    },
    quantity: {
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      paddingRight: 4,
      color: props.color.primary,
    },
    item: {
      display: 'flex',
      cursor: 'pointer',
      width: '100%',
    },
    itemBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'auto',
      width: '100%',
    },
    name: { display: 'flex' },
  };

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);

  const handleOpenAddModal = () => {
    if (!isOpenRemoveModal) {
      setIsOpenAddModal(true);
    }
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenRemoveModal = () => {
    setIsOpenRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setIsOpenRemoveModal(false);
  };

  const handleCurrency = (price) => {
    if (props.companyInfo && price) {
      const result = price.toLocaleString(props.companyInfo.currency.locale, {
        style: 'currency',
        currency: props.companyInfo.currency.code,
      });

      return result;
    }
  };

  const renderImageProduct = (item) => {
    if (item?.product?.defaultImageURL) {
      return item.product.defaultImageURL;
    } else {
      if (item?.defaultImageURL) {
        return item?.defaultImageURL;
      }
      if (props?.color?.productPlaceholder) {
        return props.color.productPlaceholder;
      }
      return config.image_placeholder;
    }
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

  const renderPromotion = () => {
    if (!isEmptyArray(item.promotions)) {
      const promotions = item.promotions.map((promotion, index) => {
        return (
          <Typography key={index} style={styles.textPromotion}>
            - {promotion.name}
          </Typography>
        );
      });
      return promotions;
    }
  };

  const renderNotes = () => {
    if (item.remark) {
      return (
        <Typography style={styles.textNote}>Note: {item.remark}</Typography>
      );
    }
  };

  const renderPrice = () => {
    if (!isEmptyArray(item.promotions)) {
      return (
        <div style={styles.rootPrice}>
          <Typography style={styles.price}>
            {handleCurrency(item?.nettAmount)}
          </Typography>
          <Typography style={styles.priceDiscount}>
            {handleCurrency(item?.grossAmount)}
          </Typography>
        </div>
      );
    }
    return (
      <div style={styles.rootPrice}>
        <Typography style={styles.price}>
          {handleCurrency(item?.nettAmount)}
        </Typography>
      </div>
    );
  };

  return (
    <div style={styles.rootProductCart}>
      {isOpenAddModal && (
        <ProductAddModal
          open={isOpenAddModal}
          width={width}
          handleClose={handleCloseAddModal}
          product={item.product}
          selectedProduct={item}
        />
      )}

      {isOpenRemoveModal && (
        <ProductCartRemoveModal
          open={isOpenRemoveModal}
          width={width}
          handleClose={handleCloseRemoveModal}
          product={item.product}
          selectedProductRemove={item}
        />
      )}

      <div
        style={styles.item}
        onClick={() => {
          handleOpenAddModal();
        }}
      >
        <div style={styles.image}>
          <img
            style={styles.imageSize}
            src={renderImageProduct(item)}
            alt={item?.product.name || ''}
            title={item?.product.name}
          />
        </div>
        <div style={styles.itemBody}>
          <div style={styles.name}>
            <Typography style={styles.quantity}>{item.quantity}x</Typography>
            <Typography style={styles.typography}>
              {item?.product.name} ({handleCurrency(item.product.retailPrice)})
            </Typography>
          </div>
          {renderPromotion()}
          {renderProductModifiers(item?.modifiers)}
          {renderNotes()}
          {renderPrice()}
        </div>
      </div>
      <IconButton
        style={styles.buttonDelete}
        onClick={() => {
          handleOpenRemoveModal();
        }}
      >
        <DeleteIcon fontSize='large' />
      </IconButton>
    </div>
  );
};

ProductCart.defaultProps = {
  basket: {},
  color: {},
  dispatch: null,
  companyInfo: {},
  item: {},
};

ProductCart.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  dispatch: PropTypes.func,
  item: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCart);
