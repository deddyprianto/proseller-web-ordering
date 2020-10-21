import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import QRCodeLogo from "../../assets/images/icon-qrcode.png";
import profile from "../../assets/images/default-profile.png";
import Shimmer from "react-shimmer-effect";
import { ReferralAction } from "../../redux/actions/ReferralAction";
import ModalEditProfile from "./ModalEditProfile";
import { Link } from "react-router-dom";
import config from "../../config";
import loadable from "@loadable/component";
const ModalQRCode = loadable(() => import("./ModalQRCode"));

class DetailProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      referall: "0/0",
    };
  }

  componentDidMount = async () => {
    let response = await this.props.dispatch(
      ReferralAction.getReferral({ customerId: this.props.account.signAs })
    );
    if (response.ResultCode === 200)
      this.setState({
        referall: `${response.Data.amount}/${response.Data.capacity}`,
      });
    localStorage.removeItem(`${config.prefix}_getDeliveryAddress`);
    // this.state.loadingShow = false
    this.setState({ loadingShow: false });
  };

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: "100%",
            height: isHeight,
            alignSelf: "center",
            borderRadius: "8px",
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  viewLeftPage = (loadingShow) => {
    let { account } = this.props;
    if (account.defaultImageURL === undefined)
      account.defaultImageURL = profile;

    return (
      <div style={{ marginBottom: 10 }}>
        {loadingShow && (
          <div>
            {this.viewShimmer()}
            {this.viewShimmer(50)}
            {this.viewShimmer(50)}
          </div>
        )}
        {!loadingShow && (
          <div>
            <div
              className="profile-dashboard"
              style={{
                paddingTop: 20,
                paddingBottom: 30,
                textAlign: "center",
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                data-toggle="modal"
                data-target="#qrcode-modal"
                style={{
                  position: "absolute",
                  left: 15,
                  top: 19,
                  backgroundColor: "#FFF",
                  padding: 5,
                  borderBottomRightRadius: 5,
                  cursor: "pointer",
                  borderTopRightRadius: 5,
                }}
              >
                <img
                  src={QRCodeLogo}
                  alt="qrcode"
                  style={{ height: 40, width: 40 }}
                />
              </div>
              <div style={{ width: 100 }}>
                <img
                  src={account.defaultImageURL}
                  alt="Profile"
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 5,
                    boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                {account.name}
              </div>
              <div style={{ color: "#FFF" }}>{account.phoneNumber}</div>
              <div style={{ color: "#FFF" }}>{account.email}</div>
            </div>

            <div
              style={{
                backgroundColor: "#FFF",
                padding: 10,
                marginTop: -15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                border: "1px solid #CDCDCD",
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}
                >
                  Customer Group
                </div>
                <div
                  className="customer-group-name"
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    paddingBottom: 10,
                  }}
                >
                  {account.customerGroupName}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFF",
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                border: "1px solid #CDCDCD",
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Link to="/edit-profile" style={{ width: "50%" }}>
                <div
                  style={{
                    color: "gray",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <i className="fa fa-user" aria-hidden="true" /> Edit Profile
                </div>
                </Link>
                |
                <Link to="/setting" style={{ width: "50%" }}>
                  <div
                    style={{ color: "gray", fontSize: 14, fontWeight: "bold" }}
                  >
                    <i className="fa fa-cog" aria-hidden="true" /> Setting
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  viewRightPage = (loadingShow) => {
    let { referall } = this.state;

    return (
      <div>
        {loadingShow && (
          <div>
            {this.viewShimmer(50)}
            {this.viewShimmer(50)}
            {this.viewShimmer(50)}
          </div>
        )}
        {!loadingShow && (
          <div>
            {referall.split("/")[1] !== "0" && (
              <Link to="/referral">
                <div
                  style={{
                    backgroundColor: "#FFF",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #CDCDCD",
                    boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        color: "gray",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {`Referral ( ${referall} )`}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <Link to="/payment-method">
              <div
                style={{
                  backgroundColor: "#FFF",
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #CDCDCD",
                  boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ color: "gray", fontSize: 14, fontWeight: "bold" }}
                  >
                    <i className="fa fa-credit-card-alt" aria-hidden="true" /> Payment Method
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/delivery-address">
              <div
                style={{
                  backgroundColor: "#FFF",
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #CDCDCD",
                  boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ color: "gray", fontSize: 14, fontWeight: "bold" }}
                  >
                    <i className="fa fa-home" aria-hidden="true" /> Delivery Address
                  </div>
                </div>
              </div>
            </Link>

            <div
              className="profile-dashboard"
              onClick={() => this.handleLogout()}
              style={{
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                border: "1px solid #CDCDCD",
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    let { loadingShow } = this.state;
    let { qrcode } = this.props;
    return (
      <div style={{ paddingTop: 20 }}>
        <ModalQRCode qrcode={qrcode} />
        <ModalEditProfile />
        <Row>
          <Col sm={6}>{this.viewLeftPage(loadingShow)}</Col>
          <Col sm={6}>{this.viewRightPage(loadingShow)}</Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    qrcode: state.auth.account.accessToken.qrcode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailProfile);
