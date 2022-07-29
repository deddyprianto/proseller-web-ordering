import * as React from 'react';
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

const Sidebar = () => {
  const theme = useSelector((state) => state.theme.color);
  const styles = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const handleUpdateOpen = (open) => {
    setOpen(open);
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
                <ListItemText
                  primary='Menu'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon style={styles.listIcon}>
                  <PersonIcon sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Profile'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon style={styles.listIcon}>
                  <HistoryIcon sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary='History'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon style={styles.listIcon}>
                  <MailIcon sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Inbox'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon style={styles.listIcon}>
                  <ConfirmationNumberIcon sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Voucher'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                data-toggle='modal'
                data-target='#login-register-modal'
              >
                <ListItemIcon style={styles.listIcon}>
                  <LoginIcon sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary='LogIn / SignUp'
                  primaryTypographyProps={styles.primaryTypographyProps}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
export default Sidebar;
