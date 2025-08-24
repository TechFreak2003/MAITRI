// This is a refactored version of the Maitri App, with all components
// organized within a single file for proper compilation. The components are
// declared before they are used to ensure proper functionality.

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Bell,
  Shield,
  Users,
  MapPin,
  Map,
  MessageSquare,
  Home,
  Menu,
  X,
  BarChart3,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import MapComponent from '../components/MapComponent'
import AlertComponent from '../components/AlertComponent';
import ReportComponent from '../components/ReportComponent';
import UserModePage from '../components/UserMode';
import AnalyticsPage from '../components/AnalyticsPage';

// =========================================================================
// Component Declarations
// =========================================================================

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

// System Status in Sidebar
const SystemStatus = () => (
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-slate-400">ML Engine</span>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-green-400">Active</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Satellites</span>
        <span className="text-emerald-400">3 Online</span>
      </div>
    </div>
  </div>
);

// Quick Navigation Card
const QuickNavCard = ({ title, description, icon: Icon, color, onClick, stats }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-l-4 border-${color}-500`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-3">{description}</p>
    <p className={`text-${color}-600 text-sm font-medium`}>{stats}</p>
  </div>
);

// Metric Card Component
const MetricCard = ({ icon: Icon, value, label, color }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-slate-600 text-sm">{label}</p>
      </div>
      <Icon className={`w-8 h-8 text-${color}-600`} />
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ type, animal, location, time }) => {
  const colors = {
    high: 'red',
    medium: 'yellow',
    low: 'green',
  };
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center">
        <AlertTriangle className={`w-4 h-4 mr-3 text-${colors[type]}-500`} />
        <div>
          <p className="font-medium text-slate-800">{animal} detected</p>
          <p className="text-sm text-slate-600">{location}</p>
        </div>
      </div>
      <span className="text-xs text-slate-500">{time}</span>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ animal, location, severity, time }) => {
  const severityConfig = {
    high: { color: 'red', bg: 'bg-red-50 border-red-500' },
    medium: { color: 'yellow', bg: 'bg-yellow-50 border-yellow-500' },
    low: { color: 'green', bg: 'bg-green-50 border-green-500' },
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityConfig[severity].bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg text-slate-800">{animal} Movement</h4>
          <p className="text-slate-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </p>
          <div className="mt-2 space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
              Send SMS Alert
            </button>
            <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full hover:bg-slate-200 transition-colors">
              View on Map
            </button>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full bg-${severityConfig[severity].color}-200 text-${severityConfig[severity].color}-800`}
          >
            {severity.toUpperCase()}
          </span>
          <p className="text-xs text-slate-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
};

// User Mode Card
const UserModeCard = ({ title, icon, description, features, active }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
      active ? 'border-emerald-500' : 'border-slate-200'
    }`}
  >
    <div className="text-center mb-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-600 mt-2">{description}</p>
    </div>

    <div className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center text-sm text-slate-600">
          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
          {feature}
        </div>
      ))}
    </div>

    <button
      className={`w-full py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`}
    >
      {active ? 'Currently Active' : 'Switch Mode'}
    </button>
  </div>
);

// =========================================================================
// Page Components
// =========================================================================

// Dashboard Home Page
const DashboardHome = ({ setCurrentRoute }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Control Center</h1>
          <p className="text-slate-600">Real-time wildlife conflict monitoring</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {currentTime.toLocaleTimeString()}
          </div>
          <div>{currentTime.toLocaleDateString()}</div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={CheckCircle} value="94.7%" label="ML Accuracy" color="emerald" />
        <MetricCard icon={Bell} value="12" label="Active Alerts" color="red" />
        <MetricCard icon={Shield} value="127" label="Prevented" color="blue" />
        <MetricCard icon={Users} value="847" label="Villages" color="purple" />
      </div>
      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickNavCard
          title="Live Alerts"
          description="View real-time wildlife movements"
          icon={Bell}
          color="red"
          onClick={() => setCurrentRoute('/alerts')}
          stats="12 active alerts"
        />
        <QuickNavCard
          title="Submit Report"
          description="Report wildlife sightings quickly"
          icon={MessageSquare}
          color="emerald"
          onClick={() => setCurrentRoute('/reports')}
          stats="Submit new sighting"
        />
        <QuickNavCard
          title="Risk Map"
          description="Interactive conflict zone map"
          icon={Map}
          color="blue"
          onClick={() => setCurrentRoute('/map')}
          stats="View safe routes"
        />
      </div>
      {/* Recent Activity Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button
            onClick={() => setCurrentRoute('/alerts')}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          <ActivityItem type="high" animal="Elephant" location="Village Kumara" time="5 min ago" />
          <ActivityItem type="medium" animal="Tiger" location="Forest Trail" time="25 min ago" />
          <ActivityItem type="low" animal="Bear" location="River Bank" time="1 hour ago" />
        </div>
      </div>
    </div>
  );
};
// Alerts Page
const AlertsPage = ({ setCurrentRoute }) => {
  return <AlertComponent setCurrentRoute={setCurrentRoute} />;
};

// Reports Page
const ReportsPage = ({ setCurrentRoute }) => {
  return <ReportComponent setCurrentRoute={setCurrentRoute} />;
};

// Map Page - Using the MapComponent directly since it's already a complete page
const MapPage = ({ setCurrentRoute }) => (
  <MapComponent setCurrentRoute={setCurrentRoute} />
);
// =========================================================================
// Main App Component & Router
// =========================================================================

// Mock Router Component
const Router = ({ currentRoute, setCurrentRoute }) => {
  // A simple switch statement to render the correct page component
  switch (currentRoute) {
    case '/alerts':
      return <AlertsPage setCurrentRoute={setCurrentRoute} />;
    case '/reports':
      return <ReportsPage setCurrentRoute={setCurrentRoute} />;
    case '/map':
      return <MapPage setCurrentRoute={setCurrentRoute} />;
    case '/user-mode':
      return <UserModePage setCurrentRoute={setCurrentRoute} />;
    case '/analytics':
      return <AnalyticsPage setCurrentRoute={setCurrentRoute} />;
    default:
      return <DashboardHome setCurrentRoute={setCurrentRoute} />;
  }
};

// Navigation Component
const Navigation = ({ currentRoute, setCurrentRoute, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/alerts', icon: Bell, label: 'Live Alerts' },
    { path: '/reports', icon: MessageSquare, label: 'Quick Report' },
    { path: '/map', icon: Map, label: 'Risk Map' },
    { path: '/user-mode', icon: Users, label: 'User Mode' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">Maitri</h2>
          <p className="text-slate-400 text-sm">Conflict Prevention System</p>
        </div>

        <nav className="mt-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => {
                setCurrentRoute(path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-slate-800 transition-colors ${
                currentRoute === path ? 'bg-slate-800 border-r-2 border-emerald-500' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
        <SystemStatus />
      </div>
    </>
  );
};

// Main App Component
const Dashboard = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans antialiased text-slate-900">
      <Navigation
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="lg:ml-64 p-6 transition-all duration-300">
        <Router currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;