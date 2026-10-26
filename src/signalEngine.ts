// Rule-based recommendation signals (no ML)
export interface Signal {
  type: 'BUY_CALL' | 'BUY_PUT' | 'SELL_VOLATILITY' | 'BUY_VOLATILITY';
  strike: number;
  expiry: number;
  confidence: number;
  reason: string;
  ivRank?: number;
}

export class SignalEngine {
  /**
   * Calculate IV Rank (percentile of current IV in historical range)
   * Returns 0-100, where >80 = high IV, <20 = low IV
   */
  static calculateIVRank(currentIV: number, historicalIV: number[] = []): number {
    // Simplified for the demo: a fixed 10% to 80% IV range instead of historical IV
    const minIV = 0.10;
    const maxIV = 0.80;
    return ((currentIV - minIV) / (maxIV - minIV)) * 100;
  }

  /**
   * Analyze volatility and generate signals
   */
  static analyzeVolatility(
    spot: number,
    strike: number,
    volatility: number,
    time: number
  ): Signal[] {
    const signals: Signal[] = [];
    const ivRank = this.calculateIVRank(volatility);

    // High IV → Sell Volatility (Straddle)
    if (ivRank > 80) {
      signals.push({
        type: 'SELL_VOLATILITY',
        strike: spot, // ATM straddle
        expiry: time,
        confidence: Math.min(95, ivRank) / 100,
        reason: `IV Rank ${ivRank.toFixed(0)}% > 80% - Overvalued`,
        ivRank,
      });
    }

    // Low IV → Buy Volatility (Straddle)
    if (ivRank < 20) {
      signals.push({
        type: 'BUY_VOLATILITY',
        strike: spot,
        expiry: time,
        confidence: (20 - ivRank) / 20,
        reason: `IV Rank ${ivRank.toFixed(0)}% < 20% - Undervalued`,
        ivRank,
      });
    }

    // Delta-Neutral: ATM options for mean reversion
    const moneyness = spot / strike;
    if (moneyness > 1.05) {
      // Stock above strike → Buy Put
      signals.push({
        type: 'BUY_PUT',
        strike: strike,
        expiry: time,
        confidence: Math.min(0.85, (moneyness - 1) * 2),
        reason: `Stock ${((moneyness - 1) * 100).toFixed(1)}% above strike - Mean reversion`,
      });
    } else if (moneyness < 0.95) {
      // Stock below strike → Buy Call
      signals.push({
        type: 'BUY_CALL',
        strike: strike,
        expiry: time,
        confidence: Math.min(0.85, (1 - moneyness) * 2),
        reason: `Stock ${((1 - moneyness) * 100).toFixed(1)}% below strike - Mean reversion`,
      });
    }

    return signals;
  }

  /**
   * Generate trading recommendations
   */
  static getRecommendations(
    spot: number,
    strike: number,
    rate: number,
    volatility: number,
    time: number
  ): Signal[] {
    const signals = this.analyzeVolatility(spot, strike, volatility, time);

    // Sort by confidence
    return signals.sort((a, b) => b.confidence - a.confidence);
  }
}
