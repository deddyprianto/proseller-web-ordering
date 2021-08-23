
import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { Link } from "react-router-dom";

const mapStyles = {
  width: "100%",
  height: 60,
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);
  }  

  render() {
    const { coordinate, color, alreadyPinned } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        {
          alreadyPinned ? 
          <Link to={'/map'}>
            <div style={{ justifyContent: 'center', display: 'flex', width: 120, height: 35, position: 'absolute', zIndex: 9999, backgroundColor: color.background, border: `2px solid ${color.primary}`, borderRadius: 7, marginLeft: '32%', marginTop: 10 }}>
              <span style={{ textAlign: 'center', color: color.primary }}>Edit Pinpoint</span>
            </div>
          </Link>
          :
          <Link to={'/map'}>
            <div style={{ justifyContent: 'center', display: 'flex', width: 120, height: 35, position: 'absolute', zIndex: 9999, backgroundColor: color.background, border: `2px solid gray`, borderRadius: 7, marginLeft: '32%', marginTop: 10 }}>
              <span style={{ textAlign: 'center', color: 'gray' }}>Pin Location</span>
            </div>
          </Link>
        }
        
        <Map
          google={this.props.google}
          zoom={13}
          style={mapStyles}
          initialCenter={{
            lat: coordinate.latitude,
            lng: coordinate.longitude
          }}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4",
})(MapContainer);