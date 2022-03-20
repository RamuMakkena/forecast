var iconurl = "http://openweathermap.org/img/w/";
$("#searchButton").on("click", function(){
    var cityName = $("#cityNameField").text();
    getWeatherForeCast(cityName);
})

$("input").on("change", function(){
    $(this).text($(this).val());
})

var cities = JSON.parse(localStorage.getItem("cities"));
    if(!cities){
        cities =[];
    }
    else{
        console.log("number of cities : "+cities.length);
    }
//function to get Geo Co-ordinates

async function getWeatherForeCast(cityName){
    var geoResponse = await getGeoCodes(cityName);
    console.log(geoResponse[0]);
    var response = await submitAPI(geoResponse[0].lat, geoResponse[0].lon);
    for(var i=0;i<response.length;i++){
        var weatherObject ={ 
            cityName: cityName,
            date : ( new Date(response[i].dt*1000)).toLocaleDateString(),
            temp : response[i].temp.day+"°F",
            wind : response[i].wind_speed+" MPH",
            humidity : response[i].humidity+" %",
            uvIndex : response[i].uvi,
            icon: response[i].weather[0].icon
    };
    if(i==0){
            console.log(weatherObject['date']);
            addRootInforamtion(weatherObject);
        }else{
            addWeatherCardInfo(weatherObject,i);
        }
    }
    cities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
}

function addRootInforamtion(weatherObject){
    $("#cityNameDisplay").text(weatherObject['cityName']);
    var finalIcon = iconurl+ weatherObject['icon'] + ".png";
    $("#primary-icon").html("<img src='"+finalIcon+"'/>");
    $("#dateDisplay").text(" ("+weatherObject['date']+")");
    $("#primary-temp").text(weatherObject['temp']);
    $("#primary-wind").text(weatherObject['wind']);
    $("#primary-humidity").text(weatherObject['humidity']);
    $("#primary-uvi").text(weatherObject['uvIndex']);
}

function addWeatherCardInfo(weatherObject,number){
    $("#forecast-title-"+number).text(weatherObject['date']);
    var finalIcon = iconurl+ weatherObject['icon'] + ".png";
    $("#forecast-icon-"+number).html("<img src='"+finalIcon+"'/>");
    $("#forecast-text-temp-value-"+number).text(weatherObject['temp']);
    $("#forecast-text-wind-value-"+number).text(weatherObject['wind']);
    $("#forecast-text-humidity-value-"+number).text(weatherObject['humidity']);
}
