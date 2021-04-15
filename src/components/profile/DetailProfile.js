import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import QRCodeLogo from "../../assets/images/icon-qrcode.png";
import profile from "../../assets/images/default-profile.png";
import Shimmer from "react-shimmer-effect";
import { ReferralAction } from "../../redux/actions/ReferralAction";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { MembershiplAction } from "../../redux/actions/MembershipAction";
import { SVCAction } from "../../redux/actions/SVCAction";
import ModalEditProfile from "./ModalEditProfile";
import { Link } from "react-router-dom";
import config from "../../config";
import loadable from "@loadable/component";
import moment from "moment";
import { isEmptyArray } from "../../helpers/CheckEmpty";
// import { max } from "lodash";
const ModalQRCode = loadable(() => import("./ModalQRCode"));

class DetailProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      referall: "0/0",
      isEmenu: window.location.hostname.includes('emenu'),
      dataCustomer: {},
      memberships: [],
      svc: [],
    };
  }

  componentDidMount = async () => {
    let response = await this.props.dispatch(
      ReferralAction.getReferral({ customerId: this.props.account.signAs })
    );

    try {
      let dataCustomer = await this.props.dispatch(
        CustomerAction.getCustomerProfile()
      );
      if (dataCustomer.ResultCode === 200)
        this.setState({ dataCustomer: dataCustomer.Data[0] });
    } catch (e) {}

    try {
      let dataMembership = await this.props.dispatch(
        MembershiplAction.getPaidMembership()
      );
      if (dataMembership && !isEmptyArray(dataMembership.data))
        this.setState({ memberships: dataMembership.data });
    } catch (e) {}

    const svc = await this.props.dispatch(SVCAction.loadSVC());
    if (svc && svc.resultCode === 200) await this.setState({ svc: svc.data });

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

  getMaxRanking = () => {
    try {
      const { memberships } = this.state;
      let largest = 0;
      for (let i = 0; i < memberships.length; i++) {
        if (memberships[i].ranking > largest) {
          largest = memberships[i].ranking;
        }
      }
      return largest;
    } catch (e) {}
  };

  getLabel = () => {
    try {
      const { dataCustomer } = this.state;
      const maxRanking = this.getMaxRanking();
      if (dataCustomer.customerGroupLevel === maxRanking) return "Renew";
      if (dataCustomer.customerGroupLevel === undefined) return "Renew";
      return "Upgrade";
    } catch (e) {
      return "Upgrade";
    }
  };

  viewLeftPage = (loadingShow) => {
    let { account } = this.props;
    let { dataCustomer, memberships } = this.state;
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
                boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
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
                    boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                {account.name}
              </div>
              <div>{account.phoneNumber}</div>
              <div>{account.email}</div>
            </div>

            <div
              className="background-theme"
              style={{
                padding: 10,
                marginTop: -15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                border: "1px solid #CDCDCD",
                boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>
                  Membership
                </div>
                <div
                  className="customer-group-name"
                  style={{
                    fontSize: 27,
                    fontWeight: "bold",
                    paddingBottom: 10,
                  }}
                >
                  {dataCustomer.customerGroupName}
                </div>
                {dataCustomer.expiryCustomerGroup && (
                  <span
                    className="font-color-theme"
                    style={{ fontSize: 14, fontWeight: "bold" }}
                  >
                    ( till{" "}
                    {moment(dataCustomer.expiryCustomerGroup).format(
                      "DD MMMM YYYY"
                    )}{" "}
                    )
                  </span>
                )}
              </div>
              {!isEmptyArray(memberships) && (
                <Link to="/paid-membership">
                  <div
                    className="customer-group-name"
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {this.getLabel()}{" "}
                    <i
                      style={{ fontSize: 11 }}
                      className="fa fa-chevron-right"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              )}
            </div>

            <div
              className="background-theme"
              style={{
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                border: "1px solid #CDCDCD",
                boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Link to="/edit-profile" style={{ width: "50%" }}>
                  <div
                    className="font-color-theme"
                    style={{
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
                    className="font-color-theme"
                    style={{ fontSize: 14, fontWeight: "bold" }}
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
    const lsKeyList = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes(`${config.prefix}_`)) {
        lsKeyList.push(key);
      }
    }
    lsKeyList.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }

  viewRightPage = (loadingShow) => {
    let { referall, isEmenu, svc } = this.state;

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
            {svc.length > 0 && (
              <Link to="/svc">
                <div
                  className="background-theme"
                  style={{
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 10,
                    border: "1px solid #CDCDCD",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>
                      <i className="fa fa-money" aria-hidden="true" /> Store
                      Value Card
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {referall.split("/")[1] !== "0" && (
              <Link to="/referral">
                <div
                  className="background-theme"
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                    border: "1px solid #CDCDCD",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
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

            {isEmenu && (
              <Link to="/rewards">
                <div
                  className="background-theme"
                  style={{
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 10,
                    border: "1px solid #CDCDCD",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      <i className="fa fa-gift" aria-hidden="true" /> Rewards
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <Link to="/payment-method">
              <div
                className="background-theme"
                style={{
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #CDCDCD",
                  boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    <i className="fa fa-credit-card-alt" aria-hidden="true" />{" "}
                    Payment Method
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/delivery-address">
              <div
                className="background-theme"
                style={{
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #CDCDCD",
                  boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    <i className="fa fa-home" aria-hidden="true" /> Delivery
                    Address
                  </div>
                </div>
              </div>
            </Link>

            <div
              onClick={() => this.handleLogout()}
              className="background-theme"
              style={{
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                border: "1px solid #CDCDCD",
                boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>
                  <i className="fa fa-sign-out" aria-hidden="true" /> Logout
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
      <div>
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
