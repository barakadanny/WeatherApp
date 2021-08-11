'use strict';
const menuBtn = document.querySelector('.menu-bar');
const setting = document.querySelector('.settings');


const headerBar = document.querySelector('.header-bar');
const currentTime = document.querySelector('.current-time');
const searchBtn = document.querySelector('.search-btn');
const inputData = document.querySelector('.input-data');

const blueColor = document.querySelector(".blue");
const redColor = document.querySelector(".red");
const yellowColor = document.querySelector(".yellow");
const greenColor = document.querySelector(".green");
const TempId = document.querySelector("#temp-id");
const cityName = document.querySelector(".city-name");
const cityIcon = document.querySelector(".weather-icon");
const CurrentCityName = document.querySelector(".current-town");
const CurrentCityTime = document.querySelector(".current-town-time");
const TownDate = document.querySelector(".town-date");
const TownHumidity = document.querySelector(".town-humidity");

// variables
let latitude, longitude, query;
const metric='&units=metric'
const apiKey='&appid=abdd1f82a9fdc06feedefef68b5f4125'
const apiEndpoint ='https://api.openweathermap.org/data/2.5/weather?'

let theme = localStorage.getItem('theme');
if(theme == null){
    setMode("blue");
}else{
    setMode(theme);
}

// displaying the section
const menuDisplay=()=>{
    setting.classList.toggle('set-active');
    menuBtn.classList.toggle("close");
}

// colors selection
let btnMode = document.getElementsByClassName("modes");

for (let i = 0; btnMode.length > i ; i++) {
    btnMode[i].addEventListener('click',()=>{
        const mode = btnMode[i].dataset.mode;
        
        setMode(mode);

        menuDisplay();
    }) 
}
 function setMode(mode){
     if (mode == 'blue' ) {
         document.getElementById("theme-mode").href = '../styles.css'
         blueColor.classList.add("active");
         yellowColor.classList.remove("active");
         redColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'red' ) {
         document.getElementById("theme-mode").href = 'theme/red.css'
         redColor.classList.add("active");
         yellowColor.classList.remove("active");
         blueColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'yellow' ) {
         document.getElementById("theme-mode").href = 'theme/yellow.css'
         yellowColor.classList.add("active");
         blueColor.classList.remove("active");
         redColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'green' ) {
         document.getElementById("theme-mode").href = 'theme/green.css'
         greenColor.classList.add("active");
         yellowColor.classList.remove("active");
         redColor.classList.remove("active");
         blueColor.classList.remove("active");
     }
     localStorage.setItem('theme', mode);
 }

// on windows load get user's location weather info: navigator geolocation data(long|lat)
// - on window load
//  fetch request using openweather by geolocation data and we can get data about the location of the user

let date;
let dayName;
let time;
let day

window.onload = (event) => {
    getLocation()
    currentCityTime()
    date = new Date()
}

function currentCityTime(){
    date = new Date()
    dayName = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format();
    time=`${date.getHours()}:${date.getMinutes()}`
    day = `${date.getDate()}`            
    CurrentCityTime.innerText=time
    TownDate.innerText = `${day}, ${dayName} ${ time}`
}

let refreshRate = 60000
let count = 0

setInterval(() => {
    currentCityTime()
}, 60000);

function getLocation(){
    navigator.geolocation.getCurrentPosition((position)=>{
        longitude = position.coords.longitude
        latitude = position.coords.latitude
        query = `lat=${latitude}&lon=${longitude}`
        fetch(apiEndpoint+query+metric+apiKey)
        .then(response => response.json())
        .then(data => {
            const tempr =data.main.temp
            const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

            cityIcon.src = icon
            cityName.innerText = data.name
            CurrentCityName.innerText = data.name
            TempId.innerText = Math.floor(tempr)

            currentCityTime()
            TownHumidity.innerText= `Humidity: ${data.main.humidity}%`
            console.log(data)

        })
        }, (error)=>{
            console.log(`ERROR(${err.code}): ${err.message}`);
        }, {enableAccuracy:true, timeout:5000})
}



function search(){
    query = 'q='+inputData.value
    
    fetch(apiEndpoint+query+metric+apiKey)
    .then(response => response.json())
    .then(data => {
        const tempr =data.main.temp
        const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

        cityIcon.src = icon
        cityName.innerText = data.name
        TownHumidity.innerText= `Humidity: ${data.main.humidity}%`
        TempId.innerText = Math.floor(tempr)
        console.log(data)
    })

.catch(err => alert("wrong city name"))
}
searchBtn.addEventListener('click', function(){
    search()
})
document.addEventListener('keydown', function(event){
    if(event.key == "Enter"){
        if(!(inputData.value == null || inputData.value == "")){
            event.preventDefault();
            search()
        }else{
            alert('Please insert data')
        }
    }
})


// event handler
menuBtn.addEventListener('click', menuDisplay)