require 'rails_helper'

RSpec.describe "Forecasts", type: :request do
  describe "GET /forecasts" do
    around(:example) do |example|
      VCR.use_cassette('forecast/valid_fetch') do
        example.run
      end
    end

    let(:params) { { lat: 45.52, lng: -122.63 } }

    it "calls the forecast service correctly" do
      allow(ForecastService).to receive(:fetch)
      get forecasts_path(**params)
      expect(ForecastService).to have_received(:fetch).with(**params)
    end

    it "proxies the response of the forecast service" do
      data = { foo: 'bar' }
      allow(ForecastService).to receive(:fetch).and_return(data)
      get forecasts_path(**params)
      expect(response).to have_http_status(200)
      expect(response.body).to eq(data.to_json)
    end
  end
end
