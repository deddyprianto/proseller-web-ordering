import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import config from '../../config';
import CheckBox from './checkBoxCostume';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Swal = require('sweetalert2');

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataCustomer: {},
      size: { width: 0, height: 0 },
      isMobileSize: false,
    };
  }

  componentDidMount = async () => {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);

    let dataCustomer = await this.props.dispatch(
      CustomerAction.getCustomerProfile()
    );
    if (dataCustomer.ResultCode === 200)
      this.setState({ dataCustomer: dataCustomer.Data[0] });
    this.setState({ loadingShow: false });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    const { innerWidth, innerHeight } = window;
    this.setState({ size: { width: innerWidth, height: innerHeight } });
    this.checkMobileSize(innerWidth);
  };

  checkMobileSize = (width) => {
    if (width < 640) {
      this.setState({ isMobileSize: true });
    } else {
      this.setState({ isMobileSize: false });
    }
  };

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

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    dataCustomer[field] = value;
    this.setState({ dataCustomer });
  };

  handleSave = async () => {
    this.setState({ isLoading: true });
    let payload = {
      username: this.state.dataCustomer.username,
      emailNotification: this.state.dataCustomer.emailNotification,
      smsNotification: this.state.dataCustomer.smsNotification,
      enableEReceiptNotification:
        this.state.dataCustomer.enableEReceiptNotification,
    };

    let response = await this.props.dispatch(
      CustomerAction.updateCustomerProfile(payload)
    );

    if (response.ResultCode === 200) {
      Swal.fire({
        icon: 'success',
        timer: 1500,
        title: response.message,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: 'error',
        timer: 1500,
        title: response.message,
        showConfirmButton: false,
      });
    }
    this.setState({ isLoading: false });
  };

  render() {
    let { loadingShow, dataCustomer, isLoading, isMobileSize } = this.state;
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 120 : isMobileSize ? 65 : 75,
        }}
      >
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                display: "flex",
                height: 40,
                alignItems: "center",
              }}
              className="background-theme"
            >
              <div
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className="fa fa-chevron-left"></i> Back
              </div>
            </div>
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center", marginBottom: "0px" }}
            >
              {loadingShow ? (
                <Row style={{ paddingTop: 55 }}>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                </Row>
              ) : (
                <Row style={{ paddingTop: 55 }}>
                  <Col sm={6}>
                    <div
                      style={{
                        boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 5,
                        marginBottom: 10,
                        cursor: "pointer",
                      }}
                    >
                      <strong>Notification</strong>

                      <div style={{ marginLeft: 10, marginRight: 10 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <div style={{ fontSize: 14 }}>Email Notification</div>
                          <CheckBox
                            handleChange={(status) =>
                              this.handleChange("emailNotification", status)
                            }
                            selected={
                              dataCustomer.emailNotification ? true : false
                            }
                            setRadius={5}
                            setHeight={20}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <div style={{ fontSize: 14 }}>Receive E-Receipt</div>
                          <CheckBox
                            handleChange={(status) =>
                              this.handleChange(
                                "enableEReceiptNotification",
                                status
                              )
                            }
                            selected={
                              dataCustomer.enableEReceiptNotification
                                ? true
                                : false
                            }
                            setRadius={5}
                            setHeight={20}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <div style={{ fontSize: 14 }}>SMS Notification</div>
                          <CheckBox
                            handleChange={(status) =>
                              this.handleChange("smsNotification", status)
                            }
                            selected={
                              dataCustomer.smsNotification ? true : false
                            }
                            setRadius={5}
                            setHeight={20}
                          />
                        </div>
                      </div>

                      <Button
                        className="profile-dashboard"
                        style={{
                          width: "100%",
                          paddingLeft: 5,
                          paddingRight: 5,
                          borderRadius: 5,
                          height: 40,
                          marginTop: 10,
                          fontWeight: "bold",
                        }}
                        onClick={() => this.handleSave()}
                      >
                        <i className="fa fa-floppy-o" aria-hidden="true" /> Save
                        Setting
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </main>
          </div>
        </div>
        {isLoading ? Swal.showLoading() : Swal.close()}
        <div
          onClick={() => {
            this.props.history.push("/changepin");
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
            gridAutoColumns: "1fr",
            gap: "0px 0px",
            gridAutoFlow: "row",
            gridTemplateAreas: '". ."',
            width: "100%",
            alignItems: "center",
            borderRadius: "8px",
            boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "var(--Text-color-Primary, #2F2F2F)",
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            Change PIN
          </div>
          <ArrowForwardIosIcon
            sx={{
              fontWeight: 700,
              justifySelf: "end",
            }}
          />
        </div>
        <div
          style={{
            marginTop: "16px",
            marginBottom: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
            gridAutoColumns: "1fr",
            gap: "0px 0px",
            gridAutoFlow: "row",
            gridTemplateAreas: '". ."',
            width: "100%",
            alignItems: "center",
            borderRadius: "8px",
            boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "var(--Text-color-Primary, #2F2F2F)",
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            Change Password
          </div>
          <ArrowForwardIosIcon
            sx={{
              fontWeight: 700,
              justifySelf: "end",
            }}
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
