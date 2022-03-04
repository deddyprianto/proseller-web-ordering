import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import config from '../../config';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faListAlt } from '@fortawesome/free-solid-svg-icons/faListAlt';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons/faAddressBook';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';

const MenuDrawer = ({ open, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const allState = useSelector((state) => state);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
  };

  const handleListItemClick = (event, index) => {
    onClose();
    setSelectedIndex(index);
  };

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

  const handleLogout = () => {
    const lsKeyList = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes(`${config.prefix}_`)) {
        lsKeyList.push(key);
      }
    }
    lsKeyList.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
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
  }, []);

  return (
    <div>
      <SwipeableDrawer
        anchor='left'
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            backgroundColor: allState.theme.color.navigation,
            color: allState.theme.color.textButtonColor,
            width: '75%',
            fontSize: '1.5em',
          },
        }}
      >
        <List
          component='nav'
          sx={{
            '& .Mui-selected': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              fontWeight: 600,
            },
          }}
        >
          <ListItemButton selected={selectedIndex === 0} onClick={onClose}>
            <ListItemIcon>
              <FontAwesomeIcon
                icon={faArrowLeft}
                color={allState.theme.color.textButtonColor}
                size='md'
              />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                sx: { fontSize: '2rem', fontWeight: 600 },
              }}
              primary='Close'
            />
          </ListItemButton>
          {allState.theme.menu.navBar.map((menu, index) => {
            if (!enableOrdering && menu.showWhenOrderingEnabled) {
              return null;
            }
            if (!isLoggedIn && menu.loggedInOnly && menu.text) {
              return null;
            }
            if (!isLoggedIn && menu.text === 'Login') return null;
            if (isLoggedIn && menu.loggedInOnly === false) return null;
            return (
              <ListItemButton
                selected={selectedIndex === index + 1}
                component={Link}
                to={menu.path}
                onClick={(event) => handleListItemClick(event, index + 1)}
                key={index + 1}
              >
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon={iconCheck(menu.icon)}
                    color={allState.theme.color.textButtonColor}
                    size='md'
                  />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    sx: { fontSize: '2rem' },
                  }}
                  primary={menu.text}
                />
              </ListItemButton>
            );
          })}
          {!isLoggedIn ? (
            <ListItemButton
              data-toggle='modal'
              data-target='#login-register-modal'
              onClick={onClose}
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  color={allState.theme.color.textButtonColor}
                  size='md'
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: { fontSize: '2rem' },
                }}
                primary='Log In / Sign Up'
              />
            </ListItemButton>
          ) : isLoggedIn ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  color={allState.theme.color.textButtonColor}
                  size='md'
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: { fontSize: '2rem' },
                }}
                primary='Logout'
              />
            </ListItemButton>
          ) : null}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

MenuDrawer.defaultProps = {
  onClose: null,
  open: false,
};

MenuDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default MenuDrawer;
