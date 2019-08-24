/**
 *  API key: f20349ac0af5ebfbc2586d5a8ae52834
 *  URL example: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=f20349ac0af5ebfbc2586d5a8ae52834
 *  by geolocation: api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
 *  by city name: api.openweathermap.org/data/2.5/weather?q={city name}
 */

let get = {
    currentWeather: () => {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=Lachine&APPID=f20349ac0af5ebfbc2586d5a8ae52834")
            .then(
                (res) => {
                    if(res.status == 200) {
                        console.log("Status is " + res.status);
                        res.json().then((data) => {
                            console.log(data);
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