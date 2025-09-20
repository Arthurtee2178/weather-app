// If API_KEY is empty, the script will use a small offline mock dataset so the UI works immediately.
// You can paste either the raw API key or a full OpenWeatherMap URL — we will extract the key.
const API_KEY = "api.openweathermap.org/data/2.5/weather?q=germany&appid=f7aa34226308b4b59cadcb970a770199&units=metric"; // <-- put your OpenWeatherMap API key or full URL here for live data

// Normalize API key: if the user pasted a full URL with an appid parameter, extract it.
let PARSED_API_KEY = API_KEY;
const appidMatch = String(API_KEY).match(/[?&]appid=([a-zA-Z0-9]+)/);
if (appidMatch) PARSED_API_KEY = appidMatch[1];

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const weatherResult = document.getElementById("weather-result");
const errorMessage = document.getElementById("error-message");
const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const loadingEl = document.getElementById('loading');
const weatherIconEl = document.getElementById('weather-icon');

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return showError("Please enter a city name");
  fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchBtn.click(); });

function setLoading(on) {
  loadingEl.classList.toggle('hidden', !on);
}

function fetchWeather(city) {
  setLoading(true);
  // Mock fallback when no API key (use parsed key so full-URL pastes work)
  if (!PARSED_API_KEY) {
    setTimeout(() => {
      const mock = getMockWeather(city);
      setLoading(false);
      if (!mock) return showError('City not found in demo data');
      showWeather(mock);
    }, 600);
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${PARSED_API_KEY}&units=metric`;
  fetch(url)
    .then(response => {
      setLoading(false);
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(json => {
      const data = {
        name: json.name,
        country: json.sys?.country,
        temp: json.main?.temp,
        description: json.weather?.[0]?.description || '',
        icon: json.weather?.[0]?.icon,
        humidity: json.main?.humidity,
        wind: json.wind?.speed,
        main: json.weather?.[0]?.main
      };
      showWeather(data);
    })
    .catch(err => showError(err.message || 'Failed to fetch'));
}

function showWeather(data) {
  errorMessage.textContent = '';
  weatherResult.classList.remove('hidden');
  cityNameEl.textContent = `${data.name}${data.country ? ', ' + data.country : ''}`;
  temperatureEl.textContent = `${Math.round(data.temp)}°C`;
  descriptionEl.textContent = data.description || '';
  humidityEl.textContent = `Humidity: ${data.humidity ?? '-'}%`;
  windSpeedEl.textContent = `Wind: ${data.wind ?? '-'} m/s`;
  // Prefer OpenWeatherMap icon when available (live mode)
  if (data.icon && PARSED_API_KEY) {
    // icon codes are like '10d' — OpenWeatherMap icon URL format:
    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  } else {
    const icon = mapWeatherToIcon(data.main || data.description);
    weatherIconEl.src = icon;
  }
  weatherIconEl.alt = data.description || 'weather';

  // set banner background
  const bgEl = document.getElementById('weather-bg');
  if (bgEl) {
    const bg = mapWeatherToBackground(data.main || data.description);
    bgEl.style.backgroundImage = `url('${bg}')`;
    bgEl.classList.remove('hidden');
  }
}

function showError(message) {
  setLoading(false);
  weatherResult.classList.add('hidden');
  errorMessage.textContent = message;
}

function mapWeatherToIcon(main) {
  if (!main) return 'images/search1.png';
  const key = ('' + main).toLowerCase();
  if (key.includes('drizzle')) return 'images/drizzle.png';
  if (key.includes('rain')) return 'images/rain.jpg';
  if (key.includes('cloud')) return 'images/cloudy.jpg';
  if (key.includes('clear')) return 'images/clear.jpg';
  if (key.includes('mist') || key.includes('fog') || key.includes('haze')) return 'images/mist.jpg';
  if (key.includes('wind')) return 'images/wind.png';
  // humidity and others
  if (key.includes('humidity')) return 'images/humidity.png';
  // fallback options (if multiple rain images exist prefer rain2)
  if (key.includes('rain1')) return 'images/rain1.png';
  if (key.includes('rain2')) return 'images/rain2.png';
  return 'images/search1.png';
}

function mapWeatherToBackground(main) {
  if (!main) return 'images/vuuu.jpg';
  const key = ('' + main).toLowerCase();
  if (key.includes('rain') || key.includes('drizzle')) return 'images/rain2.png';
  if (key.includes('cloud')) return 'images/cloudy.jpg';
  if (key.includes('clear')) return 'images/clear.jpg';
  if (key.includes('mist') || key.includes('fog') || key.includes('haze')) return 'images/mist.jpg';
  if (key.includes('wind')) return 'images/vuuu.jpg';
  return 'images/vuuu.jpg';
}

// small mock dataset for offline/demo usage
function getMockWeather(city) {
  const samples = {
    'london': { name: 'London', country: 'GB', temp: 14.2, description: 'Light rain', humidity: 82, wind: 4.1, main: 'Rain' },
    'new york': { name: 'New York', country: 'US', temp: 22.5, description: 'Clear sky', humidity: 55, wind: 3.4, main: 'Clear' },
    'nairobi': { name: 'Nairobi', country: 'KE', temp: 26.3, description: 'Partly cloudy', humidity: 60, wind: 2.1, main: 'Clouds' },
  };
  return samples[city.toLowerCase()] || null;
}

/* To enable live data:
 1. Sign up at https://openweathermap.org/ and get an API key.
 2. Paste it into the API_KEY constant at the top of this file.
 3. Optionally set USE_METRIC / units if you want Fahrenheit.
 */
