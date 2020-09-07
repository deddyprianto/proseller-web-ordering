import React, { Component } from 'react';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

export default class ModalProviderDelivery extends Component {
  render() {
    let props = this.props.data
    return (
      <div className="modal fade" id="provider-delivery-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-product modal-dialog-centered modal-full" role="document" style={{ justifyContent: 'center' }}>
          <div className="modal-content" style={{ width: "80%", marginTop: 100, marginBottom: 100 }}>
            <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
              <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Provider</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                position: "absolute", right: 10, top: 16
              }}>
                <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
              </button>
            </div>
            <div className="modal-body">
              {
                props.deliveryProvaider.map((item, key) => (
                  <div key={key} className={item.default && "border-theme"} style={{
                    boxShadow: "1px 1px 5px rgba(128, 128, 128, 0.3)", padding: 10,
                    borderRadius: 5, display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 5, border: (!item.default && "1px solid gray")
                  }} data-dismiss="modal" onClick={() => this.props.handleSetProvaider(item)}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <AssignmentIndIcon />
                      <div style={{ marginLeft: 10 }}>
                        <div style={{ fontWeight: "bold", fontSize: 14, color: "gray" }}>{item.name}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: 14, color: "gray" }}>
                      {item.deliveryFee ? item.deliveryFee : "-"}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
