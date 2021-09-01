import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
// import GoogleMapReact from "google-map-react";
// import LocationOnIcon from "@material-ui/icons/LocationOn";

const API_KEY = "AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4";
Geocode.setApiKey(API_KEY);
Geocode.setLanguage("en");

const GoogleMaps = ({ defaultCenter, deliveryAddress, handleChange, setAddress }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    try {
      if(drag){
        Geocode.fromLatLng(center.lat, center.lng).then(
          (response) => handleChangeAddress(response, true),
          (error) =>  console.error(error)
        );
      }
  
      if(typeof deliveryAddress !== "object" && !setAddress) {
        Geocode.fromAddress(deliveryAddress).then(
          (response) => handleChangeAddress(response),
          (error) =>  console.error(error)
        );
      }
    } catch (error) {}
  }, [deliveryAddress, setAddress, center, drag]);

  const handleChangeAddress = (response, maping) => {
    let location = response.results[0].geometry.location
    if(location){
      handleChange('latitude', location.lat)
      handleChange('longitude', location.lng)
      if(!maping) setCenter(location)
    }

    let address = response.results[0].formatted_address;
    handleChange('address', address)

    let address_components = response.results[0].address_components
    // console.log(address_components);

    let city = address_components.filter((params) => { 
      return (params.types[0] === "administrative_area_level_2" || params.types[0] === "locality") 
    })[0]
    if(city) handleChange('city', city.long_name)

    let postalCode = address_components.filter((params) => { return params.types[0] === "postal_code" })[0]
    if(postalCode) handleChange('codePostal', postalCode.long_name)
    setDrag(false)
  }
  
  return (
    <div></div>
    // <GoogleMapReact
    //   bootstrapURLKeys={{ key: API_KEY }}
    //   defaultCenter={defaultCenter}
    //   center={center}
    //   defaultZoom={11}
    //   onDragEnd={({ center }) => {
    //     setDrag(true)
    //     setCenter(center.toJSON())
    //   }}
    //   onChildClick={() => {
    //     console.log("You clicked me!");
    //   }}
    // >
    //   <div style={{ position: "relative" }} lat={center.lat} lng={center.lng}>
    //     <LocationOnIcon
    //       className="color"
    //       style={{
    //         fontSize: 40,
    //         position: "absolute",
    //         top: -20,
    //         left: -20,
    //       }}
    //     />
    //   </div>
    // </GoogleMapReact>
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