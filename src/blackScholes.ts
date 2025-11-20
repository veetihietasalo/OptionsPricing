// Normal CDF (Cumulative Distribution Function)
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - probability : probability;
}

// Normal PDF (Probability Density Function)
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface OptionParams {
  S: number;    // Stock price
  K: number;    // Strike price
  r: number;    // Risk-free rate
  sigma: number; // Volatility
  T: number;    // Time to expiration (years)
  type: 'call' | 'put';
}

export interface OptionResult {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export class BlackScholes {
  /**
   * Calculate d1 and d2 for Black-Scholes formula
   */
  private static calculateD(params: OptionParams): { d1: number; d2: number } {
    const { S, K, r, sigma, T } = params;
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return { d1, d2 };
  }

  /**
   * Calculate option price using Black-Scholes formula
   */
  static price(params: OptionParams): number {
    const { S, K, r, T, type } = params;
    const { d1, d2 } = this.calculateD(params);

    if (type === 'call') {
      return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    } else {
      return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    }
  }

  /**
   * Calculate Delta (∂V/∂S)
   */
  static delta(params: OptionParams): number {
    const { type } = params;
    const { d1 } = this.calculateD(params);

    if (type === 'call') {
      return normalCDF(d1);
    } else {
      return normalCDF(d1) - 1;
    }
  }

  /**
   * Calculate Gamma (∂²V/∂S²)
   */
  static gamma(params: OptionParams): number {
    const { S, sigma, T } = params;
    const { d1 } = this.calculateD(params);
    return normalPDF(d1) / (S * sigma * Math.sqrt(T));
  }

  /**
   * Calculate Theta (∂V/∂t) - per year, divide by 365 for daily
   */
  static theta(params: OptionParams): number {
    const { S, K, r, sigma, T, type } = params;
    const { d1, d2 } = this.calculateD(params);

    const term1 = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T));

    if (type === 'call') {
      const term2 = -r * K * Math.exp(-r * T) * normalCDF(d2);
      return term1 + term2;
    } else {
      const term2 = r * K * Math.exp(-r * T) * normalCDF(-d2);
      return term1 + term2;
    }
  }

  /**
   * Calculate Vega (∂V/∂σ) - per 1% change in volatility
   */
  static vega(params: OptionParams): number {
    const { S, T } = params;
    const { d1 } = this.calculateD(params);
    return S * normalPDF(d1) * Math.sqrt(T) / 100; // Divide by 100 for 1% change
  }

  /**
   * Calculate Rho (∂V/∂r) - per 1% change in interest rate
   */
  static rho(params: OptionParams): number {
    const { K, r, T, type } = params;
    const { d2 } = this.calculateD(params);

    if (type === 'call') {
      return K * T * Math.exp(-r * T) * normalCDF(d2) / 100;
    } else {
      return -K * T * Math.exp(-r * T) * normalCDF(-d2) / 100;
    }
  }

  /**
   * Calculate all Greeks at once
   */
  static calculate(params: OptionParams): OptionResult {
    return {
      price: this.price(params),
      delta: this.delta(params),
      gamma: this.gamma(params),
      theta: this.theta(params),
      vega: this.vega(params),
      rho: this.rho(params),
    };
  }
}
