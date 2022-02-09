import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import config from 'config';

import { makeStyles } from '@material-ui/styles';
import Box from '@mui/material/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { isEmptyArray } from 'helpers/CheckEmpty';

import ProductAddModal from './ProductAddModal';
import ProductUpdateModal from './ProductUpdateModal';

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

const Product = ({ item, ...props }) => {
  const [width] = useWindowSize();
  const useStyles = makeStyles({
    box: {},
    image: {
      display: 'flex',
      justifyContent: 'center',
      width: 180,
      height: 'auto',
      alignItems: 'center',
      padding: 0,
      marginRight: 5,
    },
    imageSize: {
      height: 600 > width ? 75 : 180,
      width: 600 > width ? 75 : 180,
      minWidth: 600 > width ? 75 : 180,
      borderRadius: 5,
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
    },
    price: {
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
    },
    quantity: {
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      paddingRight: 4,
      color: props.color.primary,
    },
    item: {
      padding: 10,
      display: 'flex',
      cursor: 'pointer',
    },
    description: {
      maxHeight: 70,
      whiteSpace: 'pre-line',
      fontSize: 10,
      marginBottom: 0,
    },
    button: {
      float: 'left',
      borderRadius: 5,
      width: 90,
      height: 600 > width ? 26 : 40,
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: props.color.primary,
      '&:hover': {
        color: '#000000',
        backgroundColor: props.color.primary,
      },
    },
    textButton: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'none',
    },
    textUnavailable: {
      fontSize: 26,
      fontWeight: 600,
      color: '#000000',
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
      height: 10,
      width: 10,
      color: '#FFFFFF',
    },
    name: { display: 'flex' },
  });
  const classes = useStyles();

  const [totalQty, setTotalQty] = useState(0);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  const handleProductItemIds = (item) => {
    let items = [];
    if (item?.product) {
      if (!isEmptyArray(item?.product?.variants || [])) {
        item.product.variants.forEach((variant) => {
          items.push(variant.id);
        });
      }
      items.push(item.product.id);
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

  const handleQuantityProduct = () => {
    let totalQty = 0;
    const productItemInBasket = handleProductItemsInBasket({
      basketDetails: props.basket.details,
      item,
    });

    productItemInBasket.forEach((item) => {
      totalQty = totalQty + item.quantity;
    });

    return totalQty;
  };

  useEffect(() => {
    const totalQtyProductInBasket = handleQuantityProduct();
    setTotalQty(totalQtyProductInBasket);
  }, [item, props.basket]);

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
    const result = price.toLocaleString(props.companyInfo.currency.locale, {
      style: 'currency',
      currency: props.companyInfo.currency.code,
    });

    return result;
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

  const renderPriceAndButton = () => {
    if (item?.product?.orderingStatus === 'UNAVAILABLE') {
      return (
        <Typography className={classes.textUnavailable}>UNAVAILABLE</Typography>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography className={classes.price}>
          {handleCurrency(item?.product?.retailPrice)}
        </Typography>
        <Button
          className={classes.button}
          startIcon={<CheckCircleOutlineIcon className={classes.icon} />}
        >
          <Typography className={classes.textButton}>
            {totalQty ? 'update' : 'Add'}
          </Typography>
        </Button>
      </div>
    );
  };

  const renderGroupProducts = () => {
    return (
      <div className={classes.item}>
        <div className={classes.image}>
          <img
            className={classes.imageSize}
            src={renderImageProduct(item)}
            alt={item.name}
            title={item.name}
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
    <div>
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
        }}
      >
        {item?.itemType === 'GROUP' || item?.itemType === 'CATEGORY' ? (
          renderGroupProducts()
        ) : (
          <div
            className={classes.item}
            onClick={() => {
              if (totalQty) {
                handleOpenUpdateModal();
              } else {
                handleOpenAddModal();
              }
            }}
          >
            <div className={classes.image}>
              <img
                className={classes.imageSize}
                src={renderImageProduct(item)}
                alt={item?.product.name || ''}
                title={item?.product.name}
              />
            </div>
            <div className={classes.itemBody}>
              <div>
                <div className={classes.name}>
                  {renderQuantityProduct()}
                  <Typography className={classes.typography}>
                    {item?.product.name}
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
              </div>
              {renderPriceAndButton()}
            </div>
          </div>
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
};

Product.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  dispatch: PropTypes.func,
  item: PropTypes.object,
  productConfig: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
