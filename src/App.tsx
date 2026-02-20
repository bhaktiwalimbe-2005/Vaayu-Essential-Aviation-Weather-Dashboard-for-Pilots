/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wind, 
  Cloud, 
  Thermometer, 
  Eye, 
  Navigation, 
  Clock, 
  Activity,
  AlertTriangle,
  ChevronRight,
  Plane,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MetarResponse } from './types';

const FLIGHT_RULES_COLORS = {
  VFR: '#10B981', // emerald-500
  MVFR: '#3B82F6', // blue-500
  IFR: '#EF4444', // red-500
  LIFR: '#A855F7', // purple-500
};

const FLIGHT_RULES_BG_COLORS = {
  VFR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  MVFR: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  IFR: 'text-red-400 bg-red-400/10 border-red-400/20',
  LIFR: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const SafetyDonut = ({ 
  value, 
  max, 
  label, 
  unit, 
  category, 
  icon: Icon 
}: { 
  value: number, 
  max: number, 
  label: string, 
  unit: string, 
  category: MetarResponse['flight_rules'],
  icon: any
}) => {
  const color = FLIGHT_RULES_COLORS[category] || '#94A3B8';
  const data = [
    { value: Math.min(value, max) },
    { value: Math.max(0, max - value) }
  ];

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 relative overflow-hidden">
      <div className="flex items-center gap-2 w-full">
        <Icon className="w-4 h-4 text-blue-400" />
        <span className="data-label">{label}</span>
      </div>
      
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold leading-none ${value > 999 ? 'text-xl' : 'text-2xl'}`}>
            {value.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">{unit}</span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border ${FLIGHT_RULES_BG_COLORS[category]}`}>
        {category}
      </div>
    </div>
  );
};

const FlightCategoryBadge = ({ category }: { category: MetarResponse['flight_rules'] }) => (
  <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-widest ${FLIGHT_RULES_BG_COLORS[category] || 'text-gray-400 border-gray-400/20'}`}>
    {category}
  </div>
);

const DataBox = ({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  status = 'neutral'
}: { 
  label: string, 
  value: string | number, 
  unit?: string, 
  icon: any,
  status?: 'safe' | 'unsafe' | 'neutral'
}) => {
  const statusClasses = {
    safe: 'border-emerald-500/30 bg-emerald-500/5',
    unsafe: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-white/10 bg-white/5'
  };

  const iconClasses = {
    safe: 'text-emerald-400',
    unsafe: 'text-red-400',
    neutral: 'text-blue-400'
  };

  return (
    <div className={`${statusClasses[status]} border p-4 rounded-xl flex flex-col gap-2 transition-all duration-500`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconClasses[status]}`} />
        <span className="data-label">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold tracking-tight">{value}</span>
        {unit && <span className="text-xs text-slate-500 font-mono">{unit}</span>}
      </div>
    </div>
  );
};

const WindDial = ({ direction, speed, gust }: { direction: number, speed: number, gust: number | null }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Ring */}
      <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full" />
      
      {/* Compass Points */}
      {['N', 'E', 'S', 'W'].map((point, i) => (
        <span 
          key={point} 
          className="absolute text-[10px] font-mono text-slate-500"
          style={{ 
            top: i === 0 ? '8px' : i === 2 ? 'auto' : '50%',
            bottom: i === 2 ? '8px' : 'auto',
            left: i === 3 ? '8px' : i === 1 ? 'auto' : '50%',
            right: i === 1 ? '8px' : 'auto',
            transform: (i === 1 || i === 3) ? 'translateY(-50%)' : 'translateX(-50%)'
          }}
        >
          {point}
        </span>
      ))}

      {/* Wind Arrow */}
      <motion.div 
        className="relative w-1 h-24 bg-gradient-to-t from-transparent via-blue-500 to-blue-400 rounded-full origin-bottom"
        initial={{ rotate: 0 }}
        animate={{ rotate: direction }}
        transition={{ type: 'spring', stiffness: 50 }}
        style={{ bottom: '50%' }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </motion.div>

      {/* Center Info */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-mono font-bold">{speed}</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase">KT</span>
        {gust && (
          <span className="text-xs font-mono text-red-400 font-bold mt-1">G{gust}</span>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [icao, setIcao] = useState('KJFK');
  const [weather, setWeather] = useState<MetarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(['KJFK', 'EGLL', 'VABB', 'RJTT']);

  const fetchWeather = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/metar/${code}`);
      if (!res.ok) throw new Error('Station not found or API error');
      const data = await res.json();
      setWeather(data);
      if (!history.includes(code.toUpperCase())) {
        setHistory(prev => [code.toUpperCase(), ...prev].slice(0, 8));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(icao);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (icao.trim()) fetchWeather(icao.trim());
  };

  return (
    <div className="min-h-screen aviation-grid p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Plane className="text-white w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Vaayu</h1>
          </div>
          <p className="text-slate-500 text-sm font-mono tracking-wide">Professional Aviation Weather Terminal</p>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text" 
            value={icao}
            onChange={(e) => setIcao(e.target.value.toUpperCase())}
            placeholder="ENTER ICAO (e.g. KJFK)"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 w-full md:w-64 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </form>
      </header>

      {/* Main Dashboard */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Station Info & Primary Data */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center gap-4 text-center"
              >
                <AlertTriangle className="w-12 h-12 text-red-400" />
                <div>
                  <h3 className="text-xl font-bold text-red-400">Station Error</h3>
                  <p className="text-slate-400 mt-1">{error}</p>
                </div>
                <button 
                  onClick={() => fetchWeather(icao)}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-bold transition-colors"
                >
                  RETRY
                </button>
              </motion.div>
            ) : weather ? (
              <motion.div 
                key={weather.station}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                {/* Station Header */}
                <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="data-label block mb-1">Station ID</span>
                      <h2 className="text-5xl font-mono font-bold tracking-tighter">{weather.station}</h2>
                    </div>
                    <div className="h-12 w-px bg-white/10 hidden sm:block" />
                    <div>
                      <span className="data-label block mb-1">Observation Time</span>
                      <div className="flex items-center gap-2 text-slate-300 font-mono">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {weather.time.repr}Z
                      </div>
                    </div>
                  </div>
                  <FlightCategoryBadge category={weather.flight_rules} />
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <DataBox 
                    label="Temperature" 
                    value={weather.temperature.value} 
                    unit={`°${weather.units.temperature}`} 
                    icon={Thermometer} 
                  />
                  <DataBox 
                    label="Altimeter" 
                    value={weather.altimeter.value.toFixed(2)} 
                    unit={weather.units.altimeter} 
                    icon={Activity} 
                    status={weather.altimeter.value < 29.70 ? 'unsafe' : 'safe'}
                  />
                  <DataBox 
                    label="Dew Point" 
                    value={weather.dewpoint.value} 
                    unit={`°${weather.units.temperature}`} 
                    icon={Thermometer} 
                  />
                  <DataBox 
                    label="Humidity" 
                    value={Math.round(weather.relative_humidity)} 
                    unit="%" 
                    icon={Activity} 
                  />
                  <DataBox 
                    label="Wind Gust" 
                    value={weather.wind_gust?.value || 0} 
                    unit={weather.units.wind_speed} 
                    icon={Wind} 
                    status={(weather.wind_gust?.value || 0) > 20 ? 'unsafe' : 'safe'}
                  />
                </div>

                {/* Safety Donut Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SafetyDonut 
                    label="Visibility Safety"
                    value={weather.visibility.value}
                    max={10}
                    unit={weather.units.visibility}
                    category={
                      weather.visibility.value > 5 ? 'VFR' :
                      weather.visibility.value >= 3 ? 'MVFR' :
                      weather.visibility.value >= 1 ? 'IFR' : 'LIFR'
                    }
                    icon={Eye}
                  />
                  <SafetyDonut 
                    label="Ceiling Safety"
                    value={(() => {
                      const ceiling = weather.clouds.find(c => c.type === 'BKN' || c.type === 'OVC');
                      return ceiling ? ceiling.altitude * 100 : 10000;
                    })()}
                    max={10000}
                    unit="FT"
                    category={(() => {
                      const ceiling = weather.clouds.find(c => c.type === 'BKN' || c.type === 'OVC');
                      const alt = ceiling ? ceiling.altitude * 100 : 10000;
                      return alt > 3000 ? 'VFR' :
                             alt >= 1000 ? 'MVFR' :
                             alt >= 500 ? 'IFR' : 'LIFR';
                    })()}
                    icon={Cloud}
                  />
                </div>

                {/* Wind & Clouds Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-6">
                    <div className="w-full flex justify-between items-center">
                      <span className="data-label">Wind Vector</span>
                      <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                        <Navigation className="w-3 h-3" />
                        {weather.wind_direction.value}°
                      </div>
                    </div>
                    <WindDial 
                      direction={weather.wind_direction.value} 
                      speed={weather.wind_speed.value} 
                      gust={weather.wind_gust?.value || null} 
                    />
                  </div>

                  <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <span className="data-label">Cloud Layers</span>
                      <Cloud className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-4">
                      {weather.clouds.length > 0 ? weather.clouds.map((cloud, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Cloud className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="font-mono font-bold uppercase">{cloud.type}</span>
                          </div>
                          <span className="font-mono text-slate-400">{cloud.altitude * 100} FT</span>
                        </div>
                      )) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                          <Info className="w-8 h-8 opacity-20" />
                          <span className="text-xs uppercase tracking-widest font-mono">Sky Clear</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Raw METAR */}
                <div className="glass-panel p-6 rounded-2xl">
                  <span className="data-label block mb-3">Raw METAR Report</span>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <code className="text-sm font-mono text-blue-300 leading-relaxed break-all">
                      {weather.raw}
                    </code>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="w-12 h-12 text-blue-500/20 animate-spin" />
                  <span className="data-label animate-pulse">Initializing Terminal...</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History & Quick Links */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="data-label mb-4 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" />
              Recent Stations
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {history.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setIcao(code);
                    fetchWeather(code);
                  }}
                  className={`p-3 rounded-xl border font-mono text-sm transition-all text-center ${
                    weather?.station === code 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="data-label flex items-center gap-2">
              <Info className="w-3 h-3" />
              Flight Rules Guide
            </h3>
            <div className="space-y-3">
              {[
                { label: 'VFR', desc: 'Visual Flight Rules', color: 'bg-emerald-400' },
                { label: 'MVFR', desc: 'Marginal VFR', color: 'bg-blue-400' },
                { label: 'IFR', desc: 'Instrument Flight Rules', color: 'bg-red-400' },
                { label: 'LIFR', desc: 'Low Instrument Flight Rules', color: 'bg-purple-400' },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full ${rule.color}`} />
                  <span className="font-mono font-bold w-10">{rule.label}</span>
                  <span className="text-slate-500">{rule.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 border border-dashed border-white/10 rounded-2xl flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">AVWX API CONNECTED</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
        <span>© 2026 VAAYU FLIGHT SYSTEMS</span>
        <div className="flex gap-6">
          <span>DATA SOURCE: AVWX.REST</span>
          <span>BUILD: 2.4.0-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
