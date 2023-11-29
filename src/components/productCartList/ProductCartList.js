import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import addIcon from 'assets/images/add.png';
import { useHistory } from 'react-router-dom';

import ProductCart from 'components/productCartList/components/ProductCart';
import IconsArrowLeft from 'assets/images/IconsArrowLeft.png';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import Button from '@mui/material/Button';
import { IconPlace, renderIconInformation } from 'assets/iconsSvg/Icons';
import { renderOutletInfo } from 'helpers/headerOutletCart';
const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

const ProductCartList = ({ ...props }) => {
  const history = useHistory();

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
        <img
          alt='ic_arrow_left'
          src={IconsArrowLeft}
          onClick={() => history.push('/')}
        />
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #C1C1C1',
          borderTop: '1px solid #C1C1C1',
          margin: '25px -15px',
          padding: '15px',
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
            id='add-more-button'
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
          {renderIconInformation('red')}
          <p
            style={{
              padding: 0,
              margin: 0,
              color: 'red',
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
    const isDisable = true;
    const result = props.basket.details.map((item, key) => {
      if (item.orderingStatus === 'UNAVAILABLE') {
        if (item.modifiers.length > 0) {
          return (
            <div key={key}>
              {renderTextBanner('Add On Unavailable')}
              <ProductCart item={item} isDisable={isDisable} index={key} />
            </div>
          );
        } else {
          return (
            <div key={key}>
              {renderTextBanner('Item Unavailable')}
              <ProductCart item={item} isDisable={isDisable} index={key} />
            </div>
          );
        }
      } else {
        return (
          <div key={key}>
            <ProductCart item={item} index={key} />
          </div>
        );
      }
    });
    return (
      <div>
        <div
          className={fontStyleCustom.myFont}
          style={{ fontSize: '16px', fontWeight: 700 }}
        >
          Items
        </div>
        {result}
      </div>
    );
  };

  const isUnavailableExist = props.basket.details?.some(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

  const isOrderingStatusUnavailable = props.basket?.details?.every(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

  const renderTextInformationUnAvailabeItem = () => {
    if (isOrderingStatusUnavailable) {
      return null;
    }
    if (isUnavailableExist) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderIconInformation('red')}
          <h1
            style={{
              fontSize: '14px',
              padding: 0,
              margin: 0,
              letterSpacing: '.5px',
              marginLeft: '3px',
              color: 'red',
            }}
          >
            You have unavailable item
          </h1>
        </div>
      );
    }
  };

  return (
    <div>
      {renderTitleNameForCart()}
      {renderOutletInfo(props.defaultOutlet?.name,props.color.primary,IconPlace)}
      {renderTextInformationUnAvailabeItem()}
      {renderBasketItems()}
      {renderLabelNeedAnythingElse()}
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
