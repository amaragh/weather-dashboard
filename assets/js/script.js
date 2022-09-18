var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");

var cityNameEl = document.querySelector("#city-name");
var currentDateEl =  document.querySelector("#current-date");
var weatherIconEl = document.querySelector(".weather-icon");

var currentTempEl = document.querySelector("#current-temp");
var currentHumidEl = document.querySelector("#current-humid");
var currentWindEl = document.querySelector("#current-wind");


// function to get city coordinates
var getCityCoords = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=718908fbd7f74c0aac0bd0ff69325a23&units=metric";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                // function to extract current day weather
                getCurrentWeather(data);
                // function to call other api with the coordinates as query parameters
                getForecast(latitude, longitude);

            })
        } else {
            alert("Error: City Not Found. Please enter a valid city name.")
        }
    });
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    // get city name from search form input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        // call get function to retrieve city coordinates and today's weather
        getCityCoords(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }

}

var getCurrentWeather = function (data) {
    console.log("get current weather");

    var city = data.name;
    var weather = data.weather[0].id;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    // convert unix timecode to today's date in US format
    var date = new Date(data.dt * 1000).toLocaleDateString("en-US");

    cityNameEl.textContent = city;
    currentDateEl.textContent = date;
    weatherIconEl.setAttribute("href", "./assets/images/800.png");

    currentTempEl. textContent = "Temp = " + temperature + "°F";
    currentWindEl.textContent = "Wind = " + windSpeed + " MPH";
    currentHumidEl. textContent = "Humidity = " + humidity + "%";

    console.log(city, weather, temperature, humidity, windSpeed);


};

var getForecast = function (latitude, longitude) {
    console.log("latitude", latitude, "longitude", longitude);
}

searchFormEl.addEventListener("submit", formSubmitHandler);

// getCityCoords("Houston");