import React, { useEffect, useRef, useState } from 'react';
import { Map, ArrowLeft, AlertTriangle, Shield } from 'lucide-react';

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6"
  >
    <ArrowLeft className="w-5 h-5 mr-2" />
    <span className="font-medium">Back to Dashboard</span>
  </button>
);

// Expanded list of major wildlife sanctuaries, conservation areas, and forests in India
const wildlifeData = [
  // North India
  { id: 1, name: "Jim Corbett National Park", coordinates: [29.5319, 78.7718], riskLevel: "medium", animals: ["Tigers", "Elephants", "Leopards"], recentSightings: 12, lastAlert: "2 hours ago" },
  { id: 2, name: "Ranthambore National Park", coordinates: [26.0212, 76.5028], riskLevel: "high", animals: ["Tigers", "Leopards", "Sambar Deer"], recentSightings: 15, lastAlert: "15 minutes ago" },
  { id: 3, name: "Sariska Tiger Reserve", coordinates: [27.3995, 76.3364], riskLevel: "low", animals: ["Tigers", "Jungle Cats"], recentSightings: 4, lastAlert: "8 hours ago" },
  { id: 4, name: "Nanda Devi Biosphere Reserve", coordinates: [30.5000, 79.7000], riskLevel: "low", animals: ["Snow Leopards", "Himalayan Musk Deer"], recentSightings: 1, lastAlert: "1 day ago" },

  // Northeast India
  { id: 5, name: "Kaziranga National Park", coordinates: [26.5775, 93.1716], riskLevel: "high", animals: ["Rhinos", "Tigers", "Elephants"], recentSightings: 8, lastAlert: "30 minutes ago" },
  { id: 6, name: "Manas National Park", coordinates: [26.7500, 91.0000], riskLevel: "medium", animals: ["Tigers", "Pygmy Hogs", "Elephants"], recentSightings: 5, lastAlert: "1 hour ago" },
  { id: 7, name: "Namdapha National Park", coordinates: [27.5500, 96.3000], riskLevel: "medium", animals: ["Mishmi Takin", "Red Panda"], recentSightings: 2, lastAlert: "4 hours ago" },
  { id: 8, name: "Keibul Lamjao National Park", coordinates: [24.5269, 93.8116], riskLevel: "low", animals: ["Sangai (Manipur Brow-antlered Deer)"], recentSightings: 3, lastAlert: "5 hours ago" },

  // West India
  { id: 9, name: "Gir Forest National Park", coordinates: [21.1681, 70.8202], riskLevel: "high", animals: ["Asiatic Lions", "Leopards"], recentSightings: 10, lastAlert: "45 minutes ago" },
  { id: 10, name: "Tadoba Andhari Tiger Reserve", coordinates: [20.3541, 79.2558], riskLevel: "high", animals: ["Tigers", "Sloth Bears"], recentSightings: 14, lastAlert: "10 minutes ago" },
  { id: 11, name: "Great Indian Bustard Sanctuary", coordinates: [18.5721, 75.3283], riskLevel: "low", animals: ["Great Indian Bustards"], recentSightings: 1, lastAlert: "12 hours ago" },

  // South India
  { id: 12, name: "Periyar Wildlife Sanctuary", coordinates: [9.4611, 77.2411], riskLevel: "low", animals: ["Elephants", "Tigers"], recentSightings: 3, lastAlert: "6 hours ago" },
  { id: 13, name: "Bandipur National Park", coordinates: [11.6500, 76.6333], riskLevel: "high", animals: ["Tigers", "Elephants", "Indian Bison"], recentSightings: 11, lastAlert: "25 minutes ago" },
  { id: 14, name: "Mudumalai National Park", coordinates: [11.5667, 76.5667], riskLevel: "medium", animals: ["Elephants", "Tigers"], recentSightings: 6, lastAlert: "1 hour ago" },
  { id: 15, name: "Nagarhole National Park", coordinates: [12.0000, 76.2700], riskLevel: "medium", animals: ["Tigers", "Leopards", "Elephants"], recentSightings: 9, lastAlert: "2 hours ago" },
  { id: 16, name: "Silent Valley National Park", coordinates: [11.0500, 76.4500], riskLevel: "low", animals: ["Lion-tailed Macaque"], recentSightings: 2, lastAlert: "1 day ago" },

  // East & Central India
  { id: 17, name: "Sundarbans National Park", coordinates: [21.9497, 88.4297], riskLevel: "high", animals: ["Tigers", "Saltwater Crocodiles"], recentSightings: 7, lastAlert: "45 minutes ago" },
  { id: 18, name: "Kanha National Park", coordinates: [22.3364, 80.6409], riskLevel: "high", animals: ["Tigers", "Barasingha"], recentSightings: 13, lastAlert: "20 minutes ago" },
  { id: 19, name: "Bandhavgarh National Park", coordinates: [23.7136, 80.9618], riskLevel: "high", animals: ["Tigers", "Leopards", "Bears"], recentSightings: 15, lastAlert: "1 hour ago" },
  { id: 20, name: "Panna National Park", coordinates: [24.7176, 79.9171], riskLevel: "medium", animals: ["Tigers", "Vultures"], recentSightings: 5, lastAlert: "3 hours ago" },
  { id: 21, name: "Satpura National Park", coordinates: [22.5800, 78.4300], riskLevel: "low", animals: ["Tigers", "Indian Bison"], recentSightings: 4, lastAlert: "9 hours ago" },
];

const MapComponent = ({ setCurrentRoute }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    // Only initialize map if it hasn't been created yet
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize Leaflet map
      const L = window.L;
      
      const map = L.map(mapRef.current, {
        center: [22.351114, 78.667743], // A new center for all of India
        zoom: 5,
        scrollWheelZoom: true,
        zoomControl: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Function to get marker color based on risk level
      const getMarkerColor = (riskLevel) => {
        switch (riskLevel) {
          case 'high': return '#ef4444'; // red
          case 'medium': return '#f59e0b'; // yellow
          case 'low': return '#10b981'; // green
          default: return '#6b7280'; // gray
        }
      };

      // Add markers for each wildlife region
      wildlifeData.forEach(region => {
        const marker = L.circleMarker(region.coordinates, {
          radius: 12,
          fillColor: getMarkerColor(region.riskLevel),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div class="p-3 min-w-[250px]">
            <h3 class="font-bold text-lg mb-2">${region.name}</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Risk Level:</span>
                <span class="font-medium px-2 py-1 rounded text-xs ${
                  region.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  region.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }">${region.riskLevel.toUpperCase()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Animals:</span>
                <span class="font-medium">${region.animals.join(', ')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Recent Sightings:</span>
                <span class="font-medium">${region.recentSightings}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Alert:</span>
                <span class="font-medium">${region.lastAlert}</span>
              </div>
            </div>
            <button onclick="alert('Sending SMS alert to nearby villages...')" 
                    class="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              Send Alert to Villages
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add click event
        marker.on('click', () => {
          setSelectedRegion(region);
        });
      });

      // Add a legend control
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 10px 0; font-weight: bold;">Risk Levels</h4>
            <div style="margin: 5px 0;"><span style="display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></span>High Risk</div>
            <div style="margin: 5px 0;"><span style="display: inline-block; width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></span>Medium Risk</div>
            <div style="margin: 5px 0;"><span style="display: inline-block; width: 12px; height: 12px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span>Low Risk</div>
          </div>
        `;
        return div;
      };
      legend.addTo(map);

      mapInstanceRef.current = map;
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <BackButton onClick={() => setCurrentRoute('/')} />
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Risk Zone Map</h1>
        <p className="text-slate-600">Interactive conflict prediction and safe route planning</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Map Container */}
            <div className="relative">
              <div 
                ref={mapRef} 
                className="w-full"
                style={{ height: '800px' }}
              />
              
              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-slate-600">Live Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Footer with Legend */}
            <div className="p-4 border-t bg-slate-50">
              <div className="flex justify-between items-center text-sm">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                    <span>Safe Zones</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
                    <span>High Risk</span>
                  </div>
                </div>
                <div className="text-slate-500">
                  Click markers for detailed information
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Live Status
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Active Regions</span>
                <span className="font-semibold text-slate-800">{wildlifeData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">High Risk Areas</span>
                <span className="font-semibold text-red-600">
                  {wildlifeData.filter(r => r.riskLevel === 'high').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Sightings (24h)</span>
                <span className="font-semibold text-slate-800">
                  {wildlifeData.reduce((sum, r) => sum + r.recentSightings, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {wildlifeData
                .filter(region => region.riskLevel === 'high')
                .slice(0, 3)
                .map(region => (
                  <div key={region.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {region.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {region.animals[0]} spotted - {region.lastAlert}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Emergency Alert
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Generate Report
              </button>
              <button className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;