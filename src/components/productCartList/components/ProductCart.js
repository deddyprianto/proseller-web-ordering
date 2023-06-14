import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import config from 'config';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

import { isEmptyArray } from 'helpers/CheckEmpty';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';

import ProductAddModal from 'components/ProductList/components/ProductAddModal';
import ProductCartRemoveModal from 'components/productCartList/components/ProductCartRemoveModal';
import {
  renderIconEdit,
  renderIconPromotion,
  renderIconInformation,
} from 'assets/iconsSvg/Icons';
import { ProductAction } from 'redux/actions/ProductAction';

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

const ProductCart = ({ item, ...props }) => {
  const [width] = useWindowSize();
  const dispatch = useDispatch();

  const basket = useSelector((state) => state.order.basket);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  const styles = {
    textPromotion: {
      fontSize: 12,
      color: color.primary,
      paddingLeft: '5px',
    },
    rootPrice: {
      display: 'flex',
    },
    imageSize: {
      height: 600 > width ? 75 : 150,
      width: 600 > width ? 75 : 150,
      minWidth: 600 > width ? 75 : 150,
      borderRadius: 5,
    },
    price: {
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: props.isDisable ? '#8A8D8E' : color.primary,
    },
    priceDiscount: {
      paddingRight: 10,
      paddingBottom: 6,
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      color: props.isDisable ? '#8A8D8E' : color.primary,
      textDecorationLine: 'line-through',
    },
  };

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const [productDetail, setProductDetail] = useState({});
  const [isLoading, setIsLoading] = useState([]);

  const handleOpenAddModal = async () => {
    if (!isOpenRemoveModal) {
      const temp = [...isLoading];
      temp[props.index] = true;
      setIsLoading(temp);
      const productById = await dispatch(
        ProductAction.getProductById(
          { outlet: basket?.outlet?.id },
          item?.product?.id?.split('_')[0]
        )
      );

      setProductDetail(productById);
      temp[props.index] = false;
      setIsLoading(temp);
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
      return item.product.defaultImageURL;
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
              {renderIconPromotion(color?.primary)}
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
          pointerEvents: props.isDisable && 'none',
        }}
      >
        {isOpenAddModal && (
          <ProductAddModal
            open={isOpenAddModal}
            width={width}
            handleClose={handleCloseAddModal}
            product={item.product}
            selectedProduct={item}
            productDetail={productDetail}
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
                backgroundColor: props.isDisable ? '#8A8D8E' : color.primary,
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
                            <div
                              style={{
                                display: 'flex',
                                marginTop: '5px',
                              }}
                            >
                              <div
                                style={{
                                  color: props.isDisable
                                    ? '#8A8D8E'
                                    : color.primary,
                                  fontWeight: 600,
                                  marginRight: '3px',
                                }}
                              >
                                {item?.quantity}x{' '}
                              </div>

                              <div
                                style={{
                                  color: props.isDisable
                                    ? '#8A8D8E'
                                    : color.primary,
                                  fontWeight: 500,
                                  fontSize: '12px',
                                }}
                              >
                                {item?.name}{' '}
                                <span style={{ fontWeight: 'bold' }}>{`(${
                                  !handleCurrency(item?.price)
                                    ? 'SGD 0'
                                    : handleCurrency(item?.price)
                                })`}</span>
                                {item.orderingStatus === 'UNAVAILABLE' && (
                                  <span
                                    style={{
                                      verticalAlign: '-webkit-baseline-middle',
                                      marginLeft: '2px',
                                    }}
                                  >
                                    {renderIconInformation('red', '17')}
                                  </span>
                                )}
                              </div>
                            </div>
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
            className={props.isDisable && fontStyleCustom.filter}
          />
        </div>
      </div>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '95%',
          marginTop: '10px',
          borderTop: `1px dashed ${
            props.isDisable ? '#8A8D8E' : color.primary
          }`,
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
              {(!props.isDisable || !isEmptyArray(item?.modifiers)) && (
                <Button
                  id='edit-item-button'
                  sx={{
                    width: '80px',
                    border: `1px solid ${color?.primary}`,
                    borderRadius: '10px',
                    padding: '5px 0px',
                    color: color?.primary,
                    textTransform: 'capitalize',
                    fontSize: '14px',
                  }}
                  onClick={() => {
                    handleOpenAddModal();
                  }}
                  disabled={isLoading[props.index]}
                  startIcon={
                    !isLoading[props.index] && renderIconEdit(color?.primary)
                  }
                >
                  {isLoading[props.index] ? (
                    <CircularProgress
                      size={25}
                      sx={{ color: color?.primary }}
                    />
                  ) : (
                    'Edit'
                  )}
                </Button>
              )}
              <div
                id='delete-item-button'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
                onClick={handleOpenRemoveModal}
              >
                <IconButton
                  style={{
                    color: color?.primary,
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                    margin: 0,
                    marginRight: '5px',
                  }}
                >
                  <DeleteIcon fontSize='large' />
                </IconButton>
                <p style={{ color: color.primary, margin: 0, padding: 0 }}>
                  Delete
                </p>
              </div>
            </div>
            <div style={{ color: color.primary }}>{renderPrice()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCart.defaultProps = {
  item: {},
};

ProductCart.propTypes = {
  item: PropTypes.object,
};

export default ProductCart;
