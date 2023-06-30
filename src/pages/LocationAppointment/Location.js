import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import fontStyles from './style/styles.module.css';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';
import screen from 'hooks/useWindowSize';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { isEmpty } from 'helpers/utils';
import AppointmentHeader from 'components/appointmentHeader';
import { IconHistoryTime, IconPlace } from 'assets/iconsSvg/Icons';
import imgOutletClosed from 'assets/images/outlet-closed.png';

const Location = () => {
  const { height, width } = screen();
  const gadgetScreen = width < 980;
  const dispatch = useDispatch();
  const history = useHistory();
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [openDropDownTimeSelected, setOpenDropDownTimeSelected] =
    useState(false);
  const [selectedLocationPersisted, setSelectedLocationPersisted] =
    useState(null);
  const [otherOutletDropdownSelected, setOtherOutletDropdownSelected] =
    useState(0);

  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const locationAppointment = useSelector(
    (state) => state.appointmentReducer.locationAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const popupLocation = useSelector(
    (state) => state.appointmentReducer.popupLocation
  );
  const outlets = useSelector((state) => state.outlet.outlets);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      history.replace('/');
    }

    const locationPersisted = localStorage.getItem(
      'LOCATION_APPOINTMENT_PERSISTED'
    );
    const selectedLocationPersisted = JSON.parse(locationPersisted);
    setSelectedLocationPersisted(selectedLocationPersisted);
  }, [history, isLoggedIn]);

  const selectedLocation = !selectedLocationPersisted
    ? {}
    : outlets?.find((val) => val.id === selectedLocationPersisted?.id);

  const handleSelectedOutlet = (item) => {
    dispatch({
      type: CONSTANT.TIME_SLOT_APPOINTMENT,
      payload: [],
    });
    if (cartAppointment?.details?.length > 0) {
      dispatch({
        type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
        payload: true,
      });
    } else {
      dispatch({
        type: CONSTANT.LOCATION_APPOINTMENT_PERSISTED,
        payload: item,
      });
      dispatch({ type: CONSTANT.IS_LOCATION_SELECTED, payload: true });
      history.goBack();
    }
    dispatch({
      type: CONSTANT.LOCATION_APPOINTMENT,
      payload: item,
    });
  };
  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  const seeDirectionHandler = (lat, long) => {
    const gMapAPI = 'https://maps.google.com?q=';
    return window.open(gMapAPI + lat + ',' + long);
  };

  const RenderTimeList = ({ data }) => {
    const timeSlot = data?.length
      ? data
      : selectedLocation?.appointmentTimeSlot;

    const customTimeSlot = [];

    timeSlot?.forEach((item) => {
      item.applicableDays.forEach((day) => {
        customTimeSlot.push({
          text: day.text,
          start: item.start,
          end: item.end,
        });
      });
    });

    return customTimeSlot?.map((item, i) => {
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
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.text}</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>
              {item.start} - {item.end}
            </div>
          </li>
        </ul>
      );
    });
  };

  const DropDownTimeSelected = (props) => {
    if (props.isOpen) {
      return (
        <div
          style={{
            position: 'sticky',
            backgroundColor: 'white',
            height: 'auto',
            width: '65%',
            padding: '0px 10px',
            borderRadius: '5px',
            zIndex: 999,
            left: 17,
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            overflowY: 'auto',
          }}
        >
          <RenderTimeList data={props.data} />
        </div>
      );
    } else {
      return null;
    }
  };

  const LabelOpenTime = ({ style, data }) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const customTimeSlot = [];

    !isEmpty(data) &&
      data?.forEach((item) => {
        item.applicableDays.forEach((day) => {
          customTimeSlot.push({
            text: day.text,
            value: Number(day.value),
            start: item.start,
            end: item.end,
          });
        });
      });

    const checkDayAvailable = customTimeSlot?.find(
      (val) => val.value === now.getDay()
    );

    const appointmentTimeSlot =
      !isEmpty(checkDayAvailable) && checkDayAvailable;

    const startHour = appointmentTimeSlot?.start?.slice(0, 2);
    const startMinutes = appointmentTimeSlot?.start?.slice(-2);
    const endHour = appointmentTimeSlot?.end?.slice(0, 2);
    const endMinutes = appointmentTimeSlot?.end?.slice(-2);

    const startTimeInMinutes = startHour * 60 + Number(startMinutes);
    const endTimeInMinutes = endHour * 60 + Number(endMinutes);

    const currentTimeInMinutes = currentHour * 60 + Number(currentMinutes);

    let label = 'See operational hour';

    if (!isEmpty(checkDayAvailable)) {
      if (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes <= endTimeInMinutes
      ) {
        label = `Open now at ${appointmentTimeSlot?.start} - ${appointmentTimeSlot?.end}`;
      } else if (currentTimeInMinutes <= startTimeInMinutes) {
        label = `Later at ${appointmentTimeSlot?.start} - ${appointmentTimeSlot?.end}`;
      }
    }

    return (
      <div className={fontStyles.myFont} style={style}>
        {label}
      </div>
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
          borderRadius: '10px',
          padding: '10px 0px',
          marginBottom: '10px',
          border: `1px solid ${color.primary}`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
          }}
        >
          <div style={{ justifySelf: 'center', marginTop: '6px' }}>
            <IconPlace />
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
                <div style={localStyle.containerAccordion}>
                  <div
                    onClick={() =>
                      seeDirectionHandler(
                        selectedLocation?.latitude,
                        selectedLocation?.longitude
                      )
                    }
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
              color: 'black',
              justifySelf: 'end',
              marginRight: '5px',
            }}
          >
            {selectedLocation?.distance && `${selectedLocation?.distance}km`}
          </div>
        </div>
        <div
          onClick={() => setOpenDropDownTimeSelected(!openDropDownTimeSelected)}
          style={localStyle.containerOpenNow}
        >
          <IconHistoryTime />
          <LabelOpenTime
            style={localStyle.labelOpenNow}
            data={selectedLocation?.appointmentTimeSlot}
          />
          {openDropDownTimeSelected ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          )}
        </div>
        <DropDownTimeSelected isOpen={openDropDownTimeSelected} />
      </div>
    );
  };

  const ListLocations = ({ item }) => {
    const localStyle = {
      container: {
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        borderRadius: '10px',
        padding: '10px 0px',
        marginBottom: '15px',
        cursor: 'pointer',
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
        onClick={() => handleSelectedOutlet(item)}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 75px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
          }}
        >
          <div style={{ justifySelf: 'center', marginTop: '6px' }}>
            <IconPlace />
          </div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{ fontWeight: 500, color: 'black', marginRight: '5px' }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'rgba(183, 183, 183, 1)',
                  justifySelf: 'end',
                  marginRight: '10px',
                }}
              >
                {item?.distance && `( ${item?.distance}km) `}
              </div>
            </div>
            <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
              {item?.address}
            </div>
            {item?.latitude > 0 && item?.longitude > 0 && (
              <div style={localStyle.containerAccordion}>
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    seeDirectionHandler(item.latitude, item.longitude);
                  }}
                  className={fontStyles.myFont}
                  style={localStyle.labelSeeDirection}
                >
                  See Direction
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={(event) => {
            event.stopPropagation();
            if (otherOutletDropdownSelected === item.id) {
              setOtherOutletDropdownSelected('');
            } else {
              setOtherOutletDropdownSelected(item.id);
            }
          }}
          style={localStyle.containerOpenNow}
        >
          <IconHistoryTime />
          <LabelOpenTime
            style={localStyle.labelOpenNow}
            data={item?.appointmentTimeSlot}
          />
          {otherOutletDropdownSelected === item.id ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          )}
        </div>
        <DropDownTimeSelected
          isOpen={otherOutletDropdownSelected === item.id}
          data={item?.appointmentTimeSlot}
        />
      </div>
    );
  };

  const RenderLabel = () => {
    return (
      <div
        style={{
          display: 'flex',
          marginTop: '15px',
        }}
      >
        <p style={{ fontWeight: 'bold', color: 'black' }}>Chosen Location</p>
      </div>
    );
  };

  const RenderListLocation = () => {
    let filterOutletSelected = [];
    if (!isEmpty(selectedLocation)) {
      filterOutletSelected = outlets.filter(
        (item) =>
          item.id !== selectedLocation.id && !isEmpty(item.appointmentTimeSlot)
      );
    } else {
      filterOutletSelected = outlets.filter(
        (item) => !isEmpty(item.appointmentTimeSlot)
      );
    }
    return (
      <React.Fragment>
        {!isEmpty(selectedLocation) && (
          <>
            <RenderLabel />
            <LocationSelected />
          </>
        )}
        <div style={{ marginTop: !isEmpty(selectedLocation) ? '43px' : 0 }}>
          {!isEmpty(selectedLocation) && (
            <div
              style={{
                color: 'black',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              Other Location
            </div>
          )}
          {!isEmpty(filterOutletSelected) ? (
            filterOutletSelected.map((item) => (
              <ListLocations key={item.name} item={item} />
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                height: `${height * 0.8}px`,
              }}
            >
              <span style={{ marginBottom: '24px' }}>
                <img
                  src={imgOutletClosed}
                  width={164}
                  height={164}
                  alt='ic_button'
                />
              </span>
              <span style={{ fontWeight: 700 }}>No Outlet Available</span>
              <p style={{ fontSize: '14px' }}>
                Oops! It looks like all the outlet are currently closed.
                <br />
                Please check back later for more booking options.
              </p>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '60px 1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '"."\n    "."',
          }}
        >
          <AppointmentHeader
            color={color}
            label='Location'
            onBack={() => history.goBack()}
          />
          <div
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <RenderListLocation />
          </div>
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
              borderRadius: '8px',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              display: 'grid',
              overflowY: 'auto',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <AppointmentHeader
              color={color}
              label='Location'
              onBack={() => history.goBack()}
            />
            <RenderListLocation />
          </div>
        </div>
      );
    }
  };

  return (
    <LoadingOverlayCustom
      active={isLoading}
      spinner
      text='Deleted your cart...'
    >
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
            onClick={async () => {
              dispatch({
                type: CONSTANT.LOCATION_APPOINTMENT_PERSISTED,
                payload: locationAppointment,
              });
              if (cartAppointment?.details?.length > 0) {
                setIsLoading(true);
                await dispatch(OrderAction.deleteCartAppointment());
                setIsLoading(false);
              }
              dispatch({ type: CONSTANT.IS_LOCATION_SELECTED, payload: false });
              dispatch({
                type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT_LOCATION_PAGE,
                payload: false,
              });
              dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 2 });
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
    </LoadingOverlayCustom>
  );
};

export default Location;
