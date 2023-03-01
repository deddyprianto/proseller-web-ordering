import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import fontStyles from './style/styles.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cutter from 'assets/images/cutter.png';
import reflection from 'assets/images/reflection.png';
import nails from 'assets/images/nails.png';
import { makeStyles } from '@material-ui/core/styles';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const Appointment = (props) => {
  const [isLeavePage, setIsLeavePage] = useState(false);
  const [open, setOpen] = useState(false);
  const [cutPrice, setCutPrice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const color = useSelector((state) => state.theme.color);
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

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
  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '99.3vh',
      borderRadius: '8px',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 85px',
      gap: '0px 15px',
      gridTemplateAreas: '"."\n    "."',
      overflowY: 'auto',
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
    },
  };
  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          marginTop: gadgetScreen ? '70px' : '0px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            props.history.goBack();
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 700,
            fontSize: '16px',
            color: color.primary,
          }}
        >
          Appointment
        </p>
        <SearchIcon fontSize='large' />
      </div>
    );
  };

  const RenderLabel = () => {
    return (
      <div
        style={{
          display: 'flex',
          width: '90%',
          margin: 'auto',
          justifyContent: 'space-between',
          marginTop: '25px',
        }}
      >
        <p style={{ fontWeight: 'bold' }}>Choosen Location</p>
        <p style={{ color: color.primary }}>Change</p>
      </div>
    );
  };

  if (isLeavePage) {
    window.onhashchange = function () {
      if (window.innerDocClick) {
        window.innerDocClick = false;
      } else {
        if (window.location.hash !== '#undefined') {
          setOpen(true);
        }
      }
    };
  } else {
    window.onhashchange = function () {
      if (window.innerDocClick) {
        window.innerDocClick = false;
      } else {
        if (window.location.hash !== '#undefined') {
          props.history.push('/appointment');
          setOpen(true);
        }
      }
    };
  }

  const ListLocation = () => {
    return (
      <div
        style={{
          width: '95%',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          margin: 'auto',
          borderRadius: '10px',
          padding: '10px 0px',
        }}
      >
        <div style={styleSheet.gridStyle}>
          <PlaceIcon style={{ justifySelf: 'center', fontSize: '30px' }} />
          <div style={{ fontSize: '14px' }}>
            <div>Connection One</div>
            <div>169 Bukit Merah Central, Singapore</div>
            <div>See Direction</div>
          </div>
          <div style={{ fontSize: '14px' }}>800m</div>
        </div>
        <div
          style={{
            width: '93%',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Accordion
            sx={{ boxShadow: 'none' }}
            expanded={openAccordion}
            onChange={() => setOpenAccordion(!openAccordion)}
          >
            <AccordionSummary
              sx={{ padding: '0', margin: '0' }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
              }
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <AccessTimeIcon style={{ fontSize: '25px' }} />
              <div
                className={fontStyles.myFont}
                style={{ fontSize: '14px', marginLeft: '10px' }}
              >
                Open now 13:00 - 22.00
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: '0 5px', margin: 0 }}>
              <p>Your time is already here</p>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  };

  const RenderListOutlet = () => {
    return (
      <div
        style={{
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          borderRadius: '6px',
          padding: '10px 0px',
          marginBottom: '15px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '50px',
              display: 'flex',
              justifyContent: 'center',
              height: '50px',
              padding: '10px',
            }}
          >
            <img src={cutter} />
          </div>
          <div style={{ padding: '0px 10px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>
              Finishing Short Hair Cut Title Goes Here ...
            </div>
            <div style={{ fontSize: '13px' }}>
              Cutting Short hair description if any can goes here for example
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 70px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            marginTop: '15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AccessTimeIcon />
            <div style={{ fontSize: '13px', marginLeft: '5px' }}>30 mins</div>
          </div>
          {cutPrice ? (
            <div
              style={{
                justifySelf: 'end',
                display: 'flex',
                fontSize: '14px',
              }}
            >
              <div>SGD 10.00</div>
              <div
                style={{
                  marginLeft: '5px',
                  textDecorationLine: 'line-through',
                }}
              >
                SGD 10.00
              </div>
            </div>
          ) : (
            <div
              style={{
                justifySelf: 'end',
                fontSize: '14px',
              }}
            >
              <div>SGD 10.00</div>
            </div>
          )}
          <div
            style={{
              justifySelf: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              style={{ width: '60px', borderRadius: '5px', fontSize: '12px' }}
            >
              BOOK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RenderLocation = () => {
    return (
      <div
        style={{
          width: '95%',
          margin: 'auto',
          marginTop: '25px',
        }}
      >
        <hr style={{ opacity: 0.6 }} />
        <p style={{ fontWeight: 600 }}>Services</p>
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img src={cutter} />
            <p style={{ fontWeight: 500 }}>Cut & Blow</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0px 36px',
            }}
          >
            <img src={nails} />
            <p>Nails</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img src={reflection} />
            <p>Reflexology</p>
          </div>
        </div>
        <RenderListOutlet />
        <RenderListOutlet />
        <RenderListOutlet />
      </div>
    );
  };

  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{ height: '90vh', overflowY: 'auto' }}
        >
          <RenderHeader />
          <RenderLabel />
          <ListLocation />
          <RenderLocation />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <di
              style={{
                marginTop: '15%',
              }}
            >
              <RenderHeader />
              <RenderLabel />
              <ListLocation />
              <RenderLocation />
            </di>
          </div>
        </div>
      );
    }
  };
  return (
    <React.Fragment>
      <ResponsiveLayout />
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={() => setOpen(false)}
        classes={{ paper: classes.paper }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        ></div>
        <DialogTitle
          className={fontStyles.myFont}
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            textAlign: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          Leaving Appointment Page
        </DialogTitle>
        <div style={{ marginTop: '20px' }}>
          <p
            className={fontStyles.myFont}
            style={{
              color: 'rgba(183, 183, 183, 1)',
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            Some booked services you have not submitted might not be saved in
            our system. Are you sure?
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
            onClick={() => setOpen(false)}
            className={fontStyles.myFont}
            style={{
              backgroundColor: 'white',
              border: `1px solid ${color.primary}`,
              color: color.primary,
              width: '50%',
              padding: '6px 0px',
              borderRadius: '10px',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsLeavePage(true);
              props.history.goBack();
            }}
            className={fontStyles.myFont}
            style={{
              color: 'white',
              width: '50%',
              padding: '6px 0px',
              borderRadius: '10px',
              fontSize: '14px',
            }}
          >
            Yes, I’m Sure
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Appointment;
