import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import HistoryLogin from './Histories/component/HistoryLogin';
import HistoryAppointment from './Histories/component/HistoryAppointment';
import fontStyles from './Histories/style/styles.module.css';
import { CONSTANT } from 'helpers';
import useMobileSize from 'hooks/useMobileSize';

const History = (props) => {
  const dispatch = useDispatch();
  const mobileSize = useMobileSize();

  const [appointmentFeature, setAppointmentFeature] = useState(false);
  const tabStateButton = useSelector(
    (state) => state.appointmentReducer.tabStateHistoryAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const setting = useSelector((state) => state.order.setting);

  useEffect(() => {
    const settingAppoinment = setting.find((items) => {
      return items.settingKey === 'EnableAppointment';
    });
    if (settingAppoinment?.settingValue) {
      setAppointmentFeature(settingAppoinment.settingValue);
    }
  }, [setting]);

  const HeaderAppointment = () => {
    const localStyle = {
      container: {
        width: mobileSize ? '100%' : '96.5%',
        margin: 'auto',
        display: 'flex',
        marginTop: appointmentFeature ? (mobileSize ? '75px' : '85px') : '23px',
        alignItems: 'center',
        justifyItems: 'center',
      },
      label: {
        padding: 0,
        margin: 0,
        justifySelf: 'start',
        fontWeight: 700,
        fontSize: '18px',
        color: color.primary,
      },
    };
    return (
      <div
        style={{
          position: 'fixed',
          backgroundColor: '#ffffff',
          width: '100%',
          paddingBottom: '20px',
        }}
      >
        <div style={localStyle.container}>
          <ArrowBackIosIcon
            sx={{ color: color.primary, marginLeft: '10px', fontSize: '18px' }}
            onClick={() => {
              props.history.push('/');
            }}
          />
          <div style={localStyle.label}>History</div>
        </div>
        {appointmentFeature && (
          <div
            style={{
              width: '95%',
              margin: '20px auto auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              className={fontStyles.myFont}
              onClick={() =>
                dispatch({
                  type: CONSTANT.TAB_STATE_HISTORY_APPOINTMENT,
                  payload: 'ordered',
                })
              }
              style={{
                display: 'flex',
                border:
                  tabStateButton === 'ordered'
                    ? 'none'
                    : `1px solid ${color.primary}`,
                backgroundColor:
                  tabStateButton === 'ordered' ? color.primary : 'white',
                color: tabStateButton === 'ordered' ? 'white' : color.primary,
                justifyContent: 'center',
                alignItems: 'center',
                padding: '7px 10px',
                width: '100px',
                marginRight: '10px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Order
            </button>
            <button
              className={fontStyles.myFont}
              onClick={() =>
                dispatch({
                  type: CONSTANT.TAB_STATE_HISTORY_APPOINTMENT,
                  payload: 'appointment',
                })
              }
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '7px 10px',
                width: '150px',
                fontWeight: 600,
                border:
                  tabStateButton === 'appointment'
                    ? 'none'
                    : `1px solid ${color.primary}`,
                backgroundColor:
                  tabStateButton === 'appointment' ? color.primary : 'white',
                color:
                  tabStateButton === 'appointment' ? 'white' : color.primary,
                fontSize: '14px',
              }}
            >
              Appointment
            </button>
          </div>
        )}
      </div>
    );
  };

  const RenderMain = () => {
    if (tabStateButton === 'ordered') {
      return <HistoryLogin />;
    } else if (tabStateButton === 'appointment') {
      return <HistoryAppointment />;
    }
  };
  return (
    <React.Fragment>
      <HeaderAppointment />
      <RenderMain />
    </React.Fragment>
  );
};

export default History;
