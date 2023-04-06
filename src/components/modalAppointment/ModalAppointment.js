import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import fontStyles from './style/style.module.css';
import { makeStyles } from '@material-ui/core/styles';
import imgAppointment from 'assets/images/appointmetFeature.png';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CONSTANT } from 'helpers';

const ModalAppointment = ({ name, setName, isLoggedIn }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  const style = {
    dialogContent: {
      '& .MuiDialogContent-root': {
        paddingBottom: 0,
      },
    },
  };
  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={name && isLoggedIn}
      onClose={() => setName(false)}
      classes={{ paper: classes.paper }}
    >
      <CloseIcon
        onClick={() => {
          setName(false);
        }}
        color='disabled'
        sx={{
          position: 'absolute',
          top: 5,
          right: 4,
          fontSize: '30px',
          opacity: 0.6,
        }}
      />

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '15px',
        }}
      >
        <img src={imgAppointment} />
      </div>
      <DialogTitle
        className={fontStyles.myFont}
        sx={{
          fontWeight: 'bold',
          fontSize: '16px',
          textAlign: 'center',
          margin: 0,
          padding: 0,
        }}
      >
        Appointment feature is here!
      </DialogTitle>
      <div style={{ padding: '0px 20px' }}>
        <p
          className={fontStyles.myFont}
          style={{
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Welcome! You can booking an appointment by clicking BOOKING menu
        </p>
      </div>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <button
          className={fontStyles.myFont}
          style={{
            color: 'white',
            width: '100%',
            padding: '10px 0px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 500,
          }}
          onClick={() => {
            dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 2 });
            setName(false);
            history.push('/appointment');
          }}
        >
          Take me there
        </button>
      </DialogActions>
    </Dialog>
  );
};

ModalAppointment.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalAppointment;
