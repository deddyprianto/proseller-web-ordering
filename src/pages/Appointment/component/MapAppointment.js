import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function MapAppointment({
  latitude,
  longitude,
  setOpenModalMap,
}) {
  const defaultProps = {
    center: {
      lat: Number(latitude),
      lng: Number(longitude),
    },
    zoom: 15,
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div
        onClick={() => setOpenModalMap(false)}
        style={{
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 'bolder',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Exit
      </div>
      <GoogleMapReact
        options={() => {
          return {
            panControl: false,
            mapTypeControl: false,
            styles: [
              {
                stylers: [
                  { saturation: -100 },
                  { gamma: 0.8 },
                  { lightness: 4 },
                  { visibility: 'on' },
                ],
              },
            ],
          };
        }}
        layerTypes={['TrafficLayer']}
        bootstrapURLKeys={{ key: 'AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <LocationOnIcon
          lat={latitude}
          lng={longitude}
          sx={{ fontSize: '50px', color: 'red' }}
        />
      </GoogleMapReact>
    </div>
  );
}
