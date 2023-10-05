import React from 'react';
import { useSelector } from 'react-redux';
import screen from 'hooks/useWindowSize';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import CountDownTime from 'components/awaitingpayment/CountDownTime';
import { RenderTotalMain } from './AwaitingPayment';
import {
  changeFormatDate,
  downloadImage,
  formatDateWithTime,
  getCurrencyHelper,
} from 'helpers/awaitingPayment';
import { isEmptyArray, isEmptyData } from 'helpers/CheckEmpty';
import { renderIconPromotion } from 'assets/iconsSvg/Icons';

const SeeOrderDetail = () => {
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const paymentFomoPay = useSelector(
    (state) => state.payment.responseFomoPayPayment
  );
  const history = useHistory();
  const responsiveDesign = screen();

  const color = useSelector((state) => state.theme.color);
  const gadgetScreen = responsiveDesign.width < 980;

  const fontStyles = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    src: `url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap')`,
    marginTop: '70px',
  };

  const renderPromotion = ({ item, color }) => {
    if (item?.isPromotionApplied) {
      const promotions = item.promotions.map((promotion) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
            key={promotion}
          >
            {renderIconPromotion(color?.primary)}
            <div
              style={{
                width: '244px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: color.primary,
                  marginLeft: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}
              >
                {promotion?.promoDisplayName}
              </div>
            </div>
          </div>
        );
      });
      return promotions;
    }
  };

  const renderPrice = ({ item, color }) => {
    if (item?.totalDiscAmount !== 0) {
      return (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              paddingRight: 10,
              paddingBottom: 6,
              marginTop: 10,
              fontSize: 14,
              lineHeight: '17px',
              fontWeight: 500,
              color: 'black',
              textDecorationLine: 'line-through',
            }}
          >
            {getCurrencyHelper(item?.grossAmount, companyInfo)}
          </div>
          <div
            style={{
              paddingBottom: 6,
              marginTop: 10,
              fontSize: 14,
              lineHeight: '17px',
              fontWeight: 700,
              color: color,
            }}
          >
            {!getCurrencyHelper(item?.amountAfterDisc, companyInfo)
              ? 'SGD 0.00'
              : getCurrencyHelper(item?.amountAfterDisc, companyInfo)}
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            paddingBottom: 6,
            marginTop: 10,
            fontSize: 14,
            lineHeight: '17px',
            fontWeight: 700,
            color: color,
          }}
        >
          {getCurrencyHelper(item?.grossAmount, companyInfo)}
        </div>
      </div>
    );
  };

  const renderImageProduct = (item) => {
    if (!isEmptyData(item.imageFiles)) {
      return <img src={item.imageFiles[0]} alt='' />;
    } else {
      return (
        <div
          style={{
            backgroundColor: '#D9D9D9',
            borderRadius: '8px',
            width: '100%',
            height: '100px',
          }}
        />
      );
    }
  };
  const renderItemModifier = (modifier) => {
    return modifier?.modifier?.details.map((item) => {
      return (
        <div
          key={item}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            fontStyle: 'italic',
            fontSize: '14px',
            fontWeight: 400,
            color: 'var(--text-color-primary, #343A4A)',
          }}
        >
          <div>{item?.quantity}x </div>
          <div
            style={{
              margin: '0px 5px',
            }}
          >
            {item?.name}
          </div>
          <div>{getCurrencyHelper(item?.price, companyInfo)}</div>
        </div>
      );
    });
  };
  const renderProduct = (item) => {
    console.log('item =>', item);
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          gridTemplateRows: '1fr',
          gap: '0px 10px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". ."',
          marginTop: '16px',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {renderImageProduct([])}
        <div>
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-color-primary, #343A4A)',
            }}
          >
            {item.quantity}x {item.product.name} (
            {getCurrencyHelper(item.product.retailPrice, companyInfo)})
          </div>
          <div>
            {renderPromotion({ item: item.promotion, color: color.primary })}
          </div>
          {!isEmptyArray(item.modifiers) && (
            <>
              <div
                style={{
                  fontStyle: 'italic',
                  color: 'var(--text-color-primary, #343A4A)',
                }}
              >
                Add On
              </div>
              {item?.modifiers.map((modifier) => {
                return renderItemModifier(modifier);
              })}
            </>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {renderPrice({ item: item, color: color.primary })}
          </div>
        </div>
      </div>
    );
  };
  const renderNameOutlet = () => {
    return (
      <div
        style={{
          color: 'black',
          fontSize: '16px',
          fontWeight: '700',
        }}
      >
        {defaultOutlet.name}
        <hr
          style={{
            height: '4px',
            backgroundColor: '#D6D6D6',
          }}
        />
      </div>
    );
  };
  const renderTimeCounter = () => {
    return (
      <CountDownTime
        targetDate={paymentFomoPay?.action?.expiry}
        color={color}
        backgroundColor='#CF3030'
      />
    );
  };
  const renderHeader = () => {
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
            color: 'black',
            justifySelf: 'center',
          }}
          fontSize='large'
          onClick={() => history.push('/history')}
        />
        <div
          style={{
            fontWeight: 500,
            fontSize: '16px',
            color: 'black',
          }}
        >
          Back
        </div>
      </div>
    );
  };
  const renderQrCode = () => {
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
        <div
          onClick={() => {
            downloadImage(paymentFomoPay?.action?.url, 'qrcode.jpg');
          }}
          style={{
            border: `1px solid ${color.primary}`,
            padding: '5px 16px',
            borderRadius: '8px',
            color: color.primary,
            fontWeight: 500,
            fontSize: '14px',
            marginTop: '16px',
            cursor: 'pointer',
          }}
        >
          SAVE QR CODE TO GALLERY
        </div>
      </div>
    );
  };
  const renderPaymentMethod = ({ label, data }) => {
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
            {data.map((paymentMethodItem) => (
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

                    fontWeight: 700,
                    color: 'var(--text-color-primary, #343A4A)',
                  }}
                >
                  {paymentMethodItem?.paymentType}
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
            ))}
          </div>
        </div>
      );
    }
  };

  const renderBoxItem = ({
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
          <div style={{ color, fontWeight, fontSize: '14px' }}>{row1}</div>
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
          <div style={{ color, fontWeight, fontSize: '14px' }}>{row2}</div>
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
              fontWeight: 500,
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
              fontWeight: 500,
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

  const renderResponsiveDesign = () => {
    const changeFormatDateDefault = changeFormatDate(
      paymentFomoPay?.orderActionDate
    );

    if (gadgetScreen) {
      return (
        <div style={{ paddingBottom: 70 }}>
          <div style={{ padding: '1px 16px' }}>{renderHeader()}</div>
          {renderTimeCounter()}

          <div
            style={{
              padding: '16px',
            }}
          >
            {renderNameOutlet()}
            {renderQrCode()}
            {paymentFomoPay?.details.map((item) => {
              return renderProduct(item);
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
              row2: formatDateWithTime(paymentFomoPay?.transactionDate),
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
                row2: paymentFomoPay?.deliveryAddress?.addressName,
                labelRow3: 'Delivery Provider',
                row3: paymentFomoPay?.deliveryProvider,
                labelRow4: 'Delivery  Date & Time',
                row4: {
                  date: changeFormatDateDefault,
                  time: paymentFomoPay?.orderActionTimeSlot,
                },
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
            {paymentFomoPay?.orderingMode !== 'DELIVERY' &&
              paymentFomoPay?.orderingMode !== 'TAKEAWAY' &&
              paymentFomoPay?.orderingMode !== 'DINEIN' &&
              renderBoxItem({
                labelRow1: 'Ordering Mode',
                row1: paymentFomoPay?.orderingMode,
                color: 'black',
                fontWeight: 700,
              })}
            {renderPaymentMethod({
              label: 'Payment Details',
              data: paymentFomoPay?.payments,
            })}
            <RenderTotalMain
              color={color}
              paymentFomoPay={paymentFomoPay}
              companyInfo={companyInfo}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ width: '100vw' }}>
          <div
            style={{
              width: '45%',
              marginTop: '10px',
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
            {renderHeader()}
            {renderQrCode()}
          </div>
        </div>
      );
    }
  };
  return <div style={fontStyles}>{renderResponsiveDesign()}</div>;
};

export default SeeOrderDetail;
