import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmptyArray } from "../../helpers/CheckEmpty";
import Carousel from "nuka-carousel";

class Promotion extends Component {
  render() {
    let { banners, colorTheme } = this.props;
    if (isEmptyArray(banners)) return null;
    
    return (
      <div className="home-v1-slider">
        <div id="owl-main" className="owl-carousel owl-inner-nav owl-ui-sm" style={{ marginTop: 85, marginBottom: -140 }}>
          <Carousel
            autoplay
            wrapAround={banners && banners.length > 1}
            withoutControls={banners && banners.length === 1}
            renderCenterLeftControls={({ previousSlide }) => (
              <p onClick={previousSlide}>
                <i className="fa fa-chevron-left control-promotion background-theme" 
                style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, color: colorTheme.primary }}/>
              </p>
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <p onClick={nextSlide}>
                <i className="fa fa-chevron-right control-promotion background-theme" 
                style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, color: colorTheme.primary }}/>
              </p>
            )}
            defaultControlsConfig={{
              pagingDotsStyle: {
                fill: colorTheme.primary,
                position: "relative",
                padding: 3,
                bottom: -15,
              }
            }}
          >
            {banners.map((item, i) => (
              <img key={i} src={item.defaultImageURL} style={{ borderRadius: 5 }} alt="promo banner" />
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
    colorTheme: state.theme.color
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Promotion);
