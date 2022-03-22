var iconurl = "http://openweathermap.org/img/w/";
// Event listener for search button
$("#searchButton").on("click", function(){
    var cityName = $("#cityNameField").text();
    if(!cityName)
    {
        $("#validationError").text("Please enter a valid City Name");
        return false;
    }
    getWeatherForeCast(cityName);
})
//Whenever the field values chagned in city
$("input").on("change", function(){
    $("#validationError").text("");
    $(this).text($(this).val());
})
//Getting cities from the local storage
var cities = JSON.parse(localStorage.getItem("cities"));
    if(!cities){
        cities =[];
    }
    else{
        //If local storage present, re assigning and displaying previous searches
        for(var i=0; i<cities.length;i++){
            updateCity(cities[i]);
        }
        getWeatherForeCast(cities[cities.length-1]);
    }
//Getting weather forecast for cities
async function getWeatherForeCast(cityName){
    //First cehcking the geo coordinates for city given
    var geoResponse = await getGeoCodes(cityName);
    if(!geoResponse[0]){
        $("#validationError").text("Apologies we could not find matching city. Please try another");
        return false;
    }
    //getting weather based on coordinates
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
        //For first item, displaying the main section
            addRootInforamtion(weatherObject);
        }else{
            //updating cards for rest
            addWeatherCardInfo(weatherObject,i);
        }
    }
    // updating local storage
    updateLocalStorage(cityName);
}

//Displaying the main section of weather display
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
//Updating cards
function addWeatherCardInfo(weatherObject,number){
    $("#forecast-title-"+number).text(weatherObject['date']);
    var finalIcon = iconurl+ weatherObject['icon'] + ".png";
    $("#forecast-icon-"+number).html("<img src='"+finalIcon+"'/>");
    $("#forecast-text-temp-value-"+number).text(weatherObject['temp']);
    $("#forecast-text-wind-value-"+number).text(weatherObject['wind']);
    $("#forecast-text-humidity-value-"+number).text(weatherObject['humidity']);
}

//Updating one city at a time in previous searches section
function updateCity(cityName){
    var recentCityButton = $("<p>").addClass("prevSearchCity text-white rounded col-10 m-2");
        recentCityButton.text(cityName);
        $("#previousSearches").append(recentCityButton);
}

//updating local storage
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

// Event listener for previous searches
$("#previousSearches").on("click",".prevSearchCity",function(){
    var cityName = $(this).text();
    $("input").val(cityName);
    getWeatherForeCast(cityName);
});
