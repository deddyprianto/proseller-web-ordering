import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { Button } from "reactstrap";
import loadable from "@loadable/component";
import { connect } from "react-redux";
// import config from "../config";
import { CampaignAction } from '../redux/actions/CampaignAction';

const MySVC = loadable(() => import("../components/svc/MySVC"));
// const BuySVC = loadable(() => import("../components/svc/BuySVC"));

class StoreValueCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMySVC: true,
      loadingShow: true,
      dataStampsRasio: "0:0",
      dataStamps: {},
      campaignStampsAnnouncement: false,
      stampsDetail: {},
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(CampaignAction.getCampaignPoints({ history: "true" }, this.props.account.companyId));
  }

  componentDidUpdate(prevProps){
    if(prevProps.pointData !== this.props.pointData){
      this.setState(this.props.pointData)
    }
  }

  render() {
    // let {isMySVC, totalPoint} = this.state;
    return (
      <div
        className="col-full"
        style={{
          // marginTop: config.prefix === "emenu" ? 100 : 160,
          marginTop: 100,
          // marginBottom: 20,
        }}
      >
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -40,
                display: "flex",
                height: 40,
                justifyContent: "space-between",
                alignItems: "center"
              }}
              className="background-theme"
            >
              <Link to={'/profile'}>
                <div
                  style={{ marginLeft: 10, fontSize: 16 }}
                >
                  <i className="fa fa-chevron-left"></i> Back
                </div>
              </Link>
            </div>
            {/* <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -60,
              }}
            >
              <Button
                className={isMySVC ? "use-select" : "un-select"}
                style={{ height: 50, fontWeight: "bold" }}
                onClick={() => this.setState({ isMySVC: true })}
              >
                My SVC
              </Button>
              <Button
                className={!isMySVC ? "use-select" : "un-select"}
                style={{ height: 50, fontWeight: "bold" }}
                onClick={() => this.setState({ isMySVC: false })}
              >
                Buy SVC
              </Button>
            </div> */}
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center" }}
            >
              <div style={{ marginTop: 20 }}>
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

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreValueCard);