import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import config from "../../config";
import { Input, Button } from "reactstrap";
import { Col, Row } from "reactstrap";
import Shimmer from "react-shimmer-effect";

const mapStyles = {
  width: "100%",
  height: "62%",
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    let location = localStorage.getItem(`${config.prefix}_locationCustomer`);

    let initialCenter = {
      lat: 1.29027,
      lng: 103.851959,
    };

    if (location !== null && location !== undefined) {
      location = JSON.parse(location);
      initialCenter.lat = location.latitude;
      initialCenter.lng = location.longitude;
    }

    let coordinate = localStorage.getItem(`${config.prefix}_locationPinned`);
    let edit = false;
    if (coordinate !== null && coordinate !== undefined) {
      coordinate = JSON.parse(coordinate);
      initialCenter.lat = coordinate.latitude;
      initialCenter.lng = coordinate.longitude;

      if (coordinate.editted === true) {
        edit = true;
      }
    }

    let center = initialCenter

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      initialCenter,
      center,
      userLocation: "",
      detailAddress: {},
      regionChangeProgress: false,
      edit,
      searchLocation: "",
      loaded: true
    };
  }

  viewShimmer = (isHeight = 500) => {
    return (
      <Shimmer>
        <div
          style={{
            width: "100%",
            height: isHeight,
            alignSelf: "center",
            borderRadius: "8px",
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidMount = () => {
    this.fetchAddress();
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  fetchAddress = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      this.state.initialCenter.lat +
      "," +
      this.state.initialCenter.lng +
      "&key=" +
      "AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          detailAddress: responseJson.results[0],
          regionChangeProgress: false,
        });
      });
  };

  setCoordinate = () => {
    console.log(this.state.detailAddress)
    let coordinate = {
      detailAddress: this.state.detailAddress,
      latitude: this.state.initialCenter.lat,
      longitude: this.state.initialCenter.lng,
      userLocation: this.state.userLocation,
      editted: this.state.edit,
    };

    localStorage.setItem(
      `${config.prefix}_locationPinned`,
      JSON.stringify(coordinate)
    );
    this.props.history.goBack();
  };

  getGeolocation = async () => {
    this.setState({ loaded: false })
    const { searchLocation } = this.state;
    let url = `https://maps.google.com/maps/api/geocode/json?address=${searchLocation}&sensor=false&key=AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4`;
    let response = await fetch(url);
    response = await response.json();
    try {
      let initialCenter = {
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng,
      };
      let detailAddress = response.results[0]
      let userLocation = response.results[0].formatted_address
      let center = initialCenter

      await this.setState({ initialCenter, center, userLocation, loaded: true, detailAddress });
    } catch (e) { }
  };

  render() {
    const { initialCenter, userLocation, regionChangeProgress, center, loaded } = this.state;
    return (
      <div>
        <div
          style={{
            marginTop: 90,
            marginLeft: 10,
            marginRight: 10,
            display: "flex",
            marginBottom: 7
          }}
        >
          <Input
            type="text"
            placeholder="Enter your address here...."
            style={{
              height: 40,
              borderRadius: 5,
              width: "85%",
              marginRight: 10,
            }}
            onChange={(e) => this.setState({ searchLocation: e.target.value })}
          />
          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ width: "15%" }}
            onClick={this.getGeolocation}
          >
            <span aria-hidden="true" style={{ fontSize: 12 }}>
              Find
            </span>
          </button>
        </div>
        {
          loaded ?
            <Map
              google={this.props.google}
              zoom={17}
              style={mapStyles}
              center={center}
              onDragend={(e, coord) => {
                try {
                  const { center } = coord;
                  const lat = center.lat();
                  const lng = center.lng();

                  this.setState(
                    {
                      initialCenter: {
                        lat,
                        lng,
                      },
                      regionChangeProgress: true,
                    },
                    () => this.fetchAddress()
                  );
                } catch (e) { }
              }}
              initialCenter={initialCenter}
            >
              <Marker
                position={initialCenter}
                // onClick={this.onMarkerClick}
                name={"You Are Here"}
              />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  {/* <h4>{this.state.selectedPlace.name}</h4> */}
                </div>
              </InfoWindow>
            </Map>
            :
            <Row>
              <Col sm={12}>{this.viewShimmer(500)}</Col>
            </Row>

        }

        <div
          style={{
            backgroundColor: "white",
            zIndex: 2999,
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "20%",
          }}
        >
          <br />
          <h5
            className="text text-primary text-center"
            style={{ marginBottom: 10 }}
          >
            Move map to change coordinate.
          </h5>
          <div style={{ maxWidth: "100%", width: "100%", textAlign: 'center',  }}>
            <i style={{ fontSize: '1.5rem', color: '#2d3436', fontWeight: 'bold' }}>
              {!regionChangeProgress
                ? userLocation
                : "Identifying Location ...."}
            </i>
          </div>
          <br />
          <button
            type="button"
            onClick={this.setCoordinate}
            className="btn btn-primary btn-block"
            style={{ position: "absolute", zIndex: 3, bottom: 0, padding: 10 }}
          >
            <b>Use This Location</b>
          </button>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4",
})(MapContainer);