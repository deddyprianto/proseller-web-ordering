import React from 'react';
import { useSelector } from 'react-redux';
import screen from 'hooks/useWindowSize';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import { downloadImage } from 'helpers/awaitingPayment';
import CountDownTime from 'components/awaitingpayment/CountDownTime';

const AwaitingPayment = () => {
  const history = useHistory();
  const responsiveDesign = screen();

  const color = useSelector((state) => state.theme.color);
  const paymentFomoPay = useSelector(
    (state) => state.payment.responseFomoPayPayment
  );

  const gadgetScreen = responsiveDesign.width < 980;

  const fontStyles = {
    fontFamily: "'Poppins', sans-serif",
    src: `url('https://fonts.googleapis.com/css2?family=Poppins&display=swap')`,
    marginTop: '50px',
    padding: '16px',
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

  const handleDownloadClick = () => {
    const imageUrl =
      'https://www.panda.id/wp-content/uploads/QRCODE_CONTOH_Panda-Mobile.jpg';
    const fileName = 'qrcode.jpg'; // Replace with your desired file name
    downloadImage(imageUrl, fileName);
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
        <CountDownTime
          targetDate={paymentFomoPay?.action?.expiry}
          color={color}
        />
        <div
          onClick={handleDownloadClick}
          style={{
            border: `1px solid ${color.primary}`,
            padding: '8px 16px',
            borderRadius: '8px',
            color: color.primary,
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          SAVE QR CODE TO
        </div>
      </div>
    );
  };
  const renderListData = ({
    labelOne,
    nameOne,
    color,
    fontWeight,
    fontSize,
    labelTwo,
    nameTwo,
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
              fontWeight: 500,
            }}
          >
            {labelOne}
          </div>
          <div style={{ color, fontWeight, fontSize }}>{nameOne}</div>
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
            }}
          >
            {labelTwo}
          </div>
          <div style={{ color, fontWeight, fontSize }}>{nameTwo}</div>
        </div>
      </div>
    );
  };
  const renderTotalMain = () => {
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
          <div>Sub Total</div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            SGD 44.80
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Discount</div>
          <div
            style={{
              color: 'var(--semantic-color-success, #1A883C)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            -SGD 3.95
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Membership Discount</div>
          <div
            style={{
              color: 'var(--semantic-color-success, #1A883C)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            -SGD 3.95
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Surcharge</div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            SGD 44.80
          </div>
        </div>
        <hr style={{ backgroundColor: '#D6D6D6' }} />
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
            SGD 44.80
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
              color: 'var(--text-color-tertiary, #B7B7B7)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Tax Amount
          </div>
          <div style={{ color: 'black', fontWeight: 700, fontSize: '14px' }}>
            SGD 44.80
          </div>
        </div>
      </div>
    );
  };
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
          marginTop: '16px',
        }}
      >
        See Order Detail
      </div>
    );
  };
  console.log(paymentFomoPay);
  const renderResponsiveDesign = () => {
    if (gadgetScreen) {
      return (
        <div style={{ paddingBottom: 70 }}>
          {renderHeader()}
          {renderQrCode()}
          {renderListData({
            labelOne: 'Status Order',
            nameOne: paymentFomoPay?.status,
            color: color.primary,
            fontWeight: 700,
            fontSize: '14px',
          })}
          {renderListData({
            labelOne: 'Ref No.',
            nameOne: paymentFomoPay?.transactionRefNo,
            labelTwo: 'Queue No.',
            nameTwo: paymentFomoPay?.queueNo,
            color: 'black',
            fontWeight: 700,
            fontSize: '14px',
          })}
          {renderListData({
            labelOne: 'Ordering Mode',
            nameOne: paymentFomoPay?.orderingMode,
            color: 'black',
            fontWeight: 700,
            fontSize: '14px',
          })}
          {renderListData({
            labelOne: 'Payment Method',
            nameOne: 'PAYNOW',
            color: 'black',
            fontWeight: 700,
            fontSize: '14px',
          })}
          {renderTotalMain()}
          {buttonSeeDetail()}
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

export default AwaitingPayment;
