export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State or region
  country_code?: string;
}

export interface CurrentWeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day?: number;
}

export interface DailyForecastData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeatherData;
  daily: DailyForecastData;
}

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string; // Lucide icon name, e.g. "Sun", "CloudRain", etc.
  bgColor: string; // Tailwind bg color class for dynamic background mapping
  textColor: string; // Tailwind text color class
  bgGradient: string; // Tailwind gradient class for the cards
}

export interface IntelligenceRecommendation {
  id: string;
  category: 'activity' | 'clothing' | 'safety' | 'general';
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

export interface SavedLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}
