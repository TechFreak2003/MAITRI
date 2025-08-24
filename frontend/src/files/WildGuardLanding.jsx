import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Smartphone, Map, Satellite, Users, Bell, TrendingUp, CheckCircle, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import sightings from '../Dataset/wildlife_sightings.json'
import SimpleMapComponent from '../components/SimpleMapComponent'
// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-amber-300">MAITRI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleMenuClick('#features')} className="text-gray-700 hover:text-emerald-600 transition-colors">Features</button>
            <button onClick={() => handleMenuClick('#how-it-works')} className="text-gray-700 hover:text-emerald-600 transition-colors">How It Works</button>
            <button onClick={() => handleMenuClick('#impact')} className="text-gray-700 hover:text-emerald-600 transition-colors">Impact</button>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors" onClick={() => navigate("/dashboard")} >
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => handleMenuClick('#features')} className="block w-full text-left px-3 py-2 text-gray-700">Features</button>
              <button onClick={() => handleMenuClick('#how-it-works')} className="block w-full text-left px-3 py-2 text-gray-700">How It Works</button>
              <button onClick={() => handleMenuClick('#impact')} className="block w-full text-left px-3 py-2 text-gray-700">Impact</button>
              <button className="w-full text-left bg-emerald-600 text-white px-3 py-2 rounded-lg" onClick={() => navigate("/dashboard")}>
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Alert Card Component
const AlertCard = ({ type, location, time, severity }) => {
  const severityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };

  const severityTextColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${severityColors[severity]} animate-pulse`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`h-5 w-5 ${severityTextColors[severity]}`} />
          <span className="font-semibold">{type} Spotted</span>
          </div>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-700 mt-1">{location}</p>
    </div>
  );
};

// Stats Counter Component
const StatCounter = ({ end, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-2">{count.toLocaleString()}+</div>
      <div className="text-emerald-100">{label}</div>
    </div>
  );
};

// Function to process sightings data and create alerts
const processWildlifeSightings = (sightings) => {
  // Get the most recent 10 sightings and sort by date (descending)
  const recentSightings = sightings
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return recentSightings.map((sighting, index) => {
    // Determine severity based on species and group size
    let severity = 'low';
    if (sighting.common_name === 'Asian Elephant' && sighting.group_size > 5) {
      severity = 'high';
    } else if (sighting.common_name === 'Tiger' || (sighting.common_name === 'Asian Elephant' && sighting.group_size >= 3)) {
      severity = 'medium';
    } else if (sighting.group_size > 6) {
      severity = 'medium';
    }

    // Calculate time ago (mock recent times for demo)
    const timesAgo = ['2 min ago', '8 min ago', '15 min ago', '23 min ago', '35 min ago', '45 min ago', '1 hr ago', '2 hr ago', '3 hr ago', '4 hr ago'];
    
    // Format location to be more readable
    let formattedLocation = sighting.location;
    if (sighting.group_size > 1) {
      formattedLocation += ` (Group of ${sighting.group_size})`;
    }

    return {
      type: sighting.common_name,
      location: formattedLocation,
      time: timesAgo[index] || `${index + 1} hr ago`,
      severity: severity
    };
  });
};

// Main Landing Page Component
const MaitriLanding = () => {
  const [currentAlert, setCurrentAlert] = useState(0);
  const navigate = useNavigate();

  // Process the real wildlife data
  const realAlerts = processWildlifeSightings(sightings);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % realAlerts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [realAlerts.length]);

  const features = [
    {
      icon: <Satellite className="h-8 w-8" />,
      title: "Satellite Intelligence",
      description: "Advanced satellite imagery analysis combined with weather data and historical wildlife movement patterns"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Reporting",
      description: "Crowdsourced alerts from villagers via mobile app and SMS for real-time wildlife spotting"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Instant Alerts",
      description: "Real-time notifications sent via SMS, WhatsApp, and mobile app to communities and forest rangers"
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Smart Resource Mapping",
      description: "Interactive maps showing safe grazing areas, high-risk zones, and recommended safe passages"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='53' cy='7' r='2'/%3E%3Ccircle cx='7' cy='53' r='2'/%3E%3Ccircle cx='53' cy='53' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Protecting
                <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  Communities
                </span>
                & Wildlife
              </h1>
              
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                AI-powered conflict prediction system that forecasts wildlife intrusions using satellite data, 
                community reports, and machine learning to save lives and protect wildlife.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={() => navigate("/dashboard")} className="bg-white text-emerald-800 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors transform hover:scale-105">
                  Get Started
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-800 transition-colors">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <StatCounter end={500} label="Communities Protected" />
                <StatCounter end={1200} label="Alerts Sent" />
                <StatCounter end={85} label="Conflicts Prevented" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Live Alerts
                </h3>
                <AlertCard {...realAlerts[currentAlert]} />
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Risk Level: Medium
                </h3>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full w-3/5 animate-pulse"></div>
                </div>
                <p className="text-emerald-100 text-sm mt-2">Based on recent elephant movement patterns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Maitri AI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive system combines cutting-edge technology with community participation 
              to predict and prevent wildlife-human conflicts before they happen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three-Step Protection Process
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Data Collection</h3>
              <p className="text-gray-600 mb-6">
                Satellite imagery, weather patterns, historical wildlife movement data, and real-time community reports
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Satellite monitoring 24/7
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Community SMS reports
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Weather data integration
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Prediction</h3>
              <p className="text-gray-600 mb-6">
                Advanced LSTM machine learning models analyze patterns to predict conflict hotspots and timing
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  LSTM neural networks
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Pattern recognition
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Risk assessment
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Alert & Response</h3>
              <p className="text-gray-600 mb-6">
                Instant notifications to communities and rangers with actionable safety guidance and resource maps
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  SMS & WhatsApp alerts
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Mobile app notifications
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Safe route guidance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Making a Real Impact
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Every alert sent, every conflict prevented, every life saved - our mission is to create 
                harmony between human communities and wildlife through technology.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">92%</div>
                  <div className="text-gray-600">Accuracy Rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">15min</div>
                  <div className="text-gray-600">Average Alert Time</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-gray-600">Villages Protected</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">Zero</div>
                  <div className="text-gray-600">Human Casualties</div>
                </div>
              </div>

              <button onClick={() => navigate("/dashboard")} className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Join Our Mission
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Resource Safety Map</h3>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0" > <SimpleMapComponent/></div>
                  <div className="text-center z-10">
                    <Map className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive map showing safe zones, high-risk areas, and recommended routes</p>
                  </div>
                  
                  {/* Animated dots representing safe/danger zones */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-12 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Protect Your Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of communities already using MAITREI AI to prevent conflicts and save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/dashboard")} className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-800">MAITREI AI</span>
              </div>
              <p className="text-gray-600 mb-4">
                Protecting communities and wildlife through AI-powered conflict prediction and prevention.
              </p>
              <div className="text-sm text-gray-500">
                © 2025 Maitrei AI. All rights reserved.
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Mobile App</div>
                <div>Dashboard</div>
                <div>API Access</div>
                <div>Reports</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Help Center</div>
                <div>Community Forum</div>
                <div>Contact Us</div>
                <div>Emergency Line</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MaitriLanding;
