import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';

import { useSelector, useDispatch } from 'react-redux';
import screen from 'hooks/useWindowSize';
import { CONSTANT } from 'helpers';
import { isEmptyObject } from 'helpers/CheckEmpty';

const FooterWebOrdering = () => {
  const dispatch = useDispatch();
  const widthScreen = screen();
  const responsiveDesign = screen();
  const location = useLocation();
  const indexFooterAppointment = useSelector(
    (state) => state.appointmentReducer.indexFooter
  );
  const allState = useSelector((state) => state);
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const navBar = useSelector((state) => state.theme.menu.navBar);
  const resetBottomNav = useSelector(
    (state) => state.guestCheckoutCart.resetBottomNav
  );
  const [appointmentMenu, setAppointmentMenu] = useState(false);
  const [newNavbar, setNewNavbar] = useState([]);
  const { setting } = useSelector((state) => state.order);
  const [guessCheckout, setGuessCheckout] = useState();
  const [enableOrdering, setEnableOrdering] = useState(true);
  const isLoggedIn = allState.auth.isLoggedIn;

  useEffect(() => {
    const settingGuestCheckout = setting.find((items) => {
      return items.settingKey === 'GuestMode';
    });
    const settingAppoinment = setting.find((items) => {
      return items.settingKey === 'EnableAppointment';
    });

    if (settingGuestCheckout?.settingValue) {
      setGuessCheckout(settingGuestCheckout.settingKey);
    }
    if (settingAppoinment?.settingValue) {
      setAppointmentMenu(settingAppoinment.settingValue);
    }
  }, [setting]);

  useEffect(() => {
    if (resetBottomNav === 0) {
      dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 0 });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      setNewNavbar(navBar);
      if (guessCheckout) {
        const spliceData = navBar;
        spliceData.splice(5, 0, { text: 'TrackOrder', path: '/trackorder' });
        setNewNavbar(spliceData);
      }
    } else {
      if (appointmentMenu) {
        const data = navBar;
        data[2] = {
          text: 'Booking',
          path: '/appointment',
          loggedInOnly: true,
        };
        const dataFiltered = data;
        setNewNavbar(dataFiltered);
      } else {
        setNewNavbar(navBar);
      }
    }
  }, [guessCheckout, appointmentMenu]);

  const menuIcon = (color) => {
    return (
      <svg width='25' height='24' viewBox='0 0 19 18'>
        <path
          d='M7.70989 2.2523L3.75 2.25V15.75H14.25L14.2494 8.79126C14.2494 8.6257 14.235 8.46041 14.2077 8.29711C13.9348 6.66289 13.1388 5.55933 11.5046 5.83224L10.5 6L10.6678 4.99543C10.695 4.83213 10.7087 4.66685 10.7087 4.50128C10.7087 2.84443 9.36675 2.2523 7.70989 2.2523ZM5.625 5.25015C5.625 4.83593 5.96079 4.50015 6.375 4.50015H8.25C8.66421 4.50015 9 4.83593 9 5.25015C9 5.66436 8.66421 6.00015 8.25 6.00015H6.375C5.96079 6.00015 5.625 5.66436 5.625 5.25015ZM5.625 8.25014C5.625 7.83593 5.96079 7.50014 6.375 7.50014H11.625C12.0392 7.50014 12.375 7.83593 12.375 8.25014C12.375 8.66436 12.0392 9.00014 11.625 9.00014H6.375C5.96079 9.00014 5.625 8.66436 5.625 8.25014ZM5.625 10.5001C5.625 10.0859 5.96079 9.75014 6.375 9.75014H11.625C12.0392 9.75014 12.375 10.0859 12.375 10.5001C12.375 10.9144 12.0392 11.2501 11.625 11.2501H6.375C5.96079 11.2501 5.625 10.9144 5.625 10.5001ZM5.625 12.7501C5.625 12.3359 5.96079 12.0001 6.375 12.0001H11.625C12.0392 12.0001 12.375 12.3359 12.375 12.7501C12.375 13.1644 12.0392 13.5001 11.625 13.5001H6.375C5.96079 13.5001 5.625 13.1644 5.625 12.7501ZM11.5093 2.7872C12.4702 3.28998 13.2112 4.0494 13.6909 5.02397C13.2164 4.64057 12.6593 4.41951 12.055 4.35568C12.002 3.76259 11.8141 3.23321 11.5093 2.7872Z'
          fill={color}
        />
      </svg>
    );
  };

  const appointmentIcon = (color) => {
    return (
      <svg
        width='25'
        height='25'
        viewBox='0 0 240 240'
        fill={color}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M210 130V60C210 54.6957 207.893 49.6086 204.142 45.8579C200.391 42.1071 195.304 40 190 40H50C44.6957 40 39.6086 42.1071 35.8579 45.8579C32.1071 49.6086 30 54.6957 30 60V200C30 205.304 32.1071 210.391 35.8579 214.142C39.6086 217.893 44.6957 220 50 220H130M160 20V60M80 20V60M30 100H210M190 160V220M160 190H220'
          stroke='white'
          strokeWidth='12'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };
  const historyIcon = (color) => {
    return (
      <svg
        width='25'
        height='24'
        viewBox='0 0 19 18'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M6.00105 3.31082L3.33398 4.64436L9.81424 8.1545L12.4813 6.82096L6.00105 3.31082ZM2.29999 5.7902V12.3749C2.29999 12.659 2.46049 12.9187 2.71458 13.0457L9.05541 16.2161C9.05179 16.1862 9.04993 16.1558 9.04993 16.125V9.44641L2.29999 5.7902ZM10.5444 16.2162L16.8854 13.0457C17.1395 12.9187 17.3 12.659 17.3 12.3749V6.08867L14.6749 7.40121V9.37495C14.6749 9.78916 14.3391 10.1249 13.9249 10.1249C13.5107 10.1249 13.1749 9.78916 13.1749 9.37495V8.15121L10.5499 9.4637V16.125C10.5499 16.1559 10.5481 16.1863 10.5444 16.2162ZM16.5503 4.78649L10.1354 1.57906C9.92425 1.47348 9.67572 1.47348 9.46458 1.57906L7.63873 2.49198L14.119 6.00212L16.5503 4.78649Z'
          fill={color}
        />
      </svg>
    );
  };

  const rewardsIcon = (color) => {
    return (
      <svg
        width='25'
        height='24'
        viewBox='0 0 19 18'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3.69376 15.4922C3.69376 15.8033 3.94512 16.0547 4.25626 16.0547H9.2836V9.44531H3.69376V15.4922ZM10.4789 16.0547H15.5063C15.8174 16.0547 16.0688 15.8033 16.0688 15.4922V9.44531H10.4789V16.0547ZM16.35 5.22656H13.7555C13.9945 4.85039 14.1352 4.40391 14.1352 3.92578C14.1352 2.58809 13.0471 1.5 11.7094 1.5C10.9816 1.5 10.326 1.82344 9.88126 2.3332C9.43653 1.82344 8.78087 1.5 8.05313 1.5C6.71544 1.5 5.62735 2.58809 5.62735 3.92578C5.62735 4.40391 5.76622 4.85039 6.00704 5.22656H3.41251C3.10137 5.22656 2.85001 5.47793 2.85001 5.78906V8.25H9.2836V5.22656H10.4789V8.25H16.9125V5.78906C16.9125 5.47793 16.6611 5.22656 16.35 5.22656ZM9.2836 5.15625H8.05313C7.37462 5.15625 6.82266 4.6043 6.82266 3.92578C6.82266 3.24727 7.37462 2.69531 8.05313 2.69531C8.73165 2.69531 9.2836 3.24727 9.2836 3.92578V5.15625ZM11.7094 5.15625H10.4789V3.92578C10.4789 3.24727 11.0309 2.69531 11.7094 2.69531C12.3879 2.69531 12.9398 3.24727 12.9398 3.92578C12.9398 4.6043 12.3879 5.15625 11.7094 5.15625Z'
          fill={color}
        />
      </svg>
    );
  };

  const profileIcon = (color) => {
    return (
      <svg
        width='25'
        height='24'
        viewBox='0 0 19 18'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M9.45262 1.5C9.83001 1.59171 10.227 1.63654 10.5819 1.78305C11.928 2.33976 12.7478 3.3442 12.9986 4.78492C13.1328 5.57353 13.0164 6.38438 12.6657 7.10336C12.315 7.82235 11.7477 8.41327 11.0437 8.79299C9.63311 9.54983 8.22813 9.47248 6.91223 8.55712C5.8574 7.82196 5.30068 6.77152 5.27577 5.4858C5.2494 4.05709 5.86677 2.93574 7.04994 2.1329C7.57091 1.77894 8.15605 1.58468 8.78368 1.5211C8.81183 1.51626 8.83955 1.5092 8.8666 1.5L9.45262 1.5Z'
          fill={color}
        />
        <path
          d='M9.12536 16.5C7.43616 16.4859 5.88996 15.9875 4.52512 14.9699C3.72599 14.3785 3.04931 13.6375 2.53266 12.7882C2.45443 12.6592 2.4178 12.53 2.48549 12.387C3.16527 10.9533 4.27284 10.0394 5.81377 9.65677C5.92248 9.62981 6.03441 9.61604 6.14399 9.59201C6.38485 9.53927 6.59113 9.60842 6.78861 9.74819C7.55776 10.2894 8.41716 10.5308 9.3542 10.4913C10.07 10.462 10.7606 10.2905 11.3364 9.86598C11.7786 9.53986 12.2014 9.56389 12.674 9.69633C13.9682 10.0591 14.9422 10.8341 15.6351 11.9765C15.941 12.4802 15.9533 12.4995 15.6307 12.9845C14.8499 14.158 13.8372 15.0763 12.5694 15.703C11.4888 16.2383 10.3419 16.4933 9.12536 16.5Z'
          fill={color}
        />
      </svg>
    );
  };

  const inboxIcon = (color) => {
    return (
      <svg width='25' height='24' viewBox='0 0 19 18'>
        <path
          d='M16.15 3.75H2.65002V4.49986C2.77348 4.49975 2.89868 4.53017 3.01426 4.59438L9.40002 8.14203L15.7858 4.59438C15.9014 4.53017 16.0266 4.49975 16.15 4.49986V3.75ZM16.15 6.10797L9.76426 9.65562C9.53774 9.78146 9.26231 9.78146 9.03579 9.65562L2.65002 6.10797V14.25H16.15V6.10797Z'
          fill={color}
        />
      </svg>
    );
  };
  const trackIcon = (color) => {
    return (
      <svg
        width='25'
        height='24'
        viewBox='0 0 512 512'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M147.941 94.1746L72.071 132.11L256.394 231.951L332.265 194.016L147.941 94.1746ZM42.667 164.706V351.997C42.667 360.077 47.2324 367.464 54.4598 371.078L234.823 461.259C234.72 460.409 234.667 459.544 234.667 458.667V268.706L42.667 164.706ZM277.177 461.259L457.541 371.078C464.768 367.464 469.334 360.077 469.334 351.997V173.184L394.667 210.518V266.667C394.667 278.449 385.115 288 373.333 288C361.551 288 352 278.449 352 266.667V231.851L277.333 269.185V458.667C277.333 459.544 277.28 460.41 277.177 461.259ZM448.004 136.147L265.541 44.9154C259.535 41.9125 252.466 41.9125 246.46 44.9154L194.524 70.8831L378.847 170.725L448.004 136.147Z'
          fill={color}
        />
      </svg>
    );
  };

  const style = {
    paper: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '4.6em',
      zIndex: 10,
      backgroundColor: allState.theme.color.navigationColor,
      display: responsiveDesign.height < 500 && 'none',
    },
    bottomNav: {
      height: 70,
      marginY: '0.7rem',
      backgroundColor: allState.theme.color.navigationColor,
      '& .Mui-selected': {
        color: allState.theme.color.navigationIconSelectedColor,
        fontWeight: 700,
      },
      '& .MuiBottomNavigationAction-root': {
        fontSize: '2.3rem',
        color: allState.theme.color.navigationFontColor,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '1.1rem',
        fontWeight: 700,
      },
    },
  };

  const iconCheck = (iconName, iconColor) => {
    if (iconName === 'Menu') {
      return menuIcon(iconColor);
    } else if (iconName === 'TrackOrder') {
      return trackIcon(iconColor);
    } else if (iconName === 'Booking') {
      return appointmentIcon(iconColor);
    } else if (iconName === 'History') {
      return historyIcon(iconColor);
    } else if (iconName === 'Profile') {
      return profileIcon(iconColor);
    } else if (iconName === 'Inbox') {
      return inboxIcon(iconColor);
    } else if (iconName === 'Rewards') {
      return rewardsIcon(iconColor);
    }
  };

  useEffect(() => {
    const enableOrderingChecker = () => {
      let enableOrderingCheck = allState.order.setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrderingCheck) {
        setEnableOrdering(enableOrderingCheck.settingValue);
      }
    };
    enableOrderingChecker();
  }, [allState]);

  const matches = useMediaQuery('(max-width:1200px)');

  const displayBottomNavigation = () => {
    if (location.pathname === '/thankyoupage') {
      return 'none';
    } else if (location.pathname === '/ordertrackhistory') {
      return 'none';
    } else if (location.pathname === '/location') {
      return 'none';
    } else {
      return '';
    }
  };

  if (matches) {
    return (
      <Paper
        sx={style.paper}
        elevation={5}
        style={{ display: displayBottomNavigation() }}
      >
        <BottomNavigation
          showLabels
          value={indexFooterAppointment}
          onChange={(event, newValue) => {
            if (!isEmptyObject(cartAppointment)) {
              if (
                location.pathname === '/appointment' ||
                location.pathname === '/location' ||
                location.pathname === '/cartappointment' ||
                location.pathname === '/bookingconfirm'
              ) {
                dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 2 });
                dispatch({
                  type: CONSTANT.INDEX_PATH_APPOINTMENT,
                  payload: newValue,
                });
              } else {
                dispatch({ type: CONSTANT.INDEX_FOOTER, payload: newValue });
              }
            } else {
              dispatch({ type: CONSTANT.INDEX_FOOTER, payload: newValue });
            }
          }}
          sx={style.bottomNav}
        >
          {newNavbar.map((menu, index) => {
            if (!enableOrdering && menu.showOnOrderingEnabled) {
              return null;
            }
            if (!isLoggedIn && menu.loggedInOnly) {
              return null;
            }
            if (!isLoggedIn && menu.text === 'Login') {
              return (
                <BottomNavigationAction
                  id='login-navbar-button'
                  key={index}
                  tabIndex={index}
                  label='LOGIN'
                  data-toggle='modal'
                  data-target='#login-register-modal'
                  sx={{ color: 'white' }}
                  icon={
                    <FontAwesomeIcon
                      icon={faSignInAlt}
                      style={{ fontSize: 20 }}
                    />
                  }
                />
              );
            }

            if (isLoggedIn && menu.loggedInOnly === false) {
              return null;
            }
            return (
              <BottomNavigationAction
                id={`${menu?.text?.toLowerCase()}-navbar-button`}
                key={index}
                tabIndex={index}
                label={menu.text.toUpperCase()}
                component={Link}
                to={menu.path}
                sx={{
                  marginLeft: widthScreen.width <= 400 ? '-10px' : '0px',
                  marginRight: widthScreen.width <= 400 ? '-10px' : '0px',
                }}
                icon={iconCheck(
                  menu.text,
                  indexFooterAppointment === index
                    ? allState.theme.color.navigationIconSelectedColor
                    : allState.theme.color.navigationFontColor

                  // value === index ? '#000000' : '#8A8D8E'
                )}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    );
  } else {
    return null;
  }
};

export default FooterWebOrdering;
