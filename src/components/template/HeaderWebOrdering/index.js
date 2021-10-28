import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { CONSTANT } from "../../../helpers";

import config from "../../../config";
import { OutletAction } from "../../../redux/actions/OutletAction";
import { OrderAction } from "../../../redux/actions/OrderAction";
import { isEmptyObject } from "../../../helpers/CheckEmpty";
import LoginRegister from "../../login-register";

import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import AppBar from "@material-ui/core/AppBar";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faBars } from "@fortawesome/free-solid-svg-icons";

import clsx from "clsx";

import styles from "./styles.module.css";
import OrderingMode from "./OrderingMode";
import { color } from "@material-ui/system";

const useStyles = (theme) => ({
  header: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  logo: {
    maxWidth: "9.5em",
    objectFit: "contain",
    zIndex: 1000,
    maxHeight: 68
  },
  logoWithBranch: {
    alignItems: "center",
  },
  outletStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    display: "inline-flex",
    align: "center",
  },
  iconBars: {
    "&:hover": {
      backgroundColor: "transparent",
    },

    position: "fixed",
    backgroundColor: "transparent",
    direction: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: -10
  },
});

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
    /* Re-fetch ordering setting if view is already  */
    if (this.props.setting || this.props.setting.length > 0) {
      this.props.dispatch(OrderAction.getSettingOrdering());
    }

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
          <div className={useStyles.outletStyle}>
            <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
              Choose Outlets
            </h4>
          </div>
        );
      } else {
        return (
          <div className={useStyles.outletStyle}>
            <Link to="/outlets">
              <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
                {this.props.defaultOutlet.name}{" "}
                <i style={{ marginLeft: 6, fontSize: 10 }} />
              </h4>
            </Link>
          </div>
        );
      }
    } else if (this.props.outletSelection === "DEFAULT") {
      return (
        <div className={useStyles.outletStyle}>
          <h4 className="color" style={{ fontSize: 12, marginTop: 10 }}>
            {this.props.defaultOutlet.name}
          </h4>
        </div>
      );
    } else {
      return (
        <div className={useStyles.outletStyle}>
          <LocationOnIcon
            className="color"
            style={{ fontSize: 22, marginBottom: -5 }}
          />
          <span className="color" style={{ fontSize: 12 }}>
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
    let { classes } = this.props;
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

    const displayOutletInfo = (outlets, defaultOutlet) => {
      if (this.props.outletSelection === "MANUAL") {
        if (isEmptyObject(this.props.defaultOutlet)) {
          return (
            <div className={classes.outletStyle}>
              <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
                Choose Outlets
              </h4>
            </div>
          );
        } else {
          return (
            <div className={classes.outletStyle}>
              <Link to="/outlets">
                <h4 className="color" style={{ fontSize: 15, marginTop: 10 }}>
                  {this.props.defaultOutlet.name}{" "}
                  <i style={{ marginLeft: 6, fontSize: 10 }} />
                </h4>
              </Link>
            </div>
          );
        }
      } else if (this.props.outletSelection === "DEFAULT") {
        return null;
      } else {
        return (
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <LocationOnIcon
                className="color"
                style={{ fontSize: 22, marginTop: 5 }}
              />
            </Grid>
            <Grid item className={classes.outletStyle} alignItems="center">
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
                      selected={outlet.id === defaultOutlet.id}
                    >
                      {outlet.name}
                    </option>
                  ))}
              </select>
            </Grid>
          </Grid>
        );
      }
    };
    
    return (
      <div>
        {!isLoggedIn && <LoginRegister />}
        <AppBar
          className={clsx(classes.header, "site-main")}
          style={{
            width: "-webkit-fill-available",
            marginBottom: "1rem",
            paddingTop: "1rem",
            boxShadow: "none",
            zIndex: 100,
            backgroundColor: this.props.color.background,
          }}
        >
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              display: "flex",
            }}
          >
            {/* logo & outlet */}
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              lg={3}
              order={{ lg: 1, xs: 2, sm: 2, md: 2 }}
              container
              spacing={0}
              direction="column"
              justifyContent="center"
            >
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems={{
                  xs: "center ",
                  sm: "center",
                  md: "center",
                  lg: "flex-start",
                }}
              >
                <Grid item>
                  <Link to="/">
                    <img
                      alt="logo"
                      className={classes.logo}
                      src={infoCompany.imageURL || logoCompany}
                    />
                  </Link>
                </Grid>
                <Grid item>
                  {this.state.showOutletSelection && defaultOutlet.name !== "-"
                    ? displayOutletInfo(outlets, defaultOutlet)
                    : null}
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
                </Grid>
              </Grid>
            </Grid>
            {/* nav */}
            <Grid
              item
              xs={3}
              sm={3}
              md={2}
              lg={7}
              order={{ xs: 1, sm: 1, md: 1 }}
              container
              spacing={0}
              direction="column"
              alignItems={{
                xs: "flex-start ",
                sm: "center",
                md: "center",
                lg: "flex-start",
              }}
              justifyContent="center"
            >
              <Box
                id="site-navigation"
                component="nav"
                className="main-navigation"
                aria-label="Primary Navigation"
                style={{
                  direction: "row",
                  alignItems: "left",
                }}
              >
                <Box
                  display={{
                    xs: "block",
                    sm: "block",
                    md: "block",
                    lg: "none",
                    xl: "none",
                  }}
                  component="IconButton"
                  aria-label="menu-bars"
                  className={clsx("menu-toggle", classes.iconBars)}
                  aria-controls="site-navigation"
                  aria-expanded="false"
                  onClick={() => this.handleNavigation()}
                  color={this.props.color.font}
                >
                  <FontAwesomeIcon icon={faBars} size="25x" />
                </Box>

                <div
                  className="primary-navigation"
                  style={{
                    direction: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    marginBottom: 0,
                  }}
                >
                  <ul
                    id="menu-home-5-and-7-main-menu"
                    className="menu nav-menu"
                    aria-expanded="false"
                    style={{
                      paddingTop: "1rem",
                    }}
                  >
                    {enableOrdering && (
                      <li
                        className={this.activeRoute({
                          path: "/",
                          name: "Home",
                        })}
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
                      <li
                        data-toggle="modal"
                        onClick={() => this.handleLogout()}
                      >
                        <a style={{ color: "red" }} href="#">
                          Logout
                        </a>
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
                    {isLoggedIn ? (
                      <>
                        <li className="menu-item menu-hide">
                          <Link to="/history">
                            <i className="fa fa-history" />
                            History
                          </Link>
                        </li>
                        <li className="menu-item menu-hide">
                          <Link to="/inbox">
                            <i className="fa fa-envelope-o" />
                            Inbox
                          </Link>
                        </li>
                        <li className="menu-item menu-hide">
                          <Link to="/voucher">
                            <i className="fa fa-tags" />
                            Voucher
                          </Link>
                        </li>
                        <li className="menu-item menu-hide">
                          <Link to="/setting">
                            <i className="fa fa-gear" />
                            Setting
                          </Link>
                        </li>
                        <li
                          className="menu-item"
                          onClick={() => this.handleLogout()}
                        >
                          <Link to="/">
                            <i className="fa fa-sign-out" />
                            Log Out
                          </Link>
                        </li>
                      </>
                    ) : null}
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
              </Box>
            </Grid>
            {/* cart */}
            <Grid
              item
              xs={3}
              sm={3}
              md={2}
              lg={2}
              order={{ xs: 3, sm: 3, md: 3 }}
              container
              spacing={0}
              direction="column"
              alignItems={{
                xs: "flex-end ",
                sm: "center",
                md: "center",
                lg: "flex-end",
              }}
              justifyContent="center"
            >
              {enableOrdering && (
                <Link id="cart-icon" to="/basket">
                  <div
                    style={{
                      border: `1px solid ${this.props.color.font}`,
                      borderRadius: 40,
                      height: 40,
                      width: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: this.props.color.font,
                    }}
                    data-toggle="modal"
                    data-target="#basket-modal"
                  >
                    <Badge color="info" badgeContent={basketLength}>
                      <FontAwesomeIcon icon={faShoppingBasket} />
                    </Badge>
                  </div>
                </Link>
              )}
            </Grid>
          </Grid>
        </AppBar>
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
export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
);
