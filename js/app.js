// API key: f20349ac0af5ebfbc2586d5a8ae52834

/** ***ICON CONVERSION LIST***
 * PNG    DESCRIPTION         OWF
 * ------------------------------
 * 01n    clear sky           800   
 * 02d    few clouds          801
 * 03d    scattered clouds    802
 * 04d    broken clouds       803
 * 09d    shower rain         521
 * 10d    rain                501
 * 11d    thunderstorms       202
 * 13d    snow                602
 * 50d    mist                701
 */

let weatherData = null;     //contains all weather data pulled from OpenWeather API
let forecastData = null;    //contains all forecast data pulled from OpenWeather API
let coords = null;          //contains latitude and longitude values from getLocation()
let cityName = null;        //contains city name value when user enters city name
let date = new Date();

//returns date in dd/mm/yyyy format
let formatDate = () => {
    let day = date.getDay();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

//uses the browsers geolocation method to get users coordinates
let getLocation = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            coords = "lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude;
            fetchFromAPI("weather");
            fetchFromAPI("forecast");
        });
    }
    else {
        console.log("Geolocation is not supported by your browser. Please enter your city name manually.");
        return;
    }
}

//type can be either weather or forecast, weather returns current weather info, forecast returns 5 day/3 hour forecast
let fetchFromAPI = (type) => {
    let locationURL = coords ? coords : "q=" + cityName.value;

    fetch("https://api.openweathermap.org/data/2.5/" + type + "?" + locationURL + "&units=metric&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
        .then(
            (res) => {
                if(res.status == 200) {
                    console.log("Status is " + res.status);
                    res.json().then((data) => {
                        //Once data is assigned to weatherData, display content to DOM
                        if(type == "weather") {
                            weatherData = data;
                            view.displayCurrentDate();
                            view.displayCurrentDay();
                            view.displayCurrentWeather();
                        }
                        else if(type == "forecast") {
                            forecastData = data;
                            view.displayThreeHourForecast();
                        }
                        else {
                            console.log("type was not weather or forecast");
                        }
                    });
                }
                else {
                    console.log("Error. Status is " + res.status);
                }
            }
        )
        .catch((err) => {
            console.log("Fetch Error: " + err);
        });
}


let view = {
    displayCurrentWeather: () => {
        let currentTempOutput = document.getElementById("current-temp");
        let currentHighTempOutput = document.getElementById("current-high-temp");
        let currentLowTempOutput = document.getElementById("current-low-temp");
        let currentWeatherIconOutput = document.getElementById("current-weather-icon");

        currentTempOutput.innerHTML = weatherData.main.temp;
        currentHighTempOutput.innerHTML = weatherData.main.temp_max;
        currentLowTempOutput.innerHTML = weatherData.main.temp_min;
        //gets icon code from weatherData and inserts it to the src of an <img> with displayIcon()
        currentWeatherIconOutput.innerHTML = view.displayIcon(weatherData.weather[0].icon);
    },
    displayCurrentDay: () => {
        let currentDayOutput = document.getElementById("current-day");
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayName = days[date.getDay()];
                
        currentDayOutput.innerHTML = dayName;
    },
    displayCurrentDate: () => {
        let currentDateOutput = document.getElementById("current-date");

        currentDateOutput.innerHTML = formatDate();
    },
    displayThreeHourForecast: () => {
        let forecastDataOutputList = document.querySelectorAll("div.three-hour-forecast > div.col-12 > div.row");
        console.log(forecastDataOutputList);

        for(let i = 0; i < forecastDataOutputList.length; i++) {
            forecastDataOutputList[i].innerHTML =   "<div class='col-5'>" + forecastData.list[i].dt_txt + "</div>" +
                                                    //throwing an error
                                                    "<div class='col-1'>" + "<img class='icon' src='img/icons/11d.svg'>" + "</div>" +
                                                    "<div class='col-3'>" + forecastData.list[i].weather[0].description + "</div>" +
                                                    "<div class='col-1'>" + forecastData.list[i].main.temp + "</div>" +
                                                    "<div class='col-1'>" + forecastData.list[i].main.temp_max + "</div>" +
                                                    "<div class='col-1'>" + forecastData.list[i].main.temp_min + "</div>";
        }
    },
    displayIcon: (iconCode) => {
        return "<img class='icon' src='img/icons/" + iconCode + ".svg'>";
    }
}






window.addEventListener("load", getLocation);