import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Thermometer, 
  Wind, 
  MapPin, 
  RefreshCw, 
  Sparkles, 
  History, 
  X, 
  CloudRain, 
  AlertTriangle, 
  Smile, 
  Shirt, 
  Compass,
  ArrowLeft
} from 'lucide-react';
import { GeocodingResult, WeatherForecastResponse, SavedLocation } from './types';
import SearchBar from '../components/SearchBar';
import WeatherHero from '../components/WeatherHero';
import ForecastGrid from '../components/ForecastGrid';
import WeatherIntelligence from '../components/WeatherIntelligence';
import { generateIntelligence } from './utils/weatherUtils';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [recentSearches, setRecentSearches] = useState<SavedLocation[]>([]);

  // Load recent searches from localStorage on init
  useEffect(() => {
    try {
      const stored = localStorage.getItem('weather_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
  }, []);

  // Fetch weather once a location is chosen
  const fetchWeather = async (loc: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Meteorological API request failed. Please try again.');
      }

      const data: WeatherForecastResponse = await response.json();
      setWeatherData(data);
      setSelectedLocation(loc);

      // Save to recent searches
      const newRecent: SavedLocation[] = [
        {
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          country: loc.country,
          admin1: loc.admin1,
        },
        ...recentSearches.filter((item) => item.name.toLowerCase() !== loc.name.toLowerCase()),
      ].slice(0, 5); // Hold up to 5 entries

      setRecentSearches(newRecent);
      localStorage.setItem('weather_recent_searches', JSON.stringify(newRecent));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather forecast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (loc: GeocodingResult) => {
    fetchWeather(loc);
  };

  const handleRecentClick = (saved: SavedLocation) => {
    const locResult: GeocodingResult = {
      id: Math.random(),
      name: saved.name,
      latitude: saved.latitude,
      longitude: saved.longitude,
      country: saved.country,
      admin1: saved.admin1,
    };
    fetchWeather(locResult);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('weather_recent_searches');
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setWeatherData(null);
    setError(null);
  };

  // Generate automated planning insights based on weather details
  const recommendations = weatherData
    ? generateIntelligence(weatherData.current_weather, weatherData.daily)
    : [];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-white" id="main-application-root">
      
      {/* Universal Ambient Stars Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Global Application Header */}
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <button 
            onClick={handleReset}
            className="flex items-center gap-2.5 hover:opacity-90 transition focus:outline-none"
            id="brand-header-logo"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25">
              <CloudSun size={18} className="animate-pulse" />
            </div>
            <div>
              <span className="text-md font-display font-extrabold tracking-tight text-white">
                METEO
              </span>
              <span className="text-md font-display font-light text-sky-400 ml-0.5 uppercase tracking-wider">
                Intelligence
              </span>
            </div>
          </button>

          {/* Unit Toggle & Reset Options */}
          <div className="flex items-center gap-3">
            {selectedLocation && (
              <button
                onClick={() => fetchWeather(selectedLocation)}
                disabled={isLoading}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors duration-200"
                title="Refresh current weather data"
                id="refresh-weather-btn"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin text-sky-400' : ''} />
              </button>
            )}

            {/* F/C Switch Container */}
            <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800" id="unit-switch-toggle">
              <button
                onClick={() => setUnit('C')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'C'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'F'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Layout container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Loading Spinner Overlays */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4" id="global-loading-skeleton">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
              <CloudSun size={20} className="absolute text-sky-400 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-200">Retrieving Meteorological Forecasts...</p>
              <p className="text-xs text-slate-400 mt-1">Analyzing coordinates and generating planning intelligence recommendations.</p>
            </div>
          </div>
        )}

        {/* 1. INITIAL EMPTY/WELCOME STATE */}
        {!selectedLocation && !isLoading && (
          <div className="max-w-4xl mx-auto space-y-12 py-6 sm:py-12 animate-in fade-in duration-500" id="welcome-portal">
            
            {/* Visual Splash Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/15 uppercase tracking-wide">
                <Sparkles size={12} className="text-sky-400" />
                Browser-Native Planner
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white">
                Automated Weather <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
                  Planning Intelligence
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Enter any global city to instantly retrieve live coordinates, 7-day meteorological forecasts, and automated human-centered planning diagnostics for sports, outfitting, and weather alerts.
              </p>
            </div>

            {/* Core Search Bar */}
            <div className="bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-xl">
              <SearchBar onLocationSelect={handleLocationSelect} isLoading={isLoading} />
            </div>

            {/* High-Level Feature Showcase cards (Bento style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4" id="features-showcase-grid">
              
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-10 h-10 flex items-center justify-center">
                  <Shirt size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Smart Clothing Guides</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored insulation guidelines from freezing blizzards to sweltering desert suns based on thermal indices.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-10 h-10 flex items-center justify-center">
                  <Compass size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Activity Diagnostics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instantly flags peak hours for high-intensity running, soccer, or leisure picnics based on precipitation and humidity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-10 h-10 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Meteorological Warnings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Proactive wind warnings, localized lightning alerts, and heavy precipitation thresholds analyzed automatically.
                </p>
              </div>
            </div>

            {/* Storage History Panel (Only visible if history exists) */}
            {recentSearches.length > 0 && (
              <div className="pt-6 border-t border-slate-900/80 space-y-3" id="welcome-history-panel">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History size={12} className="text-sky-400" />
                    Recently Analyzed Locations
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {recentSearches.map((saved) => (
                    <button
                      key={saved.name}
                      onClick={() => handleRecentClick(saved)}
                      className="px-4 py-2.5 text-xs text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 flex items-center gap-2 focus:outline-none"
                    >
                      <MapPin size={12} className="text-sky-400 shrink-0" />
                      <span className="font-semibold">{saved.name}</span>
                      {saved.country && (
                        <span className="text-[10px] text-slate-500 font-medium">({saved.country})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ERROR STATE PANEL */}
        {error && (
          <div className="max-w-2xl mx-auto p-6 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex gap-4 items-start shadow-xl" id="error-fallback-panel">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-md font-bold text-rose-200">Analysis Error</h3>
              <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-100 text-xs font-semibold rounded-lg transition"
                >
                  Return to Home
                </button>
                {selectedLocation && (
                  <button
                    onClick={() => fetchWeather(selectedLocation)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                  >
                    Retry Fetch
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. CORE ACTIVE WEATHER DASHBOARD VIEW */}
        {selectedLocation && weatherData && !isLoading && (
          <div className="space-y-8 animate-in fade-in duration-500" id="active-dashboard-panel">
            
            {/* Top Back & Mini-Search Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/20 p-4 rounded-2xl border border-slate-900/60">
              
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition group focus:outline-none"
                id="back-to-home-btn"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Return to Portal Home
              </button>

              <div className="w-full md:w-auto md:min-w-[400px]">
                <SearchBar onLocationSelect={handleLocationSelect} isLoading={isLoading} />
              </div>
            </div>

            {/* Dashboard Visual Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column A (Col Span 2): Core Meteorological details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Main Current Hero display */}
                <WeatherHero 
                  weather={weatherData.current_weather} 
                  location={selectedLocation} 
                  timezone={weatherData.timezone}
                  unit={unit}
                />

                {/* 7-Day Forecast card grid */}
                <ForecastGrid 
                  daily={weatherData.daily} 
                  unit={unit}
                />
              </div>

              {/* Column B (Col Span 1): Automated Planning Intelligence insights */}
              <div className="space-y-6">
                
                <WeatherIntelligence recommendations={recommendations} />

                {/* Sidebar Recent Searches Log */}
                {recentSearches.length > 1 && (
                  <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-800/80 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History size={12} className="text-sky-400" />
                      Recent Destinations
                    </h3>
                    <div className="divide-y divide-slate-800/50">
                      {recentSearches
                        .filter((s) => s.name.toLowerCase() !== selectedLocation.name.toLowerCase())
                        .map((saved) => (
                          <button
                            key={saved.name}
                            onClick={() => handleRecentClick(saved)}
                            className="w-full py-2.5 flex items-center justify-between text-left hover:text-sky-400 text-slate-300 text-xs transition duration-150 focus:outline-none group"
                          >
                            <span className="font-semibold truncate">{saved.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium shrink-0 group-hover:text-sky-500">
                              Switch →
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Persistent Visual Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-900 bg-slate-950/60 text-slate-500 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 METEO Intelligence Inc. Browser-native diagnostic logic engine.</p>
          <div className="flex gap-4">
            <span className="text-slate-600">Open-Meteo API Grounding</span>
            <span className="text-slate-600">No telemetry active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
