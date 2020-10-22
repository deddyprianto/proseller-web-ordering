import React, { Component } from "react";
import { Button } from "reactstrap";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import { CampaignAction } from '../redux/actions/CampaignAction';

const MyVoucher = loadable(() => import("../components/voucher/MyVoucher"));
const RedeemVoucher = loadable(() =>
  import("../components/voucher/RedeemVoucher")
);

class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
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
    let {isMyVoucher, totalPoint} = this.state;
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 100 : 160,
          marginBottom: 50,
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
                marginTop: -100,
                backgroundColor: "#FFF",
                display: "flex",
                height: 40,
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <button
                type="button"
                className="close"
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className="fa fa-chevron-left"></i> Back
              </button>
              <div style={{ marginRight: 10, fontSize: 16, fontWeight: "bold", marginRight: 10 }}>
                <i className="fa fa-tags" aria-hidden="true" /> {totalPoint.toFixed(2)}
              </div>
            </div>
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -60,
              }}
            >
              <Button
                className={isMyVoucher ? "use-select" : "un-select"}
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
                onClick={() => this.setState({ isMyVoucher: true })}
              >
                My Vouchers
              </Button>
              <Button
                className={!isMyVoucher ? "use-select" : "un-select"}
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
                onClick={() => this.setState({ isMyVoucher: false })}
              >
                Redeem Vouchers
              </Button>
            </div>
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center" }}
            >
              <div style={{ marginTop: 20 }}>
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

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);