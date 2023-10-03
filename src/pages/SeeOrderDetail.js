import React from 'react';
import { useSelector } from 'react-redux';
import screen from 'hooks/useWindowSize';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SeeOrderDetail = () => {
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);

  const history = useHistory();
  const responsiveDesign = screen();

  const color = useSelector((state) => state.theme.color);
  const gadgetScreen = responsiveDesign.width < 980;

  const fontStyles = {
    fontFamily: "'Poppins', sans-serif",
    src: `url('https://fonts.googleapis.com/css2?family=Poppins&display=swap')`,
    marginTop: '70px',
  };
  const renderItemModifier = ({ qty, name, price }) => {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          fontStyle: 'italic',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        <div>{qty}</div>
        <div
          style={{
            margin: '0px 5px',
          }}
        >
          {name}
        </div>
        <div>{price}</div>
      </div>
    );
  };
  const renderProduct = () => {
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
        <div
          style={{
            backgroundColor: '#D9D9D9',
            borderRadius: '8px',
            width: '100%',
            height: '100px',
          }}
        />
        <div>
          <div style={{ fontWeight: 700 }}>1x 4 Deli Set (SGD 0.00)</div>
          <div style={{ fontStyle: 'italic' }}>Add On</div>
          {renderItemModifier({
            qty: '1x',
            name: 'Cumin Carrot Soup',
            price: 'SGD 20',
          })}
          {renderItemModifier({
            qty: '1x',
            name: 'Cumin Carrot Soup',
            price: 'SGD 20',
          })}
          {renderItemModifier({
            qty: '1x',
            name: 'Cumin Carrot Soup',
            price: 'SGD 20',
          })}
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
      <div
        style={{
          backgroundColor: '#CF3030',
          fontWeight: 500,
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          padding: '5px 10px',
        }}
      >
        <div>Waiting for payment</div>
        <div style={{ margin: '0px 10px' }}>00:09:59</div>
        <AccessTimeIcon
          sx={{
            color: 'white',
            fontSize: '20px',
            padding: '0px',
            margin: '0px',
          }}
        />
      </div>
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
          onClick={() => history.goBack()}
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
        <div
          style={{
            border: `1px solid ${color.primary}`,
            padding: '8px 16px',
            borderRadius: '8px',
            color: color.primary,
            fontWeight: 500,
            fontSize: '14px',
            marginTop: '16px',
          }}
        >
          SAVE QR CODE TO GALLERY
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
        onClick={() => history.push('/seeorderdetail')}
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
  const renderResponsiveDesign = () => {
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
            {renderProduct()}
            {renderListData({
              labelOne: 'Status Order',
              nameOne: 'Awaiting Payment',
              color: color.primary,
              fontWeight: 700,
              fontSize: '14px',
            })}
            {renderListData({
              labelOne: 'Ref No.',
              nameOne: '202307250024-PS-A024',
              labelTwo: 'Queue No.',
              nameTwo: 'A024',
              color: 'black',
              fontWeight: 700,
              fontSize: '14px',
            })}
            {renderListData({
              labelOne: 'Ordering Mode',
              nameOne: 'DINE IN',
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
