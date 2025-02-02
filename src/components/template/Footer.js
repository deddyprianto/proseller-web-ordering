import React, { Component } from "react";
import { Link } from 'react-router-dom';
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
      let { basket } = this.props
      let url = window.location.hash.split("#")[1]
      this.activeRoute({ path: url })
      this.setState({ dataBasket: basket })
    }, 2000);
  }

  activeRoute = (route) => {
    // current-menu-item menu-item
    let active = false
    let check = 0
    let url = window.location.hash.split("#")[1]

    for (const key in route.path.split("/")) {
      if (url.split("/")[key] === route.path.split("/")[key]) check += 1
    }

    if (check === route.path.split("/").length) active = true

    return active ? "color-active" : "color-nonactive";
  }

  removeDataPayment = (isCheck = false) => {
    let { isLoggedIn } = this.props
    localStorage.removeItem(`${config.prefix}_dataSettle`);
    localStorage.removeItem(`${config.prefix}_selectedCard`);
    if (isCheck && !isLoggedIn) {
      document.getElementById('login-register-btn').click()
    }
  }
  render() {
    let { isLoggedIn } = this.props
    return (
      <div>
        <div className="pizzaro-handheld-footer-bar background-theme" style={{ display: "flex", justifyContent: "space-between" }}>
          <Link onClick={() => this.removeDataPayment()} to="/" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <i className={`fa fa-th ${this.activeRoute({ path: "/", name: "Home" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
            <div className={`${this.activeRoute({ path: "/", name: "Home" })}`} style={{ marginTop: -22, fontSize: 12 }}>Menu</div>
          </Link>
          <Link onClick={() => this.removeDataPayment(true)} to="/history" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <i className={`fa fa-history ${this.activeRoute({ path: "/history", name: "History" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
            <div className={`${this.activeRoute({ path: "/history", name: "History" })}`} style={{ marginTop: -22, fontSize: 12 }}>History</div>
          </Link>
          {
            isLoggedIn &&
            <Link onClick={() => this.removeDataPayment()} to="/profile" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className={`fa fa-user ${this.activeRoute({ path: "/profile", name: "Profile" })}`} aria-hidden=" true" style={{ fontSize: 22, margin: 15 }}></i>
              <div className={`${this.activeRoute({ path: "/profile", name: "Profile" })}`} style={{ marginTop: -22, fontSize: 12 }}>Profile</div>
            </Link>
          }
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    account: state,
    basket: state.order.basket,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
