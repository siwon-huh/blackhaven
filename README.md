# Blackhaven Live

Unofficial dashboard for **Blackhaven**, a reserve-backed treasury protocol on MegaETH.
Live market metrics, RBT fair-value modeling, OHM-fork postmortem, user playbook, and audit risk briefing.

Built by [c4lvin](https://x.com/c4lvin), researcher at [Four Pillars](https://4pillars.io).

> 한국어 README: [docs/README.ko.md](./docs/README.ko.md)
> 개발자 문서 (한글): [docs/DEVELOPING.ko.md](./docs/DEVELOPING.ko.md)

## What is Blackhaven

Blackhaven is a reserve-backed treasury protocol on MegaETH. Users commit USDm through bonds and receive RBT (Reserve-Backed Token) at a discount, vesting linearly to maturity. 90% of bonded USDm flows to the treasury, 10% to the LiquidityManager as protocol-owned liquidity. RBT can be staked into sRBT, which can then be committed for 2 to 52 weeks for an additional RBT distribution at maturity. A Backing Arbitrage Module (BAM) automatically restores price toward NAV — selling RBT to treasury when above NAV, buying and burning when below.

The protocol is a structural reworking of the OlympusDAO design. It removes the rebase loop, uses a single stablecoin backing (USDm), and runs the inverse-bond mechanism automatically and on both sides via BAM.

Audit: [Zellic, January 19, 2026](https://docs.blackhaven.xyz). Project status: post-mainnet, Genesis Phase 1.

## What this dashboard does

- **/[lang]/** — Live snapshot. RBT market price, NAV, premium multiple, bond pool depth and discounts, Stake / Commit TVL, and a verdict tag (undervalued / fair / bond-only / overvalued) computed against a 4-layer fair-value model. Data refreshes every 1 second.
- **/[lang]/about** — Protocol overview, fund-flow diagram, the four core mechanics (Bond, Stake, Commit, BAM), and the full contract mapping with on-chain explorer links.
- **/[lang]/playbook** — Capital-sizing guide that picks a recommended bond tenor based on entered capital and live pool depth. Per-horizon plays (Launch Week, Compounding Lane, Reserve Layer Capture) with capital allocation, weekly action sequence, and stop signals.
- **/[lang]/forks** — Per-fork case files for seven OHM forks (OHM, TIME, KLIMA, HEC, BTRFLY, SB, FHM) with status, monthly normalized price curves from launch, common failure patterns, and what Blackhaven changed.
- **/[lang]/risks** — All 11 Zellic audit findings with severity, remediation status, and detail. Protocol-level risk and user-entry scenario risk with guardrails.

`[lang]` is `ko` or `en`. Both render at build time.

## Stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS with CSS-variable based design tokens for light/dark mode
- viem for on-chain RPC against MegaETH (chain id 4326)
- dexscreener public API for live market data
- Static SVG visualizations (no chart library)

## Live data sources

- **Market**: dexscreener pair `0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032` (Kumbaya RBT/USDm pool)
- **Backing / NAV**: BackingCalculator.NAV() and reserves balance read on-chain
- **Bond TVL**: per-bond contract RBT balance × live market price
- **Stake / Commit**: sRBT balance, RBTNote contract reward pool, all read on-chain

All values fall back to a manually synced static snapshot if RPC fails.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # SSG for /ko and /en routes
```

Node 20+, no env variables required for the public read-only paths.

## Notes

Numbers on this site mix forward-looking scenarios with live data. Not investment advice or a promise of returns. NAV and reserves are read on-chain when RPC is available; Stake and Commit details fall back to a manually synced snapshot when on-chain data is unavailable. The fair-value model uses public assumptions documented in the Fair Value section of the Live page.

## License

MIT.
