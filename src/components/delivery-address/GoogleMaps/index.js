import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import GoogleMapReact from "google-map-react";
import Geocode from "react-geocode";

import LocationOnIcon from "@material-ui/icons/LocationOn";

const API_KEY = "AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4";

Geocode.setApiKey(API_KEY);

Geocode.setLanguage("en");

const GoogleMaps = ({ defaultCenter }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [addressInfo, setAddressInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    Geocode.fromLatLng(center.lat, center.lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        console.log(address);
        setAddressInfo(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [center]);
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: API_KEY }}
      defaultCenter={defaultCenter}
      center={center}
      defaultZoom={11}
      onDragEnd={({ center }) => setCenter(center.toJSON())}
      onChildClick={() => {
        console.log("You clicked me!");
      }}
    >
      <div style={{ position: "relative" }} lat={center.lat} lng={center.lng}>
        <LocationOnIcon
          className="color"
          style={{
            fontSize: 40,
            position: "absolute",
            top: -20,
            left: -20,
          }}
        />
      </div>
    </GoogleMapReact>
  );
};

GoogleMaps.propTypes = {
  defaultCenter: PropTypes.object.isRequired,
};

GoogleMaps.defaultProps = {
  defaultCenter: {
    lat: 1.354989,
    lng: 103.867794,
  },
};

export default GoogleMaps;
