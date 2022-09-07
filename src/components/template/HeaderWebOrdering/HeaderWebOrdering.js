/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter, useHistory } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import { CONSTANT } from '../../../helpers';
import config from '../../../config';
import { OutletAction } from '../../../redux/actions/OutletAction';
import LoginRegister from '../../login-register';
import useMobileSize from 'hooks/useMobileSize';
import Sidebar from './components/Sidebar';
import { getLogoInfo } from '../../../redux/actions/LogoAction';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const useStyles = () => {
  const { color } = useSelector((state) => state.theme);
  const mobileSize = useMobileSize();
  const result = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 999,
      backgroundColor: '#f2f2f2',
      paddingTop: '1px',
      paddingBottom: '8px',
    },
    wrapNavbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
    },
    wrapNavbarForMobile: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '95%',
    },
    wrapList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
    },
    childList: {
      paddingTop: '1rem',
    },
    wrapOutletName: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '10px',
      width: '100%',
      color: '#4D86A0',
      marginTop: '2px',
    },
    colorIconMenu: {
      color: 'black',
      cursor: 'pointer',
    },
    outlet: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 12,
      display: 'inline-flex',
      align: 'center',
    },
    outletText: {
      className: 'color',
      fontSize: '13px',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    outletWarpStyle: {
      marginLeft: 0.8,
      marginRight: 0.8,
    },
    input: {
      width: 160,
      padding: 0,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: 10,
      fontSize: '13px',
    },
    iconBasket: {
      fontSize: 10,
      fontWeight: 'bold',
      marginRight: 3,
      marginTop: 5,
      color: color.primary,
    },
    logoAndOuletName: {
      width: mobileSize ? 'fit-content' : '9.5em',
      height: 50,
    },
  };

  return result;
};

const HeaderWebOrdering = () => {
  const styles = useStyles();
  const history = useHistory();
  const mobileSize = useMobileSize();
  const dispatch = useDispatch();

  const [enableOrdering, setEnableOrdering] = useState(true);
  const [logo, setLogo] = useState('');
  const [basketLength, setBasketLength] = useState(0);
  const [showOutletSelection, setShowOutletSelection] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { defaultOutlet, outlets } = useSelector((state) => state.outlet);
  const { setting, basket } = useSelector((state) => state.order);

  const handleAllowedURL = (url) => {
    const allowedOriginUrl =
      'https://cdn-bucket-file-manager.s3.ap-southeast-1.amazonaws.com';
    const getOriginUrlImg = new URL(url).origin;
    if (allowedOriginUrl === getOriginUrlImg) {
      return url;
    } else {
      return '';
    }
  };

  const handleLogo = (infoCompany, logoCompany) => {
    if (infoCompany?.imageURL) {
      dispatch(getLogoInfo(handleAllowedURL(infoCompany?.imageURL)));
      setLogo(handleAllowedURL(infoCompany?.imageURL));
    } else if (logoCompany?.settingValue) {
      dispatch(getLogoInfo(handleAllowedURL(logoCompany?.settingValue)));
      setLogo(handleAllowedURL(logoCompany?.settingValue));
    }
  };
  const dispatchActionOrderingStatus = (dispatch) => {
    if (defaultOutlet.orderingStatus === 'UNAVAILABLE' && outlets.length > 1) {
      const firstAvailableOutlet = outlets.find(
        (outlet) => outlet.orderingStatus === 'AVAILABLE'
      );
      if (firstAvailableOutlet) {
        dispatch({
          type: CONSTANT.DEFAULT_OUTLET,
          data: firstAvailableOutlet,
        });
      }
    }
  };
  const handleUpdateEnableOrdering = (setEnableOrdering) => {
    const enableOrdering = setting?.find((items) => {
      return items.settingKey === 'EnableOrdering';
    });
    if (enableOrdering) {
      setEnableOrdering(enableOrdering);
    }
  };
  useEffect(() => {
    const infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    const logoCompany = setting.find((items) => {
      return items.settingKey === 'Logo';
    });
    dispatch(OutletAction.fetchAllOutlet(true));
    dispatchActionOrderingStatus(dispatch);
    handleLogo(infoCompany, logoCompany);
    handleUpdateEnableOrdering(setEnableOrdering);
  }, [setting]);

  useEffect(() => {
    if (history.location.pathname === '/') {
      setShowOutletSelection(true);
    } else {
      setShowOutletSelection(false);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }
    setBasketLength(basketLength);
  }, [basket]);
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    history.push('/');
  };

  const renderOutletNamed = () => {
    if (!showOutletSelection) {
      return null;
    }
    if (defaultOutlet?.name) {
      return (
        <div
          style={styles.wrapOutletName}
          onClick={() => history.push('./outlets')}
        >
          <PlaceIcon sx={{ fontSize: '17px' }} />
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}>
            {defaultOutlet?.name}
          </Typography>
          <ChevronRightIcon />
        </div>
      );
    } else {
      return (
        <Typography
          sx={{
            fontSize: '15px',
            marginTop: '7px',
            fontWeight: 'bold',
            color: '#4D86A0',
            textAlign: 'center',
          }}
        >
          Choose Outlet
        </Typography>
      );
    }
  };

  const linkMenu = () => {
    if (enableOrdering) {
      return (
        <ListItem>
          <Link to='/'>Menu</Link>
        </ListItem>
      );
    }
  };

  const linkProfile = () => {
    if (isLoggedIn || !enableOrdering) {
      return (
        <ListItem>
          <Link to='/profile'>Profile</Link>
        </ListItem>
      );
    }
  };
  const linkHistory = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to='/history'>History</Link>
        </ListItem>
      );
    }
  };
  const linkInbox = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to='/inbox'>Inbox</Link>
        </ListItem>
      );
    }
  };
  const linkVoucher = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to='/voucher'>Voucher</Link>
        </ListItem>
      );
    }
  };
  const linkLogout = () => {
    if (isLoggedIn) {
      return (
        <ListItem data-toggle='modal' onClick={handleLogout}>
          <Typography style={{ color: 'red', fontSize: '15px' }}>
            Logout
          </Typography>
        </ListItem>
      );
    }
  };
  const modalLogin = () => {
    if (!isLoggedIn) {
      return (
        <ListItem data-toggle='modal' data-target='#login-register-modal'>
          <input
            type='submit'
            name='login'
            value='LogIn / SignUp'
            style={styles.input}
          />
        </ListItem>
      );
    }
  };
  const renderBasket = () => {
    if (enableOrdering) {
      return (
        <Link id='cart-icon' to='/cart'>
          <Badge
            color='info'
            badgeContent={basketLength}
            style={styles.iconBasket}
          >
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid rgb(0 0 0)',
              }}
            >
              <ShoppingBasket sx={{ width: 25, height: 25, color: 'black' }} />
            </div>
          </Badge>
        </Link>
      );
    }
  };

  const renderSiderBar = () => {
    if (mobileSize) {
      return <Sidebar />;
    }
  };
  const renderLogoAndOutletNamed = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {logo && (
        <Link>
          <img style={styles.logoAndOuletName} src={logo} />
        </Link>
      )}
      {renderOutletNamed()}
    </div>
  );
  const renderRouteMenu = () => {
    if (!mobileSize) {
      return (
        <List style={styles.wrapList}>
          {linkMenu()}
          {linkProfile()}
          {linkHistory()}
          {linkInbox()}
          {linkVoucher()}
          {linkLogout()}
          {modalLogin()}
        </List>
      );
    }
  };

  const renderLoginRegister = () => {
    if (!isLoggedIn) {
      return <LoginRegister />;
    }
  };
  const renderNavbarResponsive = () => {
    const styleWarp = mobileSize
      ? styles.wrapNavbarForMobile
      : styles.wrapNavbar;
    return (
      <div style={styles.container}>
        <div style={styleWarp}>
          {renderSiderBar()}
          {renderLogoAndOutletNamed()}
          {renderRouteMenu()}
          {renderBasket()}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderLoginRegister()}
      {renderNavbarResponsive()}
    </>
  );
};

export default withRouter(HeaderWebOrdering);
