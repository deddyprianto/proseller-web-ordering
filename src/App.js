import React, { useEffect } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import { AuthActions } from "./redux/actions/AuthAction";
import { Redirect, Switch, Route, HashRouter } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { OutletAction } from "./redux/actions/OutletAction";
import { MasterdataAction } from "./redux/actions/MaterdataAction";
import { OrderAction } from "./redux/actions/OrderAction";

import locale_en from "react-intl/locale-data/en";
import locale_id from "react-intl/locale-data/id";

import messages_id from "./languages/id.json";
import messages_en from "./languages/en.json";

import config from "./config";

import { lsLoad } from "./helpers/localStorage";

import useStyles from "./styles/theme";

const Layout = loadable(() => import("./components/template/Layout"));
// import Layout from "./components/template/Layout";
const base64 = require("base-64");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

const messages = {
  ID: messages_id,
  EN: messages_en,
};

addLocaleData([...locale_id, ...locale_en]);

// class App extends Component {
//   componentDidMount = async () => {
//     if (!this.props.isLoggedIn || !account)
//       localStorage.removeItem(`${config.prefix}_account`);
//     if (account) this.props.dispatch(AuthActions.refreshToken());

//     let param = this.getUrlParameters();
//     if (param && param["input"]) {
//       param = this.getUrlParameters(base64.decode(decodeURI(param["input"])));
//       localStorage.setItem(
//         `${config.prefix}_scanTable`,
//         JSON.stringify(encryptor.encrypt(param))
//       );
//       if (param.orderingMode)
//         localStorage.setItem(
//           `${config.prefix}_ordering_mode`,
//           param.orderingMode
//         );

//       let defaultOutlet = await this.props.dispatch(
//         MasterdataAction.getOutletByID(param["outlet"].split("::")[1], true)
//       );
//       localStorage.setItem(
//         `${config.prefix}_defaultOutlet`,
//         JSON.stringify(encryptor.encrypt(defaultOutlet))
//       );
//       await this.props.dispatch(OutletAction.fetchDefaultOutlet(defaultOutlet));
//     } else {
//       localStorage.removeItem(`${config.prefix}_scanTable`);
//     }

//     let url = window.location.hash.split("#")[1];
//     if (url !== "/") {
//       if (!param) {
//         let defaultOutlet = await this.props.dispatch(
//           OutletAction.fetchDefaultOutlet()
//         );
//         defaultOutlet = await this.props.dispatch(
//           MasterdataAction.getOutletByID(
//             defaultOutlet.sortKey.split("::")[1],
//             true
//           )
//         );
//         localStorage.setItem(
//           `${config.prefix}_defaultOutlet`,
//           JSON.stringify(encryptor.encrypt(defaultOutlet))
//         );
//         await this.props.dispatch(
//           OutletAction.fetchDefaultOutlet(defaultOutlet)
//         );
//       }

//       await this.props.dispatch(OrderAction.getCart());
//     }

//     // try {
//     //   document.getElementById("color-theme").href = color;
//     // } catch (error) {}
//   };

//   getUrlParameters = (pageParamString = null) => {
//     if (!pageParamString) pageParamString = window.location.href.split("?")[1];
//     if (pageParamString) {
//       var paramsArray = pageParamString.split("&");
//       var paramsHash = {};

//       for (var i = 0; i < paramsArray.length; i++) {
//         var singleParam = paramsArray[i].split("=");
//         paramsHash[singleParam[0]] = singleParam[1];
//       }
//       return paramsHash;
//     }
//   };

//   render() {
//     const { lang } = this.props;
//     useStyles(this.props);

//     return (
//       <IntlProvider locale={lang} messages={messages[lang]}>
//         <HashRouter>
//           <Switch>
//             <Route component={Layout} />
//             <Redirect from="*" to="/" />
//           </Switch>
//         </HashRouter>
//       </IntlProvider>
//     );
//   }
// }

const App = (props) => {
  const { lang } = props;
  useStyles({ theme: { color: "" } });

  const getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split("?")[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split("&");
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split("=");
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  };

  const checkUser = async () => {
    if (!props.isLoggedIn || !account)
      localStorage.removeItem(`${config.prefix}_account`);
    if (account) props.dispatch(AuthActions.refreshToken());

    let param = getUrlParameters();
    if (param && param["input"]) {
      param = getUrlParameters(base64.decode(decodeURI(param["input"])));
      localStorage.setItem(
        `${config.prefix}_scanTable`,
        JSON.stringify(encryptor.encrypt(param))
      );
      if (param.orderingMode)
        localStorage.setItem(
          `${config.prefix}_ordering_mode`,
          param.orderingMode
        );

      let defaultOutlet = await props.dispatch(
        MasterdataAction.getOutletByID(param["outlet"].split("::")[1], true)
      );
      localStorage.setItem(
        `${config.prefix}_defaultOutlet`,
        JSON.stringify(encryptor.encrypt(defaultOutlet))
      );
      await props.dispatch(OutletAction.fetchDefaultOutlet(defaultOutlet));
    } else {
      localStorage.removeItem(`${config.prefix}_scanTable`);
    }

    let url = window.location.hash.split("#")[1];
    if (url !== "/") {
      if (!param) {
        let defaultOutlet = await props.dispatch(
          OutletAction.fetchDefaultOutlet()
        );
        defaultOutlet = await props.dispatch(
          MasterdataAction.getOutletByID(
            defaultOutlet.sortKey.split("::")[1],
            true
          )
        );
        localStorage.setItem(
          `${config.prefix}_defaultOutlet`,
          JSON.stringify(encryptor.encrypt(defaultOutlet))
        );
        await props.dispatch(OutletAction.fetchDefaultOutlet(defaultOutlet));
      }

      await props.dispatch(OrderAction.getCart());
    }

    // try {
    //   document.getElementById("color-theme").href = color;
    // } catch (error) {}
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <HashRouter>
        <Switch>
          <Route component={Layout} />
          <Redirect from="*" to="/" />
        </Switch>
      </HashRouter>
    </IntlProvider>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    lang: state.language.lang,
    theme: state.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    onLogin: (username, password) => {
      dispatch(AuthActions.auth(username, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
