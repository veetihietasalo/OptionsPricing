# OptionsPricing

> **Educational use only. This is not investment advice.**
>
> Signals such as BUY_CALL, BUY_PUT, and SELL_VOLATILITY are illustrative model outputs, not recommendations. Nothing here is financial advice. Options trading carries a risk of loss.

Black-Scholes pricer for European options: price, all five Greeks, and a price heatmap over strikes and expiries. TypeScript on Bun and Express, with a React UI styled after the Bloomberg Terminal.

The pricing is plain closed-form code, 134 lines in `src/blackScholes.ts`, with no pricing library. There is no Bloomberg connection and no market data: every input comes from the UI sliders or the API request.

## What's inside

- `src/blackScholes.ts`: price, delta, gamma, theta, vega and rho for calls and puts, no dividends.
  - d1 = (ln(S/K) + (r + σ²/2) T) / (σ √T), d2 = d1 − σ √T
  - call = S N(d1) − K e^(−rT) N(d2), put = K e^(−rT) N(−d2) − S N(−d1)
  - N is the Abramowitz-Stegun polynomial approximation of the normal CDF.
  - Theta is per year. Vega and rho are per 1 percentage point.
- `src/server.ts`: Express API on port 3001: `POST /api/options/price`, `/api/options/heatmap`, `/api/signals`, `/api/pairs/scan` and `GET /api/health`. Request and response shapes are in [docs/api.md](docs/api.md).
- `client/`: React 19, Vite 7, Tailwind. Inputs, the Greeks, and tabs for heatmap, signals and pairs.
- Signals and pairs are rule-based demos, not ML. Signals: IV rank against a fixed 10% to 80% range, plus spot more than 5% from the strike. Pairs: z-score of the IV spread for 5 equity pairs, on random IVs, so those signals mean nothing yet.

## Run

```bash
bun install
bun run src/server.ts        # API on http://localhost:3001

cd client
bun install
bun run dev                  # UI on http://localhost:5173
```

The client calls `http://localhost:3001` directly, so the API has to run on that port. One request:

```bash
curl -X POST localhost:3001/api/options/price -H 'content-type: application/json' \
  -d '{"spot":100,"strike":100,"rate":0.05,"volatility":0.25,"time":1,"type":"call"}'
```

## Results

S = 100, K = 100, r = 5%, σ = 25%, T = 1 year, from the running API:

- call: price 12.3360, delta 0.6274, gamma 0.015137, theta −7.2505, vega 0.3784, rho 0.5040
- put: price 7.4589, delta −0.3726, gamma 0.015137, theta −2.4943, vega 0.3784, rho −0.4472

Put-call parity holds: C − P = 4.8771 and S − K e^(−rT) = 4.8771. A separate calculation in Python with `math.erf` gives the same call and put prices to 4 decimals. `bun run build` in `client/` passes and the dev server answers on port 5173. The UI itself wasn't clicked through.

## How it was built

The app arrived as one commit in November 2025, so git doesn't show who wrote which part. Coding agents (Mad Tech Agents) made 5 of the 9 commits, all in October 2026: docs matched to the code, Signals and Pairs imported properly, heatmap cells moved under the right strike and expiry, API doc examples taken from the real server.

## What I learned

- The closed form is short. The care goes into conventions: theta per year, vega and rho per percentage point, no dividends. All three are written down in the API doc.
- A result I can check beats a claim. Put-call parity checks the call against the put, and the doc examples now come from the real server.
- A fixed 10% to 80% range is not IV rank. Real IV rank needs historical IV, so those parts are labelled demos instead of strategy.
- A heatmap can look fine and be wrong. Cells sat under the wrong strike and expiry until the October fix (`0b593d4`), so a chart needs a check against the numbers behind it.

## Left

- No tests yet. CI installs both parts and builds the client, so the client is type checked. The backend isn't: `tsc --noEmit` shows 2 errors in `src/server.ts` (`Request` and `Response` need type-only imports). Bun runs it anyway.
- No live market data. Signals and pairs need real historical IV before they mean anything.
- Not deployed. The client has `localhost:3001` hardcoded.

MIT license, see `LICENSE`.
