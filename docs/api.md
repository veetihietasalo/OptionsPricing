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
    "price": "10.45",
    "greeks": {
      "delta": "0.637",
      "gamma": "0.018",
      "theta": "-6.452",
      "vega": "37.521",
      "rho": "53.210"
    }
  }
}
```

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
      [15.2, 18.5, 21.2], // Prices for strike 90 at different expirations
      [11.5, 14.8, 17.5], // Prices for strike 95
      // ...
    ]
  }
}
```

---

### 3. Get Trading Signals
Analyzes market parameters to generate ML-based trading recommendations.

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
        "expiry": 1.0,
        "confidence": 0.95,
        "reason": "IV Rank 85% > 80% - Overvalued",
        "ivRank": 85
      }
    ]
  }
}
```

---

### 4. Scan Pairs Opportunities
Scans predefined asset pairs for statistical arbitrage opportunities based on implied volatility spreads.

**POST** `/pairs/scan`

**Request Body:**
```json
{
  "volatility": 0.25 // Base market volatility for simulation
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pairs": [
      {
        "asset1": "AAPL",
        "asset2": "MSFT",
        "correlation": 0.85,
        "currentIVSpread": 0.05,
        "zscore": 3.0,
        "signal": "LONG_B_SHORT_A"
      }
    ]
  }
}
```
