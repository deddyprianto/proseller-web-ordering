import React, { Component } from 'react';
import MyVoucher from './MyVoucher';
import config from '../../config';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

export default class SelectVoucher extends Component {
  handleSelect = (item) => {
    localStorage.setItem(`${config.prefix}_selectedVoucher`, JSON.stringify(encryptor.encrypt(item)));
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
