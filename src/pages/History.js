import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import loadable from '@loadable/component';
import fontStyles from './Histories/style/styles.module.css';
import useMobileSize from 'hooks/useMobileSize';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RenderHeaderLabelHistory } from 'components/historyHeader';
import screen from 'hooks/useWindowSize';

const HistoryLogin = loadable(() =>
  import('./Histories/component/HistoryLogin')
);
const HistoryAppointment = loadable(() =>
  import('./Histories/component/HistoryAppointment')
);

const History = (props) => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const [tabName, setTabName] = useState('Orders');
  const mobileSize = useMobileSize();

  const tabStateButton = useSelector(
    (state) => state.appointmentReducer.tabStateHistoryAppointment
  );
  const color = useSelector((state) => state.theme.color);

  const styleSheet = {
    muiSelected: {
      '&.MuiButtonBase-root': {
        fontSize: '14px',
        fontWeight: 700,
        textTransform: 'capitalize',
        '&:hover': {
          color: 'rgba(138, 141, 142, 1)',
        },
        width: '50%',
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
  };

  const RenderHeaderTab = () => {
    return (
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid rgba(138, 141, 142, .4)',
        }}
      >
        <Tabs value={tabName} sx={styleSheet.indicatorForMobileView}>
          <Tab
            value='Orders'
            onClick={() => {
              setTabName('Orders');
            }}
            label='Orders'
            className={fontStyles.myFont}
            sx={styleSheet.muiSelected}
          />
          <Tab
            value='Appointment'
            onClick={() => {
              setTabName('Appointment');
            }}
            label='Appointment'
            className={fontStyles.myFont}
            sx={styleSheet.muiSelected}
          />
        </Tabs>
      </div>
    );
  };

  const RenderMain = () => {
    if (tabStateButton === 'ordered') {
      return <HistoryLogin fontStyles={fontStyles} />;
    } else if (tabStateButton === 'appointment') {
      return <HistoryAppointment />;
    }
  };
  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div style={{ margin: '0px 16px' }}>
          <RenderHeaderLabelHistory
            color={color}
            history={props.history}
            mobileSize={mobileSize}
          />
          <RenderHeaderTab />
          <RenderMain />
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '45%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'white',
            height: '98vh',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            marginTop: '10px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <RenderHeaderLabelHistory
            color={color}
            history={props.history}
            mobileSize={mobileSize}
          />
          <RenderHeaderTab />
          <RenderMain />
        </div>
      );
    }
  };

  return <ResponsiveLayout />;
};

export default History;
