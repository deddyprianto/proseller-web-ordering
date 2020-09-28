import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import Loading from "../loading";
import { connect } from "react-redux";
import Select from "react-select";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import GoogleMaps from "./GoogleMaps";

const Swal = require("sweetalert2");

class ModalDeliveryAdderss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      optionsCity: [],
    };
  }

  setProvince = async (e) => {
    let { deliveryAddress, countryCode } = this.props;
    deliveryAddress.province = e.value;

    try {
      this.setState({ isLoading: true });
      let city = await this.props.dispatch(
        MasterdataAction.getAddressLocation(countryCode, e.code)
      );
      let optionsCity = [];
      city.data.forEach((element) => {
        optionsCity.push({
          value: element.name,
          label: element.name,
          code: element.code,
        });
      });
      this.setState({ isLoading: false, optionsCity });
    } catch (error) {
      console.log(error);
    }
  };

  handleSaveAddress = async (isEdit = false) => {
    this.setState({ isLoading: true });
    let {
      deliveryAddress,
      addressDelivery,
      isNew,
      indexEdit,
      getDataDeliveryAddress,
      countryCode,
    } = this.props;

    if (!deliveryAddress.city) {
      let province = await this.props.dispatch(
        MasterdataAction.getAddressLocation(countryCode)
      );
      if (province.resultCode === 200)
        deliveryAddress.city = province.data[0].name;
    }

    if (!addressDelivery) addressDelivery = [];
    if (isNew) addressDelivery.push(deliveryAddress);
    else addressDelivery[indexEdit] = deliveryAddress;

    let payload = {
      username: this.props.account.username,
      deliveryAddress: addressDelivery,
    };

    // console.log(payload)
    // return
    let response = await this.props.dispatch(
      CustomerAction.updateCustomerProfile(payload)
    );
    console.log(response);
    if (response.ResultCode === 200) {
      await getDataDeliveryAddress();
      this.setState({ isLoading: false });
      document.getElementById("btn-close-address").click();
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
  };

  render() {
    let {
      hidden,
      deliveryAddress,
      optionsAddressName,
      optionsProvince,
      optionsCity,
    } = this.props;
    if (this.state.optionsCity.length !== 0)
      optionsCity = this.state.optionsCity;
    return (
      <div>
        <div
          className="modal fade"
          id="delivery-address-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content"
              style={{ width: "100%", marginTop: 100, marginBottom: 100 }}
            >
              <div
                className="modal-header"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{ fontSize: 20 }}
                >
                  Delivery Address
                </h5>
                <button
                  type="button"
                  id="btn-close-address"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 16,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              {deliveryAddress && (
                <div className="modal-body" style={{ textAlign: "left" }}>
                  <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
                    <label>
                      Address Name <span className="required">*</span>
                    </label>
                    <Select
                      value={
                        optionsAddressName.find((items) => {
                          return items.value === deliveryAddress.addressName;
                        }) || ""
                      }
                      options={optionsAddressName}
                      onChange={(e) =>
                        this.props.handleChange("addressName", e.value)
                      }
                    />
                  </div>

                  {!hidden && (
                    <div
                      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                      style={{ marginTop: 10 }}
                    >
                      <label>
                        Province <span className="required">*</span>
                      </label>
                      <Select
                        value={
                          optionsProvince.find((items) => {
                            return items.value === deliveryAddress.province;
                          }) || ""
                        }
                        options={optionsProvince}
                        onChange={(e) => this.setProvince(e)}
                      />
                    </div>
                  )}

                  {!hidden && (
                    <div
                      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                      style={{ marginTop: 10 }}
                    >
                      <label>
                        City <span className="required">*</span>
                      </label>
                      <Select
                        value={
                          optionsCity.find((items) => {
                            return items.value === deliveryAddress.city;
                          }) || ""
                        }
                        options={optionsCity}
                        onChange={(e) =>
                          this.props.handleChange("city", e.value)
                        }
                      />
                    </div>
                  )}

                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Street Name<span className="required">*</span>
                    </label>
                    <Input
                      type="text"
                      style={{ height: 40, borderRadius: 5 }}
                      value={deliveryAddress.street || ""}
                      onChange={(e) =>
                        this.props.handleChange("street", e.target.value)
                      }
                    />
                  </div>

                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Unit No. <span className="required">*</span>
                    </label>
                    <Input
                      type="text"
                      style={{ height: 40, borderRadius: 5 }}
                      value={deliveryAddress.unitNo || ""}
                      onChange={(e) =>
                        this.props.handleChange("unitNo", e.target.value)
                      }
                    />
                  </div>

                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Postal Code <span className="required">*</span>
                    </label>
                    <Input
                      type="number"
                      style={{ height: 40 }}
                      value={deliveryAddress.postalCode || ""}
                      onChange={(e) =>
                        this.props.handleChange("postalCode", e.target.value)
                      }
                    />
                  </div>
                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Select location <span className="required">*</span>
                    </label>
                    <div
                      style={{
                        height: "300px",
                        width: "100%",
                        marginTop: "1rem",
                      }}
                    >
                      <GoogleMaps></GoogleMaps>
                    </div>
                  </div>

                  <Button
                    className="button"
                    style={{
                      width: "100%",
                      marginTop: 10,
                      borderRadius: 5,
                      height: 50,
                    }}
                    onClick={() => this.handleSaveAddress()}
                  >
                    Save Address
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDeliveryAdderss);
