import React, { Component } from 'react';
import MyVoucher from './MyVoucher';
import config from '../../config';
import { PaymentAction } from "../../redux/actions/PaymentAction";
import { connect } from "react-redux";

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class SelectVoucher extends Component {
  handleSelect = async (item) => {
    let selectedVoucher = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`))
    );
    if(!selectedVoucher) selectedVoucher = []
    selectedVoucher.push(item)
    localStorage.setItem(`${config.prefix}_selectedVoucher`, JSON.stringify(encryptor.encrypt(selectedVoucher)));
    await this.props.dispatch(PaymentAction.setData(selectedVoucher, "SELECT_VOUCHER"))
    this.props.history.goBack()
  }

  render() {
    return (
      <div className="col-full" style={{ marginTop: 100, marginBottom: 50 }}>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main id="main" className="site-main" style={{ textAlign: "center", }}>
              <MyVoucher handleSelect={(item) => this.handleSelect(item)} />
            </main>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectVoucher);