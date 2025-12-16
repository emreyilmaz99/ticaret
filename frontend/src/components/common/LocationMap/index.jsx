// src/components/common/LocationMap/index.jsx
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import LocationMarker from './LocationMarker';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMap = React.memo(({ 
  city, 
  district, 
  neighborhood, 
  onLocationSelect, 
  initialPosition 
}) => {
  const [position, setPosition] = useState(initialPosition || null);

  // Default center (Turkey)
  const defaultCenter = useMemo(() => [39.9334, 32.8597], []);
  
  const mapStyle = useMemo(() => ({ 
    height: '100%', 
    width: '100%', 
    borderRadius: '12px' 
  }), []);

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      style={mapStyle}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater 
        city={city} 
        district={district} 
        neighborhood={neighborhood} 
      />
      <LocationMarker 
        position={position} 
        setPosition={setPosition} 
        onLocationSelect={onLocationSelect} 
      />
    </MapContainer>
  );
});

LocationMap.displayName = 'LocationMap';

export default LocationMap;
