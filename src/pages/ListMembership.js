import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import Shimmer from "react-shimmer-effect";
import { MembershiplAction } from "../redux/actions/MembershipAction";
import { Button } from "reactstrap";
const CardMembership = loadable(() =>
  import("../components/membership/CardMembership")
);
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class ListMembership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      selectedMembership: null,
      loading: true,
    };
  }

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
    return price;
  };

  componentDidMount = async () => {
    const response = await this.props.dispatch(
      MembershiplAction.getPaidMembership()
    );
    this.setState({ memberships: response.data, loading: false });
  };

  viewShimmer = (isHeight = 60) => {
    return (
      <Shimmer>
        <div
          style={{
            width: "100%",
            height: isHeight,
            alignSelf: "center",
            borderRadius: "8px",
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  detailMembership = (selectedMembership) => {
    localStorage.setItem(
      `${config.prefix}_selectedMembership`,
      JSON.stringify(encryptor.encrypt(selectedMembership))
    );
    this.props.history.push({
      pathname: '/detail-membership',
    });
  }

  render() {
    const {
      memberships,
      loading,
    } = this.state;
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
                display: "flex",
                height: 40,
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="background-theme"
            >
              <div
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className="fa fa-chevron-left"></i> Back
              </div>
            </div>
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -80,
              }}
            >
              <p
                className="text-center customer-group-name"
                style={{ fontWeight: "bold" }}
              >
                Membership
              </p>
            </div>
            <main
              id="main"
              className="site-main"
              style={{
                textAlign: "center",
              }}
            >
              <div style={{ marginTop: 20 }}>
                {loading ? (
                  <>
                    {this.viewShimmer()}
                    {this.viewShimmer()}
                    {this.viewShimmer()}
                  </>
                ) : (
                  memberships.map((item, idx) => (
                    <CardMembership
                      key={idx}
                      index={idx}
                      item={item}
                      detailMembership={this.detailMembership}
                    />
                  ))
                )}
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
    campaignPoint: state.campaign.data,
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ListMembership);
