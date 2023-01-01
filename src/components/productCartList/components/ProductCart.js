import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import config from 'config';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import { isEmptyArray } from 'helpers/CheckEmpty';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';

import ProductAddModal from 'components/ProductList/components/ProductAddModal';
import ProductCartRemoveModal from 'components/productCartList/components/ProductCartRemoveModal';

import TagPromotion from 'assets/images/Tag.png';

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
      paddingLeft: '5px',
    },
    rootProductCart: {
      position: 'relative',
      opacity: item.orderingStatus === 'UNAVAILABLE' ? 0.4 : 1,
      pointerEvents: item.orderingStatus === 'UNAVAILABLE' && 'none',
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
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: props.color.primary,
    },
    priceDiscount: {
      paddingRight: 10,
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

  const renderIconPromotion = () => {
    return (
      <svg
        width={16}
        height={16}
        viewBox='0 0 218 218'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          d='M113.543 10.9749C115.308 10.9749 117.005 11.8333 118.251 13.3539L206.685 121.239C208.52 123.937 209.363 127.273 209.04 130.743C208.775 133.612 207.823 136.249 205.881 138.995L152.497 203.202C150.443 205.699 147.691 207.098 144.826 207.101C142.118 207.101 139.852 205.9 137.037 203.202L135.369 201.547L144.6 189.995L188.125 137.696C189.773 135.317 190.588 132.472 190.588 129.149C190.634 127.65 190.417 126.157 189.951 124.776C189.485 123.394 188.781 122.157 187.89 121.154L107.353 23.3478C103.468 18.8107 99.4559 15.6102 95.3261 13.7463C93.0137 12.7188 90.6385 11.9273 88.2239 11.3796L86.9388 11.0976C86.5955 11.0117 86.5857 10.9872 87.0075 10.9749H113.543ZM79.7876 10.9014C81.5533 10.9014 83.2504 11.7597 84.4962 13.2803L172.93 121.166C174.755 123.864 175.608 127.187 175.285 130.657C175.02 133.526 174.068 136.175 172.126 138.91L118.732 203.116C116.679 205.618 113.928 207.021 111.061 207.028C108.363 207.028 105.842 205.826 103.036 203.128L14.9261 98.7745C14.2949 98.0353 13.791 97.143 13.4452 96.152C13.0994 95.161 12.919 94.0922 12.9151 93.0111V27.5538C12.817 23.4582 13.6607 19.7181 15.5637 16.6402C17.8199 13.0105 21.2337 11.1957 25.6579 10.9014H79.7876ZM56.5075 43.6014C47.875 43.6014 38.2714 51.9072 38.2714 62.4407C38.2714 72.9619 47.875 80.62 56.5075 80.62C65.14 80.62 74.2091 72.9619 74.2091 62.4407C74.2091 51.9072 65.14 43.6014 56.5075 43.6014Z'
          fill={props.color.primary}
        />
      </svg>
    );
  };

  const renderPromotion = () => {
    if (!isEmptyArray(item.promotions)) {
      const promotions = item.promotions.map((promotion) => {
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gridTemplateRows: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
              paddingBottom: '5px',
            }}
            key={promotion}
          >
            <div
              style={{
                display: 'flex',
                margin: 'auto',
              }}
            >
              {renderIconPromotion()}
            </div>
            <Typography style={styles.textPromotion}>
              {promotion.name}
            </Typography>
          </div>
        );
      });
      return promotions;
    }
  };

  const renderNotes = () => {
    if (item.remark) {
      return (
        <table>
          <tr>
            <td
              style={{
                textAlign: 'left',
                width: '100%',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                padding: 0,
                margin: 0,
                paddingTop: 10,
                fontSize: 12,
              }}
            >
              Note: {item.remark}
            </td>
          </tr>
        </table>
      );
    }
  };

  const renderIconEdit = () => {
    return (
      <svg
        width='15'
        height='15'
        viewBox='0 0 129 129'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M91.072 16.8123C92.4728 15.4116 94.1357 14.3004 95.9659 13.5423C97.7961 12.7842 99.7577 12.394 101.739 12.394C103.72 12.394 105.681 12.7842 107.511 13.5423C109.342 14.3004 111.005 15.4116 112.405 16.8123C113.806 18.2131 114.917 19.876 115.675 21.7062C116.433 23.5364 116.824 25.498 116.824 27.479C116.824 29.46 116.433 31.4216 115.675 33.2517C114.917 35.0819 113.806 36.7449 112.405 38.1457L40.4054 110.146L11.072 118.146L19.072 88.8123L91.072 16.8123Z'
          stroke='white'
          strokeWidth='10.6824'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill={props.color.primary}
        />
      </svg>
    );
  };

  const renderPrice = () => {
    if (item?.totalDiscAmount !== 0) {
      return (
        <div style={styles.rootPrice}>
          <Typography style={styles.priceDiscount}>
            {handleCurrency(item?.grossAmount)}
          </Typography>
          <Typography style={styles.price}>
            {!handleCurrency(item?.amountAfterDisc)
              ? 'SGD 0.00'
              : handleCurrency(item?.amountAfterDisc)}
          </Typography>
        </div>
      );
    }
    return (
      <div style={styles.rootPrice}>
        <Typography style={styles.price}>
          {handleCurrency(item?.grossAmount)}
        </Typography>
      </div>
    );
  };

  return (
    <div
      style={{
        opacity: props.isDisable ? 0.5 : 1,
        pointerEvents: props.isDisable && 'none',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        marginTop: '10px',
        marginBottom: '10px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      <div
        style={{
          maxWidth: 'min(1280px, 100% - 20px)',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'grid',
          gridTemplateColumns: '1.6fr 0.4fr',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridTemplateAreas: '". ."',
        }}
      >
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
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '8px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: props.color.primary,
                borderRadius: '5px',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px',
              }}
            >
              {item.quantity}x
            </div>

            <div
              style={{
                fontWeight: 'bold',
                marginLeft: '5px',
                fontSize: '14px',
                lineHeight: 1.4,
              }}
            >
              {item?.product.name} ({handleCurrency(item.product.retailPrice)})
            </div>
          </div>
          <ul
            style={{
              color: '#8A8D8E',
              fontSize: '13px',
              padding: 0,
              margin: 0,
              listStyle: 'none',
            }}
          >
            <li style={{ marginTop: '10px' }}>{renderPromotion()}</li>
            {!isEmptyArray(item?.modifiers) && (
              <React.Fragment>
                <hr style={{ opacity: 0.5, marginTop: '10px' }} />
                <li>
                  Add-On:
                  {item?.modifiers?.map((items) => {
                    return items?.modifier?.details.map((item) => {
                      return (
                        <ul key={item?.name} style={{ paddingLeft: '10px' }}>
                          <li>
                            <span
                              style={{
                                color: props.color.primary,
                                fontWeight: 600,
                              }}
                            >
                              {item?.quantity}x{' '}
                            </span>
                            {item?.name}{' '}
                            <span
                              style={{
                                color: props.color.primary,
                                fontWeight: 500,
                                fontSize: '12px',
                                fontStyle: 'italic',
                              }}
                            >
                              +{handleCurrency(item?.price)}
                            </span>
                          </li>
                        </ul>
                      );
                    });
                  })}
                </li>
              </React.Fragment>
            )}
            {item?.remark && (
              <li>
                <table>
                  <tr>
                    <td
                      className={fontStyleCustom.title}
                      style={{
                        textAlign: 'left',
                        width: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Notes: </span>
                      {item?.remark}
                    </td>
                  </tr>
                </table>
              </li>
            )}
          </ul>
        </div>
        <div>
          <img
            style={styles.imageSize}
            src={renderImageProduct(item)}
            alt={item?.product.name || ''}
            title={item?.product.name}
          />
        </div>
      </div>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '95%',
          marginTop: '10px',
          borderTop: `1px dashed ${props.color.primary}`,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              <Button
                sx={{
                  width: '80px',
                  border: `1px solid ${props.color.primary}`,
                  borderRadius: '10px',
                  color: props.color.primary,
                }}
                onClick={() => {
                  handleOpenAddModal();
                }}
                startIcon={renderIconEdit()}
              >
                Edit
              </Button>
              <IconButton
                onClick={handleOpenRemoveModal}
                style={{
                  color: props.color.primary,
                }}
              >
                <DeleteIcon fontSize='large' />
              </IconButton>
            </div>
            <div style={{ color: props.color.primary }}>{renderPrice()}</div>
          </div>
        </div>
      </div>
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
