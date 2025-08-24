import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Eye, Users, Activity } from 'lucide-react';
import sightingsData from '../Dataset/wildlife_sightings.json';

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    <span className="text-sm font-medium">Back to Dashboard</span>
  </button>
);

// Map Modal Component
const MapModal = ({ isOpen, onClose, sighting }) => {
  if (!isOpen || !sighting) return null;

  // Show full India map with marker - coordinates cover entire Indian subcontinent
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=68.0,6.0,97.0,37.5&layer=mapnik&marker=${sighting.latitude},${sighting.longitude}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full h-full max-w-[1400px] max-h-[900px] shadow-2xl border border-gray-200 flex flex-col">
        <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{sighting.common_name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-base font-medium">{sighting.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                <span className="mr-6">Group size: {sighting.group_size}</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                  {Number(sighting.latitude).toFixed(4)}°N, {Number(sighting.longitude).toFixed(4)}°E
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 hover:bg-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all shadow-sm hover:shadow-md"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 min-h-0">
          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg bg-gray-100">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${sighting.common_name} Location on India Map`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ sighting, onViewMap }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-900">{sighting.common_name}</h4>
          <div className="flex items-center text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{sighting.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">Group size: {sighting.group_size}</span>
          </div>
        </div>

        <button
          onClick={() => onViewMap(sighting)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Location
        </button>
      </div>
      
      <div className="ml-4 text-right">
        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded">
          <div className="font-mono">{Number(sighting.latitude).toFixed(4)}°N</div>
          <div className="font-mono">{Number(sighting.longitude).toFixed(4)}°E</div>
        </div>
      </div>
    </div>
  </div>
);

// Stats Component
const StatsBar = ({ totalSightings }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Wildlife Monitoring</h2>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalSightings}</p>
        <p className="text-sm text-gray-600 mt-1">Active Sightings Detected</p>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500 mb-2">System Status</div>
        <div className="flex items-center justify-end">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">Live Monitoring</span>
        </div>
      </div>
    </div>
  </div>
);

const AlertComponent = ({ setCurrentRoute }) => {
  const [sightings, setSightings] = useState([]);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const processedSightings = sightingsData
        .filter(sighting => sighting.common_name && sighting.location && sighting.latitude && sighting.longitude)
        .sort((a, b) => new Date(b.date || '2025-08-24') - new Date(a.date || '2025-08-24'))
        .slice(0, 15);
      
      setSightings(processedSightings);
      setLoading(false);
    } catch (error) {
      console.error('Error loading sightings data:', error);
      setSightings([]);
      setLoading(false);
    }
  }, []);

  const handleViewMap = (sighting) => {
    setSelectedSighting(sighting);
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
    setSelectedSighting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BackButton onClick={() => setCurrentRoute('/')} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Wildlife Monitoring System</h1>
          <p className="text-lg text-gray-600">Real-time wildlife tracking and location monitoring across protected areas</p>
        </div>

        <StatsBar totalSightings={sightings.length} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-900">Recent Sightings</h2>
            <p className="text-sm text-gray-600 mt-1">Latest wildlife activity detected across monitoring stations</p>
          </div>
          
          <div className="p-6">
            {sightings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No wildlife sightings available</p>
                <p className="text-sm">Check back later for updates</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
                {sightings.map((sighting, index) => (
                  <AlertCard
                    key={`${sighting.common_name}-${sighting.location}-${index}`}
                    sighting={sighting}
                    onViewMap={handleViewMap}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <MapModal
          isOpen={isMapOpen}
          onClose={handleCloseMap}
          sighting={selectedSighting}
        />
      </div>
    </div>
  );
};

export default AlertComponent;
