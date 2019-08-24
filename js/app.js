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
  */

let weatherData = null;

let get = {
    coords: null,
    cityName: document.getElementById("city-name-input"),
    currentWeather: () => {
        let locationURL = get.coords ? get.coords : "q=" + get.cityName.value;
        fetch("https://api.openweathermap.org/data/2.5/weather?" + locationURL + "&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
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
    location: () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                get.coords = "lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude;
                get.currentWeather();
            });
        }
        else {
            console.log("Geolocation is not supported by your browser. Please enter your city name manually.");
            return;
        }
    }
}

let view = {
    output: document.getElementById("output"),
    currentWeather: () => {
        output.innerHTML = weatherData.weather[0].description;
    }
}

window.addEventListener("load", get.location);