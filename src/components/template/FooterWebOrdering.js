import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons/faListAlt';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons/faAddressBook';

import { useSelector } from 'react-redux';

const FooterWebOrdering = () => {
  const allState = useSelector((state) => state);

  const style = {
    paper: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '4.6em',
      zIndex: 10,
      backgroundColor: allState.theme.color.navigation,
    },
    bottomNav: {
      marginY: '1.2rem',
      backgroundColor: allState.theme.color.navigation,
      '& .Mui-selected': {
        color: allState.theme.color.activeNavigationColor,
        fontWeight: 700,
      },
      '& .MuiBottomNavigationAction-root': {
        fontSize: '2.3rem',
        color: allState.theme.color.inactiveNavigationColor,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '1.5rem',
        fontWeight: 700,
        // color: allState.theme.color.inactiveNavigationColor,
      },
    },
  };

  const [value, setValue] = useState(0);

  const [enableOrdering, setEnableOrdering] = useState(true);
  const isLoggedIn = allState.auth.isLoggedIn;

  const iconCheck = (iconName) => {
    if (iconName.includes('fa-th')) {
      return faListAlt;
    } else if (iconName.includes('fa-history')) {
      return faHistory;
    } else if (iconName.includes('fa-user')) {
      return faUser;
    } else if (iconName.includes('fa-gift')) {
      return faGift;
    } else if (iconName.includes('fa-envelope')) {
      return faEnvelope;
    } else {
      return faAddressBook;
    }
  };

  useEffect(() => {
    const enableOrderingChecker = () => {
      let enableOrderingCheck = allState.order.setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrderingCheck) {
        setEnableOrdering({ enableOrdering: enableOrdering.settingValue });
      }
    };
    enableOrderingChecker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matches = useMediaQuery('(max-width:768px)');

  if (matches) {
    return (
      <Paper sx={style.paper} elevation={5}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={style.bottomNav}
        >
          {allState.theme.menu.navBar.map((menu, index) => {
            if (!enableOrdering && menu.showWhenOrderingEnabled) {
              return null;
            }
            if (!isLoggedIn && menu.loggedInOnly) {
              return null;
            }
            if (!isLoggedIn && menu.text === 'Login') {
              return (
                <BottomNavigationAction
                  key={index}
                  tabIndex={index}
                  label='Login'
                  data-toggle='modal'
                  data-target='#login-register-modal'
                  icon={<FontAwesomeIcon icon={faSignInAlt} />}
                />
              );
            }
            if (isLoggedIn && menu.loggedInOnly === false) return null;
            return (
              <BottomNavigationAction
                key={index}
                tabIndex={index}
                label={menu.text}
                component={Link}
                to={menu.path}
                icon={
                  <FontAwesomeIcon
                    icon={iconCheck(menu.icon)}
                    color={
                      value === index
                        ? allState.theme.color.activeNavigationColor
                        : allState.theme.color.inactiveNavigationColor
                    }
                  />
                }
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
