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

  const RenderHeaderTab = () => {
    const topAppointment = mobileSize ? '165px' : '175px';
    const topCommon = mobileSize ? '50px' : '60px';

    return (
      <div
        style={{
          width: '100%',
          position: 'fixed',
          top: appointmentFeature ? topAppointment : topCommon,
        }}
      >
        <div
          style={{
            marginTop: '15px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". ."',
            fontSize: '18px',
            height: '50px',
          }}
        >
          <div
            onClick={() => handleChangeTab('ordered')}
            style={{
              backgroundColor:
                stateTabs === 'ordered' ? color.primary : 'white',
              width: '100%',
              color: stateTabs === 'ordered' ? 'white' : color.primary,
              textAlign: 'center',
              lineHeight: '50px',
            }}
          >
            Order
          </div>
          <div
            onClick={() => handleChangeTab('pendingorder')}
            style={{
              backgroundColor:
                stateTabs === 'pendingorder' ? color.primary : 'white',
              width: '100%',
              color: stateTabs === 'pendingorder' ? 'white' : color.primary,
              textAlign: 'center',
              lineHeight: '50px',
            }}
          >
            Pending Order
          </div>
        </div>
      </div>
    );
  };

  const RenderMain = () => {
    if (stateTabs === 'ordered') {
      return (
        <HistoryTransaction
          countryCode={companyInfo?.countryCode}
          isAppointment={appointmentFeature}
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
          margin: '20px auto auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          className={fontStyles.myFont}
          onClick={() => setTabStateButton('Pending Order')}
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
            padding: '7px 10px',
            marginRight: '10px',
            fontWeight: 600,
            fontSize: '14px',
            width: '128px',
          }}
        >
          Pending Order
        </button>
        <button
          onClick={() => setTabStateButton('Past Order')}
          className={fontStyles.myFont}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7px 10px',
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
      {/* <RenderMain /> */}
    </React.Fragment>
  );
};

export default History;
