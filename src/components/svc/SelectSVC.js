import React, { Component } from "react";
import { Button } from "reactstrap";
import CreditCard from "@material-ui/icons/CreditCard";
import UseSVC from "../svc/useSVC";
import { connect } from "react-redux";

class SelectSVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadySet: false
    };
  }
  
  setDefaultValueSVC = () => {
    // set default SVC
    try{
      if (this.state.alreadySet === false) {
        const props = this.props.data;
        if (props.dataSettle.dataBasket.totalNettAmount >= this.props.balance) {
          this.props.setAmountSVC(this.props.balance)
        } else {
          this.props.setAmountSVC(props.dataSettle.dataBasket.totalNettAmount)
        }
        this.setState({alreadySet: true})
      }
    }catch(e){}
  }

  render() {
    let props = this.props.data;
    let colorText = this.props.color.primary
    let nameCreditCard = "Use Store Value Card";

    if (props.amountSVC > 0) {
      nameCreditCard = `${this.props.getCurrency(props.amountSVC)} ( Store Value Card )`
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: "1px solid #DCDCDC",
          padding: 10,
          borderRadius: 5,
          width: "100%",
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <UseSVC
          data={props}
          setAmountSVC={this.props.setAmountSVC}
          cancelAmountSVC={this.props.cancelAmountSVC}
          getDataBasket={this.props.getDataBasket}
          getCurrency={(price) => this.props.getCurrency(price)}
          balance={this.props.balance}
          history={this.props.history}
        />
        <Button
          data-toggle="modal"
          data-target="#use-svc-modal"
          className="background-theme"
          onClick={this.setDefaultValueSVC}
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            color: colorText,
            width: "100%",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: 13,
            height: 40,
            border: `1px solid ${colorText}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <CreditCard style={{ fontSize: 16, marginRight: 10 }} />
            {nameCreditCard}
          </div>
          <i className="fa fa-chevron-right" aria-hidden="true" />
        </Button>
        {props.amountSVC > 0 && (
          <i
            className="fa fa-times"
            aria-hidden="true"
            style={{
              color: this.props.color.primary || "#c00a27",
              paddingLeft: 10,
              cursor: "pointer",
            }}
            onClick={() => this.props.cancelAmountSVC()}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
    balance: state.svc.summary,
    history: state.svc.history,
  };
};

export default connect(mapStateToProps, {})(SelectSVC);
