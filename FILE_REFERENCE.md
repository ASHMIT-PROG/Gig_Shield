# GigShield — File Reference Guide

> Complete breakdown of every file and folder in the project, with detailed descriptions of what each file does, its exports, and how it connects to the rest of the codebase.

---

## Root Directory (`/`)

```
gigshield/
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS plugins
├── CHANGELOG.md            # Changelog of modifications
├── README.md               # Original project readme
├── .gitignore              # Git ignore rules
├── public/                 # Static assets
│   └── shield.svg          # Favicon (shield icon)
└── src/                    # All application source code
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── firebase.js
    ├── mockData.js
    ├── components/
    ├── constants/
    ├── contexts/
    ├── hooks/
    ├── pages/
    └── utils/
```

---

### `index.html`
**Purpose:** The single HTML page that bootstraps the React SPA.

| Detail | Value |
|--------|-------|
| **Title** | `GigShield — Income Protection for Riders` |
| **Theme Color** | `#0A0F1E` (deep navy) |
| **Favicon** | `/shield.svg` |
| **Viewport** | Mobile-optimized, no user scaling |
| **Fonts** | Preconnects to Google Fonts (Plus Jakarta Sans, Syne, JetBrains Mono) |
| **Root div** | `<div id="root">` — React mounts here |
| **Entry Script** | `/src/main.jsx` (ES module) |

Also contains an empty `<div id="recaptcha-container">` for future Firebase reCAPTCHA integration.

---

### `package.json`
**Purpose:** Project metadata, npm scripts, and dependency declarations.

**Scripts:**
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build locally |

**Runtime Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM renderer |
| `react-router-dom` | ^6.21.1 | Client-side routing |
| `recharts` | ^2.10.3 | Data visualization charts |
| `lucide-react` | ^0.383.0 | SVG icon library |
| `react-hot-toast` | ^2.4.1 | Toast notifications |
| `jspdf` | ^2.5.1 | Client-side PDF generation |

**Dev Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.0.8 | Build tool |
| `@vitejs/plugin-react` | ^4.2.1 | React support for Vite |
| `tailwindcss` | ^3.4.0 | Utility-first CSS framework |
| `postcss` | ^8.4.32 | CSS transformation pipeline |
| `autoprefixer` | ^10.4.16 | Vendor prefix automation |

---

### `vite.config.js`
**Purpose:** Vite build tool configuration. Minimal setup — only enables the React plugin for JSX transformation and Fast Refresh.

---

### `tailwind.config.js`
**Purpose:** TailwindCSS configuration.

- **Content sources:** Scans `index.html` and all `src/**/*.{js,ts,jsx,tsx}` for class usage.
- **Custom fonts:**
  - `sans` → Plus Jakarta Sans
  - `display` → Syne
  - `mono` → JetBrains Mono
- **No plugins** configured.

---

### `postcss.config.js`
**Purpose:** PostCSS pipeline configuration. Enables two plugins:
1. `tailwindcss` — processes Tailwind directives
2. `autoprefixer` — adds vendor prefixes for browser compatibility

---

## `public/` Directory

### `shield.svg`
**Purpose:** The app's favicon — a simple SVG shield/hexagon icon. Referenced in `index.html` as the browser tab icon.

---

## `src/` Directory — Core Application

### `src/main.jsx`
**Purpose:** Application entry point. Mounts the React app to the DOM.

**What it does:**
1. Imports global styles (`index.css`)
2. Imports the root `App` component
3. Creates a React root on `#root`
4. Renders `<App />` wrapped in `<StrictMode>` for development warnings

---

### `src/App.jsx`
**Purpose:** Root application component. Sets up routing, layout, and global providers.

**Key responsibilities:**
1. **AuthProvider** — wraps entire app with authentication context
2. **BrowserRouter** — enables client-side routing
3. **AppShell** — conditional layout wrapper:
   - Auth pages (`/login`, `/register`) → no sidebar, just render children
   - All other pages → render inside `Sidebar` + `TopBar` + `<main>` layout
4. **Routes** — defines all 8 routes (see Routing Map in ARCHITECTURE.md)
5. **Toaster** — global toast notification config with dark theme styling

**Exports:** `App` (default export)

**Page title mapping:**
| Path | Title |
|------|-------|
| `/` | Dashboard |
| `/payouts` | Payouts |
| `/coverage` | Coverage |
| `/tax` | Tax Report |
| `/profile` | Profile |
| `/admin` | Admin Panel |

---

### `src/index.css`
**Purpose:** Global stylesheet — the design system foundation.

**Structure (231 lines):**

| Section | Lines | Description |
|---------|-------|-------------|
| **Tailwind directives** | 2–4 | `@tailwind base/components/utilities` |
| **CSS Custom Properties** | 6–22 | All color, spacing, and layout variables (`--bg`, `--surface`, `--blue`, etc.) |
| **Base layer** | 24–28 | Global resets: anti-aliased text, tap highlight removal, background/color defaults, font family |
| **App Shell** | 32–65 | `.app-shell`, `.sidebar`, `.main-area`, `.page-content` — the desktop layout grid |
| **TopBar** | 68–80 | Sticky top bar with blur backdrop |
| **Cards** | 83–94 | `.glass-card`, `.glass-card-bright` — frosted glass card styles |
| **Buttons** | 97–112 | `.btn-primary` (gradient blue), `.btn-ghost` |
| **Inputs** | 115–127 | `.input-field` — dark-themed input with focus glow |
| **Labels** | 130–133 | `.label` — uppercase tracking label |
| **Tags/Badges** | 136–147 | `.tag`, `.tag-green/blue/amber/red/slate`, `.stat-pill` |
| **Sidebar Nav** | 150–171 | `.nav-link`, `.nav-link.active` — navigation styling |
| **Notification Dropdown** | 174–185 | `.notif-dropdown` — positioned dropdown panel |
| **Skeleton** | 188 | `.skeleton` — loading placeholder |
| **Animations** | 192–218 | 8 keyframe animations + utility classes (slide-up, fade-in, float, stagger, etc.) |
| **Scrollbar** | 222–226 | Minimal 4px scrollbar, `.no-scrollbar` utility |
| **Gradient Text** | 229–230 | `.grad-blue`, `.grad-green` — gradient text using background-clip |

---

### `src/firebase.js`
**Purpose:** Firebase configuration placeholder. Currently contains only a comment indicating Firebase has been removed in favor of mock data. When ready for production, this file would export the Firebase app instance, Firestore, and Auth objects.

---

### `src/mockData.js`
**Purpose:** **Central mock data store** — the heart of the application's data layer. Contains all fake data that simulates a real backend.

**Exports (200 lines):**

| Export | Type | Description |
|--------|------|-------------|
| `MOCK_RIDER` | Object | Default rider profile: Ravi Kumar, Chennai, Swiggy, score 72, 148 days active |
| `MOCK_ADMIN` | Object | Admin profile: extends MOCK_RIDER with `role: 'admin'` |
| `MOCK_TRIGGER_EVENTS` | Array[1] | One active rain event in Chennai (moderate, 60% payout) |
| `MOCK_PAYOUTS` | Array[4] | Four historical payouts covering rain, AQI, curfew events with statuses: completed, processing, flagged |
| `MOCK_DELIVERIES` | Array[~42] | Procedurally generated deliveries over 7 days with random amounts (₹50–₹170) |
| `MOCK_TODAY_DELIVERIES` | Array | Filtered subset of deliveries from today only |
| `MOCK_WEEKLY_EARNINGS` | Array[7] | Aggregated daily earnings for Mon–Sun with day labels |
| `MOCK_SCORE_HISTORY` | Array[8] | 8-week score progression: 45 → 72 |
| `MOCK_HOURLY_DELIVERIES` | Object | Hour-indexed delivery counts (6am–11pm) for heatmap |
| `MOCK_MONTHLY_PAYOUTS` | Array[12] | Monthly earnings + payouts (Apr–Mar) for tax page |
| `MOCK_ALL_TRIGGER_EVENTS` | Array[4] | All events including ended ones (Chennai rain, Mumbai AQI, Delhi curfew, Bengaluru rain) |
| `MOCK_ALL_RIDERS` | Array[6] | Full rider roster with diverse scores, cities, platforms |
| `MOCK_POOL_LEDGER` | Array[3] | Per-city pool data (Chennai, Mumbai, Delhi) with inflow/outflow/balance |
| `setMockSession(user, profile)` | Function | Updates in-memory session |
| `getMockSession()` | Function | Retrieves current session |
| `clearMockSession()` | Function | Clears session |

---

## `src/contexts/` — React Contexts

### `src/contexts/AuthContext.jsx`
**Purpose:** Global authentication state provider using React Context.

**State managed:**
| State | Type | Description |
|-------|------|-------------|
| `currentUser` | Object \| null | The authenticated user object (`{uid, phoneNumber}`) |
| `riderProfile` | Object \| null | Full rider profile from mock data |
| `loading` | boolean | Auth loading state (always `false` in mock mode) |
| `isAdmin` | boolean | Derived: `riderProfile?.role === 'admin'` |

**Exports:**
- `AuthProvider` — context provider component
- `useAuth()` — hook to consume auth context

---

## `src/hooks/` — Custom React Hooks

### `src/hooks/useAuth.js`
**Purpose:** Re-export of `useAuth` from `AuthContext`. Provides a clean import path for components (`from '../hooks/useAuth'` instead of `from '../contexts/AuthContext'`).

---

### `src/hooks/useDeliveries.js`
**Purpose:** Provides delivery data with date filtering and the ability to add new deliveries dynamically.

**Parameters:** `(riderId, startDate, endDate)`

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `deliveries` | Array | Filtered + dynamically-added deliveries |
| `totalEarnings` | number | Sum of all delivery amounts |
| `deliveryCount` | number | Total delivery count |
| `addDelivery(delivery)` | Function | Adds a new delivery to the list (prepended) |
| `loading` | boolean | Always `false` |
| `error` | null | No error handling in mock |

**Key implementation details:**
- Uses `useMemo` with `getTime()` for stable date comparisons
- Separates "extra" (user-added) deliveries from base (mock) data to prevent infinite re-renders
- Contains comments referencing bug fixes (BUG-1, BUG-3)

---

### `src/hooks/usePayouts.js`
**Purpose:** Returns the full list of mock payouts. Simple passthrough to `MOCK_PAYOUTS`.

**Returns:** `{ payouts, loading: false, hasMore: false, loadMore: () => {}, error: null }`

---

### `src/hooks/useRiderData.js`
**Purpose:** Returns rider profile data from `AuthContext`. Provides a hook-consistent interface for components.

**Returns:** `{ riderData: riderProfile, loading: false, error: null }`

---

### `src/hooks/useTriggerEvents.js`
**Purpose:** Returns active trigger events filtered by the rider's city.

**Parameters:** `(city)` — string, e.g., `'Chennai'`

**Returns:** `{ events: [...filtered active events], loading: false }`

---

## `src/constants/` — Static Configuration

### `src/constants/cities.js`
**Purpose:** List of supported cities.

**Export:** `CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad']`

Used in: `RegisterPage` (city selection dropdown)

---

### `src/constants/platforms.js`
**Purpose:** Delivery platform definitions with brand colors.

**Export:**
```javascript
PLATFORMS = [
  { value: 'swiggy',  label: 'Swiggy',  color: '#FC8019' },  // Orange
  { value: 'zomato',  label: 'Zomato',  color: '#E23744' },  // Red
  { value: 'blinkit', label: 'Blinkit', color: '#0C831F' },  // Green
]
```

Used in: `RegisterPage` (platform selection), `Sidebar` (platform badge), `ProfilePage` (platform tag)

---

### `src/constants/triggerConfig.js`
**Purpose:** Configuration for parametric trigger events — defines the UI appearance and messages for each event type + severity combination.

**Exports:**

**1. `TRIGGER_CONFIG`** — Nested object `{eventType → severity → config}`:

| Event | Severity | Message Example | Colors |
|-------|----------|-----------------|--------|
| rain | mild | "🌦️ Light rain detected…" | orange-300 |
| rain | moderate | "🌧️ Heavy rain detected…" | orange-400 |
| rain | severe | "⛈️ Severe rain…" | red-500 |
| aqi | moderate | "😷 Poor air quality…" | yellow-400 |
| aqi | severe | "🚨 Very poor air…" | orange-500 |
| curfew | partial | "🚔 Partial curfew active…" | red-500 |
| curfew | full | "🚫 Full curfew active…" | red-600 |
| all_clear | — | "✅ All clear today…" | green-50 |

**2. `SEVERITY_ORDER`** — `['full', 'partial', 'severe', 'moderate', 'mild']` — used to pick the most severe active event.

**3. `EVENT_TYPE_PRIORITY`** — `{ curfew: 3, rain: 2, aqi: 1 }` — curfew > rain > AQI in priority.

---

## `src/utils/` — Utility Functions

### `src/utils/currencyHelpers.js`
**Purpose:** Indian Rupee formatting and financial calculations.

**Exports:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `formatINR(amount)` | `number → string` | Formats number as `₹X,XX,XXX` (Indian numbering, no decimals) |
| `calculateNetTaxable(gross, payouts, pool)` | `(n, n, n) → n` | `gross + payouts - pool` |
| `calculatePoolContribution(deliveryCount)` | `n → n` | `deliveryCount × 1` (₹1 per delivery) |

---

### `src/utils/dateHelpers.js`
**Purpose:** Date manipulation focused on Indian financial year (April–March).

**Exports:**
| Function | Description |
|----------|-------------|
| `getTodayStart()` | Returns today at 00:00:00.000 |
| `getFinancialYearStart(year?)` | Returns April 1 of the given FY |
| `getFinancialYearEnd(year?)` | Returns March 31 of the FY |
| `getCurrentFinancialYear()` | Returns FY start year (e.g., 2025 for FY 2025-26) |
| `getFinancialYearLabel(year)` | Returns `"FY 2025-26"` format |
| `formatDate(timestamp)` | Formats as `"02 Apr 2026"` (handles Firestore `toDate()`) |
| `formatTimestamp(timestamp)` | Formats as `"02 Apr 2026, 10:30"` |
| `getMonthName(index)` | Fiscal month name (0=Apr, 11=Mar) |
| `getFiscalMonthIndex(date)` | Converts calendar month to fiscal index |

---

### `src/utils/scoreHelpers.js`
**Purpose:** Insurance score tier calculations, colors, and loan eligibility.

**Exports:**
| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| `getScoreColor(score)` | 0–100 | Hex color | ≥80 green, ≥60 blue, ≥40 amber, <40 red |
| `getScoreLabel(score)` | 0–100 | String | "Excellent", "Good", "Fair", "Poor" |
| `getScoreGradient(score)` | 0–100 | [hex, hex] | Gradient pair for the score tier |
| `getLoanEligibility(score)` | 0–100 | Object | `{eligible, limit, message}` — ≥80: ₹10K, ≥70: ₹7.5K, ≥60: ₹5K |

---

### `src/utils/pdfGenerator.js`
**Purpose:** Generates a professional A4 tax summary PDF using jsPDF.

**Export:** `generateTaxPDF({ riderName, phone, financialYear, totalEarnings, poolDeductions, payoutsReceived, netTaxable })`

**PDF Layout (127 lines):**
1. **Header** — dark navy bar with "GigShield" branding and tagline
2. **Title** — "Annual Tax Summary" with FY and generation date
3. **Rider Info** — Name and phone number
4. **Income Table** — 4 rows: Gross Earnings, Pool Deductions (red), Payouts Received (green), Net Taxable (blue, highlighted)
5. **Disclaimer** — Yellow warning box about consulting a tax professional
6. **Footer** — dark navy bar with tagline

**Download:** Auto-saves as `gigshield-tax-FY{year}.pdf`

---

## `src/components/` — Reusable Components

### `src/components/cards/index.jsx`
**Purpose:** Collection of reusable card components exported from a single barrel file (**149 lines**).

**Exports:**

#### `EarningsCard` 
**Props:** `{ totalEarnings, deliveryCount, poolContribution, loading }`

Blue gradient hero card showing today's earnings with delivery count and pool deduction. Has a skeleton loading state.

#### `PayoutCard`
**Props:** `{ payout }` (payout object with eventType, expectedIncome, actualIncome, payoutAmount, status, paidAt)

Individual payout card with event type icon (Droplets/Wind/Lock), status badge, and a 3-column grid showing Expected → Actual → Payout amounts. Color-coded by event type (blue=rain, amber=AQI, red=curfew).

#### `ScoreBreakdownCard`
**Props:** `{ activityScore, stabilityScore, claimScore }`

Displays three progress bars for the insurance score components:
- Activity (blue, out of 40)
- Stability (purple, out of 30)
- Claim History (green, out of 30)

Uses internal `ScoreBar` component for each row.

#### `TriggerEventRow`
**Props:** `{ event }` (trigger event object)

Table row (`<tr>`) for admin events table showing: City, Type, Severity (colored tag), Payout %, Start time, Active/Ended status with animated dot.

#### `RiderRow`
**Props:** `{ rider, onClick }`

Table row (`<tr>`) for admin riders table showing: Name (with avatar initials), Phone, City, Platform, Score (color-coded), Active/Inactive tag.

---

### `src/components/charts/WeeklyAreaChart.jsx`
**Purpose:** Reusable Recharts-based area chart with dark theme styling.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | required | `[{ label, value }, ...]` |
| `color` | string | `'#3B82F6'` | Chart color |
| `height` | number | `100` | Chart height in px |
| `showTooltip` | boolean | `true` | Enable/disable tooltip |
| `formatValue` | Function | undefined | Custom value formatter for tooltip |
| `id` | string | `'wac'` | Unique ID for gradient def (prevents SVG conflicts) |

**Features:**
- Semi-transparent gradient fill below the line
- Hidden Y-axis, compact X-axis labels (9px)
- Custom dark-themed tooltip (`DarkTooltip` component)
- Smooth monotone interpolation
- Active dot on hover (white-bordered circle)

Used in: `HomePage` (7-day earnings trend), `CoveragePage` (would be applicable)

---

### `src/components/layout/BottomNav.jsx`
**Purpose:** Mobile bottom tab navigation bar (5 tabs). Currently **unused in the desktop layout** but available for mobile viewport.

**Tabs:**
| Icon | Label | Route |
|------|-------|-------|
| Home | Home | `/` |
| Wallet | Payouts | `/payouts` |
| Shield | Shield | `/coverage` |
| FileText | Tax | `/tax` |
| User | Profile | `/profile` |

Uses `NavLink` with `isActive` for highlight state (blue accent + dot indicator).

---

### `src/components/layout/ProtectedRoute.jsx`
**Purpose:** Route guard components that enforce authentication and authorization.

**Exports:**

#### `ProtectedRoute`
Renders children if `currentUser` exists, otherwise redirects to `/login`. Shows `LoadingSpinner` during auth loading.

#### `AdminRoute`
Renders children if `isAdmin` is true, otherwise redirects to `/`. Shows `LoadingSpinner` during loading. Always used **inside** a `ProtectedRoute`.

---

### `src/components/layout/Sidebar.jsx`
**Purpose:** Left sidebar navigation panel (**104 lines**). Fixed-position, 240px wide.

**Sections (top to bottom):**
1. **Logo** — GigShield hexagon icon + brand text + "Income Protection" subtitle
2. **Event Banner** — Red alert card shown when active trigger events exist in rider's city. Shows event type and city with pulsing dot.
3. **Navigation** — 5 nav links (Dashboard, Payouts, Coverage, Tax Report, Profile). Admin users see a 6th "Admin Panel" link with a Settings icon.
4. **User Card** — Bottom-pinned card showing user avatar (initials), name, platform (color-coded), city, and a logout button.

**Key behaviors:**
- Highlights active route with blue accent
- Shows platform color (Swiggy orange, Zomato red, Blinkit green)
- Logout clears AuthContext and redirects to `/login`

---

### `src/components/layout/TopBar.jsx`
**Purpose:** Sticky top header bar (**124 lines**).

**Elements (left to right):**
1. **Page Title** — Dynamic title based on current route
2. **Search** — Decorative search input (not functional, hidden on mobile)
3. **Notification Bell** — Clickable button with:
   - Red pulse dot when active events exist
   - Dropdown panel (`notif-dropdown`) listing all active trigger events with severity tags, messages, and "LIVE" indicators
   - Empty state with "✅ All Clear" when no events
   - Closes on outside click
4. **User Avatar** — Initials in blue gradient circle

---

## `src/components/ui/` — UI Primitives

### `AnimatedCounter.jsx`
**Purpose:** Animated number counter with easeOutQuart easing.

**Exports:**
- `useAnimatedCounter(target, duration)` — hook returning the animated value
- `AnimatedCounter` component — `<span>` with animated count + prefix/suffix support

Uses `requestAnimationFrame` for smooth 60fps animation over the specified duration (default 1000ms).

---

### `EmptyState.jsx`
**Purpose:** Placeholder components for empty data states.

**Exports:**
- `EmptyState({ icon, title, message })` — centered empty state with icon, title, and message
- `ErrorState({ message, onRetry })` — error variant with retry button (uses red styling)

---

### `LoadingSpinner.jsx`
**Purpose:** Full-screen or inline loading indicator featuring the GigShield hexagon logo and three pulsing dots.

**Props:** `{ fullScreen = true }` — when `true`, covers the entire viewport.

---

### `ScoreGauge.jsx`
**Purpose:** Radial progress gauge for the insurance score using Recharts `RadialBarChart`.

**Props:**
| Prop | Default | Description |
|------|---------|-------------|
| `score` | 0 | Score value (0–100) |
| `size` | `'large'` | `'large'` (200px) or `'small'` (120px) |

**Features:**
- Color-coded by score tier (via `getScoreColor`)
- Glow effect using CSS `drop-shadow` filter
- 270° arc (225° to -45°)
- Center display: score number + label (label only in large mode)

---

### `SectionHeader.jsx`
**Purpose:** Consistent section header with title, optional subtitle, optional badge, and optional action slot.

**Props:** `{ title, subtitle, badge, badgeColor, action }`

Used throughout the app for section headings like "Recent Payouts", "Score History", "Monthly Breakdown".

---

### `StatusBadge.jsx`
**Purpose:** Color-coded payout status tag.

**Status mapping:**
| Status | Label | Color |
|--------|-------|-------|
| `completed` | Paid | Green |
| `processing` | Processing | Amber |
| `pending` | Pending | Amber |
| `flagged` | Under Review | Red |
| Other | Raw status text | Slate |

Renders as a rounded pill with a small colored dot + label text.

---

### `TriggerBanner.jsx`
**Purpose:** Event alert banner displayed at the top of the dashboard (**68 lines**).

**Two states:**
1. **No events** — Green "All clear today" banner with pulsing green dot
2. **Active event** — Gradient banner (blue/amber/red depending on event type) showing the most severe event's message, payout percentage, and "LIVE" indicator with ping animation

**Logic:**
- `pickMostSevere(events)` — sorts by `EVENT_TYPE_PRIORITY` (curfew > rain > AQI) then by `SEVERITY_ORDER` to show the worst event
- Color theming: rain=blue gradient, aqi=amber gradient, curfew=red gradient
- Subtle noise pattern overlay using `repeating-radial-gradient`

---

## `src/pages/` — Page Components

### `src/pages/auth/LoginPage.jsx`
**Purpose:** Phone + OTP authentication page (**~140 lines**).

**Flow:**
1. **Phone step** — 10-digit phone input with +91 prefix, validation, "Send OTP" button
2. **OTP step** — 6-digit OTP input (accepts `123456`), verify button, "Change number" link

**UI Elements:**
- Ambient radial glows (blue + green)
- Floating animated logo with orbiting ring
- "GigShield" branding with gradient text
- Bottom sheet design for the form
- Admin hint: `💡 Admin login: 0000000000`

**Authentication logic:**
- If phone = `0000000000` → loads `MOCK_ADMIN` profile (admin role)
- All other phones → loads `MOCK_RIDER` profile (rider role)
- Sets `currentUser` and `riderProfile` in AuthContext
- Navigates to `/` on success

---

### `src/pages/auth/RegisterPage.jsx`
**Purpose:** New rider onboarding form (**144 lines**). Two-step wizard.

**Step 0 — Personal Info:**
- Full Name (text input)
- City (dropdown from `CITIES` constant)
- Platform (button selector from `PLATFORMS` with brand colors)
- Validation on "Continue"

**Step 1 — Nominee Details:**
- Nominee Name (text input)
- Nominee Phone (10-digit tel input)
- Info box explaining nominee purpose
- "🎉 Activate Protection" submit button

**On submit:** Creates a fresh rider profile with zeroed-out scores and navigates to `/`.

---

### `src/pages/rider/HomePage.jsx`
**Purpose:** Main dashboard — the primary screen after login (**370 lines**).

**Layout:** Two-column desktop grid (flexible left + 340px right sidebar).

**Left Column:**
1. **TriggerBanner** — active event alert (full width, above grid)
2. **Greeting** — "Hey, {name} 👋" with date and quick action buttons (Coverage, Tax, Refresh, Record Delivery)
3. **Earnings Card** — gradient blue hero card with today's earnings, delivery count, pool deduction. Flashes on update.
4. **7-Day Trend** — WeeklyAreaChart with earnings sparkline + percentage delta vs last week
5. **Activity Heatmap** — 18-bar hourly delivery visualization (6am–11pm) with color legend

**Right Column:**
1. **Protection Score** — mini ScoreGauge with score number + progress bar. Clickable → navigates to `/coverage`
2. **Platform Card** — shows platform name, city, "Protected" status, avg daily earnings
3. **Stats Row** — 3 stat pills: Active Days, Claims, Score
4. **Recent Payouts** — last 3 payouts with event type icon, amount, status badge. "See all" links to `/payouts`

**Record Delivery Modal:**
- Amount input (large numeric) with quick-fill buttons (₹50, ₹80, ₹120, ₹200)
- Shows "You'll earn" calculation (amount - ₹1 pool)
- On confirm: adds delivery via `addDelivery()`, flashes earnings card, shows toast

---

### `src/pages/rider/PayoutsPage.jsx`
**Purpose:** Full payout history with filtering, visualization, and timeline view (**190 lines**).

**Layout:** Two-column grid (flexible left + 320px right sidebar).

**Left Column:**
1. **Trigger Payout button** — calls `http://127.0.0.1:8000/api/payout/check` API endpoint (backend integration point)
2. **Total Received** — green gradient hero card with total paid amount + counts
3. **Filter bar** — All / Completed / Pending / Flagged filter buttons
4. **View toggle** — List view ↔ Timeline view
5. **Payout list** — `PayoutCard` components for each filtered payout
6. **Timeline view** — Groups payouts by month with separator pills showing month total

**Right Column:**
1. **Donut Chart** — Recharts PieChart showing payout distribution by event type (rain=blue, AQI=amber, curfew=red) with legend
2. **Quick Stats** — 3 rows: Completed (green), Processing (amber), Flagged (red) with counts

---

### `src/pages/rider/CoveragePage.jsx`
**Purpose:** Insurance score deep dive (**165 lines**).

**Layout:** Two-column 50/50 grid.

**Left Column:**
1. **Score Hero** — massive score display (72pt font) with ScoreGauge, tier tag ("Good Level"), and "Updated nightly by GigShield AI" note
2. **Loan Eligibility** — green card if eligible (shows limit), grey card if not (shows "Reach score 60")
3. **Milestones** — 4 milestone markers (Fair/40, Loan/60, Excellent/80, Elite/100) with locked/unlocked icons

**Right Column:**
1. **Score Breakdown** — `ScoreBreakdownCard` with 3 progress bars
2. **Score History Chart** — Recharts AreaChart showing 8-week score progression with reference dot on current score
3. **How It's Calculated** — explainer section with 3 items: Activity (40pts), Stability (30pts), Claim History (30pts)

Uses `useCountUp` custom hook for animated score reveal.

---

### `src/pages/rider/TaxSummaryPage.jsx`
**Purpose:** Annual tax report with FY selector, charts, and PDF export (**152 lines**).

**Layout:** Two-column grid (flexible left + 340px right).

**Header:** FY selector dropdown (current ± 2 years) + "Download PDF" button.

**Left Column:**
1. **Net Taxable Hero** — deep blue gradient card with large ₹ amount and FY label
2. **Monthly Chart** — Grouped bar chart (Recharts BarChart): blue bars = earnings, green bars = payouts. Current month highlighted. Dashed reference line for monthly average.

**Right Column:**
1. **Income Breakdown** — 4-row table: Gross Earnings, Pool Deductions (-), Payouts Received (+), Net Taxable (highlighted)
2. **Disclaimer** — amber warning about consulting a tax professional

**PDF feature:** Calls `generateTaxPDF()` from `pdfGenerator.js`.

---

### `src/pages/rider/ProfilePage.jsx`
**Purpose:** User profile management (**185 lines**).

**Layout:** Two-column grid (300px left + flexible right).

**Left Column:**
1. **Avatar Card** — large initials avatar with blue gradient, name, phone, platform badge
2. **Stats** — 3 stat pills: Score, Days, Claims
3. **Sign Out** — red logout button

**Right Column:**
1. **Personal Details** — 4-field grid: Full Name, Phone, City, Member Since. "Edit Name" button opens modal.
2. **Nominee Details** — 2-field grid: Nominee Name, Nominee Phone. "Edit" button opens modal. Info text: "Receives payouts if you're unavailable".

**Modals:**
- **Edit Name** — text input + save (updates `riderProfile` in context)
- **Edit Nominee** — name + phone inputs with validation (10-digit check)

Both use internal `Modal` wrapper component with click-outside-to-close.

---

### `src/pages/admin/AdminPage.jsx`
**Purpose:** Admin operations dashboard (**329 lines**). Requires admin role.

**Header Section:**
- Shield icon + "GigShield Admin" title + "LIVE" badge
- 3 quick stat cards: Active Events, Pool Balance, Total Riders
- Tab navigation: Events / Pool / Riders

**Events Tab:**
- Full-width data table with columns: City, Type, Severity (colored tags), Payout %, Started (timestamp), Status (active dot / ended)
- Uses `TriggerEventRow` components
- Live indicator dot

**Pool Tab:**
- 2 hero cards: Pool Balance (green) + Pending Payouts (red)
- Reserve Ratio — large display with health assessment (Healthy/Moderate/Critical)
- Pool Flow Chart — Recharts ComposedChart with:
  - Blue bars: inflow
  - Red bars: outflow
  - Green line: balance
- City Breakdown — detailed per-city inflow/outflow/balance list

**Riders Tab:**
- Score Distribution — Recharts BarChart histogram with 5 buckets (0-20 to 81-100), color-coded
- Searchable riders table with columns: Name (avatar), Phone, City, Platform, Score (colored), Status
- Rider detail modal (on row click) — shows all profile fields in a compact sheet

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total source files** | 31 |
| **React components** | 22 |
| **Custom hooks** | 5 |
| **Utility modules** | 4 |
| **Constants files** | 3 |
| **Page components** | 8 |
| **Lines of code (approx)** | ~3,400 |
