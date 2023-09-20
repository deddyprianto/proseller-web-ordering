import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Calendar from './Calender';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = () => ({
  wrapChooseDate: {
    backgroundColor: '#eaeaea',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    borderRadius: '5px',
    paddingBottom: '10px',
    paddingTop: '10px',
    marginTop: '20px',
  },
  typoGraphy: {
    color: 'black',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 700,
  },
  dialogTitle: {
    borderBottom: '1px solid #e5e5e5',
    marginBottom: 2,
  },
});
const TimeSlotDialog = ({ open, onClose, validationOrderingGuestMode }) => {
  const useStylessGuestCO = makeStyles(() => ({
    paper: { minWidth: '340px', borderRadius: '100px' },
  }));
  const classesGuest = useStylessGuestCO();
  const stylesGuest = useStyles();

  const [isLoadingGuest, setIsLoadingGuest] = useState(true);

  useEffect(() => {
    const cleanUp = setTimeout(() => {
      setIsLoadingGuest(false);
    }, 3000);
    return () => {
      clearTimeout(cleanUp);
    };
  }, [isLoadingGuest]);

  if (isLoadingGuest) {
    return <LoadingOverlayCustom active={isLoadingGuest} spinner />;
  }
  return (
    <Dialog
      classes={{ paper: classesGuest.paper }}
      fullWidth={false}
      maxWidth='sm'
      open={open}
      onClose={onClose}
    >
      <DialogTitle style={stylesGuest.dialogTitle}>
        <Typography style={stylesGuest.typoGraphy}>
          Choose Delivery Schedule
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Calendar
          setIsLoading={setIsLoadingGuest}
          onClose={onClose}
          validationOrderingGuestMode={validationOrderingGuestMode}
        />
      </DialogContent>
    </Dialog>
  );
};

TimeSlotDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimeSlotDialog;
