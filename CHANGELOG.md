# GigShield — Changelog

## [Unreleased] — 2026-04-02

### Removed

#### Feature pills from Login Page (`src/pages/auth/LoginPage.jsx`)

The following three feature-badge pills have been **removed** from the Login / Hero section of the application:

| # | Badge | Emoji | Purpose (removed) |
|---|-------|-------|--------------------|
| 1 | **Rain Coverage** | 🌧️ | Indicated parametric rain-event protection |
| 2 | **AQI Protection** | 🌫️ | Indicated air-quality index protection |
| 3 | **Curfew Shield** | 🚔 | Indicated curfew-event protection |

### Why?

These decorative pills were displayed on the login screen below the "AI-powered parametric income protection" tagline. They have been removed to simplify the login UI.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/auth/LoginPage.jsx` | Removed the `{/* Feature pills */}` `<div>` block (lines 75-87) containing the three badge elements and their `.map()` renderer. |

> **Note:** No other files were modified. The feature labels that appear elsewhere in the app (e.g., `HomePage.jsx`, `triggerConfig.js`, `cards/index.jsx`) remain unchanged as they serve functional purposes beyond decoration.
