import React, { Component } from 'react';
import {
  Col,
  Row,
  Button,
} from 'reactstrap';
import Shimmer from "react-shimmer-effect";
import config from "../../config";
import { MasterdataAction } from '../../redux/actions/MaterdataAction';
import { PaymentAction } from '../../redux/actions/PaymentAction';
import { connect } from "react-redux";
import CreditCard from "@material-ui/icons/CreditCard";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ModalPaymentMethod from './ModalPaymentMethod';
import _ from "lodash";
import Lottie from 'lottie-react-web';
import emptyGif from '../../assets/gif/empty-and-lost.json';
import { uuid } from 'uuidv4';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const Swal = require('sweetalert2')

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
    };
  }

  componentDidMount = async () => {
    let getPaymentMethod = JSON.parse(localStorage.getItem(`${config.prefix}_getPaymentMethod`) || false);
    this.setState({ getPaymentMethod })
    this.getDataPaymentCard()
  }

  getDataPaymentCard = async () => {
    let infoCompany = await this.props.dispatch(MasterdataAction.getInfoCompany());
    let paymentCardAccount = await this.props.dispatch(PaymentAction.getPaymentCard());
    let paymentCardAccountDefault = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)));
    let selectedCard = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`)));

    if (infoCompany.paymentTypes && paymentCardAccount.resultCode === 200) {
      let paymentTypes = infoCompany.paymentTypes
      paymentTypes.forEach(elements => {
        elements.data = _.filter(paymentCardAccount.data, { "paymentID": elements.paymentID });
        elements.data.forEach(element => {
          if (paymentCardAccountDefault && paymentCardAccountDefault.accountID === element.accountID) {
            element.default = true;
            delete element.selected
          } else if (selectedCard && selectedCard.accountID === element.accountID) {
            element.selected = true;
            delete element.default
          } else {
            delete element.default
            delete element.selected
          }
        });
      });
      // console.log(paymentTypes)
      this.setState({ paymentTypes })
    }

    this.setState({ loadingShow: false, infoCompany })
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

  handleRemoveCard = () => {
    let detailCard = this.state.detailCard;
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete the card!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.value) {
        this.setState({ isLoading: true })
        try {
          if (detailCard.default) localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`)
          await this.props.dispatch(PaymentAction.removePaymentCard(detailCard.accountID));
          await this.getDataPaymentCard();
          this.setState({ accountCard: null })
        } catch (error) {
          console.log(error)
        }
        this.setState({ isLoading: false })
      }
    })
  }

  handleSetDefault = async () => {
    this.setState({ isLoading: true })
    let detailCard = this.state.detailCard;
    if (detailCard.default) {
      localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`);
    } else {
      detailCard.default = true;
      localStorage.setItem(`${config.prefix}_paymentCardAccountDefault`, JSON.stringify(encryptor.encrypt(detailCard)));
    }
    await this.getDataPaymentCard();
    this.setState({ detailCard: null, isLoading: false })
  }

  handleAddMethod = async (data) => {
    let payload = {
      companyID: this.props.account.companyId,
      name: data.paymentName,
      referenceNo: uuid(),
      paymentID: data.paymentID
    }

    Swal.fire({
      title: "Add a Card",
      text: "Do you want to add a card?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({ onOpen: () => { Swal.showLoading() } })
        let response = await this.props.dispatch(PaymentAction.registerPaymentCard(payload));
        if (response.resultCode === 200) {
          let newWindow = window.open(response.data.url, '_blank');
          if (newWindow == null || typeof (newWindow) == 'undefined') {
            Swal.fire({
              icon: 'info', timer: 1500, showConfirmButton: false,
              title: 'Please disable your pop-up blocker and try again.',
            })
            return
          } else {
            newWindow.focus();
          }
          // this.openTab(response.data.url);
          // console.log('registrasi', response)

          let accountID = response.data.accountID
          for (let index = 0; index < 100000; index++) {
            response = await this.props.dispatch(PaymentAction.checkPaymentCard(accountID));
            if (response.data && response.data.registrationStatus === "completed") {
              localStorage.setItem(`${config.prefix}_paymentCardAccountDefault`, JSON.stringify(encryptor.encrypt(response.data)));
              await this.getDataPaymentCard();
              newWindow.close()
              this.handleSelectCard(response.data)
              Swal.fire({
                icon: 'success', timer: 1500,
                title: 'Your Credit Card has been added.', showConfirmButton: false,
              })
              return
            } else if (response.data && response.data.registrationStatus === "failed") {
              newWindow.close()
              Swal.fire({
                icon: 'error', timer: 1500, showConfirmButton: false,
                title: 'Failed to add Credit Card!',
              })
              return
            }
            try {
              console.log(newWindow.location.href)
              if (newWindow.location.href === undefined) {
                newWindow.close()
                Swal.fire({
                  icon: 'error', timer: 1500, showConfirmButton: false,
                  title: 'Failed to add Credit Card!',
                })
                return
              }
            } catch (error) {
              console.log("Waiting add payment")
            }
          }
          newWindow.close()
        }
      }
    })
  }

  openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };

  handleSelectCard = async (card) => {
    let getPaymentMethod = this.state.getPaymentMethod
    if (getPaymentMethod) {
      localStorage.setItem(`${config.prefix}_selectedCard`, JSON.stringify(encryptor.encrypt(card)));
      localStorage.removeItem(`${config.prefix}_getPaymentMethod`)
      this.props.history.goBack()
    } else {
      this.setState({ detailCard: card })
    }
  }

  render() {
    let {
      loadingShow,
      isLoading,
      paymentTypes,
      detailCard,
      getPaymentMethod
    } = this.state
    return (
      <div className="col-full" style={{ marginTop: 120, marginBottom: 50 }}>
        <a id="newTabLink" target="_blank" href="https://www.google.com/" />
        <ModalPaymentMethod
          detailCard={detailCard}
          handleSetDefault={() => this.handleSetDefault()}
          handleRemoveCard={() => this.handleRemoveCard()}
        />
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

              <div style={{ marginBottom: 20 }}>
                <div className="customer-group-name" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                  Payment Method
                </div>

                {
                  loadingShow ?
                    <Row>
                      <Col sm={6}>{this.viewShimmer()}</Col>
                      <Col sm={6}>{this.viewShimmer()}</Col>
                    </Row> :
                    <div>
                      {
                        paymentTypes.map((item, key) => (
                          <div key={key} style={{ marginBottom: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center", }}>
                              <div className="customer-group-name" style={{ display: "flex", alignItems: "center" }}>
                                <CreditCard style={{ fontSize: 20 }} />
                                <div style={{ marginLeft: 5, fontWeight: "bold", fontSize: 12 }}>{item.paymentName}</div>
                              </div>
                              {
                                (item.allowMultipleAccount || item.data.length === 0) &&
                                <Button className="profile-dashboard" style={{
                                  color: "#FFF", paddingLeft: 10, paddingRight: 10,
                                  borderRadius: 5, cursor: "pointer", fontSize: 14, fontWeight: "bold",
                                  boxShadow: "-1px -1px 5px rgba(128, 128, 128, 0.3)", display: "flex", alignItems: "center",
                                  justifyContent: "space-between", height: 40
                                }} onClick={() => this.handleAddMethod(item)}>
                                  <AddCircleIcon style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }} />
                                  Add Card
                                </Button>
                              }
                            </div>
                            <Row>
                              {
                                item.data.map((card, keyCard) => (
                                  <Col key={keyCard} sm={6}>
                                    <div style={{
                                      boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.3)", padding: 10,
                                      borderRadius: 5, marginBottom: 5, color: "#FFF",
                                      cursor: "pointer", backgroundColor: "#1d282e"
                                    }} data-toggle="modal" data-target={!getPaymentMethod && "#payment-method-modal"}
                                      onClick={() => this.handleSelectCard(card)}>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <div style={{ fontSize: 16, fontWeight: "bold" }}>{card.details.cardIssuer.toUpperCase()}</div>
                                        {
                                          card.default === true &&
                                          <div className="profile-dashboard" style={{
                                            paddingLeft: 10, paddingRight: 10, borderBottomLeftRadius: 5,
                                            marginTop: -20, marginRight: -10, fontSize: 12, fontWeight: "bold"
                                          }}>
                                            DEFAULT
                                          </div>
                                        }
                                        {
                                          card.selected === true &&
                                          <div className="profile-dashboard" style={{
                                            paddingLeft: 10, paddingRight: 10, borderBottomLeftRadius: 5,
                                            marginTop: -20, marginRight: -10, fontSize: 12, fontWeight: "bold"
                                          }}>
                                            SELECTED
                                          </div>
                                        }
                                        {!card.default && !card.selected && <CreditCard style={{ fontSize: 20 }} />}
                                      </div>
                                      <div style={{ textAlign: "center", fontSize: 18, marginTop: 15, marginBottom: 15 }}>
                                        {card.details.maskedAccountNumber}
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <div style={{ fontSize: 12 }}>{`${card.details.firstName || ""} ${card.details.lastName || ""}`}</div>
                                        <div style={{ fontSize: 12 }}>{`VALID THRU ${card.details.cardExpiryMonth} / ${card.details.cardExpiryYear}`}</div>
                                      </div>
                                    </div>
                                  </Col>
                                ))
                              }
                            </Row>
                          </div>
                        ))
                      }
                      {
                        paymentTypes.length === 0 &&
                        <div>
                          <Lottie
                            options={{ animationData: emptyGif }}
                            style={{ height: 250 }}
                          />
                          <div>Data is empty</div>
                        </div>
                      }
                    </div>
                }

              </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);