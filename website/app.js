/* Global Variables */
const apikey = 'ffed4aa63204dd3d8fb822260953b11e';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const iconLink = 'http://openweathermap.org/img/wn/';
const iconSuffix = '@2x.png'

const cityInput = document.getElementById('zip-code');
const submitBtn = document.getElementById('submitForm');
const errorMsg = document.querySelector('.error-msg');
const feelingText = document.getElementById('feelings');

const cardImg = document.getElementById('weather-icon');
const cardDate = document.getElementById('date');
const cardLocation = document.getElementById('location');
const cardStatus = document.getElementById('status');
const cardTemp = document.getElementById('temp');
const cardFeelings = document.getElementById('content');
const infoMsg = document.getElementById('info-msg');
const weatherCard = document.getElementById('weather-card');
const allSearchSection = document.getElementById('all-search');
const baseUrl = 'http://localhost:8080';
let weatherData;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();

/**************************** Getting weather from openweathermap api */
const getWeather = async (url = '', zipcode, key) => {
    const response = await fetch(url + `zip=${zipcode}` + `&appid=${key}`);
    try {
        const data = await response.json();
        if (data.message && data.message == 'city not found') {
            weatherData = null;
            infoMsg.style.display = 'block';
            weatherCard.style.display = 'none';
            infoMsg.innerText = 'Please enter a valid city name'

        } else {
            infoMsg.style.display = 'none';
            weatherCard.style.display = 'flex';
            const feeling = feelingText.value ? feelingText.value : '';
            weatherData = {
                date: newDate,
                location: data.name,
                status: data.weather[0].main,
                temp: data.main.temp + ' °F',
                feelings: feeling,
                icon: iconLink + data.weather[0].icon + iconSuffix
            };
            console.log(weatherData);
        }
        return weatherData;
    } catch (error) {
        console.log(error);
    }
}

/******************************* Saving searched data on the server */
const saveData = async (url = '', data = {}) => {
    const response = await fetch(baseUrl + url, {
        method: 'POST',
        cridentials: 'same-orgin',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    });
    try {
        const serverRes = await response.body;
    } catch (error) {
        console.log(error);
    }
}

/*************************** Get all data from the server */
const getAllData = async (url = '') => {
    const response = await fetch(baseUrl + url);
    try {
        const allData = await response.json();
        return allData;
    } catch (error) {
        console.log(error);
    }
}

/**************************************** Updating card with the new info */
function updateWeatherCardUI(weatherData) {
    cardImg.setAttribute('src', weatherData.icon);
    cardDate.innerText = '';
    cardDate.insertAdjacentHTML('beforeend', `<strong>Search Date: </strong>${weatherData.date}`);
    cardLocation.innerText = '';
    cardLocation.insertAdjacentHTML('beforeend', `<strong>location: </strong>${weatherData.location}`);
    cardStatus.innerText = '';
    cardStatus.insertAdjacentHTML('beforeend', `<strong>Status: </strong>${weatherData.status}`);
    cardTemp.innerText = '';
    cardTemp.insertAdjacentHTML('beforeend', `<strong>Temperature: </strong>${weatherData.temp}`);
    cardFeelings.innerText = '';
    cardFeelings.insertAdjacentHTML('beforeend', `<strong>Feelings: </strong>${weatherData.feelings}`);

}

/*********************************  Adding previous searchs to the view */
function updateAllSearchUI(weatherData) {
    allSearchSection.innerText = '';
    for (let data of weatherData) {
        let card = `<div class="serach-card">
        <div class="info" ><strong>Date: </strong>${data.date}</div>
        <div class="info" ><strong>location: </strong>${data.location}</div>
        <div class="info" ><strong>Status: </strong>${data.status}</div>
        <div class="info" ><strong>Temperature: </strong>${data.temp}</div>
      </div>`
        allSearchSection.insertAdjacentHTML('afterbegin', card);
    }
}

/******************************** Updates the UI */
function updateUi(data) {
    updateWeatherCardUI(data[data.length - 1]);
    updateAllSearchUI(data);
}

/******************************** Adding on click event to the submit form */
submitBtn.addEventListener('click', () => {
    if (cityInput.value && cityInput.value != '') {
        getWeather(apiUrl, cityInput.value, apikey).then((data) => {
            if (data) {
                saveData('/saveSearch', data);
            }
        }).then(() => {
            return getAllData('/allSearch');
        }).then((data) => {
            updateUi(data);
        });
        errorMsg.style.display = 'none';
    } else {
        errorMsg.style.display = 'block';
    }
});


