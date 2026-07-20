import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Shirt, Compass, Info, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { IntelligenceRecommendation } from '../types';

interface WeatherIntelligenceProps {
  recommendations: IntelligenceRecommendation[];
}

export const WeatherIntelligence: React.FC<WeatherIntelligenceProps> = ({ recommendations }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'safety' | 'clothing' | 'activity' | 'general'>('all');

  const filteredRecommendations = recommendations.filter(
    (rec) => selectedCategory === 'all' || rec.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return <ShieldAlert size={16} className="text-rose-400" />;
      case 'clothing':
        return <Shirt size={16} className="text-amber-400" />;
      case 'activity':
        return <Compass size={16} className="text-emerald-400" />;
      default:
        return <Info size={16} className="text-sky-400" />;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          border: 'border-rose-500/30',
          bg: 'bg-rose-950/15 backdrop-blur-md',
          accent: 'text-rose-400',
          iconBg: 'bg-rose-500/10',
          label: 'Immediate Alert',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30',
          bg: 'bg-amber-950/10 backdrop-blur-md',
          accent: 'text-amber-400',
          iconBg: 'bg-amber-500/10',
          label: 'Advisory Warning',
        };
      case 'success':
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/10 backdrop-blur-md',
          accent: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10',
          label: 'Optimal Conditions',
        };
      case 'info':
      default:
        return {
          border: 'border-sky-500/30',
          bg: 'bg-sky-950/10 backdrop-blur-md',
          accent: 'text-sky-400',
          iconBg: 'bg-sky-500/10',
          label: 'Planning Suggestion',
        };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={18} className="text-rose-400" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-400" />;
      case 'success':
        return <CheckCircle size={18} className="text-emerald-400" />;
      case 'info':
      default:
        return <Info size={18} className="text-sky-400" />;
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/80 p-6 space-y-6" id="weather-intelligence-card">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20">
            <Sparkles size={12} className="animate-pulse" />
            AI Meteorological Logic
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Weather Planning Intelligence
          </h2>
        </div>

        {/* Categories Filtering Pills */}
        <div className="flex flex-wrap gap-1.5" id="intelligence-filter-chips">
          {(['all', 'safety', 'clothing', 'activity', 'general'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-xl border transition-all duration-200 focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-900/35'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              {cat === 'all' ? 'All Insights' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="intelligence-recommendations-grid">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((rec) => {
            const colors = getAlertColors(rec.type);
            return (
              <div
                key={rec.id}
                className={`flex gap-4 p-5 rounded-2xl border ${colors.border} ${colors.bg} hover:border-slate-700 transition-all duration-300 relative overflow-hidden group`}
                id={`rec-item-${rec.id}`}
              >
                {/* Visual Accent Corner Ribbon */}
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${
                  rec.type === 'danger' ? 'from-rose-500 to-rose-700' :
                  rec.type === 'warning' ? 'from-amber-400 to-amber-600' :
                  rec.type === 'success' ? 'from-emerald-400 to-emerald-600' :
                  'from-sky-400 to-sky-600'
                } opacity-30 group-hover:opacity-60 transition-opacity`} />

                {/* Left side: Icon inside stylized capsule */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl ${colors.iconBg} h-12 w-12 shrink-0 border border-white/5`}>
                  {getAlertIcon(rec.type)}
                </div>

                {/* Right side: Recommendation text details */}
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                      {getCategoryIcon(rec.category)}
                      {rec.category}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wide ${colors.accent}`}>
                      • {colors.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
            <Layers size={32} className="text-slate-600 animate-bounce mb-3" />
            <p className="text-sm font-semibold text-slate-400">No active insights in this category.</p>
            <p className="text-xs text-slate-500 mt-1">Try switching to the 'All Insights' tab to see clothing and activities guides.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default WeatherIntelligence;
