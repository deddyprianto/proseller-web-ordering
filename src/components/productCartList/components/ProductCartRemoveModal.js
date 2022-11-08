import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { OrderAction } from 'redux/actions/OrderAction';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductRemoveCartModal = ({
  open,
  handleClose,
  selectedProductRemove,
  ...props
}) => {
  const styles = {
    rootLoading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 20,
    },
    rootButton: {
      paddingTop: 20,
    },
    buttonConfirm: {
      backgroundColor: props.color.primary,
      color: 'white',
      marginRight: 10,
      fontSize: 10,
      textTransform: 'none',
    },
    buttonClose: {
      backgroundColor: 'red',
      color: 'white',
      fontSize: 10,
      textTransform: 'none',
    },
    icon: {
      width: 70,
      height: 70,
      color: '#F8BB86',
    },
    typography: {
      fontSize: 20,
      paddingTop: 20,
    },
  };
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveProductInCart = async () => {
    setIsLoading(true);
    await props.dispatch(OrderAction.processRemoveCart(selectedProductRemove));
    if (props.basket.details.length === 1) {
      history.push('/');
    }
    setIsLoading(false);
    handleClose();
  };

  const renderLoading = () => {
    if (isLoading) {
      return <CircularProgress />;
    }
    return <ErrorOutlineIcon style={styles.icon} />;
  };

  return (
    <Dialog open={open} fullWidth maxWidth='xs'>
      <div style={styles.rootLoading}>
        {renderLoading()}
        <Typography align='center' style={styles.typography}>
          Want to remove product from this cart?
        </Typography>
        <div style={styles.rootButton}>
          <Button
            disabled={isLoading}
            style={styles.buttonConfirm}
            onClick={() => {
              handleRemoveProductInCart();
            }}
          >
            Yes
          </Button>
          <Button
            disabled={isLoading}
            style={styles.buttonClose}
            onClick={handleClose}
          >
            No
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

ProductRemoveCartModal.defaultProps = {
  open: false,
  basket: {},
  color: {},
  dispatch: null,
  handleClose: null,
  selectedProductRemove: {},
};

ProductRemoveCartModal.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  selectedProductRemove: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductRemoveCartModal);
