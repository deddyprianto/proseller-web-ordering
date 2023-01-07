import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import Shimmer from "react-shimmer-effect";
import { MembershiplAction } from "../redux/actions/MembershipAction";
import { CustomerAction } from "../redux/actions/CustomerAction";
import { CampaignAction } from "../redux/actions/CampaignAction";
import { OutletAction } from "../redux/actions/OutletAction";
import { Button } from "reactstrap";
import calculateTAX from "../helpers/TaxCalculation";
import Swal from "sweetalert2";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const PricingMembership = loadable(() =>
  import("../components/membership/PricingMembership")
);

class DetailMembership extends Component {

  constructor(props) {
    super(props);

    const selectedMembership = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedMembership`))
    );

    this.state = {
      memberships: [],
      selectedMembership,
      selectedPlan: null,
      dataCustomer: {},
      loading: true,
      detailPurchase: null,
      backupOutlet: {}
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
    try {
      let dataCustomer = await this.props.dispatch(
        CustomerAction.getCustomerProfile()
      );
      if (dataCustomer.ResultCode === 200)
        this.setState({ dataCustomer: dataCustomer.Data[0] });
    } catch (e) {}

    try {
      let backupOutlet = await this.props.dispatch(
        OutletAction.getBackupOutlet()
      );
      if (backupOutlet.resultCode === 200)
        this.setState({ backupOutlet: backupOutlet.data });
    } catch (e) {}

    this.setState({ loading: false });

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
    const { backupOutlet } = this.state;
    const { defaultOutlet } = this.props;
    let outlet = defaultOutlet
    if (outlet === undefined || outlet.id === undefined) {
      outlet = backupOutlet
    }

    let returnData = {
      outlet,
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
    const { selectedPlan } = this.state;
    return ` / ${selectedPlan.period} ${selectedPlan.periodUnit.toLowerCase()}`;
  };

  upgradeMembership = () => {
    const { selectedMembership, detailPurchase } = this.state;
    const plan = this.state.selectedPlan;

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

  redeemMembership = async () => {
    const { selectedMembership, selectedPlan } = this.state;
    const payload = {
      membership: {
        period: selectedPlan.period,
        periodUnit: selectedPlan.periodUnit,
        point: selectedPlan.point,
        id: selectedMembership.id,
      },
      customerId: this.props.account.signAs,
      redeemValue: selectedPlan.point,
    };

    const response = await this.props.dispatch(
      MembershiplAction.redeemPaidMembership(payload)
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      Swal.fire("Oppss!", response.Data.message, "error");
    } else {
      Swal.fire(
        "Congratulations!",
        `Your membership has been upgraded to ${selectedMembership.name}`,
        "success"
      ).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.props.history.push("/profile");
        }
      });
    }
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

  selectPlan = async (selectedPlan) => {
    await this.setState({ selectedPlan });
    await this.findTax(selectedPlan);
  };

  render() {
    const { selectedMembership, detailPurchase, selectedPlan } = this.state;
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
                marginTop: -80,
                display: "flex",
                height: 40,
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="background-theme"
            >
              <div
                style={{ paddingLeft: 10, fontSize: 16 }}
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
                {selectedMembership.name}
              </p>
            </div>
            <div
              style={{
                textAlign: "justify",
                paddingLeft: 20,
                paddingRight: 20,
                lineHeight: 1.7,
                fontSize: 13,
              }}
            >
              {selectedMembership.description}
            </div>

            <main
              id="main"
              className="site-main"
              style={{
                textAlign: "center",
                paddingBottom: selectedMembership !== null ? 200 : 20,
              }}
            >
              <b className="customer-group-name">Pricing :</b>
              <div style={{ marginTop: 20 }}>
                {selectedMembership.paidMembershipPlan &&
                  selectedMembership.paidMembershipPlan.length > 0 &&
                  selectedMembership.paidMembershipPlan.map((item, idx) => (
                    <PricingMembership
                      key={idx}
                      index={idx}
                      item={item}
                      color={this.props.color}
                      selectedPlan={this.state.selectedPlan}
                      selectPlan={this.selectPlan}
                    />
                  ))}
                {selectedMembership.paidMembershipPlanWithPoint &&
                  selectedMembership.paidMembershipPlanWithPoint.length > 0 &&
                  selectedMembership.paidMembershipPlanWithPoint.map(
                    (item, idx) => (
                      <PricingMembership
                        key={idx}
                        index={idx}
                        item={item}
                        color={this.props.color}
                        selectedPlan={this.state.selectedPlan}
                        selectPlan={this.selectPlan}
                      />
                    )
                  )}
              </div>
            </main>
            {detailPurchase !== null && (
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
                      {selectedPlan.price
                        ? this.getCurrency(detailPurchase.totalNettAmount)
                        : `${selectedPlan.point} Points`}
                    </p>
                  </div>
                  <hr />
                </div>
                <Button
                  onClick={selectedPlan.price ? this.upgradeMembership : this.redeemMembership}
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
    color: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailMembership);
