import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { AuthActions } from "../../redux/actions/AuthAction";
import Shimmer from "react-shimmer-effect";
import config from "../../config";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { CONSTANT } from "../../helpers";
import { lsLoad, lsStore } from "../../helpers/localStorage";
import CustomFields from "./CustomFields";
import ModalEditAccount from "./ModalEditAccount";
import { Button } from "reactstrap";

let Swal = require("sweetalert2");
let encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
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
      errorName: "",

      defaultError: {},
      defaultEdit: {},
      titleEditAccount: { display: "Account", field: "phoneNumber" },
    };
  }

  componentDidMount = async () => {
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

  componentDidUpdate = async (prevProps) => {
    if (prevProps.fields !== this.props.fields) {
      let minimumAge = this.props.setting.find((items) => {
        return items.settingKey === "MinimumAge";
      });
      if (minimumAge) {
        minimumAge = minimumAge.settingValue;
      }

      let defaultError = {};
      let defaultEdit = {};
      this.props.fields &&
        this.props.fields.forEach((field) => {
          if (field.fieldName === "birthDate")
            field.minimumAge = minimumAge || 1;

          defaultError[field.fieldName] = "";
          defaultEdit[field.fieldName] = false;
          if (!this.state.dataCustomer[field.fieldName] && field.defaultValue) {
            this.setState((prevState) => ({
              dataCustomer: {
                ...prevState.dataCustomer,
                [field.fieldName]: field.defaultValue,
              },
            }));
          }
          if (field.children) {
            field.children.forEach((child) => {
              defaultError[child.fieldName] = "";
              defaultEdit[field.fieldName] = false;
            });
          }
        });

      this.setState({ defaultError });
    }
  };

  validationField = (field, value) => {
    if (field === "newName") field = "name";
    if (field === "newPhoneNumber") field = "phoneNumber";
    if (field === "newEmail") field = "email";

    let defaultError = this.state.defaultError;
    let defaultEdit = this.state.defaultEdit;
    let result = true;
    let mandatoryData = {};
    this.props.fields &&
      this.props.fields.find((items) => {
        if (items.children) {
          let check = items.children.find((child) => {
            return child.fieldName.toLowerCase() === field.toLowerCase();
          });
          if (check) mandatoryData = { ...check, mandatory: items.mandatory };
        } else {
          if (items.fieldName.toLowerCase() === field.toLowerCase())
            mandatoryData = items;
        }
        return items;
      });

    if (/^\s/.test(value)) value = value.trim();

    if (
      (value === "" ||
        value === "undefined, undefined" ||
        value === ", undefined" ||
        value === ", ") &&
      ((mandatoryData && mandatoryData.mandatory) || !mandatoryData)
    ) {
      defaultError[field] = `${
        (mandatoryData && mandatoryData.displayName) || field
      } is required`;
      result = false;
    } else defaultError[field] = "";

    if (field === "name" && result) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        defaultError[field] = `${mandatoryData.displayName} is alphabets only`;
        result = false;
      } else defaultError[field] = "";
    }

    if (field === "newPassword" || field === "oldPassword") {
      if (
        !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value) && value.length >= 8)
      ) {
        defaultError[
          field
        ] = `Minimum password is 8 characters consisting of an uppercase, lowercase and number`;
        result = false;
      } else defaultError[field] = "";
    }

    if (field === "retypeNewPassword") {
      if (this.state.newPassword === this.state.retypeNewPassword) {
        defaultError[field] = `Retype password is different from new password`;
        result = false;
      } else defaultError[field] = "";
    }

    defaultEdit[field] = true;
    this.setState({ defaultError, defaultEdit });
    return { status: result, displayName: mandatoryData.displayName };
  };

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    this.validationField(field, value);

    dataCustomer[field] = value;
    dataCustomer.address = `${dataCustomer.street || ""}, ${
      dataCustomer.unitNo || ""
    }, ${dataCustomer.postalCode || ""}`;
    this.setState({ dataCustomer, isLoading: false, touched: true });
  };

  handleUpdateProfile = async () => {
    this.setState({ isLoading: true });

    if (this.state.defaultEdit.password) {
      const { oldPassword, newPassword, retypeNewPassword } = this.state;

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

      const payloadEditProfile = {
        oldPassword,
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

    let payload = { username: this.state.dataCustomer.username };

    this.props.fields &&
      this.props.fields.forEach((field) => {
        payload[field.fieldName] =
          this.state.dataCustomer[field.fieldName] || "";
        if (field.children) {
          field.children.forEach((child) => {
            payload[child.fieldName] =
              this.state.dataCustomer[child.fieldName] || "";
          });
        }
      });

    if (this.state.defaultEdit.name)
      payload.newName = this.state.dataCustomer.name;
    if (this.state.defaultEdit.phoneNumber)
      payload.newPhoneNumber = this.state.dataCustomer.phoneNumber;
    if (this.state.defaultEdit.email)
      payload.newEmail = this.state.dataCustomer.email;

    let listName = "";
    for (const key in payload) {
      let check = this.validationField(key, payload[key]);
      if (!check.status) listName += check.displayName + ", ";
    }

    if (listName !== "") {
      listName = listName.substr(0, listName.length - 2);
      Swal.fire({
        icon: "warning",
        timer: 1500,
        title: `${listName} is required`,
        showConfirmButton: false,
      });
      return;
    }

    account.idToken.payload = this.state.dataCustomer;
    let response = await this.props.dispatch(
      CustomerAction.updateCustomerProfile(payload)
    );
    console.log(response);
    if (response.ResultCode === 200) {
      await this.props.dispatch(
        AuthActions.setData({ Data: account }, CONSTANT.KEY_AUTH_LOGIN)
      );
      lsStore(`${config.prefix}_account`, encryptor.encrypt(account), true);
      let message = "Profile Updated";
      if (this.state.editPassword) message = "Profile & Password Updated";

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
    let defaultEdit = this.state.defaultEdit;
    defaultEdit["password"] = false;

    this.setState({
      defaultEdit,
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      validatePass: false,
      textValidate: "",
    });
  };

  toggleEditPassword = () => {
    let defaultEdit = this.state.defaultEdit;
    defaultEdit["password"] = !defaultEdit["password"];

    this.setState({
      defaultEdit,
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      validatePass: false,
      textValidate: "",
    });
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

  viewPassword() {
    let {
      defaultError,
      showOldPassword,
      showNewPassword,
      showRePassword,
    } = this.state;

    return (
      <Row>
        <div
          style={{
            height: 1,
            backgroundColor: "#DCDCDC",
            margin: 5,
            marginTop: 10,
            marginBottom: 5,
          }}
        />
        <Col sm={6}>
          <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label style={{ fontSize: 14 }}>Old Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showOldPassword ? "text" : "password"}
                value={this.state.oldPassword}
                className="woocommerce-Input woocommerce-Input--text input-text"
                onChange={(e) => {
                  this.setState({ oldPassword: e.target.value });
                  this.validationField("oldPassword", e.target.value);
                }}
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
                  className={showOldPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                  onClick={() => {
                    this.setState({
                      showOldPassword: showOldPassword ? false : true,
                    });
                  }}
                />
              </div>
            </div>
            {defaultError && defaultError["oldPassword"] !== "" && (
              <div
                className="text text-warning-theme small"
                style={{ lineHeight: "15px", marginTop: 5 }}
              >
                {" "}
                <em>{defaultError["oldPassword"]}</em>{" "}
              </div>
            )}
          </div>
        </Col>

        <Col sm={6}>
          <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label style={{ fontSize: 14 }}>New Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={this.state.newPassword}
                className="woocommerce-Input woocommerce-Input--text input-text"
                style={{
                  borderRadius: 5,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onChange={(e) => {
                  this.setState({ newPassword: e.target.value });
                  this.validationField("newPassword", e.target.value);
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
                  className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                  onClick={() => {
                    this.setState({
                      showNewPassword: showNewPassword ? false : true,
                    });
                  }}
                />
              </div>
            </div>
            {defaultError && defaultError["newPassword"] !== "" && (
              <div
                className="text text-warning-theme small"
                style={{ lineHeight: "15px", marginTop: 5 }}
              >
                {" "}
                <em>{defaultError["newPassword"]}</em>{" "}
              </div>
            )}
          </div>
        </Col>

        <Col sm={6}>
          <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
            <label style={{ fontSize: 14 }}>Retype New Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showRePassword ? "text" : "password"}
                value={this.state.retypeNewPassword}
                className="woocommerce-Input woocommerce-Input--text input-text"
                onChange={(e) => {
                  this.setState({ retypeNewPassword: e.target.value });
                  this.validationField("retypeNewPassword", e.target.value);
                }}
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
                  className={showRePassword ? "fa fa-eye" : "fa fa-eye-slash"}
                  onClick={() => {
                    this.setState({
                      showRePassword: showRePassword ? false : true,
                    });
                  }}
                />
              </div>
            </div>
            {defaultError && defaultError["retypeNewPassword"] !== "" && (
              <div
                className="text text-warning-theme small"
                style={{ lineHeight: "15px", marginTop: 5 }}
              >
                {" "}
                <em>{defaultError["retypeNewPassword"]}</em>{" "}
              </div>
            )}
          </div>
        </Col>
      </Row>
    );
  }

  viewPage(fields) {
    let { defaultEdit } = this.state;
    let dataCustomer = this.state.dataCustomer;

    if (dataCustomer) {
      return (
        <div>
          <CustomFields
            defaultError={this.state.defaultError}
            defaultValue={this.state.dataCustomer}
            fields={fields && fields.filter((field) => field.show)}
            handleChange={this.handleChange}
            roundedBorder={false}
            titleEditAccount={(title) =>
              this.setState({ titleEditAccount: title })
            }
            touched={this.state.touched}
          />

          {this.checkLoginSetting() && (
            <div
              style={{
                border: "1px solid #CCC",
                borderRadius: 5,
                padding: 10,
                marginTop: 20,
              }}
            >
              <div
                className="color"
                onClick={() => this.toggleEditPassword()}
                style={{ textAlign: "right", cursor: "pointer" }}
              >
                <div
                  style={{
                    fontSize: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b>Change Password </b>
                  {defaultEdit.password ? (
                    <i className="fa fa-arrow-circle-o-up" />
                  ) : (
                    <i className="fa fa-arrow-circle-o-down" />
                  )}
                </div>
              </div>
              {defaultEdit.password && this.viewPassword()}
            </div>
          )}
        </div>
      );
    }
  }

  checkLoginSetting = () => {
    try {
      const { setting } = this.props;
      const find = setting.find(
        (item) =>
          item.settingKey === "EnableRegisterWithPassword" && item.settingValue
      );
      if (find === undefined) return false;
      return true;
    } catch (e) {
      return true;
    }
  };

  render() {
    let { loadingShow, titleEditAccount } = this.state;
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 120 : 140,
          marginBottom: 50,
          padding: 0,
        }}
      >
        <ModalEditAccount title={titleEditAccount} />
        <div id="primary" className="content-area">
          <div
            // className="stretch-full-width"
            style={{ display: "flex", justifyContent: "center" }}
          >
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
                left: 0,
                right: 0
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
            <main id="main" className="site-main" style={{ width: "100%" }}>
              {loadingShow && (
                <Row>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                </Row>
              )}
              {!loadingShow && (
                <div style={{ marginTop: -20 }}>
                  {this.viewPage(this.props.fields)}
                  <Button
                    className="button"
                    style={{
                      width: "100%",
                      marginTop: 20,
                      borderRadius: 5,
                      height: 50,
                    }}
                    onClick={() => this.handleUpdateProfile()}
                  >
                    <i className="fa fa-floppy-o" aria-hidden="true" /> Update
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    fields: state.customer.fields,
    setting: state.order.setting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
