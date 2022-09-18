var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");

// function to get city coordinates
var getCityCoords = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=718908fbd7f74c0aac0bd0ff69325a23";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                // function to extract current day weather
                getCurrentWeather(data);
                // function to call other api with the coordinates as query parameters
                getForecast(latitude, longitude);
                console.log(data);
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
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }

}

var getCurrentWeather = function (data) {

};

var getForecast = function(latitude, longitude) {

}

searchFormEl.addEventListener("submit", formSubmitHandler);

// getCityCoords("Houston");