# API Documentation

## Base URL
`http://localhost:3001/api`

## Endpoints

### 1. Calculate Option Price
Calculates the theoretical price and Greeks for a single option using the Black-Scholes model.

**POST** `/options/price`

**Request Body:**
```json
{
  "spot": 100,       // Current stock price (number)
  "strike": 100,     // Option strike price (number)
  "rate": 0.05,      // Risk-free interest rate (decimal, e.g., 0.05 for 5%)
  "volatility": 0.25,// Implied volatility (decimal, e.g., 0.25 for 25%)
  "time": 1.0,       // Time to expiration in years (number)
  "type": "call"     // Option type: "call" or "put"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "price": "12.3360",
    "greeks": {
      "delta": "0.6274",
      "gamma": "0.015137",
      "theta": "-7.2505",
      "vega": "0.3784",
      "rho": "0.5040"
    }
  }
}
```

Values come back as strings. Theta is per year, vega and rho per 1 percentage point.

---

### 2. Generate Heatmap Data
Generates a matrix of option prices for a range of strike prices and expiration times.

**POST** `/options/heatmap`

**Request Body:**
```json
{
  "spot": 100,
  "strikes": [90, 95, 100, 105, 110], // Array of strike prices
  "expirations": [0.5, 1.0, 1.5],     // Array of times to expiration
  "rate": 0.05,
  "volatility": 0.25,
  "type": "call"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "strikes": [90, 95, 100, 105, 110],
    "expirations": [0.5, 1.0, 1.5],
    "prices": [
      [14.44, 11.08, 8.26, 5.99, 4.23],  // expiration 0.5, strikes 90 to 110
      [18.14, 15.05, 12.34, 10, 8.03],   // expiration 1.0
      [21.28, 18.33, 15.69, 13.35, 11.29] // expiration 1.5
    ]
  }
}
```

One row per expiration, one column per strike: `prices[i][j]` is the price for `expirations[i]` and `strikes[j]`.

---

### 3. Get Trading Signals
Rule-based signals, not ML. IV rank is measured against a fixed 10% to 80% range instead of historical IV, so it can go above 100. Moneyness rules fire when spot is more than 5% from the strike.

**POST** `/signals`

**Request Body:**
```json
{
  "spot": 100,
  "strike": 100,
  "rate": 0.05,
  "volatility": 0.85, // High volatility example
  "time": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signals": [
      {
        "type": "SELL_VOLATILITY",
        "strike": 100,
        "expiry": 1,
        "confidence": 0.95,
        "reason": "IV Rank 107% > 80% - Overvalued",
        "ivRank": 107.14285714285714
      }
    ]
  }
}
```

---

### 4. Scan Pairs Opportunities
Z-score of the IV spread for 5 fixed equity pairs. The IVs and correlations are random demo data, so the result changes on every call and the signals mean nothing yet.

**POST** `/pairs/scan`

**Request Body:**
```json
{
  "volatility": 0.25 // Base volatility the random IVs are drawn around
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pairs": [
      {
        "asset1": "XLE",
        "asset2": "USO",
        "correlation": 0.8463591963561772,
        "currentIVSpread": -0.04213773269356569,
        "historicalMeanSpread": 0.02,
        "stdSpread": 0.01,
        "zscore": -6.213773269356569,
        "signal": "LONG_A_SHORT_B"
      }
      // ... 4 more pairs, sorted by absolute z-score
    ]
  }
}
```
