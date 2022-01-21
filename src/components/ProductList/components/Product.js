import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmptyObject } from 'jquery';
import config from 'config';
import { makeStyles } from '@material-ui/styles';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Product = ({ item, ...props }) => {
  const [width] = useWindowSize();
  const useStyles = makeStyles({
    image: {
      display: 'flex',
      justifyContent: 'center',
      maxWidth: 180,
      height: 'auto',
      alignItems: 'center',
      padding: 0,
      marginRight: 5,
    },
    imageSize: {
      height: 600 > width ? 75 : 180,
      width: 600 > width ? 75 : 180,
      borderRadius: 5,
    },
    typographyProductGroup: {
      fontSize: 16,
      marginTop: 10,
      color: props.color.primary,
      lineHeight: '17px',
      fontWeight: 600,
    },
    typography: {
      marginTop: 10,
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
      marginTop: 10,
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
      maxHeight: 80,
      whiteSpace: 'pre-line',
      fontSize: 10,
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

  const renderImageProduct = (item) => {
    const productConfig = props.productConfig;
    if (item?.product?.defaultImageURL) {
      return item?.product.defaultImageURL;
    } else {
      if (item?.defaultImageURL) {
        return item?.defaultImageURL;
      }
      if (productConfig?.color?.productPlaceholder) {
        return productConfig.color.productPlaceholder;
      }
      return config.image_placeholder;
    }
  };

  const getCurrency = (price) => {
    if (props.companyInfo) {
      const { currency } = props.companyInfo;

      if (!price || price === '-') {
        price = 0;
      }

      const result = price.toLocaleString(currency.locale, {
        style: 'currency',
        currency: currency.code,
      });
      return result;
    }
  };

  const getQuantityProduct = () => {
    const { basket, defaultOutlet, item } = props;

    try {
      if (!isEmptyObject(basket)) {
        const products = basket.details.filter(
          (data) =>
            data.product.id.includes(item.product.id) &&
            defaultOutlet.sortKey === basket.outletID
        );
        if (products.length > 0) {
          const total = products.reduce((acc, product) => {
            return { quantity: acc.quantity + product.quantity };
          });
          return `${total.quantity}x`;
        } else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const renderPrice = () => {
    if (item?.product?.orderingStatus === 'UNAVAILABLE') {
      return (
        <Typography className={classes.textUnavailable}>UNAVAILABLE</Typography>
      );
    }
    return (
      <div>
        <Typography className={classes.price}>
          {getCurrency(item?.product.retailPrice)}
        </Typography>
        <Button
          className={classes.button}
          startIcon={<CheckCircleOutlineIcon className={classes.icon} />}
        >
          <Typography className={classes.textButton}>Update</Typography>
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
        <div>
          <Typography className={classes.typographyProductGroup}>
            {item?.name}
          </Typography>
        </div>
      </div>
    );
  };

  const renderQuantityProduct = () => {
    const qty = getQuantityProduct();
    if (qty) {
      return <Typography className={classes.quantity}>{qty}</Typography>;
    }
    return;
  };

  if (!item?.product && item?.itemType === 'PRODUCT') {
    return null;
  }

  return (
    <Box
      sx={{
        border: '1px solid rgba(128, 128, 128, 0.5)',
        boxShadow: 'rgb(128 128 128 / 50%) 0px 0px 5px',
      }}
    >
      {item?.itemType === 'GROUP' || item?.itemType === 'CATEGORY' ? (
        renderGroupProducts()
      ) : (
        <div className={classes.item}>
          <div className={classes.image}>
            <img
              className={classes.imageSize}
              src={renderImageProduct(item)}
              alt={item?.product.name}
              title={item?.product.name}
            />
          </div>
          <div className={classes.itemBody}>
            <div className={classes.name}>
              {renderQuantityProduct()}
              <Typography className={classes.typography}>
                {item?.product.name}
              </Typography>
            </div>
            <Typography className={classes.description}>
              {item?.product?.description}
            </Typography>
            {renderPrice()}
          </div>
        </div>
      )}
    </Box>
  );
};

Product.defaultProps = {
  basket: {},
  color: '',
  dispatch: null,
  defaultOutlet: {},
  orderingMode: '',
  companyInfo: {},
  productConfig: {},
  item: {},
};

Product.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.string,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  dispatch: PropTypes.func,
  item: PropTypes.object,
  orderingMode: PropTypes.string,
  productConfig: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
