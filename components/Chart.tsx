import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Database, Download, X, TrendingUp, Calendar } from 'lucide-react';
import { SeriesData } from '../types/index';
import  "../app/spacer.css"

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
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-blue-200/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-12 flex items-center justify-center border-2 border-dashed border-blue-200/50 h-[450px] hover:border-blue-300/50 transition-all duration-300">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200/50 p-4 rounded-2xl inline-block mb-4">
              <Database className="w-14 h-14 text-blue-400" />
            </div>
            <p className="text-slate-500 font-semibold text-lg">Select a series to display</p>
            <p className="text-slate-400 text-sm mt-2">Choose from the dropdown above</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-blue-100/50 p-8 flex items-center justify-center h-[450px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
          <div className="text-slate-600 font-medium">Loading data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 flex items-center justify-center h-[450px]">
        <div className="text-center">
          <div className="bg-red-50 p-4 rounded-2xl inline-block mb-4">
            <X className="w-12 h-12 text-red-400" />
          </div>
          <div className="text-red-500 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.observations.slice(-50);
  const latestValue = chartData[chartData.length - 1]?.value;
  const previousValue = chartData[chartData.length - 2]?.value;
  const change = latestValue && previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-3xl shadow-xl border border-blue-100/50 p-7 hover:shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="spacer"></div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-xl">
                <TrendingUp className="text-blue-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{data.series.name}</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium ml-11">{data.series.units}</p>
          </div>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="spacer"></div>
        </div>

        {/* Value Display */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl p-5 border border-blue-100/50">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wide">Latest Value</p>
              <p className="text-4xl font-bold text-slate-800">{latestValue?.toFixed(2)}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold ${
              isPositive 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(change).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="mb-5">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${position}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={position === 0 ? '#60a5fa' : '#a78bfa'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={position === 0 ? '#60a5fa' : '#a78bfa'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" strokeWidth={1} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={10}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #dbeafe',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px'
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '4px' }}
                itemStyle={{ color: position === 0 ? '#3b82f6' : '#8b5cf6', fontWeight: '600' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={position === 0 ? '#3b82f6' : '#8b5cf6'} 
                strokeWidth={3}
                dot={false}
                name={data.series.name}
                fill={`url(#gradient-${position})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-blue-100/50">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="spacer"></div>
            <Calendar size={16} className="text-blue-400" />
            <span className="font-medium">
              {data.series.frequency} • Updated {new Date(data.series.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
