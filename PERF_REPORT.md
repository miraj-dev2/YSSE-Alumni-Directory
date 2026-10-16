# Performance & Reliability Report: YSSE Alumni Directory

## Before Optimization Baseline

### 1. Client Bundle & Chunk Sizes (`npm run build`)
- **Total JavaScript:** 1,201.53 kB uncompressed (368.54 kB gzipped)
- **Total CSS:** 44.33 kB uncompressed (8.56 kB gzipped)
- **Grand Total Bundle:** 1,245.86 kB uncompressed (377.09 kB gzipped)

#### Detailed Chunk Breakdown:
| Asset | Type | Raw Size | Gzip Size |
| :--- | :--- | :--- | :--- |
| `index-CfFOTeKN.js` (main bundle) | JS | 406.95 kB | 126.08 kB |
| `AdminDashboardPage-CALzNrlX.js` | JS | 374.92 kB | 107.12 kB |
| `schemas-ByNjrcq_.js` | JS | 111.47 kB | 33.48 kB |
| `LandingPage-Cft0LPQj.js` | JS | 48.97 kB | 15.50 kB |
| `SessionsPage-CyWMDmXQ.js` | JS | 24.11 kB | 5.84 kB |
| `MyProfilePage-B5UbqRxn.js` | JS | 22.49 kB | 6.02 kB |
| `papaparse.min-BAktTMX6.js` | JS | 18.46 kB | 6.72 kB |
| `DashboardOverviewPage-BOQFjAyY.js` | JS | 14.42 kB | 3.75 kB |
| `AlumniProfilePage-BaCp-655.js` | JS | 14.06 kB | 3.91 kB |
| `DirectoryPage-ChgS5uRg.js` | JS | 14.03 kB | 4.04 kB |
| `AdminApprovalsPage-DlVRt_XK.js` | JS | 13.67 kB | 3.84 kB |
| `AdminAlumniPage-Buy3Yu5W.js` | JS | 13.56 kB | 4.20 kB |
| `AdminImportPage-CQ7ZS5Je.js` | JS | 13.23 kB | 4.04 kB |
| `createLucideIcon-Cw_EeKCV.js` | JS | 12.94 kB | 5.12 kB |
| `DashboardLayout-BjZ2S65K.js` | JS | 8.06 kB | 2.19 kB |
| `useQuery-8sAsAgMZ.js` | JS | 7.79 kB | 2.84 kB |
| `AlumniFormModal-DEzCD4LA.js` | JS | 6.43 kB | 1.67 kB |
| `AdminSessionsPage-B6O75Lr6.js` | JS | 5.03 kB | 1.79 kB |
| `RequestSessionModal-BefUg0vq.js` | JS | 4.86 kB | 1.81 kB |
| `dist-DyifkAL-.js` | JS | 4.71 kB | 1.77 kB |
| `AccountPage-BgDs16WD.js` | JS | 4.59 kB | 1.59 kB |
| `DashboardRequestsPage-sS3Qap6N.js` | JS | 4.52 kB | 1.69 kB |
| `AdminSettingsPage-V5Z9piJG.js` | JS | 4.31 kB | 1.52 kB |
| `AdminStaleProfilesPage-DJ_JhFgC.js` | JS | 4.06 kB | 1.48 kB |
| `DashboardSavedPage-DJYDBFBF.js` | JS | 3.92 kB | 1.59 kB |
| `DashboardSessionsPage-QHOqR1ES.js` | JS | 3.55 kB | 1.38 kB |
| `DashboardNotificationsPage-CSAvmcyo.js` | JS | 3.34 kB | 1.41 kB |
| `alumniService-nciUVRzr.js` | JS | 3.16 kB | 1.24 kB |
| `adminService-CpQxI21n.js` | JS | 3.07 kB | 1.26 kB |
| `AdminActivityPage-CCuXZE0T.js` | JS | 2.89 kB | 1.13 kB |
| `AlumniCard-B6TzBNnB.js` | JS | 2.66 kB | 0.97 kB |
| `useMutation-CZfOJ-rc.js` | JS | 2.30 kB | 0.94 kB |
| `ConfirmDialog-CZ4voSXR.js` | JS | 1.99 kB | 0.85 kB |
| `AdminPageHeader-BDubMbz8.js` | JS | 1.88 kB | 0.89 kB |
| `EmptyState-BzmDkqe-.js` | JS | 1.86 kB | 0.88 kB |
| `SkeletonLoader-ChlaqRGe.js` | JS | 1.27 kB | 0.48 kB |
| `alumniMapper-DePRTucL.js` | JS | 1.05 kB | 0.55 kB |
| `StatusBadge-BEy9D8Bq.js` | JS | 1.01 kB | 0.56 kB |
| `sessionApi-D2ph_ly6.js` | JS | 0.88 kB | 0.44 kB |
| `EmptyState-BtJATUSN.js` | JS | 0.82 kB | 0.44 kB |
| `portalApi-D3U8M0Q2.js` | JS | 0.79 kB | 0.33 kB |
| `sessionService-D3b1pwxS.js` | JS | 0.79 kB | 0.39 kB |
| `sessionMapper-C0ju-oUz.js` | JS | 0.77 kB | 0.38 kB |
| `quote-CuPGByfg.js` | JS | 0.61 kB | 0.30 kB |
| `compass-yCPfQbjG.js` | JS | 0.48 kB | 0.32 kB |
| `layers-gfQphEDG.js` | JS | 0.47 kB | 0.27 kB |
| `trash-3JyrMUQu.js` | JS | 0.38 kB | 0.25 kB |
| `save-CvUXk9QS.js` | JS | 0.36 kB | 0.25 kB |
| `inbox-CMOdgC8H.js` | JS | 0.32 kB | 0.25 kB |
| `send-72L3J1Yj.js` | JS | 0.32 kB | 0.25 kB |
| `triangle-alert-EI-_55n8.js` | JS | 0.32 kB | 0.25 kB |
| `calendar-BZzZsnuB.js` | JS | 0.29 kB | 0.23 kB |
| `map-pin-BHmhv5dM.js` | JS | 0.29 kB | 0.25 kB |
| `external-link-BAdiimMo.js` | JS | 0.28 kB | 0.22 kB |
| `chevron-right-vDYXxLt9.js` | JS | 0.27 kB | 0.20 kB |
| `message-square-DiJoToDL.js` | JS | 0.27 kB | 0.23 kB |
| `upload-CsYxVTLQ.js` | JS | 0.26 kB | 0.22 kB |
| `circle-check-big-C3-9MjYI.js` | JS | 0.25 kB | 0.22 kB |
| `clock-Cm6oc4va.js` | JS | 0.20 kB | 0.19 kB |
| `loader-circle-qC3c0xn4.js` | JS | 0.20 kB | 0.19 kB |
| `check-Chc2p1yc.js` | JS | 0.16 kB | 0.16 kB |
| `chevron-down-CxYqVGp1.js` | JS | 0.16 kB | 0.16 kB |
| `index-Q9QfbXqS.css` | CSS | 44.33 kB | 8.56 kB |

---

### 2. Backend Latencies with 2,009 Seeded Alumni (5 runs each, median)
- **Database Size:** 2,009 alumni records (2,000 demo + 9 seeded/claimed accounts)
- `GET /api/alumni/featured`: **13.64 ms** (runs: [43.6, 17.9, 11.7, 11.4, 13.6])
- `GET /api/alumni/stories`: **11.20 ms** (runs: [42.3, 8.1, 12.0, 7.0, 11.2])
- `GET /api/alumni?pageSize=50`: **18.06 ms** (runs: [218.1, 20.3, 14.7, 18.1, 12.7])
- `GET /api/sessions/offers`: **25.52 ms** (runs: [43.9, 25.5, 25.2, 15.8, 28.8])
- `GET /api/admin/stats` (admin cookie): **35.64 ms** (runs: [200.0, 35.6, 48.7, 32.7, 18.3])
- `POST /api/auth/login` (valid credentials): **83.17 ms** (runs: [83.0, 110.0, 83.2, 63.6, 109.8])

---

### 3. Event Loop Blocking During Login (`crypto.scryptSync`)
- Concurrent `/api/health` queries while login is in flight:
  - **Worst `/api/health` latency:** **106.31 ms**
  - **Median `/api/health` latency:** **70.46 ms**
  - **Baseline idle `/api/health` latency:** ~1.2 ms
  - **Diagnosis:** `crypto.scryptSync` monopolizes the V8 single thread for ~80-110 ms per login, freezing all inbound HTTP handling.

---

### 4. Real Browser Load Timings (`npm run preview` on `/`)
Measured via Headless Chrome Navigation Timing API:
- `responseEnd`: **80.9 ms**
- `domInteractive`: **101.2 ms**
- `domContentLoaded`: **396.5 ms**
- `loadEventEnd`: **401.4 ms**

---

## After Optimization

### 1. Client Bundle & Chunk Sizes (`npm run build`)
- **Total JavaScript:** 1,205.39 kB uncompressed (369.09 kB gzipped)
- **Total CSS:** 44.35 kB uncompressed (8.59 kB gzipped)
- **Grand Total Bundle:** 1,249.74 kB uncompressed (377.68 kB gzipped)

#### Static Assets & Font Optimizations:
- `public/favicon.png`: Reduced from **95.33 kB** (1024x1024) to **3.71 kB** (64x64) — **96.1% size reduction**.
- Deduplication: Removed unused identical copies `public/ysse.png` (95.33 kB) and `src/assets/ysse-logo.png` (95.33 kB).
- Google Fonts CSS: Trimmed unused variable axes and italic styles, reducing `@font-face` definitions from **17 to 12** and CSS payload by **30.9%** (4,823 B to 3,332 B).

---

### 2. Backend Latencies with 2,009 Seeded Alumni (5 runs each, median)
- `GET /api/alumni/featured`: **11.72 ms** (runs: [11.6, 11.7, 13.0, 20.5, 10.9])
- `GET /api/alumni/stories`: **9.28 ms** (runs: [12.2, 10.2, 9.1, 8.2, 9.3])
- `GET /api/alumni?pageSize=50`: **17.32 ms** (runs: [21.4, 16.4, 16.2, 17.9, 17.3])
- `GET /api/sessions/offers`: **23.79 ms** (runs: [43.8, 22.1, 25.4, 23.2, 23.8])
- `GET /api/admin/stats` (admin cookie): **13.80 ms** (runs: [70.8, 20.9, 13.8, 13.2, 7.0])
- `POST /api/auth/login` (valid credentials): **145.35 ms** (runs: [229.7, 157.4, 132.6, 134.4, 145.4])
- `GET /api/alumni/stats` *(new public aggregate endpoint)*: **2.85 ms** (runs: [8.0, 2.6, 2.9, 2.9, 2.3])

---

### 3. Event Loop Blocking During Login (`crypto.scrypt` Async)
- Concurrent `/api/health` queries while login is in flight:
  - **Worst `/api/health` latency:** **30.56 ms** *(vs 106.31 ms before, 71.3% reduction)*
  - **Median `/api/health` latency:** **15.56 ms** *(vs 70.46 ms before, 77.9% reduction)*
  - **Diagnosis:** Offloading scrypt hashing to the libuv worker thread pool prevents the main V8 event loop from stalling, allowing concurrent health and API requests to process smoothly.

---

### 4. Real Browser Load Timings (`npm run preview` on `/`)
Measured via Headless Chrome Navigation Timing API:
- `responseEnd`: **37.3 ms** *(vs 80.9 ms before, 53.9% improvement)*
- `domInteractive`: **57.1 ms** *(vs 101.2 ms before, 43.6% improvement)*
- `domContentLoaded`: **234.9 ms** *(vs 396.5 ms before, 40.8% improvement)*
- `loadEventEnd`: **241.0 ms** *(vs 401.4 ms before, 40.0% improvement)*

---

## Before / After Comparison Table

| Metric | Before | After | Delta / Improvement | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Stats Latency** (`GET /api/admin/stats`) | 35.64 ms | 13.80 ms | **-61.3%** | Moved grouping into PostgreSQL `$queryRaw` |
| **Landing Stats Latency** (Replaced `pageSize=50`) | 18.06 ms | 2.85 ms | **-84.2%** | New `/api/alumni/stats` with DB aggregates + 60s cache |
| **Worst Event Loop Stall** (during Login) | 106.31 ms | 30.56 ms | **-71.3%** | Asynchronous scrypt offloaded to worker threads |
| **Median Event Loop Stall** (during Login) | 70.46 ms | 15.56 ms | **-77.9%** | Non-blocking HTTP request processing |
| **Login Latency** (`POST /api/auth/login`) | 83.17 ms | 145.35 ms | +62.18 ms | Intentional OWASP cost upgrade ($N=32768$) |
| **Favicon File Size** (`public/favicon.png`) | 95.33 kB | 3.71 kB | **-96.1%** | Resized 1024x1024 to 64x64 |
| **Duplicate Logos** | 3 copies (286 kB) | 1 copy (95 kB) | **-190.6 kB** | Deduplicated unused `ysse.png` and `assets/ysse-logo.png` |
| **Google Fonts `@font-face` definitions** | 17 | 12 | **-29.4%** | Trimmed unused weights and italic styles |
| **Browser `responseEnd`** | 80.9 ms | 37.3 ms | **-53.9%** | Compression & static header improvements |
| **Browser `domInteractive`** | 101.2 ms | 57.1 ms | **-43.6%** | Faster asset delivery and non-blocking layout |
| **Browser `domContentLoaded`** | 396.5 ms | 234.9 ms | **-40.8%** | Headless Chrome navigation timing |
| **Browser `loadEventEnd`** | 401.4 ms | 241.0 ms | **-40.0%** | Full load completion |

