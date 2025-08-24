import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  MapPin,
  Bell,
  Phone,
  Users,
  Camera,
  Map,
  AlertTriangle,
  Calendar,
  Star,
  Navigation,
  Wifi,
  MessageSquare,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  Eye,
  Globe,
  Clock
} from 'lucide-react';

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

// Toggle Switch Component
const ModeToggle = ({ isVillagerMode, onToggle }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-6">
        <div className={`flex items-center ${isVillagerMode ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className="text-2xl mr-2">👨‍🌾</span>
          <span className="font-semibold">Villager Mode</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Classification AI</span>
        </div>
        
        <button
          onClick={onToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            isVillagerMode ? 'bg-emerald-600' : 'bg-slate-400'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
              isVillagerMode ? 'translate-x-1' : 'translate-x-9'
            }`}
          />
        </button>
        
        <div className={`flex items-center ${!isVillagerMode ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className="text-2xl mr-2">🧳</span>
          <span className="font-semibold">Tourist Mode</span>
          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Regression AI</span>
        </div>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color, isActive }) => (
  <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
    isActive ? `border-${color}-500 bg-${color}-50` : 'border-slate-200 bg-white hover:border-slate-300'
  }`}>
    <div className="flex items-start">
      <div className={`p-2 rounded-lg mr-3 ${isActive ? `bg-${color}-100` : 'bg-slate-100'}`}>
        <Icon className={`w-5 h-5 ${isActive ? `text-${color}-600` : 'text-slate-600'}`} />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  </div>
);

// AI Model Info Card
const AIModelCard = ({ title, description, accuracy, features, color, isActive }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
    isActive ? `border-${color}-500` : 'border-slate-300'
  } transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
        isActive ? `bg-${color}-100 text-${color}-800` : 'bg-slate-100 text-slate-600'
      }`}>
        {accuracy}% Accuracy
      </div>
    </div>
    <p className="text-slate-600 mb-4">{description}</p>
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center text-sm">
          <CheckCircle className={`w-4 h-4 mr-2 ${isActive ? `text-${color}-500` : 'text-slate-400'}`} />
          <span className="text-slate-700">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, value, label, change, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-slate-600 text-sm">{label}</p>
        {change && <p className="text-emerald-600 text-xs">↑ {change}</p>}
      </div>
      <Icon className="w-8 h-8 text-emerald-600" />
    </div>
  </div>
);

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, onClick, color = "emerald" }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center p-4 bg-${color}-50 hover:bg-${color}-100 border border-${color}-200 rounded-lg transition-all duration-200 hover:shadow-md`}
  >
    <Icon className={`w-5 h-5 text-${color}-600 mr-2`} />
    <span className={`font-medium text-${color}-800`}>{label}</span>
  </button>
);

// Villager Mode Component
const VillagerMode = () => {
  const villagerFeatures = [
    { icon: Shield, title: "Crop Protection Alerts", description: "Real-time notifications when animals approach your fields", color: "emerald" },
    { icon: Bell, title: "SMS in Local Language", description: "Alerts in Hindi, Tamil, Telugu, and other regional languages", color: "blue" },
    { icon: Phone, title: "Emergency Contacts", description: "Direct line to forest officials and veterinary services", color: "red" },
    { icon: Users, title: "Community Network", description: "Connect with other farmers for coordinated protection", color: "purple" },
    { icon: MapPin, title: "Field Monitoring", description: "Track animal movements near your agricultural land", color: "orange" },
    { icon: Calendar, title: "Seasonal Patterns", description: "Historical data on crop raiding patterns by season", color: "teal" }
  ];

  return (
    <div className="space-y-6">
      {/* AI Model Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIModelCard
          title="Classification AI Model"
          description="Advanced machine learning model trained to classify different wildlife species and predict their behavior patterns around agricultural areas."
          accuracy="94.7"
          features={[
            "Species identification with 94.7% accuracy",
            "Behavior pattern recognition",
            "Crop damage risk assessment",
            "Real-time threat classification"
          ]}
          color="emerald"
          isActive={true}
        />
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-emerald-800 mb-4">Current Status</h3>
          <div className="space-y-4">
            <StatsCard icon={Shield} value="127" label="Crops Protected Today" change="↑ 23%" />
            <StatsCard icon={AlertTriangle} value="3" label="Active Alerts" />
            <StatsCard icon={Users} value="847" label="Farmers Connected" change="↑ 12%" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {villagerFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            isActive={true}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton icon={Bell} label="Set Alert Zone" />
          <QuickActionButton icon={Phone} label="Call Forest Officer" color="red" />
          <QuickActionButton icon={MessageSquare} label="Report Sighting" color="blue" />
          <QuickActionButton icon={Map} label="View Risk Map" color="purple" />
        </div>
      </div>
    </div>
  );
};

// Tourist Mode Component
const TouristMode = () => {
  const touristFeatures = [
    { icon: Map, title: "Safe Trail Suggestions", description: "AI-powered route recommendations based on current wildlife activity", color: "blue" },
    { icon: Camera, title: "Wildlife Photography Guide", description: "Best spots and times for wildlife photography with safety tips", color: "purple" },
    { icon: Navigation, title: "GPS Navigation", description: "Turn-by-turn directions to forest checkpoints and facilities", color: "emerald" },
    { icon: Star, title: "Wildlife Sighting Predictions", description: "Probability-based predictions for animal encounters", color: "orange" },
    { icon: Globe, title: "Eco-Tourism Packages", description: "Curated nature experiences and guided tour bookings", color: "teal" },
    { icon: Wifi, title: "Offline Maps", description: "Downloadable maps for areas with poor connectivity", color: "indigo" },
    { icon: Activity, title: "Fitness Tracking", description: "Monitor your hiking distance, calories, and trail difficulty", color: "pink" },
    { icon: Clock, title: "Best Time Recommendations", description: "Optimal timing for wildlife viewing based on historical data", color: "cyan" }
  ];

  return (
    <div className="space-y-6">
      {/* AI Model Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIModelCard
          title="Regression AI Model"
          description="Sophisticated regression model that predicts wildlife sighting probabilities and optimal viewing conditions for tourists and nature enthusiasts."
          accuracy="91.3"
          features={[
            "Wildlife sighting probability prediction",
            "Optimal timing recommendations",
            "Weather impact analysis",
            "Crowd density forecasting"
          ]}
          color="blue"
          isActive={true}
        />
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Today's Predictions</h3>
          <div className="space-y-4">
            <StatsCard icon={Eye} value="78%" label="Elephant Sighting Chance" color="blue" />
            <StatsCard icon={Camera} value="23" label="Photo Opportunities" color="blue" />
            <StatsCard icon={Users} value="156" label="Active Tourists" color="blue" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {touristFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            isActive={true}
          />
        ))}
      </div>

      {/* Tourist-Specific Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Wildlife Sighting Predictions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Sighting Predictions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                <span className="font-medium">Elephants</span>
              </div>
              <span className="text-emerald-600 font-bold">78%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="font-medium">Tigers</span>
              </div>
              <span className="text-orange-600 font-bold">34%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium">Bears</span>
              </div>
              <span className="text-blue-600 font-bold">52%</span>
            </div>
          </div>
        </div>
        {/* Recommended Trails */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended Trails</h3>
          <div className="space-y-3">
            <div className="p-3 border border-emerald-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-emerald-700">Riverside Trail</h4>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Safe</span>
              </div>
              <p className="text-sm text-slate-600">3.2 km • 1.5 hours • High wildlife activity</p>
            </div>
            <div className="p-3 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-blue-700">Canopy Walk</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Moderate</span>
              </div>
              <p className="text-sm text-slate-600">5.7 km • 2.5 hours • Best for photography</p>
            </div>
            <div className="p-3 border border-orange-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-orange-700">Summit Path</h4>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Challenging</span>
              </div>
              <p className="text-sm text-slate-600">8.4 km • 4 hours • Panoramic views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Tourists */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Tourist Services</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton icon={Map} label="Download Maps" color="blue" />
          <QuickActionButton icon={Camera} label="Photo Guide" color="purple" />
          <QuickActionButton icon={Phone} label="Emergency Help" color="red" />
          <QuickActionButton icon={Calendar} label="Book Tour" color="emerald" />
        </div>
      </div>
    </div>
  );
};

// Main Component
const UserModePage = ({ setCurrentRoute }) => {
  const [isVillagerMode, setIsVillagerMode] = useState(true); // Default to Villager Mode

  return (
    <div className="space-y-6">
      <BackButton onClick={() => setCurrentRoute('/')} />
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">User Mode Selection</h1>
        <p className="text-slate-600">Choose your profile for AI-powered wildlife conflict prevention</p>
      </div>

      {/* Mode Toggle */}
      <ModeToggle 
        isVillagerMode={isVillagerMode} 
        onToggle={() => setIsVillagerMode(!isVillagerMode)} 
      />

      {/* Mode-Specific Content */}
      {isVillagerMode ? <VillagerMode /> : <TouristMode />}
    </div>
  );
};

export default UserModePage;