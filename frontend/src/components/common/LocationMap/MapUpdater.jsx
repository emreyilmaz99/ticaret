// src/components/common/LocationMap/MapUpdater.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { useDebounce } from '../../../hooks/useDebounce';

const MapUpdater = React.memo(({ city, district, neighborhood }) => {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounce location query to prevent excessive API calls
  const debouncedCity = useDebounce(city, 800);
  const debouncedDistrict = useDebounce(district, 800);
  const debouncedNeighborhood = useDebounce(neighborhood, 800);

  const geocodeLocation = useCallback(async () => {
    if (!debouncedCity) return;

    setLoading(true);
    setError(null);

    const query = `${debouncedNeighborhood ? debouncedNeighborhood + ', ' : ''}${debouncedDistrict ? debouncedDistrict + ', ' : ''}${debouncedCity}, Turkey`;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0' // Nominatim requires User-Agent
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13, {
          duration: 1.5,
          easeLinearity: 0.25
        });
        setError(null);
      } else {
        setError('Konum bulunamadı');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Konum yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [debouncedCity, debouncedDistrict, debouncedNeighborhood, map]);

  useEffect(() => {
    geocodeLocation();
  }, [geocodeLocation]);

  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontSize: '12px',
        fontWeight: '600'
      }}>
        Konum yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(239, 68, 68, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {error}
      </div>
    );
  }

  return null;
});

MapUpdater.displayName = 'MapUpdater';

export default MapUpdater;
