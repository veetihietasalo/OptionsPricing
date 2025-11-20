import { useEffect, useState } from 'react';

interface Pair {
  asset1: string;
  asset2: string;
  correlation: number;
  currentIVSpread: number;
  historicalMeanSpread: number;
  stdSpread: number;
  zscore: number;
  signal: string;
}

interface PairsProps {
  volatility: number;
}

export function Pairs({ volatility }: PairsProps) {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPairs();
  }, [volatility]);

  const fetchPairs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/pairs/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volatility }),
      });

      const data = await response.json();
      if (data.success) {
        setPairs(data.data.pairs);
      }
    } catch (error) {
      console.error('Error fetching pairs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bbg-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 text-xs font-mono text-bbg-orange border-b border-bbg-orange/30 pb-2">
        <span>PAIR</span>
        <span className="text-right">CORR</span>
        <span className="text-right">SPREAD</span>
        <span className="text-right">Z-SCORE</span>
        <span className="text-center">SIGNAL</span>
        <span></span>
      </div>

      {pairs.slice(0, 5).map((pair, idx) => (
        <div key={idx} className="bbg-panel p-2 hover:bg-bbg-panel/80 transition-colors cursor-pointer">
          <div className="grid grid-cols-6 gap-2 items-center text-xs font-mono">
            <div className="font-bold text-bbg-text">
              {pair.asset1} / {pair.asset2}
            </div>
            <div className="text-right text-gray-400">
              {(pair.correlation * 100).toFixed(0)}%
            </div>
            <div className="text-right text-gray-400">
              {(pair.currentIVSpread * 100).toFixed(1)}%
            </div>
            <div className={`text-right font-bold ${Math.abs(pair.zscore) > 2 ? 'text-bbg-orange' : 'text-gray-400'
              }`}>
              {pair.zscore.toFixed(2)}σ
            </div>
            <div className="text-center">
              {pair.signal !== 'NEUTRAL' ? (
                <span className="bg-bbg-orange text-black px-2 py-0.5 rounded text-xs font-bold">
                  {pair.signal === 'LONG_A_SHORT_B' ? '↑A ↓B' : '↓A ↑B'}
                </span>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
            <div className="text-right">
              {Math.abs(pair.zscore) > 2 && (
                <span className="text-bbg-green">●</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
