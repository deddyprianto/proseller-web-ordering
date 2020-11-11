import React, { Component } from 'react';
import { connect } from "react-redux";
const QRCode = require("qrcode.react");

class ModalQRCode extends Component {
  render() {
    // let  {color} = this.props
    return (
      <div style={{backgroundColor: "#FFF"}}>
        <div className="modal fade" id="qrcode-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ display: "flex", justifyContent: "center" }}>
            <div className="modal-content" style={{ marginTop: 100, backgroundColor: "#FFF" }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20, color: "#000000" }}>{this.props.title || "My QRCode"}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30, color: "#000000" }}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <QRCode
                  value={JSON.stringify({ [this.props.field || "token"]: this.props.qrcode })}
                  style={{ height: "100%", width: "100%", maxWidth: "290px", maxHeight: "290px" }}
                  size={200}
                  // bgColor={color.background}
                  // fgColor={color.primary}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(ModalQRCode);