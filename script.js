const apiKey = "643d74ed61652d0b3ac8bfe900c9b122" // API key

function capitalize(str) {
	str = str[0].toUpperCase() + str.slice(1)
	for(let i = 0; i < str.length; i++) {
		if(str[i] === " ") {
			str = str.slice(0, i+1) + str[i+1].toUpperCase() + str.slice(i+2)
		}
	}
	console.log("City: " + str)
	return str
}

function today() {
	const today = new Date()

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	const weekdays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]

	let hours = today.getHours()
	if(today.getHours() > 12) {
		hours -= 12
	}
	else if(today.getHours() === 0) {
		hours = 12
	}

	let meridiem = "AM", minutes = String(today.getMinutes())

	if(today.getMinutes() < 10) {
		minutes = "0" + minutes
	}

	if(today.getHours() >= 12 && minutes !== "00") {
		meridiem = "PM"
	}
	else if(today.getHours() === 12 && minutes === "00") {
		meridiem = "noon"
	}
	else if(today.getHours() === 0 && minutes === "00") {
		meridiem = "midnight"
	}

	return `${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]}, ${hours}:${minutes} ${meridiem}`
}

async function fetchAQI(lat, lon) {

	const source = "https://api.openweathermap.org/data/2.5/air_pollution?lat="+lat+"&lon="+lon+"&appid="+apiKey
	
	return fetch(source)
		.then(response => response.json())
		.then(data => {
			return data
		})
		.catch(error => console.error('Error fetching JSON:', error))
}

function displayData(weather, aqi) {
	document.getElementById("loading").style.display = "none" // stop loading GIF

	icon = "https://openweathermap.org/img/wn/"+weather.weather[0].icon+"@2x.png" // icon
	temp = (Math.round(weather.main.temp*100)-27315)/100 // temperature
	temp_feel = (Math.round(weather.main.feels_like*100)-27315)/100 // real feel
	let aqi_desc

	switch(aqi.list[0].main.aqi) {
		case 1:
			aqi_desc = "Good"
			break
		case 2:
			aqi_desc = "Fair"
			break
		case 3:
			aqi_desc = "Moderate"
			break
		case 4:
			aqi_desc = "Poor"
			break
		case 5:
			aqi_desc = "Very Poor"
			break
		default:
			aqi_desc = "Unknown"
	}
	// display at console
	console.log("Today: " + today())
	console.log("Icon URL: " + icon)
	console.log("Temperature: " + temp + " ℃")
	console.log("Description: " + weather.weather[0].main)
	console.log("Feels like: " + temp + " ℃")
	console.log("Air quality: " + aqi_desc)
	console.log("Humidity: " + weather.main.humidity + "%")
	console.log("Pressure: " + weather.main.pressure + " hPa")
	console.log("Wind speed: " + weather.wind.speed + " m/s")

	// display at web page
	document.getElementById("city-name").innerHTML = `${weather.name}, ${weather.sys.country}`
	document.getElementById("today").innerHTML = `${today()}`
	document.getElementById("icon").innerHTML = `<img src=${icon} width=100 />`
	document.getElementById("temp").innerHTML = `${temp}&nbsp;℃`
	document.getElementById("desc").innerHTML = `${weather.weather[0].main}`
	document.getElementById("feels").innerHTML = `Feels like ${temp_feel}&nbsp;℃`
	document.getElementById("aqi").innerHTML = `Air quality: ${aqi_desc}`
	document.getElementById("humidity").innerHTML = `Humidity: ${weather.main.humidity}%`
	document.getElementById("pressure").innerHTML = `Pressure: ${weather.main.pressure} <abbr title="hectopascals">hPa</abbr>`
	document.getElementById("speed").innerHTML = `Wind speed: ${weather.wind.speed} m/s`
}

function clearData() {
	document.getElementById("input-error").innerHTML = ""
	document.getElementById("output-error").innerHTML = ""
	document.getElementById("city-name").innerHTML = ""
	document.getElementById("today").innerHTML = ""
	document.getElementById("icon").innerHTML = ""
	document.getElementById("temp").innerHTML = ""
	document.getElementById("desc").innerHTML = ""
	document.getElementById("feels").innerHTML = ""
	document.getElementById("aqi").innerHTML = ""
	document.getElementById("humidity").innerHTML = ""
	document.getElementById("pressure").innerHTML = ""
	document.getElementById("speed").innerHTML = ""
}

async function fetchWeather(city) {
	document.getElementById("loading").style.display = "block" // loading GIF to show till data are loaded
	const cities = {
		"adisaptagram": "Magra, IN", // for Adisaptagram
		"bandel": "Chunchura, IN", // for Bandel
		"bansberia": "Bansbaria, IN", // for Bansberia
		"behala": "Kolkata, IN", // for Behala
		"birmingham": "Birmingham, GB", // change to the most popular Birmingham
		"chinsurah": "Chunchura, IN", // for Chinsurah
		"jadavpur": "Kolkata, IN", // for Jadavpur
		"magra": "Magra, IN", // for Magra
		"melbourne": "Melbourne, AU", // change to the most popular Melbourne
		"mogra": "Magra, IN", // for Mogra
		"rome": "Rome, IT", // change to the most popular Rome
		"saptagram": "Magra, IN", // for Saptagram
	}
	if(cities[city.toLowerCase()] !== undefined) {
		city = cities[city.toLowerCase()]
	}

	capitalize(city)

	const source = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey

	return fetch(source)
		.then(response => response.json())
		.then(weather => {
			fetchAQI(weather.coord.lat, weather.coord.lon).then(aqi => {
				displayData(weather, aqi)
			})
			localStorage.setItem("city", `${weather.name}, ${weather.sys.country}`)
		})
		.catch(error => {
			document.getElementById("loading").style.display = "none" // stop loading GIF
			document.getElementById("output-error").innerHTML = "City not found!"
			console.error('Error fetching JSON:', error)
		})
}

// default call
let default_city = "Kolkata"
if(localStorage.getItem("city")) {
	default_city = localStorage.getItem("city")
}
fetchWeather(default_city).then(weather => {
	fetchAQI(weather.coord.lat, weather.coord.lon).then(aqi => {
		displayData(weather, aqi)
	})
})

// called by "Get Weather"
document.getElementById("weather-card").addEventListener("submit", (event)=>{
	event.preventDefault()

	let city=document.getElementById("input").value
	if(city === "") {
		console.log("Please enter a city!")
		document.getElementById("input-error").innerHTML = "Please enter a city!"
	}
	else {
		clearData()
		fetchWeather(city)
	}
})