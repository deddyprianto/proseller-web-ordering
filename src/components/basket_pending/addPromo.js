import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Voucher from '../../assets/images/icon-voucher.png';
import Point from '../../assets/images/icon-point.png';
import RedeemPointBasket from './redeemPointBasket';

export default class AddPromo extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ padding: 10, marginTop: -10 }}>
        <RedeemPointBasket
          data={props}
          handleRedeemPoint={() => this.props.handleRedeemPoint()}
          cancelSelectPoint={() => this.props.cancelSelectPoint()}
          getCurrency={(price) => this.props.getCurrency(price)}
          scrollPoint={(data) => this.props.scrollPoint(data)}
          setPoint={(point) => this.props.setPoint(point)}
        />
        {
          (props.myVoucher && props.myVoucher.length > 0 ||
            props.totalPoint > 0 && props.storeDetail.enableRedeemPoint === true) &&
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>Add Promo</div>
        }
        <div style={{ marginLeft: 5 }}>
          {
            props.myVoucher && props.myVoucher.length > 0 &&
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ color: "gray", fontSize: 13, marginTop: 2 }}>Redeem Voucher</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {
                  props.selectedVoucher &&
                  <Button disabled={this.props.roleBtnClear}
                    onClick={() => this.props.cancelSelectVoucher()} style={{
                      height: 25, width: 25, backgroundColor: "#FFF", borderRadius: 25,
                      border: "1px solid #c00a27", marginRight: 5, display: "flex",
                      justifyContent: "center", alignItems: "center"
                    }}>
                    <i className="fa fa-times" style={{ color: "#c00a27" }} />
                  </Button>
                }
                <Button disabled={this.props.roleBtnClear}
                  onClick={() => this.props.handleRedeemVoucher()}
                  style={{
                    fontWeight: "bold", color: "#FFF", cursor: "pointer", backgroundColor: "#20a8d8",
                    width: 140, justifyContent: "space-between", display: "flex", flexDirection: "row",
                    alignItems: "center", fontSize: 12,
                  }}>
                  <img src={Voucher} height="12px" width="18px" alt="voucher" />
                  {`${props.selectedVoucher ? props.selectedVoucher.name.substr(0, 16) : 'Select Voucher'}`}
                </Button>
              </div>
            </div>
          }
          {
            props.totalPoint > 0 && props.storeDetail.enableRedeemPoint === true &&
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div style={{ color: "gray", fontSize: 13, marginTop: 2 }}>Redeem Point</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {
                  props.selectedPoint > 0 &&
                  <Button disabled={this.props.roleBtnClear}
                    onClick={() => this.props.cancelSelectPoint()} style={{
                      height: 25, width: 25, backgroundColor: "#FFF", borderRadius: 25,
                      border: "1px solid #c00a27", marginRight: 5, display: "flex",
                      justifyContent: "center", alignItems: "center"
                    }}>
                    <i className="fa fa-times" style={{ color: "#c00a27" }} />
                  </Button>
                }
                <Button disabled={this.props.roleBtnClear}
                  data-toggle="modal" data-target="#redeem-point-modal"
                  onClick={() => this.props.handleRedeemPoint()}
                  style={{
                    fontWeight: "bold", color: "#FFF", cursor: "pointer", backgroundColor: "#20a8d8",
                    width: 140, justifyContent: "space-between", display: "flex", flexDirection: "row",
                    alignItems: "center", fontSize: 12,
                  }}>
                  <img src={Point} height="15px" width="15px" alt="point" />
                  {`${props.selectedPoint > 0 ? `- ${props.selectedPoint} point` : 'Pick Point'}`}
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
