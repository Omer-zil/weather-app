const form = document.querySelector(".search");
const cityInput = document.getElementById("cityInput");

const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");

const weatherEl = document.querySelector(".weather");
const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temp");
const descEl = document.querySelector(".description");

const API_KEY ="0e82fafa451da87e4e2c7c38ecd9edce";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  getWeather(city);
});


async function getWeather(city) {
  // Reset UI
  weatherEl.classList.add("hidden");
  errorEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("City not found");
    }

    const data = await res.json();
    displayWeather(data);

  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("hidden");
  } finally {
    loadingEl.classList.add("hidden");
  }
}

let currentUnit = "metric"; // Celsius by default
let lastWeatherData = null; // store last fetched weather

const unitToggleBtn = document.getElementById("unitToggle");

unitToggleBtn.addEventListener("click", () => {
  if (!lastWeatherData) return; // no data yet

  if (currentUnit === "metric") {
    currentUnit = "imperial";
    unitToggleBtn.textContent = "Show °C";
  } else {
    currentUnit = "metric";
    unitToggleBtn.textContent = "Show °F";
  }

  // Update temperature without fetching again
  displayWeather(lastWeatherData);
});



function displayWeather(data) {
  lastWeatherData = data; // store data for toggle

  cityEl.textContent = `${data.name}, ${data.sys.country}`;

  const temp =
    currentUnit === "metric"
      ? Math.round(data.main.temp) + "°C"
      : Math.round(data.main.temp * 9/5 + 32) + "°F";

  tempEl.textContent = temp;
  descEl.textContent = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector(".weather .icon").src = iconUrl;
  document.querySelector(".weather .icon").alt = data.weather[0].description;

  weatherEl.classList.remove("hidden");
}

