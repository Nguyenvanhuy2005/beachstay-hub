
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  apiKey: string;
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
  width?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  address = "131 Đường Nguyễn Thị Minh Khai, Phường 8, Vũng Tàu, Bà Rịa - Vũng Tàu",
  lat = 10.347041,
  lng = 107.083180,
  zoom = 15,
  height = "400px",
  width = "100%"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const apiLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Function to load Google Maps API
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      if (apiLoadedRef.current) return;
      
      apiLoadedRef.current = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMap = initMap;
      document.head.appendChild(script);
    };

    // Function to initialize the map
    const initMap = () => {
      if (!mapRef.current) return;
      
      const mapOptions: google.maps.MapOptions = {
        center: { lat, lng },
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      };
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
      
      // Add marker
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: 'AnNam Village',
        animation: google.maps.Animation.DROP,
      });
      
      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h5 style="margin: 0 0 8px; font-weight: bold;">AnNam Village</h5>
            <p style="margin: 0; font-size: 14px;">${address}</p>
            <p style="margin: 8px 0 0;"><a href="https://maps.google.com/maps?daddr=${lat},${lng}" target="_blank" style="color: #1a73e8; text-decoration: none;">Chỉ đường</a></p>
          </div>
        `,
      });
      
      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
      
      // Open info window by default
      infoWindow.open(mapInstanceRef.current, marker);
    };

    loadGoogleMapsApi();

    // Cleanup
    return () => {
      if (window.google && mapInstanceRef.current) {
        // Clean up map resources if needed
        mapInstanceRef.current = null;
      }
      // Remove the global callback
      delete window.initGoogleMap;
    };
  }, [apiKey, address, lat, lng, zoom]);

  return (
    <div className="google-map-container">
      <div 
        ref={mapRef} 
        style={{ width, height, borderRadius: '0.5rem' }}
        className="google-map"
        aria-label="Bản đồ vị trí AnNam Village"
        role="region"
      />
    </div>
  );
};

// Declare the global initGoogleMap function
declare global {
  interface Window {
    initGoogleMap: () => void;
  }
}

export default GoogleMap;
