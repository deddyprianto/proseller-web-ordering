import React, { Component } from 'react';
import { Button } from 'reactstrap';
import loadable from '@loadable/component';

const MyVoucher = loadable(() => import('../components/voucher/MyVoucher'))
const RedeemVoucher = loadable(() => import('../components/voucher/RedeemVoucher'))

export default class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true
    }
  }
  render() {
    let isMyVoucher = this.state.isMyVoucher
    return (
      <div className="col-full" style={{ marginTop: 140, marginBottom: 50 }}>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div style={{
              flexDirection: "row", position: "fixed", zIndex: 10, width: "100%", marginTop: -100,
              backgroundColor: "#FFF", display: "flex", height: 40
            }}>
              <button type="button" className="close" style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}>
                <i className="fa fa-chevron-left"></i> Back
              </button>
            </div>
            <div style={{ flexDirection: "row", position: "fixed", zIndex: 10, width: "100%", marginTop: -60 }}>
              <Button className={isMyVoucher ? "use-select" : "un-select"}
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
                onClick={() => this.setState({ isMyVoucher: true })}>My Vouchers</Button>
              <Button className={!isMyVoucher ? "use-select" : "un-select"}
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
                onClick={() => this.setState({ isMyVoucher: false })}>Redeem Vouchers</Button>
            </div>
            <main id="main" className="site-main" style={{ textAlign: "center", }}>
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
