import { WeatherCondition, IntelligenceRecommendation, CurrentWeatherData, DailyForecastData } from '../types';

/**
 * Maps WMO (World Meteorological Organization) weather codes to human-readable strings,
 * lucide icon names, and dynamic tailwind gradient configurations for a stunning glassmorphic UI.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  // Codes mapped based on Open-Meteo documentation
  switch (code) {
    case 0: // Clear sky
      return {
        code,
        description: 'Clear Sky',
        icon: isDay ? 'Sun' : 'Moon',
        bgColor: isDay ? 'bg-amber-500' : 'bg-indigo-950',
        textColor: isDay ? 'text-amber-500' : 'text-indigo-200',
        bgGradient: isDay 
          ? 'from-amber-400 via-orange-400 to-yellow-500' 
          : 'from-slate-900 via-indigo-950 to-slate-900',
      };
    case 1: // Mainly clear
    case 2: // Partly cloudy
      return {
        code,
        description: code === 1 ? 'Mainly Clear' : 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        bgColor: isDay ? 'bg-sky-400' : 'bg-slate-800',
        textColor: isDay ? 'text-sky-500' : 'text-slate-300',
        bgGradient: isDay 
          ? 'from-sky-400 via-blue-400 to-slate-100' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
      };
    case 3: // Overcast
      return {
        code,
        description: 'Overcast',
        icon: 'Cloud',
        bgColor: 'bg-slate-500',
        textColor: 'text-slate-500',
        bgGradient: 'from-slate-500 via-zinc-400 to-gray-300',
      };
    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        code,
        description: code === 45 ? 'Foggy' : 'Freezing Fog',
        icon: 'CloudFog',
        bgColor: 'bg-zinc-400',
        textColor: 'text-zinc-600',
        bgGradient: 'from-zinc-400 via-stone-300 to-slate-200',
      };
    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
      return {
        code,
        description: 'Drizzle',
        icon: 'CloudDrizzle',
        bgColor: 'bg-blue-300',
        textColor: 'text-blue-500',
        bgGradient: 'from-sky-300 via-blue-300 to-slate-200',
      };
    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return {
        code,
        description: 'Freezing Drizzle',
        icon: 'CloudSnow',
        bgColor: 'bg-teal-200',
        textColor: 'text-teal-600',
        bgGradient: 'from-teal-300 via-cyan-200 to-slate-100',
      };
    case 61: // Slight rain
    case 63: // Moderate rain
      return {
        code,
        description: code === 61 ? 'Light Rain' : 'Moderate Rain',
        icon: 'CloudRain',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgGradient: 'from-blue-500 via-indigo-400 to-slate-200',
      };
    case 65: // Heavy rain
      return {
        code,
        description: 'Heavy Rain',
        icon: 'CloudRainWind',
        bgColor: 'bg-blue-700',
        textColor: 'text-blue-800',
        bgGradient: 'from-indigo-600 via-blue-700 to-slate-400',
      };
    case 66: // Light freezing rain
    case 67: // Heavy freezing rain
      return {
        code,
        description: 'Freezing Rain',
        icon: 'CloudSnow',
        bgColor: 'bg-teal-300',
        textColor: 'text-teal-700',
        bgGradient: 'from-teal-400 via-blue-300 to-zinc-200',
      };
    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
      return {
        code,
        description: 'Snowfall',
        icon: 'Snowflake',
        bgColor: 'bg-sky-200',
        textColor: 'text-sky-600',
        bgGradient: 'from-sky-200 via-indigo-100 to-white',
      };
    case 77: // Snow grains
      return {
        code,
        description: 'Snow Grains',
        icon: 'Snowflake',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-500',
        bgGradient: 'from-blue-200 via-slate-100 to-white',
      };
    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return {
        code,
        description: 'Rain Showers',
        icon: 'CloudRain',
        bgColor: 'bg-indigo-400',
        textColor: 'text-indigo-600',
        bgGradient: 'from-indigo-400 via-blue-400 to-slate-300',
      };
    case 85: // Slight snow showers
    case 86: // Heavy snow showers
      return {
        code,
        description: 'Snow Showers',
        icon: 'CloudSnow',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-500',
        bgGradient: 'from-teal-200 via-sky-100 to-white',
      };
    case 95: // Thunderstorm: Slight or moderate
      return {
        code,
        description: 'Thunderstorm',
        icon: 'CloudLightning',
        bgColor: 'bg-purple-600',
        textColor: 'text-purple-600',
        bgGradient: 'from-purple-800 via-indigo-900 to-slate-700',
      };
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        code,
        description: 'Severe Thunderstorm',
        icon: 'CloudLightning',
        bgColor: 'bg-red-700',
        textColor: 'text-red-700',
        bgGradient: 'from-red-950 via-purple-900 to-slate-800',
      };
    default:
      return {
        code,
        description: 'Unknown',
        icon: 'HelpCircle',
        bgColor: 'bg-slate-400',
        textColor: 'text-slate-500',
        bgGradient: 'from-slate-400 to-slate-200',
      };
  }
}

/**
 * Formats a date string (YYYY-MM-DD) into a nice relative day (e.g. "Today", "Tomorrow", "Wednesday")
 * and an optional short date like "Jul 21".
 */
export function formatDayName(dateStr: string, index: number): { day: string; date: string } {
  try {
    const dateObj = new Date(dateStr + 'T00:00:00'); // Add local midnight to prevent timezone offset shifts
    const today = new Date();
    
    // Check if it matches today
    const isToday = index === 0;
    const isTomorrow = index === 1;

    let day = '';
    if (isToday) {
      day = 'Today';
    } else if (isTomorrow) {
      day = 'Tomorrow';
    } else {
      day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    }

    const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { day, date };
  } catch (e) {
    return { day: 'Upcoming', date: dateStr };
  }
}

/**
 * Weather intelligence analyzer that digests weather response data and constructs
 * highly actionable, contextual recommendations for outdoor planning, clothing, and safety.
 */
export function generateIntelligence(
  current: CurrentWeatherData,
  daily: DailyForecastData
): IntelligenceRecommendation[] {
  const recommendations: IntelligenceRecommendation[] = [];
  const temp = current.temperature;
  const wind = current.windspeed;
  const currentCode = current.weathercode;

  // 1. Safety Alerts (Severe Weather, Storms, High Winds, Heavy Rain)
  const isStorm = [95, 96, 99].includes(currentCode);
  const isHeavyRain = [65, 82].includes(currentCode);
  
  // Find if any day in the next 7 days has severe weather or high precipitation
  let majorPrecipitationDayIndex = -1;
  let stormDayIndex = -1;
  for (let i = 0; i < daily.time.length; i++) {
    if (daily.precipitation_sum[i] > 12 && majorPrecipitationDayIndex === -1) {
      majorPrecipitationDayIndex = i;
    }
    if ([95, 96, 99].includes(daily.weathercode[i]) && stormDayIndex === -1) {
      stormDayIndex = i;
    }
  }

  // Current severe alerts
  if (isStorm) {
    recommendations.push({
      id: 'safety-storm-now',
      category: 'safety',
      title: 'Thunderstorm Warning',
      description: 'Active lightning and electrical storms detected. Stay indoors, avoid tall structures, and keep sensitive electronics unplugged.',
      type: 'danger'
    });
  } else if (isHeavyRain) {
    recommendations.push({
      id: 'safety-heavyrain-now',
      category: 'safety',
      title: 'Flooding & Visibility Advisory',
      description: 'Heavy downpours may lead to localized water pooling and highly reduced road visibility. Restrict non-essential travel.',
      type: 'warning'
    });
  } else if (wind > 35) {
    recommendations.push({
      id: 'safety-wind-now',
      category: 'safety',
      title: 'High Wind Warning',
      description: `Winds are currently blowing at a dangerous ${wind} km/h. Secure loose outdoor items and exercise caution when driving.`,
      type: 'warning'
    });
  }

  // Future safety alerts
  if (!isStorm && stormDayIndex !== -1) {
    const { day } = formatDayName(daily.time[stormDayIndex], stormDayIndex);
    recommendations.push({
      id: 'safety-storm-future',
      category: 'safety',
      title: `Storm Alert for ${day}`,
      description: `Thunderstorms are forecasted on ${day}. Prepare to adjust outdoor events and secure outdoor setups.`,
      type: 'warning'
    });
  }

  if (!isHeavyRain && majorPrecipitationDayIndex !== -1) {
    const { day } = formatDayName(daily.time[majorPrecipitationDayIndex], majorPrecipitationDayIndex);
    const rainAmount = daily.precipitation_sum[majorPrecipitationDayIndex];
    recommendations.push({
      id: 'safety-rain-future',
      category: 'safety',
      title: `Significant Rain on ${day}`,
      description: `Heavy precipitation (~${rainAmount.toFixed(1)} mm) is expected on ${day}. Remember to plan for waterproof layers and indoor routes.`,
      type: 'info'
    });
  }

  // 2. Clothing Planner Recommendations
  if (temp >= 28) {
    recommendations.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Hot Weather Outfitting',
      description: 'Wear lightweight, light-colored, and loose-fitting clothes. UV levels might be intense; wear a wide-brimmed hat, sunglasses, and high SPF sunscreen.',
      type: 'success'
    });
  } else if (temp >= 18 && temp < 28) {
    recommendations.push({
      id: 'clothing-comfortable',
      category: 'clothing',
      title: 'Comfortable & Light Clothing',
      description: 'Perfect t-shirt weather! Breathable fabrics, shorts, or light trousers are ideal. No heavy outerwear needed.',
      type: 'success'
    });
  } else if (temp >= 8 && temp < 18) {
    recommendations.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Layered Autumnal Attire',
      description: 'A mild chill is in the air. We recommend wearing dynamic layers: a comfortable long-sleeve base, paired with a cardigan, sweater, or light utility jacket.',
      type: 'info'
    });
  } else {
    recommendations.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Heavy Winter Insulation',
      description: 'Freezing temperatures! Bundle up in a thick insulated coat, thermal thermal underwear, a cozy scarf, thick gloves, and a beanie to block body heat loss.',
      type: 'warning'
    });
  }

  // 3. Activity Planner Recommendations
  const isRainCode = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(currentCode);
  const isSnowCode = [71, 73, 75, 77, 85, 86].includes(currentCode);

  if (isRainCode) {
    recommendations.push({
      id: 'activity-rainy',
      category: 'activity',
      title: 'Cozy Indoor Activities',
      description: 'Rainy conditions outside. Great day to explore a local museum, watch a movie, visit an indoor library, or enjoy some warm coffee/tea at home.',
      type: 'info'
    });
  } else if (isSnowCode) {
    recommendations.push({
      id: 'activity-snowy',
      category: 'activity',
      title: 'Snow & Winter Activities',
      description: 'Snowy landscape! Perfect for building a snowman, ice skating, or enjoying warm hot cocoa indoors while watching the snow fall.',
      type: 'info'
    });
  } else {
    // Fair weather
    if (temp >= 16 && temp <= 26 && wind < 20) {
      recommendations.push({
        id: 'activity-ideal',
        category: 'activity',
        title: 'Ideal Outdoor Opportunities',
        description: 'Highly comfortable conditions. Excellent day for outdoor sports, scenic hiking trails, a park picnic, long distance runs, or backyard gardening.',
        type: 'success'
      });
    } else if (temp > 26 && temp < 32) {
      recommendations.push({
        id: 'activity-warm',
        category: 'activity',
        title: 'Warm Day Plans',
        description: 'Warm and dry. Great for swimming pools, beach strolls, water sports, or dining outdoors on a shaded patio. Stay hydrated!',
        type: 'success'
      });
    } else if (temp >= 32) {
      recommendations.push({
        id: 'activity-extreme-heat',
        category: 'activity',
        title: 'High Heat Advisory',
        description: 'Temperatures are excessively high. Shift strenuous workouts indoors, utilize air conditioning, and restrict high-intensity sun exposure to early morning or late evening.',
        type: 'warning'
      });
    } else {
      // Dry but cold
      recommendations.push({
        id: 'activity-cold-dry',
        category: 'activity',
        title: 'Crisp & Bracing Walk Weather',
        description: 'Cold but clear outside. Perfect for a brisk walk, jogging in thermals, or taking sharp landscape photography in the high-clarity air.',
        type: 'info'
      });
    }
  }

  // 4. Outlook Summaries / Smart Tips
  let futureRainDaysCount = 0;
  for (let i = 1; i < daily.time.length; i++) {
    if (daily.precipitation_sum[i] > 1.5) {
      futureRainDaysCount++;
    }
  }

  if (futureRainDaysCount === 0) {
    recommendations.push({
      id: 'outlook-dry',
      category: 'general',
      title: 'Dry Outlook Ahead',
      description: 'No significant rainfall is forecasted for the rest of the week. Excellent conditions for painting outdoor structures, washing cars, or continuous construction projects.',
      type: 'success'
    });
  } else if (futureRainDaysCount >= 4) {
    recommendations.push({
      id: 'outlook-wet',
      category: 'general',
      title: 'Wet & Unsettled Week',
      description: 'A series of rainy weather fronts will keep the ground damp. Plan your week with plenty of indoor backups and keep waterproof gear accessible.',
      type: 'warning'
    });
  } else {
    recommendations.push({
      id: 'outlook-mixed',
      category: 'general',
      title: 'Variable Outlook',
      description: 'A mix of sunny intervals and passing showers. Check your daily radar before long-distance outdoor plans.',
      type: 'info'
    });
  }

  return recommendations;
}
