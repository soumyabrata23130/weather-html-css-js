document.getElementById("get").addEventListener("click", ()=>{
	city=document.getElementById("input").value
	const source="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=643d74ed61652d0b3ac8bfe900c9b122"

	fetch(source)
		.then(response => response.json())
		.then(data => {
			country=data.sys.country // country
			description=data.weather[0].description // description
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
			date=`${weekdays[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`

			document.getElementById("output").innerHTML=`
				<h2>${city}, ${country}</h2>
				<p>${date}</p>
				<table>
					<tr>
						<td id="icon"><img src=${icon} /></td>
						<td id="temp">${temp}<sup>℃</sup></td>
					</tr>
				</table>
				<p>Feels like ${temp_feel}℃. ${description.charAt(0).toUpperCase() + description.slice(1)}.</p>
				<p>Humidity: ${humidity}%</p>
				<p>Pressure: ${pressure} <abbr title="hectopascals">hPa</abbr></p>
				<p>Wind speed: ${speed} m/s</p>
			`
		})
		.catch(error => console.error('Error fetching JSON:', error))
})