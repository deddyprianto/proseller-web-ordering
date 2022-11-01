/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import HeaderTrackOrderHistory from './HeaderTrackOrderHistory';
import style from './style/style.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconChecklis from '../../assets/images/checkIconTransparent.png';
import { useSelector, useDispatch } from 'react-redux';
import VectorDown from '../../assets/images/VectorDown.png';
import { useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import config from 'config';
import { CONSTANT } from 'helpers';

const renderGrandTotalForGuestCheckMode = ({
  history,
  color,
  handleCurrency,
  setOpenDrawerBottom,
  trackorderBasket,
  dispatch,
  resetBottomNav,
}) => {
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
          onClick={() => {
            dispatch({
              type: CONSTANT.RESET_BOTTOM_NAVIGATION,
              payload: 0,
            });
            history.push('/');
          }}
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

const renderCartProductAccordion = ({
  basket,
  color,
  handleCurrency,
  matches,
  expandAccordionProductList,
  setExpandAccordionProductList,
}) => {
  return (
    <div
      style={{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        marginTop: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Accordion
        sx={{ boxShadow: 'none' }}
        expanded={expandAccordionProductList}
        onClick={() =>
          setExpandAccordionProductList(!expandAccordionProductList)
        }
      >
        <AccordionSummary
          sx={{ padding: '0', margin: '0' }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ paddingRight: '1px', width: '25px', height: '25px' }}
            />
          }
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
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
              {basket?.trackorder?.data?.details.length} More Item
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, margin: 0 }}>
          {basket?.trackorder?.data?.details.map((item) => {
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

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

const renderTimeLineComponent = ({ i, item, color, matches, arrData }) => {
  console.log('dedd =>', item);
  const time = formatAMPM(new Date(item.date));
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 50px 1fr',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". . ."',
        width: matches ? '35vw' : '85vw',
        justifyItems: 'center',
      }}
    >
      <div style={{ width: '100%', textAlign: 'center', marginTop: '-5px' }}>
        <p className={style.title}>{time}</p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '20px',
            width: '16px',
            borderRadius: '20px',
            backgroundColor: i === 0 ? `${color.primary}70` : 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {i === 0 ? (
            <div
              style={{
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                backgroundColor: color.primary,
              }}
            />
          ) : (
            <img
              src={IconChecklis}
              style={{ backgroundColor: color.primary, borderRadius: '50%' }}
            />
          )}
        </div>
        <div
          style={{
            height: '100%',
            borderLeft:
              arrData.at(-1).status === item.status && arrData.length > 1
                ? 'none'
                : `1px dashed ${color.primary}`,
            marginBottom: arrData.length === 1 ? '10px' : '0px',
          }}
        />
      </div>

      <div style={{ width: '100%', marginTop: '-5px' }}>
        <p className={style.title2}>{item.status.split('_').join(' ')}</p>
        <p className={style.title}>{item.text}</p>
      </div>
    </div>
  );
};

const renderCardAccordion = ({
  matches,
  basket,
  color,
  expandAccordionTimeLine,
  setExpandAccordionTimeLine,
}) => {
  const sortArrTime = basket?.data?.orderTrackingHistory
    .slice(0)
    .reverse()
    .map((item) => item);
  console.log('dedd =>', sortArrTime);
  return (
    <div
      style={{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        marginTop: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Accordion
        sx={{ boxShadow: 'none' }}
        expanded={expandAccordionTimeLine}
        onClick={() => setExpandAccordionTimeLine(!expandAccordionTimeLine)}
      >
        <AccordionSummary
          sx={{ padding: 0, margin: 0 }}
          expandIcon={
            <ExpandMoreIcon
              sx={{ paddingRight: '3px', width: '25px', height: '25px' }}
            />
          }
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <div
            style={{
              width: matches ? '100%' : '88vw',
            }}
          >
            <p className={style.title2} style={{ paddingLeft: '10px' }}>
              Timeline
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, margin: 0 }}>
          {sortArrTime.map((item, i) =>
            renderTimeLineComponent({
              i: i,
              item: item,
              color: color,
              matches: matches,
              arrData: sortArrTime,
            })
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const renderNotifRef = (basket, color) => {
  return (
    <div
      style={{
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: `${color.primary}60`,
        marginTop: '20px',
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      <p style={{ margin: 0, padding: 0, fontSize: '14px' }}>Ref. No</p>
      <p style={{ margin: 0, padding: 0, fontWeight: 700, fontSize: '14px' }}>
        {basket?.data?.transactionRefNo}
      </p>
    </div>
  );
};

const renderCartProduct = (basket) => {
  return (
    <div
      style={{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        margin: '10px 0',
        padding: '25px 10px',
      }}
    >
      <p style={{ fontWeight: 700 }}>Ordering Details</p>
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
            <p className={style.title2}>Customer Detail</p>

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
          </>
        )}
      </div>

      {basket?.data?.orderingMode === 'DELIVERY' && (
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
      )}
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
        <p className={style.title}>
          {basket?.data?.status.split('_').join(' ')}
        </p>
      </div>
    </div>
  );
};

const OrderTrackHistory = () => {
  const dispatch = useDispatch();
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const [expandAccordionTimeLine, setExpandAccordionTimeLine] = useState(true);
  const [expandAccordionProductList, setExpandAccordionProductList] =
    useState(true);
  const companyInfo = useSelector((state) => state.masterdata);
  const history = useHistory();
  const basket = useSelector((state) => state.guestCheckoutCart);
  const color = useSelector((state) => state.theme.color);
  const matches = useMediaQuery('(min-width:1200px)');
  const resetBottomNav = useSelector(
    (state) => state.guestCheckoutCart.resetBottomNav
  );
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
  const handleSubtotalForGuestCheckout = () => {
    if (basket?.trackorder?.data?.totalDiscountAmount !== 0) {
      const subTotalAfterDiscount =
        basket?.trackorder?.data?.totalGrossAmount -
        basket?.trackorder.tdata?.otalDiscountAmount;
      return subTotalAfterDiscount;
    }
    return basket?.trackorder?.data?.totalGrossAmount;
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
          {basket?.trackorder?.data?.provider?.deliveryFee !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Total
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(basket?.trackorder?.data?.totalGrossAmount)}
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
          {basket?.trackorder?.data?.orderingMode === 'DELIVERY' && (
            <>
              {basket?.trackorder?.data?.provider?.deliveryFee !== 0 && (
                <div style={styles.rootSubTotalItem}>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    Delivery Cost
                  </Typography>
                  <Typography className={style.myFont} style={styles.subTotal}>
                    {handleCurrency(
                      basket?.trackorder?.data?.provider?.deliveryFee
                    )}
                  </Typography>
                </div>
              )}
              {basket?.trackorder?.data?.provider?.deliveryFee === 0 &&
              basket?.trackorder?.data?.orderingMode === 'DELIVERY' ? (
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
          {basket?.trackorder?.data?.exclusiveTax !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Tax
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(basket?.trackorder?.data?.exclusiveTax)}
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
          {basket?.trackorder?.data?.totalDiscountAmount !== 0 && (
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
                  {handleCurrency(
                    basket?.trackorder?.data?.totalDiscountAmount
                  )}
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
          {basket?.trackorder?.data?.totalSurchargeAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography className={style.myFont} style={styles.subTotal}>
                  Surcharge
                </Typography>
                <Typography className={style.myFont} style={styles.subTotal}>
                  {handleCurrency(
                    basket?.trackorder?.data?.totalSurchargeAmount
                  )}
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
              {handleCurrency(basket?.trackorder?.data?.totalNettAmount)}
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
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '80px 1fr 70px',
          gap: '0px 0px',
          height: matches ? '100vh' : '100vh',
          width: matches ? '40%' : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      >
        <HeaderTrackOrderHistory matches={matches} />

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
            overflowY: 'auto',
          }}
        >
          {renderNotifRef(basket?.trackorder, color)}
          {renderCartProduct(basket?.trackorder)}
          {renderCardAccordion({
            matches: matches,
            basket: basket?.trackorder,
            color: color,
            expandAccordionTimeLine: expandAccordionTimeLine,
            setExpandAccordionTimeLine: setExpandAccordionTimeLine,
          })}
          {renderCartProductAccordion({
            basket: basket,
            color: color,
            handleCurrency: handleCurrency,
            matches: matches,
            expandAccordionProductList: expandAccordionProductList,
            setExpandAccordionProductList: setExpandAccordionProductList,
          })}
        </div>
        <div style={{ backgroundColor: 'white' }}>
          {renderGrandTotalForGuestCheckMode({
            history: history,
            color: color,
            handleCurrency: handleCurrency,
            setOpenDrawerBottom: setOpenDrawerBottom,
            trackorderBasket: basket?.trackorder,
            dispatch: dispatch,
            resetBottomNav: resetBottomNav,
          })}
        </div>
      </div>
      <Drawer
        anchor='bottom'
        open={openDrawerBottom}
        onClose={() => setOpenDrawerBottom((prev) => !prev)}
      >
        {renderSubtotalForGuestCheckMode()}
      </Drawer>
    </div>
  );
};

export default OrderTrackHistory;
