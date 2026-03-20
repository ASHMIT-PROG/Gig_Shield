// ─── Mock Data Store (no Firebase) ─────────────────────────────────────────

export const MOCK_RIDER = {
  uid: 'mock-rider-001',
  name: 'Ravi Kumar',
  phone: '9876543210',
  city: 'Chennai',
  platform: 'swiggy',
  nomineeName: 'Priya Kumar',
  nomineePhone: '9876543211',
  isActive: true,
  insuranceScore: 72,
  activityScore: 35,
  stabilityScore: 24,
  claimScore: 13,
  avgDailyEarnings: 820,
  totalClaims: 3,
  daysActive: 148,
  role: 'rider',
  createdAt: { toDate: () => new Date('2024-09-01') },
};

export const MOCK_ADMIN = {
  ...MOCK_RIDER,
  uid: 'mock-admin-001',
  name: 'Admin User',
  phone: '9000000000',
  role: 'admin',
};

export const MOCK_TRIGGER_EVENTS = [
  {
    id: 'evt-1',
    city: 'Chennai',
    eventType: 'rain',
    severity: 'moderate',
    payoutPercent: 60,
    isActive: true,
    startedAt: { toDate: () => new Date() },
    endedAt: null,
  },
];

export const MOCK_PAYOUTS = [
  {
    id: 'p1',
    riderId: 'mock-rider-001',
    triggerEventId: 'evt-1',
    eventType: 'rain',
    expectedIncome: 820,
    actualIncome: 240,
    payoutAmount: 348,
    status: 'completed',
    razorpayTransferId: 'rz_001',
    paidAt: { toDate: () => new Date('2026-03-10') },
  },
  {
    id: 'p2',
    riderId: 'mock-rider-001',
    triggerEventId: 'evt-2',
    eventType: 'aqi',
    expectedIncome: 750,
    actualIncome: 310,
    payoutAmount: 264,
    status: 'completed',
    razorpayTransferId: 'rz_002',
    paidAt: { toDate: () => new Date('2026-02-18') },
  },
  {
    id: 'p3',
    riderId: 'mock-rider-001',
    triggerEventId: 'evt-3',
    eventType: 'curfew',
    expectedIncome: 800,
    actualIncome: 0,
    payoutAmount: 560,
    status: 'processing',
    razorpayTransferId: null,
    paidAt: { toDate: () => new Date('2026-01-26') },
  },
  {
    id: 'p4',
    riderId: 'mock-rider-001',
    triggerEventId: 'evt-4',
    eventType: 'rain',
    expectedIncome: 900,
    actualIncome: 180,
    payoutAmount: 432,
    status: 'flagged',
    razorpayTransferId: null,
    paidAt: { toDate: () => new Date('2025-12-05') },
  },
];

// Generate last 7 days deliveries
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12 + Math.floor(Math.random() * 8), 0, 0, 0);
  return { toDate: () => new Date(d) };
}

export const MOCK_DELIVERIES = [
  ...Array.from({ length: 7 }, (_, i) => ({ id: `d-t${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 60 + Math.floor(Math.random() * 80), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(0) })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `d-1-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 55 + Math.floor(Math.random() * 70), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(1) })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `d-2-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 65 + Math.floor(Math.random() * 60), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(2) })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `d-3-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 70 + Math.floor(Math.random() * 90), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(3) })),
  ...Array.from({ length: 9 }, (_, i) => ({ id: `d-4-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 50 + Math.floor(Math.random() * 100), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(4) })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `d-5-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 80 + Math.floor(Math.random() * 50), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(5) })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: `d-6-${i}`, riderId: 'mock-rider-001', city: 'Chennai', amount: 60 + Math.floor(Math.random() * 60), deductedPool: 1, weatherScore: 0, aqiScore: 0, completedAt: daysAgo(6) })),
];

export const MOCK_TODAY_DELIVERIES = MOCK_DELIVERIES.filter(d => {
  const t = d.completedAt.toDate();
  const today = new Date(); today.setHours(0,0,0,0);
  return t >= today;
});

// Weekly earnings (last 7 days)
function getWeeklyEarnings() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayDeliveries = MOCK_DELIVERIES.filter(del => {
      const dt = del.completedAt.toDate();
      return dt.getDate() === d.getDate() && dt.getMonth() === d.getMonth();
    });
    return {
      day: days[d.getDay()],
      date: d.toISOString().split('T')[0],
      earnings: dayDeliveries.reduce((s, del) => s + del.amount, 0),
      deliveries: dayDeliveries.length,
    };
  });
}
export const MOCK_WEEKLY_EARNINGS = getWeeklyEarnings();

// Score history (8 weeks progression to 72)
export const MOCK_SCORE_HISTORY = [
  { week: 'Wk1', score: 45 },
  { week: 'Wk2', score: 48 },
  { week: 'Wk3', score: 51 },
  { week: 'Wk4', score: 55 },
  { week: 'Wk5', score: 58 },
  { week: 'Wk6', score: 63 },
  { week: 'Wk7', score: 68 },
  { week: 'Wk8', score: 72 },
];

// Hourly delivery heatmap (hour → count)
export const MOCK_HOURLY_DELIVERIES = {
  6: 1, 7: 2, 8: 3, 9: 2, 10: 3, 11: 4,
  12: 6, 13: 7, 14: 5, 15: 3, 16: 2, 17: 3,
  18: 6, 19: 8, 20: 7, 21: 5, 22: 2, 23: 1,
};

// Monthly earnings + payouts for Tax page grouped bar chart
export const MOCK_MONTHLY_PAYOUTS = [
  { month: 'Apr', earnings: 18200, payouts: 0 },
  { month: 'May', earnings: 21400, payouts: 0 },
  { month: 'Jun', earnings: 19800, payouts: 348 },
  { month: 'Jul', earnings: 22100, payouts: 0 },
  { month: 'Aug', earnings: 17600, payouts: 264 },
  { month: 'Sep', earnings: 24300, payouts: 0 },
  { month: 'Oct', earnings: 20900, payouts: 0 },
  { month: 'Nov', earnings: 23100, payouts: 560 },
  { month: 'Dec', earnings: 19400, payouts: 432 },
  { month: 'Jan', earnings: 25600, payouts: 0 },
  { month: 'Feb', earnings: 22800, payouts: 0 },
  { month: 'Mar', earnings: 14200, payouts: 0 },
];

export const MOCK_ALL_TRIGGER_EVENTS = [
  { id: 'te1', city: 'Chennai', eventType: 'rain', severity: 'moderate', payoutPercent: 60, isActive: true, startedAt: { toDate: () => new Date('2026-03-19T08:00:00') }, endedAt: null },
  { id: 'te2', city: 'Mumbai', eventType: 'aqi', severity: 'severe', payoutPercent: 80, isActive: true, startedAt: { toDate: () => new Date('2026-03-19T06:00:00') }, endedAt: null },
  { id: 'te3', city: 'Delhi', eventType: 'curfew', severity: 'partial', payoutPercent: 70, isActive: false, startedAt: { toDate: () => new Date('2026-03-18T10:00:00') }, endedAt: { toDate: () => new Date('2026-03-18T22:00:00') } },
  { id: 'te4', city: 'Bengaluru', eventType: 'rain', severity: 'mild', payoutPercent: 30, isActive: false, startedAt: { toDate: () => new Date('2026-03-17T14:00:00') }, endedAt: { toDate: () => new Date('2026-03-17T20:00:00') } },
];

export const MOCK_ALL_RIDERS = [
  { id: 'r1', name: 'Ravi Kumar', phone: '9876543210', city: 'Chennai', platform: 'swiggy', insuranceScore: 72, isActive: true, activityScore: 35, stabilityScore: 24, claimScore: 13, avgDailyEarnings: 820, totalClaims: 3, daysActive: 148, nomineeName: 'Priya Kumar', nomineePhone: '9876543211', role: 'rider' },
  { id: 'r2', name: 'Suresh Babu', phone: '9123456780', city: 'Chennai', platform: 'zomato', insuranceScore: 85, isActive: true, activityScore: 38, stabilityScore: 27, claimScore: 20, avgDailyEarnings: 950, totalClaims: 1, daysActive: 210, nomineeName: 'Lakshmi Babu', nomineePhone: '9123456781', role: 'rider' },
  { id: 'r3', name: 'Arjun Sharma', phone: '9988776655', city: 'Delhi', platform: 'blinkit', insuranceScore: 38, isActive: false, activityScore: 18, stabilityScore: 10, claimScore: 10, avgDailyEarnings: 480, totalClaims: 5, daysActive: 62, nomineeName: 'Anita Sharma', nomineePhone: '9988776656', role: 'rider' },
  { id: 'r4', name: 'Vikram Nair', phone: '9807654321', city: 'Mumbai', platform: 'swiggy', insuranceScore: 91, isActive: true, activityScore: 40, stabilityScore: 29, claimScore: 22, avgDailyEarnings: 1100, totalClaims: 0, daysActive: 290, nomineeName: 'Meena Nair', nomineePhone: '9807654322', role: 'rider' },
  { id: 'r5', name: 'Pradeep Singh', phone: '9654321098', city: 'Bengaluru', platform: 'zomato', insuranceScore: 58, isActive: true, activityScore: 26, stabilityScore: 19, claimScore: 13, avgDailyEarnings: 670, totalClaims: 2, daysActive: 95, nomineeName: 'Sunita Singh', nomineePhone: '9654321099', role: 'rider' },
  { id: 'r6', name: 'Kavitha Rao', phone: '9741852963', city: 'Hyderabad', platform: 'blinkit', insuranceScore: 14, isActive: false, activityScore: 8, stabilityScore: 4, claimScore: 2, avgDailyEarnings: 310, totalClaims: 7, daysActive: 28, nomineeName: 'Ramesh Rao', nomineePhone: '9741852964', role: 'rider' },
];

export const MOCK_POOL_LEDGER = [
  { city: 'Chennai', date: '2026-03-19', totalInflow: 4820, totalOutflow: 1200, balance: 3620 },
  { city: 'Mumbai',  date: '2026-03-19', totalInflow: 7310, totalOutflow: 2100, balance: 5210 },
  { city: 'Delhi',   date: '2026-03-19', totalInflow: 6100, totalOutflow: 1800, balance: 4300 },
];

// Session
let _currentUser = null, _riderProfile = null;
export const setMockSession = (u, p) => { _currentUser = u; _riderProfile = p; };
export const getMockSession = () => ({ currentUser: _currentUser, riderProfile: _riderProfile });
export const clearMockSession = () => { _currentUser = null; _riderProfile = null; };
