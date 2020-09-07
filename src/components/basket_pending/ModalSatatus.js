import React, { Component } from 'react';
import Lottie from 'lottie-react-web';
import successgif from '../../assets/gif/success.json';
import failedgif from '../../assets/gif/payment-failed.json';

export default class ModalStatus extends Component {
  render() {
    let paymentStatus = this.props.paymentStatus
    return (
      <div className="modal fade" id="status-ordering-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-product modal-dialog-centered modal-full" role="document" style={{ justifyContent: 'center' }}>
          <div className="modal-content" style={{ width: 300, height: 300, marginTop: 100, marginBottom: 100, }}>
            <div className="modal-body">
              <Lottie
                options={{
                  animationData: paymentStatus ? successgif : failedgif,
                  loop: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
