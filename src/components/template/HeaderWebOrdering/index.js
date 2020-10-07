import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import config from "../../../config";
import { OutletAction } from "../../../redux/actions/OutletAction";
import { OrderAction } from "../../../redux/actions/OrderAction";

import LoginRegister from "../../login-register";

import LocationOnIcon from "@material-ui/icons/LocationOn";

import styles from "./styles.module.css";

const Swal = require("sweetalert2");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoginRegister: false,
      infoCompany: {},
      outletsRefs: {},
      enableOrdering: true
    };
  }

  componentDidMount = () => {
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    this.setState({ infoCompany: infoCompany || {} });
    this.props.dispatch(OutletAction.fetchAllOutlet());
  };

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find(items => { return items.settingKey === "EnableOrdering" })
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }
    }

    if (prevProps.outlets !== this.props.outlets) {
      this.props.outlets.forEach((outlet) => {
        this.setState((prevState) => ({
          outletsRefs: {
            ...prevState.outletsRefs,
            [outlet.id]: React.createRef(),
          },
        }));
      });
    }
  };

  handleNavigation = () => {
    document.getElementById("site-navigation").classList.toggle("toggled");
  };

  activeRoute = (route) => {
    let active = false;
    let check = 0;
    let url = window.location.hash.split("#")[1];

    for (const key in route.path.split("/")) {
      if (url.split("/")[key] === route.path.split("/")[key]) check += 1;
    }

    if (check === route.path.split("/").length) active = true;

    return active ? "current-menu-item" : "menu-item";
  };

  handelOnClick = () => {
    this.setState({ isLoading: false });
  };

  handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  handleOutletChange(e) {
    const outletId = e.target.value;
    Swal.fire({
      title: "Change Outlet ?",
      text: "Cart from previous outlet will be removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result && result.value) {
        this.props.dispatch(OutletAction.fetchSingleOutlet({ id: outletId }));
        localStorage.removeItem(`${config.prefix}_offlineCart`);
        this.props.dispatch(OrderAction.deleteCart(this.props.isLoggedIn));
      }
    });
  }

  render() {
    let { isLoggedIn, basket, defaultOutlet, outlets } = this.props;
    let { infoCompany, enableOrdering } = this.state;

    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }
    return (
      <div id="header-cwo">
        <LoginRegister />
        <header
          id="masthead"
          className="site-header header-v4 lite-bg"
          style={{
            position: "fixed",
            width: "100%",
            borderBottom: "1px solid #DADADA",
            height: "8rem",
          }}
        >
          <div
            className="col-full"
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link to="/">
                <img
                  alt="logo"
                  className={styles.logo}
                  src={infoCompany.imageURL || config.url_logo}
                />
              </Link>
              <div
                style={{
                  marginLeft: 5,
                  fontWeight: "bold",
                  position: "absolute",
                  top: 20,
                  left: -5,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <LocationOnIcon
                  className="color"
                  style={{ fontSize: 22, marginBottom: -5 }}
                />
                <span className="color" style={{ fontSize: 15 }}>
                  {
                    outlets && outlets.length > 1 ?
                      <select
                        className={styles.outletNameSelect}
                        onChange={(e) => this.handleOutletChange(e)}
                        value={defaultOutlet.id}
                      >
                        {outlets &&
                          outlets.map((outlet) => (
                            <option
                              ref={this.state.outletsRefs[outlet.id]}
                              value={outlet.id}
                              selected={outlet.id === defaultOutlet.id}
                            >
                              {outlet.name}
                            </option>
                          ))}
                      </select> :
                      outlets[0] && outlets[0].name
                  }
                </span>
              </div>
            </div>
            <nav
              id="site-navigation"
              className="main-navigation"
              aria-label="Primary Navigation"
            >
              <button
                className="menu-toggle"
                aria-controls="site-navigation"
                aria-expanded="false"
                style={{ marginTop: -10, position: "fixed", left: 20 }}
                onClick={() => this.handleNavigation()}
              >
                <span className="close-icon">
                  <i className="po po-close-delete" />
                </span>
                <span className="menu-icon">
                  <i className="po po-menu-icon" />
                </span>
                <span className=" screen-reader-text">Menu</span>
              </button>

              {
                enableOrdering &&
                <Link
                  to="/basket"
                  className="menu-toggle"
                  aria-controls="site-navigation"
                  aria-expanded="false"
                  style={{ marginTop: -18, position: "fixed", right: 20 }}
                >
                  <div
                    style={{
                      border: "1px solid gray",
                      borderRadius: 40,
                      height: 40,
                      width: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {basketLength > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          backgroundColor: this.props.color.primary,
                          fontSize: 8,
                          width: 15,
                          borderRadius: 15,
                          height: 15,
                          display: "flex",
                          color: "#FFF",
                          alignItems: "center",
                          justifyContent: "center",
                          top: 0,
                          right: 0,
                        }}
                      >
                        {basketLength}
                      </div>
                    )}
                    <i
                      className="fa fa-shopping-basket"
                      style={{ color: "gray" }}
                    />
                  </div>
                </Link>
              }

              <div className="primary-navigation">
                <ul
                  id="menu-home-5-and-7-main-menu"
                  className="menu nav-menu"
                  aria-expanded="false"
                >
                  {
                    enableOrdering &&
                    <li
                      className={this.activeRoute({ path: "/", name: "Home" })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/">Menu</Link>
                    </li>
                  }
                  {(isLoggedIn || !enableOrdering) && (
                    <li
                      className={this.activeRoute({
                        path: "/profile",
                        name: "Profile",
                      })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/profile">Profile</Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li
                      className={this.activeRoute({
                        path: "/history",
                        name: "History",
                      })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/history">History</Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li
                      className={this.activeRoute({
                        path: "/inbox",
                        name: "Inbox",
                      })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/inbox">Inbox</Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li
                      className={this.activeRoute({
                        path: "/voucher",
                        name: "Voucher",
                      })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/voucher">Voucher</Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li data-toggle="modal" onClick={() => this.handleLogout()}>
                      <input
                        type="submit"
                        className="woocommerce-Button button"
                        name="login"
                        value="Log Out"
                        style={{ width: 160, paddingLeft: 5, paddingRight: 5 }}
                      />
                    </li>
                  )}
                  {!isLoggedIn && (
                    <li
                      data-toggle="modal"
                      data-target="#login-register-modal"
                      id="login-register-btn"
                    >
                      <input
                        type="submit"
                        className="woocommerce-Button button"
                        name="login"
                        value="Log In / Sign Up"
                        style={{ width: 160, paddingLeft: 5, paddingRight: 5 }}
                      />
                    </li>
                  )}
                </ul>
              </div>
              <div className="handheld-navigation profile-dashboard">
                <span className="phm-close">Close</span>
                <ul className="menu">
                  {
                    enableOrdering &&
                    <li className="menu-item ">
                      <Link to="/">
                        <i className="fa fa-book" />
                        Menu
                      </Link>
                    </li>
                  }
                  {(isLoggedIn || !enableOrdering) && (
                    <li className="menu-item ">
                      <Link to="/profile">
                        <i className="fa fa-user" />
                        Profile
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item ">
                      <Link to="/history">
                        <i className="fa fa-history" />
                        History
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item ">
                      <Link to="/inbox">
                        <i className="fa fa-envelope-o" />
                        Inbox
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item ">
                      <Link to="/voucher">
                        <i className="fa fa-tags" />
                        Voucher
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li
                      className="menu-item"
                      onClick={() => this.handleLogout()}
                    >
                      <Link to="/">
                        <i className="fa fa-sign-out" />
                        Log Out
                      </Link>
                    </li>
                  )}
                  {!isLoggedIn && (
                    <li
                      className="menu-item"
                      onClick={() => this.handleNavigation()}
                      data-toggle="modal"
                      data-target="#login-register-modal"
                    >
                      <Link to="/">
                        <i className="fa fa-sign-in" />
                        Log In / Sign Up
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
            {/* #site-navigation */}
            {
              enableOrdering &&
              <ul
                className="site-header-cart menu"
                style={{ textAlign: "right" }}
              >
                <Link to="/basket">
                  <li className="mini-cart">
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 40,
                        height: 40,
                        width: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      data-toggle="modal"
                      data-target="#basket-modal"
                    >
                      {basketLength > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            backgroundColor: this.props.color.primary,
                            fontSize: 8,
                            width: 15,
                            borderRadius: 15,
                            height: 15,
                            display: "flex",
                            color: "#FFF",
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                            left: 25,
                          }}
                        >
                          {basketLength}
                        </div>
                      )}
                      <i
                        className="fa fa-shopping-basket"
                        style={{ color: "gray" }}
                      />
                    </div>
                  </li>
                </Link>
              </ul>
            }
          </div>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    account: state,
    lang: state.language.lang,
    basket: state.order.basket,
    defaultOutlet: config.getValidation(state.outlet.defaultOutlet),
    color: state.theme.color,
    outlets: state.outlet.outlets,
    setting: state.order.setting,
  };
};
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
