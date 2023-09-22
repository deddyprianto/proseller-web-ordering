import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import loadable from '@loadable/component';

import config from 'config';

import { makeStyles } from '@material-ui/styles';
import Box from '@mui/material/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { isEmptyArray } from 'helpers/CheckEmpty';

import ImageContainer from 'components/imageContainer';
import { ProductAction } from 'redux/actions/ProductAction';

const ProductAddModal = loadable(() => import('./ProductAddModal'));
const ProductUpdateModal = loadable(() => import('./ProductUpdateModal'));

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

const Product = ({ item }) => {
  const [width] = useWindowSize();
  const dispatch = useDispatch();

  const isUnavailable = item?.product?.orderingStatus === 'UNAVAILABLE';

  const mode = useSelector((state) => state.guestCheckoutCart.mode);
  const basket = useSelector((state) => state.order.basket);
  const outlet = useSelector((state) => state.outlet.defaultOutlet);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const guestCheckoutCartBasket = useSelector(
    (state) => state.guestCheckoutCart
  );

  const useStyles = makeStyles({
    image: {
      height: 100,
      filter: isUnavailable ? 'grayscale(90%)' : '',
    },
    typographyProductGroup: {
      fontSize: 16,
      color: color.primary,
      lineHeight: '17px',
      fontWeight: 600,
    },
    price: {
      paddingBottom: 6,
      marginTop: 10,
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: isUnavailable ? 'red' : color.font,
    },
    quantity: {
      fontSize: '7.5px',
      fontWeight: 600,
      color: color.textButtonColor,
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
      color: isUnavailable ? '#8A8D8E' : color.font,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    button: {
      borderRadius: 5,
      backgroundColor: isUnavailable ? '#D0D0D0' : color.primary,
      '&:hover': {
        color: '#000000',
        backgroundColor: color.primary,
      },
      '&.MuiButton-root:hover': {
        backgroundColor: '#D0D0D0',
      },
      height: '25px',
      width: width > 600 ? 100 : 80,
      display: 'flex',
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
  const [productDetail, setProductDetail] = useState({});
  const [isLoadingUpdate, setIsLoadingUpdate] = useState([]);

  useEffect(() => {
    const totalQtyProductInBasket = handleQuantityProduct();
    setTotalQty(totalQtyProductInBasket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    item,
    basket,
    guestCheckoutCartBasket.data?.details,
    guestCheckoutCartBasket.response?.details,
  ]);

  const checkDescription = /^<([a-z]+)([^<]+)*(?:>([^<]*)<\/\1>|\s+\/>)$/i.test(
    item?.product?.description
  );
  
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
          guestCheckoutCartBasket?.response?.details?.length >= 1
            ? guestCheckoutCartBasket.response?.details
            : guestCheckoutCartBasket.data?.details,
        item,
      });

      productItemInBasketGuestCo.forEach((item) => {
        totalQty = totalQty + item.quantity;
      });
    } else {
      const productItemInBasket = handleProductItemsInBasket({
        basketDetails: basket.details,
        item,
      });

      productItemInBasket.forEach((item) => {
        totalQty = totalQty + item.quantity;
      });
    }

    return totalQty;
  };

  const handleOpenAddModal = () => {
    setProductDetail(item.product);
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenUpdateModal = async () => {
    const temp = [...isLoadingUpdate];
    temp[item.sequence] = true;
    setIsLoadingUpdate(temp);

    const productById = await dispatch(
      ProductAction.getProductById({ outlet: outlet?.id }, item?.product?.id)
    );

    setProductDetail(productById);
    setIsOpenUpdateModal(true);
    temp[item.sequence] = false;
    setIsLoadingUpdate(temp);
  };

  const handleCloseUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const handleCurrency = (price) => {
    if (companyInfo && price) {
      const result = price.toLocaleString(companyInfo.currency.locale, {
        style: 'currency',
        currency: companyInfo.currency.code,
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
      if (color?.productPlaceholder) {
        return color.productPlaceholder;
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
            width={640}
            height={360}
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

  const handleButtonStartIcon = () => {
    if (totalQty) {
      return (
        <EditIcon
          className={classes.icon}
          style={{
            fontSize: 12,
          }}
        />
      );
    }

    return (
      <AddIcon
        className={classes.icon}
        style={{
          fontSize: 15,
        }}
      />
    );
  };

  return (
    <div
      id='select-item-container'
      className={isUnavailable ? classes.disabledProduct : ''}
    >
      {isOpenAddModal && (
        <ProductAddModal
          open={isOpenAddModal}
          width={width}
          handleClose={handleCloseAddModal}
          product={item.product}
          productDetail={productDetail}
        />
      )}

      {isOpenUpdateModal && (
        <ProductUpdateModal
          open={isOpenUpdateModal}
          width={width}
          handleClose={handleCloseUpdateModal}
          product={item.product}
          productDetail={productDetail}
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
              {!checkDescription && (
                <Typography
                  paragraph
                  noWrap
                  gutterBottom={false}
                  className={classes.description}
                >
                  {item?.product?.description}
                </Typography>
              )}

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
                  width={640}
                  height={360}
                />
              </div>
              <Button
                id='add-item-button'
                className={classes.button}
                startIcon={handleButtonStartIcon()}
                onClick={() => {
                  if (totalQty) {
                    handleOpenUpdateModal();
                  } else {
                    handleOpenAddModal();
                  }
                }}
                disabled={isUnavailable || !!isLoadingUpdate[item.sequence]}
              >
                {isLoadingUpdate[item.sequence] ? (
                  <CircularProgress size={18} sx={{ color: '#ffffff' }} />
                ) : (
                  <Typography className={classes.textButton}>
                    {totalQty ? 'Update' : 'Add'}
                  </Typography>
                )}
              </Button>
            </div>
          </>
        )}
      </Box>
    </div>
  );
};

Product.defaultProps = {
  item: {},
};

Product.propTypes = {
  item: PropTypes.object,
};

export default Product;
