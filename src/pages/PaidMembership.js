import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import Shimmer from "react-shimmer-effect";
import { MembershiplAction } from "../redux/actions/MembershipAction";
import { CustomerAction } from "../redux/actions/CustomerAction";
import { CampaignAction } from "../redux/actions/CampaignAction";
import { Button } from "reactstrap";
import calculateTAX from "../helpers/TaxCalculation";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const CardMembership = loadable(() =>
  import("../components/membership/CardMembership")
);

class PaidMembership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      selectedMembership: null,
      dataCustomer: {},
      loading: true,
      detailPurchase: {},
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

    try {
      let dataCustomer = await this.props.dispatch(
        CustomerAction.getCustomerProfile()
      );
      if (dataCustomer.ResultCode === 200)
        this.setState({ dataCustomer: dataCustomer.Data[0] });
    } catch (e) {}

    if (response && response.data) {
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].defaultPrice =
          response.data[i].paidMembershipPlan[0].price;
      }
      this.setState({ memberships: response.data, loading: false });
    }

    try {
      let infoCompany = await encryptor.decrypt(
        JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
      );
      this.props.dispatch(
        CampaignAction.getCampaignPoints(
          { history: "false" },
          infoCompany && infoCompany.companyId
        )
      );
    } catch (e) {}
  };

  componentDidUpdate(prevProps) {}

  setPlan = async (idx, idxPlan) => {
    let { memberships } = this.state;

    for (let i = 0; i < memberships.length; i++) {
      for (let j = 0; j < memberships[i].paidMembershipPlan.length; j++) {
        memberships[i].paidMembershipPlan[j].isSelected = false;
      }
    }

    memberships[idx].defaultPrice =
      memberships[idx].paidMembershipPlan[idxPlan].price;
    memberships[idx].paidMembershipPlan[idxPlan].isSelected = true;

    await this.findTax(memberships[idx].paidMembershipPlan[idxPlan]);

    await this.setState({
      memberships,
      selectedMembership: memberships[idx],
    });
  };

  findTax = async (dataDetail) => {
    let returnData = {
      outlet: this.props.defaultOutlet,
      details: [],
    };
    let product = {};
    product.unitPrice = dataDetail.price;
    product.quantity = 1;
    product.product = dataDetail;
    returnData.details.push(product);

    const detailPurchase = await calculateTAX(
      returnData.details,
      returnData,
      {}
    );
    await this.setState({ detailPurchase });
  };

  setMembership = async (selectedMembership) => {
    const find = selectedMembership.paidMembershipPlan.find(
      (item) => item.isSelected === true
    );
    if (find === undefined) {
      selectedMembership.paidMembershipPlan[0].isSelected = true;
      await this.findTax(selectedMembership.paidMembershipPlan[0]);
    } else {
      await this.findTax(find);
    }
    await this.setState({
      selectedMembership,
    });
  };

  detailMembership = () => {
    const { selectedMembership, detailPurchase } = this.state;
    const find = selectedMembership.paidMembershipPlan.find(
      (item) => item.isSelected
    );
    if (find !== undefined)
      return `$${detailPurchase.totalNettAmount} / ${
        find.period
      } ${find.periodUnit.toLowerCase()}`;
  };

  upgradeMembership = () => {
    const { selectedMembership, detailPurchase } = this.state;
    const plan = selectedMembership.paidMembershipPlan.find(
      (item) => item.isSelected
    );

    const payload = {
      outletDetail: this.props.defaultOutlet,
      membership: this.state.selectedMembership,
      plan: plan,
      detailPoint: this.props.campaignPoint,
      pointsToRebateRatio: this.props.campaignPoint.pointsToRebateRatio,
      detailPurchase,
      pendingPoints: this.props.campaignPoint.pendingPoints || 0,
      dataBasket: {
        totalNettAmount: detailPurchase.totalNettAmount,
        outlet: {
          name: `Membership ${selectedMembership.name} ${
            plan.period
          } ${plan.periodUnit.toLowerCase()}`,
        },
      },
      outlet: {
        name: `Membership ${selectedMembership.name} ${
          plan.period
        } ${plan.periodUnit.toLowerCase()}`,
        enablePayAtPOS: false,
      },
      storeDetail: {
        name: `Membership ${selectedMembership.name} ${
          plan.period
        } ${plan.periodUnit.toLowerCase()}`,
        enablePayAtPOS: false,
        enableRedeemPoint: true,
        paidMembership: true,
      },
      paidMembership: true,
    };

    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(encryptor.encrypt(payload))
    );
    this.props.history.push("/payment");
  };

  getTextInfo = () => {
    try {
      const { dataCustomer, selectedMembership } = this.state;
      if (dataCustomer.customerGroupLevel === selectedMembership.ranking) {
        return "Renew";
      } else if (dataCustomer.customerGroupLevel > selectedMembership.ranking) {
        return "Downgrade to";
      }
      return "Upgrade to";
    } catch (e) {
      return "Upgrade to";
    }
  };

  viewShimmer = (isHeight = 100) => {
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

  render() {
    const {
      memberships,
      selectedMembership,
      loading,
      detailPurchase,
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
                marginTop: -60,
              }}
            >
              <p
                className="text-center customer-group-name"
                style={{ fontWeight: "bold" }}
              >
                Upgrade Membership
              </p>
            </div>
            <main
              id="main"
              className="site-main"
              style={{
                textAlign: "center",
                paddingBottom: selectedMembership !== null ? 200 : 20,
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
                      selectedMembership={selectedMembership}
                      setPlan={this.setPlan}
                      setMembership={this.setMembership}
                    />
                  ))
                )}
              </div>
            </main>
            {selectedMembership !== null && (
              <div
                style={{
                  width: "100%",
                  position: "fixed",
                  zIndex: 30,
                  bottom: 50,
                  padding: 15,
                  backgroundColor: "white",
                  justifyContent: "center",
                  boxShadow: "1px 5px 25px rgba(128, 128, 128, 0.5)",
                }}
              >
                <div style={{ marginBottom: 3 }}>
                  <hr />
                  {detailPurchase.totalTaxAmount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: -5,
                        marginBottom: -5,
                      }}
                    >
                      <p style={{ fontWeight: "bold" }} className="customer-gr">
                        Tax Amount
                      </p>
                      <p
                        style={{ fontWeight: "bold" }}
                        className="font-color-theme"
                      >
                        {this.getCurrency(detailPurchase.totalTaxAmount)}
                      </p>
                    </div>
                  )}
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: -5,
                      marginBottom: -5,
                    }}
                  >
                    <p
                      style={{ fontWeight: "bold" }}
                      className="font-color-theme"
                    >
                      Total
                    </p>
                    <p
                      style={{ fontWeight: "bold" }}
                      className="font-color-theme"
                    >
                      {this.getCurrency(detailPurchase.totalNettAmount)}
                    </p>
                  </div>
                  <hr />
                </div>
                <Button
                  onClick={this.upgradeMembership}
                  className="btn btn-footer"
                  style={{
                    width: "90%",
                    height: 50,
                    marginRight: "5%",
                    marginLeft: "5%",
                  }}
                >
                  <b className="text-btn-theme">
                    {this.getTextInfo()} {selectedMembership.name}{" "}
                    {this.detailMembership()}
                  </b>
                </Button>
              </div>
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PaidMembership);
