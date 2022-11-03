import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { CampaignAction } from '../../redux/actions/CampaignAction';
import ModalPointsDetail from './ModalPointsDetail';
import ModalStampsDetail from './ModalStampsDetail';
import ModalEditProfile from './ModalEditProfile';
import { Link } from 'react-router-dom';
import DefaultStampsImage from './DefaultStampsImage';

const Stamps = ({ items, image, showDetails }) => {
  console.log(items);
  return (
    <div>
      <div style={{ color: '#FFF', fontWeight: 'bold', paddingTop: 10 }}>
        My Stamps
      </div>
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {image ? (
          <div>
            <img src={image} alt='Stamps' />
          </div>
        ) : (
          <DefaultStampsImage stampsItem={items} />
        )}
        <Button
          size='sm'
          color='ghost-warning'
          style={{
            fontWeight: 'bold',
            width: 150,
            marginBottom: 20,
          }}
          onClick={() => showDetails()}
        >
          More Detail
        </Button>
      </div>
    </div>
  );
};

class RewardsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null,
      pointIcon: '',
      isEmenu: window.location.hostname.includes('emenu'),
      showStampsDetail: false,
    };
  }

  componentDidMount = async () => {
    this.props.dispatch(CampaignAction.getCampaignStamps());

    let response = await this.props.dispatch(
      CampaignAction.getCampaignPoints(
        { history: 'true' },
        this.props.account.companyId
      )
    );
    if (response.ResultCode === 200) this.setState(response.Data);

    let pointIcon = this.props.setting.find((items) => {
      return items.settingKey === 'PointIcon';
    });
    if (pointIcon) this.setState({ pointIcon: pointIcon.settingValue });

    // this.state.loadingShow = false
    this.setState({ loadingShow: false });
  };

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: isHeight,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  viewLeftPage = (loadingShow) => {
    const { stamps } = this.props;

    return (
      <div style={{ marginBottom: 10 }}>
        {loadingShow && (
          <div>
            {this.viewShimmer()}
            {this.viewShimmer(50)}
          </div>
        )}
        {!loadingShow &&
          stamps &&
          stamps.stampsItem &&
          stamps.stampsItem.length > 0 && (
            <div
              className='profile-dashboard'
              style={{
                boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                border: '0px solid rgba(128, 128, 128, 0.5)',
              }}
            >
              {stamps.campaignStampsAnnouncement ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div
                    style={{
                      marginBottom: 10,
                      color: '#FFF',
                      paddingTop: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    Please complete your profile information to collect stamps
                  </div>
                  <Button
                    color='warning'
                    style={{
                      color: '#FFF',
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                    data-toggle='modal'
                    data-target='#edit-profile-modal'
                  >
                    Complete Now
                  </Button>
                </div>
              ) : (
                <Stamps
                  items={stamps.stampsItem}
                  image={stamps.stampsImage}
                  showDetails={() => this.setState({ showStampsDetail: true })}
                ></Stamps>
              )}
            </div>
          )}
      </div>
    );
  };

  viewRightPage = (loadingShow) => {
    const {
      campaignPointActive,
      totalPoint,
      campaignPointAnnouncement,
      pointIcon,
      pendingPoints,
      isEmenu,
    } = this.state;

    return (
      <div>
        {isEmenu && (
          <Link to='/profile'>
            <div
              className='background-theme'
              style={{ marginLeft: 10, fontSize: 16, textAlign: 'left' }}
            >
              <i className='fa fa-chevron-left'></i> Back
            </div>
          </Link>
        )}
        {loadingShow && (
          <div>
            {this.viewShimmer()}
            {this.viewShimmer(50)}
          </div>
        )}
        {!loadingShow && campaignPointActive && totalPoint !== 0 && (
          <div
            style={{
              boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
              border: '1px solid #CDCDCD',
            }}
          >
            {campaignPointAnnouncement ? (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: 20,
                  paddingBottom: 10,
                }}
              >
                <div
                  style={{
                    marginBottom: 10,
                    color: '#c00a27',
                    paddingTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  Please complete your profile information to start to earn
                  points
                </div>
                <Button
                  color='warning'
                  style={{ color: '#FFF', fontWeight: 'bold' }}
                  data-toggle='modal'
                  data-target='#edit-profile-modal'
                >
                  Complete Now
                </Button>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {pointIcon && pointIcon !== '' && (
                  <img
                    src={pointIcon}
                    alt='my point'
                    style={{ height: 100, objectFit: 'contain', marginTop: 10 }}
                  />
                )}
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    paddingTop: 10,
                  }}
                >
                  My Points
                </div>
                <div
                  className='text-value'
                  style={{
                    fontSize: 42,
                    textAlign: 'center',
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                >
                  {totalPoint.toFixed(2)}
                </div>
                {pendingPoints && pendingPoints > 0 ? (
                  <div
                    className='text text-warning-theme'
                    style={{
                      fontSize: 14,
                      border: '1px solid #DCDCDC',
                      borderRadius: 5,
                      padding: 5,
                      lineHeight: '17px',
                      marginTop: 10,
                      marginBottom: 20,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    {`Your ${pendingPoints} points is blocked, because your order has not been completed.`}
                  </div>
                ) : null}
                <Button
                  size='sm'
                  color='ghost-warning'
                  style={{
                    marginTop: -4,
                    fontWeight: 'bold',
                    width: 150,
                    marginBottom: 20,
                  }}
                  data-toggle='modal'
                  data-target='#points-detail-modal'
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        )}

        {!loadingShow && (
          <div>
            <Link to='/voucher'>
              <div
                className='background-theme'
                style={{
                  padding: 10,
                  marginTop: 30,
                  borderRadius: 10,
                  border: '1px solid #CDCDCD',
                  boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                    <i className='fa fa-gift' aria-hidden='true' /> My Rewards
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { loadingShow, detailPoint, pendingPoints, showStampsDetail } =
      this.state;
    const { stamps } = this.props;
    return (
      <div>
        <ModalPointsDetail
          detailPoint={detailPoint}
          pendingPoints={pendingPoints}
          campaignDescription={this.props.campaign.campaignDescription}
        />
        {stamps && showStampsDetail && (
          <ModalStampsDetail
            data={stamps.stampsItem}
            detail={stamps}
            image={stamps.stampsImage}
            closeModal={() => this.setState({ showStampsDetail: false })}
          />
        )}
        <ModalEditProfile />
        <Row>
          <Col sm={6}>{this.viewLeftPage(loadingShow)}</Col>
          <Col sm={6}>{this.viewRightPage(loadingShow)}</Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    setting: state.order.setting,
    campaign: state.campaign.data,
    stamps: state.customer.stamps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardsDetail);
