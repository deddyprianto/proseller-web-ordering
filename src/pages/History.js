import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HistoryLogin from './Histories/component/HistoryLogin';
import HistoryAppointment from './Histories/component/HistoryAppointment';

const History = (props) => {
  const [appointmentFeature, setAppointmentFeature] = useState(false);
  const [tabStateButton, setTabStateButton] = useState('ordered');
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

  const Header = () => {
    const styleSheet = {
      container: {
        width: '45%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'white',
        height: '92vh',
        borderRadius: '8px',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 85px',
        gap: '0px 15px',
        gridTemplateAreas: '"."\n    "."',
        overflowY: 'auto',
      },
      gridStyle: {
        display: 'grid',
        gridTemplateColumns: '50px 1fr 50px',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". . ."',
        cursor: 'pointer',
      },
      paper: {
        maxHeight: 500,
        overflow: 'auto',
        backgroundColor: 'white',
      },
      categoryName: {
        color: 'gray',
        fontSize: '15px',
        fontWeight: 500,
        textTransform: 'capitalize',
      },
      muiSelected: {
        '&.MuiButtonBase-root': {
          fontSize: '14px',
          textTransform: 'capitalize',
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
          width: 15,
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
      inputDropdown: {
        '&.MuiSelect-select': {
          border: 'none',
        },
      },
    };
    const localStyle = {
      container: {
        ...styleSheet.gridStyle,
        marginTop: '25px',
        alignItems: 'center',
        justifyItems: 'center',
      },
      label: {
        padding: 0,
        margin: 0,
        justifySelf: 'start',
        fontWeight: 700,
        fontSize: '20px',
        color: color.primary,
      },
    };
    return (
      <div style={localStyle.container}>
        <ArrowBackIosIcon
          sx={{ color: color.primary, marginLeft: '10px' }}
          fontSize='large'
          onClick={() => {
            props.history.push('/');
          }}
        />
        <div style={localStyle.label}>History</div>
      </div>
    );
  };
  const TabHistories = () => {
    return (
      <div
        style={{
          width: '92%',
          margin: 'auto',
          display: 'flex',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <button
          onClick={() => setTabStateButton('ordered')}
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
          Orders
        </button>
        {appointmentFeature && (
          <button
            onClick={() => setTabStateButton('appointment')}
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
              color: tabStateButton === 'appointment' ? 'white' : color.primary,
              fontSize: '14px',
            }}
          >
            Appointment
          </button>
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
      <Header />
      <TabHistories />
      <RenderMain />
    </React.Fragment>
  );
};

export default History;
