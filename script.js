let weather = {
    apiKey: "0bc0df816d8225b54cbbb650dbc61881",
    fetchWeather: function(city) {  /*fetchWeather is a name of a function which is assigned to an object named weather. */
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city
            + "&units=metric&appid=" + 
            this.apiKey 
        )
        .then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
        /*fetch function basically fetches the data from the server. */
        /*.json() takes input as a json and converts into
        Javascript object.The then function here will actually
        first take the input as a callback from the fetch
        function from the server and convert it to javascript object
        and log into the console.*/
    },
    displayWeather: function (data) {  
        const { name } = data; /*It copies name variable from data into a name variable here locally defined. */
        const { icon, description } = data.weather[0];  /*Because the first element of the data.weather is an array so
        take data.weather[0] */    
        const { temp, humidity } = data.main; /*copies into temp variable locally defined. */
        const { speed } = data.wind; /* copies into speed variable locally defined.*/
        console.log(name,icon,description,temp,humidity,speed);
        document.querySelector(".city").innerText = "Weather in " + name; /* document.querySelector gets the HTML element 
        whose class is city and .innerText actually returns or sets the text content of an element.*/
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"; /*Extracted from the 
        OpenWeathermap website adds the current fetched weather icon to it and displays the image.*/
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage =
          "url('https://source.unsplash.com/1600x900/?" + name + "')"; /*Displays the specific background Image based on the 
          location name.*/
    },

    search: function () {  /*Whenever something is typed in the search bar and when you click the search icon this 
    function is called.*/
        console.log(document.querySelector(".search-bar").value);
        this.fetchWeather(document.querySelector(".search-bar").value); /*.value extracts the text content whenever something is 
        written into the search bar.*/
    },
};

/*The below code is using the OPenCage GeoCoding API. */

let geocode = {
    reverseGeocode: function (latitude, longitude) {
      var apikey = "bea6ea5d9064446bacc016f496354660";
  
      var api_url = "https://api.opencagedata.com/geocode/v1/json";
  
      var request_url =
        api_url +
        "?" +
        "key=" +
        apikey +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";
  
      // see full list of required and optional parameters:
      // https://opencagedata.com/api#forward
  
      var request = new XMLHttpRequest();
      request.open("GET", request_url, true);
  
      request.onload = function () {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
  
        if (request.status == 200) {
          // Success!
          var data = JSON.parse(request.responseText);
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city)
        } else if (request.status <= 500) {
          // We reached our target server, but it returned an error
  
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log("error msg: " + data.status.message);
        } else {
          console.log("server error");
        }
      };
  
      request.onerror = function () {
        // There was a connection error of some sort
        console.log("unable to connect to server");
      };
  
      request.send(); // make the request
    },
    getLocation: function() {
      function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude); /*Converts the latitude and longitude
        parameters to City name, street. */
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else {
        weather.fetchWeather("Denver");
      }
    }
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });
  
  geocode.getLocation();