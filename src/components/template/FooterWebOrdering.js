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
      enableOrdering: true,
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

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find((items) => {
        return items.settingKey === "EnableOrdering";
      });
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }
    }
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

    return active ? "black" : "white";
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
    let { isLoggedIn, broadcast, dataPendingLength } = this.props;
    let { enableOrdering } = this.state;
    return (
      <div className="hidden-lg hidden-md">
        <div
          className="pizzaro-handheld-footer-bar"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {this.props.navBarMenus.map((menu) => {
            if (!enableOrdering && menu.showOnOrderingEnabled) {
              return null;
            }
            if (!isLoggedIn && menu.loggedInOnly) {
              return null;
            }
            if (isLoggedIn && menu.loggedInOnly === false) return null;
            return (
              <Link
                onClick={() => this.removeDataPayment()}
                to={menu.text === 'Login' ? '#' : menu.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                {menu.path === "/inbox" &&
                  broadcast &&
                  broadcast.broadcastUnreadLength > 0 && (
                    <div
                      className="text-btn-theme"
                      style={{
                        backgroundColor: this.props.color.primary,
                        fontSize: 9,
                        position: "absolute",
                        marginTop: -28,
                        minWidth: 18,
                        borderRadius: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: -25,
                        border: `2px solid ${this.props.color.background}`,
                        paddingLeft: 4,
                        paddingRight: 4,
                        fontWeight: "bold",
                      }}
                    >
                      {broadcast.broadcastUnreadLength}
                    </div>
                  )}
                  {
                    menu.text === 'Login' ? 
                    <div 
                      data-toggle="modal"
                      data-target="#login-register-modal">
                    <i
                      className={`footbar-icon ${menu.icon} ${this.activeRoute({
                        path: menu.path,
                        name: menu.text,
                      })}`}
                      aria-hidden="true"
                      style={{
                        fontSize: 22,
                        margin: 15,
                        color: this.activeRoute({
                          path: menu.path,
                          name: menu.text,
                        }),
                      }}
                    ></i>
                    <div
                      className={`${this.activeRoute({
                        path: menu.path,
                        name: menu.text,
                      })}`}
                      style={{
                        marginTop: -17,
                        fontSize: 16,
                        marginBottom: 10,
                        color: "white",
                      }}
                    >
                      {menu.text}
                    </div>
                    </div>
                  :
                    <>
                      <i
                        className={`footbar-icon ${menu.icon} ${this.activeRoute({
                          path: menu.path,
                          name: menu.text,
                        })}`}
                        aria-hidden="true"
                        style={{
                          fontSize: 22,
                          margin: 15,
                          color: this.activeRoute({
                            path: menu.path,
                            name: menu.text,
                          }),
                        }}
                      ></i>
                      <div
                        className={`${this.activeRoute({
                          path: menu.path,
                          name: menu.text,
                        })}`}
                        style={{
                          marginTop: -17,
                          fontSize: 16,
                          marginBottom: 10,
                          color: "white",
                        }}
                      >
                        {menu.text}
                      </div>
                    </>
                  }
              </Link>
            );
          })}
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
    setting: state.order.setting,
    broadcast: state.broadcast.broadcast,
    dataPendingLength: state.order.dataPendingLength,
    color: state.theme.color,
    navBarMenus: state.theme.menu.navBar,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
