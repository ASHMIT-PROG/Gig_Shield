import { useState, useMemo } from 'react';
import { MOCK_DELIVERIES } from '../mockData';

export function useDeliveries(riderId, startDate, endDate) {
  const [extra, setExtra] = useState([]);

  // BUG-1 fix: use getTime() in deps and filter properly
  const startMs = startDate?.getTime() || 0;
  const endMs   = endDate?.getTime()   || Infinity;

  const base = useMemo(() => {
    return MOCK_DELIVERIES.filter(d => {
      const t = d.completedAt?.toDate?.()?.getTime() || 0;
      return t >= startMs && t <= endMs;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMs, endMs]);

  // BUG-3 fix: extra is appended separately so base stays stable
  const deliveries = useMemo(() => [...extra, ...base], [extra, base]);

  const totalEarnings  = useMemo(() => deliveries.reduce((s, d) => s + (d.amount || 0), 0), [deliveries]);
  const deliveryCount  = deliveries.length;

  function addDelivery(delivery) {
    setExtra(prev => [delivery, ...prev]);
  }

  return { deliveries, loading: false, totalEarnings, deliveryCount, addDelivery, error: null };
}
