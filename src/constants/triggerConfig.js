export const TRIGGER_CONFIG = {
  rain: {
    mild: {
      bg: 'bg-orange-300',
      text: 'text-white',
      message: '🌦️ Light rain detected. Staying protected.',
      label: 'Rain Protection — Mild',
    },
    moderate: {
      bg: 'bg-orange-400',
      text: 'text-white',
      message: '🌧️ Heavy rain detected. Income protection active.',
      label: 'Rain Protection — Moderate',
    },
    severe: {
      bg: 'bg-red-500',
      text: 'text-white',
      message: '⛈️ Severe rain. Full income protection active.',
      label: 'Rain Protection — Severe',
    },
  },
  aqi: {
    moderate: {
      bg: 'bg-yellow-400',
      text: 'text-gray-900',
      message: '😷 Poor air quality. Income protection active.',
      label: 'AQI Protection — Moderate',
    },
    severe: {
      bg: 'bg-orange-500',
      text: 'text-white',
      message: '🚨 Very poor air. Income protection active.',
      label: 'AQI Protection — Severe',
    },
  },
  curfew: {
    partial: {
      bg: 'bg-red-500',
      text: 'text-white',
      message: '🚔 Partial curfew active. Income protection active.',
      label: 'Curfew — Partial',
    },
    full: {
      bg: 'bg-red-600',
      text: 'text-white',
      message: '🚫 Full curfew active. Maximum protection active.',
      label: 'Curfew — Full',
    },
  },
  all_clear: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    message: '✅ All clear today. You\'re covered.',
    label: 'All Clear',
  },
};

// Severity order for picking most severe event
export const SEVERITY_ORDER = ['full', 'partial', 'severe', 'moderate', 'mild'];
export const EVENT_TYPE_PRIORITY = { curfew: 3, rain: 2, aqi: 1 };
