import React from "react";
import PropTypes from "prop-types";
import GoogleMapReact from "google-map-react";

const GoogleMaps = ({ children }) => {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyAkoWVxFc3Bzl74bqgYl3umkue3MacqVvE" }}
      defaultCenter={{
        center: {
          lat: 59.95,
          lng: 30.33,
        },
      }}
      defaultZoom={11}
      yesIWantToUseGoogleMapApiInternals
    >
      <div>Marker</div>
    </GoogleMapReact>
  );
};

GoogleMaps.propTypes = {};

export default GoogleMaps;
