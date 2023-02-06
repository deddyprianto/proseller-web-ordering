import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import DateFormatter from 'helpers/dateFormatter';
import { isEmptyArray } from 'helpers/CheckEmpty';

import { PaymentAction } from 'redux/actions/PaymentAction';

import MyVoucherWarningModal from './MyVoucherWarningModal';
import PicVoucherDefault from '../../../assets/images/voucher-icon.png';

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
    color: state.theme.color,
    basket: state.order.basket,
    selectedVoucher: state.payment.selectedVoucher,
    totalPaymentAmount: state.payment.totalPaymentAmount,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Voucher = ({ item, quantity, ...props }) => {
  const [width] = useWindowSize();
  const gadgetScreen = 900 > width;
  const styles = {
    root: {
      borderRadius: 5,
      boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
      border: '1px solid rgba(128, 128, 128, 0.5)',
      display: 'flex',
      position: 'relative',
    },
    rootBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    rootQuantity: {
      position: 'absolute',
      top: '10px',
      right: '2px',
      height: 30,
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 19,
      borderTopRightRadius: 19,
      marginTop: -10,
      marginRight: -2,
      backgroundColor: props.color.primary,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10,
    },

    iconDescription: {
      paddingTop: '7px',
      marginRight: 2,
      fontSize: 12,
      display: 'flex',
      alignItems: 'start',
      color: props.color.font,
    },
    iconExpiryDate: {
      width: 12,
      height: 12,
      marginRight: 2,
      color: props.color.font,
    },
    image: {
      maxWidth: gadgetScreen ? 120 : 160,
      borderBottomLeftRadius: 19,
      borderTopLeftRadius: 19,
      marginRight: 10,
    },
    rootDescription: {
      display: 'flex',
      alignItems: 'start',
      maxHeight: 100,
    },
    rootExpiryDate: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 5,
    },
    typographyDescription: {
      maxWidth: gadgetScreen ? 200 : 340,
      fontSize: 12,
      color: props.color.font,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      minHeight: 56,
      paddingTop: '5px',
    },
    typographyDiscount: {
      color: props.color.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    typographyExpiryDate: {
      fontSize: 12,
      color: props.color.font,
    },
    typographyName: {
      color: props.color.primary,
      fontSize: 14,
      fontWeight: 'bold',
      width: gadgetScreen ? 180 : 280,
    },
    typographyQuantity: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'white',
    },
  };

  const history = useHistory();
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    setSelectedVouchers([...props.selectedVoucher]);
    setBasket(props.basket?.details);
  }, [props.selectedVoucher]);

  const getPricesByCategory = () => {
    let result = [];
    const specificCategory = handleSpecificCategoryCondition();

    if (!isEmptyArray(specificCategory)) {
      specificCategory.forEach((item) => {
        result.push(item.unitPrice);
      });
      return result;
    }

    if (!isEmptyArray(basket)) {
      basket.forEach((item) => {
        result.push(item.unitPrice);
      });
    }

    return result;
  };

  const getPricesByCollection = () => {
    let result = [];
    const specificCollection = handleSpecificCollectionCondition();
    if (!isEmptyArray(specificCollection)) {
      specificCollection.forEach((item) => {
        result.push(item.unitPrice);
      });
      return result;
    }

    if (!isEmptyArray(basket)) {
      basket.forEach((item) => {
        result.push(item.unitPrice);
      });
    }

    return result;
  };

  const handleSpecificProductCondition = () => {
    const isVoucherProduct = props.basket?.details.filter((detail) => {
      return item.appliedItems.find(
        (appliedItem) => appliedItem.value === detail.product.id
      );
    });

    if (isVoucherProduct?.length < 1) {
      setMessage('Only specific products are allowed to use this voucher');
      handleOpenModal();
    }
    return isVoucherProduct?.length > 0 ? isVoucherProduct : false;
  };

  const getPricesByProduct = () => {
    const specificProducts = handleSpecificProductCondition();
    let result = [];

    if (!isEmptyArray(specificProducts)) {
      specificProducts.forEach((item) => {
        result.push(item.unitPrice);
      });
      return result;
    }
    if (!isEmptyArray(basket)) {
      basket.forEach((item) => {
        result.push(item.unitPrice);
      });

      return result;
    }
  };

  const getPrices = () => {
    let result = [];

    if (!isEmptyArray(basket)) {
      basket.forEach((item) => {
        result.push(item.unitPrice);
      });
    }

    return result;
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleMinPurchaseAmountCondition = () => {
    const isMinPurchaseAmount =
      props.basket?.totalNettAmount >= item.minPurchaseAmount;

    if (!isMinPurchaseAmount) {
      setMessage('Minimal Purchase not enough');
      handleOpenModal();
    }

    return isMinPurchaseAmount;
  };

  const handleSpecificCategoryCondition = () => {
    const isVoucherCategory = props.basket?.details.filter((detail) => {
      return item.appliedItems.find(
        (appliedItem) => appliedItem.value === detail.product.categoryID
      );
    });

    if (isVoucherCategory.length < 1) {
      setMessage(
        'Only specific product category are allowed to use this voucher'
      );
      handleOpenModal();
    }
    return isVoucherCategory.length > 0 ? isVoucherCategory : false;
  };

  const handleSpecificCollectionCondition = () => {
    const isCollectionMatched = props.basket?.details.filter((detail) => {
      return item.appliedItems.find((appliedItem) =>
        detail?.collections?.includes(appliedItem.value)
      );
    });

    if (isCollectionMatched.length < 1) {
      setMessage('Only specific products are allowed to use this voucher');
      handleOpenModal();
    }
    return isCollectionMatched.length > 0 ? isCollectionMatched : false;
  };

  const handleCannotBeMixedCondition = () => {
    if (!isEmptyArray(selectedVouchers)) {
      setMessage('this voucher cannot be mixed ');
      handleOpenModal();
    }
    return isEmptyArray(selectedVouchers);
  };

  const handleOnlyOneTimeCondition = () => {
    const isSpesificVoucherSelected = props.selectedVoucher.find(
      (detail) => detail.voucherId === item.id
    );

    if (isSpesificVoucherSelected) {
      setMessage('this voucher can use only one time in one order');
      handleOpenModal();
    }
    return !isSpesificVoucherSelected || false;
  };

  const handleCanNotUseWithPromoItem = () => {
    setMessage('Can not use for product with promotion');
    handleOpenModal();
    return false;
  };

  const handleTermsAndConditions = (value) => {
    if (value?.validity?.canNotUseWithPromoItem) {
      const hasPromoItem = props?.basket?.details?.find((item) => {
        return (
          item.promotions &&
          item.promotions.length > 0 &&
          item.isPromotionApplied
        );
      });
      if (hasPromoItem) {
        return handleCanNotUseWithPromoItem();
      }
    }

    if (value?.appliedTo === 'CATEGORY') {
      return handleSpecificCategoryCondition();
    }

    if (value?.appliedTo === 'COLLECTION') {
      return handleSpecificCollectionCondition();
    }

    if (value?.appliedTo === 'PRODUCT') {
      return handleSpecificProductCondition();
    }

    if (value?.minPurchaseAmount) {
      return handleMinPurchaseAmountCondition();
    }

    if (value?.validity?.cannotBeMixed) {
      return handleCannotBeMixedCondition();
    }

    if (value?.validity?.canOnlyUseOneTime) {
      return handleOnlyOneTimeCondition();
    }

    return true;
  };

  const handleCapAmount = (value) => {
    if (item.capAmount && item.capAmount < value) {
      return item.capAmount;
    }
    return value;
  };

  const handleLowestPrice = ({ discount, appliedTo, appliedItems }) => {
    let pricesInBasket = [];
    switch (appliedTo) {
      case 'CATEGORY':
        pricesInBasket = getPricesByCategory(appliedItems);
        break;
      case 'COLLECTION':
        pricesInBasket = getPricesByCollection(appliedItems);
        break;
      case 'PRODUCT':
        pricesInBasket = getPricesByProduct(appliedItems);
        break;
      default:
        pricesInBasket = getPrices();
    }

    const lowestPriceInBasket = Math.min(...pricesInBasket);
    if (discount > lowestPriceInBasket) {
      return lowestPriceInBasket;
    }
    return discount;
  };
  const handleSpecificProducts = ({ appliedItems, value, type }) => {
    let result = 0;
    let prices = getPricesByProduct(appliedItems);
    if (item.applyToLowestItem) {
      const min = Math.min(...prices);
      prices = [min];
    }
    prices.forEach((price) => {
      const amount = calculateDisc({ price, value, type });
      result += amount;
    });

    return result;
  };

  const calculateDisc = ({ price, value, type }) => {
    switch (type) {
      case 'discPercentage':
        const discPercentage = (price * value) / 100;
        return handleCapAmount(discPercentage);
      case 'discAmount':
        return value;
      default:
        return 0;
    }
  };

  const handleSpecificCategories = ({ appliedItems, value, type }) => {
    let result = 0;
    let prices = getPricesByCategory(appliedItems);

    if (item.applyToLowestItem) {
      const min = Math.min(...prices);
      prices = [min];
    }

    prices.forEach((price) => {
      const amount = calculateDisc({ price, value, type });
      result += amount;
    });

    return result;
  };

  const handleSpecificCollections = ({ appliedItems, value, type }) => {
    let result = 0;
    let prices = getPricesByCollection(appliedItems);

    if (item.applyToLowestItem) {
      const min = Math.min(...prices);
      prices = [min];
    }

    prices.forEach((price) => {
      const amount = calculateDisc({ price, value, type });
      result += amount;
    });

    return result;
  };

  const handleDiscount = ({ type, value, appliedTo, appliedItems }) => {
    const price = props.totalPaymentAmount;
    let discount = calculateDisc({ price, value, type });

    if (item.applyToLowestItem) {
      const amount = handleLowestPrice({ discount, appliedTo, appliedItems });
      discount = amount;
    }

    if (!isEmptyArray(appliedItems) && appliedTo === 'PRODUCT') {
      const amount = handleSpecificProducts({ appliedItems, value, type });
      discount = amount;
    }

    if (!isEmptyArray(appliedItems) && appliedTo === 'CATEGORY') {
      const amount = handleSpecificCategories({ appliedItems, value, type });
      discount = amount;
    }

    if (!isEmptyArray(appliedItems) && appliedTo === 'COLLECTION') {
      const amount = handleSpecificCollections({ appliedItems, value, type });
      discount = amount;
    }

    return discount;
  };

  const handleSelectVoucher = async () => {
    props.dispatch(
      PaymentAction.setData(
        [
          ...props.selectedVoucher,
          {
            name: item.name,
            isVoucher: true,
            voucherId: item.id,
            paymentType: 'voucher',
            serialNumber: item.serialNumber,
            cannotBeMixed: item.validity?.cannotBeMixed,
            capAmount: item?.capAmount,
            applyToLowestItem: item?.applyToLowestItem,
          },
        ],
        'SELECT_VOUCHER'
      )
    );
    history.push('/payment');
  };

  const renderImageProduct = (item) => {
    if (item?.image) {
      return item.image;
    } else if (props?.color?.productPlaceholder) {
      return props.color.productPlaceholder;
    } else {
      return PicVoucherDefault;
    }
  };

  const renderDescription = () => {
    if (item?.voucherDesc) {
      return (
        <div style={styles.rootDescription}>
          <div style={styles.iconDescription}>
            <i className='fa fa-commenting-o' />
          </div>
          <Typography style={styles.typographyDescription}>
            {item?.voucherDesc}
          </Typography>
        </div>
      );
    }
    return <div style={styles.typographyDescription} />;
  };

  const renderExpiredDate = () => {
    return (
      <div style={styles.rootExpiryDate}>
        <AccessTimeIcon style={styles.iconExpiryDate} />
        <Typography style={styles.typographyExpiryDate}>
          Expired on {DateFormatter(item?.expiryDate)}
        </Typography>
      </div>
    );
  };

  const renderDiscountValue = () => {
    if (item.voucherType === 'discAmount') {
      return (
        <Typography style={styles.typographyDiscount}>
          Discount ${item?.voucherValue}
        </Typography>
      );
    }

    return (
      <Typography style={styles.typographyDiscount}>
        Discount {item?.voucherValue}%
      </Typography>
    );
  };

  const renderName = () => {
    return <Typography style={styles.typographyName}>{item?.name}</Typography>;
  };

  const renderQuantity = () => {
    return (
      <div style={styles.rootQuantity}>
        <Typography style={styles.typographyQuantity}>{quantity}x</Typography>
      </div>
    );
  };

  const renderVoucherWarningModal = () => {
    if (isOpenModal) {
      return (
        <MyVoucherWarningModal
          open={isOpenModal}
          handleClose={handleCloseModal}
          message={message}
        />
      );
    }
  };

  return (
    <>
      {renderVoucherWarningModal()}
      <Box component='div' sx={styles.root} onClick={handleSelectVoucher}>
        <div onClick={handleSelectVoucher} style={styles.rootBody}>
          <img
            style={styles.image}
            src={renderImageProduct(item)}
            alt={item?.name || ''}
            title={item?.name}
          />
        </div>
        <div style={styles.body}>
          {renderName()}
          {renderDescription()}
          {renderExpiredDate()}
          {renderDiscountValue()}
        </div>
        {renderQuantity()}
      </Box>
    </>
  );
};

Voucher.defaultProps = {
  quantity: 0,
  color: {},
  item: {},
  dispatch: null,
  selectedVoucher: [],
  basket: {},
  totalPaymentAmount: 0,
};

Voucher.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  dispatch: PropTypes.func,
  item: PropTypes.object,
  quantity: PropTypes.number,
  selectedVoucher: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  totalPaymentAmount: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
