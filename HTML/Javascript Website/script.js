// CLASSLIST
//CALLBACK HELL
// Promises
//Async Makes a function to return a promise
// AWAIT Makes a function to wait for a promise

//returns a promise

// REDO JSON BRO
//https://pokeapi.co/api/v2/pokemon/pikachu

// Fetching data from an API

//fetchData();

/*async function fetchData() {
  try {
    const pokemonn_name = document
      .getElementById("fetch_name")
      .value.toLowerCase();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonn_name}`
    );

    if (!response.ok) {
      throw new Error("Could not find the resource!");
    }

    const data = await response.json();
    const pokemon_sprite = data.sprites.front_default;

    document.getElementById("pokemon_img").src = pokemon_sprite;
  } catch (error) {
    console.error(error);
  }
}
*/

/*const formWeather = document.querySelector(".weatherform");
const city_input = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const API_KEY = "5eefea69045c9741d6f6a5197e84f1b2";

formWeather.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = city_input.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);

      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city!");
  }
});

async function getWeatherData(city) {
  const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  const response = await fetch(api_url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data!");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";

  card.style.display = "block";

  const cityH1 = document.createElement("h1");
  const degreesH = document.createElement("h2");
  const humadity_ = document.createElement("p");
  const skyDisplay = document.createElement("p");
  const emojiDisplay = document.createElement("p");

  cityH1.textContent = city;
  degreesH.textContent = `${Math.floor(temp - 273.15)}°C`;
  humadity_.textContent = `Humidity: ${humidity}%`;
  skyDisplay.textContent = description;
  emojiDisplay.textContent = getWeatherEmoji(id);

  cityH1.classList.add("cityHeading");
  degreesH.classList.add("degreesHeading");
  humadity_.classList.add("displayHumadity");
  skyDisplay.classList.add("displaySky");
  emojiDisplay.classList.add("displayEmoji");

  card.appendChild(cityH1);
  card.appendChild(degreesH);
  card.appendChild(humadity_);
  card.appendChild(skyDisplay);
  card.appendChild(emojiDisplay);
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId <= 232) {
    return "⚡";
  } else if (weatherId >= 300 && weatherId <= 321) {
    return "🌧️";
  } else if (weatherId >= 500 && weatherId <= 521) {
    return "🌧️";
  } else if (weatherId >= 600 && weatherId <= 622) {
    return " ❄️";
  } else if (weatherId >= 701 && weatherId <= 781) {
    return "🌪️";
  } else if (weatherId === 800) {
    return "☁";
  } else if (weatherId == 801 && weatherId == 804) {
    return "☁️";
  }
}

function displayError(msg) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = msg;
  card.textContent = "";
  card.style.display = "block";
  card.appendChild(errorDisplay);
}
*/
//arrow function (parameter) =>

//

//https://api.unsplash.com/search/photos?page=1&query=office
