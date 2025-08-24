import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  Calendar,
  Download,
  Filter,
  Eye,
  Zap,
  Target,
  CheckCircle,
  Bell
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

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

// Sample Data
const conflictData = [
  { month: 'Jan', conflicts: 45, prevented: 38, response: 92 },
  { month: 'Feb', conflicts: 52, prevented: 45, response: 88 },
  { month: 'Mar', conflicts: 38, prevented: 34, response: 95 },
  { month: 'Apr', conflicts: 61, prevented: 56, response: 89 },
  { month: 'May', conflicts: 44, prevented: 41, response: 94 },
  { month: 'Jun', conflicts: 67, prevented: 62, response: 91 },
  { month: 'Jul', conflicts: 73, prevented: 68, response: 93 },
  { month: 'Aug', conflicts: 55, prevented: 52, response: 96 },
];

const speciesData = [
  { name: 'Elephants', value: 47, color: '#ef4444', incidents: 234, trend: 'up' },
  { name: 'Tigers', value: 23, color: '#f97316', incidents: 115, trend: 'down' },
  { name: 'Bears', value: 18, color: '#eab308', incidents: 89, trend: 'up' },
  { name: 'Leopards', value: 8, color: '#22c55e', incidents: 42, trend: 'stable' },
  { name: 'Others', value: 4, color: '#3b82f6', incidents: 20, trend: 'down' }
];

const timeSeriesData = [
  { time: '00:00', alerts: 2 },
  { time: '02:00', alerts: 1 },
  { time: '04:00', alerts: 3 },
  { time: '06:00', alerts: 8 },
  { time: '08:00', alerts: 12 },
  { time: '10:00', alerts: 6 },
  { time: '12:00', alerts: 4 },
  { time: '14:00', alerts: 7 },
  { time: '16:00', alerts: 9 },
  { time: '18:00', alerts: 15 },
  { time: '20:00', alerts: 18 },
  { time: '22:00', alerts: 11 }
];

const regionData = [
  { region: 'North Zone', conflicts: 89, population: 12500, efficiency: 94 },
  { region: 'South Zone', conflicts: 76, population: 9800, efficiency: 91 },
  { region: 'East Zone', conflicts: 134, population: 15600, efficiency: 87 },
  { region: 'West Zone', conflicts: 67, population: 8200, efficiency: 96 },
  { region: 'Central Zone', conflicts: 98, population: 11400, efficiency: 89 }
];

const performanceData = [
  { metric: 'Accuracy', value: 94.7, target: 95, color: '#10b981' },
  { metric: 'Response', value: 91.2, target: 90, color: '#3b82f6' },
  { metric: 'Coverage', value: 87.8, target: 85, color: '#f59e0b' },
  { metric: 'Uptime', value: 99.1, target: 99, color: '#8b5cf6' }
];

// Metric Card with Animation
const AnimatedMetricCard = ({ icon: Icon, value, label, change, color, trend }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {change && (
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">
        {typeof value === 'string' && value.includes('%') ? 
          `${displayValue.toFixed(1)}%` : 
          Math.round(displayValue).toLocaleString()
        }
      </p>
      <p className="text-slate-600 text-sm">{label}</p>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, subtitle, children, actions }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-slate-600 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    {children}
  </div>
);

// Performance Gauge Component
const PerformanceGauge = ({ data }) => (
  <div className="grid grid-cols-2 gap-4">
    {data.map((item, index) => (
      <div key={index} className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={item.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${item.value * 2.51} 251`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-800">{item.value}%</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-800">{item.metric}</p>
        <p className="text-xs text-slate-500">Target: {item.target}%</p>
      </div>
    ))}
  </div>
);

// Species Activity Component
const SpeciesActivityCard = ({ data }) => (
  <div className="space-y-4">
    {data.map((species, index) => (
      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style={{ backgroundColor: species.color }}
          ></div>
          <div>
            <p className="font-medium text-slate-800">{species.name}</p>
            <p className="text-xs text-slate-500">{species.incidents} incidents</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: `${species.value}%`, 
                backgroundColor: species.color 
              }}
            ></div>
          </div>
          <span className="text-sm font-bold text-slate-800 w-10">{species.value}%</span>
          {species.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
          {species.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
          {species.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-slate-400"></div>}
        </div>
      </div>
    ))}
  </div>
);

// Regional Performance Table
const RegionalTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          <th className="text-left py-3 px-2 font-semibold text-slate-700">Region</th>
          <th className="text-center py-3 px-2 font-semibold text-slate-700">Conflicts</th>
          <th className="text-center py-3 px-2 font-semibold text-slate-700">Population</th>
          <th className="text-center py-3 px-2 font-semibold text-slate-700">Efficiency</th>
        </tr>
      </thead>
      <tbody>
        {data.map((region, index) => (
          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="py-3 px-2 font-medium text-slate-800">{region.region}</td>
            <td className="py-3 px-2 text-center">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                {region.conflicts}
              </span>
            </td>
            <td className="py-3 px-2 text-center text-slate-600">{region.population.toLocaleString()}</td>
            <td className="py-3 px-2 text-center">
              <div className="flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${region.efficiency >= 95 ? 'bg-green-400' : region.efficiency >= 90 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                <span className="font-medium">{region.efficiency}%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnalyticsPage = ({ setCurrentRoute }) => {
  const [timeFilter, setTimeFilter] = useState('7d');

  return (
    <div className="space-y-6">
      <BackButton onClick={() => setCurrentRoute('/')} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive conflict patterns and system performance insights</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedMetricCard 
          icon={Shield} 
          value="847" 
          label="Conflicts Prevented" 
          change="+12%" 
          trend="up" 
          color="emerald" 
        />
        <AnimatedMetricCard 
          icon={AlertTriangle} 
          value="152" 
          label="Active Alerts" 
          change="-8%" 
          trend="down" 
          color="red" 
        />
        <AnimatedMetricCard 
          icon={Target} 
          value="94.7%" 
          label="Prediction Accuracy" 
          change="+2.3%" 
          trend="up" 
          color="blue" 
        />
        <AnimatedMetricCard 
          icon={Clock} 
          value="23" 
          label="Avg Response (sec)" 
          change="-5s" 
          trend="down" 
          color="purple" 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conflict Trends */}
        <ChartCard 
          title="Conflict Trends" 
          subtitle="Monthly conflicts vs prevention rate"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conflictData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="conflicts" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Conflicts"
              />
              <Line 
                type="monotone" 
                dataKey="prevented" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Prevented"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hourly Activity */}
        <ChartCard 
          title="24-Hour Activity Pattern" 
          subtitle="Alert frequency by time of day"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area
                type="monotone"
                dataKey="alerts"
                stroke="#3b82f6"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Species Activity */}
        <ChartCard 
          title="Species Activity Distribution" 
          subtitle="Breakdown by animal type"
        >
          <SpeciesActivityCard data={speciesData} />
        </ChartCard>

        {/* System Performance */}
        <ChartCard 
          title="System Performance" 
          subtitle="Key performance indicators"
        >
          <PerformanceGauge data={performanceData} />
        </ChartCard>

        {/* Regional Performance */}
        <ChartCard 
          title="Regional Performance" 
          subtitle="Efficiency by geographic zone"
        >
          <RegionalTable data={regionData} />
        </ChartCard>
      </div>

      {/* Full Width Chart */}
      <ChartCard 
        title="Regional Conflict Analysis" 
        subtitle="Comparative analysis across different zones"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="region" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="conflicts" fill="#ef4444" radius={[4, 4, 0, 0]} name="Conflicts" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              EXCELLENT
            </span>
          </div>
          <h3 className="text-lg font-bold text-emerald-800">Prevention Rate</h3>
          <p className="text-emerald-600 text-sm mb-2">Currently performing above target</p>
          <p className="text-2xl font-bold text-emerald-800">92.3%</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">
              ACTIVE
            </span>
          </div>
          <h3 className="text-lg font-bold text-blue-800">System Health</h3>
          <p className="text-blue-600 text-sm mb-2">All systems operational</p>
          <p className="text-2xl font-bold text-blue-800">99.1%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">
              GROWING
            </span>
          </div>
          <h3 className="text-lg font-bold text-purple-800">Community Coverage</h3>
          <p className="text-purple-600 text-sm mb-2">Villages under protection</p>
          <p className="text-2xl font-bold text-purple-800">847</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;