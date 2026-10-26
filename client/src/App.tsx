import { useEffect, useState } from 'react';
import { Heatmap } from './Heatmap';
import { Pairs } from './Pairs';
import { Signals } from './Signals';
import './index.css';

interface OptionData {
  price: string;
  greeks: {
    delta: string;
    gamma: string;
    theta: string;
    vega: string;
    rho: string;
  };
}

function App() {
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(100);
  const [rate, setRate] = useState(0.05);
  const [volatility, setVolatility] = useState(0.25);
  const [time, setTime] = useState(1);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [result, setResult] = useState<OptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'signals' | 'pairs'>('heatmap');

  const calculateOption = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/options/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spot,
          strike,
          rate,
          volatility,
          time,
          type: optionType,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('Error calculating option:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateOption();
  }, [spot, strike, rate, volatility, time, optionType]);

  return (
    <div className="min-h-screen bg-bbg-dark">
      {/* Bloomberg Terminal Header */}
      <header className="bbg-header px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold">OPTIONS</span>
          <span className="text-sm opacity-90">PRICING ENGINE v1.0</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>USER: DEMO</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Main Terminal Area */}
      <div className="p-6 space-y-6">
        {/* Command Line Style Input */}
        <div className="bbg-panel">
          <div className="flex items-center gap-2">
            <span className="text-bbg-orange font-mono">&gt;</span>
            <span className="font-mono text-sm uppercase">
              {optionType} OPTION | SPOT: ${spot} | STRIKE: ${strike} | VOL: {(volatility * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Parameters */}
          <div className="bbg-card p-6 space-y-5">
            <h2 className="bbg-header px-3 py-2 -m-6 mb-4">PARAMETERS</h2>

            {/* Option Type */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">TYPE</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOptionType('call')}
                  className={`py-2 font-mono text-sm transition-colors ${optionType === 'call'
                    ? 'bg-bbg-orange text-black'
                    : 'bg-bbg-panel border border-bbg-orange/30 text-bbg-text hover:bg-bbg-orange/10'
                    }`}
                >
                  CALL
                </button>
                <button
                  onClick={() => setOptionType('put')}
                  className={`py-2 font-mono text-sm transition-colors ${optionType === 'put'
                    ? 'bg-bbg-orange text-black'
                    : 'bg-bbg-panel border border-bbg-orange/30 text-bbg-text hover:bg-bbg-orange/10'
                    }`}
                >
                  PUT
                </button>
              </div>
            </div>

            {/* Spot Price */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">
                SPOT PRICE: ${spot.toFixed(2)}
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="1"
                value={spot}
                onChange={(e) => setSpot(Number(e.target.value))}
                className="w-full h-1 bg-bbg-panel appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-bbg-orange"
              />
            </div>

            {/* Strike Price */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">
                STRIKE PRICE: ${strike.toFixed(2)}
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="1"
                value={strike}
                onChange={(e) => setStrike(Number(e.target.value))}
                className="w-full h-1 bg-bbg-panel appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-bbg-orange"
              />
            </div>

            {/* Volatility */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">
                IMPLIED VOL: {(volatility * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-full h-1 bg-bbg-panel appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-bbg-orange"
              />
            </div>

            {/* Time to Expiration */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">
                TIME TO EXPIRY: {time.toFixed(2)}Y
              </label>
              <input
                type="range"
                min="0.01"
                max="3"
                step="0.01"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full h-1 bg-bbg-panel appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-bbg-orange"
              />
            </div>

            {/* Risk-free Rate */}
            <div>
              <label className="block text-bbg-orange text-xs font-mono mb-2">
                RISK-FREE RATE: {(rate * 100).toFixed(2)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1 bg-bbg-panel appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-bbg-orange"
              />
            </div>
          </div>

          {/* Middle Column: Price & Greeks */}
          <div className="bbg-card p-6">
            <h2 className="bbg-header px-3 py-2 -m-6 mb-4">ANALYTICS</h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bbg-orange"></div>
              </div>
            ) : result ? (
              <div className="space-y-4 mt-6">
                {/* Option Price - Large Display */}
                <div className="bg-bbg-panel border-l-4 border-bbg-orange p-6">
                  <p className="text-bbg-orange text-xs font-mono mb-1">OPTION PRICE</p>
                  <p className="text-5xl font-mono font-bold text-bbg-text">${result.price}</p>
                </div>

                {/* Greeks - Bloomberg Terminal Style */}
                <div className="space-y-2">
                  <h3 className="text-bbg-orange text-xs font-mono mb-3 border-b border-bbg-orange/30 pb-2">
                    GREEKS
                  </h3>

                  {[
                    { label: 'DELTA (Δ)', value: result.greeks.delta, desc: 'Price Sensitivity' },
                    { label: 'GAMMA (Γ)', value: result.greeks.gamma, desc: 'Delta Change Rate' },
                    { label: 'THETA (Θ)', value: result.greeks.theta, desc: 'Time Decay' },
                    { label: 'VEGA (ν)', value: result.greeks.vega, desc: 'Vol Sensitivity' },
                    { label: 'RHO (ρ)', value: result.greeks.rho, desc: 'Rate Sensitivity' },
                  ].map((greek) => (
                    <div key={greek.label} className="bbg-panel p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-bbg-orange text-xs font-mono">{greek.label}</span>
                          <p className="text-gray-400 text-xs font-mono mt-0.5">{greek.desc}</p>
                        </div>
                        <span className="text-bbg-text font-mono font-bold text-lg">
                          {greek.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Tabbed Interface */}
          <div className="bbg-card p-6">
            {/* Tab Headers */}
            <div className="flex gap-2 -m-6 mb-4">
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`flex-1 py-2 px-4 font-mono text-sm transition-colors ${activeTab === 'heatmap'
                    ? 'bbg-header'
                    : 'bg-bbg-panel text-gray-400 hover:text-bbg-text'
                  }`}
              >
                SURFACE
              </button>
              <button
                onClick={() => setActiveTab('signals')}
                className={`flex-1 py-2 px-4 font-mono text-sm transition-colors ${activeTab === 'signals'
                    ? 'bbg-header'
                    : 'bg-bbg-panel text-gray-400 hover:text-bbg-text'
                  }`}
              >
                SIGNALS
              </button>
              <button
                onClick={() => setActiveTab('pairs')}
                className={`flex-1 py-2 px-4 font-mono text-sm transition-colors ${activeTab === 'pairs'
                    ? 'bbg-header'
                    : 'bg-bbg-panel text-gray-400 hover:text-bbg-text'
                  }`}
              >
                PAIRS
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'heatmap' && (
                <Heatmap spot={spot} rate={rate} volatility={volatility} type={optionType} />
              )}
              {activeTab === 'signals' && (
                <Signals spot={spot} strike={strike} rate={rate} volatility={volatility} time={time} />
              )}
              {activeTab === 'pairs' && (
                <Pairs volatility={volatility} />
              )}
            </div>
          </div>
        </div>

        {/* Bloomberg Footer */}
        <footer className="bbg-panel p-3 flex items-center justify-between text-xs font-mono">
          <span className="text-bbg-orange">OPTPRICING &lt;GO&gt;</span>
          <span className="text-gray-500">BLACK-SCHOLES MODEL | REAL-TIME GREEKS</span>
          <span className="text-bbg-blue">HELP: F1</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
