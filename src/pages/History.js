/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import loadable from '@loadable/component';
import { HistoryAction } from '../redux/actions/HistoryAction';
import { MasterDataAction } from '../redux/actions/MasterDataAction';
import config from '../config';

const HistoryTransaction = loadable(() =>
  import('../components/history/HistoryTransaction')
);
const HistoryPending = loadable(() =>
  import('../components/history/HistoryPending')
);

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isTransaction: true,
      dataPending: [],
      dataPendingLength: 0,
      countryCode: 'ID',
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    try {
      document.getElementsByClassName('modal-backdrop')[0].remove();
    } catch (e) {
      console.log(e);
    }

    if (!this.props.isLoggedIn) return;

    await this.getDataBasketPending();

    // this.timeGetBasket = setInterval(async () => {
    // await this.getDataBasketPending();
    // }, 5000);
    let infoCompany = await this.props.dispatch(
      MasterDataAction.getInfoCompany()
    );
    this.setState({
      countryCode: infoCompany.countryCode,
      isLoading: false,
    });
  }

  async getDataBasketPending() {
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
  }

  render() {
    let { countryCode, dataPendingLength, dataPending, isTransaction } =
      this.state;

    if (!this.props.isLoggedIn) {
      return (
        <div
          className='col-full'
          style={{
            marginTop: config.prefix === 'emenu' ? 90 : 110,
            marginBottom: 50,
            padding: 0,
          }}
        >
          <div id='primary' className='content-area'>
            <div
              className='stretch-full-width'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <main id='main' className='site-main' style={{ width: '100%' }}>
                <div>
                  <center>
                    <img
                      width='500'
                      src={config.url_loginImage}
                      alt='is empty'
                      style={{ marginTop: 30 }}
                    />
                    <button
                      data-toggle='modal'
                      data-target='#login-register-modal'
                      type='button'
                      style={{ padding: 10, marginTop: 40 }}
                    >
                      Login
                    </button>
                  </center>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className='col-full'
        style={{
          marginTop: config.prefix === 'emenu' ? 100 : 0,
          marginBottom: 50,
        }}
      >
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            <div
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: '65px',
              }}
            >
              <Button
                className={isTransaction ? 'use-select' : 'un-select'}
                style={{ height: 50, fontWeight: 'bold' }}
                onClick={() => this.setState({ isTransaction: true })}
              >
                Orders
              </Button>
              <Button
                className={!isTransaction ? 'use-select' : 'un-select'}
                style={{ height: 50, fontWeight: 'bold' }}
                onClick={() => {
                  this.setState({ isTransaction: false });
                }}
              >
                {`Pending Orders ${
                  dataPendingLength > 0 ? `(${dataPendingLength})` : ''
                }`}
              </Button>
            </div>
            <main
              id='main'
              className='site-main'
              style={{
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              <div>
                {isTransaction && (
                  <HistoryTransaction countryCode={countryCode} />
                )}
                {!isTransaction && (
                  <HistoryPending
                    dataPending={dataPending}
                    dataPendingLength={dataPendingLength}
                    countryCode={countryCode}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
