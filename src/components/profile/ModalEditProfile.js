import React, { Component } from "react";
import { Button } from "reactstrap";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { AuthActions } from "../../redux/actions/AuthAction";
import { connect } from "react-redux";
import config from "../../config";
import { CONSTANT } from "../../helpers";

import { lsLoad, lsStore } from "../../helpers/localStorage";
import CustomFields from "./CustomFields";
import ModalEditAccount from "./ModalEditAccount";

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
    let dataCustomer = await this.props.dispatch( CustomerAction.getCustomerProfile() );
    if (dataCustomer.ResultCode === 200) {
      if (dataCustomer.Data[0].birthDate) this.setState({ isDisableBirthDate: true });
      this.setState({ dataCustomer: dataCustomer.Data[0] });
    }
    let mandatoryField = await this.props.dispatch( CustomerAction.mandatoryField() );
    if (mandatoryField.resultCode === 200) this.setState({ mandatoryField: mandatoryField.data.fields });
    this.setState({ loadingShow: false });
  };

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    if(field === "name") {
      if((/^[A-Za-z\s]+$/.test(value))) this.setState({ errorName: "" });
      else this.setState({ errorName: "Name is alphabets only" });
      this.setState({editName: true})
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

      if (oldPassword === "" || newPassword === "") {
        Swal.fire({
          icon: "info",
          title: "Oppss..",
          text: "Please fill the password form",
        });
        this.setState({ isLoading: false });
        return;
      }
      if (newPassword !== retypeNewPassword) {
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
        retypeNewPassword,
      };

      let resChangePassword = await this.props.dispatch(
        CustomerAction.updatePassword(payloadEditProfile)
      );
      if (resChangePassword.ResultCode !== 200) {
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
      birthDate: this.state.dataCustomer.birthDate || "",
      gender: this.state.dataCustomer.gender || "",
      address: this.state.dataCustomer.address || "",
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
    if (this.state.editPhoneNumber) payload.newPhoneNumber = this.state.dataCustomer.phoneNumber;
    if (this.state.editEmail) payload.newEmail = this.state.dataCustomer.email;

    account.idToken.payload = this.state.dataCustomer;
    // console.log(payload)
    // return
    let response = await this.props.dispatch( CustomerAction.updateCustomerProfile(payload) );
    console.log(response)
    if (response.ResultCode === 200) {
      await this.props.dispatch( AuthActions.setData({ Data: account }, CONSTANT.KEY_AUTH_LOGIN) );
      lsStore(`${config.prefix}_account`, encryptor.encrypt(account), true);
      let message = "Profile Updated";
      if (this.state.editPassword) message = "Profile & Password Updated";

      Swal.fire({ icon: "success", timer: 2000, title: message, showConfirmButton: false, });
      // setTimeout(() => { window.location.reload(); }, 2000);
    } else {
      Swal.fire({ icon: "error", timer: 1500, title: response.message, showConfirmButton: false, });
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
    let { editPassword, showOldPassword, showNewPassword, showRePassword,
      errorName, loadingShow, dataCustomer,
    } = this.state;

    return (
      <div>
        <ModalEditAccount />
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
                  
                  <div style={{border: "1px solid #CDCDCD", borderRadius: 5, padding: 5, paddingLeft: 10, marginTop: 10}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div>{dataCustomer.phoneNumber}</div>
                      <div data-toggle="modal" data-target="#edit-account-modal" >
                        <i className="fa fa-pencil-square-o" aria-hidden="true" />
                      </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div>{dataCustomer.email}</div>
                      <div data-toggle="modal" data-target="#edit-account-modal">
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                      </div>
                    </div>
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
