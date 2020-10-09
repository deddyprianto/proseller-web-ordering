import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import config from '../../config';

const base64 = require('base-64');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

export default class ScanTable extends Component {
  handleScan = data => {
    if (data) {
      try {
        let param = this.getUrlParameters(data.split("?")[1])
        if (param && param['input']) {
          param = this.getUrlParameters(base64.decode(decodeURI(param['input'])))
          let scanTable = {
            ...param,
            tableNo: param.tableNo || param.table,
            scan: true,
            outlet: param.outletId || param.outlet
          }
          // console.log(scanTable)
          localStorage.setItem(`${config.prefix}_scanTable`, JSON.stringify(encryptor.encrypt(scanTable)));
          this.props.history.goBack();
        } else {
          localStorage.removeItem(`${config.prefix}_scanTable`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  getUrlParameters = (pageParamString = null) => {
    if (pageParamString) {
      var paramsArray = pageParamString.split('&');
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split('=');
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  }

  render() {
    return (
      <div className="col-full" style={{ marginTop: 100, marginBottom: 50 }}>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main id="main" className="site-main" style={{ textAlign: "center" }}>
              <QrReader
                delay={200}
                onError={(err) => console.error(err)}
                onScan={this.handleScan}
                style={{ width: '100%' }}
                facingMode={"environment"}
              />
            </main>
          </div>
        </div>
      </div>
    );
  }
}
