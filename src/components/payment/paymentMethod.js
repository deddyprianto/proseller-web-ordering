import React, { Component } from "react";
import { Col, Row, Button } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import Iframe from "react-iframe";

import config from "../../config";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { PaymentAction } from "../../redux/actions/PaymentAction";
import { connect } from "react-redux";
import CreditCard from "@material-ui/icons/CreditCard";
import ModalPaymentMethod from "./ModalPaymentMethod";
import ModalPaymentPermission from "./ModalRegisterPermission";
import _ from "lodash";
import { uuid } from "uuidv4";
import styles from "./styles.module.css";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      infoCompany: {},
      paymentCardAccount: [],
      paymentTypes: [],
      detailCard: null,
      getPaymentMethod: false,
      showAddPaymentForm: false,
      addPaymentFormUrl: "",
      latestCardRegistered: null,
      CreditCardSelected: null,
    };
  }

  componentDidMount = async () => {
    let getPaymentMethod = JSON.parse(
      localStorage.getItem(`${config.prefix}_getPaymentMethod`) || false
    );
    this.setState({ getPaymentMethod });
    this.getDataPaymentCard();

    window.addEventListener("focus", this.onFocus);
  };

  componentWillUnmount() {
    window.removeEventListener("focus", this.onFocus);
  }

  onFocus = async () => {
    try {
      if (this.state.latestCardRegistered === null) return;
      let accountID = this.state.latestCardRegistered.accountID;
      const response = await this.props.dispatch(
        PaymentAction.checkPaymentCard(accountID)
      );
      if (response.data.registrationStatus === "completed") {
        localStorage.setItem(
          `${config.prefix}_paymentCardAccountDefault`,
          JSON.stringify(encryptor.encrypt(response.data))
        );

        await this.getDataPaymentCard();
        this.setState({ showAddPaymentForm: false });
        this.handleSelectCard(response.data);
        Swal.fire({
          icon: "success",
          timer: 1500,
          title: "Your Credit Card has been added.",
          showConfirmButton: false,
        });
      } else if (
        response.data &&
        response.data.registrationStatus === "failed"
      ) {
        this.setState({ showAddPaymentForm: false });
        Swal.fire({
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          title: "Failed to add Credit Card!",
        });
      }
    } catch (e) {}
  };

  getDataPaymentCard = async () => {
    let infoCompany = await this.props.dispatch(
      MasterdataAction.getInfoCompany()
    );

    let paymentCardAccount = await this.props.dispatch(
      PaymentAction.getPaymentCard()
    );

    let selectedCard = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
    );

    if (infoCompany.paymentTypes && paymentCardAccount.resultCode === 200) {
      let paymentTypes = infoCompany.paymentTypes;
      paymentTypes.forEach((elements) => {
        elements.data = _.filter(paymentCardAccount.data, {
          paymentID: elements.paymentID,
        });
        elements.data.forEach((element) => {
          element.minimumPayment = elements.minimumPayment;
          if (element.isDefault) {
            element.default = true;
            localStorage.setItem(
              `${config.prefix}_paymentCardAccountDefault`,
              JSON.stringify(encryptor.encrypt(element))
            );
          }
          if (selectedCard && selectedCard.accountID === element.accountID) {
            element.selected = true;
          } else {
            delete element.selected;
          }
        });
      });

      this.setState({ paymentTypes });
    }
    this.setState({ loadingShow: false, infoCompany });
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

  handleRemoveCard = () => {
    let detailCard = this.state.detailCard;
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete the card!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        this.setState({ isLoading: true });
        try {
          if (detailCard.default)
            localStorage.removeItem(
              `${config.prefix}_paymentCardAccountDefault`
            );
          await this.props.dispatch(
            PaymentAction.removePaymentCard(detailCard.accountID)
          );
          await this.getDataPaymentCard();
          this.setState({ accountCard: null });
        } catch (error) {
          console.log(error);
        }
        this.setState({ isLoading: false });
      }
    });
  };

  handleSetDefault = async () => {
    this.setState({ isLoading: true });
    let detailCard = this.state.detailCard;
    if (detailCard.default) {
      localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`);
    } else {
      await this.props.dispatch(
        PaymentAction.setDefaultPaymentCard(detailCard.accountID)
      );
      detailCard.default = true;
      localStorage.setItem(
        `${config.prefix}_paymentCardAccountDefault`,
        JSON.stringify(encryptor.encrypt(detailCard))
      );
    }
    await this.getDataPaymentCard();
    this.setState({ detailCard: null, isLoading: false });
  };

  removeDetailDataCard = () => {
    this.setState({
      latestCardRegistered: null,
      CreditCardSelected: null,
    });
  };

  handleAddMethod = async (data) => {
    let payload = {
      companyID: this.props.account.companyId,
      name: data.paymentName,
      referenceNo: uuid(),
      paymentID: data.paymentID,
    };
    // CHECK IF PAYMENT PROVIDER NEED TO OPEN NEW TAB, THEN REGISTER NOW
    if (
      data.forceNewTab === true ||
      data.paymentID === "MASTERCARD_PAYMENT_GATEWAY"
    ) {
      await this.setState({ isLoading: true });
      let response = await this.props.dispatch(
        PaymentAction.registerPaymentCard(payload)
      );
      await this.setState({
        isLoading: false,
        addPaymentFormUrl: response.data.url,
        latestCardRegistered: response.data,
        CreditCardSelected: data,
      });
      try {
        document.getElementById("register-card-on-new-tab").click();
      } catch (e) {}
      return;
    }

    Swal.fire({
      title: "Add a Card",
      text: "Do you want to add a card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({
          onOpen: () => {
            Swal.showLoading();
          },
        });
        let response = await this.props.dispatch(
          PaymentAction.registerPaymentCard(payload)
        );
        let win = null;
        if (response.resultCode === 200) {
          this.setState({
            isLoading: false,
            addPaymentFormUrl: response.data.url,
            latestCardRegistered: response.data,
          });
          if (
            data.paymentID === "MASTERCARD_PAYMENT_GATEWAY" ||
            data.forceNewTab
          ) {
            win = window.open(response.data.url, "_blank");
            win.focus();
          } else {
            this.setState({
              showAddPaymentForm: true,
            });
          }
          let accountID = response.data.accountID;
          response = await this.props.dispatch(
            PaymentAction.checkPaymentCard(accountID)
          );

          if (data.forceNewTab !== true) {
            let timeInterval = setInterval(async () => {
              response = await this.props.dispatch(
                PaymentAction.checkPaymentCard(accountID)
              );
              if (response.data.registrationStatus === "completed") {
                localStorage.setItem(
                  `${config.prefix}_paymentCardAccountDefault`,
                  JSON.stringify(encryptor.encrypt(response.data))
                );
                if (win) {
                  win.close();
                }
                await this.getDataPaymentCard();
                this.setState({ showAddPaymentForm: false });
                this.handleSelectCard(response.data);
                Swal.fire({
                  icon: "success",
                  timer: 1500,
                  title: "Your Credit Card has been added.",
                  showConfirmButton: false,
                });
                return clearInterval(timeInterval);
              } else if (
                response.data &&
                response.data.registrationStatus === "failed"
              ) {
                this.setState({ showAddPaymentForm: false });
                Swal.fire({
                  icon: "error",
                  timer: 1500,
                  showConfirmButton: false,
                  title: "Failed to add Credit Card!",
                });
                return clearInterval(timeInterval);
              }
            }, 8000);
          }
        }
      }
    });
  };

  handleSelectCard = async (card) => {
    let getPaymentMethod = this.state.getPaymentMethod;
    if (getPaymentMethod) {
      localStorage.setItem(
        `${config.prefix}_selectedCard`,
        JSON.stringify(encryptor.encrypt(card))
      );
      localStorage.removeItem(`${config.prefix}_getPaymentMethod`);
      this.props.history.goBack();
    } else {
      this.setState({ detailCard: card });
    }
  };

  render() {
    let { loadingShow, isLoading, paymentTypes, detailCard, getPaymentMethod } =
      this.state;
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 120 : 140,
          marginBottom: 50,
        }}
      >
        <ModalPaymentMethod
          detailCard={detailCard && detailCard.isAccountRequired ? detailCard : null}
          handleSetDefault={() => this.handleSetDefault()}
          handleRemoveCard={() => this.handleRemoveCard()}
        />
        <ModalPaymentPermission
          latestCardRegistered={this.state.latestCardRegistered}
          CreditCardSelected={this.state.CreditCardSelected}
          removeDetailDataCard={this.removeDetailDataCard}
        />
        <a
          id="register-card-on-new-tab"
          data-toggle="modal"
          data-target="#payment-method-permission"
        ></a>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -40,
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                display: "flex",
                height: 40,
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
              style={{ textAlign: "center" }}
            >
              <div style={{ marginBottom: 20 }}>
                <div
                  className="customer-group-name"
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Payment Method
                </div>

                {loadingShow ? (
                  <Row>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                  </Row>
                ) : (
                  <div>
                    {paymentTypes.map((item, key) =>
                      !item.isAccountRequired ? (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div
                            onClick={() => this.handleSelectCard(item)}
                            className="button"
                            style={{
                              marginBottom: 30,
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <div
                              className="customer-group-name"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: 11,
                                paddingBottom: 11,
                              }}
                            >
                              <CreditCard
                                style={{
                                  fontSize: 20,
                                  color: "white",
                                  marginRight: 10,
                                }}
                              />
                              <h3
                                style={{
                                  fontWeight: "bold",
                                  fontSize: 15,
                                  color: 'white'
                                }}
                              >
                                {item.paymentName}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 10,
                              alignItems: "center",
                            }}
                          >
                            <div
                              className="customer-group-name"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CreditCard style={{ fontSize: 20 }} />
                              <div
                                style={{
                                  marginLeft: 5,
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                              >
                                {item.paymentName}
                              </div>
                            </div>
                            {(item.allowMultipleAccount ||
                              item.data.length === 0) && (
                              <Button
                                className="button"
                                style={{
                                  width: 100,
                                  paddingLeft: 5,
                                  paddingRight: 5,
                                  borderRadius: 5,
                                  height: 40,
                                }}
                                onClick={() => this.handleAddMethod(item)}
                              >
                                <i className="fa fa-plus" aria-hidden="true" />{" "}
                                Add Card
                              </Button>
                            )}
                          </div>
                          <Row>
                            {item.data.map((card, keyCard) => (
                              <Col key={keyCard} sm={6}>
                                <div
                                  style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    marginBottom: 5,
                                    color: "#FFF",
                                    cursor: "pointer",
                                    backgroundColor: "#1d282e",
                                    border: "1 solid #FFF",
                                  }}
                                  data-toggle="modal"
                                  data-target={
                                    !getPaymentMethod && "#payment-method-modal"
                                  }
                                  onClick={() => this.handleSelectCard(card)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {card.details.cardIssuer
                                        ? card.details.cardIssuer.toUpperCase()
                                        : "-"}
                                    </div>
                                    {card.default === true && (
                                      <div
                                        className="profile-dashboard"
                                        style={{
                                          paddingLeft: 10,
                                          paddingRight: 10,
                                          borderBottomLeftRadius: 5,
                                          marginTop: -20,
                                          marginRight: -10,
                                          fontSize: 12,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        DEFAULT
                                      </div>
                                    )}
                                    {card.selected === true && (
                                      <div
                                        className="profile-dashboard"
                                        style={{
                                          paddingLeft: 10,
                                          paddingRight: 10,
                                          borderBottomLeftRadius: 5,
                                          marginTop: -20,
                                          marginRight: -10,
                                          fontSize: 12,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        SELECTED
                                      </div>
                                    )}
                                    {!card.default && !card.selected && (
                                      <CreditCard style={{ fontSize: 20 }} />
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      fontSize: 18,
                                      marginTop: 15,
                                      marginBottom: 15,
                                    }}
                                  >
                                    {card.details.maskedAccountNumber}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <div style={{ fontSize: 12 }}>{`${
                                      card.details.firstName || ""
                                    } ${card.details.lastName || ""}`}</div>
                                    <div
                                      style={{ fontSize: 12 }}
                                    >{`VALID THRU ${card.details.cardExpiryMonth} / ${card.details.cardExpiryYear}`}</div>
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )
                    )}

                    {paymentTypes.length === 0 && (
                      <div>
                        {/* <Lottie
                          options={{ animationData: emptyGif }}
                          style={{ height: 250 }}
                        /> */}
                        <img
                          src={config.url_emptyImage}
                          alt="is empty"
                          style={{ marginTop: 30 }}
                        />
                        <div>Data is empty</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        {isLoading ? Swal.showLoading() : Swal.close()}
        {this.state.showAddPaymentForm && this.state.addPaymentFormUrl && (
          <div className={styles.modalContainer}>
            <Iframe
              loading="auto"
              url={this.state.addPaymentFormUrl}
              className={styles.paymentModal}
            />
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);
