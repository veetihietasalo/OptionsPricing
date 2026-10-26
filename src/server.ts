import cors from 'cors';
import express, { Request, Response } from 'express';
import { BlackScholes, type OptionParams } from './blackScholes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Calculate single option price + Greeks
app.post('/api/options/price', (req: Request, res: Response) => {
  try {
    const { spot, strike, rate, volatility, time, type } = req.body;

    // Validation
    if (!spot || !strike || rate === undefined || !volatility || !time || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (type !== 'call' && type !== 'put') {
      return res.status(400).json({ error: 'Type must be "call" or "put"' });
    }

    const params: OptionParams = {
      S: parseFloat(spot),
      K: parseFloat(strike),
      r: parseFloat(rate),
      sigma: parseFloat(volatility),
      T: parseFloat(time),
      type,
    };

    const result = BlackScholes.calculate(params);

    res.json({
      success: true,
      data: {
        price: result.price.toFixed(4),
        greeks: {
          delta: result.delta.toFixed(4),
          gamma: result.gamma.toFixed(6),
          theta: result.theta.toFixed(4),
          vega: result.vega.toFixed(4),
          rho: result.rho.toFixed(4),
        },
      },
    });
  } catch (error) {
    console.error('Error calculating option price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate heatmap data
app.post('/api/options/heatmap', (req: Request, res: Response) => {
  try {
    const { spot, strikes, expirations, rate, volatility, type } = req.body;

    if (!spot || !strikes || !expirations || rate === undefined || !volatility || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const heatmapData: number[][] = [];

    for (const expiration of expirations) {
      const row: number[] = [];
      for (const strike of strikes) {
        const params: OptionParams = {
          S: parseFloat(spot),
          K: parseFloat(strike),
          r: parseFloat(rate),
          sigma: parseFloat(volatility),
          T: parseFloat(expiration),
          type,
        };
        const price = BlackScholes.price(params);
        row.push(parseFloat(price.toFixed(2)));
      }
      heatmapData.push(row);
    }

    res.json({
      success: true,
      data: {
        strikes,
        expirations,
        prices: heatmapData,
      },
    });
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rule-based recommendation signals (no ML)
app.post('/api/signals', (req: Request, res: Response) => {
  try {
    const { spot, strike, rate, volatility, time } = req.body;

    if (!spot || !strike || rate === undefined || !volatility || !time) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Import signal engine
    const { SignalEngine } = require('./signalEngine');
    const signals = SignalEngine.getRecommendations(
      parseFloat(spot),
      parseFloat(strike),
      parseFloat(rate),
      parseFloat(volatility),
      parseFloat(time)
    );

    res.json({
      success: true,
      data: { signals },
    });
  } catch (error) {
    console.error('Error generating signals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scan for statistical arbitrage opportunities
app.post('/api/pairs/scan', (req: Request, res: Response) => {
  try {
    const { volatility } = req.body;

    if (!volatility) {
      return res.status(400).json({ error: 'Volatility required' });
    }

    const { StatArb } = require('./statArb');
    const pairs = StatArb.scanOpportunities(parseFloat(volatility));

    res.json({
      success: true,
      data: { pairs },
    });
  } catch (error) {
    console.error('Error scanning pairs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Options Pricing API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
