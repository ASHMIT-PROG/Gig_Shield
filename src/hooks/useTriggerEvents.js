import { useState } from 'react';
import { MOCK_TRIGGER_EVENTS } from '../mockData';

export function useTriggerEvents(city) {
  const events = MOCK_TRIGGER_EVENTS.filter(e => e.city === city && e.isActive);
  return { events, loading: false };
}
