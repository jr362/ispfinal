import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Database, Download, X } from 'lucide-react';
import { SeriesData } from '@/types';

interface ChartProps {
  seriesId: string | null;
  onRemove: () => void;
  position: number;
}

export default function Chart({ seriesId, onRemove, position }: ChartProps) {
  const [data, setData] = useState<SeriesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/series/${seriesId}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  if (!seriesId) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 flex items-center justify-center border-2 border-dashed border-slate-300 h-[400px]">
        <div className="text-center">
          <Database className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-500 font-medium">Select a series to display</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center h-[400px]">
        <div className="animate-pulse text-slate-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.observations.slice(-50); // Last 50 observations

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{data.series.name}</h3>
          <p className="text-sm text-slate-500">{data.series.units}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={position === 0 ? '#3b82f6' : '#8b5cf6'} 
            strokeWidth={2}
            dot={false}
            name={data.series.name}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-slate-600">
          Latest: <strong className="text-slate-800">
            {chartData[chartData.length - 1]?.value.toFixed(2)}
          </strong>
        </span>
        <span className="text-slate-500 text-xs">
          {data.series.frequency} | Updated: {new Date(data.series.last_updated).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
