# 3D Bharat — Deal Intelligence Platform

A frontend-only, fully simulated investor & corporate dashboard built for the 3D Bharat Full Stack Developer assignment. No backend or external API is used anywhere — every network-like interaction such as fetching, filtering, sorting, pagination and errors is simulated in the browser through a dedicated service layer.

## Tech Stack

| Concern          | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Framework        | Next.js 16 (App Router, TypeScript)               |
| State Management | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| Charts           | Recharts                                          |
| Styling          | Tailwind CSS v4                                   |
| Icons            | lucide-react                                      |
| Theming          | next-themes                                       |
| Persistence      | `localStorage`                                    |

## Architecture

```text
src/

├─ app/                      # Next.js App Router pages
│  ├─ page.tsx               → Investor Overview
│  ├─ deals/page.tsx         → Deal Explorer
│  ├─ deals/[id]/page.tsx    → Deal Details
│  ├─ investments/page.tsx   → My Investments
│  └─ corporate/page.tsx     → Corporate Analytics
│
├─ components/
│  ├─ layout/                # Sidebar, Topbar, Ticker, AppShell
│  ├─ dashboard/             # SummaryCard, Charts, RecommendedDeals
│  ├─ deals/                 # DealCard, DealFiltersPanel, Pagination
│  └─ ui/                    # Reusable UI components
│
├─ services/                 # Simulated backend/data layer
│  ├─ api.ts                 → Simulated request handling
│  ├─ dealService.ts         → Deal-related operations
│  └─ investorService.ts     → Investor & corporate operations
│
├─ store/                    # Redux Toolkit
│  ├─ slices/dealsSlice.ts
│  ├─ slices/investorsSlice.ts
│  ├─ slices/interestsSlice.ts
│  └─ Providers.tsx
│
├─ hooks/                    # Reusable custom hooks
│  ├─ useDebounce
│  └─ useAsync
│
├─ utils/
│  ├─ format.ts              → Formatting utilities
│  └─ scoring.ts             → Recommendation scoring
│
├─ types/                    # Shared TypeScript types
│
└─ data/                     # Generated mock data
```

### Architecture Approach

The application follows a layered frontend architecture.

* **App Layer:** Handles routing and page-level composition.
* **Component Layer:** Contains reusable UI components.
* **Service Layer:** Simulates backend/API behavior.
* **State Layer:** Redux Toolkit manages shared application state.
* **Data Layer:** Contains generated mock data.
* **Utility Layer:** Contains reusable formatting and business logic.
* **Types:** Provides shared TypeScript contracts.

This separation keeps the UI, business logic, state management and data access independent and makes the application easier to maintain and extend.

## Data Flow Design

```text
Mock Data
    ↓
Service Layer
    ↓
Simulated Async Request
    ↓
Redux / Component State
    ↓
Search / Filter / Sort
    ↓
UI Components
    ↓
Deal Cards / Charts / Deal Details
```

## Optimization Strategies

* Debounced search to reduce unnecessary filtering operations.
* `useMemo` for expensive recommendation calculations.
* Response caching for repeated deal queries.
* Pagination to limit the amount of displayed data.
* Reusable components to avoid duplicate UI logic.
* Skeleton loading states for better perceived performance.
* Next.js route-based code splitting.
* `prefers-reduced-motion` support for animations.


