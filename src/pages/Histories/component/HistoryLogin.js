import config from 'config';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HistoryAction } from 'redux/actions/HistoryAction';
import fontStyles from '../style/styles.module.css';
import loadable from '@loadable/component';
import { MasterDataAction } from 'redux/actions/MasterDataAction';

const HistoryTransaction = loadable(() =>
  import('components/history/HistoryTransaction')
);
const HistoryPending = loadable(() =>
  import('components/history/HistoryPending')
);
const History = () => {
  const [stateTabs, setStateTabs] = useState('ordered');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [dataPending, setDataPending] = useState([]);
  const [dataPendingLength, setDataPendingLength] = useState(0);
  const [countryCode, setCountryCode] = useState('ID');
  const color = useSelector((state) => state.theme.color);

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
      let infoCompany = await this.props.dispatch(
        MasterDataAction.getInfoCompany()
      );
      setCountryCode(infoCompany.countryCode);
      let response = await this.props.dispatch(
        HistoryAction.getBasketPending({
          take: 1000,
          skip: 0,
        })
      );
      if (response.resultCode === 200) {
        this.setState(response.data);
        if (response.data.dataPendingLength > 0) {
          this.setState({ isTransaction: false });
        }
      }
    };
    getDataBasketPending();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    try {
      document.getElementsByClassName('modal-backdrop')[0].remove();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const RenderTabHeaderMobile = () => {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            marginTop: '30px',
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

  const RenderConditionalCP = () => {
    if (stateTabs === 'ordered') {
      return <HistoryTransaction countryCode={countryCode} />;
    } else if (stateTabs === 'pendingorder') {
      return (
        <HistoryPending
          dataPending={dataPending}
          dataPendingLength={dataPendingLength}
          countryCode={countryCode}
        />
      );
    }
  };

  return (
    <div className={fontStyles.myFont}>
      <RenderTabHeaderMobile />
      <RenderConditionalCP />
    </div>
  );
};

export default History;
