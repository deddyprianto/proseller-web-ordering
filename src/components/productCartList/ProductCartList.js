import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import addIcon from 'assets/images/add.png';
import { useHistory } from 'react-router-dom';

import ProductCart from 'components/productCartList/components/ProductCart';
import IconsArrowLeft from 'assets/images/IconsArrowLeft.png';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import Button from '@mui/material/Button';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
  };
};

const ProductCartList = ({ ...props }) => {
  const history = useHistory();
  const styles = {
    basketHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      alignItems: 'center',
    },
    outletName: {
      fontWeight: 'bold',
      color: props.color.primary,
      textAlign: 'left',
      lineHeight: '17px',
    },
    button: {
      color: props.color.primary,
      border: `1px solid ${props.color.primary}`,
      borderRadius: 5,
      width: 130,
      height: 30,
      textTransform: 'none',
    },
    typography: {
      color: props.color.primary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    icon: {
      height: 15,
      width: 15,
      color: props.color.primary,
    },
    divider: {
      backgroundColor: 'rgb(220, 220, 220)',
      height: 1,
      marginTop: 10,
      marginBottom: 10,
    },
    divider4: {
      backgroundColor: 'rgb(220, 220, 220)',
      height: 4,
      marginTop: 10,
      marginBottom: 10,
    },
  };
  const renderIconInformation = () => {
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 128 129'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M64.0001 118.143C93.4553 118.143 117.333 94.2646 117.333 64.8094C117.333 35.3542 93.4553 11.4761 64.0001 11.4761C34.5449 11.4761 10.6667 35.3542 10.6667 64.8094C10.6667 94.2646 34.5449 118.143 64.0001 118.143Z'
          stroke={props.color.primary}
          strokeWidth='10.6824'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M64.0007 86.1449V64.8115'
          stroke={props.color.primary}
          strokeWidth='15.2432'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M64.0007 43.478H64.0541'
          stroke={props.color.primary}
          strokeWidth='14.2432'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };
  const renderTitleNameForCart = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridTemplateAreas: '". . ."',
          marginBottom: '20px',
        }}
      >
        <img src={IconsArrowLeft} onClick={() => history.push('/')} />
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            justifySelf: 'center',
          }}
          className={fontStyleCustom.myFont}
        >
          Cart
        </div>
      </div>
    );
  };
  const renderLabelNeedAnythingElse = () => {
    return (
      <div
        className={fontStyleCustom.myFont}
        style={{
          marginBottom: '30px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>
            Need anything else?
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            Add other dishes, if you want.
          </div>
        </div>
        <div>
          <Button
            onClick={() => history.push('/')}
            startIcon={<img src={addIcon} alt='addIcon' />}
            sx={{
              backgroundColor: props.color.primary,
              borderRadius: '10px',
              width: '120px',
              height: '40px',
              color: 'white',
              fontSize: '12px',
            }}
          >
            Add More
          </Button>
        </div>
      </div>
    );
  };

  const renderTextBanner = (text = 'You have unavailable item') => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          marginTop: '30px',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontSize: '14px',
            padding: 0,
            margin: 0,
            letterSpacing: '.5px',
            marginLeft: '3px',
          }}
        >
          {text}
        </h1>
        <div
          style={{
            display: 'flex',
            marginLeft: '3px',
            alignItems: 'center',
          }}
        >
          {renderIconInformation()}
          <p
            style={{
              padding: 0,
              margin: 0,
              color: props.color.primary,
              fontSize: '12px',
              marginLeft: '5px',
            }}
          >
            Item(s) will not be included in your payment
          </p>
        </div>
      </div>
    );
  };

  const renderBasketItems = () => {
    const sortItemForPriceHighest = props.basket.details.sort(
      (a, b) => b.unitPrice - a.unitPrice
    );
    const sortOrderingStatusItem = sortItemForPriceHighest.sort(
      (a, b) => a.orderingStatus?.length - b.orderingStatus?.length
    );
    const isDisable = true;
    const result = sortOrderingStatusItem.map((item, key) => {
      if (item.orderingStatus === 'UNAVAILABLE') {
        if (item.modifiers.length > 0) {
          return (
            <div key={key}>
              {renderTextBanner('Add On Unavailable')}
              <ProductCart item={item} isDisable={isDisable} />
            </div>
          );
        } else {
          return (
            <div key={key}>
              {renderTextBanner('Item Unavailable')}
              <ProductCart item={item} isDisable={isDisable} />
            </div>
          );
        }
      } else {
        return (
          <div key={key}>
            <ProductCart item={item} />
          </div>
        );
      }
    });
    return result;
  };

  const isUnavailableExist = props.basket.details.some(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

  return (
    <div>
      {renderTitleNameForCart()}
      {renderLabelNeedAnythingElse()}
      {isUnavailableExist && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderIconInformation()}
          <h1
            style={{
              fontSize: '14px',
              padding: 0,
              margin: 0,
              letterSpacing: '.5px',
              marginLeft: '3px',
            }}
          >
            You have unavailable item
          </h1>
        </div>
      )}
      {renderBasketItems()}
    </div>
  );
};

ProductCartList.defaultProps = {
  basket: {},
  color: {},
};

ProductCartList.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
};

export default connect(mapStateToProps)(ProductCartList);
