import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, AlertTriangle, X, Eye, EyeOff } from 'lucide-react';

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

// Animal data with starting positions and routes across different national parks
const ANIMALS = [
  // Jim Corbett National Park - Elephants
  {
    id: 'elephant-1',
    type: 'elephant',
    name: 'Tusker Alpha',
    icon: '🐘',
    speed: 0.001, // Increased from 0.0005
    park: 'Jim Corbett NP',
    startPosition: [29.5319, 78.7718],
    route: [
      [29.5319, 78.7718],
      [29.5330, 78.7730],
      [29.5345, 78.7745],
      [29.5360, 78.7760],
      [29.5375, 78.7775],
      [29.5390, 78.7790], // Close to Corbett Village
      [29.5405, 78.7805],
      [29.5420, 78.7820]
    ]
  },
  {
    id: 'elephant-2',
    type: 'elephant',
    name: 'Gentle Giant',
    icon: '🐘',
    speed: 0.0006, // Increased from 0.0003
    park: 'Kaziranga NP',
    startPosition: [26.5775, 93.1716],
    route: [
      [26.5775, 93.1716],
      [26.5785, 93.1730],
      [26.5800, 93.1745],
      [26.5815, 93.1760],
      [26.5830, 93.1775], // Close to Kaziranga Village
      [26.5845, 93.1790],
      [26.5860, 93.1805]
    ]
  },
  // Ranthambore National Park - Tigers
  {
    id: 'tiger-1',
    type: 'tiger',
    name: 'Stripe King',
    icon: '🐅',
    speed: 0.0008, // Increased from 0.0004
    park: 'Ranthambore NP',
    startPosition: [26.0212, 76.5028],
    route: [
      [26.0212, 76.5028],
      [26.0225, 76.5040],
      [26.0240, 76.5055],
      [26.0255, 76.5070],
      [26.0270, 76.5085], // Close to Ranthambore Village
      [26.0285, 76.5100],
      [26.0300, 76.5115]
    ]
  },
  {
    id: 'tiger-2',
    type: 'tiger',
    name: 'Shadow Hunter',
    icon: '🐅',
    speed: 0.0004, // Increased from 0.0002
    park: 'Sundarbans NP',
    startPosition: [21.9497, 88.4297],
    route: [
      [21.9497, 88.4297],
      [21.9510, 88.4310],
      [21.9525, 88.4325],
      [21.9540, 88.4340],
      [21.9555, 88.4355], // Close to Sundarbans Village
      [21.9570, 88.4370],
      [21.9585, 88.4385]
    ]
  },
  // Gir Forest - Lions
  {
    id: 'lion-1',
    type: 'lion',
    name: 'Mane Majesty',
    icon: '🦁',
    speed: 0.0002, // Increased from 0.0001
    park: 'Gir Forest NP',
    startPosition: [21.1681, 70.8202],
    route: [
      [21.1681, 70.8202],
      [21.1695, 70.8215],
      [21.1710, 70.8230],
      [21.1725, 70.8245],
      [21.1740, 70.8260], // Close to Gir Village
      [21.1755, 70.8275],
      [21.1770, 70.8290]
    ]
  },
  // Bandipur National Park - Leopards and Bears
  {
    id: 'leopard-1',
    type: 'leopard',
    name: 'Spot Master',
    icon: '🐆',
    speed: 0.0012, // Increased from 0.0006
    park: 'Bandipur NP',
    startPosition: [11.6500, 76.6333],
    route: [
      [11.6500, 76.6333],
      [11.6515, 76.6348],
      [11.6530, 76.6363],
      [11.6545, 76.6378],
      [11.6560, 76.6393], // Close to Bandipur Village
      [11.6575, 76.6408],
      [11.6590, 76.6423]
    ]
  },
  {
    id: 'bear-1',
    type: 'bear',
    name: 'Forest Guardian',
    icon: '🐻',
    speed: 0.0003, // Increased from 0.00015
    park: 'Bandipur NP',
    startPosition: [11.6600, 76.6400],
    route: [
      [11.6600, 76.6400],
      [11.6610, 76.6410],
      [11.6625, 76.6425],
      [11.6640, 76.6440],
      [11.6655, 76.6455], // Close to Mountain Village
      [11.6670, 76.6470],
      [11.6685, 76.6485]
    ]
  },
  // Kanha National Park - Additional Tiger
  {
    id: 'tiger-3',
    type: 'tiger',
    name: 'Forest Phantom',
    icon: '🐅',
    speed: 0.00016, // Increased from 0.00008
    park: 'Kanha NP',
    startPosition: [22.3364, 80.6409],
    route: [
      [22.3364, 80.6409],
      [22.3375, 80.6420],
      [22.3390, 80.6435],
      [22.3405, 80.6450],
      [22.3420, 80.6465], // Close to Kanha Village
      [22.3435, 80.6480],
      [22.3450, 80.6495]
    ]
  }
];

// Human settlements/villages - strategically placed near national parks
const HUMAN_SETTLEMENTS = [
  { id: 'village-1', name: 'Corbett Village', position: [29.5390, 78.7790], population: 450, risk: 'high' },
  { id: 'village-2', name: 'Kaziranga Village', position: [26.5830, 93.1775], population: 320, risk: 'medium' },
  { id: 'village-3', name: 'Ranthambore Village', position: [26.0270, 76.5085], population: 380, risk: 'high' },
  { id: 'village-4', name: 'Sundarbans Village', position: [21.9555, 88.4355], population: 280, risk: 'medium' },
  { id: 'village-5', name: 'Gir Village', position: [21.1740, 70.8260], population: 350, risk: 'low' },
  { id: 'village-6', name: 'Bandipur Village', position: [11.6560, 76.6393], population: 400, risk: 'high' },
  { id: 'village-7', name: 'Mountain Village', position: [11.6655, 76.6455], population: 220, risk: 'medium' },
  { id: 'village-8', name: 'Kanha Village', position: [22.3420, 80.6465], population: 310, risk: 'low' }
];

// Severity configuration for different alert types
const SEVERITY_CONFIG = {
  critical: {
    color: 'red',
    bgClass: 'bg-gradient-to-r from-red-600 to-red-700',
    borderClass: 'border-red-800',
    textClass: 'text-red-700',
    bgLightClass: 'bg-red-50',
    icon: '🚨',
    title: 'CRITICAL ALERT',
    distance: 1000, // 1km
    priority: 3,
    shadow: 'shadow-2xl shadow-red-500/50',
    glow: 'ring-4 ring-red-500/30'
  },
  high: {
    color: 'orange',
    bgClass: 'bg-gradient-to-r from-orange-600 to-red-600',
    borderClass: 'border-orange-800',
    textClass: 'text-orange-700',
    bgLightClass: 'bg-orange-50',
    icon: '⚠️',
    title: 'HIGH ALERT',
    distance: 2000, // 2km
    priority: 2,
    shadow: 'shadow-2xl shadow-orange-500/50',
    glow: 'ring-4 ring-orange-500/30'
  },
  medium: {
    color: 'yellow',
    bgClass: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    borderClass: 'border-yellow-700',
    textClass: 'text-yellow-800',
    bgLightClass: 'bg-yellow-50',
    icon: '⚡',
    title: 'MEDIUM ALERT',
    distance: 3000, // 3km
    priority: 1,
    shadow: 'shadow-2xl shadow-yellow-500/50',
    glow: 'ring-4 ring-yellow-500/30'
  },
  low: {
    color: 'blue',
    bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    borderClass: 'border-blue-800',
    textClass: 'text-blue-700',
    bgLightClass: 'bg-blue-50',
    icon: 'ℹ️',
    title: 'LOW ALERT',
    distance: 4000, // 4km
    priority: 0,
    shadow: 'shadow-2xl shadow-blue-500/50',
    glow: 'ring-4 ring-blue-500/30'
  }
};

// Alert notification component with minimal design
const AlertNotification = ({ alert, onDismiss, style }) => {
  const severity = SEVERITY_CONFIG[alert.severity];
  
  return (
    <div 
      className={`fixed right-4 ${severity.bgClass} text-white p-2 rounded ${severity.shadow} border ${severity.borderClass} w-64 z-50 animate-slide-in transition-all duration-300`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-sm">{severity.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {alert.animal.icon} {alert.animal.name} → {alert.settlement.name}
            </p>
            <p className="text-xs opacity-80">
              {(alert.distance/1000).toFixed(1)}km • {alert.settlement.population} people
            </p>
          </div>
        </div>
        <button 
          onClick={onDismiss}
          className="text-white/80 hover:text-white transition-colors ml-1"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Control panel component
const ControlPanel = ({ 
  isSimulationRunning, 
  onPlayPause, 
  onReset, 
  visibleAnimals,
  onToggleAnimalVisibility,
  stats
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSimulationRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSimulationRunning ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {isSimulationRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </button>
        </div>
        
        <div className="text-xs text-slate-600">
          {Object.keys(visibleAnimals).filter(id => visibleAnimals[id]).length} of {ANIMALS.length} animals active
        </div>
      </div>
      
      {/* Wildlife tracking and stats in same row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Wildlife tracking - takes 3/4 of the space */}
        <div className="lg:col-span-3 border rounded-lg p-2 bg-slate-50">
          <h5 className="font-medium text-slate-700 text-xs mb-2">Wildlife Tracking</h5>
          <div className="flex flex-wrap gap-1">
            {ANIMALS.map(animal => (
              <button
                key={animal.id}
                onClick={() => onToggleAnimalVisibility(animal.id)}
                className={`flex items-center px-2 py-1 rounded text-xs transition-colors ${
                  visibleAnimals[animal.id]
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                {visibleAnimals[animal.id] ? <Eye className="w-2 h-2 mr-1" /> : <EyeOff className="w-2 h-2 mr-1" />}
                <span className="text-sm">{animal.icon}</span>
                <span className="ml-1 truncate max-w-16">{animal.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Live statistics - takes 1/4 of the space */}
        <div className="lg:col-span-1 border rounded-lg p-2 bg-slate-50">
          <h5 className="font-medium text-slate-700 text-xs mb-2 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1 text-orange-600" />
            Live Stats
          </h5>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Animals:</span>
              <span className="font-medium text-blue-600">{stats.activeAnimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Villages:</span>
              <span className="font-medium text-green-600">{stats.settlements}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Alerts:</span>
              <span className="font-medium text-red-600">{stats.totalAlerts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Active:</span>
              <span className="font-medium text-orange-600">{stats.activeAlerts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const RealtimeSimulation = ({ setCurrentRoute }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const animalMarkersRef = useRef({});
  const settlementMarkersRef = useRef({});
  const alertCooldownRef = useRef({}); // Add cooldown tracking
  
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [animalPositions, setAnimalPositions] = useState({});
  const [routeProgress, setRouteProgress] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    activeAnimals: 0,
    settlements: HUMAN_SETTLEMENTS.length,
    totalAlerts: 0,
    activeAlerts: 0
  });
  const [visibleAnimals, setVisibleAnimals] = useState(
    ANIMALS.reduce((acc, animal) => ({ ...acc, [animal.id]: true }), {})
  );

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && window.L) {
      const L = window.L;
      
      const map = L.map(mapRef.current, {
        center: [23.0, 78.0],
        zoom: 6,
        scrollWheelZoom: true,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Initialize animal positions and markers
      const initialPositions = {};
      const initialProgress = {};
      
      ANIMALS.forEach(animal => {
        initialPositions[animal.id] = [...animal.startPosition];
        initialProgress[animal.id] = 0;
        
        // Create custom HTML marker with emoji
        const animalIcon = L.divIcon({
          html: `<div style="font-size: 24px; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${animal.icon}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'animal-marker'
        });
        
        // Create animal marker
        const marker = L.marker(animal.startPosition, {
          icon: animalIcon
        }).addTo(map);

        marker.bindTooltip(`${animal.icon} ${animal.name}`, {
          permanent: false,
          direction: 'top',
          offset: [0, -20]
        });

        animalMarkersRef.current[animal.id] = marker;
      });

      // Add settlement markers
      HUMAN_SETTLEMENTS.forEach(settlement => {
        const marker = L.circleMarker(settlement.position, {
          radius: 12,
          fillColor: '#3B82F6',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindTooltip(`🏘️ ${settlement.name}<br/>Population: ${settlement.population}`, {
          permanent: false,
          direction: 'top'
        });

        settlementMarkersRef.current[settlement.id] = marker;
      });

      setAnimalPositions(initialPositions);
      setRouteProgress(initialProgress);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((pos1, pos2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1[0] * Math.PI/180;
    const φ2 = pos2[0] * Math.PI/180;
    const Δφ = (pos2[0]-pos1[0]) * Math.PI/180;
    const Δλ = (pos2[1]-pos1[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }, []);

  // Function to determine alert severity based on distance and animal type
  const determineSeverity = useCallback((distance, animalType, settlementRisk) => {
    // Critical for large predators very close to high-risk settlements
    if (distance < SEVERITY_CONFIG.critical.distance && 
        (animalType === 'tiger' || animalType === 'lion') && 
        settlementRisk === 'high') {
      return 'critical';
    }
    
    // High for any predator close to settlement or elephants very close
    if (distance < SEVERITY_CONFIG.high.distance && 
        (animalType === 'tiger' || animalType === 'lion' || animalType === 'leopard' || 
         (animalType === 'elephant' && settlementRisk === 'high'))) {
      return 'high';
    }
    
    // Medium for moderate distances or bears
    if (distance < SEVERITY_CONFIG.medium.distance && 
        (animalType === 'bear' || settlementRisk === 'medium')) {
      return 'medium';
    }
    
    // Low for distant animals or low-risk settlements
    return 'low';
  }, []);

  // Check for proximity alerts with severity-based system
  const checkProximityAlerts = useCallback((positions) => {
    // Only allow one alert at a time for sequential display
    if (alerts.length > 0) return;
    
    const newAlerts = [];
    const MAX_DISTANCE = 4000; // 4km maximum alert distance
    const COOLDOWN_TIME = 45000; // 45 seconds cooldown for sequential alerts
    const currentTime = Date.now();

    Object.entries(positions).forEach(([animalId, position]) => {
      if (!visibleAnimals[animalId]) return;
      
      const animal = ANIMALS.find(a => a.id === animalId);
      
      HUMAN_SETTLEMENTS.forEach(settlement => {
        const distance = calculateDistance(position, settlement.position);
        const cooldownKey = `${animalId}-${settlement.id}`;
        
        // Check if this pair is in cooldown
        const lastAlertTime = alertCooldownRef.current[cooldownKey] || 0;
        const isInCooldown = (currentTime - lastAlertTime) < COOLDOWN_TIME;
        
        if (distance < MAX_DISTANCE && !isInCooldown) {
          const severity = determineSeverity(distance, animal.type, settlement.risk);
          
          newAlerts.push({
            id: `${animalId}-${settlement.id}-${Date.now()}`,
            animal,
            settlement,
            distance: Math.round(distance),
            severity,
            priority: SEVERITY_CONFIG[severity].priority,
            timestamp: new Date()
          });
          
          // Set cooldown for this animal-settlement pair
          alertCooldownRef.current[cooldownKey] = currentTime;
        }
      });
    });

    if (newAlerts.length > 0) {
      // Only take the highest priority alert
      const highestPriorityAlert = newAlerts.sort((a, b) => b.priority - a.priority)[0];
      
      setAlerts([highestPriorityAlert]); // Only one alert at a time
      setStats(prev => ({ 
        ...prev, 
        totalAlerts: prev.totalAlerts + 1,
        activeAlerts: 1
      }));
    }
  }, [alerts, visibleAnimals, calculateDistance, determineSeverity]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isSimulationRunning) return;

    setAnimalPositions(prevPositions => {
      const newPositions = { ...prevPositions };
      
      setRouteProgress(prevProgress => {
        const newProgress = { ...prevProgress };
        
        ANIMALS.forEach(animal => {
          if (!visibleAnimals[animal.id]) return;
          
          const currentProgress = newProgress[animal.id];
          const route = animal.route;
          const currentSegment = Math.floor(currentProgress);
          const segmentProgress = currentProgress - currentSegment;
          
          if (currentSegment < route.length - 1) {
            const start = route[currentSegment];
            const end = route[currentSegment + 1];
            
            // Interpolate position
            const lat = start[0] + (end[0] - start[0]) * segmentProgress;
            const lng = start[1] + (end[1] - start[1]) * segmentProgress;
            
            newPositions[animal.id] = [lat, lng];
            
            // Update marker position
            if (animalMarkersRef.current[animal.id]) {
              animalMarkersRef.current[animal.id].setLatLng([lat, lng]);
            }
            
            // Advance progress
            newProgress[animal.id] = currentProgress + animal.speed;
          } else {
            // Reset to beginning of route
            newProgress[animal.id] = 0;
            newPositions[animal.id] = [...route[0]];
            if (animalMarkersRef.current[animal.id]) {
              animalMarkersRef.current[animal.id].setLatLng(route[0]);
            }
          }
        });
        
        return newProgress;
      });
      
      // Check for proximity alerts
      checkProximityAlerts(newPositions);
      
      return newPositions;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSimulationRunning, visibleAnimals, checkProximityAlerts]);

  // Start/stop animation
  useEffect(() => {
    if (isSimulationRunning) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulationRunning, animate]);

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts([]);
        setStats(prev => ({
          ...prev,
          activeAlerts: 0
        }));
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Update stats
  useEffect(() => {
    const activeCount = Object.values(visibleAnimals).filter(Boolean).length;
    setStats(prev => ({ 
      ...prev, 
      activeAnimals: activeCount,
      activeAlerts: alerts.length
    }));
  }, [visibleAnimals, alerts]);

  // Control functions
  const handlePlayPause = () => {
    setIsSimulationRunning(!isSimulationRunning);
  };

  const handleReset = () => {
    setIsSimulationRunning(false);
    setAlerts([]);
    setStats(prev => ({ ...prev, totalAlerts: 0, activeAlerts: 0 }));
    
    // Clear alert cooldowns
    alertCooldownRef.current = {};
    
    // Reset animal positions
    const initialPositions = {};
    const initialProgress = {};
    
    ANIMALS.forEach(animal => {
      initialPositions[animal.id] = [...animal.startPosition];
      initialProgress[animal.id] = 0;
      
      if (animalMarkersRef.current[animal.id]) {
        animalMarkersRef.current[animal.id].setLatLng(animal.startPosition);
      }
    });
    
    setAnimalPositions(initialPositions);
    setRouteProgress(initialProgress);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleToggleAnimalVisibility = (animalId) => {
    setVisibleAnimals(prev => {
      const newVisibility = { ...prev, [animalId]: !prev[animalId] };
      
      // Update marker visibility
      if (animalMarkersRef.current[animalId]) {
        if (newVisibility[animalId]) {
          animalMarkersRef.current[animalId].addTo(mapInstanceRef.current);
        } else {
          animalMarkersRef.current[animalId].remove();
        }
      }
      
      return newVisibility;
    });
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={() => setCurrentRoute('/')} />
      
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Realtime Animal Simulation</h1>
        <p className="text-slate-600">Live wildlife movement tracking with proximity alerts</p>
      </div>

      <ControlPanel
        isSimulationRunning={isSimulationRunning}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        visibleAnimals={visibleAnimals}
        onToggleAnimalVisibility={handleToggleAnimalVisibility}
        stats={stats}
      />

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Map Section - Full Width */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <div 
                ref={mapRef} 
                className="w-full"
                style={{ height: '850px' }}
              />
              
              {/* Live indicator */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${isSimulationRunning ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-slate-600">
                    {isSimulationRunning ? 'LIVE SIMULATION' : 'SIMULATION PAUSED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Alert Notification - Sequential Display */}
      {alerts.length > 0 && (
        <AlertNotification
          alert={alerts[0]}
          onDismiss={() => handleDismissAlert(alerts[0].id)}
          style={{
            top: '80px',
            zIndex: 50
          }}
        />
      )}
    </div>
  );
};

export default RealtimeSimulation;