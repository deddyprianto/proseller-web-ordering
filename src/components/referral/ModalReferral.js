import React, { Component } from 'react';
import {
  Button,
  Input,
} from 'reactstrap';
import PhoneInput from 'react-phone-input-2';

export default class ModalReferral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  render() {
    let {
      setModeInvite, modeInvitation, sendInvitation,
      changeAddress, address, changeMobileNo, mobileNo
    } = this.props
    return (
      <div>
        <div className="modal fade" id="referral-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Send New Invitation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <label>Invitation Mode <span className="required">*</span></label>
                  <Input
                    onChange={(e) => setModeInvite(e)}
                    type="select"
                    style={{ height: 40 }}
                    value={modeInvitation}
                  >
                    <option value={'mobileno'}>Mobile No</option>
                    <option value={'email'}>Email</option>
                  </Input>
                </div>
                <div style={{ marginTop: 10 }}>
                  <label>{modeInvitation === "mobileno" ? "Mobile No " : "Email "}<span className="required">*</span></label>
                  {
                    modeInvitation === 'email' ?
                      <Input
                        type="text" id="outlet"
                        onChange={(e) => changeAddress(e)}
                        value={address}
                        style={{ marginTop: -5, height: 40, borderRadius: 5 }}
                        placeholder={'Enter Email Address'}
                      />
                      :
                      <PhoneInput
                        country={'sg'}
                        value={mobileNo.trim()}
                        style={{ height: 40 }}
                        enableSearch={true}
                        autoFormat={false}
                        onChange={phoneNumber => changeMobileNo(phoneNumber)}
                        inputStyle={{ width: "100%", height: 40 }}
                      />
                  }
                </div>
                <Button className="button" data-toggle="modal" data-target="#referral-modal"
                  style={{ width: "100%", marginTop: 10, borderRadius: 5 }} onClick={() => sendInvitation()}>
                  Send Invititation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
