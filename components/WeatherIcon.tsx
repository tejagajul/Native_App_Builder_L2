import React from 'react';
import * as Icons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = '', size = 24 }) => {
  // Fallback to HelpCircle if the icon name doesn't exist
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
};

export default WeatherIcon;
