import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import config from 'config';

import { makeStyles } from '@material-ui/styles';
import Box from '@mui/material/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { isEmptyArray } from 'helpers/CheckEmpty';

import ProductAddModal from './ProductAddModal';
import ProductUpdateModal from './ProductUpdateModal';
import ImageContainer from 'components/imageContainer';

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
    guestCheckoutCartBasket: state.guestCheckoutCart,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Product = ({ item, ...props }) => {
  const [width] = useWindowSize();

  const isUnavailable = item?.product?.orderingStatus === 'UNAVAILABLE';

  const useStyles = makeStyles({
    image: {
      height: 100,
      filter: isUnavailable ? 'grayscale(90%)' : '',
    },
    imageSize: {
      height: 600 > width ? 80 : 100,
      minWidth: 600 > width ? 80 : 100,
      borderRadius: 5,
      width: 80,
    },
    typographyProductGroup: {
      fontSize: 16,
      color: props.color.primary,
      lineHeight: '17px',
      fontWeight: 600,
    },
    typography: {
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: isUnavailable ? '#8A8D8E' : props.color.font,
    },
    price: {
      paddingBottom: 6,
      marginTop: 10,
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: isUnavailable ? 'red' : props.color.font,
    },
    quantity: {
      fontSize: '7.5px',
      fontWeight: 600,
      color: props.color.textButtonColor,
      backgroundColor: props.color.primary,
      height: '17px',
      lineHeight: '9px',
      width: '17px',
      borderRadius: '20%',
      marginRight: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      padding: 5,
      display: 'flex',
      cursor: 'pointer',
    },
    description: {
      whiteSpace: 'pre-line',
      marginBottom: 0,
      fontWeight: 500,
      fontSize: '12px',
      color: isUnavailable ? '#8A8D8E' : props.color.font,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    button: {
      borderRadius: 5,
      backgroundColor: isUnavailable ? '#D0D0D0' : props.color.primary,
      '&:hover': {
        color: '#000000',
        backgroundColor: props.color.primary,
      },
      height: '25px',
      width: width > 600 ? 100 : 80,
      display: 'flex',
      // marginTop: 600 > width ? 100 : 0,
      marginTop: width > 600 ? 10 : 0,
    },
    textButton: {
      color: '#FFFFFF',
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '13px',
    },
    itemBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'auto',
      maxHeight: 180,
      width: '100%',
    },
    bold: {
      fontWeight: 600,
    },
    mt10: {
      marginTop: 10,
    },
    icon: {
      height: 5,
      width: 5,
      color: '#FFFFFF',
    },
    name: {
      display: 'flex',
    },
    box: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '170px',
      padding: '17px',
      marginBottom: 5,
    },
    boxLeft: {
      flexBasis: '85%',
      marginRight: 15,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    boxRight: {
      textAlign: 'center',
      flexBasis: '15%',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: 5,
    },
    disabledProduct: {
      pointerEvents: 'none',
      opacity: 0.4,
      // filter: 'grayscale(90%)',
    },
    productNameText: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '15px',
    },
  });

  const classes = useStyles();

  const [totalQty, setTotalQty] = useState(0);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const mode = useSelector((state) => state.guestCheckoutCart.mode);
  const handleProductItemIds = (item) => {
    let items = [];
    if (item?.product) {
      if (!isEmptyArray(item?.product?.variants || [])) {
        item.product?.variants.forEach((variant) => {
          items.push(variant.id);
        });
      }
      items.push(item.product?.id);
    }
    return items;
  };

  const handleProductItemsInBasket = ({ basketDetails, item }) => {
    const productItemIds = handleProductItemIds(item);
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
  const handleProductItemsInBasketGuestCo = ({ basketDetails, item }) => {
    const productItemIds = handleProductItemIds(item);
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

  const handleQuantityProduct = () => {
    let totalQty = 0;
    if (mode === 'GuestMode') {
      const productItemInBasketGuestCo = handleProductItemsInBasketGuestCo({
        basketDetails:
          props.guestCheckoutCartBasket?.response?.details?.length >= 1
            ? props.guestCheckoutCartBasket.response?.details
            : props.guestCheckoutCartBasket.data?.details,
        item,
      });

      productItemInBasketGuestCo.forEach((item) => {
        totalQty = totalQty + item.quantity;
      });
    } else {
      const productItemInBasket = handleProductItemsInBasket({
        basketDetails: props.basket.details,
        item,
      });

      productItemInBasket.forEach((item) => {
        totalQty = totalQty + item.quantity;
      });
    }

    return totalQty;
  };

  useEffect(() => {
    const totalQtyProductInBasket = handleQuantityProduct();
    setTotalQty(totalQtyProductInBasket);
  }, [
    item,
    props.basket,
    props.guestCheckoutCartBasket.data?.details,
    props.guestCheckoutCartBasket.response?.details,
  ]);

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenUpdateModal = () => {
    setIsOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setIsOpenUpdateModal(false);
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
      return item.product?.defaultImageURL;
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

  const renderGroupProducts = () => {
    return (
      <div className={classes.item}>
        <div className={classes.image}>
          <ImageContainer
            image={renderImageProduct(item)}
            alt={item?.product?.name || ''}
            title={item?.product?.name}
          />
        </div>
        <div className={classes.itemBody}>
          <Typography className={classes.typographyProductGroup}>
            {item?.name}
          </Typography>
        </div>
      </div>
    );
  };

  const renderQuantityProduct = () => {
    if (totalQty) {
      return <Typography className={classes.quantity}>{totalQty}x</Typography>;
    }
    return;
  };

  return (
    <div className={isUnavailable ? classes.disabledProduct : ''}>
      {isOpenAddModal && (
        <ProductAddModal
          open={isOpenAddModal}
          width={width}
          handleClose={handleCloseAddModal}
          product={item.product}
        />
      )}

      {isOpenUpdateModal && (
        <ProductUpdateModal
          open={isOpenUpdateModal}
          width={width}
          handleClose={handleCloseUpdateModal}
          product={item.product}
        />
      )}

      <Box
        sx={{
          boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
          border: '1px solid rgba(128, 128, 128, 0.5)',
          borderRadius: '16px',
          backgroundColor: '#F2F2F2',
        }}
        className={classes.box}
      >
        {item?.itemType === 'GROUP' || item?.itemType === 'CATEGORY' ? (
          renderGroupProducts()
        ) : (
          <>
            <div className={classes.boxLeft}>
              <div className={classes.name}>
                {renderQuantityProduct()}
                <Typography className={classes.productNameText}>
                  {item?.product?.name}
                </Typography>
              </div>
              <Typography
                paragraph
                noWrap
                gutterBottom={false}
                className={classes.description}
              >
                {item?.product?.description}
              </Typography>
              <Typography className={classes.price}>
                {isUnavailable
                  ? 'Sold Out'
                  : handleCurrency(item?.product?.retailPrice)}
              </Typography>
            </div>
            <div className={classes.boxRight}>
              <div className={classes.image}>
                <ImageContainer
                  image={renderImageProduct(item)}
                  alt={item?.product?.name || ''}
                  title={item?.product?.name}
                />
              </div>
              <Button
                id='add-item-button'
                className={classes.button}
                startIcon={
                  totalQty ? (
                    <EditIcon
                      className={classes.icon}
                      style={{
                        fontSize: 12,
                      }}
                    />
                  ) : (
                    <AddIcon
                      className={classes.icon}
                      style={{
                        fontSize: 15,
                      }}
                    />
                  )
                }
                onClick={() => {
                  if (totalQty) {
                    handleOpenUpdateModal();
                  } else {
                    handleOpenAddModal();
                  }
                }}
                disabled={isUnavailable}
              >
                <Typography className={classes.textButton}>
                  {totalQty ? 'Update' : 'Add'}
                </Typography>
              </Button>
            </div>
          </>
        )}
      </Box>
    </div>
  );
};

Product.defaultProps = {
  basket: {},
  color: {},
  dispatch: null,
  productConfig: {},
  companyInfo: {},
  item: {},
  guestCheckoutCartBasket: {},
};

Product.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  dispatch: PropTypes.func,
  guestCheckoutCartBasket: PropTypes.object,
  item: PropTypes.object,
  productConfig: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
