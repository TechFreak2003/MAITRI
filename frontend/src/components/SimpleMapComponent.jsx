import React, { useEffect, useRef } from 'react';

// Wildlife data from your original component
const wildlifeData = [
  { id: 1, name: "Jim Corbett National Park", coordinates: [29.5319, 78.7718], riskLevel: "medium", animals: ["Tigers", "Elephants", "Leopards"], recentSightings: 12, lastAlert: "2 hours ago" },
  { id: 2, name: "Ranthambore National Park", coordinates: [26.0212, 76.5028], riskLevel: "high", animals: ["Tigers", "Leopards", "Sambar Deer"], recentSightings: 15, lastAlert: "15 minutes ago" },
  { id: 3, name: "Sariska Tiger Reserve", coordinates: [27.3995, 76.3364], riskLevel: "low", animals: ["Tigers", "Jungle Cats"], recentSightings: 4, lastAlert: "8 hours ago" },
  { id: 4, name: "Nanda Devi Biosphere Reserve", coordinates: [30.5000, 79.7000], riskLevel: "low", animals: ["Snow Leopards", "Himalayan Musk Deer"], recentSightings: 1, lastAlert: "1 day ago" },
  { id: 5, name: "Kaziranga National Park", coordinates: [26.5775, 93.1716], riskLevel: "high", animals: ["Rhinos", "Tigers", "Elephants"], recentSightings: 8, lastAlert: "30 minutes ago" },
  { id: 6, name: "Manas National Park", coordinates: [26.7500, 91.0000], riskLevel: "medium", animals: ["Tigers", "Pygmy Hogs", "Elephants"], recentSightings: 5, lastAlert: "1 hour ago" },
  { id: 7, name: "Namdapha National Park", coordinates: [27.5500, 96.3000], riskLevel: "medium", animals: ["Mishmi Takin", "Red Panda"], recentSightings: 2, lastAlert: "4 hours ago" },
  { id: 8, name: "Keibul Lamjao National Park", coordinates: [24.5269, 93.8116], riskLevel: "low", animals: ["Sangai (Manipur Brow-antlered Deer)"], recentSightings: 3, lastAlert: "5 hours ago" },
  { id: 9, name: "Gir Forest National Park", coordinates: [21.1681, 70.8202], riskLevel: "high", animals: ["Asiatic Lions", "Leopards"], recentSightings: 10, lastAlert: "45 minutes ago" },
  { id: 10, name: "Tadoba Andhari Tiger Reserve", coordinates: [20.3541, 79.2558], riskLevel: "high", animals: ["Tigers", "Sloth Bears"], recentSightings: 14, lastAlert: "10 minutes ago" },
  { id: 11, name: "Great Indian Bustard Sanctuary", coordinates: [18.5721, 75.3283], riskLevel: "low", animals: ["Great Indian Bustards"], recentSightings: 1, lastAlert: "12 hours ago" },
  { id: 12, name: "Periyar Wildlife Sanctuary", coordinates: [9.4611, 77.2411], riskLevel: "low", animals: ["Elephants", "Tigers"], recentSightings: 3, lastAlert: "6 hours ago" },
  { id: 13, name: "Bandipur National Park", coordinates: [11.6500, 76.6333], riskLevel: "high", animals: ["Tigers", "Elephants", "Indian Bison"], recentSightings: 11, lastAlert: "25 minutes ago" },
  { id: 14, name: "Mudumalai National Park", coordinates: [11.5667, 76.5667], riskLevel: "medium", animals: ["Elephants", "Tigers"], recentSightings: 6, lastAlert: "1 hour ago" },
  { id: 15, name: "Nagarhole National Park", coordinates: [12.0000, 76.2700], riskLevel: "medium", animals: ["Tigers", "Leopards", "Elephants"], recentSightings: 9, lastAlert: "2 hours ago" },
  { id: 16, name: "Silent Valley National Park", coordinates: [11.0500, 76.4500], riskLevel: "low", animals: ["Lion-tailed Macaque"], recentSightings: 2, lastAlert: "1 day ago" },
  { id: 17, name: "Sundarbans National Park", coordinates: [21.9497, 88.4297], riskLevel: "high", animals: ["Tigers", "Saltwater Crocodiles"], recentSightings: 7, lastAlert: "45 minutes ago" },
  { id: 18, name: "Kanha National Park", coordinates: [22.3364, 80.6409], riskLevel: "high", animals: ["Tigers", "Barasingha"], recentSightings: 13, lastAlert: "20 minutes ago" },
  { id: 19, name: "Bandhavgarh National Park", coordinates: [23.7136, 80.9618], riskLevel: "high", animals: ["Tigers", "Leopards", "Bears"], recentSightings: 15, lastAlert: "1 hour ago" },
  { id: 20, name: "Panna National Park", coordinates: [24.7176, 79.9171], riskLevel: "medium", animals: ["Tigers", "Vultures"], recentSightings: 5, lastAlert: "3 hours ago" },
  { id: 21, name: "Satpura National Park", coordinates: [22.5800, 78.4300], riskLevel: "low", animals: ["Tigers", "Indian Bison"], recentSightings: 4, lastAlert: "9 hours ago" },
];

const SimpleMapComponent = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS and JS if not already loaded
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapInstanceRef.current && mapRef.current && window.L) {
        const L = window.L;
        
        const map = L.map(mapRef.current, {
          center: [22.351114, 78.667743],
          zoom: 5,
          scrollWheelZoom: true,
          zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const getMarkerColor = (riskLevel) => {
          switch (riskLevel) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
          }
        };

        wildlifeData.forEach(region => {
          const marker = L.circleMarker(region.coordinates, {
            radius: 8,
            fillColor: getMarkerColor(region.riskLevel),
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${region.name}</h3>
              <div style="font-size: 12px; line-height: 1.4;">
                <div style="margin: 4px 0;">
                  <span style="color: #666;">Risk Level:</span>
                  <span style="margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 10px; ${
                    region.riskLevel === 'high' ? 'background: #fee2e2; color: #dc2626;' :
                    region.riskLevel === 'medium' ? 'background: #fef3c7; color: #d97706;' :
                    'background: #d1fae5; color: #059669;'
                  }">${region.riskLevel.toUpperCase()}</span>
                </div>
                <div style="margin: 4px 0;">
                  <span style="color: #666;">Animals:</span>
                  <span style="margin-left: 8px;">${region.animals.join(', ')}</span>
                </div>
                <div style="margin: 4px 0;">
                  <span style="color: #666;">Recent Sightings:</span>
                  <span style="margin-left: 8px; font-weight: bold;">${region.recentSightings}</span>
                </div>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
        });

        mapInstanceRef.current = map;
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
};

export default SimpleMapComponent;