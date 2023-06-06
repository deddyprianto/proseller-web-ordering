import config from 'config';
import React, { useEffect, useState } from 'react';
import { HistoryAction } from 'redux/actions/HistoryAction';

const History = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDataBasketPending = async () => {
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

  return <div>History</div>;
};

export default History;
