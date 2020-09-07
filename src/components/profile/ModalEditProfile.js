import React, { Component } from 'react';
import {
  Input,
  Button
} from 'reactstrap';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import { AuthActions } from '../../redux/actions/AuthAction';
import { connect } from "react-redux";
import moment from "moment";
import Loading from "../loading";
import { CONSTANT } from '../../helpers';

const Swal = require('sweetalert2')
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
let account = encryptor.decrypt(JSON.parse(localStorage.getItem('webordering_account')));

class ModalEditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelected: 2,
      dataCustomer: null,
      mandatoryField: null,
      loadingShow: true,
      isLoading: false,
      editFotoShow: false,
      birthMonthOption: [
        { value: '2000-01-01', lable: 'January' },
        { value: '2000-02-01', lable: 'February' },
        { value: '2000-03-01', lable: 'March' },
        { value: '2000-04-01', lable: 'April' },
        { value: '2000-05-01', lable: 'May' },
        { value: '2000-06-01', lable: 'June' },
        { value: '2000-07-01', lable: 'July' },
        { value: '2000-08-01', lable: 'August' },
        { value: '2000-09-01', lable: 'September' },
        { value: '2000-10-01', lable: 'October' },
        { value: '2000-11-01', lable: 'November' },
        { value: '2000-12-01', lable: 'December' },
      ],
      editPassword: false,
      newPassword: "",
      oldPassword: "",
      retypeNewPassword: "",
      validatePass: false,
      textValidate: "",
      showOldPassword: false,
      showNewPassword: false,
      showRePassword: false
    };
  }

  componentDidMount = async () => {
    this.getData()
  }

  getData = async () => {
    let dataCustomer = await this.props.dispatch(CustomerAction.getCustomerProfile());
    if (dataCustomer.ResultCode === 200) this.setState({ dataCustomer: dataCustomer.Data[0] })
    let mandatoryField = await this.props.dispatch(CustomerAction.mandatoryField());
    if (mandatoryField.resultCode === 200) this.setState({ mandatoryField: mandatoryField.data.fields })
    this.setState({ loadingShow: false })
  }

  handleChange = (field, value) => {
    let dataCustomer = this.state.dataCustomer;
    dataCustomer[field] = value;
    this.setState({ dataCustomer })
  }

  handleUpdateProfile = async () => {
    this.setState({ isLoading: true })

    if (this.state.editPassword) {
      const { oldPassword, newPassword, retypeNewPassword, validatePass } = this.state;

      if (oldPassword == "" || newPassword == "") {
        Swal.fire({
          icon: 'info',
          title: 'Oppss..',
          text: 'Please fill the password form'
        })
        this.setState({ isLoading: false });
        return;
      }
      if (newPassword != retypeNewPassword) {
        Swal.fire({
          icon: 'info',
          title: 'Oppss..',
          text: 'Retype password is different from new password'
        })
        this.setState({ isLoading: false });
        return;
      }

      if (validatePass) {
        this.setState({ isLoading: false });
        return;
      }

      const payloadEditProfile = {
        oldPassword: oldPassword,
        newPassword, newPassword
      }

      let resChangePassword = await this.props.dispatch(CustomerAction.updatePassword(payloadEditProfile));
      if (resChangePassword.ResultCode != 200) {
        Swal.fire({
          icon: 'error',
          title: 'Oppss...',
          text: resChangePassword.message || 'Failed to change password'
        })
        this.setState({ isLoading: false })
        return;
      }

    }

    let payload = {
      username: this.state.dataCustomer.username,
      newName: this.state.dataCustomer.name,
      birthDate: this.state.dataCustomer.birthDate,
      gender: this.state.dataCustomer.gender,
      address: this.state.dataCustomer.address
    }

    account.idToken.payload = this.state.dataCustomer
    // console.log(account)
    // return
    let response = await this.props.dispatch(CustomerAction.updateCustomerProfile(payload));
    // console.log(response)
    if (response.ResultCode === 200) {
      await this.props.dispatch(AuthActions.setData({ Data: account }, CONSTANT.KEY_AUTH_LOGIN));
      localStorage.setItem('webordering_account', JSON.stringify(encryptor.encrypt(account)));
      let message = 'Profile Updated'
      if (this.state.editPassword) {
        message = 'Profile & Password Updated'
      }

      Swal.fire({
        icon: 'success', timer: 2000,
        title: message, showConfirmButton: false,
      })
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      Swal.fire({
        icon: 'error', timer: 1500,
        title: response.message, showConfirmButton: false,
      })
    }
    this.setState({ isLoading: false })
  }

  clearData = () => {
    this.setState({
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      editPassword: false,
      validatePass: false,
      textValidate: ""
    })
  }

  toggleEditPassword = () => {
    this.setState({
      newPassword: "",
      retypeNewPassword: "",
      oldPassword: "",
      editPassword: !this.state.editPassword,
      validatePass: false,
      textValidate: ""
    })
  }

  render() {

    let { editPassword, showOldPassword, showNewPassword, showRePassword } = this.state;

    let birthMonthOption = this.state.birthMonthOption
    let mandatoryField = this.state.mandatoryField
    let dataCustomer = this.state.dataCustomer;
    let loadingShow = this.state.loadingShow
    let birthDate = dataCustomer && dataCustomer.birthDate
    if (birthDate === "Invalid date") birthDate = new Date()

    let fieldBirthDate = null;
    let fieldGender = null
    let fieldAddress = null

    if (!loadingShow && dataCustomer && mandatoryField) {
      fieldBirthDate = mandatoryField.find(items => { return items.fieldName === 'birthDate' && items.show === true })
      fieldGender = mandatoryField.find(items => { return items.fieldName === 'gender' && items.show === true })
      fieldAddress = mandatoryField.find(items => { return items.fieldName === 'address' && items.show === true })
    } else if (!loadingShow && !mandatoryField) {
      fieldBirthDate = { mandatory: true, format: "dd-MM-yyyy" }
      fieldGender = { mandatory: true }
      fieldAddress = { mandatory: true }
    }

    return (
      <div>
        <div className="modal fade" id="edit-profile-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Profile</h5>
                <button onClick={this.clearData} type="button" id="btn-close-edit-profile" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              {
                !loadingShow && dataCustomer &&
                <div className="modal-body" style={{ textAlign: "left" }}>

                  <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
                    <label>Name <span className="required">*</span></label>
                    <input type="text" className="woocommerce-Input woocommerce-Input--text input-text"
                      value={dataCustomer.name} onChange={(e) => this.handleChange('name', e.target.value)} />
                  </div>

                  {
                    fieldBirthDate &&
                    <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide" style={{ marginTop: 10 }}>
                      <label>Birthday <span className="required">{fieldBirthDate && fieldBirthDate.mandatory && "*"}</span></label>
                      {
                        fieldBirthDate.format === "MMM" ?
                          <Input type="select"
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            value={dataCustomer.birthDate} style={{ height: 40 }}
                            onChange={(e) => this.handleChange('birthDate', e.target.value)}>
                            <option value="">Select Birth Month</option>
                            {
                              birthMonthOption.map((items, key) => (
                                <option key={key} value={items.value}>{moment(items.value).format('MMM')}</option>
                              ))
                            }
                          </Input> :
                          <div className="customDatePickerWidth">
                            <div htmlFor="birthDate"
                              style={{ position: "absolute", backgroundColor: "#FFF", top: 146, left: 28, paddingLeft: 10, paddingRight: 50 }}>
                              {moment(birthDate).format('DD-MM-YYYY')}
                            </div >
                            <input type="date" id="birthDate" className="woocommerce-Input woocommerce-Input--text input-text"
                              value={birthDate} onChange={(e) => this.handleChange('birthDate', moment(e.target.value).format('YYYY-MM-DD'))} />
                          </div>
                      }
                    </div>
                  }

                  {
                    fieldGender &&
                    <div style={{ marginTop: 10 }}>
                      <label >Gender <span className="required">{fieldGender && fieldGender.mandatory && "*"}</span></label>
                      <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                          onClick={() => this.handleChange('gender', "male")}>
                          <div className={dataCustomer.gender === "male" ? "select-gender" : "un-select-gender"} style={{
                            height: 20, width: 20, borderRadius: 20,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <i className={dataCustomer.gender === "male" ? "fa fa-check-circle" : "fa fa-circle"}
                              style={{ fontSize: 16, color: "#FFF" }}></i>
                          </div>
                          <div style={{ marginLeft: 5 }}>Male</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", cursor: "pointer", marginLeft: 20 }}
                          onClick={() => this.handleChange('gender', "female")}>
                          <div className={dataCustomer.gender === "female" ? "select-gender" : "un-select-gender"} style={{
                            height: 20, width: 20, borderRadius: 20,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <i className={dataCustomer.gender === "female" ? "fa fa-check-circle" : "fa fa-circle"}
                              style={{ fontSize: 16, color: "#FFF" }}></i>
                          </div>
                          <div style={{ marginLeft: 5 }}>Female</div>
                        </div>
                      </div>
                    </div>
                  }

                  {
                    fieldAddress &&
                    <div style={{ marginTop: 10 }}>
                      <label htmlFor="address">Address <span className="required">{fieldAddress && fieldAddress.mandatory && "*"}</span></label>
                      <Input type="textarea" id="address" placeholder="Enter your address" rows="2"
                        value={dataCustomer.address} onChange={(e) => this.handleChange('address', e.target.value)} />
                    </div>

                  }

                  <br />
                  <p className="color" onClick={this.toggleEditPassword}>
                    {editPassword ? <b>Cancel Change Password </b> : <b>Change Password </b>}
                    {editPassword ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}
                  </p>

                  {
                    editPassword &&
                    <>
                      <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
                        <label>Old Password</label>
                        <div style={{ display: 'flex' }}>
                          <input type={showOldPassword ? "text" : "password"}
                            placeholder="Provide your old password" value={this.state.oldPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            onChange={(e) => this.setState({ oldPassword: e.target.value })}
                            style={{ borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          />
                          <div style={{
                            width: 40, display: "flex", justifyContent: "center", alignItems: "center",
                            border: "1px solid #cccccc", borderTopRightRadius: 5, borderBottomRightRadius: 5
                          }}>
                            <i className={showOldPassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => {
                              this.setState({ showOldPassword: showOldPassword ? false : true })
                            }} />
                          </div>
                        </div>
                      </div>

                      <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide" style={{ marginTop: 10 }}>
                        <label>New Password</label>
                        <div style={{ display: 'flex' }}>
                          <input type={showNewPassword ? "text" : "password"}
                            placeholder="Your new password" value={this.state.newPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            style={{ borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            onChange={(e) => {
                              this.setState({ newPassword: e.target.value })
                              let pass = e.target.value;
                              if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(pass) && pass.length >= 8) {
                                this.setState({ validatePass: false, textValidate: "" });
                              } else {
                                this.setState({ validatePass: true, textValidate: "Minimum password is 8 characters consisting of an uppercase, lowercase and number." });
                              }
                            }}
                          />
                          <div style={{
                            width: 40, display: "flex", justifyContent: "center", alignItems: "center",
                            border: "1px solid #cccccc", borderTopRightRadius: 5, borderBottomRightRadius: 5
                          }}>
                            <i className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => {
                              this.setState({ showNewPassword: showNewPassword ? false : true })
                            }} />
                          </div>
                        </div>
                      </div>
                      {this.state.validatePass && <p style={{ color: 'red', fontSize: 12 }}>{this.state.textValidate}</p>}

                      <div className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide" style={{ marginTop: 10 }}>
                        <label>Re Type New Password</label>
                        <div style={{ display: 'flex' }}>
                          <input type={showRePassword ? "text" : "password"}
                            placeholder="Retype your new password" value={this.state.retypeNewPassword}
                            className="woocommerce-Input woocommerce-Input--text input-text"
                            onChange={(e) => this.setState({ retypeNewPassword: e.target.value })}
                            style={{ borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          />
                          <div style={{
                            width: 40, display: "flex", justifyContent: "center", alignItems: "center",
                            border: "1px solid #cccccc", borderTopRightRadius: 5, borderBottomRightRadius: 5
                          }}>
                            <i className={showRePassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => {
                              this.setState({ showRePassword: showRePassword ? false : true })
                            }} />
                          </div>
                        </div>
                      </div>
                      <br />
                    </>
                  }

                  <Button className="button" style={{ width: "100%", marginTop: 10, borderRadius: 5, height: 50 }} onClick={() => this.handleUpdateProfile()}>Update</Button>
                </div>
              }
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
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditProfile);
