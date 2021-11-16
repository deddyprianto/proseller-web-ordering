import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmptyArray } from "../../helpers/CheckEmpty";
// import Carousel from "nuka-carousel";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

class Promotion extends Component {
  render() {
    let { banners, colorTheme } = this.props;
    if (isEmptyArray(banners)) return null;

    return (
      <div
        className="home-v1-slider"
        style={{ marginBottom: 10 }}
        id="promo-banner"
      >
        <div
          id="owl-main"
          className="owl-carousel owl-inner-nav owl-ui-sm"
          style={{ marginTop: 85 }}
        >
          <Carousel
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
          >
            {banners.map((item, i) => (
              <div>
                <picture>
                  <source
                    srcset={item.thumbnailURL}
                    alt={item.name}
                    media="(max-width: 700px)"
                  />
                  <img src={item.defaultImageURL} alt={item.name} />
                </picture>
              </div>
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
    colorTheme: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Promotion);
