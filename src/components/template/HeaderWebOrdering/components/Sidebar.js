/* eslint-disable react/prop-types */
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useSelector } from 'react-redux';

const useStyles = (theme) => ({
  icon: {
    color: 'black',
    cursor: 'pointer',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  box: {
    width: 250,
    height: '100%',
    backgroundColor: theme.navigationColor,
  },
  listIcon: {
    color: 'white',
  },
  primaryTypographyProps: {
    fontSize: 15,
    letterSpacing: 0,
    color: 'white',
    fontWeight: 600,
  },
});

const Sidebar = ({ guessCheckout }) => {
  const history = useHistory();
  const theme = useSelector((state) => state.theme.color);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const styles = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const handleUpdateOpen = (open) => {
    setOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    history.push('/');
  };

  const renderMenuListOnLoggin = () => {
    return (
      <Box
        style={styles.box}
        onClick={() => handleUpdateOpen(false)}
        onKeyDown={() => handleUpdateOpen(false)}
      >
        <List
          sx={{
            height: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ListItem
            disablePadding
            sx={{ backgroundColor: '#444646', marginTop: '-10px' }}
          >
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <ArrowBack sx={{ width: 25, height: 25 }} />
              </ListItemIcon>
              <ListItemText
                primary='Close'
                primaryTypographyProps={styles.primaryTypographyProps}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <LibraryBooksIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/'>
                <ListItemText
                  primary='Menu'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <PersonIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/profile'>
                <ListItemText
                  primary='Profile'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <HistoryIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/history'>
                <ListItemText
                  primary='History'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <MailIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/inbox'>
                <ListItemText
                  primary='Inbox'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <ConfirmationNumberIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/voucher'>
                <ListItemText
                  primary='Voucher'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          <hr />
          <ListItem disablePadding>
            <ListItemButton
              onClick={isLoggedIn && handleLogout}
              data-toggle={!isLoggedIn && 'modal'}
              data-target={!isLoggedIn && '#login-register-modal'}
            >
              <ListItemIcon style={styles.listIcon}>
                <LoginIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>

              <ListItemText
                primary={isLoggedIn ? 'Logout' : 'LogIn / SignUp'}
                primaryTypographyProps={styles.primaryTypographyProps}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
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

  const renderMenuListOnLogOut = () => {
    return (
      <Box
        style={styles.box}
        onClick={() => handleUpdateOpen(false)}
        onKeyDown={() => handleUpdateOpen(false)}
      >
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon style={styles.listIcon}>
                <LibraryBooksIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              <Link to='/'>
                <ListItemText
                  primary='Menu'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </Link>
            </ListItemButton>
          </ListItem>
          {guessCheckout && (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon style={styles.listIcon}>
                  {trackIcon('white')}
                </ListItemIcon>
                <Link to='/trackorder'>
                  <ListItemText
                    primary='Tracking Order'
                    primaryTypographyProps={styles.primaryTypographyProps}
                  />
                </Link>
              </ListItemButton>
            </ListItem>
          )}
          <hr />
          <ListItem disablePadding>
            <ListItemButton
              onClick={isLoggedIn && handleLogout}
              data-toggle={!isLoggedIn && 'modal'}
              data-target={!isLoggedIn && '#login-register-modal'}
            >
              <ListItemIcon style={styles.listIcon}>
                <LoginIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>

              <ListItemText
                primary={isLoggedIn ? 'Logout' : 'LogIn / SignUp'}
                primaryTypographyProps={styles.primaryTypographyProps}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  };
  const renderMenu = () => {
    if (isLoggedIn) {
      return renderMenuListOnLoggin();
    } else {
      return renderMenuListOnLogOut();
    }
  };
  return (
    <div>
      <FontAwesomeIcon
        onClick={() => handleUpdateOpen(true)}
        style={styles.icon}
        icon={faBars}
        size='lg'
      />
      <Drawer anchor='left' open={open} onClose={() => handleUpdateOpen(false)}>
        {renderMenu()}
      </Drawer>
    </div>
  );
};
export default Sidebar;
