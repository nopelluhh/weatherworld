import React, { useEffect, useState } from "react";
import { AutocompleteResult } from "./address_autocomplete";
import { ForecastResult, ForecastService } from "../services/forecast_service";
import { Stack } from "./stack";

const service = new ForecastService(window.location.href);

function formatDaily(data: ForecastResult["daily"][number]) {
  const low = Math.round(data.temperature_low);
  const high = Math.round(data.temperature_high);
  let base = `${data.summary} with a low of ${low}F and a high of ${high}F.`;

  if (data.precip_probability > 0)
    base += ` ${Math.round(data.precip_probability * 100)}% chance of rain`;
  return base;
}

function formatCurrent(data: ForecastResult["currently"]) {
  const temp = Math.round(data.temperature);
  const apparent = Math.round(data.apparent_temperature);
  return `${temp}F and ${data.summary.toLocaleLowerCase()} (feels like ${apparent}F)`;
}

export const Forecast = ({ selection }: { selection: AutocompleteResult }) => {
  const [forecast, setForecast] = useState<ForecastResult>();
  const [error, setError] = useState<string>();

  const key = selection ? `${selection.lat},${selection.lng}` : undefined;

  useEffect(() => {
    if (!key) return;
    setError(undefined);
    async function getForecast() {
      if (!selection.zip) {
        setError("Please search for a zip code or complete address");
        return;
      }

      try {
        return await service.getForecast(
          selection.zip,
          selection.lat,
          selection.lng
        );
      } catch {
        setError("Could not fetch forecast");
      }
    }
    getForecast().then((result) => setForecast(result));
  }, [selection]);

  if (error) return error;
  if (!forecast) return "Loading...";

  return (
    <div>
      <h2>Your weather for {selection.zip ?? selection.name}</h2>
      <div className="well">
        <h3>
          It’s currently {formatCurrent(forecast.currently)}
          {forecast.cached && "*"}
        </h3>
      </div>
      <h3>7 Day Forecast:</h3>
      <Stack>
        {forecast.daily.map((d, i) => (
          <div key={d.time}>
            <b>{i === 0 ? "Today" : d.day}: </b>
            {formatDaily(d)}
          </div>
        ))}
      </Stack>
      {forecast.cached && (
        <sub>
          *This information was retrieved at{" "}
          {forecast.fetched_at.toLocaleTimeString()}
        </sub>
      )}
    </div>
  );
};
