import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import config from '../../config';
import LoginRegister from "../login-register";

const Swal = require('sweetalert2');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoginRegister: false,
      infoCompany: {}
    };
  }

  componentDidMount = () => {
    let infoCompany = encryptor.decrypt(JSON.parse(localStorage.getItem('webordering_infoCompany')));
    this.setState({ infoCompany: infoCompany || {} })
  }

  handleNavigation = () => {
    document.getElementById('site-navigation').classList.toggle('toggled')
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

    return active ? "current-menu-item" : "menu-item";
  }

  handelOnClick = () => {
    this.setState({ isLoading: false })
  }

  handleLogout() {
    localStorage.clear();
    window.location.reload();
    // Swal.fire({
    //   title: "Do you want to Logout ?",
    //   text: "You are about to leave this session.",
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: "Yes"
    // }).then(async (result) => {
    //   if (result.value) {
    //     localStorage.clear();
    //     window.location.reload();
    //   }
    // })
  }

  render() {
    let { isLoggedIn, basket } = this.props
    let { infoCompany } = this.state
    let basketLength = 0
    if (basket && basket.details) {
      basket.details.forEach(cart => {
        basketLength += cart.quantity
      });
    }
    return (
      <div id="header-cwo">
        <LoginRegister />
        <header id="masthead" className="site-header header-v4 lite-bg" style={{ position: "fixed", width: "100%", boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)" }}>
          <div className="col-full" style={{ display: "flex", justifyContent: "center" }}>
            <div className="site-branding">
              <Link to="/">
                <a className="custom-logo-link" rel="home">
                  <img src={infoCompany.imageURL || config.url_logo} style={{ height: 30, objectFit: "contain", marginTop: -10, marginBottom: -10 }} />
                </a>
              </Link>
            </div>
            <nav id="site-navigation" className="main-navigation" aria-label="Primary Navigation">
              <button className="menu-toggle" aria-controls="site-navigation" aria-expanded="false"
                style={{ marginTop: -10, position: "fixed", left: 20 }} onClick={() => this.handleNavigation()}>
                <span className="close-icon" ><i className="po po-close-delete" /></span>
                <span className="menu-icon"><i className="po po-menu-icon" /></span>
                <span className=" screen-reader-text">Menu</span>
              </button>

              <Link to="/basket" className="menu-toggle" aria-controls="site-navigation" aria-expanded="false"
                style={{ marginTop: -18, position: "fixed", right: 20 }}>
                <div style={{
                  border: '1px solid gray', borderRadius: 40, height: 40, width: 40, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  {
                    basketLength > 0 &&
                    <div style={{
                      position: "absolute", backgroundColor: "red", fontSize: 8,
                      width: 15, borderRadius: 15, height: 15, display: "flex", color: "#FFF",
                      alignItems: "center", justifyContent: "center", top: 0, right: 0
                    }}>{basketLength}</div>
                  }
                  <i className="fa fa-shopping-basket" style={{ color: "gray" }} />
                </div>
              </Link>

              <div className="primary-navigation">
                <ul id="menu-home-5-and-7-main-menu" className="menu nav-menu" aria-expanded="false">
                  <li className={this.activeRoute({ path: "/", name: "Home" })} onClick={() => this.handelOnClick()}><Link to="/">Menu</Link></li>
                  {isLoggedIn && <li className={this.activeRoute({ path: "/profile", name: "Profile" })} onClick={() => this.handelOnClick()}><Link to="/profile">Profile</Link></li>}
                  {isLoggedIn && <li className={this.activeRoute({ path: "/history", name: "History" })} onClick={() => this.handelOnClick()}><Link to="/history">History</Link></li>}
                  {isLoggedIn && <li className={this.activeRoute({ path: "/inbox", name: "Inbox" })} onClick={() => this.handelOnClick()}><Link to="/inbox">Inbox</Link></li>}
                  {isLoggedIn && <li className={this.activeRoute({ path: "/voucher", name: "Voucher" })} onClick={() => this.handelOnClick()}><Link to="/voucher">Voucher</Link></li>}
                  {
                    isLoggedIn &&
                    <li data-toggle="modal" onClick={() => this.handleLogout()}>
                      <input type="submit" className="woocommerce-Button button" name="login" value="Log Out"
                        style={{ width: 160, paddingLeft: 5, paddingRight: 5 }} />
                    </li>
                  }
                  {
                    !isLoggedIn &&
                    <li data-toggle="modal" data-target="#login-register-modal" id="login-register-btn">
                      <input type="submit" className="woocommerce-Button button" name="login" value="Log In / Sign Up"
                        style={{ width: 160, paddingLeft: 5, paddingRight: 5 }} />
                    </li>
                  }
                </ul>
              </div>
              <div className="handheld-navigation profile-dashboard">
                <span className="phm-close">Close</span>
                <ul className="menu">
                  <li className="menu-item "><Link to="/"><i className="fa fa-book" />Menu</Link></li>
                  {isLoggedIn && <li className="menu-item "><Link to="/profile"><i className="fa fa-user" />Profile</Link></li>}
                  {isLoggedIn && <li className="menu-item "><Link to="/history"><i className="fa fa-history" />History</Link></li>}
                  {isLoggedIn && <li className="menu-item "><Link to="/inbox"><i className="fa fa-envelope-o" />Inbox</Link></li>}
                  {isLoggedIn && <li className="menu-item "><Link to="/voucher"><i className="fa fa-tags" />Voucher</Link></li>}
                  {
                    isLoggedIn &&
                    <li className="menu-item" onClick={() => this.handleLogout()}><Link to="/"><i className="fa fa-sign-out" />Log Out</Link></li>
                  }
                  {
                    !isLoggedIn &&
                    <li className="menu-item" onClick={() => this.handleNavigation()} data-toggle="modal" data-target="#login-register-modal"><Link to="/"><i className="fa fa-sign-in" />Log In / Sign Up</Link></li>
                  }
                </ul>
              </div>
            </nav>
            {/* #site-navigation */}
            <ul className="site-header-cart menu" style={{ textAlign: "right" }}>
              <Link to="/basket">
                <li className="mini-cart">
                  <div style={{
                    border: '1px solid gray', borderRadius: 40, height: 40, width: 40, display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "pointer"
                  }} data-toggle="modal" data-target="#basket-modal">
                    {
                      basketLength > 0 &&
                      <div style={{
                        position: "absolute", backgroundColor: "red", fontSize: 8,
                        width: 15, borderRadius: 15, height: 15, display: "flex", color: "#FFF",
                        alignItems: "center", justifyContent: "center", top: 0, left: 25
                      }}>{basketLength}</div>
                    }
                    <i className="fa fa-shopping-basket" style={{ color: "gray" }} />
                  </div>
                </li>
              </Link>
            </ul>
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
    basket: state.order.basket
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
