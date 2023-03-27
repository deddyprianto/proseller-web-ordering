import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import fontStyles from './style/styles.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CONSTANT } from 'helpers';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchBar from './component/SearchBar';
import { ProductAction } from 'redux/actions/ProductAction';
import { isEmptyObject } from 'helpers/CheckEmpty';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import './style/loadingspin.css';
import ListService from './component/ListService';

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
  const [idProdService, setIdProdService] = useState('');
  const [isMore, setIsMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [dataProServices, setDataProServices] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [cutPrice, setCutPrice] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [locationKeys, setLocationKeys] = useState([]);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [limitCategoryTabHeader, setLimitCategoryTabHeader] = useState(8);

  // initial
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  // some selectors
  const productServicesAppointment = useSelector(
    (state) => state.product.productServicesAppointment
  );
  const categoryTabAppointment = useSelector(
    (state) => state.product.categoryTabAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const isOpenModalLeavePage = useSelector(
    (state) => state.AppointmentReducer.isOpenModalLeavePage
  );
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const orderingSetting = useSelector((state) => state.order.orderingSetting);
  const orderingMode = useSelector((state) => state.order.orderingMode);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();
  // some functions
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
      cursor: 'pointer',
    },
    paper: {
      maxHeight: 500,
      overflow: 'auto',
      backgroundColor: 'white',
    },
    categoryName: {
      fontSize: '14px',
    },
    muiSelected: {
      '&.MuiButtonBase-root': {
        fontSize: '14px',
        textTransform: 'capitalize',
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
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
  };
  // some Effect
  useEffect(() => {
    if (width < 600) {
      setLimitCategoryTabHeader(3);
    }
    if (width > 750) {
      setLimitCategoryTabHeader(5);
    }
    if (width >= 1000) {
      setLimitCategoryTabHeader(6);
    }
  }, [width]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await dispatch(
        ProductAction.fetchCategoryProduct({
          outlet: defaultOutlet,
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
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(
        ProductAction.fetchProductAppointment({
          category: selectedCategory,
          outlet: defaultOutlet,
          skip: 0,
          take: 10,
          presetTypeName: 'appointment',
        })
      );
    };
    if (!isEmptyObject(selectedCategory)) {
      loadData();
    }
  }, [selectedCategory, categoryTabAppointment]);

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
          fontSize='large'
          onClick={() => {
            props.history.push('/');
          }}
        />
        <div style={localStyle.label}>Appointment</div>
        <SearchIcon fontSize='large' onClick={() => setShowSearchBar(true)} />
      </div>
    );
  };

  const Label = () => {
    const localStyle = {
      container: {
        display: 'flex',
        width: '90%',
        margin: 'auto',
        justifyContent: 'space-between',
        marginTop: '25px',
        fontSize: '14px',
      },
    };
    return (
      <div style={localStyle.container}>
        <div style={{ fontWeight: 'bold' }}>Chosen Location</div>
        <div
          style={{ color: color.primary, cursor: 'pointer' }}
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
    return data.map((item, i) => {
      return (
        <ul key={i} style={{ padding: '5px 0px', margin: 0 }}>
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

  const Location = () => {
    const localStyle = {
      container: {
        width: '95%',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 18px 0px',
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
        marginTop: openAccordion && '25px',
      },
      labelOpenNow: { fontSize: '14px', marginLeft: '10px', fontWeight: 500 },
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
            }}
          />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 500 }}>Connection One</div>
            <div style={{ color: 'rgba(183, 183, 183, 1)' }}>
              169 Bukit Merah Central, Singapore
            </div>
            <div style={localStyle.containerAccordion}>
              <Accordion
                sx={{ boxShadow: 'none', padding: 0, margin: 0 }}
                expanded={openAccordion}
                onChange={() => setOpenAccordion(!openAccordion)}
              >
                <AccordionSummary
                  sx={{ padding: 0, margin: 0 }}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <div
                    className={fontStyles.myFont}
                    style={localStyle.labelSeeDirection}
                  >
                    See Direction
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <RenderTimeList />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>800m</div>
        </div>
        <div style={localStyle.containerOpenNow}>
          <AccessTimeIcon style={{ fontSize: '20px' }} />
          <div className={fontStyles.myFont} style={localStyle.labelOpenNow}>
            Open now 13:00 - 22.00
          </div>
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

  const IconsBlow = () => {
    return (
      <svg
        width='19'
        height='18'
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <divath
          fillRule='evenodd'
          clipRule='evenodd'
          d='M5.7998 1.51465L10.2998 9.3094L10.6246 9.1219C11.0937 8.85109 11.6116 8.67534 12.1487 8.60469C12.6858 8.53404 13.2315 8.56987 13.7548 8.71014C14.278 8.8504 14.7685 9.09235 15.1982 9.42217C15.6279 9.75199 15.9885 10.1632 16.2593 10.6324L16.3396 10.7719C16.8651 11.6824 17.0074 12.7644 16.7353 13.7799C16.4631 14.7954 15.7987 15.6612 14.8883 16.1869C14.4208 16.4568 13.8653 16.5299 13.344 16.3902C12.8226 16.2506 12.378 15.9095 12.1081 15.4421L9.3998 10.7516L6.6923 15.4421C6.55863 15.6737 6.38065 15.8766 6.16853 16.0393C5.95642 16.2021 5.71432 16.3214 5.45607 16.3906C5.19782 16.4597 4.92848 16.4774 4.66343 16.4424C4.39837 16.4075 4.1428 16.3206 3.9113 16.1869C3.00086 15.6612 2.3365 14.7954 2.06435 13.7799C1.7922 12.7644 1.93453 11.6824 2.46005 10.7719L2.5403 10.6324C3.08733 9.685 3.98829 8.9937 5.04501 8.71056C6.10172 8.42743 7.22763 8.57566 8.17505 9.12265L8.49905 9.31015L8.53355 9.25015L5.2508 3.56365C5.0519 3.21913 4.998 2.80971 5.10095 2.42545C5.20391 2.04119 5.45529 1.71357 5.7998 1.51465V1.51465ZM3.8393 11.3824L3.75905 11.5219C3.43244 12.0879 3.344 12.7605 3.5132 13.3917C3.6824 14.0229 4.09537 14.5611 4.6613 14.8879C4.91705 15.0356 5.2448 14.9479 5.39255 14.6921L7.7498 10.6091L7.42505 10.4216C6.82221 10.0738 6.10591 9.97961 5.43364 10.1598C4.76136 10.3399 4.18816 10.7797 3.84005 11.3824H3.8393ZM11.3746 10.4216L11.0498 10.6091L13.4071 14.6921C13.4781 14.815 13.595 14.9047 13.7322 14.9414C13.8693 14.9781 14.0154 14.9588 14.1383 14.8879C14.7042 14.5611 15.1172 14.0229 15.2864 13.3917C15.4556 12.7605 15.3672 12.0879 15.0406 11.5219L14.9603 11.3824C14.6122 10.7795 14.0389 10.3396 13.3664 10.1594C12.6939 9.97924 11.9775 10.0736 11.3746 10.4216V10.4216ZM12.9998 1.51465C13.3268 1.70341 13.5706 2.00856 13.6826 2.3692C13.7945 2.72983 13.7663 3.11941 13.6036 3.46015L13.5488 3.56365L11.1286 7.75615L10.2623 6.25615L12.9998 1.51465Z'
          fill={value === 0 ? color.primary : 'gray'}
        />
      </svg>
    );
  };
  const IconsNails = () => {
    return (
      <svg
        width={19}
        height={18}
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <divath
          d='M16.7 9C16.7 13.1422 13.3422 16.5 9.19995 16.5C5.0577 16.5 1.69995 13.1422 1.69995 9C1.69995 4.85775 5.0577 1.5 9.19995 1.5'
          stroke={value === 1 ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <divath
          d='M14.4499 3.55176L14.5785 3.94776H14.9948L14.658 4.19226L14.7867 4.58826L14.4499 4.34376L14.1132 4.58826L14.2418 4.19226L13.905 3.94776H14.3213L14.4499 3.55176Z'
          stroke={value === 1 ? color.primary : 'gray'}
          strokeWidth={1.5}
        />
        <divath
          d='M11.45 7.125C11.45 5.88236 10.4426 4.875 9.19995 4.875C7.95731 4.875 6.94995 5.88236 6.94995 7.125V11.625C6.94995 12.8676 7.95731 13.875 9.19995 13.875C10.4426 13.875 11.45 12.8676 11.45 11.625V7.125Z'
          stroke={value === 1 ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <divath
          d='M6.94995 9.375C6.19995 9.375 5.07495 10.1693 5.07495 11.625V15.294M11.45 9.375C12.2 9.375 13.325 10.1693 13.325 11.625V15.1875'
          stroke={value === 1 ? color.primary : 'gray'}
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };

  const IconsReflexology = () => {
    return (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <divath
          d='M3 13.5C3.41421 13.5 3.75 13.1642 3.75 12.75C3.75 12.3358 3.41421 12 3 12C2.58579 12 2.25 12.3358 2.25 12.75C2.25 13.1642 2.58579 13.5 3 13.5Z'
          stroke={value === 2 ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <divath
          d='M6.75 4.5C7.16421 4.5 7.5 4.16421 7.5 3.75C7.5 3.33579 7.16421 3 6.75 3C6.33579 3 6 3.33579 6 3.75C6 4.16421 6.33579 4.5 6.75 4.5Z'
          stroke={value === 2 ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <divath
          d='M3 16.5L6 15V12.75H15M8.25 15H15M6 10.5L8.25 9L9 6C11.25 6.75 11.25 9 11.25 10.5'
          stroke={value === 2 ? color.primary : 'gray'}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    );
  };

  const RenderTabList = () => {
    const categoryTabList = categoryTabAppointment.slice(
      limitCategoryTabHeader
    );
    return (
      <Collapse in={isMore}>
        <Paper style={styleSheet.paper} className={fontStyles.myFont}>
          {categoryTabList.map((category, index) => {
            return (
              <div className={classes.itemMoreHover} key={index}>
                <Button
                  key={index}
                  onClick={() => {
                    // handleChangeCategory({ category, index });
                    setSelectedCategory(category);
                    setIsMore(false);
                  }}
                >
                  <div style={styleSheet.categoryName}>{category.name}</div>
                </Button>
              </div>
            );
          })}
        </Paper>
      </Collapse>
    );
  };

  const RenderTabMore = () => {
    if (isMore) {
      return (
        <Tab
          iconPosition='right'
          icon={<KeyboardArrowDownIcon />}
          label='Less'
          className={fontStyles.myFont}
          sx={styleSheet.muiSelected}
          onClick={() => setIsMore(false)}
        />
      );
    }
    return (
      <Tab
        iconPosition='right'
        icon={<KeyboardArrowDownIcon />}
        label='More'
        className={fontStyles.myFont}
        sx={styleSheet.muiSelected}
        onClick={() => setIsMore(true)}
      />
    );
  };
  const RenderTabHeader = () => {
    const categoryTab = categoryTabAppointment.slice(0, limitCategoryTabHeader);
    return (
      <div sx={{ width: '100%' }}>
        <div
          style={{
            marginBottom: '10px',
          }}
        >
          <Tabs
            value={selectedCategory.name}
            onChange={handleChange}
            aria-label='basic tabs example'
            sx={styleSheet.indicator}
          >
            {categoryTab.map((item) => (
              <Tab
                value={item.name}
                onClick={() => {
                  if (isMore) {
                    setIsMore(false);
                  }
                  setSelectedCategory(item);
                }}
                key={item.id}
                label={item.name}
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
            ))}
            <RenderTabMore />
          </Tabs>
          <RenderTabList />
        </div>
      </div>
    );
  };
  const RendernNotifSuccess = () => {
    const localStyle = {
      container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        alignItems: 'center',
      },
      subContainer: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.primary,
        borderRadius: '5px',
        position: 'absolute',
        bottom: '80px',
        padding: '10px',
        zIndex: '999',
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
            <div style={localStyle.label}>1 Service Selected</div>
          </div>
          <div style={{ ...localStyle.label, fontWeight: 'bold' }}>
            SGD 15.00
          </div>
        </div>
      </div>
    );
  };

  const Services = () => {
    const localStyle = {
      container: {
        width: '95%',
        margin: 'auto',
        marginTop: '25px',
      },
      label: {
        fontWeight: 'bold',
        padding: 0,
        margin: 0,
      },
    };
    return (
      <div style={localStyle.container}>
        <div style={localStyle.label}>Services</div>
        <TabsUnstyled value={`${selectedCategory.name}`}>
          <RenderTabHeader />
          {isLoading ? (
            <RenderAnimationLoading />
          ) : (
            <ListService
              productServicesAppointment={productServicesAppointment}
            />
          )}
        </TabsUnstyled>
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
          <Header />
          <Label />
          <Location />
          <Services />
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
    <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
      {showNotif && <RendernNotifSuccess />}
      <ResponsiveLayout />
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
            onClick={() => {
              dispatch({
                type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
                payload: false,
              });
              window.location.href = changeFormatURl('/');
              window.location.reload();
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
            color={color}
            setShowSearchBar={setShowSearchBar}
            styleSheet={styleSheet}
            gadgetScreen={gadgetScreen}
            dataProServices={dataProServices}
          />
        </div>
      </Dialog>
    </LoadingOverlayCustom>
  );
};

export default Appointment;
