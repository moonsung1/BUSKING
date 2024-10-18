import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Map.css'; 

const MapComponent = ({ addresses }) => {
  const center = { lat: 35.1595, lng: 126.8526 }; // 광주 용봉동 전남대학교 위치

  return (
    <div className="map-container">
        <GoogleMap
          center={center}
          zoom={13}
          mapContainerStyle={{ height: '400px', width: '100%' }}
        >
          {addresses.map((address, index) => (
            <Marker key={index} position={{ lat: address.lat, lng: address.lng }} />
          ))}
        </GoogleMap>
    </div>
  );
};

export default MapComponent;
