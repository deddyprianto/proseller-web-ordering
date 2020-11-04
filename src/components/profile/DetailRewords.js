import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Col,
  Row,
  Button,
} from 'reactstrap';
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Shimmer from "react-shimmer-effect";
import { CampaignAction } from '../../redux/actions/CampaignAction';
import ModalPointsDetail from './ModalPointsDetail';
import ModalStampsDetail from './ModalStampsDetail';
import ModalEditProfile from './ModalEditProfile';
import { Link } from 'react-router-dom';

class DetailRewords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      dataStampsRasio: "0:0",
      dataStamps: {},
      campaignStampsAnnouncement: false,
      stampsDetail: {},
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null,
      pointIcon: ""
    }
  }

  componentDidMount = async () => {
    let response = await this.props.dispatch(CampaignAction.getCampaignStamps());
    if (response.ResultCode === 200) this.setState(response.Data)

    response = await this.props.dispatch(CampaignAction.getCampaignPoints({ history: "true" }, this.props.account.companyId));
    if (response.ResultCode === 200) this.setState(response.Data)

    let pointIcon = this.props.setting.find(items => { return items.settingKey === "PointIcon" })
    if (pointIcon) this.setState({ pointIcon: pointIcon.settingValue });

    // this.state.loadingShow = false
    this.setState({ loadingShow: false })
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div style={{
          width: "100%", height: isHeight, alignSelf: "center",
          borderRadius: "8px", marginBottom: 10
        }} />
      </Shimmer>
    )
  }

  viewLeftPage = (loadingShow) => {
    let {
      dataStamps,
      campaignStampsAnnouncement
    } = this.state

    return (
      <div style={{ marginBottom: 10 }}>
        {
          loadingShow &&
          <div>
            {this.viewShimmer()}
            {this.viewShimmer(50)}
          </div>
        }
        {
          !loadingShow && dataStamps && dataStamps.length > 0 &&
          <div className="profile-dashboard" style={{
            boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", borderBottomRightRadius: 20, borderBottomLeftRadius: 20,
            border: "0px solid rgba(128, 128, 128, 0.5)"
          }}>
            {
              campaignStampsAnnouncement ?
                <div style={{ width: '100%', textAlign: "center" }}>
                  <div style={{ marginBottom: 10, color: "#FFF", paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                    Please complete your profile information to collect stamps
                  </div>
                  <Button color="warning"
                    style={{ color: "#FFF", fontWeight: "bold", marginBottom: 10 }}
                    data-toggle="modal" data-target="#edit-profile-modal"
                  >
                    Complete Now
                  </Button>
                </div> :
                <div>
                  <div style={{ color: "#FFF", fontWeight: "bold", paddingTop: 10 }}>
                    My Stamps
                  </div>
                  <div style={{
                    marginTop: 20, marginBottom: 20, display: "flex",
                    flexDirection: "column", justifyContent: "center", alignItems: "center"
                  }}
                  >
                    {
                      dataStamps.map((items, keys) => (
                        <div key={keys} style={{
                          marginBottom: 10, display: "flex",
                          justifyContent: "space-between", width: 50 * items.length,
                        }}>
                          {
                            items.map((item, key) =>
                              item.stampsStatus === "-" ? (
                                <div key={key} style={{
                                  height: 40, width: 40, borderRadius: 40, display: "flex",
                                  flexDirection: "column", justifyContent: "center", alignItems: "center",
                                  backgroundColor: "#FFF"
                                }} >
                                  <StarBorderIcon className="customer-group-name" style={{ fontSize: 20 }} />
                                </div>
                              ) : (
                                  <div key={key} style={{
                                    height: 40, width: 40, borderRadius: 40,
                                    display: "flex", flexDirection: "column", justifyContent: "center",
                                    alignItems: "center", backgroundColor: "#FFF"
                                  }} >
                                    <StarIcon style={{ color: "#ffa41b", fontSize: 20 }} />
                                  </div>
                                )
                            )}
                        </div>
                      ))
                    }
                    <Button size="sm" color="ghost-warning"
                      style={{ marginTop: -4, fontWeight: "bold", width: 150 }}
                      data-toggle="modal" data-target="#stamps-detail-modal"
                    >
                      More Detail
                    </Button>
                  </div>
                </div>
            }
          </div>
        }
      </div>
    )
  }

  viewRightPage = (loadingShow) => {
    let {
      campaignPointActive,
      totalPoint,
      campaignPointAnnouncement,
      pointIcon
    } = this.state

    return (
      <div>
        {
          loadingShow &&
          <div>
            {this.viewShimmer()}
            {this.viewShimmer(50)}
          </div>
        }
        {
          !loadingShow && campaignPointActive && totalPoint !== 0 &&
          <div style={{ boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", }}>
            {
              campaignPointAnnouncement ?
                <div style={{ width: '100%', textAlign: "center", marginTop: 20, paddingBottom: 10 }}>
                  <div style={{ marginBottom: 10, color: "#c00a27", paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                    Please complete your profile information to start to earn points
                  </div>
                  <Button color="warning"
                    style={{ color: "#FFF", fontWeight: "bold" }}
                    data-toggle="modal" data-target="#edit-profile-modal"
                  >
                    Complete Now
                  </Button>
                </div> :
                <div style={{ 
                  width: '100%', textAlign: "center", display: "flex", 
                  flexDirection: "column", justifyContent: "center", alignItems: "center" 
                }}>
                  {
                    pointIcon && pointIcon !== "" &&
                    <img src={pointIcon} alt="my point" style={{height: 100, objectFit: "contain", marginTop: 10}}/>
                  }
                  <div style={{ textAlign: "center", fontWeight: "bold", paddingTop: 10 }}>My Points</div>
                  <div className="text-value" style={{ fontSize: 35, textAlign: "center", marginBottom: 13, marginTop: 5 }}>
                    {this.state.totalPoint.toFixed(2)}
                  </div>
                  <Button size="sm" color="ghost-warning"
                    style={{ marginTop: -4, fontWeight: "bold", width: 150 }}
                    data-toggle="modal" data-target="#points-detail-modal"
                  >
                    More Detail
                  </Button>
                </div>
            }
          </div>
        }

        {
          !loadingShow &&
          <div>
            <Link to="/voucher">
              <div 
                className="background-theme"
                style={{
                  padding: 10, marginTop: 10,
                  borderRadius: 10, border: "1px solid #CDCDCD",
                  boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                  cursor: "pointer"
              }}>
                <div style={{ textAlign: "center" }} >
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    <i className="fa fa-gift" aria-hidden="true" /> My Rewards
                </div>
                </div>
              </div>
            </Link>
          </div>
        }
      </div>
    )
  }

  render() {
    let { loadingShow, dataStamps, stampsDetail, image, detailPoint } = this.state
    return (
      <div style={{ paddingTop: 20 }}>
        <ModalPointsDetail detailPoint={detailPoint} />
        <ModalStampsDetail data={dataStamps} detail={stampsDetail} image={image} />
        <ModalEditProfile />
        <Row>
          <Col sm={6}>
            {this.viewLeftPage(loadingShow)}
          </Col>
          <Col sm={6}>
            {this.viewRightPage(loadingShow)}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    setting: state.order.setting,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailRewords);
