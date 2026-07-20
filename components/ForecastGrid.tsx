import React from 'react';
import { Droplets, TrendingDown, TrendingUp } from 'lucide-react';
import { DailyForecastData } from '../types';
import { getWeatherCondition, formatDayName } from '../src/utils/weatherUtils';
import WeatherIcon from './WeatherIcon';

interface ForecastGridProps {
  daily: DailyForecastData;
  unit: 'C' | 'F';
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, unit }) => {
  // Convert temperatures to the selected unit
  const formatTemp = (tempC: number) => {
    const value = unit === 'C' ? tempC : (tempC * 9/5) + 32;
    return `${Math.round(value)}°`;
  };

  return (
    <div className="space-y-4" id="forecast-grid-container">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <span className="h-5 w-1 bg-sky-500 rounded" />
          7-Day Meteorological Trend
        </h2>
        <span className="text-xs text-slate-400 font-medium bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-full">
          Scroll to view
        </span>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5" id="forecast-cards-wrapper">
        {daily.time.map((dateStr, index) => {
          const code = daily.weathercode[index];
          const tempMax = daily.temperature_2m_max[index];
          const tempMin = daily.temperature_2m_min[index];
          const precip = daily.precipitation_sum[index];

          // Use getWeatherCondition with isDay = true for standard daily icons
          const condition = getWeatherCondition(code, true);
          const { day, date } = formatDayName(dateStr, index);

          const hasRain = precip > 0;

          return (
            <div
              key={dateStr}
              className={`flex flex-col items-center p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border ${
                index === 0 
                  ? 'border-sky-500/40 bg-sky-950/10 shadow-lg shadow-sky-500/5' 
                  : 'border-slate-800/80 hover:border-slate-700/80'
              } transition-all duration-300 group hover:-translate-y-1`}
              id={`forecast-card-${index}`}
            >
              {/* Day & Date Header */}
              <div className="text-center space-y-0.5">
                <p className={`text-xs font-bold tracking-tight ${
                  index === 0 ? 'text-sky-400' : 'text-slate-300'
                }`}>
                  {day}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">{date}</p>
              </div>

              {/* Weather Icon Badge */}
              <div className="my-4 p-3 bg-slate-800/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <WeatherIcon
                  name={condition.icon}
                  className={`${condition.textColor} drop-shadow-sm`}
                  size={28}
                />
              </div>

              {/* Weather Condition Description */}
              <p className="text-[11px] font-semibold text-slate-300 truncate w-full text-center mb-3">
                {condition.description}
              </p>

              {/* Temperature Range Mini-Grid */}
              <div className="w-full flex items-center justify-between px-1 text-xs border-t border-slate-800/60 pt-2.5 mt-auto">
                <div className="flex items-center gap-0.5 text-amber-500 font-bold" title="Maximum Temperature">
                  <TrendingUp size={11} className="opacity-80" />
                  <span>{formatTemp(tempMax)}</span>
                </div>
                <div className="flex items-center gap-0.5 text-sky-400 font-medium" title="Minimum Temperature">
                  <TrendingDown size={11} className="opacity-80" />
                  <span>{formatTemp(tempMin)}</span>
                </div>
              </div>

              {/* Precipitation Meter */}
              <div className="w-full mt-2 flex items-center justify-center gap-1">
                <Droplets size={11} className={hasRain ? 'text-cyan-400' : 'text-slate-600'} />
                <span className={`text-[10px] font-bold ${
                  hasRain ? 'text-cyan-400 font-extrabold' : 'text-slate-500'
                }`}>
                  {precip > 0 ? `${precip.toFixed(1)}mm` : '0 mm'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
