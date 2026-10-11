const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    cityName.textContent = "Please enter a city";
    temperature.textContent = "";
    condition.textContent = "";
    return;
  }

  try {
    cityName.textContent = "Loading...";
    temperature.textContent = "";
    condition.textContent = "";

    // Find city
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    const locationData = await locationResponse.json();

    if (!locationData.results) {
      throw new Error("City not found");
    }

    const location = locationData.results[0];

    // Get weather
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
    );

    const weatherData = await weatherResponse.json();

    const weatherCode = weatherData.current.weather_code;

    // Weather condition and icon
    let weatherText = "";
    let weatherIcon = "";

    if (weatherCode === 0) {
      weatherText = "Clear Sky";
      weatherIcon = "☀️";
    }
    else if (weatherCode === 1 || weatherCode === 2) {
      weatherText = "Partly Cloudy";
      weatherIcon = "🌤️";
    }
    else if (weatherCode === 3) {
      weatherText = "Cloudy";
      weatherIcon = "☁️";
    }
    else if (weatherCode === 45 || weatherCode === 48) {
      weatherText = "Foggy";
      weatherIcon = "🌫️";
    }
    else if (weatherCode >= 51 && weatherCode <= 57) {
      weatherText = "Drizzle";
      weatherIcon = "🌦️";
    }
    else if (weatherCode >= 61 && weatherCode <= 67) {
      weatherText = "Rainy";
      weatherIcon = "🌧️";
    }
    else if (weatherCode >= 71 && weatherCode <= 77) {
      weatherText = "Snowy";
      weatherIcon = "❄️";
    }
    else if (weatherCode >= 80 && weatherCode <= 82) {
      weatherText = "Rain Showers";
      weatherIcon = "🌦️";
    }
    else if (weatherCode >= 95) {
      weatherText = "Thunderstorm";
      weatherIcon = "⛈️";
    }
    else {
      weatherText = "Unknown";
      weatherIcon = "🌡️";
    }

    // Display data
    cityName.textContent = `${location.name}, ${location.country}`;

    temperature.textContent =
      `Temperature: ${weatherData.current.temperature_2m} °C`;

    condition.textContent =
      `${weatherIcon} ${weatherText}`;

  } catch (error) {
    cityName.textContent = "Error";
    temperature.textContent = "";
    condition.textContent = error.message;
  }
}