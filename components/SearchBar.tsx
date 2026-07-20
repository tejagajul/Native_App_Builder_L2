import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { GeocodingResult } from '../types';

interface SearchBarProps {
  onLocationSelect: (location: GeocodingResult) => void;
  isLoading: boolean;
}

const PRESETS = [
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917, country: 'Japan', admin1: 'Tokyo' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'United States', admin1: 'New York' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France', admin1: 'Île-de-France' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia', admin1: 'New South Wales' },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'Egypt', admin1: 'Cairo' },
  { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, country: 'Iceland', admin1: 'Capital Region' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchLoading(true);
    setError(null);
    setShowDropdown(true);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=5&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
        setError('City not found. Please check spelling or try another search.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach server. Please check your network connection.');
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectResult = (loc: GeocodingResult) => {
    onLocationSelect(loc);
    setQuery(loc.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setShowDropdown(false);
  };

  const handlePresetSelect = (preset: typeof PRESETS[number]) => {
    onLocationSelect({
      id: Math.random(),
      name: preset.name,
      latitude: preset.lat,
      longitude: preset.lon,
      country: preset.country,
      admin1: preset.admin1,
    });
    setQuery(preset.name);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4" id="weather-search-container">
      {/* Search Input Box */}
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search city (e.g. San Francisco, Tokyo, Berlin...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            className="w-full py-3.5 pl-12 pr-12 text-sm text-slate-100 placeholder-slate-400 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-300"
            id="city-search-input"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800 transition"
              id="clear-search-btn"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            disabled={searchLoading || isLoading}
            className="absolute right-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition duration-300 shadow-lg shadow-sky-900/20 flex items-center gap-1.5"
            id="search-submit-btn"
          >
            {searchLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              'Search'
            )}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showDropdown && (query.trim().length > 0) && (searchLoading || results.length > 0 || error) && (
          <div 
            className="absolute z-50 w-full mt-2 overflow-hidden bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
            id="search-results-dropdown"
          >
            {searchLoading && (
              <div className="flex items-center justify-center p-6 text-slate-400 gap-2">
                <Loader2 className="animate-spin text-sky-400" size={18} />
                <span className="text-sm">Searching global registries...</span>
              </div>
            )}

            {error && (
              <div className="p-4 text-center">
                <p className="text-sm text-rose-400 font-medium">{error}</p>
                <p className="text-xs text-slate-400 mt-1">Try spelling out the full name or adding a country.</p>
              </div>
            )}

            {!searchLoading && results.length > 0 && (
              <div className="p-1.5 max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  Select Location Match
                </div>
                {results.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectResult(loc)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-slate-800/80 rounded-xl text-slate-200 transition-colors duration-150"
                  >
                    <MapPin size={15} className="text-sky-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {loc.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    {loc.country_code && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold tracking-wider shrink-0 uppercase">
                        {loc.country_code}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset / Quick-link Cities */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2.5 pt-1" id="quick-presets-container">
        <span className="text-xs font-semibold text-slate-400 tracking-wide flex items-center gap-1 shrink-0">
          <MapPin size={12} className="text-sky-400" /> Quick-Select:
        </span>
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40 hover:border-slate-600/60 rounded-full transition-all duration-200 focus:outline-none"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
