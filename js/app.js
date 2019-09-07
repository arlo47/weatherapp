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

 /**
  * Add rain mm to forecast and current weather
  * Promise reference error when trying to generate icon in forecast for loop
  * make sure background image works in all cases
  * put weather description in current weather
  * change forecast date to just say day of week
  * styles for desktop
  * add more background images, add night versions
  */

let weatherData = null;     //contains all weather data pulled from OpenWeather API
let forecastData = null;    //contains all forecast data pulled from OpenWeather API
let coords = null;          //contains latitude and longitude values from getLocation()
let cityName = null;        //contains city name value when user enters city name
let date = new Date();

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
                    console.log("Status is " + res.status + " for " + type);
                    res.json().then((data) => {
                        //Once data is assigned to weatherData, display content to DOM
                        if(type == "weather") {
                            weatherData = data;
                            view.displayCurrentDate();
                            view.displayCurrentDay();
                            view.displayCurrentWeather();
                            view.displayCityName();
                            view.setBackgroundImage();
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

//returns date in dd/mm/yyyy format
let formatDate = () => {
    let day = date.getDay();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

let view = {
    degrees: "<sup>&deg;C</sup>",
    tempHighArrow: "<i class='fas fa-long-arrow-alt-up'></i>",
    tempLowArrow: "<i class='fas fa-long-arrow-alt-down'></i>",
    displayCityName: () => {
        let cityNameOutput = document.getElementById("city-name");

        cityNameOutput.innerHTML = weatherData.name;
    },
    displayCurrentWeather: () => {
        let currentTempOutput = document.getElementById("current-temp");
        let currentHighTempOutput = document.getElementById("current-high-temp");
        let currentLowTempOutput = document.getElementById("current-low-temp");
        let currentWeatherIconOutput = document.getElementById("current-weather-icon");

        currentTempOutput.innerHTML = weatherData.main.temp + view.degrees;
        currentHighTempOutput.innerHTML = view.tempHighArrow + weatherData.main.temp_max + view.degrees;
        currentLowTempOutput.innerHTML = view.tempLowArrow + weatherData.main.temp_min + view.degrees;
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
        let forecastDataOutputList = document.querySelectorAll("div.three-hour-forecast > div.row");

        for(let i = 0; i < forecastDataOutputList.length; i++) {
            let forecastDate = forecastData.list[i].dt_txt;
            let mainTemp = forecastData.list[i].main.temp + view.degrees;
            let maxTemp = view.tempHighArrow + forecastData.list[i].main.temp_max + view.degrees;
            let minTemp = view.tempLowArrow + forecastData.list[i].main.temp_min + view.degrees;
            let description = "<i class='owi owi-09d'></i>" + forecastData.list[i].weather[0].description;

            forecastDataOutputList[i].innerHTML =   
            "<div class='forecast-date'>" + forecastDate + "</div>" +
            "<div class='forecast-description'>" + description + "</div>" +
            "<div class='forecast-main-temp'>" + mainTemp + "</div>" +
            "<div class='forecast-max-temp'>" + maxTemp +  "</div>" +
            "<div class='forecast-min-temp'>" + minTemp +  "</div>";
        }
    },
    setBackgroundImage: () => {
        let weather = weatherData.weather[0].main;
        let image = document.querySelector(".bg-image");

        console.log(weather);   //outputs weather description

        switch(weather) {
            case "Clouds":
                image.id = "clouds";
                break;
            case "Clear":
                image.id = "clear";
                break;
            case "Drizzle":
                image.id = "drizzle";
                break;
            case "Mist":
                image.id = "mist";
                break; 
            case "Rain":
                image.id = "rain";
                break;
            case "Snow":
                image.id = "snow";
                break;
            case "Thunderstorm":
                image.id = "thunderstorm";
                break;
            default:
                console.log("default switche case triggered.");
                break;
        }
    },
    displayIcon: (iconCode) => {
        return "<i class='owi owi-" + iconCode + "'></i>"
    },
    //this is not working, read notes at top of page for more info
    displayRain: (rain) => {
        if(rain > 0) {
            return ", " + rain + "mm";
        }
    }
}

window.addEventListener("load", getLocation);