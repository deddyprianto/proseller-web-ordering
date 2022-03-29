import React, { Component } from 'react';
import { Col, Row, Button, Table } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { ReferralAction } from '../../redux/actions/ReferralAction';
import { connect } from 'react-redux';
import SendIcon from '@material-ui/icons/Send';
import ModalReferral from './ModalReferral';
import DeleteIcon from '@material-ui/icons/Delete';

const Swal = require('sweetalert2');

class Referral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      referral: null,
      modeInvitation: 'mobileno',
      address: '',
      mobileNo: '',
    };
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: isHeight,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidMount = async () => {
    this.getDataReferral();
  };

  getDataReferral = async () => {
    let response = await this.props.dispatch(
      ReferralAction.getReferral({ customerId: this.props.account.signAs })
    );
    if (response.ResultCode === 200) this.setState({ referral: response.Data });

    // this.state.loadingShow = false
    this.setState({ loadingShow: false });
  };

  getStatusReferral = (item) => {
    if (item.signUpStatus === 'PENDING' && item.purchaseStatus === 'PENDING') {
      return 'Pending';
    }
    if (item.signUpStatus === 'DONE' && item.purchaseStatus === 'PENDING') {
      return 'Customer Register';
    }
    if (item.signUpStatus === 'DONE' && item.purchaseStatus === 'DONE') {
      return 'Customer Purchased';
    }
  };

  sendInvitation = async () => {
    const { modeInvitation, address, mobileNo } = this.state;
    let payload = {};
    const domainName = window.location.host;
    this.setState({ isLoading: true });
    if (modeInvitation === 'email') {
      payload = { email: address };
    } else {
      payload = { mobileNo: `+${mobileNo}`, domain: domainName };
    }

    let response = await this.props.dispatch(
      ReferralAction.createReferral(payload)
    );

    if (response.Data.status) {
      this.setState({ isLoading: false });
      Swal.fire({
        icon: 'success',
        timer: 1500,
        title: 'Referral Sent!',
        showConfirmButton: false,
      });

      await this.getDataReferral();

      if (payload.mobileNo !== undefined) {
        window.open(response.Data.url);
      }
    } else {
      let message = 'Please try again.';
      if (response.message !== undefined) message = response.message;
      this.setState({ isLoading: false });
      Swal.fire({
        icon: 'error',
        timer: 1500,
        title: message,
        showConfirmButton: false,
      });
    }

    this.setState({ address: '', mobileNo: '' });
  };

  resendReferral = (referral) => {
    Swal.fire({
      title: 'Resend Referral Code',
      text: 'Are you sure want to resend this referral code ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Resend',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.value) {
        this.setState({ isLoading: true });
        try {
          let response = await this.props.dispatch(
            ReferralAction.resendReferral(referral.id)
          );

          if (response.Data.status) {
            this.setState({ isLoading: false });
            Swal.fire({
              icon: 'success',
              timer: 1500,
              title: 'Referral Sent!',
              showConfirmButton: false,
            });

            await this.getDataReferral();

            if (referral.mobileNo !== undefined) {
              window.open(response.Data.url);
            }
          } else {
            let message = 'Please try again.';
            if (response.message !== undefined) message = response.message;
            this.setState({ isLoading: false });
            Swal.fire({
              icon: 'error',
              timer: 1500,
              title: message,
              showConfirmButton: false,
            });
          }
        } catch (err) {
          console.log(err);
          let error = 'Something went wrong, please try again.';
          this.setState({ isLoading: false });
          Swal.fire({
            icon: 'error',
            timer: 1500,
            title: error,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  cancelReferral = (referral) => {
    Swal.fire({
      title: 'Cancel Invitation ?',
      text: 'Are you sure want to cancel this invitation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.value) {
        this.setState({ isLoading: true });
        try {
          let response = await this.props.dispatch(
            ReferralAction.deleteReferral(referral.id)
          );

          if (response.Data.status) {
            this.setState({ isLoading: false });
            Swal.fire({
              icon: 'success',
              timer: 1500,
              title: 'Invitation has been cancelled!',
              showConfirmButton: false,
            });

            await this.getDataReferral();
          } else {
            let message = 'Please try again.';
            if (response.message !== undefined) message = response.message;
            this.setState({ isLoading: false });
            Swal.fire({
              icon: 'error',
              timer: 1500,
              title: message,
              showConfirmButton: false,
            });
          }
        } catch (err) {
          let error = 'Something went wrong, please try again.';
          this.setState({ isLoading: false });
          Swal.fire({
            icon: 'error',
            timer: 1500,
            title: error,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  render() {
    let {
      loadingShow,
      isLoading,
      referral,
      modeInvitation,
      address,
      mobileNo,
    } = this.state;
    return (
      <div className='col-full' style={{ marginTop: 120 }}>
        <ModalReferral
          modeInvitation={modeInvitation}
          address={address}
          mobileNo={mobileNo}
          setModeInvite={(e) =>
            this.setState({ modeInvitation: e.target.value })
          }
          changeAddress={(e) => this.setState({ address: e.target.value })}
          changeMobileNo={(e) => this.setState({ mobileNo: e })}
          sendInvitation={() => this.sendInvitation()}
        />
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            <div
              style={{
                flexDirection: 'row',
                position: 'fixed',
                zIndex: 10,
                width: '100%',
                marginTop: -60,
                boxShadow: '1px 2px 5px rgba(128, 128, 128, 0.5)',
                display: 'flex',
                height: 40,
              }}
              className='background-theme'
            >
              <div
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className='fa fa-chevron-left'></i> Back
              </div>
            </div>
            <main
              id='main'
              className='site-main'
              style={{ textAlign: 'center' }}
            >
              {loadingShow && (
                <Row>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                </Row>
              )}
              {referral && !loadingShow && (
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      className='customer-group-name'
                      style={{ fontWeight: 'bold' }}
                    >
                      {`Referral ( ${referral.amount}/${referral.capacity} )`}
                    </div>
                    <Button
                      className='button'
                      data-toggle='modal'
                      data-target='#referral-modal'
                      style={{
                        width: 170,
                        paddingLeft: 5,
                        paddingRight: 5,
                        borderRadius: 5,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      disabled={
                        referral.amount === referral.capacity ? true : false
                      }
                    >
                      <SendIcon style={{ fontSize: 20, marginRight: 5 }} />
                      Send New Invite
                    </Button>
                  </div>

                  {referral.list.length > 0 && (
                    <Table responsive striped bordered style={{ fontSize: 11 }}>
                      <thead>
                        <tr style={{ textAlign: 'center' }}>
                          <th style={{ verticalAlign: 'middle' }}>No.</th>
                          <th style={{ verticalAlign: 'middle' }}>Contact</th>
                          <th>Status</th>
                          <th style={{ verticalAlign: 'middle' }}>
                            <center>Action</center>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {referral.list.map((item, key) => (
                          <tr key={key}>
                            <td style={{ width: 5 }}> {key + 1} </td>
                            <td>
                              {' '}
                              {item.email !== undefined
                                ? item.email
                                : item.mobileNo}{' '}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {' '}
                              {this.getStatusReferral(item)}{' '}
                            </td>
                            <td style={{ width: 50 }}>
                              <center>
                                {item.signUpStatus === 'PENDING' && (
                                  <div
                                    style={{
                                      marginLeft: -5,
                                      marginRight: -5,
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: 'green',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => this.resendReferral(item)}
                                    >
                                      <SendIcon />
                                    </div>
                                    <div
                                      style={{
                                        marginLeft: 5,
                                        color: '#c00a27',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => this.cancelReferral(item)}
                                    >
                                      <DeleteIcon />
                                    </div>
                                  </div>
                                )}
                              </center>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
        {isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Referral);
