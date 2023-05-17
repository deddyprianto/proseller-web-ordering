import React, { Component } from 'react';
import { Button } from 'reactstrap';
import loadable from '@loadable/component';
import { connect } from 'react-redux';
import config from '../config';
import { CampaignAction } from '../redux/actions/CampaignAction';

const MyVoucher = loadable(() => import('../components/voucher/MyVoucher'));
const RedeemVoucher = loadable(() =>
  import('../components/voucher/RedeemVoucher')
);

class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      loadingShow: true,
      dataStamps: {},
      campaignStampsAnnouncement: false,
      stampsDetail: {},
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null,
      size: { width: 0, height: 0 },
      isMobileSize: false,
    };
  }

  componentDidMount = async () => {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);

    await this.props.dispatch(
      CampaignAction.getCampaignPoints(
        { history: 'true' },
        this.props.account.companyId
      )
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.pointData !== this.props.pointData) {
      this.setState(this.props.pointData);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    const { innerWidth, innerHeight } = window;
    this.setState({ size: { width: innerWidth, height: innerHeight } });
    this.checkMobileSize(innerWidth);
  };

  checkMobileSize = (width) => {
    if (width < 640) {
      this.setState({ isMobileSize: true });
    } else {
      this.setState({ isMobileSize: false });
    }
  };

  render() {
    let { isMyVoucher, totalPoint, isMobileSize } = this.state;
    return (
      <div
        className='col-full'
        style={{
          marginTop: config.prefix === 'emenu' ? 100 : isMobileSize ? 66 : 76,
        }}
      >
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            <div
              style={{
                flexDirection: 'row',
                position: 'fixed',
                zIndex: 10,
                width: '100%',
                display: 'flex',
                height: 40,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              className='background-theme'
            >
              <div
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className='fa fa-chevron-left'></i> Back
              </div>
              <div
                style={{ marginRight: 10, fontSize: 16, fontWeight: 'bold' }}
              >
                <i className='fa fa-tags' aria-hidden='true' />{' '}
                {totalPoint.toFixed(2)}
              </div>
            </div>
            <div
              style={{
                flexDirection: 'row',
                position: 'fixed',
                zIndex: 10,
                width: '100%',
                marginTop: 40,
              }}
            >
              <Button
                className={isMyVoucher ? 'use-select' : 'un-select'}
                style={{ height: 50, fontWeight: 'bold' }}
                onClick={() => this.setState({ isMyVoucher: true })}
              >
                My Vouchers
              </Button>
              <Button
                className={!isMyVoucher ? 'use-select' : 'un-select'}
                style={{ height: 50, fontWeight: 'bold' }}
                onClick={() => this.setState({ isMyVoucher: false })}
              >
                Redeem Vouchers
              </Button>
            </div>
            <main
              id='main'
              className='site-main'
              style={{ textAlign: 'center' }}
            >
              <div style={{ paddingTop: 100 }}>
                {this.state.isMyVoucher && <MyVoucher />}
                {!this.state.isMyVoucher && <RedeemVoucher />}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    pointData: state.campaign.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
