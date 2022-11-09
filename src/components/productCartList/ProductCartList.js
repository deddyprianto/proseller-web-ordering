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

  const renderBasketItems = () => {
    const sortItemForPriceHighest = props.basket.details.sort(
      (a, b) => b.unitPrice - a.unitPrice
    );
    const result = sortItemForPriceHighest.map((item, key) => (
      <div key={key}>
        <ProductCart item={item} />
      </div>
    ));
    return result;
  };

  return (
    <div>
      {renderTitleNameForCart()}
      {renderLabelNeedAnythingElse()}
      <h1 style={{ fontSize: '16px' }}>Items</h1>
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
