import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmptyArray } from "../../helpers/CheckEmpty";
import Carousel from "nuka-carousel";

class Promotion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { banners } = this.props;
    if (isEmptyArray(banners)) return null;
    return (
      <div className="home-v1-slider" >
        <div id="owl-main" className="owl-carousel owl-inner-nav owl-ui-sm" style={{ marginTop: 70, marginBottom: -140 }}>
          <Carousel
            autoplay
            wrapAround={false}
            renderCenterLeftControls={({ previousSlide }) => (
              <p onClick={previousSlide}><i className="fa fa-chevron-left control-promotion profile-dashboard" style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}></i></p>
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <p onClick={nextSlide}><i className="fa fa-chevron-right control-promotion profile-dashboard" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}></i></p>
            )}
          >
            {banners.map((item, i) => (
              <img src={item.defaultImageURL} style={{ borderRadius: 5 }} />
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    banners: state.promotion.banners,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Promotion);
