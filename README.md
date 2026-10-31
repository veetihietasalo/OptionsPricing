# OptionsPricing

> **Educational use only. This is not investment advice.**
>
> Signals such as BUY_CALL, BUY_PUT, and SELL_VOLATILITY are illustrative model outputs, not recommendations. Nothing here is financial advice. Options trading carries a risk of loss.

Black-Scholes pricer for European options: price, all five Greeks, and a price heatmap over strikes and expiries. Bun + Express API, React UI styled after the Bloomberg Terminal. There is no Bloomberg data connection: no BLPAPI code, and every input comes from the UI sliders or the API request. The signals and pairs tabs are rule-based demos, not ML.

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

Stack: TypeScript, Bun, Express 5, React 19, Vite 7, Tailwind.

Left:
- No tests yet. CI installs both parts and builds the client (`tsc -b && vite build`), so the client is type checked. The backend isn't type checked in CI yet.
- No live market data and no Bloomberg connection.
- Signals and pairs need real historical IV before they mean anything.

API details: [docs/api.md](docs/api.md). MIT license.
