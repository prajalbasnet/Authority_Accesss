import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'react-toastify';
import { reverseGeocode } from '../services/geocodingService';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse geocoding using service with multiple fallbacks
      try {
        const result = await reverseGeocode(lat, lng);
        setAddress(result.address);
        onLocationSelect({ latitude: lat, longitude: lng, fullAddress: result.address });
        
        if (result.success) {
          toast.success("Location selected on map!");
        } else {
          toast.success("Location selected! (Using coordinates as address)");
        }
      } catch (error) {
        console.error("Error in geocoding service:", error);
        // Ultimate fallback
        const fallbackAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        setAddress(fallbackAddress);
        onLocationSelect({ latitude: lat, longitude: lng, fullAddress: fallbackAddress });
        toast.success("Location selected! (Using coordinates as address)");
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      {/* <Popup>{address}</Popup> */}
    </Marker>
  );
};

const MapPicker = ({ onLocationSelect, initialPosition = [27.6193, 83.4750] }) => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (map) {
          map.setView([latitude, longitude], 16);
        }
        // Reverse geocoding using service with multiple fallbacks
        try {
          const result = await reverseGeocode(latitude, longitude);
          onLocationSelect({ latitude, longitude, fullAddress: result.address });
          
          if (result.success) {
            toast.success("Location fetched successfully!");
          } else {
            toast.success("Location fetched! (Using coordinates as address)");
          }
        } catch (error) {
          console.error("Error in geocoding service:", error);
          // Ultimate fallback
          const fallbackAddress = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
          onLocationSelect({ latitude, longitude, fullAddress: fallbackAddress });
          toast.success("Location fetched! (Using coordinates as address)");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Error getting your location. Please enable location services.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md border border-gray-200 relative">
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={loading}
        className="absolute top-3 right-3 z-10 px-4 py-2 bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? 'Getting Location...' : 'Use My Location'}
      </button>
      <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={false} className="h-full w-full" whenCreated={setMap}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
