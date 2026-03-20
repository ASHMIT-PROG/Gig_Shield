import { MOCK_PAYOUTS } from '../mockData';

export function usePayouts(riderId) {
  return { payouts: MOCK_PAYOUTS, loading: false, hasMore: false, loadMore: () => {}, error: null };
}
