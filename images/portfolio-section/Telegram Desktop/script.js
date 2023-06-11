let select = document.querySelector('.form-select');

const cities =  {
    565348 : "Донецьк",
    688533 : "Ялта",
    706483 : "Харків",
    706448 : "Херсон"
  }

  for (key in cities) {
 select.innerHTML += `<option value="${key}">${cities[key]}</option>`;
}

const param = {
	"url" : "https://api.openweathermap.org/data/2.5/",
	"appid" : "2bd6d55d386ab955cc650082bc66345f"
}


function getWeather() {
    const cityId = document.querySelector('.form-select').value;
    console.log(cityId);
    fetch(`${param.url}weather?id=${cityId}&units=metric&APPID=${param.appid}`)
	.then(weather => {
			return weather.json();
		}).then(showWeather);
}
document.querySelector('.form-select').onchange = getWeather;

function showWeather(data) {
    console.log(data);
    document.querySelector('.package-name').textContent = data.name;
    document.querySelector('.price').innerHTML = 'температура повітря: ' +  Math.round(data.main.temp) + '&deg;'+'C';
    document.querySelector('.disclaimer').textContent = data.weather[0]['description'];
    document.querySelector('.wind').textContent = 'швидкість вітру: '+ data.wind.speed + ' м\сек';
    document.querySelector('.humidity').textContent = 'вологість повітря: '+ data.main.humidity + ' %';
    document.querySelector('.pressure').textContent = 'тиск: '+ data.main.pressure + ' мм';
    document.querySelector('.features li').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;
	
}
