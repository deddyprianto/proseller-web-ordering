/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CONSTANT } from 'helpers';
const mapStyles = {
  width: '100%',
  height: 85,
};

const MapContainer = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { valueFields, coordinate, color, alreadyPinned } = props;
  let payload = valueFields;
  return (
    <div style={{ position: 'relative' }}>
      {alreadyPinned ? (
        <div
          onClick={() => {
            dispatch({ type: CONSTANT.SAVE_ADDRESS_PLACEHOLDER, payload });
            history.push('/map');
          }}
          style={{
            left: '50%',
            transform: 'translate(-50%, -50%)',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: 120,
            height: 35,
            position: 'absolute',
            zIndex: 5,
            backgroundColor: color.background,
            border: `2px solid ${color.primary}`,
            borderRadius: 7,
            marginTop: 40,
          }}
        >
          <span style={{ textAlign: 'center', color: color.primary }}>
            Edit Pinpoint
          </span>
        </div>
      ) : (
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            width: 120,
            height: 35,
            position: 'absolute',
            zIndex: 9999,
            backgroundColor: color.background,
            border: '2px solid gray',
            borderRadius: 7,
            marginLeft: '32%',
            marginTop: 10,
          }}
        >
          <span style={{ textAlign: 'center', color: 'gray' }}>
            Pin Location
          </span>
        </div>
      )}

      <Map
        google={props.google}
        zoom={13}
        style={mapStyles}
        initialCenter={{
          lat: coordinate?.latitude,
          lng: coordinate?.longitude,
        }}
      />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4',
})(MapContainer);
