import { useEffect, useState } from 'react';

interface HeatmapProps {
  spot: number;
  rate: number;
  volatility: number;
  type: 'call' | 'put';
}

interface HeatmapData {
  strikes: number[];
  expirations: number[];
  prices: number[][];
}

export function Heatmap({ spot, rate, volatility, type }: HeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeatmap();
  }, [spot, rate, volatility, type]);

  const fetchHeatmap = async () => {
    setLoading(true);
    try {
      const strikes = Array.from({ length: 8 }, (_, i) =>
        Math.round(spot * (0.85 + (i * 0.04)))
      );

      const expirations = Array.from({ length: 8 }, (_, i) =>
        parseFloat((0.1 + i * 0.25).toFixed(2))
      );

      const response = await fetch('http://localhost:3001/api/options/heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spot, strikes, expirations, rate, volatility, type }),
      });

      const data = await response.json();
      if (data.success) {
        setHeatmapData(data.data);
      }
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBloombergColor = (value: number, min: number, max: number) => {
    const ratio = (value - min) / (max - min);
    // Bloomberg orange gradient
    const r = Math.round(255);
    const g = Math.round(102 + ratio * 80);
    const b = Math.round(0);
    return `rgb(${r}, ${g}, ${b})`;
  };

  if (loading || !heatmapData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bbg-orange"></div>
      </div>
    );
  }

  const allPrices = heatmapData.prices.flat();
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-mono text-gray-400">
        <span>STRIKE × TIME</span>
        <span>${minPrice.toFixed(1)} - ${maxPrice.toFixed(1)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-bbg-orange/30">
              <th className="text-left text-bbg-orange p-1">K</th>
              {heatmapData.expirations.map((exp) => (
                <th key={exp} className="text-center text-bbg-orange p-1">
                  {exp}Y
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.strikes.map((strike, i) => (
              <tr key={strike} className="border-b border-bbg-panel">
                <td className="text-bbg-orange p-1 font-semibold">
                  {strike}
                </td>
                {/* The API returns one row per expiration, so this strike's price at expiration j is prices[j][i] */}
                {heatmapData.expirations.map((_, j) => heatmapData.prices[j][i]).map((price, j) => (
                  <td
                    key={j}
                    className="p-1 text-center font-semibold cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: getBloombergColor(price, minPrice, maxPrice),
                      color: '#000',
                    }}
                    title={`K: $${strike}, T: ${heatmapData.expirations[j]}y\nPrice: $${price.toFixed(2)}`}
                  >
                    {price.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs font-mono text-gray-500 text-center pt-2">
        BLACK-SCHOLES SURFACE
      </div>
    </div>
  );
}
