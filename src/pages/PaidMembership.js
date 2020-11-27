import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import Shimmer from "react-shimmer-effect";
import { MembershiplAction } from "../redux/actions/MembershipAction";
import { CustomerAction } from "../redux/actions/CustomerAction";
import { CampaignAction } from "../redux/actions/CampaignAction";
import { Button } from 'reactstrap';
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
    };
  }

  componentDidMount = async () => {
    const response = await this.props.dispatch(MembershiplAction.getPaidMembership())

    try{
      let dataCustomer = await this.props.dispatch( CustomerAction.getCustomerProfile() );
      if (dataCustomer.ResultCode === 200) this.setState({dataCustomer: dataCustomer.Data[0]})
    }catch(e){}

    if (response && response.data) {
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].defaultPrice = response.data[i].paidMembershipPlan[0].price
      }
      this.setState({memberships: response.data, loading: false});
    }

    try{
      let infoCompany = await encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`)));
      this.props.dispatch(
        CampaignAction.getCampaignPoints({ history: "false" }, infoCompany && infoCompany.companyId)
      );
    }catch(e){}

  };

  componentDidUpdate(prevProps) {}

  setPlan = (idx, idxPlan) => {
    let { memberships } = this.state;

    for (let i = 0; i < memberships.length; i++) {
      for (let j = 0; j < memberships[i].paidMembershipPlan.length; j++) {
        memberships[i].paidMembershipPlan[j].isSelected = false
      }
    }

    memberships[idx].defaultPrice = memberships[idx].paidMembershipPlan[idxPlan].price
    memberships[idx].paidMembershipPlan[idxPlan].isSelected = true
    this.setState({
      memberships, 
      selectedMembership: memberships[idx]
    });
  }

  setMembership = async (selectedMembership) => {
    const find = selectedMembership.paidMembershipPlan.find(item => item.isSelected === true);
    if (find === undefined) selectedMembership.paidMembershipPlan[0].isSelected = true
    this.setState({
      selectedMembership,
    });
  }

  detailMembership = () => {
    const { selectedMembership } = this.state;
    const find = selectedMembership.paidMembershipPlan.find(item => item.isSelected);
    if (find !== undefined) return `$${find.price} / ${find.period} ${find.periodUnit.toLowerCase()}`
  }

  upgradeMembership = () => {
    const { selectedMembership } = this.state
    const plan = selectedMembership.paidMembershipPlan.find(item => item.isSelected)
    
    const payload = {
      membership: this.state.selectedMembership,
      plan: plan,
      detailPoint: this.props.campaignPoint,
      pointsToRebateRatio: this.props.campaignPoint.pointsToRebateRatio,
      pendingPoints: this.props.campaignPoint.pendingPoints || 0,
      dataBasket: {
        totalNettAmount: plan.price,
        outlet: {
          name: `Membership ${selectedMembership.name} ${plan.period} ${plan.periodUnit.toLowerCase()}`
        },
      },
      outlet: {
        name: `Membership ${selectedMembership.name} ${plan.period} ${plan.periodUnit.toLowerCase()}`,
        enablePayAtPOS: false
      },
      storeDetail: {
        name: `Membership ${selectedMembership.name} ${plan.period} ${plan.periodUnit.toLowerCase()}`,
        enablePayAtPOS: false,
        enableRedeemPoint: true,
        paidMembership: true
      },
      paidMembership: true
    }
    
    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(encryptor.encrypt(payload))
    );
    this.props.history.push("/payment");
  }

  getTextInfo = () => {
    try{
      const { dataCustomer, selectedMembership } = this.state;
      if (dataCustomer.customerGroupLevel === selectedMembership.ranking) {
        return 'Renew'
      } else if (dataCustomer.customerGroupLevel > selectedMembership.ranking) {
        return 'Downgrade to'
      }
      return 'Upgrade to'
    }catch(e) { return 'Upgrade to'}
  }

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
    const { memberships, selectedMembership, loading } = this.state;
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
              <p className="text-center customer-group-name" style={{fontWeight: 'bold'}}>Upgrade Membership</p>
            </div>
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center", paddingBottom: selectedMembership !== null ? 200 : 20 }}
            >
              <div style={{ marginTop: 20 }}>
                {
                  loading ?
                  <>
                    {this.viewShimmer()}
                    {this.viewShimmer()}
                    {this.viewShimmer()}
                  </>
                  :
                  <div>
                    {
                      memberships.map((item, idx) => 
                      <CardMembership 
                        key={idx} 
                        index={idx} 
                        item={item} 
                        selectedMembership={selectedMembership} 
                        setPlan={this.setPlan}
                        setMembership={this.setMembership}
                      />
                    )
                    }
                    {
                      memberships.map((item, idx) => 
                      <CardMembership 
                        key={idx} 
                        index={idx} 
                        item={item} 
                        selectedMembership={selectedMembership} 
                        setPlan={this.setPlan}
                        setMembership={this.setMembership}
                      />
                    )
                    }
                  </div>
                }
              </div>
            </main>
            {
              selectedMembership !== null &&
              <div style={{
                width: '100%', 
                position: 'fixed', 
                zIndex: 30,
                bottom: 50, 
                padding: 15,
                backgroundColor: 'white',
                justifyContent: 'center',
                boxShadow: "1px 5px 25px rgba(128, 128, 128, 0.5)",
              }}>
                <div style={{ marginBottom: 3 }}>
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
                      className="customer-gr"
                    >
                      Tax Amount
                    </p>
                    <p
                      style={{ fontWeight: "bold" }}
                      className="font-color-theme"
                    >
                      SGD akjsa
                    </p>
                  </div>
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
                      SGD 1212
                    </p>
                  </div>
                  <hr />
                </div>
                <Button 
                  onClick={this.upgradeMembership}
                  className="btn btn-footer" 
                  style={{
                    width: '90%', 
                    height: 50,
                    marginRight: '5%', 
                    marginLeft: '5%'
                  }}>
                  <b className="text-btn-theme">{this.getTextInfo()} {selectedMembership.name} {this.detailMembership()}</b>
                </Button>
              </div>
            }
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PaidMembership);
