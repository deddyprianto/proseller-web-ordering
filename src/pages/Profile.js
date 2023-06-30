import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { connect } from 'react-redux';

import config from 'config';

const RewardsPage = loadable(() => import('../components/rewards'));
const DetailProfile = loadable(() =>
  import('../components/profile/DetailProfile')
);

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    setting: state.order.setting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

class Profile extends Component {
  constructor(props) {
    super(props);

    let isProfile = true;

    if (window.location.hash.split('#')[1] === '/rewards') isProfile = false;

    this.state = {
      isProfile,
      enableOrdering: false,
    };
  }
  componentDidMount() {
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      // document.getElementById('login-register-btn').click();
      return false;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }
      if (this.props.location.pathname !== prevProps.location.pathname) {
        let isProfile = true;
        try {
          if (window.location.hash.split('#')[1] === '/rewards')
            isProfile = false;
          this.setState({ isProfile });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  render() {
    const settingAppoinment = this.props.setting.find((items) => {
      return items.settingKey === 'EnableAppointment';
    });
    let { isProfile } = this.state;
    if (!this.props.isLoggedIn) {
      return (
        <div
          className='col-full'
          style={{
            marginTop: config.prefix === 'emenu' ? 90 : 110,
            marginBottom: 50,
            padding: 0,
          }}
        >
          <div id='primary' className='content-area'>
            <div
              className='stretch-full-width'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <main id='main' className='site-main' style={{ width: '100%' }}>
                <div>
                  <img
                    src={config.url_emptyImage}
                    alt='is empty'
                    style={{ marginTop: 30 }}
                  />
                  <div style={{ textAlign: 'center' }}>Please login first</div>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className='col-full'
        style={{
          marginTop: config.prefix === 'emenu' ? 80 : 90,
          marginBottom: 50,
        }}
      >
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            {/* <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -40,
              }}
            >
              <Link to="/profile">
                <Button
                  className={isProfile ? "use-select" : "un-select"}
                  style={{ height: 50, fontWeight: "bold" }}
                  onClick={() => this.setState({ isProfile: true })}
                >
                  Profile
                </Button>
              </Link>
              <Link to="/rewards">
                <Button
                  className={!isProfile ? "use-select" : "un-select"}
                  style={{ height: 50, fontWeight: "bold" }}
                >
                  Rewards
                </Button>
              </Link>
            </div> */}
            <main
              id='main'
              className='site-main'
              style={{ textAlign: 'center' }}
            >
              {isProfile ? (
                <DetailProfile
                  settingAppoinment={settingAppoinment?.settingValue}
                />
              ) : (
                <RewardsPage />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

Profile.defaultProps = {
  isLoggedIn: false,
  setting: [],
};

Profile.propTypes = {
  isLoggedIn: PropTypes.bool,
  setting: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
