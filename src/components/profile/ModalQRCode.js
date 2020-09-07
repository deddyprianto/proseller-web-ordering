import React, { Component } from 'react';
const QRCode = require("qrcode.react");

export default class ModalQRCode extends Component {
  render() {
    return (
      <div>
        <div className="modal fade" id="qrcode-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ display: "flex", justifyContent: "center" }}>
            <div className="modal-content" style={{ marginTop: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>{this.props.title || "My QRCode"}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <QRCode
                  value={JSON.stringify({ cartID: this.props.qrcode })}
                  style={{ height: "100%", width: "100%", maxWidth: "290px", maxHeight: "290px" }}
                  size={200}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
