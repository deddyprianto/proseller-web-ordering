import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { CONSTANT } from "../../../helpers";

import config from "../../../config";
import { OutletAction } from "../../../redux/actions/OutletAction";
import { OrderAction } from "../../../redux/actions/OrderAction";
import { isEmptyObject } from "../../../helpers/CheckEmpty";
import LoginRegister from "../../login-register";

import LocationOnIcon from "@material-ui/icons/LocationOn";

import styles from "./styles.module.css";
import OrderingMode from "./OrderingMode";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoginRegister: false,
      infoCompany: {},
      outletsRefs: {},
      enableOrdering: true,
      logoCompany: config.url_logo,
      showOutletSelection: false,
      showOrderingMode: false,
      routeWithOutletSelect: [],
      routeWithOrderingMode: [],
    };
  }

  componentDidMount = () => {
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    if (
      this.state.routeWithOutletSelect.find(
        (route) => route === this.props.location.pathname
      )
    ) {
      this.setState({ showOutletSelection: true });
    } else {
      this.setState({ showOutletSelection: false });
    }
    if (
      this.state.routeWithOrderingMode.find(
        (route) => route === this.props.location.pathname
      )
    ) {
      this.setState({ showOrderingMode: true });
    } else {
      this.setState({ showOrderingMode: false });
    }
    this.setState({ infoCompany: infoCompany || {} });
    this.props.dispatch(OutletAction.fetchAllOutlet(true));
    if (this.props.orderingSetting) {
      if (this.props.orderingSetting.ShowOrderingModeModalFirst === true) {
        this.setState((prevState) => ({
          routeWithOrderingMode: [...prevState.routeWithOrderingMode, "/"],
        }));
      } else {
        this.setState((prevState) => ({
          routeWithOutletSelect: [...prevState.routeWithOutletSelect, "/"],
        }));
      }
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find((items) => {
        return items.settingKey === "EnableOrdering";
      });
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }

      let infoCompany = encryptor.decrypt(
        JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
      );
      let logoCompany = this.props.setting.find((items) => {
        return items.settingKey === "Logo";
      });
      if (logoCompany && logoCompany.settingValue) {
        this.setState({ logoCompany: logoCompany.settingValue });
      } else if (infoCompany && infoCompany.imageURL) {
        this.setState({ logoCompany: infoCompany.imageURL });
      }
    }

    if (this.props.outletSelection !== "MANUAL") {
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
      if (
        prevProps.defaultOutlet !== this.props.defaultOutlet &&
        prevProps.defaultOutlet.orderingStatus === "UNAVAILABLE" &&
        this.props.outlets &&
        this.props.outlets.length > 1
      ) {
        const firstAvailableOutlet = this.props.outlets.find(
          (outlet) => outlet.orderingStatus === "AVAILABLE"
        );
        console.log(firstAvailableOutlet);
        if (firstAvailableOutlet) {
          this.props.dispatch({
            type: CONSTANT.DEFAULT_OUTLET,
            data: firstAvailableOutlet,
          });
        }
      }
    }
    if (
      prevProps.location !== this.props.location ||
      prevState.routeWithOutletSelect !== this.state.routeWithOutletSelect ||
      prevState.routeWithOrderingMode !== this.state.routeWithOrderingMode
    ) {
      if (
        this.state.routeWithOutletSelect.find(
          (route) => route === this.props.location.pathname
        )
      ) {
        this.setState({ showOutletSelection: true });
      } else {
        this.setState({ showOutletSelection: false });
      }
      if (
        this.state.routeWithOrderingMode.find(
          (route) => route === this.props.location.pathname
        )
      ) {
        this.setState({ showOrderingMode: true });
      } else {
        this.setState({ showOrderingMode: false });
      }
    }

    if (prevProps.orderingSetting !== this.props.orderingSetting) {
      if (this.props.orderingSetting) {
        if (this.props.orderingSetting.ShowOrderingModeModalFirst === true) {
          this.setState((prevState) => ({
            routeWithOrderingMode: [...prevState.routeWithOrderingMode, "/"],
          }));
        } else {
          this.setState((prevState) => ({
            routeWithOutletSelect: [...prevState.routeWithOutletSelect, "/"],
          }));
        }
      }
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
    const lsKeyList = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes(`${config.prefix}_`)) {
        lsKeyList.push(key);
      }
    }
    lsKeyList.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }

  async handleOutletChange(e) {
    const outletId = e.target.value;
    const payloadMoveCart = {
      cart: this.props.basket,
      changeOutletID: "outlet::" + outletId,
    };
    await this.props.dispatch(OutletAction.fetchSingleOutlet({ id: outletId }));
    if (this.props.isLoggedIn) {
      const currentLocation = window.location.hash;
      if (currentLocation.includes("/basket")) {
        await this.props.dispatch(OrderAction.moveCart(payloadMoveCart));
        await localStorage.setItem(`${config.prefix}_isOutletChanged`, true);
        await localStorage.setItem(
          `${config.prefix}_outletChangedFromHeader`,
          outletId
        );
        await localStorage.removeItem(`${config.prefix}_order_action_date`);
        await localStorage.removeItem(`${config.prefix}_order_action_time`);
        await localStorage.removeItem(
          `${config.prefix}_order_action_time_slot`
        );
        await localStorage.removeItem(`${config.prefix}_deliveryProvider`);
        await setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } else {
      this.props.dispatch(
        OrderAction.buildCart({
          ...this.props.basket,
          outletID: outletId,
          outlet: this.props.defaultOutlet,
        })
      );
    }
  }

  displayOutletInfo = (outlets, defaultOutlet) => {
    if (this.props.outletSelection === "MANUAL") {
      if (isEmptyObject(this.props.defaultOutlet)) {
        return (
          <div className={styles.outlet}>
            <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
              Choose Outlets
            </h4>
          </div>
        );
      } else {
        return (
          <div className={styles.outlet}>
            <Link to="/outlets">
              <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
                {this.props.defaultOutlet.name}{" "}
                <i
                  style={{ marginLeft: 6, fontSize: 10 }}
                  className="fa fa-chevron-right"
                />
              </h4>
            </Link>
          </div>
        );
      }
    } else if (this.props.outletSelection === "DEFAULT") {
      return (
        <div className={styles.outlet}>
          <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
            {this.props.defaultOutlet.name}
          </h4>
        </div>
      );
    } else {
      return (
        <div className={styles.outlet}>
          <LocationOnIcon
            className="color"
            style={{ fontSize: 22, marginBottom: -5 }}
          />
          <span className="color" style={{ fontSize: 15 }}>
            <select
              className={`${styles.outletNameSelect} color`}
              onChange={(e) => this.handleOutletChange(e)}
              value={defaultOutlet.id}
            >
              {outlets &&
                outlets.map((outlet, key) => (
                  <option
                    key={key}
                    ref={this.state.outletsRefs[outlet.id]}
                    value={outlet.id}
                    // selected={outlet.id === defaultOutlet.id}
                  >
                    {outlet.name}
                  </option>
                ))}
            </select>
          </span>
        </div>
      );
    }
  };

  renderLabel = () => {
    try {
      const { setting } = this.props;
      if (setting && setting.length > 0) {
        const find = setting.find((item) => item.settingKey === "MenuLabel");
        if (find !== undefined) return find.settingValue;
      }
      return "Menu";
    } catch (e) {
      return "Menu";
    }
  };

  render() {
    let { isLoggedIn, basket, defaultOutlet } = this.props;
    let outlets =
      this.props.outlets &&
      this.props.outlets.filter(
        (outlet) => outlet.orderingStatus === "AVAILABLE"
      );
    let { infoCompany, enableOrdering, logoCompany } = this.state;

    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }
    return (
      <div id="header-cwo">
        {!isLoggedIn && <LoginRegister />}
        <header
          id="masthead"
          className="site-header header-v4 background-theme site-main"
          style={{
            position: "fixed",
            width: "100%",
            // borderBottom: "1px solid #DADADA",
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
                justifyContent: "space-around",
                flexDirection: "column",
              }}
            >
              <Link to="/">
                <img
                  alt="logo"
                  className={styles.logo}
                  src={infoCompany.imageURL || logoCompany}
                />
              </Link>
              {this.state.showOutletSelection &&
                this.displayOutletInfo(outlets, defaultOutlet)}
              {this.state.showOrderingMode && (
                <div className={styles.outlet}>
                  {this.props.orderingMode === "DINEIN" && (
                    <OrderingMode
                      mode="DINEIN"
                      alias={defaultOutlet.dineInName}
                      icon="fa-cutlery"
                    ></OrderingMode>
                  )}
                  {this.props.orderingMode === "TAKEAWAY" && (
                    <OrderingMode
                      mode="TAKEAWAY"
                      alias={defaultOutlet.takeAwayName}
                      icon="fa-shopping-basket"
                    ></OrderingMode>
                  )}
                  {this.props.orderingMode === "STOREPICKUP" && (
                    <OrderingMode
                      mode="STOREPICKUP"
                      alias={defaultOutlet.storePickUpName}
                      icon="fa-shopping-basket"
                    ></OrderingMode>
                  )}
                  {this.props.orderingMode === "STORECHECKOUT" && (
                    <OrderingMode
                      mode="STORECHECKOUT"
                      alias={defaultOutlet.storeCheckOutName}
                      icon="fa-shopping-basket"
                    ></OrderingMode>
                  )}
                  {this.props.orderingMode === "DELIVERY" && (
                    <OrderingMode
                      mode="DELIVERY"
                      alias={defaultOutlet.deliveryName}
                      icon="fa-car"
                    ></OrderingMode>
                  )}
                </div>
              )}
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
                <span className="screen-reader-text">Menu</span>
              </button>

              {enableOrdering && (
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
                        className="text-btn-theme"
                        style={{
                          position: "absolute",
                          backgroundColor: this.props.color.primary,
                          fontSize: 8,
                          width: 15,
                          borderRadius: 15,
                          height: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          top: 0,
                          right: 0,
                          fontWeight: "bold",
                        }}
                      >
                        {basketLength}
                      </div>
                    )}
                    <i className="fa fa-shopping-basket font-color-theme" />
                  </div>
                </Link>
              )}

              <div className="primary-navigation">
                <ul
                  id="menu-home-5-and-7-main-menu"
                  className="menu nav-menu"
                  aria-expanded="false"
                >
                  {enableOrdering && (
                    <li
                      className={this.activeRoute({ path: "/", name: "Home" })}
                      onClick={() => this.handelOnClick()}
                    >
                      <Link to="/">Menu</Link>
                    </li>
                  )}
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
                        style={{
                          width: 160,
                          padding: 0,
                          paddingLeft: 5,
                          paddingRight: 5,
                          height: 40,
                          borderRadius: 10,
                        }}
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
                        style={{
                          width: 160,
                          padding: 0,
                          paddingLeft: 5,
                          paddingRight: 5,
                          height: 40,
                          borderRadius: 10,
                          marginTop: 15,
                        }}
                      />
                    </li>
                  )}
                </ul>
              </div>
              <div className="handheld-navigation navigation-theme">
                <span className="phm-close">Close</span>
                <ul className="menu">
                  {enableOrdering && (
                    <li className="menu-item menu-hide">
                      <Link to="/">
                        <i className="fa fa-book" />
                        {this.renderLabel()}
                      </Link>
                    </li>
                  )}
                  {(isLoggedIn || !enableOrdering) && (
                    <li className="menu-item menu-hide">
                      <Link to="/profile">
                        <i className="fa fa-user" />
                        Profile
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item menu-hide">
                      <Link to="/history">
                        <i className="fa fa-history" />
                        History
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item menu-hide">
                      <Link to="/inbox">
                        <i className="fa fa-envelope-o" />
                        Inbox
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item menu-hide">
                      <Link to="/voucher">
                        <i className="fa fa-tags" />
                        Voucher
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li className="menu-item menu-hide">
                      <Link to="/setting">
                        <i className="fa fa-gear" />
                        Setting
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
                      className="menu-item menu-hide"
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
            {enableOrdering && (
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
                          className="text-btn-theme"
                          style={{
                            position: "absolute",
                            backgroundColor: this.props.color.primary,
                            fontSize: 8,
                            width: 15,
                            borderRadius: 15,
                            height: 15,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                            left: 25,
                            fontWeight: "bold",
                          }}
                        >
                          {basketLength}
                        </div>
                      )}
                      <i className="fa fa-shopping-basket font-color-theme" />
                    </div>
                  </li>
                </Link>
              </ul>
            )}
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
    defaultOutlet: state.outlet.defaultOutlet,
    color: state.theme.color,
    outlets: state.outlet.outlets,
    setting: state.order.setting,
    outletSelection: state.order.outletSelection,
    orderingMode: state.order.orderingMode,
    orderingSetting: state.order.orderingSetting,
  };
};
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
