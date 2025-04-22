let currentWeather = {};

function getCurrentWeather() {
    return currentWeather;
}

function fetchWeather() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = 'YOUR_API_KEY';
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    currentWeather = {
                        temp: Math.round(data.main.temp),
                        condition: data.weather[0].main,
                        icon: data.weather[0].icon
                    };
                    updateWeatherDisplay();
                })
                .catch(error => {
                    console.error("Error fetching weather data:", error);
                });
        },
        error => {
            console.error("Error getting location:", error);
        }
    );
}

function updateWeatherDisplay() {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;
    
    const weatherIcon = getWeatherIcon(currentWeather.condition);
    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <span class="weather-icon">${weatherIcon}</span>
            <span class="weather-temp">${currentWeather.temp}°C</span>
        </div>
    `;
}

function getWeatherIcon(condition) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌫️',
        'Fog': '🌫️',
        'Sand': '🌫️',
        'Ash': '🌫️',
        'Squall': '🌬️',
        'Tornado': '🌪️'
    };
    
    return icons[condition] || '🌈';
}
document.addEventListener('DOMContentLoaded', fetchWeather);
