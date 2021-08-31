const iconElement = document.querySelector("#weather-icon")
const tempElement = document.querySelector("#real-temparature")
const realFeel = document.getElementById("real-feel")
const descElement = document.querySelector("#weather-description")
const windSpeed = document.getElementById("wind-speed")
const locationElement = document.querySelector("#location-text")
const notificationElement = document.querySelector(".notification")
const inputField = document.getElementById("input-field")
const seachButton = document.getElementById("search-btn")

// App data
const weather = {}
weather.temparature = {
    unit: "celsius"
} 

// Kelvin
const kelvin = 273.15
// API Key 
const  apiKey = "7255ad266228739913da83e85246b7df"
// City Name
let cityName = ""

// Check if the browser supports geolocation
if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p>Browser doesn't support Geolocation</p>`
}

// Set users position
function setPosition(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude

    getWeatherOnLocation(latitude, longitude)
}

// Show error is there is any
function showError(error) {
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p>${error.message}</p>`
}

// Get weather from API
const getWeatherOnLocation = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

    try {
        const res = await fetch(url)
        const data = await res.json()
    
        weather.temparature.value = Math.floor(data.main.temp - kelvin)
        weather.temparature.feelsLike = Math.floor(data.main.feels_like - kelvin)
        weather.windSpeed = data.wind.speed * 3.6
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.Country = data.sys.country

        displayWeather()
    } catch(error) {
        notificationElement.style.display = "block"
        notificationElement.innerHTML = `<p>${error.message}</p>`
    }

}

const displayWeather = () => {
    iconElement.src = `images/${weather.iconId}.png`
    tempElement.textContent = `${weather.temparature.value}°C`
    realFeel.textContent = `${weather.temparature.feelsLike}`
    descElement.textContent = weather.description
    windSpeed.textContent = `${weather.windSpeed}km/h`
    locationElement.textContent = `${weather.city}, ${weather.Country}`
}

// Setting weather data based on search
const getWeatherBySearch = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

    try {
        const res = await fetch(url)
        const data = await res.json()

        weather.temparature.value = Math.floor(data.main.temp - kelvin)
        weather.temparature.feelsLike = Math.floor(data.main.feels_like - kelvin)
        weather.windSpeed = data.wind.speed
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.Country = data.sys.country

        displayWeather()
    } catch (error) {
        notificationElement.style.display = "block"
        notificationElement.innerHTML = `<p>${error}</p>`
    }

    
}

// Search button click event
seachButton.addEventListener("click", function(e) {
    let inputValue = inputField.value
    inputValue = inputValue.trim()

    if(inputValue.length > 0) {
        cityName = inputValue
        getWeatherBySearch()
        inputField.value = ""
        notificationElement.style.display = "none"
        notificationElement.innerHTML = ``
    } else {
        notificationElement.style.display = "block"
        notificationElement.innerHTML = `<p>Please enter a valid input</p>`
    }
})

// Keyboard enter event 
window.addEventListener("keyup", function(e) {
    if(e.key === "Enter") {
        let inputValue = inputField.value
        inputValue = inputValue.trim()

        if(inputValue.length > 0) {
            cityName = inputValue
            getWeatherBySearch()
            inputField.value = ""
            notificationElement.style.display = "none"
            notificationElement.innerHTML = ``
        } else {
            notificationElement.style.display = "block"
            notificationElement.innerHTML = `<p>Please enter a valid input</p>`
        }
    }
})
