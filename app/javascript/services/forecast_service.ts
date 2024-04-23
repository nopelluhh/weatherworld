type CurrentForecast = {
  apparent_temperature: number;
  summary: string;
  temperature: number;
  time: number;
};

type FutureForecast = {
  summary: string;
  precip_probability: number;
  temperature_low: number;
  temperature_high: number;
  time: number;
  day: string;
  formatted_date: string;
};

export type ForecastResult = {
  currently: CurrentForecast;
  daily: FutureForecast[];
  cached: boolean;
  fetched_at: Date;
};

export class ForecastService {
  constructor(private baseUrl: string) {}

  async getForecast(
    zip: string,
    lat: number,
    lng: number
  ): Promise<ForecastResult> {
    const result = await fetch(
      `${this.baseUrl}forecasts?zip=${zip}&lat=${lat.toFixed(
        3
      )}&lng=${lng.toFixed(3)}`
    );
    if (result.ok) {
      const data = await result.json();
      if (data.error) throw new Error("Could not fetch forecast");
      return { ...data, fetched_at: new Date(data.fetched_at) };
    } else {
      throw new Error("Could not fetch forecast");
    }
  }
}
