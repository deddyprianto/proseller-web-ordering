import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import config from "../../config";
import { connect } from "react-redux";
import Select from "react-select";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { CustomerAction } from "../../redux/actions/CustomerAction";
// import GoogleMaps from "./GoogleMaps";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class ModalDeliveryAdderss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      optionsCity: [],
    };
  }

  componentWillUnmount = () => {
    try {
      document.getElementById('btn-close-address').click()
    }catch(e) { }
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
      handleSelected,
      getDeliveryAddress
    } = this.props;

    if (isNew) {
      if (addressDelivery !== null) {
        const find = addressDelivery.find(item => item.addressName === deliveryAddress.addressName)
        if (find !== undefined){
          await this.setState({ isLoading: false });
          Swal.fire({
            icon: "warning",
            title: `${deliveryAddress.addressName} address is already added.`,
            showConfirmButton: true,
          });
          return
        }
      }
    }
    
    
    if (!deliveryAddress.city) {
      let province = await this.props.dispatch(
        MasterdataAction.getAddressLocation(countryCode)
      );
      if (province.resultCode === 200)
        deliveryAddress.city = province.data[0].name;
    }

    delete deliveryAddress.setAddress
    delete deliveryAddress.selected

    console.log(deliveryAddress)

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
    await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
    console.log(response);
    if (response.ResultCode === 200) {
      await getDataDeliveryAddress();
      if(getDeliveryAddress) await handleSelected(deliveryAddress);
      else {
        localStorage.setItem(`${config.prefix}_deliveryAddress`, JSON.stringify(encryptor.encrypt(deliveryAddress)));
        this.props.dispatch({ type: "SET_DELIVERY_ADDRESS", payload: deliveryAddress });
      }
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

  checkFields = () => {
    let { deliveryAddress } = this.props;
    try{
      if (deliveryAddress.addressName === "" || deliveryAddress.addressName === null ||
          deliveryAddress.street === "" || deliveryAddress.street === undefined ||
          deliveryAddress.unitNo === "" || deliveryAddress.unitNo === undefined ||
          deliveryAddress.postalCode === "" || deliveryAddress.postalCode === undefined
        )
        return true
      else return false
    }catch(e) {
      return true
    }
  }

  render() {
    let {
      hidden,
      deliveryAddress,
      optionsAddressName,
      optionsProvince,
      optionsCity,
      postalCodeIsValid
    } = this.props;
    if (this.state.optionsCity.length !== 0) optionsCity = this.state.optionsCity;

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
                    <label style={{fontSize: 12}}>
                      Address Name <span className="required">*</span>
                    </label>
                    <Select
                      value={
                        optionsAddressName.find((items) => {
                          return items.value === deliveryAddress.addressName;
                        }) || ""
                      }
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected ? '#000' : '#808080'
                        })
                      }}
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
                      <label style={{fontSize: 12}}>
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
                      <label style={{fontSize: 12}}>
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
                    <label style={{fontSize: 12}}>
                      Street Name <span className="required">*</span>
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
                    <label style={{fontSize: 12}}>
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
                    <label style={{fontSize: 12}}>
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
                    {
                      !postalCodeIsValid && 
                      <div className="text text-warning-theme small" 
                        style={{lineHeight: "15px", marginTop:5}}> 
                        <em>Postal code is not valid</em> 
                      </div>
                    }
                  </div>
                  {/* <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label style={{fontSize: 12}}>
                      Location <span className="required">*</span>
                    </label>
                    <div
                      style={{
                        height: "300px",
                        width: "100%",
                        marginTop: "1rem",
                      }}
                    > */}
                      {/* <GoogleMaps 
                        deliveryAddress={deliveryAddress.address || deliveryAddress.street || {}}
                        setAddress={deliveryAddress.setAddress || false}
                        handleChange={(field, value) => this.props.handleChange(field, value)}
                      /> */}
                    {/* </div>
                  </div> */}

                  <Button
                    disabled={!postalCodeIsValid || this.checkFields()}
                    className="button"
                    style={{
                      width: "100%",
                      marginTop: 20,
                      borderRadius: 5,
                      height: 50,
                    }}
                    onClick={() => this.handleSaveAddress()}
                  >
                    <i className="fa fa-floppy-o" aria-hidden="true" /> Save Address
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
