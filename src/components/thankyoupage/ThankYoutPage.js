/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import style from './style/style.module.css';
import IconCheck from '../../assets/images/checkThankyou.png';
import IconCheckClipBoard from '../../assets/images/icon-check.png';
import IconCopy from '../../assets/images/copy.png';
import { useSelector, useDispatch } from 'react-redux';
import VectorDown from '../../assets/images/VectorDown.png';
import { useHistory } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation } from 'react-router-dom';
import { OrderAction } from 'redux/actions/OrderAction';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import config from 'config';
import Drawer from '@mui/material/Drawer';
import Confetti from 'react-confetti';

const renderGrandTotalForGuestCheckMode = (
  history,
  color,
  handleCurrency,
  setOpenDrawerBottom,
  trackorderBasket
) => {
  return (
    <div
      style={{
        maxWidth: 'min(1280px, 100% - 40px)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div>
          <p
            style={{ fontWeight: 500, fontSize: '16px', margin: 0, padding: 0 }}
          >
            Grand Total
          </p>
          <div
            onClick={() => setOpenDrawerBottom(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontWeight: 500,
                fontSize: '16px',
                margin: 0,
                padding: 0,
              }}
            >
              {handleCurrency(trackorderBasket?.data?.totalNettAmount)}
            </p>
            <div style={{ marginLeft: '10px', marginTop: '7px' }}>
              <img src={VectorDown} style={{ marginBottom: '5px' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => history.push('/')}
          style={{
            backgroundColor: color.primary,
            width: '80%',
            borderRadius: '10px',
            padding: '10px 0',
            color: 'white',
          }}
        >
          Back To Menu
        </button>
      </div>
    </div>
  );
};

const renderHeaderPayment = () => {
  return (
    <div
      style={{
        width: '100%',
        marginTop: '100px',
      }}
    >
      <p
        style={{
          textAlign: 'center',
          marginTop: '30%',
          fontWeight: 700,
          fontSize: '16px',
        }}
      >
        Payment
      </p>
    </div>
  );
};
const renderStatusCheck = (
  copyToClipboard,
  setCopyToClipboard,
  setShowModalIfCopied,
  showModalIfCopied,
  color,
  basket
) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
        marginTop: '100px',
      }}
    >
      <div
        style={{
          backgroundColor: color.primary,
          width: '115px',
          height: '115px',
          borderRadius: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={IconCheck} />
      </div>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '16px' }}>
          Thank you! Your order has been placed!
        </p>
        <p style={{ color: color.font, fontWeight: 500, fontSize: '14px' }}>
          Ref No.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            style={{
              color: color.primary,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '20px',
              margin: 0,
              padding: 0,
            }}
          >
            {basket?.data?.transactionRefNo}
          </p>
          <div style={{ marginLeft: '10px' }}>
            <CopyToClipboard
              text={basket?.data?.transactionRefNo}
              onCopy={(text, result) => {
                setCopyToClipboard(text);
                setShowModalIfCopied(result);
              }}
            >
              <img src={IconCopy} />
            </CopyToClipboard>
          </div>
        </div>
        <div style={{ height: '30px', marginTop: '3px' }}>
          {showModalIfCopied && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div>
                <img
                  src={IconCheckClipBoard}
                  width={20}
                  height={20}
                  style={{ marginRight: '5px' }}
                />
              </div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  margin: 0,
                  padding: 0,
                  color: 'green',
                }}
              >
                Ref No has been copied
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderCartProduct = (basket) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        margin: '10px 0',
        padding: '10px',
      }}
    >
      <p style={{ fontWeight: 700 }}>Ordering Detail</p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className={style.title2}>Ordering Type</p>
        <p className={style.title}>{basket?.data?.orderingMode}</p>
      </div>
      <div
        style={{
          marginTop: '20px',
          width: '100%',
        }}
      >
        {basket?.data?.orderingMode === 'DELIVERY' && (
          <>
            <p className={style.title2}>Delivery Address</p>
            <table>
              <tr>
                <td style={{ padding: 0, margin: 0 }} className={style.title}>
                  {basket?.data?.deliveryAddress?.name}
                  <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                    |
                  </span>
                  {basket?.data?.deliveryAddress?.phoneNo}, <br />
                  {basket?.data?.deliveryAddress?.email}
                </td>
              </tr>
              <tr>
                <td
                  className={style.title}
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
                  {basket?.data?.deliveryAddress?.address ||
                    basket?.data?.deliveryAddress?.addressName}
                </td>
              </tr>
              <tr>
                <td style={{ padding: 0, margin: 0 }} className={style.title}>
                  {basket?.data?.deliveryAddress?.unitNo},
                  {basket?.data?.deliveryAddress?.postalCode}
                </td>
              </tr>
            </table>
            <div
              style={{
                margin: '20px 0 0 0',
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p className={style.title2}>Delivery Provider</p>
              <p className={style.title}>{basket?.data?.provider.name}</p>
            </div>
          </>
        )}
      </div>
      {basket?.data?.orderingMode === 'PICKUP' && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#B7B7B7' }}>
            Outlet Address
          </div>
          <div
            style={{ color: '#B7B7B7', fontSize: '14px', fontWeight: 500 }}
          ></div>
        </div>
      )}
      <div
        style={{
          margin: '20px 0 0 0',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className={style.title2}>Date & Time</p>
        <p className={style.title}>
          {basket?.data?.orderActionDate} at {basket?.data?.orderActionTime}
        </p>
      </div>
      <div
        style={{
          margin: '20px 0 0 0',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className={style.title2}>Order Status</p>
        <p className={style.title}>{basket?.data?.status}</p>
      </div>
    </div>
  );
};
const renderImageProduct = (item, color) => {
  if (item.product.defaultImageURL) {
    return item.product.defaultImageURL;
  } else {
    if (item.defaultImageURL) {
      return item.defaultImageURL;
    }
    if (color.productPlaceholder) {
      return color.productPlaceholder;
    }
    return config.image_placeholder;
  }
};

const renderPrice = (item, handleCurrency) => {
  if (item?.totalDiscAmount !== 0) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Typography style={{ color: '#4386A1', fontSize: '16px' }}>
          {handleCurrency(item?.totalDiscAmount)}
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
            textDecorationLine: 'line-through',
            marginRight: '10px',
            color: '#8A8D8E',
          }}
        >
          {handleCurrency(item?.grossAmount)}
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Typography style={{ color: '#4386A1', fontSize: '16px' }}>
        {handleCurrency(item?.grossAmount)}
      </Typography>
    </div>
  );
};

const renderCartProductList = (
  basket,
  handleCurrency,
  color,
  setExpandAccordion,
  expandAccordion,
  matches
) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        marginTop: '10px',
        marginBottom: '10px',
        padding: '0 5px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Accordion
        sx={{ boxShadow: 'none' }}
        expanded={expandAccordion}
        onClick={() => setExpandAccordion(!expandAccordion)}
      >
        <AccordionSummary
          sx={{ padding: '0', margin: '0' }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <div
            style={{
              width: matches ? '100%' : '90vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              style={{
                fontSize: '14px',
                color: 'black',
                fontWeight: 700,
                overflowWrap: 'break-word',
                width: '50%',
                paddingLeft: '10px',
              }}
              className={style.myFont}
            >
              Items
            </Typography>
            <Typography
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#8A8D8E',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {basket?.data?.details.length} More Item
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, margin: 0 }}>
          {basket?.data?.details?.map((item) => {
            return (
              <div
                key={item?.productID}
                className={style.myFont}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: '8px',
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
                          backgroundColor: color.primary,
                          borderRadius: '5px',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {item?.quantity}x
                      </div>
                      <div
                        style={{
                          fontWeight: 'bold',
                          marginLeft: '5px',
                          fontSize: '14px',
                        }}
                      >
                        {item?.product.name}
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
                      <li style={{ marginTop: '10px' }}>
                        {item?.product.name}
                      </li>
                      <hr style={{ opacity: 0.5 }} />
                      <li>{item?.product.categoryName}</li>
                      <hr style={{ opacity: 0.5 }} />
                      <li>
                        Add-On:
                        {item?.modifiers?.map((items) => {
                          return items?.modifier?.details.map((item) => {
                            return (
                              <ul key={item?.name}>
                                <li>
                                  <span
                                    style={{
                                      color: color.primary,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.quantity}x{' '}
                                  </span>
                                  {item?.name}{' '}
                                  <span
                                    style={{
                                      color: color.primary,
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
                    </ul>
                  </div>
                  <div>
                    <img src={renderImageProduct(item, color)} />
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '76%',
                      marginTop: '10px',
                      borderTop: '1px dashed #4386A1',
                      marginBottom: '10px',
                      marginLeft: '10px',
                    }}
                  />
                </div>
                <table>
                  <tr>
                    <td
                      className={style.title}
                      style={{
                        textAlign: 'left',
                        width: '85%',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        padding: 0,
                        paddingLeft: '10px',
                        margin: 0,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Notes: </span>
                      {item?.remark}
                    </td>
                  </tr>
                </table>
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const ThankYoutPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [expandAccordion, setExpandAccordion] = useState(true);
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  let location = useLocation();
  const matches = useMediaQuery('(min-width:1200px)');
  const [copyToClipboard, setCopyToClipboard] = useState('');
  const [showModalIfCopied, setShowModalIfCopied] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const basket = useSelector((state) => state.guestCheckoutCart);
  const trackorderBasket = useSelector(
    (state) => state.guestCheckoutCart.trackorder
  );
  const color = useSelector((state) => state.theme.color);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const companyInfo = useSelector((state) => state.masterdata);
  const history = useHistory();

  useEffect(() => {
    const fetchDataTrackOrder = async () => {
      if (location.search.split('=')[1]) {
        setIsLoading(true);
        await dispatch(
          OrderAction.getTrackOrder(location.search.split('=')[1])
        );
        setIsLoading(false);
      }
    };
    fetchDataTrackOrder();
  }, []);

  useEffect(() => {
    const cleanUp = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
    return () => {
      clearTimeout(cleanUp);
    };
  }, []);

  const styles = {
    rootSubTotalItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    },
    subTotal: {
      fontWeight: 500,
      color: 'black',
      fontSize: 14,
    },
  };

  useEffect(() => {
    const clear = setInterval(() => {
      setShowModalIfCopied(false);
    }, 2000);

    return () => {
      clearInterval(clear);
    };
  }, [showModalIfCopied]);

  const handleCurrency = (price) => {
    if (companyInfo?.companyInfo?.data) {
      const result = price?.toLocaleString(
        companyInfo?.companyInfo?.data?.currency?.locale,
        {
          style: 'currency',
          currency: companyInfo?.companyInfo?.data?.currency?.code,
        }
      );
      return result;
    }
  };
  const handleSubtotalForGuestCheckout = () => {
    if (trackorderBasket?.data?.totalDiscountAmount !== 0) {
      const subTotalAfterDiscount =
        trackorderBasket?.data?.totalGrossAmount -
        trackorderBasket.tdata?.otalDiscountAmount;
      return subTotalAfterDiscount;
    }
    return trackorderBasket?.data?.totalGrossAmount;
  };

  const renderSubtotalForGuestCheckMode = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0px',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}>
            Total Details
          </div>
          <div
            onClick={() => setOpenDrawerBottom(false)}
            style={{ marginRight: '10px', fontWeight: 700 }}
          >
            X
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <hr
            style={{
              backgroundColor: '#D6D6D6',
              padding: 0,
              margin: 0,
              opacity: 0.5,
            }}
          />
        </div>
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            marginBottom: '10px',
            padding: '10px',
          }}
        >
          {trackorderBasket?.data?.provider?.deliveryFee !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Total
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(trackorderBasket?.data?.totalGrossAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {trackorderBasket?.data?.orderingMode === 'DELIVERY' && (
            <>
              {trackorderBasket?.data?.provider?.deliveryFee !== 0 && (
                <div style={styles.rootSubTotalItem}>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    Delivery Cost
                  </Typography>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    {handleCurrency(
                      trackorderBasket?.data?.provider?.deliveryFee
                    )}
                  </Typography>
                </div>
              )}
              {trackorderBasket?.data?.provider?.deliveryFee === 0 &&
              trackorderBasket?.data?.orderingMode === 'DELIVERY' ? (
                <div style={styles.rootSubTotalItem}>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    Delivery Fee
                  </Typography>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    Free
                  </Typography>
                </div>
              ) : null}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {trackorderBasket?.data?.exclusiveTax !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Tax
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(trackorderBasket?.data?.exclusiveTax)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {trackorderBasket?.data?.totalDiscountAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={style.myFont}
                  style={styles.totalDiscount}
                >
                  Discount
                </Typography>
                <Typography
                  className={style.myFont}
                  style={styles.totalDiscount}
                >
                  -{' '}
                  {handleCurrency(trackorderBasket?.data?.totalDiscountAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {trackorderBasket?.data?.totalSurchargeAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Surcharge
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(trackorderBasket?.data?.totalSurchargeAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontWeight: 500,
                fontSize: '16px',
                margin: 0,
                padding: '0px 0px 0px 10px',
              }}
            >
              Grand Total
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: '16px',
                margin: 0,
                padding: 0,
                paddingRight: '10px',
                color: color.primary,
              }}
            >
              {handleCurrency(trackorderBasket?.data?.totalNettAmount)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100vw' }}>
      <div
        style={{
          width: matches ? '40%' : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr 70px',
            gap: '0px 0px',
            height: '100vh',
            width: '100%',
            rowGap: '10px',
          }}
        >
          <div
            style={{
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              overflowY: 'auto',
              backgroundColor: 'white',
              padding: '0 10px',
            }}
          >
            {renderStatusCheck(
              copyToClipboard,
              setCopyToClipboard,
              setShowModalIfCopied,
              showModalIfCopied,
              color,
              basket?.trackorder
            )}
            {renderCartProduct(basket?.trackorder, color)}

            {renderCartProductList(
              basket?.trackorder,
              handleCurrency,
              color,
              setExpandAccordion,
              expandAccordion,
              matches
            )}
          </div>

          <div
            style={{
              backgroundColor: 'white',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              width: '100%',
            }}
          >
            {renderGrandTotalForGuestCheckMode(
              history,
              color,
              handleCurrency,
              setOpenDrawerBottom,
              basket?.trackorder
            )}
          </div>
        </div>
        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
              <DialogTitle
                id='alert-dialog-title'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <p style={{ fontSize: '16px', fontWeight: 700 }}>
                  Order Placed
                </p>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  <p className={style.title} style={{ textAlign: 'center' }}>
                    Your order has been placed. Please copy the Ref No. below to
                    tracking your order
                  </p>
                </DialogContentText>
              </DialogContent>
              <DialogActions
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <p
                      style={{
                        color: color.primary,
                        fontWeight: 700,
                        fontSize: '16px',
                        margin: 0,
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {basket?.trackorder?.data?.transactionRefNo}
                    </p>
                    <div style={{ marginLeft: '10px' }}>
                      <CopyToClipboard
                        text={basket?.trackorder?.data?.transactionRefNo}
                        onCopy={(text, result) => {
                          setCopyToClipboard(text);
                          setShowModalIfCopied(result);
                        }}
                      >
                        <img src={IconCopy} />
                      </CopyToClipboard>
                    </div>
                  </div>
                  {showModalIfCopied && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '5px',
                      }}
                    >
                      <div>
                        <img
                          src={IconCheckClipBoard}
                          width={20}
                          height={20}
                          style={{ marginRight: '5px' }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          margin: 0,
                          padding: 0,
                          color: 'green',
                        }}
                      >
                        Ref No has been copied
                      </p>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <div
                    onClick={() => setShowModal(false)}
                    style={{
                      marginTop: '20px',
                      backgroundColor: color.primary,
                      borderRadius: '10px',
                      width: '97%',
                      padding: '5px 0',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    Done
                  </div>
                </div>
              </DialogActions>
            </LoadingOverlayCustom>
          </Dialog>
        )}
        <Drawer
          anchor='bottom'
          open={openDrawerBottom}
          onClose={() => setOpenDrawerBottom((prev) => !prev)}
        >
          {renderSubtotalForGuestCheckMode()}
        </Drawer>
        {showConfetti && <Confetti />}
      </div>
    </div>
  );
};

export default ThankYoutPage;
