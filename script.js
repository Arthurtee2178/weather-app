
const API_KEY = ""; 
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






