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

let weatherData = null;
let threeHourForecast = null;
let dailyForecast = null;

let formatDate = () => {
    let date = new Date();

    let day = date.getDay();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

let apiHandler = {
    coords: null,
    cityName: document.getElementById("city-name-input"),
    getLocation: () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                apiHandler.coords = "lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude;
                apiHandler.getCurrentWeather();
                apiHandler.getThreeHourForecast();
            });
        }
        else {
            console.log("Geolocation is not supported by your browser. Please enter your city name manually.");
            return;
        }
    },
    //the URL is the same for both fetch methds, they can be combined
    //modify locationURL by geolocation or city name depending on parameters given
    getCurrentWeather: () => {
        let locationURL = apiHandler.coords ? apiHandler.coords : "q=" + apiHandler.cityName.value;

        fetch("https://api.openweathermap.org/data/2.5/weather?" + locationURL + "&units=metric&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
            .then(
                (res) => {
                    if(res.status == 200) {
                        console.log("Status is " + res.status);
                        res.json().then((data) => {
                            //Once data is assigned to weatherData, display content to DOM
                            weatherData = data;
                            view.displayCurrentDate();
                            view.displayCurrentDay();
                            view.displayCurrentWeather();
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
    getThreeHourForecast: () => {
        //By geo location: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}
        //By city name: api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
        let locationURL = apiHandler.coords ? apiHandler.coords : "q=" + apiHandler.cityName.value;

        fetch("https://api.openweathermap.org/data/2.5/forecast?" + locationURL + "&units=metric&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
            .then(
                (res) => {
                    if(res.status == 200) {
                        console.log("status is " + res.status);
                        res.json().then((data) => {
                            threeHourForecast = data;
                            view.displayThreeHourForecast();
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
}

let view = {
    displayCurrentWeather: () => {
        let currentTempOutput = document.getElementById("current-temp");
        let currentHighTempOutput = document.getElementById("current-high-temp");
        let currentLowTempOutput = document.getElementById("current-low-temp");

        currentTempOutput.innerHTML = weatherData.main.temp;
        currentHighTempOutput.innerHTML = weatherData.main.temp_max;
        currentLowTempOutput.innerHTML = weatherData.main.temp_min;
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
        let threeHourForecastOutputList = document.querySelectorAll("div.three-hour-forecast > div");
        console.log(threeHourForecastOutputList);

        for(let i = 0; i < threeHourForecastOutputList.length; i++) {
            threeHourForecastOutputList[i].innerHTML =  "<div>" +
                                                            "<span>" + threeHourForecast.list[i].dt_txt + "</span>" +
                                                            "<span>" + threeHourForecast.list[i].main.temp + "</span>" +
                                                        "</div>" +
                                                        "<span>" + threeHourForecast.list[i].main.temp_max + "</span>"
                                                        "<span>" + threeHourForecast.list[i].main.temp_min + "</span>";
        }
    }
}

window.addEventListener("load", apiHandler.getLocation);