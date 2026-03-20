import { useAuth } from '../contexts/AuthContext';

export function useRiderData() {
  const { riderProfile } = useAuth();
  return { riderData: riderProfile, loading: false, error: null };
}
