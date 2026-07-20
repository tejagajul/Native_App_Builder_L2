import React from 'react';
import { Wind, Navigation, Thermometer, Map, Compass, Calendar, Sun, Moon } from 'lucide-react';
import { CurrentWeatherData, GeocodingResult } from '../types';
import { getWeatherCondition } from '../src/utils/weatherUtils';
import WeatherIcon from './WeatherIcon';

interface WeatherHeroProps {
  weather: CurrentWeatherData;
  location: GeocodingResult;
  timezone: string;
  unit: 'C' | 'F';
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, location, timezone, unit }) => {
  const isDay = weather.is_day !== 0; // 1 = day, 0 = night
  const condition = getWeatherCondition(weather.weathercode, isDay);

  // Convert Celsius to Fahrenheit if unit is F
  const displayTemp = unit === 'C' 
    ? Math.round(weather.temperature) 
    : Math.round((weather.temperature * 9/5) + 32);

  // Format wind speed based on unit
  const displayWind = unit === 'C'
    ? `${weather.windspeed.toFixed(1)} km/h`
    : `${(weather.windspeed * 0.621371).toFixed(1)} mph`;

  // Get current date/time formatted
  const getLocalFormattedTime = () => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const timeFormatter = new Intl.DateTimeFormat('en-US', options);
      const formattedTime = timeFormatter.format(new Date());

      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      };
      const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
      const formattedDate = dateFormatter.format(new Date());

      return { time: formattedTime, date: formattedDate };
    } catch (e) {
      // Fallback
      return { 
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), 
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) 
      };
    }
  };

  const { time, date } = getLocalFormattedTime();

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl border border-white/10 p-6 md:p-8 text-white shadow-2xl transition-all duration-700 bg-gradient-to-br ${condition.bgGradient}`}
      id="current-weather-hero"
    >
      {/* Background Subtle Ambiance Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      {/* Primary Hero Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Location Details & Time */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Insights
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white drop-shadow-sm">
              {location.name}
            </h1>
            <p className="text-sm md:text-base font-medium text-white/80">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/70 pt-2">
            <span className="flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-lg">
              <Calendar size={13} />
              {date}
            </span>
            <span className="flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-lg">
              {isDay ? <Sun size={13} className="text-amber-300" /> : <Moon size={13} className="text-indigo-300" />}
              {time} ({timezone})
            </span>
          </div>
        </div>

        {/* Right Side: Large Dynamic Temperature Badge */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center p-4 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/10 shadow-inner group hover:scale-105 transition-all duration-300">
            <WeatherIcon name={condition.icon} className="text-white drop-shadow-md animate-pulse" size={68} />
          </div>
          <div>
            <div className="flex items-start">
              <span className="text-6xl md:text-7xl font-display font-extrabold tracking-tighter drop-shadow-md">
                {displayTemp}
              </span>
              <span className="text-2xl md:text-3xl font-display font-bold pt-1">
                °{unit}
              </span>
            </div>
            <p className="text-lg md:text-xl font-bold tracking-tight text-white/95 mt-1 drop-shadow-sm">
              {condition.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Micro Metrics Horizontal Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
        {/* Metric 1: Wind */}
        <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 hover:bg-black/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-white/10 text-white/95 shrink-0">
            <Wind size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Wind Velocity</p>
            <p className="text-sm font-bold truncate">{displayWind}</p>
          </div>
        </div>

        {/* Metric 2: Wind Direction */}
        <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 hover:bg-black/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-white/10 text-white/95 shrink-0">
            <Compass size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Bearing</p>
            <p className="text-sm font-bold truncate flex items-center gap-1">
              <Navigation size={12} style={{ transform: `rotate(${weather.winddirection}deg)` }} className="text-sky-300" />
              {weather.winddirection}°
            </p>
          </div>
        </div>

        {/* Metric 3: GPS Coordinates */}
        <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 hover:bg-black/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-white/10 text-white/95 shrink-0">
            <Map size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Coordinates</p>
            <p className="text-xs font-bold truncate">
              {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </p>
          </div>
        </div>

        {/* Metric 4: Comfort Index */}
        <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 hover:bg-black/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-white/10 text-white/95 shrink-0">
            <Thermometer size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Status</p>
            <p className="text-sm font-bold truncate">
              {weather.temperature > 30 ? 'Extreme Heat' : weather.temperature > 15 ? 'Moderate' : 'Chilly'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
