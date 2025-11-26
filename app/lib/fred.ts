import axios from 'axios';
import { FREDSeries, FREDObservation, SeriesData } from '../../types/index';
import { getDatabase } from './mongodb';

const FRED_API_BASE = 'https://api.stlouisfed.org/fred';
const API_KEY = process.env.FRED_API_KEY;

export async function fetchSeriesInfo(seriesId: string): Promise<FREDSeries> {
  try {
    const response = await axios.get(`${FRED_API_BASE}/series`, {
      params: {
        series_id: seriesId,
        api_key: API_KEY,
        file_type: 'json'
      }
    });

    const series = response.data.seriess[0];
    return {
      id: series.id,
      name: series.title,
      title: series.title,
      units: series.units,
      frequency: series.frequency,
      seasonal_adjustment: series.seasonal_adjustment,
      last_updated: new Date(series.last_updated)
    };
  } catch (error) {
    console.error('Error fetching series info:', error);
    throw error;
  }
}

export async function fetchSeriesObservations(
  seriesId: string,
  startDate?: string,
  endDate?: string
): Promise<FREDObservation[]> {
  try {
    const response = await axios.get(`${FRED_API_BASE}/series/observations`, {
      params: {
        series_id: seriesId,
        api_key: API_KEY,
        file_type: 'json',
        observation_start: startDate,
        observation_end: endDate
      }
    });

    return response.data.observations
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value)
      }));
  } catch (error) {
    console.error('Error fetching observations:', error);
    throw error;
  }
}

export async function getCachedOrFetchSeries(
  seriesId: string
): Promise<SeriesData> {
  const db = await getDatabase();
  const collection = db.collection('series_cache');

  // Check cache
  const cached = await collection.findOne({ seriesId });
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    return {
      series: cached.series,
      observations: cached.observations
    };
  }

  // Fetch from FRED
  const series = await fetchSeriesInfo(seriesId);
  const observations = await fetchSeriesObservations(seriesId);

  // Update cache
  await collection.updateOne(
    { seriesId },
    {
      $set: {
        seriesId,
        series,
        observations,
        timestamp: Date.now()
      }
    },
    { upsert: true }
  );

  return { series, observations };
}
