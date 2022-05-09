const nameTrack = sessionStorage.getItem("idTrack");
var posTrack;
async function getPos(){
    posTrack = await posTrackInJSON(nameTrack);
}
getPos();

function getYears(data) {
    let year = data.datos_extra.years;
    let s = "";
    for (var i = 0; i < year.length; i++) {
        if (i == year.length - 1) {
            s += year[i];
        } else {
            s += year[i] + ", ";
        }
    }
    return s;
}

function getPilot(data, idPilot) {
    let pilot = data.participant;

    var plt = {
        id: null,
        name: null,
        lastName: null,
        alternateName: null,
        nationality: null,
        memberOf: null,
    };

    for (var i = 0; i < pilot.length; i++) {
        if (pilot[i].id == idPilot) {
            plt.id = pilot[i].id;
            plt.name = pilot[i].name;
            plt.lastName = pilot[i].lastName;
            plt.alternateName = pilot[i].alternateName;
            plt.nationality = pilot[i].nationality;
            plt.memberOf = pilot[i].memberOf;
            break;
        }
    }

    return plt;
}

function getClassification(data) {
    var classification = data.track[posTrack].datos_extra.classification;

    let pos = document.getElementById("secction-posiciones");
    let divParent = document.createElement("div");
    divParent.setAttribute("class", "posicion");
    if (classification.length > 0) {
        let ids = ["primero", "segundo", "tercero", "cuarto"];

        for (let i = 0; i < ids.length; i++) {
            let pilot = getPilot(data, classification[i][0]);

            let rowParent = document.createElement("div");
            rowParent.setAttribute("class", "row");
            rowParent.setAttribute("id", ids[i]);

            /* NAME */
            let colName = document.createElement("div");
            colName.setAttribute("class", "col sm-6");

            let cardBodyName = document.createElement("div");
            cardBodyName.setAttribute("class", "card-body");

            let p1 = document.createElement("p");
            p1.setAttribute("class", "card-text");
            p1.setAttribute("id", ids[i]);
            p1.innerHTML = `${pilot.name} ${pilot.lastName}`;

            cardBodyName.appendChild(p1);
            colName.appendChild(cardBodyName);
            rowParent.appendChild(colName);

            /* TIME */
            let colTime = document.createElement("div");
            colTime.setAttribute("class", "col sm-6");

            let cardBodyTime = document.createElement("div");
            cardBodyTime.setAttribute("class", "card-body");

            let p4 = document.createElement("p");
            p4.setAttribute("class", "card-text");
            p4.setAttribute("id", ids[i]);
            if (i > 0) {
                p4.innerHTML = `+${classification[i][1]}`;
            } else {
                p4.innerHTML = `${classification[i][1]}`;
            }

            cardBodyTime.appendChild(p4);
            colTime.appendChild(cardBodyTime);
            rowParent.appendChild(colTime);

            divParent.appendChild(rowParent);
        }
        pos.appendChild(divParent);
    } else {
        document.getElementById("secction-posiciones").remove();
    }
}

async function printTrackMainInfo(data) {
    let tracks = data.track;

    maps(tracks, posTrack);
    var idPilot = tracks[posTrack].datos_extra.lapRecord.pilot;
    var pilot = getPilot(data, idPilot);
    var years = getYears(tracks[posTrack]);

    let parentIcoFav = document.getElementById("col-ico-fav");
    let bt = document.createElement("button");

    let icon = document.createElement("i");
    icon.setAttribute("id", "ico-fav");
    let name = document.createElement("h10");
    name.setAttribute("id", "alterName-track");
    name.innerHTML = `${tracks[posTrack].alternateName}`;

    var tracksFav = [];
    tracksFav = JSON.parse(localStorage.getItem("favs"));
    icon.setAttribute("class", "bi bi-star");
    if (tracksFav != null) {
        if (tracksFav.includes(nameTrack)) {
            icon.setAttribute("class", "bi bi-star-fill");
        }
    }

    icon.setAttribute("onclick", "trackfav()");

    bt.appendChild(icon);
    parentIcoFav.appendChild(bt);
    parentIcoFav.appendChild(name);

    document.getElementById(
        "img-track"
    ).src = `assets/img/tracks/${tracks[posTrack].image[0]}`;
    document.getElementById("img-track").alt = tracks[posTrack].image[0];
    document.getElementById("name-track").innerHTML = `${tracks[posTrack].name}`;
    document.getElementById(
        "location-track"
    ).innerHTML = `${tracks[posTrack].GeoCoordinates.addressCountry}`;
    document.getElementById(
        "distance-track"
    ).innerHTML = `${tracks[posTrack].datos_extra.trackDistance} km`;
    document.getElementById(
        "laps-track"
    ).innerHTML = `${tracks[posTrack].datos_extra.numberLaps}`;
    document.getElementById("years-track").innerHTML = `${years}`;
    document.getElementById(
        "record-time-track"
    ).innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;

    let img = document.createElement("img");
    img.setAttribute("class", "img-fluid rounded");
    img.setAttribute("alt", "Flag Country");
    img.src = "assets/img/flags/" + pilot.nationality + ".svg";

    let detailLapRecord = document.createElement("div");
    detailLapRecord.setAttribute("class", "detail-info-content");
    detailLapRecord.innerHTML = `${pilot.name} ${pilot.lastName} (${tracks[posTrack].datos_extra.lapRecord.year})`;

    let lapRecord = document.getElementById("pilot-record-track");
    lapRecord.appendChild(img);
    lapRecord.appendChild(detailLapRecord);

    document.getElementById(
        "record-time-track"
    ).innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;
    document.getElementById(
        "description-track"
    ).innerHTML = `${tracks[posTrack].description}`;

    getClassification(data, posTrack);
    videosTrack(tracks, posTrack);
    tiempoAPIDia(tracks, posTrack);
    tiempoAPIForecast(tracks, posTrack);
}

function sessionVarWhenClickNav(save) {
    sessionStorage.setItem("navClicked", save);
    location.href = "index.html";
}

function createMenuCircuitsTrack(year) {
    let index = document.getElementById("years");
    indexYear = currentDate().getFullYear() - year;
    index.innerHTML = ``;
    for (let i = 1; i < year + 1; i++) {
        let li = document.createElement("li");
        li.setAttribute("id", "years");
        li.setAttribute("title", indexYear + i);

        let button = document.createElement("button");
        button.addEventListener("click", () =>
            sessionVarWhenClickNav(indexYear + i)
        );

        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = indexYear + i;

        button.appendChild(a);
        li.appendChild(button);
        index.appendChild(li);
    }

    document
        .getElementById("bt-az")
        .addEventListener("click", () => sessionVarWhenClickNav("name"));
    document
        .getElementById("bt-favs")
        .addEventListener("click", () => sessionVarWhenClickNav("favs"));
}

window.addEventListener("load", initTrack);
async function initTrack() {
    let data = await fetchJSON();
    printTrackMainInfo(data);
    createMenuCircuitsTrack(4, data);

    playAudio();
    let jsonpelis = await fetchJSONExterno();
    //let jsonvideojuegos = await fetchJSONExterno();
    console.log(jsonpelis);
    //extraerinfoJSON(jsonpelis,jsonvideojuegos);
}

//API MAPS
function maps(listacirc, num) {
    let coor = listacirc[num].GeoCoordinates;
    let long = coor.longitude;
    let lat = coor.latitude;
    const bounds = [
        [lat, long], // [west, south]
        [lat, long], // [east, north]
    ];
    var map = L.map("map2").setView([lat, long], 14);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution: `${listacirc[num].GeoCoordinates.addressCountry},${listacirc[num].GeoCoordinates.addressLocality}`,
            maxZoom: 18,
            minZoom: 5,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
                "pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA",
        }
    ).addTo(map);
    map.setMaxBounds(bounds);

    var marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup(
        `<b>${listacirc[num].name}</b><br>${listacirc[num].alternateName}`
    );
}

function removeItemArray(array, item) {
    let pos;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            pos = i;
            break;
        }
    }
    array[pos] = array[array.length - 1];
    array.pop();
    return array;
}

function trackfav() {
    let tracksFav = [];
    tracksFav = JSON.parse(localStorage.getItem("favs"));
    let icon = document.getElementById("ico-fav");

    if (tracksFav != null) {
        if (tracksFav.includes(nameTrack)) {
            /*Esta*/
            tracksFav = removeItemArray(tracksFav, nameTrack);
            icon.className = "bi bi-star";
        } else {
            /*No esta*/
            tracksFav.push(nameTrack);
            icon.className = "bi bi-star-fill";
        }
    } else {
        /*Vacio*/
        tracksFav = [nameTrack];
        icon.className = "bi bi-star-fill";
    }

    localStorage.setItem("favs", JSON.stringify(tracksFav));
}

function videosTrack(data, i) {
    let title = document.getElementById("video-title");
    let iframes = document.getElementById("iframe-video");

    let carousel = document.createElement("div");
    carousel.setAttribute("class", "carousel slide");
    carousel.setAttribute("id", "carouselExampleInterval");
    carousel.setAttribute("data-bs-ride", "carousel");
    let carouselInner = document.createElement("div");
    carouselInner.setAttribute("class", "carousel-inner");

    carousel.appendChild(carouselInner);

    if (!data[i].video[1]) {
        title.innerHTML = `Video`;
        let carouselItem = document.createElement("div");
        carouselItem.setAttribute("class", "carousel-item active");
        carouselItem.setAttribute("data-bs-interval", "10000");
        carouselItem.innerHTML=`<iframe id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe>`;
        carouselInner.appendChild(carouselItem);
    } else {
        title.innerHTML = `Videos`;
        //Add primer item (active)
        let carouselItemActive = document.createElement("div");
        carouselItemActive.setAttribute("class", "carousel-item active");
        carouselItemActive.setAttribute("data-bs-interval", "5000");
        carouselItemActive.innerHTML=`<iframe id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe>`;
        carouselInner.appendChild(carouselItemActive);

        //Add un item
        let carouselItem = document.createElement("div");
        carouselItem.setAttribute("class", "carousel-item");
        carouselItem.setAttribute("data-bs-interval", "5000");
        carouselItem.innerHTML=`<iframe id="video-track" src="${data[i].video[1]}" frameborder="0" allowfullscreen controls=2 ></iframe>`;
        carouselInner.appendChild(carouselItem);

        //Boton izquierdo
        let btPrev = document.createElement("button");
        btPrev.setAttribute("class","carousel-control-prev");
        btPrev.setAttribute("type","button");
        btPrev.setAttribute("data-bs-target","#carouselExampleInterval");
        btPrev.setAttribute("data-bs-slide","prev");
        let spanControlPrev = document.createElement("span");
        spanControlPrev.setAttribute("class","carousel-control-prev-icon");
        spanControlPrev.setAttribute("aria-hidden","true");
        btPrev.appendChild(spanControlPrev);
        let visuallyPrev = document.createElement("span");
        visuallyPrev.setAttribute("class","visually-hidden");
        visuallyPrev.innerHTML="Previous";
        btPrev.appendChild(visuallyPrev);
        carousel.appendChild(btPrev);

        //Boton derecho
        let btNext = document.createElement("button");
        btNext.setAttribute("class","carousel-control-next");
        btNext.setAttribute("type","button");
        btNext.setAttribute("data-bs-target","#carouselExampleInterval");
        btNext.setAttribute("data-bs-slide","next");
        let spanControlNext = document.createElement("span");
        spanControlNext.setAttribute("class","carousel-control-next-icon");
        spanControlNext.setAttribute("aria-hidden","true");
        btNext.appendChild(spanControlNext);
        let visuallyNext = document.createElement("span");
        visuallyNext.setAttribute("class","visually-hidden");
        visuallyNext.innerHTML="Next";
        btNext.appendChild(visuallyNext);
        carousel.appendChild(btNext);

    }
    //Add cousel en el nodo padre
    iframes.appendChild(carousel);

    /*  if (data[i].video[1] == null) {
         document.getElementById("video-title").innerHTML = `Video
         <button style="visibility:hidden; onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>`;
     } else {
         document.getElementById("video-title").innerHTML = ` Video <button class="button2" onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>
             <button class="button1" onclick="document.getElementById('video-track').src = '${data[i].video[1]}'">Highlights</button>`;
     }
     document.getElementById("iframe-video").innerHTML = `<iframe id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe>`; */
}

function tiempoAPIForecast(track, i) {
    var URL1 =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        track[i].GeoCoordinates.latitude +
        "&lon=" +
        track[i].GeoCoordinates.longitude +
        "&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es";
    fetch(URL1)
        .then((response) => response.json())
        .then((data) => {
            var forecast = processTiempoForecast(data);
            showTiempoForecast(forecast);
        });
}

function tiempoAPIDia(track, i) {
    var URL2 =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        track[i].GeoCoordinates.latitude +
        "&lon=" +
        track[i].GeoCoordinates.longitude +
        "&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es";
    fetch(URL2)
        .then((response) => response.json())
        .then((data) => {
            var dia = processTiempoDia(data);
            showTiempoToday(dia);
        });
}

function currentDate() {
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth();
    let cYear = currentDate.getFullYear();
    let cHour = currentDate.getHours();
    let cMinute = currentDate.getMinutes();
    let cSecond = currentDate.getSeconds();

    return new Date(cYear, cMonth, cDay, cHour, cMinute, cSecond);
}

function tiempoDia(values) {

    var day = {
        date: values[0].date,
        temp: null,
        feels_like: values[0].main.feels_like,
        temp_min: parseInt(values[0].main.temp_min),
        temp_max: parseInt(values[0].main.temp_max),
        humidity: values[0].main.humidity,
        pressure: values[0].main.pressure,
        description: values[0].weather.description,
        wind: values[0].wind.speed,
        icon: values[0].weather.icon,
    };

    for (var i = 1; i < values.length; i++) {
        if (parseFloat(day.temp_min) > parseFloat(values[i].main.temp_min)) {
            day.temp_min = parseInt(values[i].main.temp_min);
        }
        if (parseFloat(day.temp_max) < parseFloat(values[i].main.temp_max)) {
            day.temp_max = parseInt(values[i].main.temp_max);
        }
    }

    return day;
}

function processTiempoForecast(data) {
    let forecast5days = [];
    let forecastDay = [];

    var day = new Date(currentDate()).getDate();
    var dateDay = day + 1;

    for (var i = 0; i < data.list.length; i++) {
        var dateForecast = new Date(data.list[i].dt_txt);

        if (dateForecast.getDate() != day) {
            var storedDay = dateForecast.getDate();
            var storedMonth = dateForecast.getMonth();
            var infoForecast = {
                main: data.list[i].main,
                weather: data.list[i].weather[0],
                wind: data.list[i].wind,
                date: parseDate(storedMonth, storedDay),
            };

            if (dateForecast.getDate() != dateDay) {
                forecast5days.push(tiempoDia(forecastDay));
                forecastDay.length = 0;
                dateDay = dateForecast.getDate();

            }

            forecastDay.push(infoForecast);
        }
    }

    return forecast5days;
}
function processTiempoDia(data) {
    const str = data.weather[0].description;
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);

    var today = {
        temp: data.main.temp,
        feels_like: parseInt(data.main.feels_like),
        temp_min: parseInt(data.main.temp_min),
        temp_max: parseInt(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: str2,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
    };
    return today;
}

function showTiempoToday(data) {
    document.getElementById(
        "TiempoHoyImg"
    ).src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.getElementById("TiempoHoyImg").alt = null;
    document.getElementById("TiempoHoyDesc").innerHTML = `${data.description}`;
    document.getElementById("TiempoHoyMax").innerHTML = `${data.temp_max} ºC`;
    document.getElementById("TiempoHoyMin").innerHTML = `${data.temp_min} ºC`;
    document.getElementById("TiempoHoyHumidity").innerHTML = `${data.humidity}%`;
    document.getElementById("TiempoHoyFeel").innerHTML = `${data.feels_like} ºC`;
    document.getElementById("TiempoHoyWind").innerHTML = `${data.wind} km/h`;
    document.getElementById("TiempoHoyPressure").innerHTML = `${data.pressure}
      hPa`;
}

function showTiempoForecast(data) {
    let forecast = document.getElementById("TiempoForecast");
    for (var i = 0; i < data.length; i++) {
        let dayForecast = document.createElement("div");
        dayForecast.setAttribute("class", "col-md-3 text-center");
        dayForecast.setAttribute("id", "tiempoForecast");
        dayForecast.innerHTML = `${data[i].date} 
        <img src="http://openweathermap.org/img/wn/${data[i].icon}@2x.png"></img>
        <div class="row-cols-md-auto text-center max">
            ${data[i].temp_max}
        </div>
        <div class="row-cols-md-auto text-center min">
        ${data[i].temp_min}
        </div>`;

        forecast.appendChild(dayForecast);
    }
}

function parseDate(month, day) {
    var months = [
        "ENE",
        "FEB",
        "MAR",
        "ABR",
        "MAY",
        "JUN",
        "JUL",
        "AGO",
        "SEP",
        "OCT",
        "NOV",
        "DIC",
    ];

    return (fecha = day.toString() + " " + months[month]);
}

function F1DriverStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    fetch("http://ergast.com/api/f1/2022/driverStandings.json", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
}

function F1ConstructorStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    fetch("http://ergast.com/api/f1/current/driverStandings", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
}

function extraerinfoJSON(datapelis, datajuegos){
    for (var i = 0; i < datapelis.length; i++) {
        for (var j = 0; j < datapelis.genre.length; j++) {
            if(datapelis[i].genre[j] === "F1"){
                
            }
        }
    }

    for (var i = 0; i < datajuegos.length; i++) {
        /*for (var j = 0; j < datajuegoss.genre.length; j++) {
            if(datajuegos[i].genre[j] === "F1"){
                
            }
        }*/
    }
}
