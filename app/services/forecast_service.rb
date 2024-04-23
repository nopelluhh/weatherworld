class ForecastService
  class ServiceError < StandardError; end

  BASE_URL = "https://api.pirateweather.net/forecast"

  def self.fetch(...)
    new(...).fetch
  end

  def initialize(lat:, lng:)
    @lat = lat
    @lng = lng
    @api_key = Rails.application.credentials[:weather][:api_key]
  end

  def fetch
    response = Faraday.get(uri)
    raise ServiceError, "Bad Response" unless response.status == 200
    parsed = JSON.parse(response.body)
    raise ServiceError, "Bad Request" unless parsed["currently"]
    transform_response(parsed)
  end

  def uri
    URI("#{BASE_URL}/#{@api_key}/#{@lat},#{@lng}?exclude=minutely,hourly,alerts")
  end

  def transform_response(data)
    data
      .deep_transform_keys!(&:underscore)
      .slice("currently", "daily", "timezone").tap do |raw|
        raw["currently"] = transform_current(raw["currently"])
        raw["daily"] = raw["daily"]["data"].map { |day| transform_daily(day, raw["timezone"]) }
      end
  end

  def transform_current(data)
    data.slice(*%w[time summary temperature apparent_temperature])
  end

  def transform_daily(data, timezone)
    data.slice(*%w[time temperature_high temperature_low precip_probability summary]).merge(time_attributes(data["time"], timezone))
  end

  def time_attributes(epoch_seconds, timezone)
    time = Time.at(epoch_seconds).in_time_zone(timezone)
    {
      "formatted_date" => time.strftime("%Y-%m-%d"),
      "day" => time.strftime("%A"),
    }
  end
end
