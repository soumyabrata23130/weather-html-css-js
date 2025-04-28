function toCommonsLink(image) {
	for(let i = 0; i < image.length; i++) {
		image = image.replace(" ", "_")
	}
	const hash = CryptoJS.MD5(image).toString(CryptoJS.enc.Hex)
	const url = "https://upload.wikimedia.org/wikipedia/commons/"+hash[0]+"/"+hash[0]+hash[1]+"/"+image
	console.log(url)
	return url
}

function capitalize(str) {
	str = str[0].toUpperCase() + str.slice(1)
	for(let i = 0; i < str.length; i++) {
		if(str[i] === " ") {
			str = str.slice(0, i+1) + str[i+1].toUpperCase() + str.slice(i+2)
		}
	}
	return str
}

function getImage(city) {
	let item = "Q515"
	city = city.toLowerCase()
	const cities = {
		"beijing": "Q956",
		"bengaluru": "Q1355",
		"cairo": "Q85",
		"chennai": "Q1352",
		"delhi": "Q1353",
		"dubai": "Q612",
		"hyderabad": "Q1361",
		"jakarta": "Q3630",
		"kolkata": "Q1348",
		"london": "Q84",
		"los Angeles": "Q65",
		"manila": "Q1461",
		"melbourne": "Q949779",
		"moscow": "Q649",
		"mumbai": "Q1156",
		"mew York": "Q60",
		"paris": "Q90",
		"st. petersburg": "Q656",
		"shanghai": "Q8686",
		"sydney": "Q3130",
		"tokyo": "Q1490",
		"toronto": "Q172",
	}
	if(cities[city] !== undefined) {
		item = cities[city]
	}

	const source="https://www.wikidata.org/wiki/Special:EntityData/"+item+".json"

	fetch(source)
		.then(response => response.json())
		.then(data => {
			if(data.entities[item].claims.P4291 === undefined && data.entities[item].claims.P948 === undefined) {
				image = data.entities[item].claims.P18[0].mainsnak.datavalue.value
			}
			else if(data.entities[item].claims.P4291 === undefined) {
				image = data.entities[item].claims.P948[0].mainsnak.datavalue.value
			}
			else {
				image = data.entities[item].claims.P4291[0].mainsnak.datavalue.value
			}
			const image_url = toCommonsLink(image)
			document.getElementById("image").innerHTML = `<img src=${image_url} width=220 />`
		})
		.catch(error => console.error('Error fetching JSON:', error))
}

function getWeatherData(city) {
	const source="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=643d74ed61652d0b3ac8bfe900c9b122"

	fetch(source)
		.then(response => response.json())
		.then(data => {
			country=data.sys.country // country
			description=data.weather[0].main // description
			icon=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` // icon
			humidity=data.main.humidity // humidity
			pressure=data.main.pressure // pressure
			speed=data.wind.speed // wind speed
			temp=(Math.round(data.main.temp*100)-27315)/100 // temperature
			temp_feel=(Math.round(data.main.feels_like*100)-27315)/100 // feels like

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
			date=`${weekdays[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${hours}:${today.getMinutes()} ${meridiem}`

			document.getElementById("output").innerHTML=`
				<div id="image"></div>
				<h2>${capitalize(city)}, ${country}</h2>
				<p>${date}</p>
				<div class="icon"><img src=${icon} /></div>
				<div class="temp-box">
					<p class="temp">${temp}℃</p>
					<p class="desc">${description}</p>
				</div>
				<p>Feels like ${temp_feel}℃</p>
				<p>Humidity: ${humidity}%</p>
				<p>Pressure: ${pressure} <abbr title="hectopascals">hPa</abbr></p>
				<p>Wind speed: ${speed} m/s</p>
			`

			getImage(city)
		})
		.catch(error => console.error('Error fetching JSON:', error))
}

// when document loads
document.getElementById("output").addEventListener("load", getWeatherData("Kolkata"))

// when you press "get data"
document.getElementById("get").addEventListener("click", () => {
	city=document.getElementById("input").value
	getWeatherData(city)
})