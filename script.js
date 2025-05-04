function toCommonsLink(image) {
	for(let i = 0; i < image.length; i++) {
		image = image.replace(" ", "_")
	}
	const hash = CryptoJS.MD5(image).toString(CryptoJS.enc.Hex)
	const url = "https://upload.wikimedia.org/wikipedia/commons/"+hash[0]+"/"+hash[0]+hash[1]+"/"+image

	console.log("URL: " + url)

	return url
}

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

function displayData() {
	document.getElementById("city-name").innerHTML = `${name}, ${country}`
	document.getElementById("today").innerHTML = `${today()}`
	document.getElementById("icon").innerHTML = `<img src=${icon} />`
	document.getElementById("temp").innerHTML = `${temp}&nbsp;℃`
	document.getElementById("desc").innerHTML = `${description}`
	document.getElementById("feels").innerHTML = `Feels like ${temp_feel}&nbsp;℃`
	document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`
	document.getElementById("pressure").innerHTML = `Pressure: ${pressure} <abbr class="no-underline" title="hectopascals">hPa</abbr>`
	document.getElementById("speed").innerHTML = `Wind speed: ${speed} m/s`
}

function getData(city) {
	document.getElementById("loading").style.display = "block" // loading GIF to show till data are loaded
	const cities = {
		"birmingham": "Birmingham, GB", // change to the most popular Birmingham
		"melbourne": "Melbourne, AU", // change to the most popular Melbourne
		"rome": "Rome, IT", // change to the most popular Rome
	}
	if(cities[city.toLowerCase()] !== undefined) {
		city = cities[city.toLowerCase()]
	}

	capitalize(city)

	const source="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=643d74ed61652d0b3ac8bfe900c9b122"

	fetch(source)
		.then(response => response.json())
		.then(data => {
			country=data.sys.country // country
			description=data.weather[0].main // description
			icon=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` // icon
			humidity=data.main.humidity // humidity
			pressure=data.main.pressure // pressure
			name=data.name // name
			speed=data.wind.speed // wind speed
			temp=(Math.round(data.main.temp*100)-27315)/100 // temperature
			temp_feel=(Math.round(data.main.feels_like*100)-27315)/100 // real feel

			document.getElementById("loading").style.display = "none" // stop loading GIF
			displayData()
		})
		.catch(error => console.error('Error fetching JSON:', error))
}

document.getElementById("get").addEventListener("click", () => {
	let city=document.getElementById("input").value
	if(city === "") {
		console.log("Please enter a city!")
		document.getElementById("error").innerHTML = "Please enter a city!"
	}
	else {
		document.getElementById("error").innerHTML = ""
		getData(city)
	}
})
