# Blackhaven Live

Unofficial dashboard for **Blackhaven**, a reserve-backed treasury protocol on MegaETH.
Live market metrics, RBT fair-value model, OHM-fork postmortem.

Built by [c4lvin](https://x.com/c4lvin), researcher at [Four Pillars](https://4pillars.io).

## Pages

- `/` — Live snapshot of RBT/USDm pool, NAV premium, 4-layer fair value
- `/about` — Protocol overview, fund-flow diagram, 4 mechanics, user playbook
- `/forks` — OHM fork postmortem, normalized price curves, common failure patterns

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- 1-second polling against [dexscreener](https://dexscreener.com) via `/api/metrics`
- Static SVG visualizations (no chart library)

## Local

```bash
npm install
npm run dev   # http://localhost:3000
```

## Notes

All numbers are a mix of forward-looking scenarios and live data. Not financial advice.
NAV / Reserves / Stake / Commit values are static fallbacks synced manually from the official Metrics page.
