class ForecastsController < ApplicationController
  wrap_parameters :point, include: %i[lat lng]

  def show
    cached = Rails.cache.exist?(cache_key)
    data = Rails.cache.fetch(cache_key, expires_in: 30.minutes) do
      ForecastService.fetch(lat: show_params[0].to_f, lng: show_params[1].to_f).merge(fetched_at: Time.now)
    end
    render json: data.merge(cached: cached)
  rescue ForecastService::ServiceError => e
    render json: { error: 'Unable to retrieve forecast' }
  end

private

  def show_params
    params.require(%i[lat lng zip])
  end

  def cache_key
    "forecast:#{show_params[2]}"
  end
end
