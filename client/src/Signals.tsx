import { useEffect, useState } from 'react';

interface Signal {
  type: string;
  strike: number;
  expiry: number;
  confidence: number;
  reason: string;
  ivRank?: number;
}

interface SignalsProps {
  spot: number;
  strike: number;
  rate: number;
  volatility: number;
  time: number;
}

export function Signals({ spot, strike, rate, volatility, time }: SignalsProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSignals();
  }, [spot, strike, rate, volatility, time]);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spot, strike, rate, volatility, time }),
      });

      const data = await response.json();
      if (data.success) {
        setSignals(data.data.signals);
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY_CALL': return '📈';
      case 'BUY_PUT': return '📉';
      case 'SELL_VOLATILITY': return '⚡';
      case 'BUY_VOLATILITY': return '💎';
      default: return '💡';
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY_CALL': return 'bbg-green';
      case 'BUY_PUT': return 'bbg-red';
      case 'SELL_VOLATILITY': return 'bbg-orange';
      case 'BUY_VOLATILITY': return 'bbg-blue';
      default: return 'bbg-text';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bbg-orange"></div>
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="bbg-panel p-4 text-center">
        <p className="text-gray-500 font-mono text-xs">NO SIGNALS DETECTED</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {signals.map((signal, idx) => (
        <div key={idx} className="bbg-panel p-3 hover:bg-bbg-panel/80 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getSignalIcon(signal.type)}</span>
              <div>
                <p className={`font-mono text-sm font-bold text-${getSignalColor(signal.type)}`}>
                  {signal.type.replace(/_/g, ' ')}
                </p>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  {signal.reason}
                </p>
                <div className="flex gap-3 mt-2 text-xs font-mono text-gray-500">
                  <span>K: ${signal.strike}</span>
                  <span>T: {signal.expiry.toFixed(2)}y</span>
                  {signal.ivRank && <span>IV Rank: {signal.ivRank.toFixed(0)}%</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-bbg-orange text-black px-2 py-1 rounded text-xs font-mono font-bold">
                {(signal.confidence * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">CONF</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
