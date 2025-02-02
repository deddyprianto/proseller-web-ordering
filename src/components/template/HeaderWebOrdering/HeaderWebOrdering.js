import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter, useHistory, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';

import config from '../../../config';
import { OutletAction } from '../../../redux/actions/OutletAction';
import LoginRegister from '../../login-register';
import useMobileSize from 'hooks/useMobileSize';
import Sidebar from './components/Sidebar';
import { getLogoInfo } from '../../../redux/actions/LogoAction';
import ImageContainer from 'components/imageContainer/ImageContainer';
import { CONSTANT } from 'helpers';
import '../../../styles/home.css';
import { InputSearch } from 'components/InputSearch';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const useStyles = (location) => {
  const { color } = useSelector((state) => state.theme);
  const mobileSize = useMobileSize();
  const result = {
    container: {
      display:
        location.pathname === '/appointment' ||
        location.pathname === '/location' ||
        location.pathname === '/cartappointment' ||
        location.pathname === '/bookingsummary' ||
        location.pathname === '/bookingsubmitted' ||
        location.pathname === '/bookingconfirm'
          ? 'none'
          : 'flex',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 999,
      backgroundColor:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart' ||
        location.pathname === '/inboxdetail'
          ? 'transparent'
          : '#f2f2f2',
      paddingTop:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart' ||
        location.pathname === '/inboxdetail'
          ? '0px'
          : '8px',
      paddingBottom:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart'
          ? '0px'
          : '8px',
    },
    wrapNavbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart' ||
        location.pathname === '/inboxdetail'
          ? '45%'
          : '80%',
      backgroundColor: '#f2f2f2',
      padding:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart'
          ? '10px 0px'
          : '0px',
    },

    wrapNavbarForMobile: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding:
        location.pathname === '/cartguestcheckout' ||
        location.pathname === '/appointment' ||
        location.pathname === '/trackorder' ||
        location.pathname === '/thankyoupage' ||
        location.pathname === '/ordertrackhistory' ||
        location.pathname === '/cart'
          ? '5px 10px'
          : '0px 7px',
      backgroundColor: '#f2f2f2',
    },
    wrapList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
    },
    childList: {
      paddingTop: "1rem",
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
      fontSize: "13px",
    },
    iconBasket: {
      fontSize: 20,
      fontWeight: "bold",
      color: color.primary,
    },
    logoAndOuletName: {
      width: mobileSize ? '97px' : '9.5em',
      marginBottom: mobileSize ? 0 : '10px',
    },
  };

  return result;
};

const HeaderWebOrdering = () => {
  const allState = useSelector((state) => state);
  const { color } = useSelector((state) => state.theme);
  const location = useLocation();
  const styles = useStyles(location);
  const history = useHistory();
  const mobileSize = useMobileSize();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(true);
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [logo, setLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [basketLength, setBasketLength] = useState(0);
  const [appointmentMenu, setAppointmentMenu] = useState(false);
  const [basketLengthGuestCheckout, setBasketLengthGuestCheckout] = useState(0);
  const [showOutletSelection, setShowOutletSelection] = useState(false);
  const [settingOnlineOrdering, setSettingOnlineOrdering] = useState();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { defaultOutlet } = useSelector((state) => state.outlet);
  const { setting, basket } = useSelector((state) => state.order);
  const [mode, setMode] = useState();
  const { isSearchItem } = useSelector((state) => state.getSpaceLogo);
  const [guessCheckout, setGuessCheckout] = useState();
  const responseGuestCheckOut = useSelector(
    (state) => state.guestCheckoutCart.response
  );
  const data = useSelector((state) => state.guestCheckoutCart.data);

  const isGuestMode = localStorage.getItem("settingGuestMode");
  const encryptedInfoCompany = localStorage.getItem(
    `${config.prefix}_infoCompany`
  );

  const enableItemSearch = setting.find((items) => {
    return items.settingKey === "EnableItemSearch";
  });

  useEffect(() => {
    const settingAppoinment = setting.find((items) => {
      return items.settingKey === "EnableAppointment";
    });
    const settingOnlineOrdering = setting.find((items) => {
      return items.settingKey === "EnableOrdering";
    });

    if (settingOnlineOrdering?.settingValue) {
      setSettingOnlineOrdering(settingOnlineOrdering.settingValue);
    }
    if (settingAppoinment?.settingValue) {
      setAppointmentMenu(settingAppoinment.settingValue);
    }
  }, [setting]);

  useEffect(() => {
    const enableOrderingChecker = () => {
      let enableOrderingCheck = allState.order.setting.find((items) => {
        return items.settingKey === "EnableOrdering";
      });
      if (enableOrderingCheck) {
        setShowMenu(enableOrderingCheck.settingValue);
      }
    };
    enableOrderingChecker();
  }, [allState]);

  useEffect(() => {
    if (isGuestMode === "GuestMode") {
      setMode(isGuestMode);
    }
  }, [isGuestMode]);

  useEffect(() => {
    const settingGuestCheckout = setting.find((items) => {
      return items.settingKey === "GuestMode";
    });

    if (settingGuestCheckout?.settingValue) {
      setGuessCheckout(settingGuestCheckout.settingKey);
    }
  }, [setting]);

  const handleAllowedURL = (url) => {
    const allowedOriginUrl =
      "https://cdn-bucket-file-manager.s3.ap-southeast-1.amazonaws.com";
    const getOriginUrlImg = new URL(url).origin;
    if (allowedOriginUrl === getOriginUrlImg) {
      return url;
    } else {
      return "";
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

  const handleUpdateEnableOrdering = (setEnableOrdering) => {
    const enableOrdering = setting?.find((items) => {
      return items.settingKey === "EnableOrdering";
    });
    if (enableOrdering) {
      setEnableOrdering(enableOrdering);
    }
  };

  useEffect(() => {
    const infoCompany = encryptor.decrypt(JSON.parse(encryptedInfoCompany));
    const logoCompany = setting.find((items) => {
      return items.settingKey === "Logo";
    });
    dispatch(OutletAction.fetchAllOutlet(true));
    setCompanyName(infoCompany?.companyName);
    handleLogo(infoCompany, logoCompany);
    handleUpdateEnableOrdering(setEnableOrdering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting, encryptedInfoCompany]);

  useEffect(() => {
    if (history.location.pathname === "/") {
      setShowOutletSelection(true);
    } else {
      setShowOutletSelection(false);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    if (mode === "GuestMode") {
      let basketLength = 0;
      if (responseGuestCheckOut && responseGuestCheckOut.details) {
        responseGuestCheckOut.details.forEach((cart) => {
          basketLength += cart.quantity;
        });
      } else if (data && data.details) {
        data.details.forEach((cart) => {
          basketLength += cart.quantity;
        });
      }
      setBasketLengthGuestCheckout(basketLength);
    } else {
      let basketLength = 0;
      if (basket && basket.details) {
        basket.details.forEach((cart) => {
          basketLength += cart.quantity;
        });
      }
      setBasketLength(basketLength);
    }
  }, [basket, mode, responseGuestCheckOut, data]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    history.push("/");
  };

  const renderOutletNamed = () => {
    if (!showOutletSelection) {
      return null;
    }
    if (defaultOutlet?.name) {
      return (
        <div
          style={{
            display: "grid",
            gridAutoColumns: "1fr",
            gridTemplateColumns: "15px 1fr 10px",
            gridTemplateRows: "1fr",
            gap: "0px 0px",
            gridTemplateAreas: '". . ."',
            alignItems: "start",
            paddingTop: "10px",
            color: "#4D86A0",
          }}
          onClick={() => history.push("/outlets")}
        >
          <PlaceIcon sx={{ fontSize: "17px", marginTop: "3px" }} />
          <Typography
            sx={{
              padding: 0,
              margin: 0,
              fontSize: "15px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {defaultOutlet?.name}
          </Typography>
          <div>
            <ChevronRightIcon />
          </div>
        </div>
      );
    } else {
      return (
        <Typography
          sx={{
            fontSize: "15px",
            marginTop: "7px",
            fontWeight: "bold",
            color: "#4D86A0",
            textAlign: "center",
          }}
        >
          Choose Outlet
        </Typography>
      );
    }
  };

  const linkMenu = () => {
    if (showMenu) {
      return (
        <ListItem>
          <Link to="/">Menu</Link>
        </ListItem>
      );
    }
  };
  const linkTrackOrder = () => {
    if (!isLoggedIn && guessCheckout) {
      return (
        <ListItem>
          <Link to="/trackorder">TrackOrder</Link>
        </ListItem>
      );
    }
  };

  const linkProfile = () => {
    if (isLoggedIn || !enableOrdering) {
      return (
        <ListItem>
          <Link to="/profile">Profile</Link>
        </ListItem>
      );
    }
  };
  const linkAppoinment = () => {
    if (isLoggedIn && appointmentMenu) {
      return (
        <ListItem>
          <Link to="/appointment">Booking</Link>
        </ListItem>
      );
    }
  };
  const linkHistory = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to="/history">History</Link>
        </ListItem>
      );
    }
  };
  const linkInbox = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to="/inbox">Inbox</Link>
        </ListItem>
      );
    }
  };
  const linkVoucher = () => {
    if (isLoggedIn) {
      return (
        <ListItem>
          <Link to="/voucher">Voucher</Link>
        </ListItem>
      );
    }
  };
  const linkLogout = () => {
    if (isLoggedIn) {
      return (
        <ListItem data-toggle="modal" onClick={handleLogout}>
          <Typography style={{ color: "red", fontSize: "15px" }}>
            Logout
          </Typography>
        </ListItem>
      );
    }
  };
  const modalLogin = () => {
    if (!isLoggedIn) {
      return (
        <ListItem data-toggle="modal" data-target="#login-register-modal">
          <input
            type="submit"
            name="login"
            value="LogIn / SignUp"
            style={styles.input}
          />
        </ListItem>
      );
    }
  };

  const renderBasket = () => {
    if (settingOnlineOrdering && location.pathname !== "/outlets") {
      return (
        <Link
          id="cart-icon"
          to={mode === "GuestMode" ? "/cartguestcheckout" : "/cart"}
        >
          <Badge
            color="info"
            badgeContent={
              mode === "GuestMode" ? basketLengthGuestCheckout : basketLength
            }
            style={styles.iconBasket}
          >
            <div
              data-toggle="modal"
              data-target={
                mode === "GuestMode" || isLoggedIn
                  ? ""
                  : "#login-register-modal"
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid rgb(0 0 0)",
              }}
            >
              <ShoppingBasket sx={{ width: 25, height: 25, color: "black" }} />
            </div>
          </Badge>
        </Link>
      );
    } else {
      return <div style={{ visibility: "hidden" }}></div>;
    }
  };

  const renderSiderBar = () => {
    if (mobileSize) {
      return <Sidebar guessCheckout={guessCheckout} />;
    }
  };
  const renderLogoAndOutletNamed = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link
        style={{
          ...styles.logoAndOuletName,
          visibility: logo ? "visible" : "hidden",
          height: logo ? 50 : 0,
        }}
        to="/"
      >
        <ImageContainer image={logo} fetchpriority="high" />
      </Link>
      {renderOutletNamed()}
    </div>
  );
  const renderRouteMenu = () => {
    if (!mobileSize) {
      return (
        <List style={styles.wrapList}>
          {linkMenu()}
          {linkTrackOrder()}
          {linkProfile()}
          {linkHistory()}
          {linkAppoinment()}
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

  const searchIcon = () => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15" cy="15" r="10.5" stroke="white" strokeWidth="3" />
        <path
          d="M22.5 22.5L31.5 31.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const renderNavbarResponsive = () => {
    const styleWarp = mobileSize
      ? styles.wrapNavbarForMobile
      : styles.wrapNavbar;
    return (
      <div
        style={
          companyName === "PinkCity"
            ? { ...styles.container, backgroundColor: "#FFFFFF" }
            : styles.container
        }
      >
        <div
          style={
            companyName === "PinkCity"
              ? { ...styleWarp, backgroundColor: "#FFFFFF" }
              : styleWarp
          }
        >
          {renderSiderBar()}
          {renderLogoAndOutletNamed()}
          {renderRouteMenu()}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {renderBasket()}
            {location.pathname !== "/outlets" &&
              enableItemSearch?.settingValue && (
                <div
                  style={{
                    width: "1px",
                    height: "35px",
                    backgroundColor: "#D6D6D6",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
              )}

            {location.pathname !== "/outlets" &&
              enableItemSearch?.settingValue && (
                <div
                  style={{
                    backgroundColor: color.primary,
                    borderRadius: "100%",
                    height: "35px",
                    width: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    dispatch({
                      type: CONSTANT.IS_SEARCH_ITEM,
                      payload: true,
                    });
                  }}
                >
                  {searchIcon()}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <span
        data-toggle="modal"
        data-target="#login-register-modal"
        id="login-register-btn"
      />
      {renderLoginRegister()}
      {isSearchItem ? <InputSearch /> : renderNavbarResponsive()}
    </>
  );
};

export default withRouter(HeaderWebOrdering);
