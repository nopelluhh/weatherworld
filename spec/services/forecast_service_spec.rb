require "vcr"

RSpec.describe ForecastService do
  let(:lat) { 45.520 }
  let(:lng) { -122.638 }

  describe ".fetch" do
    subject { described_class.fetch(lat: lat, lng: lng) }

    describe "fetching valid forecast data" do
      it "returns valid current weather" do
        VCR.use_cassette("forecast/valid_fetch") do
          expect(subject).to include(
            "currently" => {
              "apparent_temperature" => 52.71,
              "summary" => "Cloudy",
              "temperature" => 54.23,
              "time" => 1713850320
            }
          )
        end
      end

      it "returns valid daily weather" do
        VCR.use_cassette("forecast/valid_fetch") do
          expect(subject["daily"]).to all(
            include(
              "summary" => be_a(String),
              "precip_probability" => be_a(Float),
              "temperature_high" => be_a(Float),
              "temperature_high" => be_a(Float),
              "time" => be_a(Integer),
              "day" => be_a(String),
              "formatted_date" => be_a(String)
            )
          )
        end
      end
    end
  end
end
