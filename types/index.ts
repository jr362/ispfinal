export interface FREDSeries {
  id: string;
  name: string;
  title: string;
  units: string;
  frequency: string;
  seasonal_adjustment: string;
  last_updated: Date;
}

export interface FREDObservation {
  date: string;
  value: number;
}

export interface SeriesData {
  series: FREDSeries;
  observations: FREDObservation[];
}
