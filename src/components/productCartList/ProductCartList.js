import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';

import ProductCart from 'components/ProductCartList/components/ProductCart';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
  };
};

const ProductCartList = ({ ...props }) => {
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

  const renderBasketItems = () => {
    const result = props.basket.details.map((item, key) => (
      <div key={key}>
        <ProductCart item={item} />
        <div style={styles.divider} />
      </div>
    ));
    return result;
  };

  const renderBasketHeader = () => {
    return (
      <div style={styles.basketHeader}>
        <div style={styles.outletName}>{props.basket.outlet.name}</div>
        <Link to='/'>
          <Button
            style={styles.button}
            startIcon={<AddIcon style={styles.icon} />}
            variant='outlined'
          >
            <Typography style={styles.typography}>Add Items</Typography>
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div>
      {renderBasketHeader()}
      <div style={styles.divider4} />
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
