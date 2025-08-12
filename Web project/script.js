document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.querySelector('.input-box');
    const search = document.getElementById('searchBtn');
    const weatherImg = document.querySelector('.weather-img');
    const temperature = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
  
    const locationNotFound = document.querySelector('.location-not-found');
    const weatherBody = document.querySelector('.weather-body');
    const forecastContainer = document.querySelector('.forecast');
    const forecastGraph = forecastContainer.querySelector('.forecast-graph');
  
    async function checkWeather(city) {
        const apiKey = "1daca16c2db4b6e814370471c8673ade"; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
        try {
            const response = await fetch(url);
            const weatherData = await response.json();
  
            if (weatherData.cod === '404') {
                locationNotFound.style.display = "flex";
                weatherBody.style.display = "none";
                forecastContainer.style.display = "none";
                return;
            }
  
            locationNotFound.style.display = "none";
            weatherBody.style.display = "flex";
  
            temperature.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
            description.innerHTML = weatherData.weather[0].description;
            humidity.innerHTML = `${weatherData.main.humidity}%`;
            windSpeed.innerHTML = `${weatherData.wind.speed} Km/H`;
  
            const weatherIcons = {
                "Clouds": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4DnvhFG1KPned0UdolagOuxQmXlsPojBzhQ&s",
                "Clear": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFrwcf68XXJjhB3Dsc01nF2ogghbGpUe2RQ&s",
                "Rain": "https://static.vecteezy.com/system/resources/previews/042/056/613/non_2x/heavy-rain-icon-weather-icon-suitable-for-mobile-app-icons-websites-etc-free-png.png",
                "Mist": "./asset/mist.png",
                "Snow": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMJjrGO5dbJuIrbHCQvu-tO4pXBCYDGGEAMA&s"
            };
            weatherImg.src = weatherIcons[weatherData.weather[0].main] || "./asset/default.png";
  
            // Fetch forecast
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
  
            forecastGraph.innerHTML = ""; // Clear previous data
            const next5Forecasts = forecastData.list.slice(0, 5); // ~15 hours
  
            next5Forecasts.forEach(item => {
                const temp = Math.round(item.main.temp);
                const forecastBar = document.createElement('div');
                forecastBar.classList.add('forecast-bar');
                forecastBar.innerHTML = `
                    <div class="bar" style="background-color: ${getColorForTemperature(temp)}; height: ${temp * 2}px;"></div>
                    <div class="temp-label">${temp}°C</div>
                `;
                forecastGraph.appendChild(forecastBar);
            });
  
            forecastContainer.style.display = "block";
  
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    const getColorForTemperature = (temp) => {
        if (temp < 0) return '#00f'; // Blue for cold
        if (temp < 15) return '#0ff'; // Cyan for cool
        if (temp < 25) return '#0f0'; // Green for mild
        if (temp < 35) return '#ff0'; // Yellow for warm
        return '#f00'; // Red for hot
    };

    const toggleMode = () => {
        document.body.classList.toggle("dark");
        const isDarkMode = document.body.classList.contains("dark");
        document.querySelector('.container').style.backgroundColor = isDarkMode ? '#333' : '#fff';
        document.querySelector('.container').style.color = isDarkMode ? '#fff' : '#333';
    };
    
    // Attach event listener for dark mode toggle
    document.getElementById("toggleModeBtn").addEventListener("click", toggleMode);
    
    search.addEventListener('click', () => {
        checkWeather(inputBox.value);
    });
  
    inputBox.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            checkWeather(inputBox.value);
        }
    });
});