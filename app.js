'use strict';
const menuBtn = document.querySelector('.menu-bar');
const setting = document.querySelector('.settings');
const main = document.querySelector(".main");
const navigation = document.querySelector(".navigation");
const nav = document.querySelectorAll(".nav");

const headerBar = document.querySelector(".header-bar");
const currentTime = document.querySelector(".current-time");
const searchBtn = document.querySelector(".search-btn");
const inputData = document.querySelector(".input-data");

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

// auto complete selections
const autoCompleteGround = document.querySelector(".auto-complete-ground");
const autoCompleteItem = document.querySelector(".auto-complete-item");
const searchSection = document.querySelector(".search-section");

// variables
let latitude, longitude, query;

// parameters
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
    main.classList.toggle('set-black');
    setting.classList.toggle('set-active');
    menuBtn.classList.toggle("close");
}

// event handler
menuBtn.addEventListener('click', menuDisplay)

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

let date,dayName,time,day;

const cardSelection = document.querySelector(".cards")
const cardContent = document.querySelector(".cards-content")
const cardFavorite = document.querySelector(".cards-favorite")

function createCard(tempr, icon, recentItem){
    //create div for the card
    const divContainer = document.createElement("div");
    divContainer.classList.add("card");
    //create div for left side
    const divLeftSide = document.createElement("div");
    divLeftSide.classList.add("card-city");

    const cardCityName = document.createElement("div");
    cardCityName.classList.add("card-city-name");

    const city_name = document.createElement("h1");
    city_name.classList.add("name");
    //add city gotten from the API
    city_name.innerText = recentItem.Location

    const city_time = document.createElement("h2");
    city_time.classList.add("time");
    city_time.innerText = "17 : 12"
    cardCityName.appendChild(city_name)
    cardCityName.appendChild(city_time)

    const cardCityDate = document.createElement("div");
    cardCityDate.classList.add("date");

    cardCityDate.innerText = "Monday, 23"
    divLeftSide.appendChild(cardCityName)
    divLeftSide.appendChild(cardCityDate)
    divContainer.appendChild(divLeftSide)


    //create div for middle side
    const divMiddleSide = document.createElement("div");
    divMiddleSide.classList.add("card-temp");
    
    const temp_name = document.createElement("h2");
    temp_name.classList.add("temp_name");
        //add temperature gotten from the API
    temp_name.innerHTML = `${tempr} &deg;C`
    divMiddleSide.appendChild(temp_name)

    const temp_icon = document.createElement("span");
    temp_icon.classList.add("temp_icon");

    const temp_image = document.createElement("img");
    //add image gotten from the API
    temp_image.src=icon
    temp_icon.appendChild(temp_image)


    divMiddleSide.appendChild(temp_icon)
    divContainer.appendChild(divMiddleSide)
    //create div fo the right side
    const divRightSide = document.createElement("div");
    divRightSide.classList.add("card-buttons");
    const i_star = document.createElement("i");
    i_star.classList.add("fa")
    i_star.classList.add("fa-star-o");

    let clicked = false
    i_star.onclick=(e)=>{
        let recents = JSON.parse(localStorage.getItem("recent"))
        let list2 = []
        recents.forEach(recent => {
            if(recent.Location == city_name.innerText){
                let result = recent
                recents.forEach(other => {
                    if(other != result){
                        list2.push(other)
                    }
                });
                
                if(clicked == false){
                    result.favorite = true
                    clicked = true
                }else{
                    result.favorite = false
                    clicked=false
                }
                
                list2.push(result)
            }
        })
        localStorage.setItem("recent", JSON.stringify(list2))
    }

    const i_trash = document.createElement("i");
    i_trash.classList.add("fa")
    i_trash.classList.add("fa-trash-o");
    i_trash.onclick=(e)=>{
        console.log(e)
    }

    divRightSide.appendChild(i_star)
    divRightSide.appendChild(i_trash)
    divContainer.appendChild(divRightSide)

    // let toDisplay

    // if(recent){
    //     cardContent
    //     toDisplay = cardContent
    // }elseif(favorite){
    //     cardFavorite
    //     toDisplay = cardFavorite
    // }

    cardSelection.appendChild(divContainer)
    
}

window.onload = (e) => {
    getLocation()
    displayRecents()
    currentCityTime()
    date = new Date()
}

function currentCityTime(){
    date = new Date()
    dayName = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format();
    let hours = date.getHours()
    let minutes = date.getMinutes()
    time=`${hours<10?'0'+hours:hours} : ${minutes<10?'0'+minutes:minutes}`
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
        }, (err)=>{
            console.log(`ERROR(${err.code}): ${err.message}`);
        }, {enableAccuracy:true, timeout:5000})
}
// search variables
let queriedFromSearch, recentsList = JSON.parse(localStorage.getItem("recent")) || [], recentModel;

function search(){
    query = 'q='+inputData.value
    // recentsList=[]
    fetch(apiEndpoint+query+metric+apiKey)
    .then(response => response.json())
    .then(data => {
        const tempr =data.main.temp
        const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

        cityIcon.src = icon
        queriedFromSearch = data.name
        cityName.innerText = queriedFromSearch
        TownHumidity.innerText= `Humidity: ${data.main.humidity}%`
        TempId.innerText = Math.floor(tempr)

        recentModel = {
            Location:queriedFromSearch,
            favorite:false
        }

        recentsList.push(recentModel)
        localStorage.setItem("recent", JSON.stringify(recentsList))
        displayRecents()
    }).catch(err => alert(err));
    
    inputData.value = ""    // clear input box
}

function displayRecents(){
    recentsList.forEach(recentItem =>{
        // console.log(recentItem.Location)
        query = 'q='+recentItem.Location

        fetch(apiEndpoint+query+metric+apiKey)
        .then(response => response.json())
        .then(data =>{
            let tempr = Math.floor(data.main.temp) 
            const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

            createCard(tempr, icon, recentItem)
            

        }).catch(err=> alert(err))
    })
}


searchBtn.addEventListener('click', function(event){
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

function checkFavorite(){
    let list = JSON.parse(localStorage.getItem("recent"))
    list.forEach((listItem)=>{
        if(listItem.favorite == true){
            console.log("are true", listItem.Location)
        }else{
            console.log("are false", listItem.Location)
        }
    })
}

// navigation section
function changeTab(event){
    const activeTab = document.querySelectorAll(".active")
    activeTab.forEach((e)=>{
        e.className = e.className.replace("active","")
    })
   event.target.className = "active"
}
navigation.addEventListener("click", changeTab, false)

// create a class with hidden property that will be assigned to cards favorites by default.
// append all the cards to cards-content div by default
// fetch through the local host and assign all the favorite:true to cards favorites div
// when click to favorite
// add the class hidden to cards content
// and add a class display block to cards favorite, for it to finally display 

// Models

// "recent":[{location1Name:string, favorite:boolean:false}, {location2:string, favorite:boolean:false},...]
// "favorites":[{location1Name:string, favorite:boolean:true}, {location1Name:string, favorite:boolean:true},...]
// "suggestion":[{location1Name:string, favorite:boolean}, {location1Name:string, favorite:boolean},...]

// Auto complete feature function
inputData.onkeyup =(e)=>{
    let inData=e.target.value;
    let emptyArray = [];
    if(inData){
        emptyArray = countries.filter((data)=>{
            return data.toLocaleLowerCase().startsWith(inData.toLocaleLowerCase());
        })
        // console.log(emptyArray)
        emptyArray = emptyArray.map((data)=>{
            return data='<li>'+ data +'</li>'
        })
        // console.log(emptyArray)
        autoCompleteGround.classList.add('auto-active')
        showCountries(emptyArray)

        let allList = autoCompleteGround.querySelectorAll('li')
        for (let i = 0; i < allList.length; i++) {
            // const element  = array[i];
            allList[i].setAttribute("onclick", "select(this)")
        }

    }else{
        autoCompleteGround.classList.remove('auto-active')
    }
}
function select(element){
    let selectedData = element.textContent
    // console.log(selectedData)
    inputData.value = selectedData
    autoCompleteGround.classList.remove('auto-active')
}

function showCountries(list){
    let listData;
    if(!list.length){
       let inData = inputData.value
        listData = '<li>'+ inData + '</li>'
    }else{
        listData=list.join('')
    }
    autoCompleteGround.innerHTML = listData
}

// contries object
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla",
"Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan",
"Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda",
"Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei",
"Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands",
"Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica",
"Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica",
"Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia",
"Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies",
"Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala",
"Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India",
"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan",
"Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
"Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi",
"Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia",
"Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro",
"Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria",
"North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru",
"Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda",
"Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal",
"Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
"South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent",
"Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
"Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu",
"Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan",
"Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];