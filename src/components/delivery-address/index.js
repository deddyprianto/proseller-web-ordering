import React, { Component } from "react";
import { Col, Row, Button } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import config from "../../config";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { connect } from "react-redux";
import ModalDeliveryAddress from "./ModalDeliveryAddress";
// import { findKey } from "lodash";
// import GoogleMaps from "./GoogleMaps";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class DeliveryAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      addressDelivery: null,
      countryCode: "ID",
      optionsProvince: [],
      optionsCity: [],
      optionsAddressName: [
        { value: "Home", label: "Home" },
        { value: "Work", label: "Work" },
        { value: "School", label: "School" },
        { value: "Office", label: "Office" },
        { value: "Other", label: "Other" },
      ],
      deliveryAddress: {},
      indexEdit: 0,
      isNew: false,
      getDeliveryAddress: false,
      postalCodeIsValid: true
    };
  }

  componentDidMount = async () => {
    let getDeliveryAddress = JSON.parse(
      localStorage.getItem(`${config.prefix}_getDeliveryAddress`) || false
    );
    this.setState({ getDeliveryAddress });
    await this.getDataDeliveryAddress();

    await this.getLocationPinned()
  };

  getLocationPinned = async () => {
    let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
    let backupAddress = localStorage.getItem(`${config.prefix}_backupAddress`);
    console.log(backupAddress, 'backupAddress')
    try {
      if (coordinate !== null && coordinate !== "") {
        coordinate = JSON.parse(coordinate)
        if (backupAddress === "" || backupAddress === null || backupAddress === undefined) {
          setTimeout(() => {
            document.getElementById('modal-delivery-address').click()
          }, 300)
        } else {
          let item = localStorage.getItem(`${config.prefix}_backupAddress`);
          item = JSON.parse(item);
          this.setState({isNew: false})
          this.handleEdit(item.indexEdit, item, coordinate)
          setTimeout(() => {
            document.getElementById('modal-edit-address').click()
          }, 300)
        }
      }
    } catch(e) {}
  }

  getDataDeliveryAddress = async () => {
    let deliveryAddress = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_deliveryAddress`))
    );
    let infoCompany = await this.props.dispatch(
      MasterdataAction.getInfoCompany()
    );
    let addressDelivery = await this.props.dispatch(
      CustomerAction.getDeliferyAddress()
    );
    if (addressDelivery.ResultCode === 200) {
      if (deliveryAddress) {
        deliveryAddress.Data &&
          addressDelivery.Data.forEach((address) => {
            if (deliveryAddress.addressName === address.addressName) {
              address.selected = true;
            } else {
              delete address.selected;
            }
          });
      }

      this.setState({ addressDelivery: addressDelivery.Data });
    }
    await this.handleGetProvider();
    this.setState({ loadingShow: false, countryCode: infoCompany.countryCode });
    // this.setState({ loadingShow: false })
  };

  handleGetProvider = async (countryCode = null) => {
    try {
      if (!countryCode) countryCode = this.state.countryCode;
      let province = await this.props.dispatch(
        MasterdataAction.getAddressLocation(countryCode)
      );
      let optionsProvince = [];
      province.data.forEach((element) => {
        optionsProvince.push({
          value: element.name,
          label: element.name,
          code: element.code,
        });
      });
      this.setState({ optionsProvince });
    } catch (error) {
      console.log(error);
    }
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

  handleAdd = async () => {
    let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
    let addressName = localStorage.getItem(`${config.prefix}_addressName`);
    try {
      let deliveryAddress = {}
      coordinate = JSON.parse(coordinate)
      if (coordinate && coordinate.detailAddress !== '') {
        deliveryAddress.coordinate = coordinate;
        deliveryAddress.addressName = addressName;
        try {
          const streetName = `${coordinate.userLocation}`;
          deliveryAddress.street = streetName;
        } catch (e) {}

        try {
          const postalCode = `${
            coordinate.detailAddress.address_components.find(
              item => item.types[0] === 'postal_code',
            ).long_name
          }`;
          deliveryAddress.postalCode = postalCode;
        } catch (e) {}
        await this.setState({ deliveryAddress, isNew: true });
      } else {
        this.setState({ deliveryAddress: { address: {} }, isNew: true });
      }
    } catch(e) {
      this.setState({ deliveryAddress: { address: {} }, isNew: true });
    }

    localStorage.removeItem(`${config.prefix}_backupAddress`);

  };

  handleEdit = async (indexEdit, item, setCoordinate = false) => {
    item.setAddress = false

    item.indexEdit = indexEdit;
    localStorage.setItem(`${config.prefix}_backupAddress`, JSON.stringify(item));

    if (item.coordinate !== undefined && !setCoordinate) {
      localStorage.setItem(`${config.prefix}_locationPinned`, JSON.stringify(item.coordinate));
    }

    if (setCoordinate) {
      let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
      coordinate = JSON.parse(coordinate)
      item.coordinate = coordinate
      if (coordinate && coordinate.detailAddress !== '') {
        try {
          const streetName = `${coordinate.userLocation}`;
          item.street = streetName;
        } catch (e) {}

        try {
          const postalCode = `${
            coordinate.detailAddress.address_components.find(
              item => item.types[0] === 'postal_code',
            ).long_name
          }`;
          item.postalCode = postalCode;
        } catch (e) {}
      }
    }

    localStorage.setItem(`${config.prefix}_addressName`, item.addressName);

    let countryCode = this.state.countryCode;
    let optionsProvince = this.state.optionsProvince;
    let province = optionsProvince.find((items) => {
      return items.value === item.province;
    });
    if (province) {
      this.setState({ isLoading: true });
      let city = await this.props.dispatch(
        MasterdataAction.getAddressLocation(countryCode, province.code)
      );
      await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
      let optionsCity = [];
      city.data.forEach((element) => {
        optionsCity.push({
          value: element.name,
          label: element.name,
          code: element.code,
        });
      });
      // console.log(optionsCity)
      this.setState({ optionsCity, isLoading: false });
    }
    this.setState({ deliveryAddress: item, isNew: false, indexEdit });
  };

  handleDelete = async (data) => {
    Swal.fire({
      title: `Remove ${data.addressName}?`,
      text: `The address ${data.addressName} will be deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        this.setState({ isLoading: true });
        let addressDelivery = this.state.addressDelivery;
        
        if (
          this.props.deliveryAddress &&
          this.props.deliveryAddress.address === data.address
        ) {
          this.props.dispatch({ type: "SET_DELIVERY_ADDRESS", payload: null });
        }
        addressDelivery = addressDelivery.filter(function (a) {
          return a.address !== data.address;
        });

        let payload = {
          username: this.props.account.username,
          deliveryAddress: addressDelivery,
        };

        // console.log(payload)
        let response = await this.props.dispatch(
          CustomerAction.updateCustomerProfile(payload)
        );
        // console.log(response)
        if (response.ResultCode === 200) {
          await this.getDataDeliveryAddress();
          this.setState({ isLoading: false });
          Swal.fire({
            icon: "success",
            timer: 1500,
            title: response.message,
            showConfirmButton: false,
          });
        } else {
          this.setState({ isLoading: false });
          Swal.fire({
            icon: "error",
            timer: 1500,
            title: response.message,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  handleSelected = async (items) => {
    localStorage.setItem(`${config.prefix}_deliveryAddress`, JSON.stringify(encryptor.encrypt(items)));
    await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
    this.props.dispatch({ type: "SET_DELIVERY_ADDRESS", payload: items });
    localStorage.removeItem(`${config.prefix}_getDeliveryAddress`);
    this.props.history.goBack();
  };

  handleChange = (field, value) => {
    let { deliveryAddress } = this.state;
    deliveryAddress[field] = value;
    if(field !== "address"){
      deliveryAddress.address = `${deliveryAddress.street || ""}, ${deliveryAddress.unitNo || ""}, ${deliveryAddress.postalCode || ""}`;
    } else {
      deliveryAddress.setAddress = true;
    } 
    if(field === "street") {
      deliveryAddress.setAddress = false;
      if(deliveryAddress.postalCode){
        this.validationPostalCode(deliveryAddress.postalCode, deliveryAddress.codePostal)
      }
    }
    if(field === "postalCode"){
      this.validationPostalCode(value, deliveryAddress.codePostal)
    }
    this.setState({ deliveryAddress });
  };

  validationPostalCode(postalCode, codePostal){
    console.log(codePostal)
    let check = true
    if(codePostal && Number(codePostal)){
      // if(postalCode.toString().substr(0,2) !== codePostal.toString().substr(0,2)) check = false
      // if(postalCode.toString().length !== codePostal.toString().length) check = false
      if(postalCode.toString().length < 6) check = false
      if(postalCode.toString().length > 6) check = false
    } else {
      if(postalCode.toString().length !== 6) check = false
    }
    this.setState({postalCodeIsValid: check})
    return check
  }

  render() {
    let {
      loadingShow,
      deliveryAddress,
      optionsAddressName,
      optionsCity,
      optionsProvince,
      countryCode,
      addressDelivery,
      isNew,
      indexEdit,
      getDeliveryAddress,
      postalCodeIsValid,
    } = this.state;

    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 120 : 140,
          marginBottom: 50,
        }}
      >
        <ModalDeliveryAddress
          getDataDeliveryAddress={() => this.getDataDeliveryAddress()}
          handleChange={(field, value) => this.handleChange(field, value)}
          handleSelected={(update) => this.handleSelected(update)}
          getDeliveryAddress={getDeliveryAddress}
          addressDelivery={addressDelivery}
          deliveryAddress={deliveryAddress}
          optionsProvince={optionsProvince}
          optionsCity={optionsCity}
          optionsAddressName={optionsAddressName}
          countryCode={countryCode}
          isNew={isNew}
          indexEdit={indexEdit}
          hidden={countryCode === undefined || countryCode === "SG"}
          postalCodeIsValid={postalCodeIsValid}
        />

        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -60,
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div
                    className="customer-group-name"
                    style={{ fontWeight: "bold" }}
                  >
                    Delivery Address
                  </div>
                  <Button
                    id="modal-delivery-address"
                    className="button"
                    data-toggle="modal"
                    data-target="#delivery-address-modal"
                    style={{
                      width: 155,
                      paddingLeft: 5,
                      paddingRight: 5,
                      borderRadius: 5,
                      height: 40,
                    }}
                    onClick={() => this.handleAdd()}
                  >
                    <i className="fa fa-plus" aria-hidden="true" /> Add New Address
                  </Button>
                </div>

                {loadingShow && (
                  <Row>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                    <Col sm={6}>{this.viewShimmer()}</Col>
                  </Row>
                )}

                {!loadingShow && (
                  <Row>
                    {addressDelivery &&
                      addressDelivery.map((items, key) => (
                        <Col key={key} sm={6}>
                          <div
                            style={{
                              marginBottom: 10,
                              width: "100%",
                              boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                              cursor: "pointer",
                              borderRadius: 5,
                              textAlign: "left",
                              padding: 10,
                            }}
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
                                className="customer-group-name"
                                style={{ fontWeight: "bold" }}
                              >
                                {items.addressName}
                              </div>
                              {getDeliveryAddress &&
                                this.props.deliveryAddress &&
                                items.address ===
                                  this.props.deliveryAddress.address && (
                                  <div
                                    className="profile-dashboard"
                                    style={{
                                      paddingLeft: 10,
                                      paddingRight: 10,
                                      borderBottomLeftRadius: 5,
                                      marginRight: -10,
                                      fontSize: 12,
                                      fontWeight: "bold",
                                      marginTop: -20,
                                    }}
                                  >
                                    SELECTED
                                  </div>
                                )}
                            </div>
                            <div style={{ fontSize: 14 }}>
                              {typeof items.address === "string"
                                ? items.address
                                : `${items.address.street}, ${items.address.unitNo}`}
                            </div>
                            <div style={{ fontSize: 12 }}>
                              {`${items.province ? items.province + ", " : ""}${
                                items.city
                              }, ${items.postalCode}`}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 10,
                              }}
                            >
                              <Button
                                className="profile-dashboard"
                                data-toggle="modal"
                                data-target="#delivery-address-modal"
                                style={{
                                  width: 150,
                                  paddingLeft: 5,
                                  paddingRight: 5,
                                  borderRadius: 5,
                                  height: 40,
                                  fontWeight: "bold"
                                }}
                                onClick={() => this.handleEdit(key, items)}
                              >
                                Edit
                              </Button>
                              {getDeliveryAddress ? (
                                <Button
                                  className="border-theme background-theme"
                                  disabled={
                                    (this.props.deliveryAddress &&
                                      items.address ===
                                        this.props.deliveryAddress
                                          .address) ||
                                    false
                                  }
                                  style={{
                                    width: 150,
                                    fontWeight: "bold"
                                  }}
                                  onClick={() => this.handleSelected(items)}
                                >
                                  <div className="color-active">Select</div>
                                </Button>
                              ) : (
                                <Button
                                  className="border-theme background-theme"
                                  style={{
                                    width: 150,
                                    fontWeight: "bold"
                                  }}
                                  onClick={() => this.handleDelete(items)}
                                >
                                  <div className="color-active">Delete</div>
                                </Button>
                              )}
                            </div>
                          </div>
                        </Col>
                      ))}
                  </Row>
                )}
              </div>
            </main>
          </div>
        </div>
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
        <div data-toggle="modal" id="modal-edit-address" data-target="#delivery-address-modal"></div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
    deliveryAddress: state.order.deliveryAddress,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAddress);