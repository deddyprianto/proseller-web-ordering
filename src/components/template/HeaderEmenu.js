import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LoginRegister from "../login-register";
// import BottomSheet from "react-animated-bottomsheet";
// import Sharing from '../sharing';
import { isEmptyObject } from "../../helpers/CheckEmpty";
import { OrderAction } from "../../redux/actions/OrderAction";
import config from "../../config";
import { InboxAction } from "../../redux/actions/InboxAction";
import { lsLoad } from "../../helpers/localStorage";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoginRegister: false,
      infoCompany: {},
      openSearch: false,
      isBottomSheetVisible: false,
      shareURL: "testURL",
      broadcast: [],
      broadcastLength: 0,
      broadcastUnreadLength: 0,
    };
  }

  componentDidMount = async () => {
    let { isLoggedIn } = this.props;
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    this.setState({ infoCompany: infoCompany || {} });
    if (isLoggedIn) {
      let response = await this.props.dispatch(
        InboxAction.getBroadcast({ take: 14, skip: 0 })
      );
      if (response.ResultCode === 200) this.setState(response.Data);
    }
  };

  getShareURL = async () => {
    const { basket } = this.props;

    if (account == undefined) {
      alert("Please log in first to continue");
      return;
    }

    if (isEmptyObject(basket)) {
      alert("Sorry, you have no cart to share.");
      return;
    } else {
      const response = await this.props.dispatch(
        OrderAction.shareURL(1, basket.outletID, "DINEIN")
      );
      if (response != false) {
        let URL = config.url_crm.replace("crm/api/", "emenu?order=");
        URL += response.data.accessToken;
        URL = encodeURI(URL);

        await this.setState({
          shareURL: `Hey friend, follow below link for sharing order ${URL}`,
        });
        await this.setState({ isBottomSheetVisible: true });
      }
    }
  };

  handleLogin = () => [document.getElementById("login-register-btn").click()];

  searchProduct = async (query) => {
    try {
      let productsBackup = encryptor.decrypt(
        JSON.parse(localStorage.getItem(`${config.prefix}_productsBackup`))
      );

      if (query == "") {
        await this.setState({ loading: false, loadingSearching: false });
        await this.setState({ products: productsBackup });
        await this.props.dispatch(OrderAction.setData(undefined, "SEARCH"));
        return;
      }

      let productsSearch = undefined;
      //  Client search
      for (let i = 0; i < productsBackup.length; i++) {
        let items = [];

        try {
          for (let j = 0; j < productsBackup[i].items.length; j++) {
            if (
              productsBackup[i].items[j].product.name
                .toLowerCase()
                .includes(query.toLowerCase())
            ) {
              items.push(productsBackup[i].items[j]);
            }
          }
        } catch (e) { }

        if (items.length != 0) {
          if (productsSearch == undefined) {
            productsSearch = [];
          }

          let data = JSON.stringify(productsBackup[i]);
          data = JSON.parse(data);
          data.items = items;
          productsSearch.push(data);
        }
      }

      if (productsSearch == undefined) productsSearch = [];
      await this.props.dispatch(OrderAction.setData(productsSearch, "SEARCH"));
      await this.setState({ products: productsSearch });
      await this.setState({ loading: false, loadingSearching: false });
    } catch (e) { }
  };

  render() {
    let { defaultOutlet, isLoggedIn } = this.props;
    let { infoCompany, openSearch, shareURL } = this.state;
    let broadcastUnreadLength =
      (this.props.broadcast && this.props.broadcast.broadcastUnreadLength) || 0;
    let showSearch = window.location.hash.split("#")[1] === "/";
    return (
      <div id="header-cwo">
        <LoginRegister />
        <span
          data-toggle="modal"
          data-target="#login-register-modal"
          id="login-register-btn"
        />
        <header
          id="masthead"
          className="site-header header-v4 lite-bg"
          style={{
            position: "fixed",
            width: "100%",
            padding: "30px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: 5,
              marginRight: 5,
              marginTop: -10,
              marginBottom: -15,
            }}
          >
            {!openSearch ? (
              <div style={{ display: "flex" }}>
                <Link to="/">
                  <a className="custom-logo-link" rel="home">
                    <img
                      src={infoCompany.imageURL || config.url_logo}
                      style={{ height: 30, objectFit: "contain" }}
                    />
                  </a>
                </Link>
                <div style={{ marginLeft: 5, fontWeight: "bold" }}>
                  <LocationOnIcon
                    className="color"
                    style={{ fontSize: 25, marginBottom: -5 }}
                  />
                  <span className="color" style={{ fontSize: 16 }}>
                    {defaultOutlet.name && defaultOutlet.name.substring(0, 8)}
                  </span>
                </div>
              </div>
            ) : (
                <input
                  onKeyUp={(e) => this.searchProduct(e.target.value)}
                  id="input-txt"
                  type="text"
                  style={{ height: 35, fontSize: 14, marginTop: -5 }}
                  autoFocus={true}
                  placeholder="Search your product here..."
                />
              )}
            <div>
              {openSearch && (
                <i
                  className="search_icon"
                  onClick={() => {
                    this.setState({ openSearch: false });
                    this.searchProduct("");
                  }}
                  style={{ fontSize: 23, cursor: "pointer" }}
                  className="fa fa-close color"
                ></i>
              )}
              {!openSearch && showSearch && (
                <i
                  onClick={() => {
                    this.setState({ openSearch: true });
                    setTimeout(() => {
                      document
                        .getElementById("input-txt")
                        .classList.add("active");
                    }, 100);
                  }}
                  style={{ fontSize: 23, cursor: "pointer" }}
                  className="fa fa-search color"
                ></i>
              )}
              {isLoggedIn && (
                <Link to="/inbox">
                  {broadcastUnreadLength > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        backgroundColor: "red",
                        fontSize: 8,
                        width: 20,
                        borderRadius: 20,
                        height: 20,
                        display: "flex",
                        color: "#FFF",
                        alignItems: "center",
                        justifyContent: "center",
                        top: 13,
                        right: 15,
                        border: "2px solid #FFF",
                        fontWeight: "bold",
                      }}
                    >
                      {broadcastUnreadLength}
                    </div>
                  )}
                  <i
                    style={{ fontSize: 23, cursor: "pointer", marginLeft: 20 }}
                    className="fa fa-envelope-o color"
                  ></i>
                </Link>
              )}
              {!isLoggedIn && (
                <i
                  onClick={() => this.handleLogin()}
                  style={{ fontSize: 23, cursor: "pointer", marginLeft: 20 }}
                  className="fa fa-sign-in color"
                ></i>
              )}
              {/* <BottomSheet
                isBottomSheetVisible={this.state.isBottomSheetVisible}
                closeBottomSheet={() =>
                  this.setState({ isBottomSheetVisible: false })
                }
              >
                <Sharing shareURL={shareURL} />
              </BottomSheet> */}
            </div>
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
    broadcast: state.broadcast.broadcast,
  };
};
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
