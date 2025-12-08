import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when address changes
const MapUpdater = ({ city, district, neighborhood }) => {
  const map = useMap();

  useEffect(() => {
    if (!city) return;

    const query = `${neighborhood ? neighborhood + ', ' : ''}${district ? district + ', ' : ''}${city}, Turkey`;
    
    // Use Nominatim for geocoding (Free OSM service)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.flyTo([parseFloat(lat), parseFloat(lon)], 13);
        }
      })
      .catch(err => console.error('Geocoding error:', err));
  }, [city, district, neighborhood, map]);

  return null;
};

// Component to handle map clicks
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationMap = ({ city, district, neighborhood, onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);

  // Default center (Turkey)
  const defaultCenter = [39.9334, 32.8597];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater city={city} district={district} neighborhood={neighborhood} />
      <LocationMarker 
        position={position} 
        setPosition={setPosition} 
        onLocationSelect={onLocationSelect} 
      />
    </MapContainer>
  );
};

export default LocationMap;
