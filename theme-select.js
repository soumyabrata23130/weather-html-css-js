document.getElementsByName("theme").forEach((radio) => {
	radio.addEventListener("change", () => {
		theme = radio.value
		console.log("Theme: " + theme)

		switch(theme) {
			case "dark": // if theme is dark, select dark theme
				document.querySelector("html").style.cssText = `
					color-scheme: dark;
					--background: linear-gradient(to bottom, black, #0B0B3B, #1C1C3A);
					--button: darkgreen;
					--foreground: #ededed;
				`
				break
			case "light": // if theme is light, select light theme
				document.querySelector("html").style.cssText = `
					color-scheme: light;
					--background: linear-gradient(to bottom, #87CEEB, #ADD8E6, white);
					--button: lightgreen;
					--foreground: black;"
				`
				break
			default: // otherwise, select system default
				document.querySelector("html").style.cssText = ""
		}
	})
})