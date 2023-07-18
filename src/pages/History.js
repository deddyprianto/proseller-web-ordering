import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import loadable from '@loadable/component';
import fontStyles from './Histories/style/styles.module.css';
import useMobileSize from 'hooks/useMobileSize';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RenderHeaderLabelHistory } from 'components/historyHeader';
import { CONSTANT } from 'helpers';

const HistoryLogin = loadable(() =>
  import('./Histories/component/HistoryLogin')
);
const HistoryAppointment = loadable(() =>
  import('./Histories/component/HistoryAppointment')
);

const RenderMain = ({ tabStateButton, appointmentSetting }) => {
  if (tabStateButton === 'Orders') {
    return (
      <HistoryLogin
        fontStyles={fontStyles}
        appointmentSetting={appointmentSetting}
      />
    );
  } else if (tabStateButton === 'Appointment') {
    return <HistoryAppointment />;
  }
};

const ResponsiveLayout = ({
  color,
  props,
  mobileSize,
  appointmentSetting,
  styleSheet,
  dispatch,
  tabStateButton,
}) => {
  if (mobileSize) {
    return (
      <div
        style={{
          margin: '0px 16px',
          backgroundColor: 'white',
        }}
      >
        <RenderHeaderLabelHistory
          color={color}
          history={props.history}
          mobileSize={mobileSize}
        />
        {appointmentSetting && (
          <div
            style={{
              width: '100%',
              borderBottom: '1px solid rgba(138, 141, 142, .4)',
            }}
          >
            <Tabs value={tabStateButton} sx={styleSheet.indicatorForMobileView}>
              <Tab
                value='Orders'
                onClick={() => {
                  dispatch({
                    type: CONSTANT.TAB_STATE_HISTORY,
                    payload: 'Orders',
                  });
                }}
                label='Orders'
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
              <Tab
                value='Appointment'
                onClick={() => {
                  dispatch({
                    type: CONSTANT.TAB_STATE_HISTORY,
                    payload: 'Appointment',
                  });
                }}
                label='Appointment'
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
            </Tabs>
          </div>
        )}
        <RenderMain
          tabStateButton={tabStateButton}
          appointmentSetting={appointmentSetting}
        />
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
        {appointmentSetting && (
          <div
            style={{
              width: '100%',
              borderBottom: '1px solid rgba(138, 141, 142, .4)',
            }}
          >
            <Tabs value={tabStateButton} sx={styleSheet.indicatorForMobileView}>
              <Tab
                value='Orders'
                onClick={() => {
                  dispatch({
                    type: CONSTANT.TAB_STATE_HISTORY,
                    payload: 'Orders',
                  });
                }}
                label='Orders'
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
              <Tab
                value='Appointment'
                onClick={() => {
                  dispatch({
                    type: CONSTANT.TAB_STATE_HISTORY,
                    payload: 'Appointment',
                  });
                }}
                label='Appointment'
                className={fontStyles.myFont}
                sx={styleSheet.muiSelected}
              />
            </Tabs>
          </div>
        )}
        <RenderMain
          tabStateButton={tabStateButton}
          appointmentSetting={appointmentSetting}
        />
      </div>
    );
  }
};
const History = (props) => {
  const dispatch = useDispatch();
  const [appointmentSetting, setAppointmentSetting] = useState(false);
  const mobileSize = useMobileSize();

  const tabStateButton = useSelector(
    (state) => state.appointmentReducer.tabStateHistory
  );

  const color = useSelector((state) => state.theme.color);
  const setting = useSelector((state) => state.order.setting);

  useEffect(() => {
    const settingAppoinment = setting.find((items) => {
      return items.settingKey === 'EnableAppointment';
    });
    if (settingAppoinment?.settingValue) {
      setAppointmentSetting(settingAppoinment.settingValue);
    }
  }, [setting]);

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
  return (
    <ResponsiveLayout
      color={color}
      props={props}
      mobileSize={mobileSize}
      appointmentSetting={appointmentSetting}
      styleSheet={styleSheet}
      dispatch={dispatch}
      tabStateButton={tabStateButton}
    />
  );
};

export default History;
