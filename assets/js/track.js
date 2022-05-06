const nameTrack = sessionStorage.getItem('idTrack');
const posTrack = sessionStorage.getItem('posTrack');

function getYears(data) {
    var year = data.datos_extra.years;
    var s = "";
    for (var i = 0; i < year.length; i++) {
        if (i == year.length - 1) {
            s += year[i];
        } else {
            s += year[i] + " ,";
        }
    }
    return s;
}

function sessionVarWhenClickNav(save) {
    sessionStorage.setItem('navClicked', save);
    location.href = "index.html";
}

function getPilot(data, idPilot) {

    let pilot = data.participant;

    var plt = {
        id: null,
        name: null,
        lastName: null,
        alternateName: null,
        nationality: null,
        memberOf: null
    }

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

            cardBodyName.appendChild(p1)
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
            if(i>0){
                p4.innerHTML = `+${classification[i][1]}`;
            }else{
                p4.innerHTML = `${classification[i][1]}`;
            }
            

            cardBodyTime.appendChild(p4);
            colTime.appendChild(cardBodyTime);
            rowParent.appendChild(colTime);

            divParent.appendChild(rowParent);
        }
        pos.appendChild(divParent);
    } else {
        let text = document.createElement("p");
        text.setAttribute("class", "title-body");
        text.innerHTML = "Actualmente, no hay dados  debido a todavía no se ha disputado este gran premio.";
        pos.appendChild(text);
    }

}

async function printTrackMainInfo(data) {
    let tracks = data.track;

    maps(tracks, posTrack);
    var idPilot = tracks[posTrack].datos_extra.lapRecord.pilot;
    var pilot = getPilot(data, idPilot)
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

    document.getElementById('img-track').src = `assets/img/tracks/${tracks[posTrack].image[0]}`;
    document.getElementById('img-track').alt = tracks[posTrack].image[0];
    document.getElementById('name-track').innerHTML = `${tracks[posTrack].name}`;
    document.getElementById('location-track').innerHTML = `${tracks[posTrack].GeoCoordinates.addressCountry}`;
    document.getElementById('distance-track').innerHTML = `${tracks[posTrack].datos_extra.trackDistance} km`;
    document.getElementById('laps-track').innerHTML = `${tracks[posTrack].datos_extra.numberLaps}`;
    document.getElementById('years-track').innerHTML = `${years}`;
    document.getElementById('record-time-track').innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;

    let img = document.createElement("img");
    img.setAttribute("class", "img-fluid rounded");
    img.setAttribute("alt", "Flag Country");
    img.src = "assets/img/flags/" + pilot.nationality + ".svg";

    let detailLapRecord = document.createElement("div");
    detailLapRecord.setAttribute("class", "detail-info-content");
    detailLapRecord.innerHTML = `${pilot.name} ${pilot.lastName}`;

    let lapRecord = document.getElementById("pilot-record-track");
    lapRecord.appendChild(img);
    lapRecord.appendChild(detailLapRecord);

    document.getElementById('record-time-track').innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;
    document.getElementById('description-track').innerHTML = `${tracks[posTrack].description}`;

    getClassification(data, posTrack);
    videosTrack(tracks, posTrack);
    tiempo(tracks, posTrack);
}

function createMenuCircuitsTrack(year) {
    let index = document.getElementById("years");
    indexYear = currentDate().getFullYear() - year;
    index.innerHTML = ``;
    for (let i = 1; i < (year + 1); i++) {
        let li = document.createElement("li");
        li.setAttribute("id", "years");
        li.setAttribute("title", indexYear + i);

        let button = document.createElement("button");
        button.addEventListener("click", () => sessionVarWhenClickNav(indexYear + i));

        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = indexYear + i;

        button.appendChild(a);
        li.appendChild(button);
        index.appendChild(li);
    }

    document.getElementById("bt-az").addEventListener("click", () => sessionVarWhenClickNav("name"));
    document.getElementById("bt-favs").addEventListener("click", () => sessionVarWhenClickNav("favs"));
}

window.addEventListener('load', initTrack)
async function initTrack() {
    let data = await fetchJSON();
    printTrackMainInfo(data);
    createMenuCircuitsTrack(3, data);
    playAudio();
}

//API MAPS
function maps(listacirc, num) {
    let coor = listacirc[num].GeoCoordinates;
    let long = coor.longitude;
    let lat = coor.latitude;
    const bounds = [
        [lat, long], // [west, south]
        [lat, long]  // [east, north]
    ];
    var map = L.map('map2').setView([lat, long], 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: `${listacirc[num].GeoCoordinates.addressCountry},${listacirc[num].GeoCoordinates.addressLocality}`,
        maxZoom: 18,
        minZoom: 5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA'
    }).addTo(map);
    map.setMaxBounds(bounds);


    var marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup(`<b>${listacirc[num].name}</b><br>${listacirc[num].alternateName}`);
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
            console.log("esta");
            tracksFav = removeItemArray(tracksFav, nameTrack);
            icon.className = "bi bi-star";

        } else {
            console.log("no esta");
            tracksFav.push(nameTrack);
            icon.className = "bi bi-star-fill";
        }
    } else {
        console.log("vacio");
        tracksFav = [nameTrack];
        icon.className = "bi bi-star-fill";
    }

    localStorage.setItem("favs", JSON.stringify(tracksFav));
    console.log(tracksFav)
}

function videosTrack(data, i) {

    if (data[i].video[1] == null) {
        document.getElementById('video-title').innerHTML = `Video
        <button style="visibility:hidden; onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>`;


    } else {
        document.getElementById('video-title').innerHTML =
            ` Video <button class="button2" onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>
            <button class="button1" onclick="document.getElementById('video-track').src = '${data[i].video[1]}'">Highlight</button>`;
    }
    document.getElementById('iframe-video').innerHTML =
        `<iframe id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe>`;

}

function tiempo(track, i) {
    var URL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + track[i].GeoCoordinates.latitude + "&lon=" + track[i].GeoCoordinates.longitude + "&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es";
    fetch(URL)
        .then(response => response.json())
        .then(data => processTiempo(data)
        );
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

function tiempoDia(values, n) {

    var day = {
        date: values[0].date,
        temp: null,
        feels_like: values[0].main.feels_like,
        temp_min: values[0].main.temp_min,
        temp_max: values[0].main.temp_max,
        humidity: values[0].main.humidity,
        pressure: values[0].main.pressure,
        description: values[0].weather.description,
        wind: values[0].wind.speed,
        icon: values[0].weather.icon
    }

    if (n == 0) {
        day.temp = values[0].main.temp;
    }

    for (var i = 1; i < values.length; i++) {

        if (parseFloat(day.temp_min) > parseFloat(values[i].main.temp_min)) {

            day.temp_min = values[i].main.temp_min;
        }
        if (parseFloat(day.temp_max) < parseFloat(values[i].main.temp_max)) {

            day.temp_max = values[i].main.temp_max;
        }
    }

    return day;
}

function processTiempo(data) {

    console.log(data);

    let forecast5days = [];
    let forecastDay = [];

    var day = new Date(data.list[0].dt_txt).getDate();
    var n = 0;

    for (var i = 0; i < data.list.length; i++) {

        var infoForecast = {
            main: null,
            weather: null,
            wind: null,
            date: null
        }

        var dateForecast = new Date(data.list[i].dt_txt);

        if (dateForecast.getDate() != day) {
            console.log(forecastDay);
            forecast5days.push(tiempoDia(forecastDay, n));
            forecastDay.length = 0;
            day = dateForecast.getDate();
            console.log(n)
            n++;

        } else {

            infoForecast.main = data.list[i].main;
            infoForecast.weather = data.list[i].weather[0];
            infoForecast.wind = data.list[i].wind;
            infoForecast.date = data.list[i].dt_txt;
            forecastDay.push(infoForecast);
        }

    }
    console.log(forecast5days);
    return forecast5days;
}