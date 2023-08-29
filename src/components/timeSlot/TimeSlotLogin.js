import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Calendar from './CalenderLogin';
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
const TimeSlotLogin = ({ open, onClose, validationOrdering }) => {
  const isMaxDays = validationOrdering?.maxDays;
  const useStyless = makeStyles(() => ({
    paper: { minWidth: '340px', borderRadius: '100px' },
  }));
  const classes = useStyless();
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cleanUp = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(cleanUp);
    };
  }, [isLoading]);

  if (isLoading) {
    return <LoadingOverlayCustom active={isLoading} spinner />;
  }
  return (
    <Dialog
      classes={{ paper: classes.paper }}
      fullWidth={false}
      maxWidth='sm'
      open={open}
      onClose={onClose}
    >
      <DialogTitle style={styles.dialogTitle}>
        <Typography style={styles.typoGraphy}>
          Choose Delivery Schedule
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Calendar
          isMaxDays={isMaxDays}
          setIsLoading={setIsLoading}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

TimeSlotLogin.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimeSlotLogin;
