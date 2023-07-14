import config from 'config';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import loadable from '@loadable/component';

import { HistoryAction } from 'redux/actions/HistoryAction';
import useMobileSize from 'hooks/useMobileSize';

const HistoryTransaction = loadable(() =>
  import('components/history/HistoryTransaction')
);
const HistoryPending = loadable(() =>
  import('components/history/HistoryPending')
);

const History = ({ fontStyles }) => {
  const dispatch = useDispatch();
  const mobileSize = useMobileSize();
  const [tabStateButton, setTabStateButton] = useState('Pending Order');
  const [dataPending, setDataPending] = useState({});
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const [appointmentFeature, setAppointmentFeature] = useState(false);
  const setting = useSelector((state) => state.order.setting);

  const stateTabs = window.location.hash.split('?')[1] || 'ordered';

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

  const RenderMain = () => {
    if (stateTabs === 'ordered') {
      return (
        <HistoryTransaction
          countryCode={companyInfo?.countryCode}
          isAppointment={appointmentFeature}
          color={color}
        />
      );
    } else if (stateTabs === 'pendingorder') {
      return (
        <HistoryPending
          dataPending={dataPending?.dataPending}
          dataPendingLength={dataPending?.dataPendingLength}
          countryCode={companyInfo?.countryCode}
          isAppointment={appointmentFeature}
        />
      );
    }
  };

  const HeaderButton = () => {
    return (
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          className={fontStyles.myFont}
          onClick={() => {
            handleChangeTab('ordered');
            setTabStateButton('Pending Order');
          }}
          style={{
            display: 'flex',
            border:
              tabStateButton === 'Pending Order'
                ? 'none'
                : `1px solid ${color.primary}`,
            backgroundColor:
              tabStateButton === 'Pending Order' ? color.primary : 'white',
            color: tabStateButton === 'Pending Order' ? 'white' : color.primary,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px 14px',
            marginRight: '10px',
            fontWeight: 600,
            fontSize: '14px',
            width: '128px',
            height: '37px',
            borderRadius: '8px',
          }}
        >
          Pending Order
        </button>
        <button
          onClick={() => {
            handleChangeTab('pendingorder');
            setTabStateButton('Past Order');
          }}
          className={fontStyles.myFont}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px 16px',
            fontWeight: 600,
            border:
              tabStateButton === 'Past Order'
                ? 'none'
                : `1px solid ${color.primary}`,
            backgroundColor:
              tabStateButton === 'Past Order' ? color.primary : 'white',
            color: tabStateButton === 'Past Order' ? 'white' : color.primary,
            fontSize: '14px',
            width: '128px',
            height: '37px',
            borderRadius: '8px',
          }}
        >
          Past Order
        </button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <HeaderButton />
      <RenderMain />
    </React.Fragment>
  );
};

export default History;
