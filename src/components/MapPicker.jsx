import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'react-toastify';

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

      // Reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const fullAddress = data.display_name || 'Address not found';
        setAddress(fullAddress);
        onLocationSelect({ latitude: lat, longitude: lng, fullAddress });
        toast.success("Location selected on map!");
      } catch (error) {
        console.error("Error fetching address for map click:", error);
        setAddress('Could not fetch address');
        toast.error("Could not fetch address for selected point.");
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      {/* <Popup>{address}</Popup> */}
    </Marker>
  );
};

const MapPicker = ({ onLocationSelect, initialPosition = [27.6193, 83.4750] }) => { // Default to Tilottama
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={false} className="h-full w-full">
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
