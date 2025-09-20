# Weather App

A simple client-side Weather App demo that shows current weather for a city.

Features
- Search for a city and display temperature, description, humidity, and wind.
- Uses OpenWeatherMap for live data when an API key is provided.
- Works offline with a small mock dataset (no API key required) for quick demos.
- Uses local images (in `images/`) for icons and a banner; falls back to OpenWeatherMap icons when live mode is enabled.

Files
- `index.html` — main page
- `styles.css` — styles
- `script.js` — app logic and API integration
- `images/` — local images used for icons and background

Quick start
1. Open `index.html` in your browser (double-click or right-click → Open with).
2. Type a city name and click Search (or press Enter).

Demo cities (no API key required)
- London
- New York
- Nairobi

Enabling live data (OpenWeatherMap)
1. Sign up at https://openweathermap.org/ and obtain an API key (appid).
2. Open `script.js` and set the `API_KEY` constant at the top of the file. The script accepts either:
   - The raw API key string (e.g. `"abcd1234"`)
   - Or a full OpenWeatherMap URL containing `appid`, the script will extract the key automatically.
3. Save and reload `index.html`.

Notes
- When live mode is enabled, the app will prefer OpenWeatherMap's icon images for the weather condition. If the API icon is not available, it falls back to the images in `images/`.
- For security, avoid committing actual API keys to public repositories. If you'd like, I can update the app to read the key from a separate config file ignored by git, or prompt for it at runtime.

Troubleshooting
- If you get "City not found": check the console (F12 → Network) to see the API request and response. Ensure your API key is correct and not rate-limited.
- If icons don't show in live mode: verify the network response includes `weather[0].icon`.

Next improvements (optional)
- Add a small loading spinner animation.
- Add unit (C/F) toggle and remember preference in localStorage.
- Use API-provided background images or higher-resolution local banners.

If you'd like the README expanded with screenshots or deployment instructions, tell me where you'd host it and I’ll add a section for that.
