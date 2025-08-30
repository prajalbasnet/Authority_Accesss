// Geocoding service with multiple fallback options

export const reverseGeocode = async (latitude, longitude) => {
  const methods = [
    // Method 1: Use Vite proxy (requires dev server restart)
    {
      name: 'proxy',
      fn: async () => {
        const response = await fetch(
          `/api/nominatim/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        if (!response.ok) throw new Error('Proxy request failed');
        return await response.json();
      }
    },
    // Method 2: Use CORS proxy service
    {
      name: 'cors-proxy',
      fn: async () => {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = encodeURIComponent(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        if (!response.ok) throw new Error('CORS proxy request failed');
        
        const proxyData = await response.json();
        return JSON.parse(proxyData.contents);
      }
    },
    // Method 3: Alternative CORS proxy
    {
      name: 'cors-anywhere',
      fn: async () => {
        const response = await fetch(
          `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            }
          }
        );
        if (!response.ok) throw new Error('Alternative CORS proxy request failed');
        return await response.json();
      }
    }
  ];

  // Try each method in sequence
  for (const method of methods) {
    try {
      console.log(`Trying geocoding method: ${method.name}`);
      const data = await method.fn();
      console.log(`Geocoding successful with method: ${method.name}`);
      return {
        success: true,
        address: data.display_name || 'Address not found',
        data: data
      };
    } catch (error) {
      console.warn(`Geocoding method ${method.name} failed:`, error);
      continue;
    }
  }

  // If all methods fail, return coordinates as fallback
  console.warn('All geocoding methods failed, using coordinates as fallback');
  return {
    success: false,
    address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
    data: null
  };
};
