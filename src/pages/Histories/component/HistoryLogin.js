import config from 'config';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import loadable from '@loadable/component';

import { HistoryAction } from 'redux/actions/HistoryAction';

const HistoryTransaction = loadable(() =>
  import('components/history/HistoryTransaction')
);
const HistoryPending = loadable(() =>
  import('components/history/HistoryPending')
);

const HeaderButton = ({
  appointmentSetting,
  fontStyles,
  handleChangeTab,
  stateTabs,
  color,
}) => {
  return (
    <div
      style={{
        marginTop: appointmentSetting ? '16px' : '10px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        className={fontStyles.myFont}
        onClick={() => {
          handleChangeTab('ongoing');
        }}
        style={{
          display: 'flex',
          border:
            stateTabs === 'ongoing' ? 'none' : `1px solid ${color.primary}`,
          backgroundColor: stateTabs === 'ongoing' ? color.primary : 'white',
          color: stateTabs === 'ongoing' ? 'white' : color.primary,
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px 14px',
          marginRight: '10px',
          fontWeight: 600,
          fontSize: '14px',
          width: '132px',
          height: '37px',
          borderRadius: '8px',
        }}
      >
        Ongoing Order
      </button>
      <button
        onClick={() => {
          handleChangeTab('pastorder');
        }}
        className={fontStyles.myFont}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px 16px',
          fontWeight: 600,
          border:
            stateTabs === 'pastorder' ? 'none' : `1px solid ${color.primary}`,
          backgroundColor: stateTabs === 'pastorder' ? color.primary : 'white',
          color: stateTabs === 'pastorder' ? 'white' : color.primary,
          fontSize: '14px',
          width: '132px',
          height: '37px',
          borderRadius: '8px',
        }}
      >
        Past Order
      </button>
    </div>
  );
};

const RenderMain = ({
  stateTabs,
  companyInfo,
  appointmentFeature,
  color,
  dataPending,
}) => {
  if (stateTabs === 'ongoing') {
    return (
      <HistoryPending
        dataPending={dataPending?.dataPending}
        dataPendingLength={dataPending?.dataPendingLength}
        countryCode={companyInfo?.countryCode}
        isAppointment={appointmentFeature}
      />
    );
  } else if (stateTabs === 'pastorder') {
    return (
      <HistoryTransaction
        countryCode={companyInfo?.countryCode}
        isAppointment={appointmentFeature}
        color={color}
      />
    );
  }
};

const History = ({ fontStyles, appointmentSetting }) => {
  const dispatch = useDispatch();
  const [dataPending, setDataPending] = useState({});
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const [appointmentFeature, setAppointmentFeature] = useState(false);
  const setting = useSelector((state) => state.order.setting);

  const stateTabs = window.location.hash.split('?')[1] || 'ongoing';

  useEffect(() => {
    let isMounted = true;

    const getDataBasketPending = async () => {
      let response = await dispatch(
        HistoryAction.getBasketPending({
          take: 100,
          skip: 0,
        })
      );
      if (response.resultCode === 200 && isMounted) {
        setDataPending(response.data);
      }
    };

    getDataBasketPending();

    return () => {
      isMounted = false;
    };
  }, [stateTabs, dispatch]);

  useEffect(() => {
    const settingAppoinment = setting.find((items) => {
      return items.settingKey === 'EnableAppointment';
    });
    if (settingAppoinment?.settingValue) {
      setAppointmentFeature(settingAppoinment.settingValue);
    }
  }, [setting]);

  useEffect(() => {
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
  }, []);

  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  const handleChangeTab = (type) => {
    window.location.href = changeFormatURl(`/history?${type}`);
  };

  return (
    <React.Fragment>
      <HeaderButton
        appointmentSetting={appointmentSetting}
        fontStyles={fontStyles}
        handleChangeTab={handleChangeTab}
        stateTabs={stateTabs}
        color={color}
      />
      <RenderMain
        stateTabs={stateTabs}
        companyInfo={companyInfo}
        appointmentFeature={appointmentFeature}
        color={color}
        dataPending={dataPending}
      />
    </React.Fragment>
  );
};

export default History;
