// api.js - External Public API Integration using async/await and fetch()
document.addEventListener("DOMContentLoaded", function () {

    // 1. NHTSA Official Vehicle API (Partner Brand Reference on models.html)
    const brandSelect = document.getElementById("api-brand-select");
    const fetchBtn = document.getElementById("fetch-api-btn");
    const loadingEl = document.getElementById("api-loading");
    const errorEl = document.getElementById("api-error");
    const resultsGrid = document.getElementById("api-results-grid");

    async function fetchManufacturerModels(make) {
        if (!resultsGrid || !loadingEl || !errorEl) return;

        loadingEl.style.display = "block";
        errorEl.style.display = "none";
        resultsGrid.innerHTML = "";

        const endpoint = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/" + encodeURIComponent(make) + "?format=json";

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("HTTP Status " + response.status);
            }

            const data = await response.json();
            const models = (data && data.Results) ? data.Results.slice(0, 8) : [];

            loadingEl.style.display = "none";

            if (models.length === 0) {
                errorEl.textContent = "No models found for " + make + ".";
                errorEl.style.display = "block";
                return;
            }

            models.forEach(function (item) {
                const col = document.createElement("div");
                col.className = "col-6 col-md-3";
                col.innerHTML =
                    '<div class="p-3 border rounded bg-light api-model-card h-100 d-flex flex-column justify-content-between">' +
                        '<div>' +
                            '<span class="badge bg-dark mb-1">' + item.Make_Name + '</span>' +
                            '<h3 class="h6 fw-bold mb-1">' + item.Model_Name + '</h3>' +
                            '<small class="text-secondary d-block">Registry ID: #' + item.Model_ID + '</small>' +
                        '</div>' +
                        '<span class="badge bg-success-subtle text-success border border-success-subtle mt-2">Trade-In Eligible</span>' +
                    '</div>';
                resultsGrid.appendChild(col);
            });
        } catch (err) {
            loadingEl.style.display = "none";
            errorEl.textContent = "Unable to reach NHTSA Vehicle API. Please check your internet connection and try again.";
            errorEl.style.display = "block";
        }
    }

    if (fetchBtn && brandSelect) {
        fetchBtn.addEventListener("click", function () {
            fetchManufacturerModels(brandSelect.value);
        });
        fetchManufacturerModels(brandSelect.value);
    }

    // 2. Open-Meteo Live Astana Weather API (on services.html)
    const weatherLoading = document.getElementById("weather-loading");
    const weatherError = document.getElementById("weather-error");
    const weatherContent = document.getElementById("weather-content");

    async function fetchAstanaWeather() {
        if (!weatherContent || !weatherLoading) return;

        const url = "https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current_weather=true";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Weather HTTP error");
            }
            const data = await response.json();
            const current = data.current_weather;

            weatherLoading.style.display = "none";
            weatherContent.style.display = "block";

            const temp = Math.round(current.temperature);
            const wind = Math.round(current.windspeed);

            document.getElementById("weather-temp").textContent = (temp > 0 ? "+" : "") + temp + "°C";
            document.getElementById("weather-wind").textContent = "Wind: " + wind + " km/h";

            let conditionText = "Clear Roads";
            let adviceText = "Great visibility in Astana today! Ideal conditions to test-drive our Raptor GT or Apex RS sports models.";

            if (temp <= 0) {
                conditionText = "Cold / Winter Conditions";
                adviceText = "Below-freezing roads in Astana (" + temp + "°C). We recommend booking a test drive in the Trailblazer X or Summit AWD with heated seats.";
            } else if (wind > 28) {
                conditionText = "Breezy Steppe Winds";
                adviceText = "Windy conditions in Astana today. Experience the heavy road stability of our Volt Pro or Echelon LX.";
            }

            document.getElementById("weather-status").textContent = conditionText;
            document.getElementById("weather-advice").textContent = adviceText;
        } catch (err) {
            weatherLoading.style.display = "none";
            if (weatherError) {
                weatherError.textContent = "Live weather feed temporarily unavailable. Showroom test drives are open 9:00 AM – 7:00 PM.";
                weatherError.style.display = "block";
            }
        }
    }

    if (weatherContent) {
        fetchAstanaWeather();
    }
});