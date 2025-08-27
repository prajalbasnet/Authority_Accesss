import React, { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import MapPicker from './MapPicker'; // Import the new MapPicker component

const LocationSelector = ({ onLocationSelect }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [fullAddress, setFullAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false); // State to control map visibility

  const handleUseMyLocation = () => {
    setLoading(true);
    setShowMap(false); // Hide map if it was open
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Reverse geocoding using OpenStreetMap Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || 'Address not found';
            setFullAddress(address);
            onLocationSelect({ latitude, longitude, fullAddress: address });
            toast.success("Location fetched successfully!");
          } catch (error) {
            console.error("Error fetching address:", error);
            setFullAddress('Could not fetch address');
            toast.error("Could not fetch address.");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Error getting your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const handleMapSelection = (location) => {
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    setFullAddress(location.fullAddress);
    onLocationSelect(location);
    setShowMap(false); // Hide map after selection
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">Select Location</h3>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Fetching...' : 'Use My Location'}
          <FaMapMarkerAlt className="ml-2" />
        </button>
        <button
          type="button"
          onClick={() => setShowMap(true)} // Show map when clicked
          className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Choose on Map
          <FaMapMarkerAlt className="ml-2" />
        </button>
      </div>

      {showMap && (
        <div className="mt-4">
          <MapPicker onLocationSelect={handleMapSelection} />
          <button
            onClick={() => setShowMap(false)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Close Map
          </button>
        </div>
      )}

      {(latitude && longitude) && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-sm text-gray-700"><strong>Latitude:</strong> {latitude.toFixed(6)}</p>
          <p className="text-sm text-gray-700"><strong>Longitude:</strong> {longitude.toFixed(6)}</p>
          <p className="text-sm text-gray-700"><strong>Address:</strong> {fullAddress}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;