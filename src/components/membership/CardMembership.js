import React, { Component } from "react";

export default class CardMembership extends Component {
  render() {
    let { item, index, selectedMembership } = this.props;
    return (
      <div style={styles.wrap}>
        <div style={selectedMembership !== null && selectedMembership.id === item.id ? styles.couponSelected : styles.coupon}>
          <div style={styles.coupon_left} className="button">
            <p style={styles.name}>{item.name}</p>
            <p style={styles.price}>${item.defaultPrice}</p>
            <select
              className="button"
              name={"card-membership"}
              style={{borderRadius: 2, border: 'none'}}
              onChange={(e) => {
                try{
                  this.props.setPlan(index, e.target.value)
                }catch(e){}
              }}
            >
              {item.paidMembershipPlan.map((option, idx) => {
                return (
                  <option
                    value={idx}
                    key={idx}
                  >
                    per {option.period}{" "} {option.periodUnit.toLowerCase()}
                  </option>
                );
              })}
            </select>
            <p>
              per {item.paidMembershipPlan[0].period}{" "}
              {item.paidMembershipPlan[0].periodUnit.toLowerCase()}
            </p>
          </div>
          <div style={styles.coupon_con} onClick={() => this.props.setMembership(item)}>
            <p style={{ color: "black", fontSize: 13 }}>{item.paidMembershipInformation}</p>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  wrap: {
    width: "100%",
    marginBottom: 20,
  },
  coupon: {
    display: "flex",
    overflow: "hidden",
    borderRadius: "10px",
    border: '0.3px solid black'
  },
  couponSelected: {
    display: "flex",
    overflow: "hidden",
    borderRadius: "10px",
    border: '2px solid red'
  },
  coupon_left: {
    padding: 10,
    float: "left",
    width: "40%",
    maxWidth: "40%",
    height: "150px",
    maxHeight: "150px",
    position: "relative",
    borderRight: '4px dashed white'
  },
  coupon_con: {
    float: "left",
    width: "60%",
    maxWidth: "60%",
    textAlign: "left",
    padding: 10,
    whiteSpace: "pre",
    overflowY: "hidden",
    height: "150px",
    maxHeight: "150px",
    position: "relative",
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "white",
  },
  name: {
    textAlign: "center",
    fontSize: 23,
    backgroundColor: "white",
    borderRadius: 10,
    fontWeight: "bold",
    opacity: 0.8,
    color: 'black'
  },
  price: {
    textAlign: "center",
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
};
