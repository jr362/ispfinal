'use client';

import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import Chart from './Chart';

const popularSeries = [
  { id: 'GDP', name: 'Gross Domestic Product' },
  { id: 'UNRATE', name: 'Unemployment Rate' },
  { id: 'CPIAUCSL', name: 'Consumer Price Index' },
  { id: 'DFF', name: 'Federal Funds Rate' },
  { id: 'DEXUSEU', name: 'USD/EUR Exchange Rate' },
  { id: 'T10Y2Y', name: '10-Year Treasury - 2-Year Treasury Spread' },
  { id: 'FPCPITOTLZGUSA', name: 'Inflation, consumer prices for the United States'},
  { id: 'IRLTLT01USM156N', name: 'Interest Rates: Long-Term Government Bond Yields: 10-Year: Main (Including Benchmark) for United States'}
];

export default function Dashboard() {
  const [selectedSeries, setSelectedSeries] = useState<(string | null)[]>([null, null]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSeriesSelect = (seriesId: string, position: number) => {
    const newSelected = [...selectedSeries];
    newSelected[position] = seriesId;
    setSelectedSeries(newSelected);
  };

  const handleRemoveSeries = (position: number) => {
    const newSelected = [...selectedSeries];
    newSelected[position] = null;
    setSelectedSeries(newSelected);
  };

  const filteredSeries = popularSeries.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FRED Economic Dashboard</h1>
                <p className="text-slate-300 text-sm">Federal Reserve Economic Data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
                <span className="text-xs font-medium">● MongoDB Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search economic indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Series Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[0, 1].map((position) => (
            <div key={position} className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Chart {position + 1}</h3>
              <select
                value={selectedSeries[position] || ''}
                onChange={(e) => handleSeriesSelect(e.target.value, position)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a series...</option>
                {filteredSeries.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name} ({series.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedSeries.map((seriesId, index) => (
            <Chart
              key={index}
              seriesId={seriesId}
              onRemove={() => handleRemoveSeries(index)}
              position={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
