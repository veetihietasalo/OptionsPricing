# OptionsPricing

Black-Scholes options pricer with all five Greeks, a price heatmap over strikes and expiries, and two demo screens for volatility signals and pairs trading. Bun + Express API, React frontend styled like the Bloomberg Terminal.

What works:
- `src/blackScholes.ts`: price, delta, gamma, theta, vega and rho for European calls and puts. The normal CDF uses the Abramowitz-Stegun polynomial approximation. Theta is per year, vega and rho per 1 percentage point.
- `POST /api/options/price`: one option, price and Greeks.
- `POST /api/options/heatmap`: prices over a grid of strikes and expiries, drawn as a heatmap in the client.
- `POST /api/signals`: rule-based, not ML. IV rank is measured against a fixed 10% to 80% range instead of historical IV, plus simple moneyness rules (spot more than 5% from the strike).
- `POST /api/pairs/scan`: z-score of the IV spread for 5 equity pairs. The IVs are random demo data, so the signals mean nothing yet.
- `GET /api/health`

Run it:

```bash
bun install
bun run src/server.ts        # API on http://localhost:3001

cd client
bun install
bun run dev                  # UI on http://localhost:5173
```

The client calls `http://localhost:3001` directly, so the API has to run on that port.

Stack: TypeScript, Bun, Express 5, React 19, Vite 7, Tailwind, Recharts.

Left:
- No tests yet. CI installs both parts and builds the client, type checking is still skipped.
- No live market data. `bloomberg-app.json` and `docs/bloomberg_integration.md` are a plan for the Bloomberg App Portal, none of it is built.
- Signals and pairs need real historical IV before they mean anything.

API details: [docs/api.md](docs/api.md). MIT license.
