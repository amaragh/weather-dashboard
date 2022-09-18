var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");

var searchContainerEl = document.querySelector("#search-container");

var historicalSearchesEl = document.querySelector("#historical-searches");

var currentWeatherEl = document.querySelector(".current-weather");

var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var weatherIconEl = document.querySelector(".weather-icon");

var currentTempEl = document.querySelector("#current-temp");
var currentHumidEl = document.querySelector("#current-humid");
var currentWindEl = document.querySelector("#current-wind");

var forecastContainerParentEl = document.querySelector("#forecast-container");
var forecastContainerEl = document.querySelector(".forecast-weather");

var cities = [];

// function to get city coordinates
var getCityCoords = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=718908fbd7f74c0aac0bd0ff69325a23&units=metric";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;


                // function to extract current day weather
                getCurrentWeather(data);
                // function to call other api with the coordinates as query parameters
                callForecastApi(latitude, longitude);

                // add city name to array if not present and sve to localStorage
                var city = data.name;
                if (!cities.includes(city)) {
                    cities.push(city);
                }
                saveCities();

                // add historical sarch button
                addHistoricalSearch(city);

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
var addHistoricalSearch = function (city) {

    var cityId = city.replace(" ", "-");
    var existingBtnEl = document.querySelector(`#${cityId}`);

    // only add button if it does not already exist for that city
    if (!existingBtnEl) {
        var historicalBtnEl = document.createElement("button")
        historicalBtnEl.textContent = city;
        historicalBtnEl.setAttribute("id", cityId);
        historicalBtnEl.classList = "rounded";
        // add new button as first child so it appears as the first button in the historical search list
        historicalSearchesEl.insertBefore(historicalBtnEl, historicalSearchesEl.firstChild);

    }
}

var getCurrentWeather = function (data) {

    var city = data.name;
    var weather = data.weather[0].main;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    // convert unix timecode to today's date in US format
    var date = new Date(data.dt * 1000).toLocaleDateString("en-US");

    cityNameEl.textContent = city + " (" + date + ")";
    // currentDateEl.textContent = date;
    var weatherClass = getWeatherClass(weather);
    weatherIconEl.classList = `icon ${weatherClass}`;


    currentTempEl.textContent = "Temp = " + temperature + "°F";
    currentWindEl.textContent = "Wind = " + windSpeed + " MPH";
    currentHumidEl.textContent = "Humidity = " + humidity + "%";

    currentWeatherEl.setAttribute("style", "display:'';")

};

var callForecastApi = function (latitude, longitude) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=718908fbd7f74c0aac0bd0ff69325a23&units=imperial";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getForecast(data);
            })
        } else {
            alert("There was an error retrieving data for this city.")
        }
    })
}

var getForecast = function (data) {
    // clear any forecast data, if present
    forecastContainerEl.innerHTML = "";

    // The api returns 8 timestamps, 3 hours apart, for each of the 5 days. 
    // Each number in the array represents 3PM for each of the 5 days
    var indices = [3, 11, 19, 27, 35];

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i];

        var date = new Date(data.list[index].dt * 1000).toLocaleDateString("en-US");
        var weather = data.list[index].weather[0].main;
        var temperature = data.list[index].main.temp;
        var windSpeed = data.list[index].wind.speed;
        var humidity = data.list[index].main.humidity;

        var forecastDayEl = document.createElement("div");
        $(forecastDayEl).addClass("col");

        var dateEl = document.createElement("p");
        dateEl.textContent = date;



        var weatherEl = document.createElement("i");
        var weatherClass = getWeatherClass(weather);
        weatherEl.classList = `icon ${weatherClass}`;

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp = " + temperature + "°F";

        var windEl = document.createElement("p");
        windEl.textContent = "Wind = " + windSpeed + " MPH";

        var humidEl = document.createElement("p");
        humidEl.textContent = "Humidity = " + humidity + "%";


        forecastDayEl.appendChild(dateEl);
        forecastDayEl.appendChild(weatherEl);
        forecastDayEl.appendChild(tempEl);
        forecastDayEl.appendChild(windEl);
        forecastDayEl.appendChild(humidEl);

        forecastContainerEl.appendChild(forecastDayEl);

    }
    forecastContainerParentEl.setAttribute("style", "display:'';");


}

var getWeatherClass = function (weather) {
    switch (weather) {
        case "Clouds":
            weatherClass = "fa fa-cloud";
            break;
        case "Clear":
            weatherClass = "fa fa-sun";
            break;

        case "Rain":
            weatherClass = "fa fa-cloud-rain";
            break;
        case "Snow":
            weatherClass = "fa-snowflake";
            break;
    }

    return weatherClass;
}

// save searched cities to localStorage
var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
}

var loadCities = function () {
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    if (!savedCities) {
        savedCities = [];
    }

    for (var i = 0; i < savedCities.length; i++) {
        var city = savedCities[i];

        // create button for each city that was in localStorage
        addHistoricalSearch(city);
    }

    cities = savedCities;
}

searchFormEl.addEventListener("submit", formSubmitHandler);

historicalSearchesEl.addEventListener("click", function (event) {
    var city = event.target.textContent;
    getCityCoords(city);
})

// when page is opened, load historical searches as available buttons
loadCities();