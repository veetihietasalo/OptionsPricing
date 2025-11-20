// Statistical Arbitrage - Pairs Trading on IV Spread
export interface Pair {
  asset1: string;
  asset2: string;
  correlation: number;
  currentIVSpread: number;
  historicalMeanSpread: number;
  stdSpread: number;
  zscore: number;
  signal: 'LONG_A_SHORT_B' | 'LONG_B_SHORT_A' | 'NEUTRAL';
}

export class StatArb {
  /**
   * Calculate Z-score for IV spread
   */
  static calculateZScore(
    currentSpread: number,
    meanSpread: number,
    stdSpread: number
  ): number {
    return (currentSpread - meanSpread) / stdSpread;
  }

  /**
   * Analyze pair for trading signal
   */
  static analyzePair(
    asset1: string,
    asset2: string,
    iv1: number,
    iv2: number,
    historicalCorrelation: number = 0.85,
    historicalMeanSpread: number = 0.02,
    historicalStdSpread: number = 0.01
  ): Pair {
    const currentSpread = iv1 - iv2;
    const zscore = this.calculateZScore(
      currentSpread,
      historicalMeanSpread,
      historicalStdSpread
    );

    let signal: 'LONG_A_SHORT_B' | 'LONG_B_SHORT_A' | 'NEUTRAL' = 'NEUTRAL';

    // Z-score > 2: Spread too high, short A, long B
    if (zscore > 2) {
      signal = 'LONG_B_SHORT_A'; // IV of A is high, B is low
    }
    // Z-score < -2: Spread too low, long A, short B
    else if (zscore < -2) {
      signal = 'LONG_A_SHORT_B';
    }

    return {
      asset1,
      asset2,
      correlation: historicalCorrelation,
      currentIVSpread: currentSpread,
      historicalMeanSpread,
      stdSpread: historicalStdSpread,
      zscore,
      signal,
    };
  }

  /**
   * Get common equity pairs for analysis
   */
  static getCommonPairs(): { name: string; asset1: string; asset2: string }[] {
    return [
      { name: 'Tech Giants', asset1: 'AAPL', asset2: 'MSFT' },
      { name: 'Index ETFs', asset1: 'SPY', asset2: 'QQQ' },
      { name: 'Energy', asset1: 'XLE', asset2: 'USO' },
      { name: 'Finance', asset1: 'JPM', asset2: 'BAC' },
      { name: 'Retail', asset1: 'WMT', asset2: 'TGT' },
    ];
  }

  /**
   * Scan all pairs for opportunities (demo with simulated data)
   */
  static scanOpportunities(baseVolatility: number): Pair[] {
    const pairs = this.getCommonPairs();
    const results: Pair[] = [];

    for (const pair of pairs) {
      // Simulate different IV for each asset (demo)
      const iv1 = baseVolatility * (0.8 + Math.random() * 0.4);
      const iv2 = baseVolatility * (0.8 + Math.random() * 0.4);

      const analysis = this.analyzePair(
        pair.asset1,
        pair.asset2,
        iv1,
        iv2,
        0.75 + Math.random() * 0.2, // correlation 0.75-0.95
        0.02, // historical mean spread
        0.01 // historical std
      );

      results.push(analysis);
    }

    // Sort by absolute Z-score (highest opportunities first)
    return results.sort((a, b) => Math.abs(b.zscore) - Math.abs(a.zscore));
  }
}
