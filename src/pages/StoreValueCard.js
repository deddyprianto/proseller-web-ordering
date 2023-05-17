import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import loadable from '@loadable/component';
import { connect } from 'react-redux';
import { CampaignAction } from '../redux/actions/CampaignAction';

const MySVC = loadable(() => import('../components/svc/MySVC'));

class StoreValueCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMySVC: true,
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
    let { isMobileSize } = this.state;
    return (
      <div className='col-full' style={{ marginTop: isMobileSize ? 66 : 76 }}>
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
              <Link to={'/profile'}>
                <div style={{ marginLeft: 10, fontSize: 16 }}>
                  <i className='fa fa-chevron-left'></i> Back
                </div>
              </Link>
            </div>
            <main
              id='main'
              className='site-main'
              style={{ textAlign: 'center' }}
            >
              <div style={{ paddingTop: 30 }}>
                <MySVC history={this.props.history} />
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreValueCard);
