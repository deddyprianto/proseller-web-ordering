import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Col,
  Row,
  Button
} from 'reactstrap';
import Shimmer from "react-shimmer-effect";
import { CustomerAction } from '../../redux/actions/CustomerAction';
import Loading from "../loading";

const Swal = require('sweetalert2')

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataCustomer: {},
    };
  }

  componentDidMount = async () => {
    let dataCustomer = await this.props.dispatch(CustomerAction.getCustomerProfile());
    if (dataCustomer.ResultCode === 200) this.setState({ dataCustomer: dataCustomer.Data[0] })
    this.setState({ loadingShow: false })
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div style={{
          width: "100%", height: isHeight, alignSelf: "center",
          borderRadius: "8px", marginBottom: 10
        }} />
      </Shimmer>
    )
  }

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    dataCustomer[field] = value;
    this.setState({ dataCustomer })
  }

  handleSave = async () => {
    this.setState({ isLoading: true })
    let payload = {
      username: this.state.dataCustomer.username,
      emailNotification: this.state.dataCustomer.emailNotification,
      smsNotification: this.state.dataCustomer.smsNotification,
    }
    // console.log(payload)
    let response = await this.props.dispatch(CustomerAction.updateCustomerProfile(payload));
    // console.log(response)
    if (response.ResultCode === 200) {
      Swal.fire({
        icon: 'success', timer: 1500,
        title: response.message, showConfirmButton: false,
      })
    } else {
      Swal.fire({
        icon: 'error', timer: 1500,
        title: response.message, showConfirmButton: false,
      })
    }
    this.setState({ isLoading: false })
  }

  render() {
    let { loadingShow, dataCustomer, isLoading } = this.state
    return (
      <div className="col-full" style={{ marginTop: 120 }}>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div style={{
              flexDirection: "row", position: "fixed", zIndex: 10, width: "100%", marginTop: -60,
              backgroundColor: "#FFF", boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", display: "flex",
              height: 40
            }}>
              <button type="button" className="close" style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}>
                <i className="fa fa-chevron-left"></i> Back
              </button>
            </div>
            <main id="main" className="site-main" style={{ textAlign: "center" }}>
              {
                loadingShow ?
                  <Row>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                  </Row> :
                  <Row>
                    <Col sm={6}>
                      <div style={{
                        boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                        padding: 10, alignItems: "center", borderRadius: 5,
                        marginBottom: 10, cursor: "pointer", backgroundColor: "#FFF"
                      }}>
                        <strong>Notification</strong>

                        <div style={{ marginLeft: 10, marginRight: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <div style={{ fontSize: 14 }}>Use Email Notification</div>
                            <input type="checkbox" checked={dataCustomer.emailNotification ? true : false}
                              onClick={() => this.handleChange('emailNotification', dataCustomer.emailNotification ? false : true)} />
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <div style={{ fontSize: 14 }}>Use SMS Notification</div>
                            <input type="checkbox" checked={dataCustomer.smsNotification ? true : false}
                              onClick={() => this.handleChange('smsNotification', dataCustomer.smsNotification ? false : true)} />
                          </div>
                        </div>

                        <Button className="profile-dashboard" style={{
                          width: "100%", paddingLeft: 5, paddingRight: 5, borderRadius: 5, height: 40, marginTop: 10
                        }} onClick={() => this.handleSave()}>Save</Button>
                      </div>
                    </Col>
                  </Row>
              }
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

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
