# Gig_Shield
GigShield 🛡️

AI-Powered Parametric Insurance for Delivery Partners
Automatic income protection against rain, AQI, and curfew disruptions — no claims, instant payouts.


What is GigShield?
Delivery partners on platforms like Swiggy, Zomato, and Blinkit lose income every time it rains, air quality drops, or a curfew is imposed. GigShield protects them with parametric insurance — the moment a trigger event is detected, compensation is calculated and paid out automatically. No paperwork, no waiting, no fraud.
Every delivery contributes ₹1 to a shared insurance pool. When disruptions hit, affected riders receive payouts proportional to their expected income loss.




Features
Rider App

Live Trigger Banner — Real-time alert when rain, AQI, or curfew protection activates in your city
Today's Earnings Dashboard — Track deliveries, earnings, and pool contributions for the day
7-Day Earnings Sparkline — Area chart showing weekly income trend with % delta vs last week
Hourly Activity Heatmap — Visual breakdown of your busiest delivery hours (collapsible)
Insurance Score — Dynamic credit-style score (0–100) based on activity, stability, and claim history
Score History Chart — 8-week progression chart showing how your score evolved
Loan Eligibility — Automatic unlock at score ≥ 60 with emergency loan limit shown
Payout History — All protection payouts with filter tabs (All / Completed / Pending / Flagged)
Payout Type Donut — Breakdown of payouts by Rain, AQI, and Curfew protection
Timeline View — Toggle payout list to grouped monthly timeline view
Tax Summary — Annual income report with grouped bar chart (earnings + payouts per month)
One-tap PDF Download — Generates a formatted tax certificate with GigShield branding
Nominee Protection — Designate a family member to receive payouts if you're unavailable
Profile Management — Edit name, nominee details; view platform and city info

Admin Dashboard

Operations Overview — Live stats: active events, pool balance, total riders
LIVE Badge — Animated indicator showing real-time data feed status
Trigger Events Table — All active and past trigger events across cities with severity and payout %
Pool Health Panel — Reserve ratio (pool balance ÷ pending payouts) with color-coded status
Pool Flow Chart — ComposedChart showing inflow, outflow, and balance per city
Score Distribution Histogram — Rider count per score bucket (0–20 through 81–100)
Rider Table — Searchable table of all riders with click-to-inspect modal


Getting Started
1. Install dependencies
bashnpm install
2. Run development server
bashnpm run dev
App opens at http://localhost:5173
3. Build for production
bashnpm run build
Output goes to /dist — deploy to Vercel, Netlify, or any static host.

 

How Parametric Insurance Works
Rider completes delivery
         │
         ▼
    ₹1 deducted → Insurance Pool
         │
    Backend monitors:
    Weather API + AQI API + Govt Alerts
         │
         ▼
  Trigger event detected?
    (Rain / AQI / Curfew)
         │
    YES  ▼
  AI Engine calculates:
  expected_income vs actual_income
         │
         ▼
  payoutAmount = (expected - actual) × payoutPercent%
         │
         ▼
  Razorpay auto-transfer to rider / nominee
Trigger Severity → Payout %

Insurance Score
The score (0–100) is the rider's protection and loan eligibility rating, updated nightly by the GigShield AI engine.
ComponentMax PointsWhat it measuresActivity Score40 ptsDeliveries completed, active days on platformStability Score30 ptsEarnings consistency over rolling 90 daysClaim Score30 ptsAccurate claims, low fraud signal indicators
Score Thresholds:
Score RangeLabelBenefits0 – 39PoorBasic coverage only40 – 59FairStandard protection60 – 79GoodEmergency loan eligible up to ₹5,000–₹7,50080 – 100ExcellentPriority payouts + loan up to ₹10,000

Routes
PathPageAccess/loginPhone OTP login (2-step)Public/registerNew rider onboarding (2-step)Public/Home dashboardRider/payoutsPayout history + chartsRider/coverageInsurance score + historyRider/taxTax summary + PDF downloadRider/profileProfile + nominee managementRider/adminAdmin operations dashboardAdmin only

Business Model

Revenue stream: ₹1 micro-deduction per delivery (no upfront premium, fully frictionless)
Pool mechanics: Larger delivery volume = larger pool = more reliable payouts
Reserve target: Pool balance should always maintain ≥ 3× pending payouts (reserve ratio)
Scalability: Self-sustaining — grows automatically as platform volumes increase
Cost: Ultra-low cost of insurance makes it accessible to all delivery partners
