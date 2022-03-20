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
        for(var i=0; i<cities.length;i++){
            updateCity(cities[i]);
        }
        getWeatherForeCast(cities[cities.length-1]);
    }

async function getWeatherForeCast(cityName){
    var geoResponse = await getGeoCodes(cityName);
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
            addRootInforamtion(weatherObject);
        }else{
            addWeatherCardInfo(weatherObject,i);
        }
    }
    updateLocalStorage(cityName);
}

function addRootInforamtion(weatherObject){
    $("#cityNameDisplay").text(weatherObject['cityName']);
    var finalIcon = iconurl+ weatherObject['icon'] + ".png";
    $("#primary-icon").html("<img src='"+finalIcon+"'/>");
    $("#dateDisplay").text(" ("+weatherObject['date']+")");
    $("#primary-temp").text(weatherObject['temp']);
    $("#primary-wind").text(weatherObject['wind']);
    $("#primary-humidity").text(weatherObject['humidity']);
    var uvi = weatherObject['uvIndex'];
    $("#primary-uvi").text(uvi);
    if(uvi <=2){
        $("#primary-uvi").addClass("uvi-green text-white px-2 rounded");
    }else if(uvi>2 && uvi<=5){
        $("#primary-uvi").addClass("uvi-yellow text-dark px-2  rounded");
    }else if(uvi>5 && uvi<=7){
        $("#primary-uvi").addClass("uvi-orange text-white  px-2 rounded");
    } else if(uvi>7 && uvi<=10){
        $("#primary-uvi").addClass("uvi-red text-white px-2 rounded");
    } else {
        $("#primary-uvi").addClass("uvi-violet text-white px-2  rounded");
    }
}

function addWeatherCardInfo(weatherObject,number){
    $("#forecast-title-"+number).text(weatherObject['date']);
    var finalIcon = iconurl+ weatherObject['icon'] + ".png";
    $("#forecast-icon-"+number).html("<img src='"+finalIcon+"'/>");
    $("#forecast-text-temp-value-"+number).text(weatherObject['temp']);
    $("#forecast-text-wind-value-"+number).text(weatherObject['wind']);
    $("#forecast-text-humidity-value-"+number).text(weatherObject['humidity']);
}


function updateCity(cityName){
    var recentCityButton = $("<p>").addClass("prevSearchCity text-white rounded col-10 m-2");
        recentCityButton.text(cityName);
        $("#previousSearches").append(recentCityButton);
}

function updateLocalStorage(cityName){
        cities = cities.filter((city) => city!=cityName );
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
        cities.reverse();
        $("#previousSearches").html("");
        for(var i=0;i<cities.length;i++){
            updateCity(cities[i]);
        }
}

$("#previousSearches").on("click",".prevSearchCity",function(){
    var cityName = $(this).text();
    $("input").val(cityName);
    getWeatherForeCast(cityName);
});
