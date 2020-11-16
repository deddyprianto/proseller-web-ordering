import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import config from "../../config";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataBasket: null,
    };
  }

  componentDidMount = async () => {
    setInterval(() => {
      let { basket } = this.props;
      let url = window.location.hash.split("#")[1];
      this.activeRoute({ path: url });
      this.setState({ dataBasket: basket });
    }, 2000);
  };

  activeRoute = (route) => {
    // current-menu-item menu-item
    let active = false;
    let check = 0;
    let url = window.location.hash.split("#")[1];

    for (const key in route.path.split("/")) {
      if (url.split("/")[key] === route.path.split("/")[key]) check += 1;
    }

    if (check === route.path.split("/").length) active = true;

    return active ? "color-active" : "color-nonactive";
  };

  removeDataPayment = (isCheck = false) => {
    let { isLoggedIn } = this.props;
    localStorage.removeItem(`${config.prefix}_dataSettle`);
    localStorage.removeItem(`${config.prefix}_selectedCard`);
    if (isCheck && !isLoggedIn) {
      document.getElementById("login-register-btn").click();
    }
  };

  render() {
    let { dataBasket } = this.state;
    let { isLoggedIn } = this.props;
    let basketLength = 0;
    if (dataBasket && dataBasket.details) {
      dataBasket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }
    
    return (
      <div>
        <div
          className="pizzaro-handheld-footer-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link
            onClick={() => this.removeDataPayment()}
            to="/"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              className={`fa fa-th ${this.activeRoute({
                path: "/",
                name: "Home",
              })}`}
              aria-hidden="true"
              style={{ fontSize: 22, margin: 15 }}
            ></i>
            <div
              className={`${this.activeRoute({ path: "/", name: "Home" })}`}
              style={{ marginTop: -22, fontSize: 12 }}
            >
              Menu
            </div>
          </Link>
          <Link
            onClick={() => this.removeDataPayment()}
            to="/basket"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              className={`fa fa-shopping-cart ${this.activeRoute({
                path: "/basket",
                name: "Basket",
              })}`}
              aria-hidden="true"
              style={{ fontSize: 22, margin: 15 }}
            ></i>
            <div
              className={`${this.activeRoute({
                path: "/basket",
                name: "Basket",
              })}`}
              style={{ marginTop: -22, fontSize: 12 }}
            >
              Cart
            </div>
            {basketLength > 0 && (
              <div
                className="text-btn-theme"
                style={{
                  backgroundColor: this.props.color.primary,
                  fontSize: 10,
                  position: "absolute",
                  marginTop: -18,
                  minWidth: 20,
                  borderRadius: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: -25,
                  border: `2px solid ${this.props.color.background}`,
                  paddingLeft: 4,
                  paddingRight: 4,
                  fontWeight: "bold"
                }}
              >
                {basketLength}
              </div>
            )}
          </Link>
          <Link
            onClick={() => this.removeDataPayment(true)}
            to="/payment"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              className={`fa fa-credit-card ${this.activeRoute({
                path: "/payment",
                name: "Payment",
              })}`}
              aria-hidden="true"
              style={{ fontSize: 22, margin: 15 }}
            ></i>
            <div
              className={`${this.activeRoute({
                path: "/payment",
                name: "Payment",
              })}`}
              style={{ marginTop: -22, fontSize: 12 }}
            >
              Payment
            </div>
          </Link>
          <Link
            onClick={() => this.removeDataPayment(true)}
            to="/history"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              className={`fa fa-history ${this.activeRoute({
                path: "/history",
                name: "History",
              })}`}
              aria-hidden="true"
              style={{ fontSize: 22, margin: 15 }}
            ></i>
            <div
              className={`${this.activeRoute({
                path: "/history",
                name: "History",
              })}`}
              style={{ marginTop: -22, fontSize: 12 }}
            >
              History
            </div>
          </Link>
          {isLoggedIn && (
            <Link
              onClick={() => this.removeDataPayment()}
              to="/profile"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i
                className={`fa fa-user ${this.activeRoute({
                  path: "/profile",
                  name: "Profile",
                })}`}
                aria-hidden="true"
                style={{ fontSize: 22, margin: 15 }}
              ></i>
              <div
                className={`${this.activeRoute({
                  path: "/profile",
                  name: "Profile",
                })}`}
                style={{ marginTop: -22, fontSize: 12 }}
              >
                Profile
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    account: state,
    basket: state.order.basket,
    color: state.theme.color,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
