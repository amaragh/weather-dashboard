var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");

var historicalSearchesEl = document.querySelector("#historical-searches");

var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var weatherIconEl = document.querySelector(".weather-icon");

var currentTempEl = document.querySelector("#current-temp");
var currentHumidEl = document.querySelector("#current-humid");
var currentWindEl = document.querySelector("#current-wind");

var forecastContainerEl = document.querySelector(".forecast-weather");

var cities = [];

// function to get city coordinates
var getCityCoords = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=718908fbd7f74c0aac0bd0ff69325a23&units=metric";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                var city = data.name;
                // function to extract current day weather
                getCurrentWeather(data);
                // function to call other api with the coordinates as query parameters
                callForecastApi(latitude, longitude);

            })
        } else {
            alert("Error: City Not Found. Please enter a valid city name.")
        }
        cities.push(city);
        addHistoricalSearch(city);
        saveCities();
    });
};

var addHistoricalSearch = function(city) {
    console.log("historical searches");
    var historicalBtnEl = document.createElement("button")
    // historicalBtnEl.setAttribute("id", city);
    historicalBtnEl.textContent = city;
    historicalSearchesEl.insertBefore(historicalBtnEl, historicalSearchesEl.firstChild);
    console.log(historicalSearchesEl);
}

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
    // console.log("get current weather");

    var city = data.name;
    var weather = data.weather[0].id;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    // convert unix timecode to today's date in US format
    var date = new Date(data.dt * 1000).toLocaleDateString("en-US");

    cityNameEl.textContent = city + " " + date ;
    // currentDateEl.textContent = date;
    weatherIconEl.setAttribute("href", "./assets/images/800.png");

    currentTempEl.textContent = "Temp = " + temperature + "°F";
    currentWindEl.textContent = "Wind = " + windSpeed + " MPH";
    currentHumidEl.textContent = "Humidity = " + humidity + "%";

    // console.log(city, weather, temperature, humidity, windSpeed);


};

var callForecastApi = function (latitude, longitude) {
    console.log("latitude", latitude, "longitude", longitude);

    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=718908fbd7f74c0aac0bd0ff69325a23&units=imperial";
    console.log(apiUrl);

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
    forecastContainerEl.innerHTML = "";
    // The api returns 8 timestamps, 3 hours apart, for each of the 5 days. 
    // Each number in the array represents 3PM for each of the 5 days
    var indices = [3, 11, 19, 27, 35];

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i];

        var date = new Date(data.list[index].dt * 1000).toLocaleDateString("en-US");
        var weather = data.list[index].weather.id;
        var temperature = data.list[index].main.temp;
        var windSpeed = data.list[index].wind.speed;
        var humidity = data.list[index].main.humidity;

        var forecastDayEl = document.createElement("div");
        $(forecastDayEl).addClass("col");

        var dateEl = document.createElement("p");
        dateEl.textContent = date;
        

        var weatherEl = document.createElement("p");
        // weatherIconEl.setAttribute("href", "./assets/images/800.png");
        
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
}

var saveCities = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

searchFormEl.addEventListener("submit", formSubmitHandler);

// getCityCoords("Houston");