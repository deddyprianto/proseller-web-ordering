import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import config from "../config";
import { MembershiplAction } from "../redux/actions/MembershipAction";
import { Button } from 'reactstrap';
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const CardMembership = loadable(() =>
  import("../components/membership/CardMembership")
);

class PaidMembership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      selectedMembership: null
    };
  }

  componentDidMount = async () => {
    const response = await this.props.dispatch(MembershiplAction.getPaidMembership())
    if (response && response.data) {
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].defaultPrice = response.data[i].paidMembershipPlan[0].price
      }
      this.setState({memberships: response.data});
    }
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
      dataBasket: {
        totalNettAmount: plan.price,
        outlet: {
          name: `Membership ${selectedMembership.name} ${plan.period} ${plan.periodUnit.toLowerCase()}`
        },
      },
      outlet: {
        name: `Membership ${selectedMembership.name} ${plan.period} ${plan.periodUnit.toLowerCase()}`
      },
      paidMembership: true
    }
    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(encryptor.encrypt(payload))
    );
    this.props.history.push("/payment");
  }

  render() {
    const { memberships, selectedMembership } = this.state;
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
              style={{ textAlign: "center" }}
            >
              <div style={{ marginTop: 20 }}>
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
            </main>
            {
              selectedMembership !== null &&
              <div style={{
                width: '100%', 
                position: 'fixed', 
                zIndex: 30,
                bottom: 50, 
                padding: 20,
                backgroundColor: 'white',
                justifyContent: 'center'
              }}>
                <Button 
                  onClick={this.upgradeMembership}
                  className="btn btn-footer" 
                  style={{
                    width: '90%', 
                    height: 50,
                    marginRight: '5%', 
                    marginLeft: '5%'
                  }}>
                  <b className="text-btn-theme">Upgrade {selectedMembership.name} {this.detailMembership()}</b>
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PaidMembership);
