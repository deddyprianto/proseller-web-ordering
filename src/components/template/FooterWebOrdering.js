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
      enableOrdering: true,
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

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find(items => { return items.settingKey === "EnableOrdering" })
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }
    }
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

  renderLabel = () => {
    try{
      const { setting } = this.props;
      if (setting && setting.length > 0) {
        const find = setting.find(item => item.settingKey === 'MenuLabel');
        if (find !== undefined) return find.settingValue;
      }
      return 'Menu'
    } catch(e) {
      return 'Menu'
    }
  }

  render() {
    let { isLoggedIn, broadcast, dataPendingLength } = this.props
    let { enableOrdering } = this.state
    return (
      <div className="hidden-lg hidden-md">
        <div className="pizzaro-handheld-footer-bar " style={{ display: "flex", justifyContent: "space-between" }}>
          {
            enableOrdering &&
            <Link onClick={() => this.removeDataPayment()} to="/" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className={`fa fa-th ${this.activeRoute({ path: "/", name: "Home" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
              <div className={`${this.activeRoute({ path: "/", name: "Home" })}`} style={{ marginTop: -22, fontSize: 12 }}>{this.renderLabel()}</div>
            </Link>
          }
          <Link onClick={() => this.removeDataPayment(true)} to="/history" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {dataPendingLength > 0 &&
              <div
                className="text-btn-theme"
                style={{
                  backgroundColor: this.props.color.primary, fontSize: 9, position: "absolute",
                  marginTop: -18, minWidth: 18, borderRadius: 18, height: 18, display: "flex",
                  alignItems: "center", justifyContent: "center", marginRight: -25,
                  border: `2px solid ${this.props.color.background}`, paddingLeft: 4,
                  paddingRight: 4, fontWeight: "bold"
                }}
              >
                  {dataPendingLength}
              </div>
            }
            <i className={`fa fa-history ${this.activeRoute({ path: "/history", name: "History" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
            <div className={`${this.activeRoute({ path: "/history", name: "History" })}`} style={{ marginTop: -22, fontSize: 12 }}>History</div>
          </Link>
          {
            (isLoggedIn || !enableOrdering) &&
            <Link onClick={() => this.removeDataPayment()} to="/profile" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className={`fa fa-user ${this.activeRoute({ path: "/profile", name: "Profile" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
              <div className={`${this.activeRoute({ path: "/profile", name: "Profile" })}`} style={{ marginTop: -22, fontSize: 12 }}>Profile</div>
            </Link>
          }
          {
            (isLoggedIn || !enableOrdering) &&
            <Link onClick={() => this.removeDataPayment()} to="/rewards" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className={`fa fa-gift ${this.activeRoute({ path: "/rewards", name: "Rewards" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
              <div className={`${this.activeRoute({ path: "/rewards", name: "Rewards" })}`} style={{ marginTop: -22, fontSize: 12 }}>Rewards</div>
            </Link>
          }
          {
            (isLoggedIn || !enableOrdering) &&
            <Link onClick={() => this.removeDataPayment()} to="/inbox" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {broadcast && broadcast.broadcastUnreadLength > 0 &&
                <div
                  className="text-btn-theme"
                  style={{
                    backgroundColor: this.props.color.primary, fontSize: 9, position: "absolute",
                    marginTop: -18, minWidth: 18, borderRadius: 18, height: 18, display: "flex",
                    alignItems: "center", justifyContent: "center", marginRight: -25,
                    border: `2px solid ${this.props.color.background}`, paddingLeft: 4,
                    paddingRight: 4, fontWeight: "bold"
                  }}
                >
                    {broadcast.broadcastUnreadLength}
                </div>
              }
              <i className={`fa fa-envelope ${this.activeRoute({ path: "/inbox", name: "Inbox" })}`} aria-hidden="true" style={{ fontSize: 22, margin: 15 }}></i>
              <div className={`${this.activeRoute({ path: "/inbox", name: "Inbox" })}`} style={{ marginTop: -22, fontSize: 12 }}>Inbox</div>
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
    setting: state.order.setting,
    broadcast: state.broadcast.broadcast,
    dataPendingLength: state.order.dataPendingLength,
    color: state.theme.color,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
