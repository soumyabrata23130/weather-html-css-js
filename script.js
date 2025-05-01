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

function todayDate() {
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
	const today = new Date()

	return `${weekdays[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`
}

function todayTime() {
	const today = new Date()

	let hours = today.getHours()
	if(today.getHours() > 12) {
		hours -= 12
	}
	else if(today.getHours() === 0) {
		hours = 12
	}

	let meridiem = "AM"
	if(today.getHours() > 12) {
		meridiem = "PM"
	}
	else if(today.getHours() === 12) {
		meridiem = "noon"
	}
	else if(today.getHours() === 0) {
		meridiem = "midnight"
	}

	return `${hours}:${today.getMinutes()} ${meridiem}`
}

function displayData() {
	document.getElementById("city-name").innerHTML = `${name}, ${country}`
	document.getElementById("today-date").innerHTML = `${todayDate()}`
	document.getElementById("today-time").innerHTML = `${todayTime()}`
	document.getElementById("icon").innerHTML = `<img src=${icon} />`
	document.getElementById("temp").innerHTML = `${temp}&nbsp;℃`
	document.getElementById("desc").innerHTML = `${description}`
	document.getElementById("feels").innerHTML = `Feels like ${temp_feel}&nbsp;℃`
	document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`
	document.getElementById("pressure").innerHTML = `Pressure: ${pressure} <abbr title="hectopascals">hPa</abbr>`
	document.getElementById("speed").innerHTML = `Wind speed: ${speed} m/s`
}

function getData(city) {
	const cities = {
		"birmingham": "Birmingham, GB", // change to the most popular Birmingham
		"melbourne": "Melbourne, AU", // change to the most popular Melbourne
		"rome": "Rome, IT", // change to the most popular Rome
	}
	if(cities[city.toLowerCase()] !== undefined) {
		city = cities[city.toLowerCase()]
	}

	capitalize(city)

	const source="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=643d74ed61652d0b3ac8bfe900c9b122"

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

			displayData()

		})
		.catch(error => console.error('Error fetching JSON:', error))
}

document.getElementById("get").addEventListener("click", () => {
	city=document.getElementById("input").value
	getImage(city)
	getData(city)
})
