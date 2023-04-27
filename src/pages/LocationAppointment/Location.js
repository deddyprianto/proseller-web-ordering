import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isEmptyObject } from 'helpers/CheckEmpty';

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
  const [openModalMap, setOpenModalMap] = useState(false);
  // some initial
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // some st
  const [openDropDownTime, setOpenDropDownTime] = useState(false);
  const [openDropDownTimeSelected, setOpenDropDownTimeSelected] =
    useState(false);
  const [locationKeys, setLocationKeys] = useState([]);
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();
  // some sl
  const outlet = useSelector((state) => state.outlet.outlets);
  const isLocationSelected = useSelector(
    (state) => state.appointmentReducer.isLocationSelected
  );
  const selectedLocation = useSelector(
    (state) => state.appointmentReducer.locationAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const popupLocation = useSelector(
    (state) => state.appointmentReducer.popupLocation
  );
  const outlets = useSelector((state) => state.outlet.outlets);
  // some fn
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
  // some Effect
  useEffect(() => {
    if (isEmptyObject(selectedLocation)) {
      dispatch({ type: CONSTANT.LOCATION_APPOINTMENT, payload: outlet[0] });
    }
  }, [outlet]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        console.log(location.pathname);
        setLocationKeys([location.pathname]);
        if (location.pathname !== '/location' && isLocationSelected) {
          dispatch({
            type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
            payload: true,
          });
          history.push('/location');
        }
      }
    });
  }, [locationKeys]);

  const RenderTimeList = () => {
    return selectedLocation?.operationalHours.map((item, i) => {
      return (
        <ul key={i} style={{ padding: '5px 0px', margin: '5px 0px' }}>
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
            <div style={{ fontSize: '14px', fontWeight: 500 }}>
              {item.nameOfDay}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>
              {item.open} - {item.close}
            </div>
          </li>
        </ul>
      );
    });
  };
  const DropDownTime = () => {
    if (openDropDownTime) {
      return (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            height: '270px',
            width: '60%',
            padding: '0px 10px',
            borderRadius: '5px',
            zIndex: 999,
            left: 13,
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            overflowY: 'auto',
          }}
        >
          <RenderTimeList />
        </div>
      );
    } else {
      return null;
    }
  };
  const DropDownTimeSelected = () => {
    if (openDropDownTimeSelected) {
      return (
        <div
          style={{
            position: 'sticky',
            backgroundColor: 'white',
            height: '270px',
            width: '65%',
            padding: '0px 10px',
            borderRadius: '5px',
            zIndex: 999,
            left: 17,
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            overflowY: 'auto',
          }}
        >
          <RenderTimeList />
        </div>
      );
    } else {
      return null;
    }
  };
  const LocationSelected = () => {
    const localStyle = {
      containerAccordion: {
        width: '93%',
        display: 'flex',
        alignItems: 'center',
      },
      labelSeeDirection: {
        fontSize: '14px',
        fontWeight: 500,
        color: 'rgba(0, 133, 255, 1)',
        cursor: 'pointer',
      },
      containerOpenNow: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginTop: '10px',
        color: 'black',
      },
      labelOpenNow: {
        fontSize: '14px',
        marginLeft: '10px',
        marginRight: '5px',
        fontWeight: 500,
      },
    };
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          borderRadius: '10px',
          padding: '10px 0px',
          marginTop: '10px',
          marginBottom: '10px',
          border: '1px solid red',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 50px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            cursor: 'pointer',
          }}
        >
          <PlaceIcon
            style={{
              justifySelf: 'center',
              fontSize: '20px',
              marginTop: '5px',
            }}
          />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 500, color: 'black' }}>
              {selectedLocation?.name}
            </div>
            <div
              style={{
                color: 'rgba(183, 183, 183, 1)',
                fontWeight: 500,
              }}
            >
              {selectedLocation?.address}
            </div>
            {selectedLocation?.latitude > 0 &&
              selectedLocation?.longitude > 0 && (
                <div
                  onClick={() => {
                    window.open(
                      'https://maps.google.com?q=' +
                        selectedLocation?.latitude +
                        ',' +
                        selectedLocation?.longitude
                    );
                  }}
                  style={localStyle.containerAccordion}
                >
                  <div
                    className={fontStyles.myFont}
                    style={localStyle.labelSeeDirection}
                  >
                    See Direction
                  </div>
                </div>
              )}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>800m</div>
        </div>
        <div
          onClick={() => setOpenDropDownTimeSelected(!openDropDownTimeSelected)}
          style={localStyle.containerOpenNow}
        >
          <AccessTimeIcon style={{ fontSize: '20px' }} />
          <div className={fontStyles.myFont} style={localStyle.labelOpenNow}>
            Open now 13:00 - 22.00
          </div>
          {openDropDownTime ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          )}
        </div>
        <DropDownTimeSelected />
      </div>
    );
  };

  const ListLocations = ({ item, isDisable }) => {
    const localStyle = {
      container: {
        width: '93%',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        margin: 'auto',
        borderRadius: '10px',
        padding: '10px 0px',
        marginBottom: '15px',
        pointerEvents: !isDisable && 'none',
      },
      containerAccordion: {
        width: '93%',
        display: 'flex',
        alignItems: 'center',
      },
      labelSeeDirection: {
        fontSize: '14px',
        fontWeight: 500,
        color: 'rgba(0, 133, 255, 1)',
        cursor: 'pointer',
      },
      containerOpenNow: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginTop: '10px',
      },
      labelOpenNow: {
        fontSize: '14px',
        marginLeft: '10px',
        marginRight: '5px',
        fontWeight: 500,
        color: 'black',
      },
    };
    return (
      <div
        style={localStyle.container}
        onClick={() => {
          dispatch({ type: CONSTANT.IS_LOCATION_SELECTED, payload: true });
          dispatch({
            type: CONSTANT.RESPONSE_TIMESLOT_ERROR_APPOINTMENT,
            payload: '',
          });
          dispatch({
            type: CONSTANT.LOCATION_APPOINTMENT,
            payload: item,
          });
          history.goBack();
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 75px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            cursor: 'pointer',
            opacity: !isDisable ? 0.4 : 1,
          }}
        >
          <PlaceIcon
            style={{
              justifySelf: 'center',
              fontSize: '20px',
              marginTop: '5px',
            }}
          />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 500, color: 'black' }}>{item.name}</div>
            <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
              {item?.address}
            </div>
            <div style={localStyle.containerAccordion}>
              <div
                className={fontStyles.myFont}
                style={localStyle.labelSeeDirection}
              >
                See Direction
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              width: '90%',
              margin: '0px auto',
            }}
          >
            <div
              style={{
                backgroundColor: !isDisable ? 'red' : 'green',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                color: 'white',
                fontWeight: 500,
                borderRadius: '5px',
              }}
            >
              <AccessTimeIcon />
              <div>{!isDisable ? 'Close' : 'Open'}</div>
            </div>
          </div>
        </div>
        <div style={localStyle.containerOpenNow}>
          <AccessTimeIcon style={{ fontSize: '20px', color: 'black' }} />
          <div className={fontStyles.myFont} style={localStyle.labelOpenNow}>
            {!isDisable ? 'Closed Today' : 'Open Now'}
          </div>
          {openDropDownTime ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          )}
        </div>
      </div>
    );
  };

  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          marginTop: '25px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            history.push('/appointment');
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
          width: '93%',
          margin: 'auto',
          marginTop: '25px',
        }}
      >
        <p style={{ fontWeight: 'bold', color: 'black' }}>Chosen Location</p>
      </div>
    );
  };

  const RenderListLocation = () => {
    return (
      <div>
        <LocationSelected />
        <div style={{ margin: '10px 0px' }}>
          <p style={{ marginLeft: '15px', color: 'black', fontWeight: 700 }}>
            Other Location
          </p>
          {outlets.map((item) => (
            <ListLocations
              key={item.name}
              item={item}
              isDisable={item.outletStatus}
            />
          ))}
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
          <RenderListLocation />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <di>
              <RenderHeader />
              <RenderLabel />
              <RenderListLocation />
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
        open={popupLocation}
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
            Some services might not available in other outlets. Are you sure to
            change the location?
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
              dispatch({ type: CONSTANT.IS_LOCATION_SELECTED, payload: false });
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
