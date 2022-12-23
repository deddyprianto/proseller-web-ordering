import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
  };
};

const MyVoucherWarningModal = ({ open, handleClose, message, ...props }) => {
  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      position: 'relative',
      top: 0,
      right: 0,
    },
    divider: {
      backgroundColor: 'rgb(220, 220, 220)',
      height: 1,
    },
    typography: {
      margin: 20,
      fontSize: 20,
      color: props.color.primary,
      fontWeight: 'bold',
    },
    typographyMessage: {
      margin: 20,
      fontSize: 20,
      color: props.color.primary,
      textAlign: 'center',
    },
    displayFlexAndJustifyCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    iconButton: {
      position: 'absolute',
      right: 1,
      top: 1,
      marginTop: 10,
    },
    iconClose: {
      height: 25,
      width: 25,
    },
  };

  return (
    <Dialog open={open} fullWidth maxWidth='xs'>
      <div style={styles.root}>
        <Typography align='center' style={styles.typography}>
          Alert
        </Typography>
        <div>
          <IconButton
            style={styles.iconButton}
            onClick={() => {
              handleClose();
            }}
          >
            <CloseIcon style={styles.iconClose} />
          </IconButton>
        </div>
      </div>

      <div style={styles.divider} />
      <div style={styles.displayFlexAndJustifyCenter}>
        <Typography style={styles.typographyMessage}>{message}</Typography>
      </div>
    </Dialog>
  );
};

MyVoucherWarningModal.defaultProps = {
  open: false,
  color: {},
  handleClose: null,
  message: '',
};

MyVoucherWarningModal.propTypes = {
  color: PropTypes.object,
  handleClose: PropTypes.func,
  message: PropTypes.string,
  open: PropTypes.bool,
};

export default connect(mapStateToProps)(MyVoucherWarningModal);
