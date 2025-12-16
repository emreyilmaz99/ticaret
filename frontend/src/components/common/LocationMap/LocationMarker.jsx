// src/components/common/LocationMap/LocationMarker.jsx
import React, { useCallback } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationMarker = React.memo(({ position, setPosition, onLocationSelect }) => {
  const handleMapClick = useCallback((e) => {
    setPosition(e.latlng);
    if (onLocationSelect) {
      onLocationSelect(e.latlng);
    }
  }, [setPosition, onLocationSelect]);

  useMapEvents({
    click: handleMapClick,
  });

  return position ? <Marker position={position} /> : null;
});

LocationMarker.displayName = 'LocationMarker';

export default LocationMarker;
