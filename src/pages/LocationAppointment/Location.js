import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { isEmptyObject } from 'helpers/CheckEmpty';
import screen from 'hooks/useWindowSize';

const Location = (props) => {
  // some initial
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const dispatch = useDispatch();
  const history = useHistory();
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
  const indexPath = useSelector((state) => state.appointmentReducer.indexPath);
  const menuSidebar = useSelector((state) => state.theme.menu);
  const indexFooter = useSelector(
    (state) => state.appointmentReducer.indexFooter
  );
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const outlet = useSelector((state) => state.outlet.outlets);
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
        if (
          location.pathname !== '/location' &&
          !isEmptyObject(cartAppointment)
        ) {
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
  const PlaceIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke={color.primary}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='feather feather-map-pin'
      >
        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
        <circle cx={12} cy={10} r={3} />
      </svg>
    );
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
          marginBottom: '10px',
          border: '1px solid red',
          marginTop: '16px',
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
          <div style={{ justifySelf: 'center', marginTop: '6px' }}>
            <PlaceIcon />
          </div>
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
          <AccessTimeIcon style={{ fontSize: '20px', color: color.primary }} />
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
          <div style={{ justifySelf: 'center', marginTop: '6px' }}>
            <PlaceIcon />
          </div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 500, color: 'black' }}>{item.name}</div>
            <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
              {item?.address}
            </div>
            {item?.latitude > 0 && item?.longitude > 0 && (
              <div style={localStyle.containerAccordion}>
                <div
                  className={fontStyles.myFont}
                  style={localStyle.labelSeeDirection}
                >
                  See Direction
                </div>
              </div>
            )}
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
          <AccessTimeIcon style={{ fontSize: '20px', color: color.primary }} />
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
          display: 'grid',
          gridTemplateColumns: '50px 1fr 70px',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
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
          sx={{ color: color.primary }}
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
    let filterOutletSelected = [];
    if (!isEmptyObject(selectedLocation)) {
      filterOutletSelected = outlets.filter(
        (item) => item.id !== selectedLocation.id
      );
    }
    return (
      <React.Fragment>
        <LocationSelected />
        <div style={{ marginTop: '43px' }}>
          <p
            style={{
              marginLeft: '15px',
              color: 'black',
              fontWeight: 700,
            }}
          >
            Other Location
          </p>
          {filterOutletSelected.map((item) => (
            <ListLocations
              key={item.name}
              item={item}
              isDisable={item.outletStatus}
            />
          ))}
        </div>
      </React.Fragment>
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
          <div
            style={{
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
            }}
          >
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
              let path;
              menuSidebar.navBar.forEach((item, i) => {
                if (i === indexPath) {
                  path = item.path;
                }
              });
              dispatch({ type: CONSTANT.INDEX_FOOTER, payload: indexPath });
              window.location.href = changeFormatURl(path);
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
