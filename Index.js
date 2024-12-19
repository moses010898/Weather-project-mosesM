<script>
    const apiKey = 'afa656862cd10f4f7638d0cfbda9b971';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    const locationInput = document.getElementById('locationInput');
    const searchButton = document.getElementById('searchButton');
    const currentLocationButton = document.getElementById('currentLocationButton');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const weatherIcon = document.getElementById('weatherIcon');
    const localTimeElement = document.getElementById('localTime');

    // Event listeners
    searchButton.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            fetchWeather(location);
        }
    });

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            }, () => {
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Fetch weather data by city name
    function fetchWeather(location) {
        const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    // Fetch weather data by coordinates
    function fetchWeatherByCoords(lat, lon) {
        const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    // Display weather data
    function displayWeather(data) {
        locationElement.textContent = data.name;
        temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElement.textContent = data.weather[0].description;

        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.style.display = 'block';

        // Display wind speed
        const windSpeed = data.wind.speed;
        const windDirection = data.wind.deg;
        descriptionElement.textContent += `, Wind: ${windSpeed} m/s (${getWindDirection(windDirection)})`;

        // Calculate and display local time
        const timezoneOffset = data.timezone; // Offset in seconds from UTC
        const localDate = new Date(new Date().getTime() + timezoneOffset * 1000);
        localTimeElement.textContent = `Local Time: ${localDate.toLocaleTimeString()}`;
    }

    // Convert wind direction degrees to compass direction
    function getWindDirection(degrees) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }
</script>
