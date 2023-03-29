import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';

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
const Location = (props) => {
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openAccordion, setOpenAccordion] = useState(false);
  const [locationKeys, setLocationKeys] = useState([]);

  const color = useSelector((state) => state.theme.color);
  const isOpenModalLeavePageLocationPage = useSelector(
    (state) => state.AppointmentReducer.isOpenModalLeavePageLocationPage
  );
  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

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
      gridTemplateColumns: '50px 1fr 70px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
    },
  };

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.pathname]);
        if (location.pathname !== '/location') {
          dispatch({
            type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
            payload: true,
          });
          history.push('/location');
        }
      }
      // if (history.action === 'POP') {
      //   if (locationKeys[1] === location.pathname) {
      //     setLocationKeys(([_, ...keys]) => keys);
      //     // Handle forward event
      //   } else {
      //     setLocationKeys((keys) => [location.pathname, ...keys]);
      //     // Handle back event
      //   }
      // }
    });
  }, [locationKeys]);

  const RenderTimeList = () => {
    const data = [
      {
        day: 'monday',
        time: '13:00 - 22:00',
      },
      {
        day: 'Tuesday',
        time: '13:00 - 22:00',
      },
      {
        day: 'Wednesday',
        time: '13:00 - 22:00',
      },
      {
        day: 'Thursday',
        time: '13:00 - 22:00',
      },
      {
        day: 'Friday',
        time: '09:00 - 13:00',
      },
      {
        day: 'Saturday',
        time: '13:00 - 22:00',
      },
      {
        day: 'Sunday',
        time: '13:00 - 22:00',
      },
    ];
    return data.map((item) => {
      return (
        <ul style={{ padding: '10px', margin: 0 }}>
          <li
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr',
              gap: '0px 10px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
            }}
          >
            <div>{item.day}</div>
            <div>{item.time}</div>
          </li>
        </ul>
      );
    });
  };

  const RenderLocation = ({ selected, isDisable }) => {
    return (
      <div
        style={{
          width: '95%',
          boxShadow: !selected && 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          margin: 'auto',
          borderRadius: '10px',
          padding: '10px 0px',
          marginTop: '10px',
          marginBottom: '10px',
          border: selected && '1px solid red',
          opacity: isDisable ? 0.4 : 1,
        }}
      >
        <div style={styleSheet.gridStyle}>
          <PlaceIcon style={{ justifySelf: 'center', fontSize: '30px' }} />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>
              Connection One{' '}
              <span style={{ color: 'rgba(183, 183, 183, 1)' }}>
                (8,0km away)
              </span>
            </div>
            <div
              style={{
                color: 'rgba(183, 183, 183, 1)',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              169 Bukit Merah Central, Singapore
            </div>
            <div
              style={{
                color: 'rgba(0, 133, 255, 1)',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              See Direction
            </div>
          </div>
          {selected ? (
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                justifySelf: 'center',
              }}
            >
              800m
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDisable
                  ? 'rgba(206, 17, 17, 1)'
                  : 'rgba(56, 164, 5, 1)',
                borderRadius: '5px',
                width: 'fit-content',
                height: '20px',
                padding: '13px 7px',
              }}
            >
              <AccessTimeIcon sx={{ color: 'white', marginRight: '3px' }} />
              <div
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {isDisable ? 'close' : 'open'}
              </div>
            </div>
          )}
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
                  sx={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    display: isDisable && 'none',
                  }}
                />
              }
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AccessTimeIcon style={{ fontSize: '25px' }} />
                <div
                  className={fontStyles.myFont}
                  style={{
                    fontSize: '14px',
                    marginLeft: '10px',
                    fontWeight: 500,
                  }}
                >
                  {isDisable ? 'Closed today' : 'Open now 13:00 - 22.00'}
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{
                padding: 0,
                margin: 0,
              }}
            >
              <RenderTimeList />
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  };

  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          marginTop: gadgetScreen ? '25px' : '0px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            props.history.push('/appointment');
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 700,
            fontSize: '20px',
            color: color.primary,
          }}
        >
          Location
        </p>
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
              marginTop: '25px',
            }}
          >
            <p style={{ fontWeight: 'bold' }}>Chosen Location</p>
          </div>
        );
      };

      const RenderRowListLocation = () => {
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridTemplateRows: '170px 1fr',
              gap: '0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '"."\n    "."',
            }}
          >
            <div>
              <RenderLocation selected={true} />
            </div>
            <div style={{ margin: '10px 0px' }}>
              <p style={{ marginLeft: '10px', fontWeight: 700 }}>
                Other Location
              </p>
              <RenderLocation />
              <RenderLocation />
              <RenderLocation isDisable={true} />
            </div>
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
              <RenderRowListLocation />
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
                  <RenderRowListLocation />
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
            open={isOpenModalLeavePageLocationPage}
            onClose={() =>
              dispatch({
                type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
                payload: false,
              })
            }
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
              Change Outlet Location
            </DialogTitle>
            <div style={{ marginTop: '20px' }}>
              <p
                className={fontStyles.myFont}
                style={{
                  color: 'rgba(183, 183, 183, 1)',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                Some services might not available in other outlets. Are you sure
                to change the location?
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
                onClick={() =>
                  dispatch({
                    type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
                    payload: false,
                  })
                }
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
                  dispatch({
                    type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
                    payload: false,
                  });

                  window.location.href = changeFormatURl('/appointment');
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

export default Location;
