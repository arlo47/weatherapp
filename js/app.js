let weatherData = null;                                     //contains all weather data pulled from OpenWeather API
let forecastData = null;                                    //contains all forecast data pulled from OpenWeather API
let coords = null;                                          //contains latitude and longitude values from getLocation()
let date = new Date();
let cityName = document.getElementById("city-name-input");  //input containing city name

//Gets geolocation data from user if able too, fetches data from API
let data = {
    getLocation: () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                coords = "lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude;
                data.fetchFromAPI("weather");
                data.fetchFromAPI("forecast");
            });
        }
        else {
            console.log("Geolocation is not supported by your browser. Please enter your city name manually.");
            return;
        }
    },
    fetchFromAPI: (type) => {
        console.log(cityName);
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
                                console.log("type parameter in fetchFromAPI() was not weather or forecast");
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
    },
    weatherByCityName: () => {
        coords = null;
        data.fetchFromAPI("weather");
        data.fetchFromAPI("forecast");
    }
}

//handles formatting of date, time and day of week
let arrange = {
    formatDate: (dt_text) => {
        if(dt_text == "current") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
        
            return day + "/" + month + "/" + year;
        }
        else if(dt_text.length == 19) {
            let dtSubstring = dt_text.substring(0, 10);
            let forecastDate = new Date(dtSubstring);
    
            let day = forecastDate.getDate();
            let month = forecastDate.getMonth() + 1;
            let year = forecastDate.getFullYear();
    
            return day + "/" + month + "/" + year;
        }
        else {
            console.log("Error in formatDate()");
        }
    
    },
    formatTime: (dt_text) => {
        let minutes = dt_text.substring(13, 16);
        let hours = parseInt(dt_text.substring(11, 13));
        let meridiem = "am";
    
        if(hours == 00) {
            hours = 12;
        }
        else if(hours > 12) {
            hours = hours - 12;
            meridiem = "pm";
        }
        return hours + minutes + meridiem;
    },
    formatDay: (dt_text) => {
        let dtSubstring = dt_text.substring(0, 10);
        let forecastDate = new Date(dtSubstring);
        let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let dayName = days[forecastDate.getDay()];
        return dayName;
    }
}

//handles outputting to DOM and CSS modifications
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
        currentWeatherIconOutput.innerHTML = view.displayIcon(weatherData.weather[0].icon) + 
                                            `<span>${ weatherData.weather[0].main }</span>`;
    },
    displayCurrentDay: () => {
        let currentDayOutput = document.getElementById("current-day");
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayName = days[date.getDay()];
                
        currentDayOutput.innerHTML = dayName;
    },
    displayCurrentDate: () => {
        let currentDateOutput = document.getElementById("current-date");

        currentDateOutput.innerHTML = arrange.formatDate("current");
    },
    displayThreeHourForecast: () => {
        let forecastDataOutputList = document.querySelectorAll("div.three-hour-forecast > div.row");

        for(let i = 0; i < forecastDataOutputList.length; i++) {
            let forecastDate = forecastData.list[i].dt_txt;
            let mainTemp = forecastData.list[i].main.temp + view.degrees;
            let maxTemp = view.tempHighArrow + forecastData.list[i].main.temp_max + view.degrees;
            let minTemp = view.tempLowArrow + forecastData.list[i].main.temp_min + view.degrees;
            let description = `${ view.displayIcon(forecastData.list[i].weather[0].icon) }
                               <span> ${ forecastData.list[i].weather[0].description } </span>`;

            forecastDataOutputList[i].innerHTML =   
           `<div class='forecast-info-container'>
                <div class='forecast-date'>
                    ${ arrange.formatDay(forecastDate) }
                    ${ arrange.formatDate(forecastDate) } 
                    ${ arrange.formatTime(forecastDate) }
                </div>
                <div class='forecast-description'> ${ description } </div>
            </div>
            <div class='temp-container'>
                <div class='forecast-main-temp'> ${ mainTemp } </div>
                <div class='max-min-container'>
                    <div class='forecast-max-temp'> ${ maxTemp } </div>
                    <div class='forecast-min-temp'> ${ minTemp } </div>
                </div>
            </div>`;
        }
    },
    setBackgroundImage: () => {
        let weather = weatherData.weather[0].main;
        let description = weatherData.weather[0].description;
        let image = document.querySelector(".bg-image");

        console.log("main: " + weather);   //outputs weather main description
        console.log("description: " + description);   //outputs weather description

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
                console.log("default switch case triggered.");
                break;
        }
    },
    displayIcon: (iconCode) => {
        return `<i class='owi owi-${ iconCode }'></i>`;
    }
}

window.addEventListener("load", data.getLocation);
cityName.addEventListener("keypress", (e) => {
    let key = e.which || e.keyCode;
    if(key === 13) {
        data.weatherByCityName();
    }
});