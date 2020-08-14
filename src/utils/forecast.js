const request = require('request');

// calling weather stack api
const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=358d1b953033d8dad74f7165b1afa931&query='+ latitude + ',' + longitude + '&units=f';
    request({url, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to weather service');
        }
        else if(body.error){
            callback('Unable to find location');
        }
        else{        
            callback(undefined,`${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out with  Wind: ${body.current.wind_speed} and Humidity: ${body.current.humidity}`);
        }
    })
}

module.exports = forecast

