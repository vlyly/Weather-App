const api_key = "8fb4059bc67bab8fc8eb575b23460ee6";
const wrapper = document.getElementById("wrapper");
const city = document.getElementById("city");
const weather_icon = document.getElementById("weather_icon");
const weather_description = document.getElementById("weather_description");
const current_temperature = document.getElementById("current_temperature");
const max_temperature = document.getElementById("max_temperature");
const min_temperature = document.getElementById("min_temperature");
const feels_like_temperature = document.getElementById(
  "feels_like_temperature"
);
const humidity = document.getElementById("humidity");
const cloud = document.getElementById("cloud");
const wind_speed = document.getElementById("wind_speed");
const forecast_list = document.getElementById("forecast_list");

function getCurrentWeather(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
  )
    .then(function (response) {
      return response.json(); //response 스트림을 가져와 완료될 때 까지 읽고 문자열을 JSON으로 바꾸는 결과로 해결되는 promise를 반환합니다
    })
    .catch((error) => {
      alert("🤢\nSorry, Something's wrong... ");
    })
    .then(function (json) {
      const weather_icon_code = json.weather[0].icon;
      const weather_description_data = json.weather[0].description;
      const current_temperature_data = Math.floor(json.main.temp);
      const temperature_min_data = json.main.temp_min;
      const temperature_max_data = json.main.temp_max;
      const temperature_feels_like_data = Math.floor(json.main.feels_like);
      const humidity_data = json.main.humidity;
      const cloud_data = json.clouds.all;
      const wind_speed_data = json.wind.speed;

      wrapper.classList.add(`bg-${weather_icon_code}`);
      humidity.innerText = humidity_data;
      cloud.innerText = cloud_data;
      wind_speed.innerText = wind_speed_data;
      current_temperature.innerText = current_temperature_data;
      current_temperature.ariaLabel = current_temperature_data + " Celsicus";
      max_temperature.innerText = Math.floor(temperature_max_data);
      min_temperature.innerText = Math.floor(temperature_min_data);
      feels_like_temperature.innerText = Math.floor(
        temperature_feels_like_data
      );
      weather_description.innerText = weather_description_data;
      weather_icon.src = `icon/${weather_icon_code}.png`;
    }); // 상위 함수의 동작이 끝나면(response.json()이 반환되면) 그 값에서 온도와 장소 정보를 가져와 화면에 출력합니다
}

function getWeatherForecast(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
  )
    .then(function (response) {
      return response.json(); //response 스트림을 가져와 완료될 때 까지 읽고 문자열을 JSON으로 바꾸는 결과로 해결되는 promise를 반환합니다
    })
    .then(function (json) {
      const doc = window.document;

      for (let i = 0; i < 17; i++) {
        var date = new Date(json.list[i].dt * 1000);
        var hour = date.getHours();
        var forecast_weather_icon_code = json.list[i].weather[0].icon;
        var forecast_weather_main_data = json.list[i].weather[0].main;
        var forecast_temperature_data = Math.floor(json.list[i].main.temp_max);

        var forecast_list_item = doc.createElement("li");
        forecast_list_item.classList.add("forecast_list_item");
        var forecast_list_item_hour = doc.createElement("h5");
        forecast_list_item_hour.classList.add("forecast_list_item_hour");
        forecast_list_item_hour.innerText = `${hour}시`;
        var forecast_list_item_icon = doc.createElement("img");
        forecast_list_item_icon.classList.add("forecast_list_item_icon");
        forecast_list_item_icon.src = `icon/${forecast_weather_icon_code}.png`;
        var forecast_list_item_weather_main = doc.createElement("span");
        forecast_list_item_weather_main.classList.add(
          "forecast_list_item_weather_main"
        );
        forecast_list_item_weather_main.innerText = forecast_weather_main_data;
        var forecast_list_item_temperature = doc.createElement("strong");
        forecast_list_item_temperature.classList.add(
          "forecast_list_item_temperature"
        );
        forecast_list_item_temperature.innerHTML = `${forecast_temperature_data}<span aria-label="Celsius">℃</span>`;

        forecast_list.appendChild(forecast_list_item);
        if (date.getHours() === 0) {
          const forecast_list_item_date_data = date.getDate();
          const forecast_list_item_date = doc.createElement("span");
          forecast_list_item_date.classList.add("forecast_list_item_date");
          forecast_list_item_date.innerText = `${forecast_list_item_date_data}일`;
          forecast_list_item.appendChild(forecast_list_item_date);
        } //24시라면 위에 날짜를 함께 표시해줍니다.
        forecast_list_item.appendChild(forecast_list_item_hour);
        forecast_list_item.appendChild(forecast_list_item_icon);
        forecast_list_item.appendChild(forecast_list_item_weather_main);
        forecast_list_item.appendChild(forecast_list_item_temperature);
      } // element가 많다면 innerHTML이 속도가 더 빠릅니다.
    });
}

function handleGeoSucces(position) {
  var geocoder = new kakao.maps.services.Geocoder();
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  let usersLocation = "";

  function convertAddress(result) {
    usersLocation = `${result[0].address.region_2depth_name} ${result[0].address.region_3depth_name}`;
    city.innerText = usersLocation;
  }
  geocoder.coord2Address(longitude, latitude, convertAddress); //사용자의 현재 위치 정보(위도, 경도)값을 주소로 변환합니다.
  getCurrentWeather(latitude, longitude);
  getWeatherForecast(latitude, longitude); //사용자의 현재 위치 정보값을 이용해 현재 날씨 정보를 가져옵니다.
}

function handleGeoError() {
  city.innerText = "동작구 신대방2동";
  getCurrentWeather(37.493745854773294, 126.9167404694577);
  getWeatherForecast(37.493745854773294, 126.9167404694577);
  //사용자가 위치 정보 제공을 거부할 경우 기상청의 위치 정보를 기반으로 날씨 정보를 제공합니다.
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
} //브라우저의 현재 정보 중 위치 정보를 가지고 옵니다. 단, 보안상의 문제로 브라우저가 위치 정보에 접근을 시도하면 사용자의 의사를 묻습니다.

function detectDevice() {
  if (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    forecast_list.classList.add("custom_scrollbar");
  }
}

askForCoords();
detectDevice();
