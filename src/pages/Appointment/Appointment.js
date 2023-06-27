import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { ProductAction } from 'redux/actions/ProductAction';
import { isEmptyObject } from 'helpers/CheckEmpty';
import fontStyles from './style/styles.module.css';
import './style/loadingspin.css';
import { CONSTANT } from 'helpers';
import ItemService from './component/ItemService';
import { OrderAction } from 'redux/actions/OrderAction';
import SearchBar from './component/SearchBar';
import screen from 'hooks/useWindowSize';
import AppointmentHeader from 'components/appointmentHeader';
import { isEmpty } from 'helpers/utils';
import Swal from 'sweetalert2';
import { IconHistoryTime, IconPlace } from 'assets/iconsSvg/Icons';

const Appointment = (props) => {
  const [openWarningOutletNotSelected, setOpenWarningOutletNotSelected] =
    useState(false);
  const [selectedLocationPersisted, setSelectedLocationPersisted] =
    useState(null);
  const [locationKeys, setLocationKeys] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [openDropDownTime, setOpenDropDownTime] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  const locationPersisted = localStorage.getItem(
    'LOCATION_APPOINTMENT_PERSISTED'
  );

  const setting = useSelector((state) => state.order.setting);
  const menuSidebar = useSelector((state) => state.theme.menu);
  const indexPath = useSelector((state) => state.appointmentReducer.indexPath);
  const responseAddCart = useSelector(
    (state) => state.appointmentReducer.responseAddCart
  );
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const productServicesAppointment = useSelector(
    (state) => state.product.productServicesAppointment
  );
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);

  const selectedLocation = !isEmptyObject(selectedLocationPersisted)
    ? selectedLocationPersisted
    : defaultOutlet;

  const categoryTabAppointment = useSelector(
    (state) => state.product.categoryTabAppointment
  );

  const color = useSelector((state) => state.theme.color);
  const isOpenModalLeavePage = useSelector(
    (state) => state.appointmentReducer.isOpenModalLeavePage
  );
  const orderingSetting = useSelector((state) => state.order.orderingSetting);
  const orderingMode = useSelector((state) => state.order.orderingMode);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  const handleButtonSure = async () => {
    if (cartAppointment?.details?.length > 0) {
      setIsLoading(true);
      await dispatch(OrderAction.deleteCartAppointment());
      setIsLoading(false);
    }
    dispatch({
      type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
      payload: false,
    });
    let path;
    menuSidebar.navBar.forEach((item, i) => {
      if (i === indexPath) {
        path = item.path;
      }
    });
    if (selectedLocationPersisted) {
      localStorage.removeItem('LOCATION_APPOINTMENT_PERSISTED');
    }
    dispatch({ type: CONSTANT.INDEX_FOOTER, payload: indexPath });
    window.location.href = changeFormatURl(path);
  };
  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };

  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: showNotify ? '90vh' : '98vh',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 55px',
      gap: '0px 15px',
      gridTemplateAreas: '"."\n    "."',
      overflowY: 'auto',
      marginTop: '10px',
      paddingLeft: '16px',
      paddingRight: '16px',
      position: 'relative',
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      cursor: 'pointer',
    },
    paper: {
      maxHeight: 500,
      overflow: 'auto',
      backgroundColor: 'white',
    },
    categoryName: {
      color: 'gray',
      fontSize: '15px',
      fontWeight: 500,
      textTransform: 'capitalize',
    },
    muiSelected: {
      '&.MuiButtonBase-root': {
        fontSize: '14px',
        textTransform: 'capitalize',
        fontWeight: 600,
        '&:hover': {
          color: 'rgba(138, 141, 142, 1)',
        },
      },
      '&.Mui-selected': {
        color: color.primary,
        fontSize: '14px',
        textTransform: 'capitalize',
      },
      '&.MuiTab-labelIcon': {
        fontSize: '14px',
        textTransform: 'capitalize',
      },
    },
    indicator: {
      '& .MuiTabScrollButton-root': {
        padding: 0,
        margin: 0,
        width: 15,
      },
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
    indicatorForMobileView: {
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
    inputDropdown: {
      '&.MuiSelect-select': {
        border: 'none',
      },
    },
  };

  useEffect(() => {
    if (cartAppointment?.isError) {
      Swal.fire({
        icon: 'info',
        iconColor: '#333',
        title: cartAppointment?.message,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: color.primary,
        customClass: {
          confirmButton: fontStyles.buttonSweetAlert,
          icon: fontStyles.customIconColor,
        },
      });
    }
  }, [cartAppointment, color.primary]);

  useEffect(() => {
    if (!isEmpty(locationPersisted)) {
      setOpenWarningOutletNotSelected(true);
    } else {
      history.push('/location');
    }
  }, [history, locationPersisted]);

  useEffect(() => {
    const selectedLocationPersisted = JSON.parse(locationPersisted);
    setSelectedLocationPersisted(selectedLocationPersisted);
  }, [locationPersisted]);

  useEffect(() => {
    dispatch({
      type: CONSTANT.IS_DATE_SELECTED,
      payload: false,
    });
    dispatch({ type: CONSTANT.DATE_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.TIME_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.STAFFID_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.RESPONSE_SUBMIT_APPOINTMENT, payload: {} });
    dispatch({ type: CONSTANT.TEXT_NOTE, payload: '' });
    dispatch({
      type: CONSTANT.CART_SAVE_APPOINTMENT,
      payload: {},
    });
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      let data = await dispatch(OrderAction.getCartAppointment());
      setIsLoading(false);
      if (!isEmptyObject(data)) {
        setShowNotify(true);
      }
    };
    loadData();
  }, [responseAddCart, selectedLocation, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (selectedLocation?.id) {
        const data = await dispatch(
          ProductAction.fetchCategoryProduct({
            outlet: selectedLocation,
            orderingMode: orderingSetting?.ShowOrderingModeModalFirst
              ? orderingMode
              : '',
            presetType: 'webOrdering-appointment',
          })
        );
        setSelectedCategory(data.data[0]);
      }
      setIsLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(
        ProductAction.fetchProductAppointment({
          category: selectedCategory,
          outlet: selectedLocation,
          skip: 0,
          take: 10,
          presetTypeName: 'webOrdering-appointment',
        })
      );
      setIsLoading(false);
    };
    if (!isEmptyObject(selectedCategory)) {
      loadData();
    }
  }, [selectedCategory, categoryTabAppointment, selectedLocation, dispatch]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.pathname]);
        if (
          location.pathname !== '/appointment' &&
          !isEmptyObject(cartAppointment)
        ) {
          dispatch({
            type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
            payload: true,
          });
          history.push('/appointment');
        }
      }
    });
  }, [cartAppointment, locationKeys, dispatch, history]);

  const Label = () => {
    const localStyle = {
      container: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        fontSize: '16px',
      },
    };
    return (
      <div style={localStyle.container}>
        <div style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
          Chosen Location
        </div>
        <div
          style={{
            color: color.primary,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '16px',
          }}
          onClick={() => {
            window.location.href = changeFormatURl('/location');
          }}
        >
          Change
        </div>
      </div>
    );
  };

  const RenderTimeList = () => {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayName = dayNames[dayOfWeek];

    const timeSlot = selectedLocation?.appointmentTimeSlot;

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
              color: dayName === item.text ? 'black' : 'rgba(183, 183, 183, 1)',
              fontWeight: dayName === item.text ? 'bold' : 500,
            }}
          >
            <div style={{ fontSize: '14px' }}>
              {dayName === item.text ? 'Today' : item.text}
            </div>
            <div style={{ fontSize: '14px' }}>
              {item.start} - {item.end}
            </div>
          </li>
        </ul>
      );
    });
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

  const Location = () => {
    const localStyle = {
      container: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '10px 0px',
        marginTop: '16px',
      },
      containerAccordion: {
        width: '93%',
        display: 'flex',
        alignItems: 'center',
      },
      labelSeeDirection: {
        fontSize: '14px',
        fontWeight: 600,
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
        fontWeight: 600,
        color: 'black',
      },
    };

    return (
      <div style={localStyle.container}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              justifySelf: 'center',
              marginTop: '5px',
            }}
          >
            <IconPlace />
          </div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 600, color: 'black' }}>
              {selectedLocation?.name}
            </div>

            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      padding: 0,
                      margin: 0,
                      fontSize: '12px',
                      color: 'rgba(183, 183, 183, 1)',
                      fontWeight: 500,
                    }}
                  >
                    {selectedLocation?.address}
                  </td>
                </tr>
              </tbody>
            </table>
            {selectedLocation?.latitude > 0 &&
              selectedLocation?.longitude > 0 && (
                <div style={localStyle.containerAccordion}>
                  <div
                    onClick={() => {
                      window.open(
                        'https://maps.google.com?q=' +
                          selectedLocation?.latitude +
                          ',' +
                          selectedLocation?.longitude
                      );
                    }}
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
          style={localStyle.containerOpenNow}
          onClick={() => setOpenDropDownTime(!openDropDownTime)}
        >
          <IconHistoryTime />
          <LabelOpenTime
            style={localStyle.labelOpenNow}
            data={selectedLocation?.appointmentTimeSlot}
          />
          {openDropDownTime ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '20px', fontWeight: 500 }} />
          )}
        </div>
      </div>
    );
  };
  const RenderAnimationLoading = () => {
    return (
      <div className='lds-spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  const RenderTabHeaderMobile = () => {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            marginBottom: '10px',
          }}
        >
          <Tabs
            value={selectedCategory?.index || 0}
            sx={styleSheet.indicatorForMobileView}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
          >
            {categoryTabAppointment.map((item, i) => (
              <Tab
                onClick={() => {
                  setSelectedCategory({ ...item, index: i });
                }}
                key={item.id}
                label={item.name}
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
            ))}
          </Tabs>
        </div>
      </div>
    );
  };

  const RenderTabHeaderDekstop = () => {
    return (
      <Box
        sx={{
          width: '580px',
          marginBottom: '20px',
        }}
      >
        <Tabs
          centered
          value={selectedCategory.name}
          sx={styleSheet.indicator}
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {categoryTabAppointment.map((item, i) => (
            <Tab
              value={item.name}
              onClick={() => {
                setSelectedCategory(item);
              }}
              key={item.id}
              label={item.name}
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
          ))}
        </Tabs>
      </Box>
    );
  };
  const RendernNotifSuccess = () => {
    const localStyle = {
      container: {
        width: gadgetScreen ? '100%' : '47%',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        alignItems: 'center',
        margin: 'auto',
        marginBottom: '2px',
      },
      subContainer: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.primary,
        borderRadius: '5px',
        padding: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 11px',
        border: '1px solid white',
      },
      containerLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: { color: 'white', fontSize: '14px' },
      icon: { color: 'white', marginRight: '10px', fontSize: '20px' },
    };
    if (showNotify) {
      return (
        <Paper
          variant='elevation'
          square={gadgetScreen}
          elevation={0}
          sx={
            gadgetScreen
              ? {
                  zIndex: '999',
                  width: '100%',
                  margin: 0,
                  top: 'auto',
                  right: 'auto',
                  bottom: gadgetScreen.height < 500 ? 0 : 80,
                  left: 'auto',
                  position: 'fixed',
                }
              : {
                  padding: 0,
                  margin: 0,
                }
          }
        >
          <div
            onClick={() => {
              window.location.href = changeFormatURl('/cartappointment');
            }}
            className={fontStyles.myFont}
            style={localStyle.container}
          >
            <div style={localStyle.subContainer}>
              <div style={localStyle.containerLabel}>
                <CheckCircleIcon sx={localStyle.icon} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <div>{cartAppointment?.details?.length}</div>
                  <div style={{ marginLeft: '5px' }}>Service Selected</div>
                </div>
              </div>
              <div
                style={{
                  ...localStyle.label,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {settingAppoinment?.settingValue
                  ? handleCurrency(cartAppointment?.totalNettAmount)
                  : 'See all'}
              </div>
            </div>
          </div>
        </Paper>
      );
    } else {
      return null;
    }
  };

  const Services = () => {
    const localStyle = {
      container: {
        marginTop: '25px',
      },
      label: {
        fontWeight: 'bold',
        padding: 0,
        margin: 0,
        color: 'black',
        marginBottom: '10px',
        fontSize: '16px',
      },
    };
    return (
      <div style={localStyle.container}>
        <div style={localStyle.label}>Services</div>
        <TabsUnstyled value={`${selectedCategory.name}`}>
          {gadgetScreen ? (
            <RenderTabHeaderMobile />
          ) : (
            <RenderTabHeaderDekstop />
          )}
          {isLoading ? (
            <RenderAnimationLoading />
          ) : (
            <React.Fragment>
              {productServicesAppointment.map((item) => {
                const isCheckedService = cartAppointment?.details?.some(
                  (items) => items.product.name === item.product.name
                );
                return (
                  <ItemService
                    key={item.id}
                    selectedLocation={selectedLocation}
                    settingAppoinment={settingAppoinment?.settingValue}
                    isCheckedService={isCheckedService}
                    item={item?.product}
                    gadgetScreen={gadgetScreen}
                    fullScreen={fullScreen}
                    styleSheet={styleSheet}
                    productId={item?.productID}
                    handleCurrency={handleCurrency}
                  />
                );
              })}
            </React.Fragment>
          )}
        </TabsUnstyled>
      </div>
    );
  };
  const DropDownTime = () => {
    if (openDropDownTime) {
      return (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            height: 'auto',
            width: '65%',
            padding: '0px 10px',
            borderRadius: '5px',
            zIndex: 9999999,
            left: 13,
            top: !gadgetScreen && '35%',
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

  const RenderMainContent = () => {
    function handleScroll() {
      if (openDropDownTime) {
        setOpenDropDownTime(false);
      }
    }
    if (!isEmptyObject(selectedLocation)) {
      return (
        <div
          style={{ height: '80vh ', overflowY: 'auto' }}
          onScroll={handleScroll}
        >
          <div
            style={{
              paddingBottom: 100,
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <Label />
            <Location />
            <DropDownTime />
            <hr
              style={{
                color: 'rgba(214, 214, 214, 1)',
                marginTop: '24px',
                opacity: 0.6,
              }}
            />
            <Services />
          </div>
          <RendernNotifSuccess />
        </div>
      );
    } else {
      return null;
    }
  };

  const ResponsiveLayout = () => {
    function handleScroll() {
      if (openDropDownTime) {
        setOpenDropDownTime(false);
      }
    }
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
            onSearch={() => setShowSearchBar(true)}
            isSearch
            onBack={() => {
              if (isEmptyObject(cartAppointment)) {
                dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 0 });
              }
              setOpenDropDownTime(false);
              props.history.push('/');
            }}
          />
          <RenderMainContent />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container} onScroll={handleScroll}>
            <AppointmentHeader
              color={color}
              onSearch={() => setShowSearchBar(true)}
              isSearch
              onBack={() => {
                if (isEmptyObject(cartAppointment)) {
                  dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 0 });
                }
                setOpenDropDownTime(false);
                props.history.push('/');
              }}
            />
            <Label />
            <Location />
            <DropDownTime />
            <Services />
          </div>
          <RendernNotifSuccess />
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      {openWarningOutletNotSelected && <ResponsiveLayout />}
      <Dialog
        fullWidth
        maxWidth='xs'
        open={isOpenModalLeavePage}
        onClose={() =>
          dispatch({ type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT, payload: false })
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
          Leaving Appointment Page
        </DialogTitle>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            height: '2px',
            marginTop: '16px',
          }}
        />
        <div
          className={fontStyles.myFont}
          style={{
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: '21px',
          }}
        >
          Some booked services you have not submitted might not be saved in our
          system. Are you sure?
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            height: '2px',
            marginTop: '16px',
          }}
        />
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <button
            onClick={() =>
              dispatch({
                type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
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
              marginRight: '10px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleButtonSure}
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

      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
        open={showSearchBar}
        onClose={() => setShowSearchBar(false)}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SearchBar
            defaultOutlet={selectedLocation?.id}
            color={color}
            setShowSearchBar={setShowSearchBar}
            styleSheet={styleSheet}
            gadgetScreen={gadgetScreen}
            productServicesAppointment={productServicesAppointment}
          />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Appointment;
