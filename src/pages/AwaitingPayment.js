import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import screen from 'hooks/useWindowSize';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import {
  changeFormatDate,
  downloadImage,
  formatDateWithTime,
  getCurrencyHelper,
} from 'helpers/awaitingPayment';
import CountDownTime from 'components/awaitingpayment/CountDownTime';
import commonAlert from 'components/template/commonAlert';
import { isEmptyArray } from 'helpers/CheckEmpty';
import Paper from '@mui/material/Paper';
import { OrderAction } from 'redux/actions/OrderAction';

const RenderHeader = ({ color, history, label, route }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '30px 1fr 30px',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". . ."',
        cursor: 'pointer',
        margin: '10px 0',
        alignItems: 'center',
      }}
    >
      <ArrowBackIosIcon
        sx={{
          color: color.primary,
          justifySelf: 'center',
        }}
        fontSize='large'
        onClick={() => history.push('/')}
      />
      <div
        style={{
          fontWeight: 500,
          fontSize: '16px',
          color: color.primary,
          justifySelf: 'center',
        }}
      >
        PAYNOW
      </div>
    </div>
  );
};

export const renderBoxItem = ({
  labelRow1,
  row1,
  color,
  fontWeight,
  labelRow2,
  row2,
  labelRow3,
  row3,
  labelRow4,
  row4,
}) => {
  return (
    <div
      style={{
        marginTop: '16px',
        padding: '16px',
        border: '2px solid var(--grey-scale-color-grey-scale-3, #D6D6D6)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {labelRow1}
        </div>
        <div style={{ color, fontWeight: 700, fontSize: '14px' }}>{row1}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {labelRow2}
        </div>
        <div style={{ color, fontWeight: 700, fontSize: '14px' }}>{row2}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {labelRow3}
        </div>
        <div style={{ color, fontWeight, fontSize: '14px' }}>{row3}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {labelRow4}
        </div>

        <div style={{ color, fontWeight, fontSize: '14px' }}>
          <div>{row4?.date}</div>
          <div>{row4?.time}</div>
        </div>
      </div>
    </div>
  );
};

export const RenderPaymentMethod = ({ label, data, companyInfo, color }) => {
  if (!isEmptyArray(data)) {
    return (
      <div
        style={{
          marginTop: '16px',
          padding: '16px',
          border: '2px solid var(--grey-scale-color-grey-scale-3, #D6D6D6)',
          borderRadius: '8px',
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              color: 'var(--text-color-primary, #343A4A)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {label}
          </div>
          {data.map((paymentMethodItem) => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                key={paymentMethodItem}
              >
                <div
                  style={{
                    fontSize: '14px',
                    textTransform:
                      paymentMethodItem?.paymentType === 'PayNow'
                        ? 'uppercase'
                        : 'capitalize',
                    fontWeight: 700,
                    color: 'var(--text-color-primary, #343A4A)',
                  }}
                >
                  {paymentMethodItem?.paymentType === 'point' ||
                  paymentMethodItem?.paymentType === 'voucher'
                    ? paymentMethodItem?.paymentType + 's'
                    : paymentMethodItem?.paymentType === 'Store Value Card'
                    ? 'Stored Value Card'
                    : paymentMethodItem?.paymentType}
                </div>
                <div
                  style={{
                    color: color.primary,
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {getCurrencyHelper(
                    paymentMethodItem?.paymentAmount,
                    companyInfo
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export const RenderTotalMain = ({ companyInfo, paymentFomoPay, color }) => {
  const renderLabelDiscount = () => {
    if (
      paymentFomoPay.totalMembershipDiscountAmount === 0 &&
      paymentFomoPay.totalDiscountAmount === 0
    ) {
      return null;
    }
    if (
      paymentFomoPay.totalMembershipDiscountAmount ===
      paymentFomoPay.totalDiscountAmount
    ) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-color-primary, #343A4A)',
            }}
          >
            Membership Discount
          </div>
          <div
            style={{
              color: 'var(--semantic-color-success, #1A883C)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            -
            {getCurrencyHelper(
              paymentFomoPay?.totalMembershipDiscountAmount,
              companyInfo
            )}
          </div>
        </div>
      );
    } else if (
      paymentFomoPay.totalMembershipDiscountAmount === 0 &&
      paymentFomoPay.totalDiscountAmount > 0
    ) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-color-primary, #343A4A)',
            }}
          >
            Discount
          </div>
          <div
            style={{
              color: 'var(--semantic-color-success, #1A883C)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            -
            {getCurrencyHelper(
              paymentFomoPay?.totalDiscountAmount,
              companyInfo
            )}
          </div>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--text-color-primary, #343A4A)',
              }}
            >
              Discount
            </div>
            <div
              style={{
                color: 'var(--semantic-color-success, #1A883C)',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              -
              {getCurrencyHelper(
                paymentFomoPay?.totalDiscountAmount,
                companyInfo
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--text-color-primary, #343A4A)',
              }}
            >
              Membership Discount
            </div>
            <div
              style={{
                color: 'var(--semantic-color-success, #1A883C)',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              -
              {getCurrencyHelper(
                paymentFomoPay?.totalMembershipDiscountAmount,
                companyInfo
              )}
            </div>
          </div>
        </React.Fragment>
      );
    }
  };
  return (
    <div
      style={{
        marginTop: '16px',
        padding: '16px',
        border: '2px solid var(--grey-scale-color-grey-scale-3, #D6D6D6)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          Sub Total
        </div>
        <div
          style={{
            color: 'var(--text-color-primary, #343A4A)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {getCurrencyHelper(paymentFomoPay?.totalGrossAmount, companyInfo)}
        </div>
      </div>
      {renderLabelDiscount()}

      {paymentFomoPay?.totalSurchargeAmount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-color-primary, #343A4A)',
            }}
          >
            Surcharge
          </div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            {getCurrencyHelper(
              paymentFomoPay?.totalSurchargeAmount,
              companyInfo
            )}
          </div>
        </div>
      )}
      {paymentFomoPay?.deliveryFee > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-color-primary, #343A4A)',
            }}
          >
            Delivery Fee
          </div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            {getCurrencyHelper(paymentFomoPay?.deliveryFee, companyInfo)}
          </div>
        </div>
      )}

      <hr style={{ backgroundColor: '#D6D6D6', margin: '6px 0px' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '16px', color: 'black', fontWeight: 700 }}>
          TOTAL
        </div>
        <div
          style={{ color: color.primary, fontWeight: 700, fontSize: '14px' }}
        >
          {getCurrencyHelper(paymentFomoPay?.totalNettAmount, companyInfo)}
        </div>
      </div>
      {paymentFomoPay?.totalTaxAmount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              color: 'var(--text-color-tertiary, #B7B7B7)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Tax Amount
          </div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            {getCurrencyHelper(paymentFomoPay?.totalTaxAmount, companyInfo)}
          </div>
        </div>
      )}
    </div>
  );
};

const AwaitingPayment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const responsiveDesign = screen();
  const [isLoadingDownloadImage, setIsLoadingDownloadImage] = useState(false);
  const [idGuestCheckout, setIdGuestCheckout] = useState();
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const showMessageConfirm = useSelector(
    (state) => state.customer.showMessageConfirm
  );
  const paymentFomoPay = useSelector(
    (state) => state.payment.responseFomoPayPayment
  );

  const gadgetScreen = responsiveDesign.width < 980;
  const fontStyles = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    src: `url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap')`,
    marginTop: '50px',
    padding: '16px',
  };

  useEffect(() => {
    const idGuestCheckout = localStorage.getItem('idGuestCheckout');
    if (idGuestCheckout) {
      setIdGuestCheckout(idGuestCheckout);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (idGuestCheckout) {
        await dispatch(
          OrderAction.getCartGuestMode(`guest::${idGuestCheckout}`)
        );
      } else {
        await dispatch(OrderAction.getCart());
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (showMessageConfirm) {
      commonAlert({
        color: color.primary,
        content: paymentFomoPay?.message,
        title: 'Congratulations',
        onConfirm: dispatch({ type: 'SHOW_MESSAGE_CONFIRM', data: false }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMessageConfirm]);

  const buttonSeeDetail = () => {
    return (
      <div
        onClick={() => {
          history.push('/seeorderdetail');
          window.scrollTo(0, 0);
        }}
        style={{
          backgroundColor: color.primary,
          padding: '8px 16px',
          color: 'white',
          fontWeight: 500,
          fontSize: '14px',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: gadgetScreen < 500 ? 0 : '20px',
        }}
      >
        See Order Detail
      </div>
    );
  };

  const renderQrCode = ({
    paymentFomoPay,
    color,
    setIsLoadingDownloadImage,
    isLoadingDownloadImage,
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          width={256}
          height={256}
          alt='qrcode fomopay'
          src={paymentFomoPay?.action?.url}
        />
        <CountDownTime
          targetDate={paymentFomoPay?.action?.expiry}
          color={color}
        />
        <div
          onClick={() => {
            downloadImage(
              paymentFomoPay?.action?.url,
              'qrcode.jpg',
              setIsLoadingDownloadImage
            );
          }}
          style={{
            border: `1px solid ${color.primary}`,
            padding: '5px 16px',
            borderRadius: '8px',
            color: color.primary,
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '14px',
            width: '256px',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center' }}>
            {isLoadingDownloadImage
              ? 'Please wait...'
              : 'SAVE QR CODE TO GALLERY'}
          </div>
        </div>
      </div>
    );
  };

  const renderResponsiveDesign = () => {
    const changeFormatDateDefault = changeFormatDate(
      paymentFomoPay?.orderActionDate
    );
    if (gadgetScreen) {
      return (
        <div style={{ height: '80vh ', overflowY: 'auto' }}>
          <div
            style={{
              paddingBottom: 200,
            }}
          >
            <RenderHeader
              history={history}
              color={color}
              label='PAYNOW'
              route='/'
            />
            {renderQrCode({
              paymentFomoPay: paymentFomoPay,
              color: color,
              isLoadingDownloadImage: isLoadingDownloadImage,
              setIsLoadingDownloadImage: setIsLoadingDownloadImage,
            })}

            {renderBoxItem({
              labelRow1: 'Status Order',
              row1: paymentFomoPay?.status.split('_').join(' '),
              fontWeight: 700,
              color: color.primary,
            })}
            {renderBoxItem({
              labelRow1: 'Ref No.',
              row1: paymentFomoPay?.transactionRefNo,
              labelRow2: 'Queue No.',
              row2: paymentFomoPay?.queueNo,
              fontWeight: 700,
              color: 'black',
            })}
            {renderBoxItem({
              labelRow1: 'Outlet Name',
              row1: paymentFomoPay?.outlet?.name,
              labelRow2: 'Ordering Date',
              row2: formatDateWithTime(paymentFomoPay?.createdAt),
              fontWeight: 700,
              color: 'black',
            })}
            {paymentFomoPay?.orderingMode === 'DELIVERY' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                labelRow2: 'Delivery Address',
                row2: paymentFomoPay?.deliveryAddress?.addressName
                  ? paymentFomoPay?.deliveryAddress?.addressName
                  : paymentFomoPay?.deliveryAddress?.streetName,
                labelRow3: 'Delivery Provider',
                row3: paymentFomoPay?.deliveryProvider,
                labelRow4: 'Delivery  Date & Time',
                row4: {
                  date: changeFormatDateDefault,
                  time: paymentFomoPay?.orderActionTimeSlot,
                },
                color: 'black',
                fontWeight: 700,
              })}
            {paymentFomoPay?.orderingMode === 'TAKEAWAY' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                labelRow4: 'Pickup Date & Time',
                row4: {
                  date: changeFormatDateDefault,
                  time: paymentFomoPay?.orderActionTimeSlot,
                },
                color: 'black',
                fontWeight: 700,
              })}
            {paymentFomoPay?.orderingMode === 'DINEIN' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                fontWeight: 700,
                color: 'black',
              })}
            {paymentFomoPay?.orderingMode !== 'DELIVERY' &&
              paymentFomoPay?.orderingMode !== 'TAKEAWAY' &&
              paymentFomoPay?.orderingMode !== 'DINEIN' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                fontWeight: 700,
                color: 'black',
              })}
            <RenderPaymentMethod
              label='Payment Details'
              data={paymentFomoPay?.payments}
              color={color}
              companyInfo={companyInfo}
            />
            <RenderTotalMain
              color={color}
              paymentFomoPay={paymentFomoPay}
              companyInfo={companyInfo}
            />
          </div>
          <Paper
            variant='outlined'
            square={gadgetScreen}
            sx={
              gadgetScreen
                ? {
                    zIndex: '999',
                    width: '100%',
                    margin: 0,
                    bottom: responsiveDesign.height < 500 ? 0 : 70,
                    position: 'fixed',
                    left: 0,
                    borderTopRightRadius: '8px',
                    borderTopLeftRadius: '8px',
                    border: 'none',
                    outline: 'none',
                    padding: '5px',
                  }
                : {
                    padding: 0,
                    margin: 0,
                  }
            }
          >
            {buttonSeeDetail()}
          </Paper>
        </div>
      );
    } else {
      return (
        <div style={{ width: '100vw' }}>
          <div
            style={{
              marginTop: '10px',
              width: '45%',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.10);',
              overflowY: 'auto',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <RenderHeader
              color={color}
              label='PAYNOW'
              route='/'
              history={history}
            />
            {renderQrCode({
              paymentFomoPay: paymentFomoPay,
              color: color,
              isLoadingDownloadImage: isLoadingDownloadImage,
              setIsLoadingDownloadImage: setIsLoadingDownloadImage,
            })}
            {renderBoxItem({
              labelRow1: 'Status Order',
              row1: paymentFomoPay?.status,
              color: color.primary,
              fontWeight: 700,
            })}
            {renderBoxItem({
              labelRow1: 'Ref No.',
              row1: paymentFomoPay?.transactionRefNo,
              labelRow2: 'Queue No.',
              row2: paymentFomoPay?.queueNo,
              color: 'black',
              fontWeight: 700,
            })}
            {renderBoxItem({
              labelRow1: 'Outlet Name',
              row1: paymentFomoPay?.outlet?.name,
              labelRow2: 'Ordering Date',
              row2: formatDateWithTime(paymentFomoPay?.createdAt),
              color: 'black',
              fontWeight: 700,
            })}
            {paymentFomoPay?.orderingMode === 'TAKEAWAY' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                color: 'black',
                fontWeight: 700,
                labelRow4: 'Pickup Date & Time',
                row4: {
                  date: changeFormatDateDefault,
                  time: paymentFomoPay?.orderActionTimeSlot,
                },
              })}
            {paymentFomoPay?.orderingMode === 'DINEIN' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                color: 'black',
                fontWeight: 700,
              })}
            {paymentFomoPay?.orderingMode === 'DELIVERY' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                color: 'black',
                fontWeight: 700,
                labelRow2: 'Delivery Address',
                row2: paymentFomoPay?.deliveryAddress?.addressName
                  ? paymentFomoPay?.deliveryAddress?.addressName
                  : paymentFomoPay?.deliveryAddress?.streetName,
                labelRow3: 'Delivery Provider',
                row3: paymentFomoPay?.deliveryProvider,
                labelRow4: 'Delivery  Date & Time',
                row4: {
                  date: changeFormatDateDefault,
                  time: paymentFomoPay?.orderActionTimeSlot,
                },
              })}
            {paymentFomoPay?.orderingMode !== 'TAKEAWAY' &&
              paymentFomoPay?.orderingMode !== 'DINEIN' &&
              paymentFomoPay?.orderingMode !== 'DELIVERY' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                color: 'black',
                fontWeight: 700,
              })}
            <RenderPaymentMethod
              label='Payment Details'
              data={paymentFomoPay?.payments}
              color={color}
              companyInfo={companyInfo}
            />
            <RenderTotalMain
              color={color}
              paymentFomoPay={paymentFomoPay}
              companyInfo={companyInfo}
            />
            {buttonSeeDetail()}
          </div>
        </div>
      );
    }
  };
  return <div style={fontStyles}>{renderResponsiveDesign()}</div>;
};

export default AwaitingPayment;
