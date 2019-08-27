/** ***API INFO***
 * API key: f20349ac0af5ebfbc2586d5a8ae52834
 * URL example: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=f20349ac0af5ebfbc2586d5a8ae52834
 * by geolocation: api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
 * by city name: api.openweathermap.org/data/2.5/weather?q={city name}
 */

 /** ***TO DO LIST***
  * add methods for 5 day forecast
  * add methods for 16 day forecast
  * figure out a way to specify weather by city name if search btn is clicked
  * something is wrong with the order the view methods are running. view.displayCurrentWeather() is running before weatherData is populated
  */

let weatherData = null;
let date = new Date();

let formatDate = () => {
    let day = date.getDay();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

let apiHandler = {
    coords: null,
    cityName: document.getElementById("city-name-input"),
    getCurrentWeather: () => {
        let locationURL = apiHandler.coords ? apiHandler.coords : "q=" + apiHandler.cityName.value;
        fetch("https://api.openweathermap.org/data/2.5/weather?" + locationURL + "&units=metric&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
            .then(
                (res) => {
                    if(res.status == 200) {
                        console.log("Status is " + res.status);
                        res.json().then((data) => {
                            weatherData = data;
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
    getLocation: () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                apiHandler.coords = "lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude;
                apiHandler.getCurrentWeather();
            });
        }
        else {
            console.log("Geolocation is not supported by your browser. Please enter your city name manually.");
            return;
        }
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
    }
}


apiHandler.getLocation();

window.addEventListener("load", view.displayCurrentDate);
window.addEventListener("load", view.displayCurrentDay);
window.addEventListener("load", view.displayCurrentWeather);