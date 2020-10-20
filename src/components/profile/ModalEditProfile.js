import React, { Component } from "react";
import { Button } from "reactstrap";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { AuthActions } from "../../redux/actions/AuthAction";
import { connect } from "react-redux";
import config from "../../config";
import { CONSTANT } from "../../helpers";

import { lsLoad, lsStore } from "../../helpers/localStorage";
import CustomFields from "./CustomFields";

const Swal = require("sweetalert2");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

class ModalEditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelected: 2,
      dataCustomer: {
        address: {},
      },
      mandatoryField: null,
      loadingShow: true,
      isLoading: false,
      editFotoShow: false,
      birthMonthOption: [
        { value: "2000-01-01", lable: "January" },
        { value: "2000-02-01", lable: "February" },
        { value: "2000-03-01", lable: "March" },
        { value: "2000-04-01", lable: "April" },
        { value: "2000-05-01", lable: "May" },
        { value: "2000-06-01", lable: "June" },
        { value: "2000-07-01", lable: "July" },
        { value: "2000-08-01", lable: "August" },
        { value: "2000-09-01", lable: "September" },
        { value: "2000-10-01", lable: "October" },
        { value: "2000-11-01", lable: "November" },
        { value: "2000-12-01", lable: "December" },
      ],
      editName: false,

      editEmail: false,
      emailUsed: true,
      emailCheckTimeout: null,
      checkingEmail: false,

      editPhoneNumber: false,
      phoneCheckTimeout: null,
      phoneUsed: true,
      checkingPhone: false,

      editPassword: false,
      newPassword: "",
      oldPassword: "",
      retypeNewPassword: "",
      validatePass: false,
      textValidate: "",
      showOldPassword: false,
      showNewPassword: false,
      showRePassword: false,
      isDisableBirthDate: false,
      errorName: ""
    };
  }

  componentDidMount = async () => {
    this.getData();
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.fields !== this.props.fields) {
      this.props.field && this.props.fields.forEach((field) => {
        if (!this.state.dataCustomer[field.fieldName] && field.defaultValue) {
          this.setState((prevState) => ({
            dataCustomer: {
              ...prevState.dataCustomer,
              [field.fieldName]: field.defaultValue,
            },
          }));
        }
      });
    }
  };

  getData = async () => {
    let dataCustomer = await this.props.dispatch(
      CustomerAction.getCustomerProfile()
    );
    if (dataCustomer.ResultCode === 200) {
      if (dataCustomer.Data[0].birthDate)
        this.setState({ isDisableBirthDate: true });
      this.setState({ dataCustomer: dataCustomer.Data[0] });
    }
    let mandatoryField = await this.props.dispatch(
      CustomerAction.mandatoryField()
    );
    if (mandatoryField.resultCode === 200)
      this.setState({ mandatoryField: mandatoryField.data.fields });
    this.setState({ loadingShow: false });
  };

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    if(field === "name") {
      if((/^[A-Za-z]+$/.test(value))) this.setState({ errorName: "" });
      else this.setState({ errorName: "Name is alphabets only" });
    }
    if (field === "email") {
      if (this.state.emailCheckTimeout) clearTimeout(this.state.emailCheckTimeout);
      const isMyEmail = this.props.account.email === value;
      if (!isMyEmail) {
        this.setState({ checkingEmail: true });
        const emailTimeout = setTimeout(async () => {
          const response = await this.props.dispatch(
            AuthActions.check({ email: value })
          );
          const isUsed = await response.Data.status;
          this.setState({
            emailUsed: isUsed || isMyEmail,
            editEmail: !isMyEmail,
            checkingEmail: false,
          });
        }, 2000);
        this.setState({ emailCheckTimeout: emailTimeout });
      } else {
        this.setState({
          editEmail: false,
          checkingEmail: false,
          emailUsed: true,
        });
      }
    }
    if (field === "phoneNumber") {
      if (this.state.phoneCheckTimeout) clearTimeout(this.state.phoneCheckTimeout);
      const isMyPhone = this.props.account.phoneNumber === value;
      if (!isMyPhone) {
        this.setState({ checkingPhone: true });
        const phoneTimeout = setTimeout(async () => {
          const response = await this.props.dispatch(
            AuthActions.check({ phoneNumber: value })
          );
          const isUsed = await response.Data.status;
          this.setState({
            phoneUsed: isUsed || isMyPhone,
            editPhoneNumber: !isMyPhone,
            checkingPhone: false,
          });
        }, 2000);
        this.setState({ phoneCheckTimeout: phoneTimeout });
      } else {
        this.setState({
          editPhoneNumber: false,
          checkingPhone: false,
          phoneUsed: true,
        });
      }
    }
    dataCustomer[field] = value;
    dataCustomer.address = `${dataCustomer.street || ""}, ${dataCustomer.unitNo || "" }, ${dataCustomer.postalCode || ""}`;
    this.setState({ dataCustomer, isLoading: false });
  };

  handleUpdateProfile = async () => {
    this.setState({ isLoading: true });

    if (this.state.editPassword) {
      const {
        oldPassword,
        newPassword,
        retypeNewPassword,
        validatePass,
      } = this.state;

      if (oldPassword == "" || newPassword == "") {
        Swal.fire({
          icon: "info",
          title: "Oppss..",
          text: "Please fill the password form",
        });
        this.setState({ isLoading: false });
        return;
      }
      if (newPassword != retypeNewPassword) {
        Swal.fire({
          icon: "info",
          title: "Oppss..",
          text: "Retype password is different from new password",
        });
        this.setState({ isLoading: false });
        return;
      }

      if (validatePass) {
        this.setState({ isLoading: false });
        return;
      }

      const payloadEditProfile = {
        oldPassword: oldPassword,
        newPassword,
        newPassword,
      };

      let resChangePassword = await this.props.dispatch(
        CustomerAction.updatePassword(payloadEditProfile)
      );
      if (resChangePassword.ResultCode != 200) {
        Swal.fire({
          icon: "error",
          title: "Oppss...",
          text: resChangePassword.message || "Failed to change password",
        });
        this.setState({ isLoading: false });
        return;
      }
    }

    let payload = {
      username: this.state.dataCustomer.username,
      birthDate: this.state.dataCustomer.birthDate,
      gender: this.state.dataCustomer.gender,
      address: this.state.dataCustomer.address,
    };

    this.props.fields && this.props.fields.forEach((field) => {
      if (this.state.dataCustomer[field.fieldName]) {
        payload[field.fieldName] = this.state.dataCustomer[field.fieldName];
      }
      if (field.type === "multipleField") {
        field.children.forEach((child) => {
          if (this.state.dataCustomer[child.fieldName]) {
            payload[child.fieldName] = this.state.dataCustomer[child.fieldName];
          }
        });
      }
    });

    if (this.state.editName) payload.newName = this.state.dataCustomer.name;
    if (this.state.editPhoneNumber)
      payload.newPhoneNumber = this.state.dataCustomer.phoneNumber;
    if (this.state.editEmail) payload.newEmail = this.state.dataCustomer.email;

    account.idToken.payload = this.state.dataCustomer;
    // console.log(payload)
    // return
    let response = await this.props.dispatch(
      CustomerAction.updateCustomerProfile(payload)
    );
    // console.log(response)
    if (response.ResultCode === 200) {
      await this.props.dispatch(
        AuthActions.setData({ Data: account }, CONSTANT.KEY_AUTH_LOGIN)
      );
      lsStore(`${config.prefix}_account`, encryptor.encrypt(account), true);
      let message = "Profile Updated";
      if (this.state.editPassword) {
        message = "Profile & Password Updated";
      }

      Swal.fire({
        icon: "success",
        timer: 2000,
        title: message,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      Swal.fire({
        icon: "error",
        timer: 1500,
        title: response.message,
        showConfirmButton: false,
      });
    }
    this.setState({ isLoading: false });
  };

  clearData = () => {
    this.setState({
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      editPassword: false,
      validatePass: false,
      textValidate: "",
    });
  };

  toggleEditPassword = () => {
    this.setState({
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      editPassword: !this.state.editPassword,
      validatePass: false,
      textValidate: "",
    });
  };

  render() {
    let {
      editPassword,
      showOldPassword,
      showNewPassword,
      showRePassword,
      errorName,
    } = this.state;

    let birthMonthOption = this.state.birthMonthOption;
    let mandatoryField = this.state.mandatoryField;
    let dataCustomer = this.state.dataCustomer;
    let loadingShow = this.state.loadingShow;
    let birthDate = dataCustomer && dataCustomer.birthDate;
    if (birthDate === "Invalid date") birthDate = new Date();

    let fieldBirthDate = null;
    let fieldGender = null;
    let fieldAddress = null;

    if (!loadingShow && dataCustomer && mandatoryField) {
      fieldBirthDate = mandatoryField.find((items) => {
        return items.fieldName === "birthDate" && items.show === true;
      });
      fieldGender = mandatoryField.find((items) => {
        return items.fieldName === "gender" && items.show === true;
      });
      fieldAddress = mandatoryField.find((items) => {
        return items.fieldName === "address" && items.show === true;
      });
    } else if (!loadingShow && !mandatoryField) {
      fieldBirthDate = { mandatory: true, format: "dd-MM-yyyy" };
      fieldGender = { mandatory: true };
      fieldAddress = { mandatory: true };
    }

    return (
      <div>
        <div
          className="modal fade"
          id="edit-profile-modal"
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
                  Profile
                </h5>
                <button
                  onClick={this.clearData}
                  type="button"
                  id="btn-close-edit-profile"
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
              {!loadingShow && dataCustomer && (
                <div className="modal-body" style={{ textAlign: "left" }}>
                  <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
                    <label>
                      Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="woocommerce-Input woocommerce-Input--text input-text"
                      style={{ borderRadius: 5 }}
                      value={dataCustomer.name}
                      onChange={(e) =>
                        this.handleChange("name", e.target.value)
                      }
                    />
                    {
                      errorName !== "" && 
                      <div className="text text-danger small">
                        <em>{errorName}</em>
                      </div>
                    }
                  </div>

                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="woocommerce-Input woocommerce-Input--text input-text"
                      style={{ borderRadius: 5 }}
                      value={dataCustomer.phoneNumber}
                      onChange={(e) =>
                        this.handleChange("phoneNumber", e.target.value)
                      }
                    />
                    {this.state.editPhoneNumber && !this.state.checkingPhone ? (
                      this.state.phoneUsed ? (
                        <div className="text text-danger small">
                          <em>Phone no. already used</em>
                        </div>
                      ) : (
                          <div className="text text-success small">
                            <em>Phone no. is available</em> <i className="fa fa-check"></i>
                          </div>
                        )
                    ) : null}
                    {this.state.checkingPhone && (
                      <div className="text small">
                        <em>Checking phone no. availability...</em>
                      </div>
                    )}
                  </div>

                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="woocommerce-Input woocommerce-Input--text input-text"
                      style={{ borderRadius: 5 }}
                      value={dataCustomer.email}
                      onChange={(e) =>
                        this.handleChange("email", e.target.value)
                      }
                    />
                    {this.state.editEmail && !this.state.checkingEmail ? (
                      this.state.emailUsed ? (
                        <div className="text text-danger small">
                          <em>Email already used</em>
                        </div>
                      ) : (
                          <div className="text text-success small">
                            <em>Email is available</em> <i className="fa fa-check"></i>
                          </div>
                        )
                    ) : null}
                    {this.state.checkingEmail && (
                      <div className="text small">
                        <em>Checking email availability...</em>
                      </div>
                    )}
                  </div>

                  <CustomFields
                    defaultValue={this.state.dataCustomer}
                    fields={this.props.fields && this.props.fields.filter((field) => field.show)}
                    handleChange={this.handleChange}
                    roundedBorder={false}
                  ></CustomFields>
                  
                  <br />
                  <p className="color" onClick={this.toggleEditPassword}>
                    {editPassword ? (
                      <b>Cancel Change Password </b>
                    ) : (
                        <b>Change Password </b>
                      )}
                    {editPassword ? (
                      <i className="fa fa-chevron-up" />
                    ) : (
                        <i className="fa fa-chevron-down" />
                      )}
                  </p>

                  {editPassword && (
                    <>
                      <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
                        <label>Old Password</label>
                        <div style={{ display: "flex" }}>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Provide your old password"
                            value={this.state.oldPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            onChange={(e) =>
                              this.setState({ oldPassword: e.target.value })
                            }
                            style={{
                              borderRadius: 5,
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          />
                          <div
                            style={{
                              width: 40,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "1px solid #cccccc",
                              borderTopRightRadius: 5,
                              borderBottomRightRadius: 5,
                            }}
                          >
                            <i
                              className={
                                showOldPassword
                                  ? "fa fa-eye"
                                  : "fa fa-eye-slash"
                              }
                              onClick={() => {
                                this.setState({
                                  showOldPassword: showOldPassword
                                    ? false
                                    : true,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                        style={{ marginTop: 10 }}
                      >
                        <label>New Password</label>
                        <div style={{ display: "flex" }}>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Your new password"
                            value={this.state.newPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            style={{
                              borderRadius: 5,
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            onChange={(e) => {
                              this.setState({ newPassword: e.target.value });
                              let pass = e.target.value;
                              if (
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(
                                  pass
                                ) &&
                                pass.length >= 8
                              ) {
                                this.setState({
                                  validatePass: false,
                                  textValidate: "",
                                });
                              } else {
                                this.setState({
                                  validatePass: true,
                                  textValidate:
                                    "Minimum password is 8 characters consisting of an uppercase, lowercase and number.",
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              width: 40,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "1px solid #cccccc",
                              borderTopRightRadius: 5,
                              borderBottomRightRadius: 5,
                            }}
                          >
                            <i
                              className={
                                showNewPassword
                                  ? "fa fa-eye"
                                  : "fa fa-eye-slash"
                              }
                              onClick={() => {
                                this.setState({
                                  showNewPassword: showNewPassword
                                    ? false
                                    : true,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {this.state.validatePass && (
                        <p style={{ color: "red", fontSize: 12 }}>
                          {this.state.textValidate}
                        </p>
                      )}

                      <div
                        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                        style={{ marginTop: 10 }}
                      >
                        <label>Re Type New Password</label>
                        <div style={{ display: "flex" }}>
                          <input
                            type={showRePassword ? "text" : "password"}
                            placeholder="Retype your new password"
                            value={this.state.retypeNewPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            onChange={(e) =>
                              this.setState({
                                retypeNewPassword: e.target.value,
                              })
                            }
                            style={{
                              borderRadius: 5,
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          />
                          <div
                            style={{
                              width: 40,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "1px solid #cccccc",
                              borderTopRightRadius: 5,
                              borderBottomRightRadius: 5,
                            }}
                          >
                            <i
                              className={
                                showRePassword ? "fa fa-eye" : "fa fa-eye-slash"
                              }
                              onClick={() => {
                                this.setState({
                                  showRePassword: showRePassword ? false : true,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                    </>
                  )}

                  <Button
                    className="button"
                    style={{
                      width: "100%",
                      marginTop: 10,
                      borderRadius: 5,
                      height: 50,
                    }}
                    onClick={() => this.handleUpdateProfile()}
                  >
                    Update
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
    account: state.auth.account.idToken.payload,
    fields: state.customer.fields,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditProfile);
