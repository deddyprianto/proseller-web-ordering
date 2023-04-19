import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlaceIcon from '@mui/icons-material/Place';
import fontStyles from './style/styles.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProductAction } from 'redux/actions/ProductAction';
import { isEmptyObject } from 'helpers/CheckEmpty';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import './style/loadingspin.css';
import ItemService from './component/ItemService';
import Box from '@mui/material/Box';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import MyLoader from './component/LoaderSkleton';
import { OrderAction } from 'redux/actions/OrderAction';
import SearchBar from './component/SearchBar';


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
  // some state
  const [locationKeys, setLocationKeys] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [messageLoading, setMessageLoading] = useState('Please wait...');
  const [showNotify, setShowNotify] = useState(false);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [openDropDownTime, setOpenDropDownTime] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [cutPrice, setCutPrice] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);

  // initial
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [width, height] = useWindowSize();
  const gadgetScreen = width < 980;
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  // some sl
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
  const selectedLocation = useSelector(
    (state) => state.appointmentReducer.locationAppointment
  );
  const outlet = useSelector((state) => state.outlet.outlets);

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

  // some fn
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  // scss
  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '92vh',
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

  // some Effect
  useEffect(() => {
    dispatch({ type: CONSTANT.DATE_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.TIME_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.STAFFID_APPOINTMENT, payload: '' });
    dispatch({ type: CONSTANT.RESPONSE_SUBMIT_APPOINTMENT, payload: {} });
    dispatch({ type: CONSTANT.TEXT_NOTE, payload: '' });
  }, []);

  useEffect(() => {
    if (isEmptyObject(selectedLocation)) {
      dispatch({ type: CONSTANT.LOCATION_APPOINTMENT, payload: outlet[0] });
    }
  }, [outlet]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        let data = await dispatch(OrderAction.getCartAppointment());
        setIsLoading(false);
        if (!isEmptyObject(data.data)) {
          setShowNotify(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [responseAddCart, selectedLocation]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await dispatch(
        ProductAction.fetchCategoryProduct({
          outlet: selectedLocation,
          orderingMode: orderingSetting?.ShowOrderingModeModalFirst
            ? orderingMode
            : '',
          presetType: 'appointment',
        })
      );
      setSelectedCategory(data.data[0]);
      setIsLoading(false);
    };
    loadData();
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
          presetTypeName: 'appointment',
        })
      );
      setIsLoading(false);
    };
    if (!isEmptyObject(selectedCategory)) {
      loadData();
    }
  }, [selectedCategory, categoryTabAppointment, selectedLocation]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.pathname]);
        if (location.pathname !== '/appointment') {
          dispatch({
            type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
            payload: true,
          });
          history.push('/appointment');
        }
      }
    });
  }, [locationKeys]);

  const IconSearch = () => {
    return (
      <svg
        width={25}
        height={25}
        viewBox='0 0 36 36'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M32.5651 30.4361L27.0001 24.9161C29.1603 22.2227 30.2064 18.804 29.9233 15.363C29.6403 11.922 28.0496 8.72025 25.4784 6.41604C22.9072 4.11184 19.5508 2.88034 16.0995 2.97478C12.6482 3.06922 9.36418 4.48242 6.92281 6.92379C4.48144 9.36516 3.06825 12.6491 2.97381 16.1005C2.87937 19.5518 4.11086 22.9081 6.41507 25.4794C8.71927 28.0506 11.9211 29.6413 15.3621 29.9243C18.803 30.2073 22.2217 29.1612 24.9151 27.0011L30.4351 32.5211C30.5745 32.6617 30.7404 32.7733 30.9232 32.8494C31.106 32.9256 31.3021 32.9648 31.5001 32.9648C31.6981 32.9648 31.8942 32.9256 32.077 32.8494C32.2598 32.7733 32.4257 32.6617 32.5651 32.5211C32.8355 32.2414 32.9866 31.8676 32.9866 31.4786C32.9866 31.0896 32.8355 30.7158 32.5651 30.4361V30.4361ZM16.5001 27.0011C14.4234 27.0011 12.3933 26.3853 10.6666 25.2315C8.9399 24.0778 7.59409 22.4379 6.79937 20.5193C6.00465 18.6006 5.79671 16.4894 6.20186 14.4526C6.607 12.4158 7.60703 10.5449 9.07548 9.07646C10.5439 7.608 12.4149 6.60798 14.4517 6.20283C16.4885 5.79769 18.5997 6.00562 20.5183 6.80034C22.4369 7.59506 24.0768 8.94087 25.2305 10.6676C26.3843 12.3943 27.0001 14.4244 27.0001 16.5011C27.0001 19.2858 25.8939 21.9566 23.9247 23.9257C21.9556 25.8948 19.2849 27.0011 16.5001 27.0011V27.0011Z'
          fill={color.primary}
        />
      </svg>
    );
  };

  const Header = () => {
    const localStyle = {
      container: {
        ...styleSheet.gridStyle,
        marginTop: gadgetScreen ? '25px' : '0px',
        alignItems: 'center',
        justifyItems: 'center',
      },
      label: {
        padding: 0,
        margin: 0,
        justifySelf: 'start',
        fontWeight: 700,
        fontSize: '20px',
        color: color.primary,
      },
    };
    return (
      <div style={localStyle.container}>
        <ArrowBackIosIcon
          sx={{ color: color.primary }}
          fontSize='large'
          onClick={() => {
            props.history.push('/');
          }}
        />
        <div style={localStyle.label}>Appointment</div>
        <div onClick={() => setShowSearchBar(true)}>
          <IconSearch />
        </div>
      </div>
    );
  };

  const Label = () => {
    const localStyle = {
      container: {
        display: 'flex',
        width: '93%',
        margin: 'auto',
        justifyContent: 'space-between',
        marginTop: '25px',
        fontSize: '16px',
      },
    };
    return (
      <div style={localStyle.container}>
        <div style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
          Chosen Location
        </div>
        <div
          style={{ color: color.primary, cursor: 'pointer', fontWeight: 500 }}
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
              color:
                dayName === item.nameOfDay ? 'black' : 'rgba(183, 183, 183, 1)',
              fontWeight: dayName === item.nameOfDay ? 'bold' : 500,
            }}
          >
            <div style={{ fontSize: '14px' }}>{item.nameOfDay}</div>
            <div style={{ fontSize: '14px' }}>
              {item.open} - {item.close}
            </div>
          </li>
        </ul>
      );
    });
  };

  const Location = () => {
    const localStyle = {
      container: {
        width: '93%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
        margin: 'auto',
        borderRadius: '10px',
        padding: '10px 0px',
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
        fontWeight: 600,
        color: 'black',
      },
    };

    return (
      <div style={localStyle.container}>
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
              color: 'black',
            }}
          />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 600, color: 'black' }}>
              {selectedLocation.name}
            </div>

            <table>
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
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'black' }}>
            800m
          </div>
        </div>
        <div
          style={localStyle.containerOpenNow}
          onClick={() => setOpenDropDownTime(!openDropDownTime)}
        >
          <AccessTimeIcon style={{ fontSize: '20px', color: 'black' }} />
          <div className={fontStyles.myFont} style={localStyle.labelOpenNow}>
            Open now 13:00 - 22.00
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
  const IconsBlow = ({ name }) => {
    return (
      <svg
        width='19'
        height='18'
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M5.7998 1.51465L10.2998 9.3094L10.6246 9.1219C11.0937 8.85109 11.6116 8.67534 12.1487 8.60469C12.6858 8.53404 13.2315 8.56987 13.7548 8.71014C14.278 8.8504 14.7685 9.09235 15.1982 9.42217C15.6279 9.75199 15.9885 10.1632 16.2593 10.6324L16.3396 10.7719C16.8651 11.6824 17.0074 12.7644 16.7353 13.7799C16.4631 14.7954 15.7987 15.6612 14.8883 16.1869C14.4208 16.4568 13.8653 16.5299 13.344 16.3902C12.8226 16.2506 12.378 15.9095 12.1081 15.4421L9.3998 10.7516L6.6923 15.4421C6.55863 15.6737 6.38065 15.8766 6.16853 16.0393C5.95642 16.2021 5.71432 16.3214 5.45607 16.3906C5.19782 16.4597 4.92848 16.4774 4.66343 16.4424C4.39837 16.4075 4.1428 16.3206 3.9113 16.1869C3.00086 15.6612 2.3365 14.7954 2.06435 13.7799C1.7922 12.7644 1.93453 11.6824 2.46005 10.7719L2.5403 10.6324C3.08733 9.685 3.98829 8.9937 5.04501 8.71056C6.10172 8.42743 7.22763 8.57566 8.17505 9.12265L8.49905 9.31015L8.53355 9.25015L5.2508 3.56365C5.0519 3.21913 4.998 2.80971 5.10095 2.42545C5.20391 2.04119 5.45529 1.71357 5.7998 1.51465V1.51465ZM3.8393 11.3824L3.75905 11.5219C3.43244 12.0879 3.344 12.7605 3.5132 13.3917C3.6824 14.0229 4.09537 14.5611 4.6613 14.8879C4.91705 15.0356 5.2448 14.9479 5.39255 14.6921L7.7498 10.6091L7.42505 10.4216C6.82221 10.0738 6.10591 9.97961 5.43364 10.1598C4.76136 10.3399 4.18816 10.7797 3.84005 11.3824H3.8393ZM11.3746 10.4216L11.0498 10.6091L13.4071 14.6921C13.4781 14.815 13.595 14.9047 13.7322 14.9414C13.8693 14.9781 14.0154 14.9588 14.1383 14.8879C14.7042 14.5611 15.1172 14.0229 15.2864 13.3917C15.4556 12.7605 15.3672 12.0879 15.0406 11.5219L14.9603 11.3824C14.6122 10.7795 14.0389 10.3396 13.3664 10.1594C12.6939 9.97924 11.9775 10.0736 11.3746 10.4216V10.4216ZM12.9998 1.51465C13.3268 1.70341 13.5706 2.00856 13.6826 2.3692C13.7945 2.72983 13.7663 3.11941 13.6036 3.46015L13.5488 3.56365L11.1286 7.75615L10.2623 6.25615L12.9998 1.51465Z'
          fill={selectedCategory.name === name ? color.primary : 'gray'}
        />
      </svg>
    );
  };
  const IconsNails = ({ name }) => {
    return (
      <svg
        width={19}
        height={18}
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M16.7 9C16.7 13.1422 13.3422 16.5 9.19995 16.5C5.0577 16.5 1.69995 13.1422 1.69995 9C1.69995 4.85775 5.0577 1.5 9.19995 1.5'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M14.4499 3.55176L14.5785 3.94776H14.9948L14.658 4.19226L14.7867 4.58826L14.4499 4.34376L14.1132 4.58826L14.2418 4.19226L13.905 3.94776H14.3213L14.4499 3.55176Z'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          strokeWidth={1.5}
        />
        <path
          d='M11.45 7.125C11.45 5.88236 10.4426 4.875 9.19995 4.875C7.95731 4.875 6.94995 5.88236 6.94995 7.125V11.625C6.94995 12.8676 7.95731 13.875 9.19995 13.875C10.4426 13.875 11.45 12.8676 11.45 11.625V7.125Z'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.94995 9.375C6.19995 9.375 5.07495 10.1693 5.07495 11.625V15.294M11.45 9.375C12.2 9.375 13.325 10.1693 13.325 11.625V15.1875'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };

  const IconsReflexology = ({ name }) => {
    return (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3 13.5C3.41421 13.5 3.75 13.1642 3.75 12.75C3.75 12.3358 3.41421 12 3 12C2.58579 12 2.25 12.3358 2.25 12.75C2.25 13.1642 2.58579 13.5 3 13.5Z'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M6.75 4.5C7.16421 4.5 7.5 4.16421 7.5 3.75C7.5 3.33579 7.16421 3 6.75 3C6.33579 3 6 3.33579 6 3.75C6 4.16421 6.33579 4.5 6.75 4.5Z'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M3 16.5L6 15V12.75H15M8.25 15H15M6 10.5L8.25 9L9 6C11.25 6.75 11.25 9 11.25 10.5'
          stroke={selectedCategory.name === name ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    );
  };

  const handleIconsTab = (item) => {
    switch (item.name) {
      case 'Beauty Salon Preset':
        return <IconsBlow name={item.name} />;
      case 'Massage Preset':
        return <IconsNails name={item.name} />;
      case 'Hair & Colouring Preset':
        return <IconsReflexology name={item.name} />;
      default:
        return null;
    }
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
            value={selectedCategory.name}
            onChange={handleChange}
            sx={styleSheet.indicatorForMobileView}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
          >
            {categoryTabAppointment.map((item, i) => (
              <Tab
                icon={handleIconsTab(item)}
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
        </div>
      </div>
    );
  };

  const RenderTabHeaderDekstop = () => {
    return (
      <Box
        sx={{
          width: '600px',
        }}
      >
        <Tabs
          value={selectedCategory.name}
          onChange={handleChange}
          sx={styleSheet.indicator}
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {categoryTabAppointment.map((item, i) => (
            <Tab
              icon={handleIconsTab(item)}
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
        marginTop: gadgetScreen ? '0px' : '5px',
      },
      subContainer: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.primary,
        borderRadius: '5px',
        padding: '10px',
      },
      containerLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: { color: 'white', fontSize: '14px' },
      icon: { color: 'white', marginRight: '10px' },
    };
    return (
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
          <div style={{ ...localStyle.label, fontWeight: 'bold' }}>
            {handleCurrency(cartAppointment?.totalNettAmount)}
          </div>
        </div>
      </div>
    );
  };

  const Services = () => {
    const localStyle = {
      container: {
        width: '93%',
        margin: 'auto',
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
            <MyLoader />
          ) : (
            <React.Fragment>
              {productServicesAppointment.map((item) => {
                const isCheckedService = cartAppointment?.details?.some(
                  (items) => items.product.name === item.product.name
                );
                return (
                  <ItemService
                    isCheckedService={isCheckedService}
                    setIsOpenModalDetail={setIsOpenModalDetail}
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
            height: '270px',
            width: '65%',
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

  const ResponsiveLayout = () => {
    const isNotifShowWithIphoneSE = showNotify && height <= 667;
    const isNotifShowWithIphone14 = showNotify && height >= 844;
    const styleAppliedToDevice = {
      height: showNotify ? '77vh' : '85vh',
      overflowY: 'auto',
    };
    if (gadgetScreen) {
      return (
        <div className={fontStyles.myFont} style={styleAppliedToDevice}>
          <Header />
          {!isEmptyObject(selectedLocation) && (
            <>
              <Label />
              <Location />
              <DropDownTime />
              <Services />
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <di
              style={{
                marginTop: '20px',
              }}
            >
              <Header />
              <Label />
              <Location />
              <Services />
            </di>
          </div>
        </div>
      );
    }
  };

  return (
    <LoadingOverlayCustom
      active={isLoading}
      spinner={<RenderAnimationLoading />}
      text={messageLoading}
    >
      <ResponsiveLayout />
      {showNotify && <RendernNotifSuccess />}
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
        <div style={{ marginTop: '20px' }}>
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
            Some booked services you have not submitted might not be saved in
            our system. Are you sure?
          </div>
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
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (cartAppointment?.details?.length > 0) {
                setIsLoading(true);
                setMessageLoading('Delete your cart...');
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
            marginTop: '15px',
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
    </LoadingOverlayCustom>
  );
};

export default Appointment;
