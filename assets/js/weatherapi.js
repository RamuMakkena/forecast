var weatherEndpoint='http://api.openweathermap.org/data/2.5/onecall?exclude=current,minutely,hourly,alerts&APPID=f65a1aee858b1d7af065cd4b5b972ce8&units=metric&';
var geoLocationEndPOint = 'http://api.openweathermap.org/geo/1.0/direct?APPID=f65a1aee858b1d7af065cd4b5b972ce8&';


function submitAPI(lattitude, longitude){

var responseBody= fetch(buildAPIEndPoint(lattitude, longitude), {"method":"GET"})
    .then((response) => {return response.json();})
    .then((data)=> { 
        return data.daily;})
    .catch((err)=> {console.error(err)});
    return responseBody;
}


function  buildAPIEndPoint(lattitude, longitude){
        return weatherEndpoint+"lat="+lattitude+"&lon="+longitude;
}

function getGeoCodes(cityName){
    var responseBody = fetch(geoLocationEndPOint+"q="+cityName, {"method":"GET"})
    .then((response)=> {return response.json();})
    .catch((err)=> {console.error(err);} )
    return responseBody;
    
}