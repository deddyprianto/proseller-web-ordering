import config from 'config';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HistoryAction } from 'redux/actions/HistoryAction';
import HistoryTransaction from 'components/history/HistoryTransaction';
import HistoryPending from 'components/history/HistoryPending';

const History = () => {
  const dispatch = useDispatch();
  const [stateTabs, setStateTabs] = useState('ordered');
  const [dataPending, setDataPending] = useState({});
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  const style = {
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
  };

  useEffect(() => {
    const getDataBasketPending = async () => {
      let response = await dispatch(
        HistoryAction.getBasketPending({
          take: 100,
          skip: 0,
        })
      );
      if (response.resultCode === 200) {
        setDataPending(response.data);
      }
    };
    getDataBasketPending();
  }, [stateTabs]);

  useEffect(() => {
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
  }, []);

  const RenderHeaderTab = () => {
    return (
      <div style={{ width: '100%' }}>
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
            onClick={() => setStateTabs('ordered')}
            style={{
              backgroundColor:
                stateTabs === 'ordered' ? color.primary : 'white',
              width: '100%',
              color: stateTabs === 'ordered' ? 'white' : color.primary,
              textAlign: 'center',
              lineHeight: '50px',
            }}
          >
            Ordered
          </div>
          <div
            onClick={() => setStateTabs('pendingorder')}
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
      return <HistoryTransaction countryCode={companyInfo?.countryCode} />;
    } else if (stateTabs === 'pendingorder') {
      return (
        <HistoryPending
          dataPending={dataPending?.dataPending}
          dataPendingLength={dataPending?.dataPendingLength}
          countryCode={companyInfo?.countryCode}
        />
      );
    }
  };

  return (
    <React.Fragment>
      <RenderHeaderTab />
      <RenderMain />
    </React.Fragment>
  );
};

export default History;
